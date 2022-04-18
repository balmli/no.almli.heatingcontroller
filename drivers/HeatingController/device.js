'use strict';

const Homey = require('homey');
const moment = require('../../lib/moment-timezone-with-data');
const pricesLib = require('../../lib/prices');
const nordpool = require('../../lib/nordpool');
const heating = require('../../lib/heating');

module.exports = class HeatingControllerDevice extends Homey.Device {

  async onInit() {
    await this.migrate();
    await this.fixPrice(this.getSetting('currency'));
    this._at_home = undefined;
    this._home_override = undefined;
    this._home_on_next_period = false;
    this._ho_off_next_period = false;

    this._lastFetchData = undefined;
    this._lastPrice = undefined;
    this._prices = undefined;

    this.registerCapabilityListener('onoff', async (value, opts) => {
      if (value) {
        await this.homey.flow.getDeviceTriggerCard('home_was_set_on').trigger(this, {}).catch(this.error);
      } else {
        await this.homey.flow.getDeviceTriggerCard('home_was_set_off').trigger(this, {}).catch(this.error);
      }
      this.log(this.getName() + ' -> onoff changed: ', value, opts);
      return this.checkTime({ onoff: value });
    });

    this.scheduleCheckTime(5);
    this.log(this.getName() + ' -> device initialized');
  }

  async migrate() {
    try {
      if (!this.hasCapability('price_ratio')) {
        await this.addCapability('price_ratio');
      }
      this.log(this.getName() + ' -> migrated OK');
    } catch (err) {
      this.error(err);
    }
  }

  async fixPrice(selectedCurrency) {
    try {
      if (this.hasCapability('price')) {
        await this.removeCapability('price');
      }
      for (let currency of ['DKK', 'EUR', 'NOK', 'SEK']) {
        if (currency !== selectedCurrency &&
          this.hasCapability(`price_${currency}`)) {
          await this.removeCapability(`price_${currency}`);
        }
      }
      if (!this.hasCapability(`price_${selectedCurrency}`)) {
        await this.addCapability(`price_${selectedCurrency}`);
      }
    } catch (err) {
      this.error(err);
    }
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    if (changedKeys.includes('currency')) {
      await this.fixPrice(newSettings.currency);
      this._lastFetchData = undefined;
      this._lastPrice = undefined;
      this.scheduleCheckTime(5);
    }
  }

  async onActionSetAtHomeOn() {
    await this.setCapabilityValue('onoff', true).catch(this.error);
    await this.homey.flow.getDeviceTriggerCard('home_was_set_on').trigger(this, {}).catch(this.error);
    return this.checkTime({ onoff: true });
  }

  async onActionSetAtHomeOff() {
    this._home_on_next_period = false;
    await this.setCapabilityValue('onoff', false).catch(this.error);
    await this.homey.flow.getDeviceTriggerCard('home_was_set_off').trigger(this, {}).catch(this.error);
    return this.checkTime({ onoff: false });
  }

  async onActionSetAtHomeOffAuto() {
    this._home_on_next_period = true;
    await this.setCapabilityValue('onoff', false).catch(this.error);
    await this.homey.flow.getDeviceTriggerCard('home_was_set_off').trigger(this, {}).catch(this.error);
    return this.checkTime({ onoff: false });
  }

  async onActionSetHomeOverrideOn() {
    this._ho_off_next_period = false;
    await this.setCapabilityValue('home_override', true).catch(this.error);
    await this.homey.flow.getDeviceTriggerCard('homeoverride_set_on').trigger(this, {}).catch(this.error);
    return this.checkTime({ home_override: true});
  }

  async onActionSetHomeOverrideOnAuto() {
    this._ho_off_next_period = true;
    await this.setCapabilityValue('home_override', true).catch(this.error);
    await this.homey.flow.getDeviceTriggerCard('homeoverride_set_on').trigger(this, {}).catch(this.error);
    return this.checkTime({ home_override: true});
  }

  async onActionSetHomeOverrideOff() {
    await this.setCapabilityValue('home_override', false).catch(this.error);
    await this.homey.flow.getDeviceTriggerCard('home_override_set_off').trigger(this, {}).catch(this.error);
    return this.checkTime({ home_override: false});
  }

  async onActionSetHolidayToday() {
    await this.setSettings({ holiday_today: args.holiday }).catch(this.error);
    return this.checkTime();
  }

  onAdded() {
    this.log(this.getName() + ' -> device added', this.getData().id);
  }

  onDeleted() {
    this._deleted = true;
    this.clearCheckTime();
    this.log(this.getName() + ' -> device deleted');
  }

  clearCheckTime() {
    if (this.curTimeout) {
      this.homey.clearTimeout(this.curTimeout);
      this.curTimeout = undefined;
    }
  }

  scheduleCheckTime(seconds = 60) {
    if (this._deleted) {
      return;
    }
    this.clearCheckTime();
    this.log(`Checking time in ${seconds} seconds`);
    this.curTimeout = this.homey.setTimeout(this.checkTime.bind(this), seconds * 1000);
  }

  async checkTime(props = {}) {
    const onoff = props.onoff;
    const home_override = props.home_override;
    if (this._deleted) {
      return;
    }
    try {
      this.log('Checking: ', this.getData().id);
      this.clearCheckTime();

      if (onoff === false || onoff === true) {
        this._at_home = onoff;
      } else {
        this._at_home = this.getCapabilityValue('onoff');
      }
      if (this._at_home === undefined || this._at_home === null) {
        this._at_home = true;
        await this.setCapabilityValue('onoff', this._at_home).catch(this.error);
      }

      if (home_override === false || home_override === true) {
        this._home_override = home_override;
      } else {
        this._home_override = this.getCapabilityValue('home_override');
      }
      if (this._home_override === undefined || this._home_override === null) {
        this._home_override = false;
        await this.setCapabilityValue('home_override', this._home_override).catch(this.error);
      }

      if (this.shallFetchData()) {
        await this.fetchData();
      }
      if (this._prices) {
        await this.onData();
      }
    } catch (err) {
      this.error(err);
    } finally {
      this.scheduleCheckTime();
    }
  }

  async fetchData() {
    try {
      const settings = this.getSettings();
      const priceArea = settings.priceArea || 'Oslo';
      const currency = settings.currency || 'EUR';
      this.log('Will fetch prices:', this.getData().id, priceArea, currency);
      const localTime = moment().startOf('day');
      const prices = await nordpool.fetchPrices(localTime, { priceArea, currency });
      this._lastFetchData = moment();
      this._prices = prices;
      this.log('Got prices:', this.getData().id, prices.length);
    } catch (err) {
      this.error(err);
    }
  }

  shallFetchData() {
    return !this._prices
      || !this._lastFetchData
      || pricesLib.toHour(this._lastFetchData) !== pricesLib.toHour(moment());
  }

  async onData() {
    try {
      const localTime = moment();
      const heatingOptions = this._getHeatingOptions();
      let calcHeating = heating.calcHeating(localTime, this._at_home, this._home_override, heatingOptions);
      this.log('Heating:', calcHeating);

      const curNight = this.getCapabilityValue('night');
      let nightChanged = false;
      if (curNight === undefined || curNight === null || calcHeating.night !== curNight) {
        nightChanged = true;
        await this.setCapabilityValue('night', calcHeating.night).catch(this.error);
      }

      const curAtWork = this.getCapabilityValue('at_work');
      let atWorkChanged = false;
      if (curAtWork === undefined || curAtWork === null || calcHeating.atWork !== curAtWork) {
        atWorkChanged = true;
        await this.setCapabilityValue('at_work', calcHeating.atWork).catch(this.error);
      }

      if (nightChanged || atWorkChanged) {
        let recalcHeating = false;
        if (this._home_on_next_period) {
          recalcHeating = true;
          this._home_on_next_period = false;
          this._at_home = true;
          await this.setCapabilityValue('onoff', true).catch(this.error);
          await this.homey.flow.getDeviceTriggerCard('home_was_set_on').trigger(this, {}).catch(this.error);
          this.log('Automatically set home mode');
        }
        if (this._ho_off_next_period) {
          recalcHeating = true;
          this._ho_off_next_period = false;
          this._home_override = false;
          await this.setCapabilityValue('home_override', false).catch(this.error);
          await this.homey.flow.getDeviceTriggerCard('home_override_set_off').trigger(this, {}).catch(this.error);
          this.log('Automatically set home override off');
        }
        if (recalcHeating) {
          calcHeating = heating.calcHeating(localTime, this._at_home, this._home_override, heatingOptions);
          this.log('Heating recalculated:', calcHeating);
        }
      }

      const curHeating = this.getCapabilityValue('heating');
      const heatChanged = curHeating === undefined || curHeating === null || calcHeating.heating !== curHeating;
      if (heatChanged) {
        await this.setCapabilityValue('heating', calcHeating.heating).catch(this.error);
      }

      const currentPrice = pricesLib.currentPrice(this._prices, localTime);
      const startAtHour = currentPrice ? pricesLib.toHour(currentPrice.startsAt) : undefined;
      const priceRatio = pricesLib.priceRatio(this._prices, localTime);
      const price = currentPrice ? currentPrice.price : undefined;
      let priceChanged = false;

      if (currentPrice) {
        this.log('Current price:', startAtHour, price);

        priceChanged = !this._lastPrice || startAtHour !== pricesLib.toHour(this._lastPrice.startsAt);
        if (priceChanged) {
          this._lastPrice = currentPrice;
          const priceCapability = `price_${this.getSetting('currency')}`;
          if (this.hasCapability(priceCapability)) {
            await this.setCapabilityValue(priceCapability, price).catch(this.error);
          }
          if (priceRatio !== undefined && this.hasCapability('price_ratio')) {
            await this.setCapabilityValue('price_ratio', priceRatio).catch(this.error);
          }
        }
      }

      if (nightChanged) {
        if (calcHeating.night) {
          await this.homey.flow.getDeviceTriggerCard('night_starts').trigger(this, {}).catch(this.error);
          this.log('Night starts trigger');
        } else {
          await this.homey.flow.getDeviceTriggerCard('night_ends').trigger(this, {}).catch(this.error);
          this.log('Night ends trigger');
        }
      }

      if (atWorkChanged) {
        if (calcHeating.atWork) {
          await this.homey.flow.getDeviceTriggerCard('at_work_starts').trigger(this, {}).catch(this.error);
          this.log('At work starts trigger');
        } else {
          await this.homey.flow.getDeviceTriggerCard('at_work_ends').trigger(this, {}).catch(this.error);
          this.log('At work ends trigger');
        }
      }

      if (heatChanged) {
        if (calcHeating.heating) {
          await this.homey.flow.getDeviceTriggerCard('comfort_mode').trigger(this, {}).catch(this.error);
          this.log('Comfort mode trigger');
        } else {
          await this.homey.flow.getDeviceTriggerCard('eco_mode').trigger(this, {}).catch(this.error);
          this.log('ECO mode trigger');
        }
      }

      if (priceChanged) {
        await this.homey.flow.getDeviceTriggerCard('price_changed').trigger(this, {
          price,
          heating: calcHeating.heating,
          priceRatio
        }).catch(this.error);
        this.log('Price changed trigger', startAtHour, price, priceRatio);
      }

      if (priceChanged || heatChanged) {
        await this.homey.flow.getDeviceTriggerCard('high_x_hours_of_day').trigger(this, {
          heating: calcHeating.heating,
          high_price: true
        }, {
          atHome: this._at_home,
          homeOverride: this._home_override,
          high_price: true,
          heatingOptions: heatingOptions
        }).catch(this.error);

        await this.homey.flow.getDeviceTriggerCard('high_x_hours_of_day').trigger(this, {
          heating: calcHeating.heating,
          high_price: false
        }, {
          atHome: this._at_home,
          homeOverride: this._home_override,
          high_price: false,
          heatingOptions: heatingOptions
        }).catch(this.error);

        await this.homey.flow.getDeviceTriggerCard('low_x_hours_of_day').trigger(this, {
          heating: calcHeating.heating,
          low_price: true
        }, {
          low_price: true
        }).catch(this.error);

        await this.homey.flow.getDeviceTriggerCard('low_x_hours_of_day').trigger(this, {
          heating: calcHeating.heating,
          low_price: false
        }, {
          low_price: false
        }).catch(this.error);
      }
    } catch (err) {
      this.error(err);
    }
  }

  async _heatingOffHighPriceComparer(args, state) {
    if (!args.high_hours
      || args.high_hours <= 0
      || args.high_hours >= 24
      || !this._prices) {
      return false;
    }

    const localTime = moment();

    // Finds prices starting at 00:00 today
    const pricesNextHours = pricesLib.pricesStarting(this._prices, localTime, 0, 24);
    if (pricesNextHours.length === 0) {
      return false;
    }

    // Check if high price now.  Must be ECO mode, and will skip consecutive hours.
    const highPriceNow = pricesLib.checkHighPrice2(pricesNextHours, args.high_hours, localTime, state);

    return state.high_price === false && highPriceNow.length === 0 || state.high_price === true && highPriceNow.length === 1;
  }

  async _highHoursComparer(args, state) {
    if (!args.high_hours
      || args.high_hours <= 0
      || args.high_hours >= 24
      || !this._prices) {
      return false;
    }

    const localTime = moment();

    // Finds prices starting at 00:00 today
    const pricesNextHours = pricesLib.pricesStarting(this._prices, localTime, 0, 24);
    if (pricesNextHours.length === 0) {
      return false;
    }

    // Check if high price now.
    const highPriceNow = pricesLib.checkHighPrice(pricesNextHours, args.high_hours, localTime);

    return state.high_price === false && highPriceNow.length === 0 || state.high_price === true && highPriceNow.length === 1;
  }

  async _lowHoursComparer(args, state) {
    if (!args.low_hours
      || args.low_hours <= 0
      || args.low_hours >= 24
      || !this._prices) {
      return false;
    }

    const localTime = moment();

    // Finds prices starting at 00:00 today
    const pricesNextHours = pricesLib.pricesStarting(this._prices, localTime, 0, 24);
    if (pricesNextHours.length === 0) {
      return false;
    }

    // Check if low price now
    const lowPriceNow = pricesLib.checkLowPrice(pricesNextHours, args.low_hours, localTime);

    return state.low_price === true && lowPriceNow.length === 1 || state.low_price === false && lowPriceNow.length === 0;
  }

  async _priceAvgComparer(args, state) {
    if (!args.percentage
      || args.percentage <= 0
      || args.percentage >= 100
      || !this._prices) {
      return false;
    }
    const localTime = moment();
    let startHour = 0;
    let numHours = 24;
    if (args.hours) {
      startHour = localTime.hour();
      numHours = args.hours;
    }

    const currentPrice = pricesLib.currentPrice(this._prices, localTime);

    // Finds average of prices
    const averagePrice = pricesLib.averagePricesStarting(this._prices, localTime, startHour, numHours);
    if (!averagePrice) {
      return false;
    }

    return pricesLib.checkAveragePrice(currentPrice.price, averagePrice, state.below, args.percentage);
  }

  async _priceAmongLowestComparer(args, state) {
    if (!args.low_hours
      || args.low_hours <= 0
      || args.low_hours >= 24
      || !this._prices) {
      return false;
    }

    const localTime = moment();
    let startHour = 0;
    let numHours = 24;
    let numLowestHours = 1;
    if (args.hours) {
      startHour = localTime.hour();
      numHours = args.hours;
      numLowestHours = args.low_hours;
    }

    return pricesLib.pricesAmongLowest(this._prices, localTime, startHour, numHours, numLowestHours);
  }

  async _priceAmongHighestComparer(args, state) {
    if (!args.high_hours
      || args.high_hours <= 0
      || args.high_hours >= 24
      || !this._prices) {
      return false;
    }

    const localTime = moment();
    let startHour = 0;
    let numHours = 24;
    let numHighestHours = 1;
    if (args.hours) {
      startHour = localTime.hour();
      numHours = args.hours;
      numHighestHours = args.high_hours;
    }

    return pricesLib.pricesAmongHighest(this._prices, localTime, startHour, numHours, numHighestHours);
  }

  async _priceLowestInPeriodComparer(args, state) {
    if (args.start === undefined
      || args.end === undefined
      || !args.low_hours
      || args.low_hours <= 0
      || args.low_hours >= 24
      || !this._prices) {
      return false;
    }

    const localTime = moment();
    const { startTs, endTs } = pricesLib.daysPeriod(localTime, args.start, args.end);
    return pricesLib.pricesLowestInPeriod(this._prices, localTime, startTs, endTs, args.low_hours);
  }

  async _priceHighestInPeriodComparer(args, state) {
    if (args.start === undefined
      || args.end === undefined
      || !args.high_hours
      || args.high_hours <= 0
      || args.high_hours >= 24
      || !this._prices) {
      return false;
    }

    const localTime = moment();
    const { startTs, endTs } = pricesLib.daysPeriod(localTime, args.start, args.end);
    return pricesLib.pricesHighestInPeriod(this._prices, localTime, startTs, endTs, args.high_hours);
  }

  _priceLowestNextHoursComparer(args, state) {
    if (args.start === undefined
      || args.end === undefined
      || !args.hours
      || args.hours <= 0
      || args.hours > 24
      || !this._prices) {
      return false;
    }

    const localTime = moment();
    const { startTs, endTs } = pricesLib.daysPeriod(localTime, args.start, args.end);
    const sumPrice = pricesLib.checkSumPrices(this._prices, localTime, startTs, endTs, args.hours, true);
    return !!sumPrice;
  }

  _priceHighestNextHoursComparer(args, state) {
    if (args.start === undefined
      || args.end === undefined
      || !args.hours
      || args.hours <= 0
      || args.hours > 24
      || !this._prices) {
      return false;
    }

    const localTime = moment();
    const { startTs, endTs } = pricesLib.daysPeriod(localTime, args.start, args.end);
    const sumPrice = pricesLib.checkSumPrices(this._prices, localTime, startTs, endTs, args.hours, false);
    return !!sumPrice;
  }

  _priceDiffHighLowComparer(args, state) {
    if (!args.percentage
      || args.percentage < 0
      || args.percentage > 9999
      || !this._prices) {
      return false;
    }

    const localTime = moment();
    const diffCheck = pricesLib.priceHighLow(this._prices, localTime);
    return diffCheck.diffPercentage < args.percentage;
  }

  _priceDiffHighLowComparer2(args, state) {
    if (!args.amount
      || args.amount < 0
      || args.amount > 9999
      || !this._prices) {
      return false;
    }

    const localTime = moment();
    const diffCheck = pricesLib.priceHighLow(this._prices, localTime);
    return diffCheck.diffAmount < args.amount;
  }

  _priceLowerNextHoursComparer(args, state) {
    if (!args.hours
      || args.hours <= 0
      || args.hours > 24
      || !this._prices) {
      return false;
    }

    const localTime = moment();
    return pricesLib.currentPriceLowerThanNext(this._prices, localTime, args.hours);
  }

  _priceHigherNextHoursComparer(args, state) {
    if (!args.hours
      || args.hours <= 0
      || args.hours > 24
      || !this._prices) {
      return false;
    }

    const localTime = moment();
    return pricesLib.currentPriceHigherThanNext(this._prices, localTime, args.hours);
  }

  _getHeatingOptions() {
    const settings = this.getSettings();
    return {
      workday: {
        startHour: settings.workdayStartHour || 5,
        endHour: settings.workdayEndHour || 22.5,
      },
      notWorkday: {
        startHour: settings.notWorkdayStartHour || 7,
        endHour: settings.notWorkdayEndHour || 23,
      },
      workHours: {
        startHour: settings.workHoursStartHour || 7,
        endHour: settings.workHoursEndHour || 14
      },
      country: settings.country,
      holiday_today: settings.holiday_today
    };
  }

};
