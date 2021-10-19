'use strict';

const Homey = require('homey');
const dayjs = require('dayjs');
const days = require('./lib/days');
const holidays = require('./lib/holidays');
const _ = require('lodash');

class HeatingControllerApp extends Homey.App {

  async onInit() {
    days.setTimeZone(this.homey.clock.getTimezone());
    await this._initFlows();
    this.log('HeatingControllerApp is running...');
  }

  async _initFlows() {
    this.homey.flow.getConditionCard('is_public_holiday').registerRunListener((args) => {
      return this.check(args, { 'public': true });
    });

    this.homey.flow.getConditionCard('is_bank_holiday').registerRunListener((args) => {
      return this.check(args, { 'bank': true });
    });

    this.homey.flow.getConditionCard('is_observance_holiday').registerRunListener((args) => {
      return this.check(args, { 'observance': true });
    });

    this.homey.flow.getConditionCard('is_holiday').registerRunListener((args) => {
      return this.check(args, { 'public': true, 'bank': true, 'observance': true });
    });

    this.homey.flow.getConditionCard('is_workingday').registerRunListener((args) => {
      let theDay = holidays.calcDate(dayjs().tz(), args.condition);
      return theDay.getDay() >= 1 && theDay.getDay() <= 5 && !this.check(args, {
        'public': true,
        'bank': true,
        'observance': true
      });
    });

    this._homeWasSetOnTrigger = this.homey.flow.getDeviceTriggerCard('home_was_set_on');
    this._homeWasSetOffTrigger = this.homey.flow.getDeviceTriggerCard('home_was_set_off');
    this._homeOverrideSetOnTrigger = this.homey.flow.getDeviceTriggerCard('homeoverride_set_on');
    this._homeOverrideSetOffTrigger = this.homey.flow.getDeviceTriggerCard('home_override_set_off');
    this._nightStartsTrigger = this.homey.flow.getDeviceTriggerCard('night_starts');
    this._nightEndsTrigger = this.homey.flow.getDeviceTriggerCard('night_ends');
    this._atWorkStartsTrigger = this.homey.flow.getDeviceTriggerCard('at_work_starts');
    this._atWorkEndsTrigger = this.homey.flow.getDeviceTriggerCard('at_work_ends');
    this._comfortModeTrigger = this.homey.flow.getDeviceTriggerCard('comfort_mode');
    this._ecoModeTrigger = this.homey.flow.getDeviceTriggerCard('eco_mode');
    this._priceChangedTrigger = this.homey.flow.getDeviceTriggerCard('price_changed');
    this._highPriceTrueTrigger = this.homey.flow.getDeviceTriggerCard('high_x_hours_of_day')
      .registerRunListener((args, state) => args.device._heatingOffHighPriceComparer(args, state));
    this._highPriceFalseTrigger = this.homey.flow.getDeviceTriggerCard('high_x_hours_of_day')
      .registerRunListener((args, state) => args.device._heatingOffHighPriceComparer(args, state));
    this._lowPriceTrueTrigger = this.homey.flow.getDeviceTriggerCard('low_x_hours_of_day')
      .registerRunListener((args, state) => args.device._lowHoursComparer(args, state));
    this._lowPriceFalseTrigger = this.homey.flow.getDeviceTriggerCard('low_x_hours_of_day')
      .registerRunListener((args, state) => args.device._lowHoursComparer(args, state));

    this.homey.flow.getConditionCard('is_home')
      .registerRunListener((args, state) => args.device.getCapabilityValue('onoff'));
    this.homey.flow.getConditionCard('is_home_override')
      .registerRunListener((args, state) => args.device.getCapabilityValue('home_override'));
    this.homey.flow.getConditionCard('is_night')
      .registerRunListener((args, state) => args.device.getCapabilityValue('night'));
    this.homey.flow.getConditionCard('is_at_work')
      .registerRunListener((args, state) => args.device.getCapabilityValue('at_work'));
    this.homey.flow.getConditionCard('is_heating_on')
      .registerRunListener((args, state) => args.device.getCapabilityValue('heating'));
    this.homey.flow.getConditionCard('current_price_below')
      .registerRunListener(args => args.price > _.get(args.device._lastPrice, 'price'));

    this.homey.flow.getConditionCard('high_x_hours_of_day_condition')
      .registerRunListener((args, state) => {
        const device = args.device;
        state.prices = device._prices;
        state.high_price = true;
        return device._highHoursComparer(args, state);
      });

    this.homey.flow.getConditionCard('low_x_hours_of_day_condition')
      .registerRunListener((args, state) => {
        const device = args.device;
        state.prices = device._prices;
        state.low_price = true;
        return device._lowHoursComparer(args, state);
      });

    this.homey.flow.getConditionCard('price_below_avg_condition')
      .registerRunListener((args, state) => {
        const device = args.device;
        state.prices = device._prices;
        state.currentPrice = device._getCurrentPrice(device._prices);
        state.below = true;
        return device._priceAvgComparer(args, state);
      });

    this.homey.flow.getConditionCard('price_below_avg_next_hours_condition')
      .registerRunListener((args, state) => {
        const device = args.device;
        state.prices = device._prices;
        state.currentPrice = device._getCurrentPrice(device._prices);
        state.below = true;
        return device._priceAvgComparer(args, state);
      });

    this.homey.flow.getConditionCard('price_above_avg_condition')
      .registerRunListener((args, state) => {
        const device = args.device;
        state.prices = device._prices;
        state.currentPrice = device._getCurrentPrice(device._prices);
        state.below = false;
        return device._priceAvgComparer(args, state);
      });

    this.homey.flow.getConditionCard('price_above_avg_next_hours_condition')
      .registerRunListener((args, state) => {
        const device = args.device;
        state.prices = device._prices;
        state.currentPrice = device._getCurrentPrice(device._prices);
        state.below = false;
        return device._priceAvgComparer(args, state);
      });

    this.homey.flow.getConditionCard('prices_among_lowest_condition')
      .registerRunListener((args, state) => {
        const device = args.device;
        state.prices = device._prices;
        return device._priceAmongLowestComparer(args, state);
      });

    this.homey.flow.getConditionCard('prices_among_highest_condition')
      .registerRunListener((args, state) => {
        const device = args.device;
        state.prices = device._prices;
        return device._priceAmongHighestComparer(args, state);
      });

    this.homey.flow.getActionCard('set_at_home_on')
      .registerRunListener((args, state) => args.device.onActionSetAtHomeOn(args, state));

    this.homey.flow.getActionCard('set_at_home_off')
      .registerRunListener((args, state) => args.device.onActionSetAtHomeOff(args, state));

    this.homey.flow.getActionCard('set_at_home_off_auto')
      .registerRunListener((args, state) => args.device.onActionSetAtHomeOffAuto(args, state));

    this.homey.flow.getActionCard('set_home_override_on')
      .registerRunListener((args, state) => args.device.onActionSetHomeOverrideOn(args, state));

    this.homey.flow.getActionCard('set_home_override_on_auto')
      .registerRunListener((args, state) => args.device.onActionSetHomeOverrideOnAuto(args, state));

    this.homey.flow.getActionCard('set_home_override_off')
      .registerRunListener((args, state) => args.device.onActionSetHomeOverrideOff(args, state));

    this.homey.flow.getActionCard('set_holiday_today')
      .registerRunListener((args, state) => args.device.onActionSetHolidayToday(args, state));
  }

  check(args, types) {
    if (!args.country || !args.condition) {
      return false;
    }
    let hd;
    try {
      hd = holidays.isHoliday(args.country, dayjs().tz(), args.condition);
    } catch (err) {
      console.error(err);
    }
    return hd && hd.type && hd.type in types;
  }

}

module.exports = HeatingControllerApp;
