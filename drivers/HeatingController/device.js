'use strict';

const Homey = require('homey');
const moment = require('../../lib/moment-timezone-with-data');
const pricesLib = require('../../lib/prices');
const nordpool = require('../../lib/nordpool');
const heating = require('../../lib/heating');

module.exports = class HeatingControllerDevice extends Homey.Device {

  async onInit() {
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
        this.homey.flow.getDeviceTriggerCard('home_was_set_on').trigger(this, {}).catch(this.error);
      } else {
        this.homey.flow.getDeviceTriggerCard('home_was_set_off').trigger(this, {}).catch(this.error);
      }
      this.log(this.getName() + ' -> onoff changed: ', value, opts);
      return this.checkTime(value);
    });

    this.scheduleCheckTime(5);
    this.log(this.getName() + ' -> device initialized');
  }

  async fixPrice(selectedCurrency) {
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
    this.setCapabilityValue('onoff', true).catch(this.error);
    this.homey.flow.getDeviceTriggerCard('home_was_set_on').trigger(this, {}).catch(this.error);
    return this.checkTime(true);
  }

  async onActionSetAtHomeOff() {
    this._home_on_next_period = false;
    this.setCapabilityValue('onoff', false).catch(this.error);
    this.homey.flow.getDeviceTriggerCard('home_was_set_off').trigger(this, {}).catch(this.error);
    return this.checkTime(false);
  }

  async onActionSetAtHomeOffAuto() {
    this._home_on_next_period = true;
    this.setCapabilityValue('onoff', false).catch(this.error);
    this.homey.flow.getDeviceTriggerCard('home_was_set_off').trigger(this, {}).catch(this.error);
    return this.checkTime(false);
  }

  async onActionSetHomeOverrideOn() {
    this._ho_off_next_period = false;
    this.setCapabilityValue('home_override', true).catch(this.error);
    this.homey.flow.getDeviceTriggerCard('homeoverride_set_on').trigger(this, {}).catch(this.error);
    return this.checkTime(undefined, true);
  }

  async onActionSetHomeOverrideOnAuto() {
    this._ho_off_next_period = true;
    this.setCapabilityValue('home_override', true).catch(this.error);
    this.homey.flow.getDeviceTriggerCard('homeoverride_set_on').trigger(this, {}).catch(this.error);
    return this.checkTime(undefined, true);
  }

  async onActionSetHomeOverrideOff() {
    this.setCapabilityValue('home_override', false).catch(this.error);
    this.homey.flow.getDeviceTriggerCard('home_override_set_off').trigger(this, {}).catch(this.error);
    return this.checkTime(undefined, false);
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

  async checkTime(onoff, home_override) {
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
        this.setCapabilityValue('onoff', this._at_home).catch(this.error);
      }

      if (home_override === false || home_override === true) {
        this._home_override = home_override;
      } else {
        this._home_override = this.getCapabilityValue('home_override');
      }
      if (this._home_override === undefined || this._home_override === null) {
        this._home_override = false;
        this.setCapabilityValue('home_override', this._home_override).catch(this.error);
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

  toHour(aDate) {
    return aDate.startOf('hour').toISOString();
  }

  shallFetchData() {
    return !this._prices
      || !this._lastFetchData
      || this.toHour(this._lastFetchData) !== this.toHour(moment());
  }

  async onData() {
    try {
      const localTime = moment();
      const heatingOptions = this._getHeatingOptions();
      let calcHeating = heating.calcHeating(localTime, this._at_home, this._home_override, heatingOptions);
      let nigthAtWorkChanged = false;
      this.log('Heating:', calcHeating);

      const curNight = this.getCapabilityValue('night');
      if (curNight === undefined || curNight === null || calcHeating.night !== curNight) {
        nigthAtWorkChanged = true;
        this.setCapabilityValue('night', calcHeating.night).catch(this.error);
        if (calcHeating.night) {
          this.homey.flow.getDeviceTriggerCard('night_starts').trigger(this, {}).catch(this.error);
          this.log('Night starts trigger');
        } else {
          this.homey.flow.getDeviceTriggerCard('night_ends').trigger(this, {}).catch(this.error);
          this.log('Night ends trigger');
        }
      }

      const curAtWork = this.getCapabilityValue('at_work');
      if (curAtWork === undefined || curAtWork === null || calcHeating.atWork !== curAtWork) {
        nigthAtWorkChanged = true;
        this.setCapabilityValue('at_work', calcHeating.atWork).catch(this.error);
        if (calcHeating.atWork) {
          this.homey.flow.getDeviceTriggerCard('at_work_starts').trigger(this, {}).catch(this.error);
          this.log('At work starts trigger');
        } else {
          this.homey.flow.getDeviceTriggerCard('at_work_ends').trigger(this, {}).catch(this.error);
          this.log('At work ends trigger');
        }
      }

      if (nigthAtWorkChanged) {
        let recalcHeating = false;
        if (this._home_on_next_period) {
          recalcHeating = true;
          this._home_on_next_period = false;
          this._at_home = true;
          this.setCapabilityValue('onoff', true).catch(this.error);
          this.homey.flow.getDeviceTriggerCard('home_was_set_on').trigger(this, {}).catch(this.error);
          this.log('Automatically set home mode');
        }
        if (this._ho_off_next_period) {
          recalcHeating = true;
          this._ho_off_next_period = false;
          this._home_override = false;
          this.setCapabilityValue('home_override', false).catch(this.error);
          this.homey.flow.getDeviceTriggerCard('home_override_set_off').trigger(this, {}).catch(this.error);
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
        this.setCapabilityValue('heating', calcHeating.heating).catch(this.error);
        if (calcHeating.heating) {
          this.homey.flow.getDeviceTriggerCard('comfort_mode').trigger(this, {}).catch(this.error);
          this.log('Comfort mode trigger');
        } else {
          this.homey.flow.getDeviceTriggerCard('eco_mode').trigger(this, {}).catch(this.error);
          this.log('ECO mode trigger');
        }
      }

      const currentPrice = this._getCurrentPrice(this._prices);

      if (currentPrice) {
        const startAtHour = this.toHour(currentPrice.startsAt);
        const price = currentPrice.price;
        this.log('Current price:', startAtHour, price);

        const priceChanged = !this._lastPrice || startAtHour !== this.toHour(this._lastPrice.startsAt);
        if (priceChanged) {
          this._lastPrice = currentPrice;
          const priceCapability = `price_${this.getSetting('currency')}`;
          if (this.hasCapability(priceCapability)) {
            this.setCapabilityValue(priceCapability, price).catch(this.error);
          }
          this.homey.flow.getDeviceTriggerCard('price_changed').trigger(this, { price }).catch(this.error);
          this.log('Price changed trigger', startAtHour, price);
        }

        if (priceChanged || heatChanged) {
          this.homey.flow.getDeviceTriggerCard('high_x_hours_of_day').trigger(this, {
            heating: calcHeating.heating,
            high_price: true
          }, {
            atHome: this._at_home,
            homeOverride: this._home_override,
            high_price: true,
            heatingOptions: heatingOptions
          }).catch(this.error);

          this.homey.flow.getDeviceTriggerCard('high_x_hours_of_day').trigger(this, {
            heating: calcHeating.heating,
            high_price: false
          }, {
            atHome: this._at_home,
            homeOverride: this._home_override,
            high_price: false,
            heatingOptions: heatingOptions
          }).catch(this.error);

          this.homey.flow.getDeviceTriggerCard('low_x_hours_of_day').trigger(this, {
            heating: calcHeating.heating,
            low_price: true
          }, {
            low_price: true
          }).catch(this.error);

          this.homey.flow.getDeviceTriggerCard('low_x_hours_of_day').trigger(this, {
            heating: calcHeating.heating,
            low_price: false
          }, {
            low_price: false
          }).catch(this.error);
        }
      }
    } catch (err) {
      this.error(err);
    }
  }

  _getCurrentPrice(prices) {
    const currentHour = this.toHour(moment());
    return prices.find(p => this.toHour(p.startsAt) === currentHour);
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
    const currentPrice = this._getCurrentPrice(this._prices);

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
