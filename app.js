'use strict';

const Homey = require('homey');
const holidays = require('./lib/holidays');
const _ = require('lodash');

class HeatingControllerApp extends Homey.App {

    onInit() {
        this.log('HeatingControllerApp is running...');

        new Homey.FlowCardCondition('is_public_holiday').register().registerRunListener((args) => {
            return this.check(args, {'public': true});
        });

        new Homey.FlowCardCondition('is_bank_holiday').register().registerRunListener((args) => {
            return this.check(args, {'bank': true});
        });

        new Homey.FlowCardCondition('is_observance_holiday').register().registerRunListener((args) => {
            return this.check(args, {'observance': true});
        });

        new Homey.FlowCardCondition('is_holiday').register().registerRunListener((args) => {
            return this.check(args, {'public': true, 'bank': true, 'observance': true});
        });

        new Homey.FlowCardCondition('is_workingday').register().registerRunListener((args) => {
            let theDay = holidays.calcDate(new Date(), args.condition);
            return theDay.getDay() >= 1 && theDay.getDay() <= 5 && !this.check(args, {'public': true, 'bank': true, 'observance': true});
        });

        this._homeWasSetOnTrigger = new Homey.FlowCardTriggerDevice('home_was_set_on');
        this._homeWasSetOnTrigger.register();

        this._homeWasSetOffTrigger = new Homey.FlowCardTriggerDevice('home_was_set_off');
        this._homeWasSetOffTrigger.register();

        this._homeOverrideSetOnTrigger = new Homey.FlowCardTriggerDevice('homeoverride_set_on');
        this._homeOverrideSetOnTrigger.register();

        this._homeOverrideSetOffTrigger = new Homey.FlowCardTriggerDevice('home_override_set_off');
        this._homeOverrideSetOffTrigger.register();

        this._nightStartsTrigger = new Homey.FlowCardTriggerDevice('night_starts');
        this._nightStartsTrigger.register();

        this._nightEndsTrigger = new Homey.FlowCardTriggerDevice('night_ends');
        this._nightEndsTrigger.register();

        this._atWorkStartsTrigger = new Homey.FlowCardTriggerDevice('at_work_starts');
        this._atWorkStartsTrigger.register();

        this._atWorkEndsTrigger = new Homey.FlowCardTriggerDevice('at_work_ends');
        this._atWorkEndsTrigger.register();

        this._comfortModeTrigger = new Homey.FlowCardTriggerDevice('comfort_mode');
        this._comfortModeTrigger.register();

        this._ecoModeTrigger = new Homey.FlowCardTriggerDevice('eco_mode');
        this._ecoModeTrigger.register();

        this._priceChangedTrigger = new Homey.FlowCardTriggerDevice('price_changed');
        this._priceChangedTrigger.register();

        this._highPriceTrueTrigger = new Homey.FlowCardTriggerDevice('high_x_hours_of_day');
        this._highPriceTrueTrigger
            .register()
            .registerRunListener((args, state) => args.device._heatingOffHighPriceComparer(args, state));

        this._highPriceFalseTrigger = new Homey.FlowCardTriggerDevice('high_x_hours_of_day');
        this._highPriceFalseTrigger
            .register()
            .registerRunListener((args, state) => args.device._heatingOffHighPriceComparer(args, state));

        this._lowPriceTrueTrigger = new Homey.FlowCardTriggerDevice('low_x_hours_of_day');
        this._lowPriceTrueTrigger
            .register()
            .registerRunListener((args, state) => args.device._lowHoursComparer(args, state));

        this._lowPriceFalseTrigger = new Homey.FlowCardTriggerDevice('low_x_hours_of_day');
        this._lowPriceFalseTrigger
            .register()
            .registerRunListener((args, state) => args.device._lowHoursComparer(args, state));

        new Homey.FlowCardCondition('is_home')
            .register()
            .registerRunListener((args, state) => args.device.getCapabilityValue('onoff'));

        new Homey.FlowCardCondition('is_home_override')
            .register()
            .registerRunListener((args, state) => args.device.getCapabilityValue('home_override'));

        new Homey.FlowCardCondition('is_night')
            .register()
            .registerRunListener((args, state) => args.device.getCapabilityValue('night'));

        new Homey.FlowCardCondition('is_at_work')
            .register()
            .registerRunListener((args, state) => args.device.getCapabilityValue('at_work'));

        new Homey.FlowCardCondition('is_heating_on')
            .register()
            .registerRunListener((args, state) => args.device.getCapabilityValue('heating'));

        new Homey.FlowCardCondition('current_price_below')
            .register()
            .registerRunListener(args => args.price > _.get(this._lastPrice, 'price'));

        new Homey.FlowCardCondition('low_x_hours_of_day_condition')
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                state.prices = device._prices;
                state.low_price = true;
                return device._lowHoursComparer(args, state);
            });

        new Homey.FlowCardCondition('price_below_avg_condition')
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                state.prices = device._prices;
                state.currentPrice = device._getCurrentPrice(device._prices);
                state.below = true;
                return device._priceAvgComparer(args, state);
            });

        new Homey.FlowCardCondition('price_above_avg_condition')
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                state.prices = device._prices;
                state.currentPrice = device._getCurrentPrice(device._prices);
                state.below = false;
                return device._priceAvgComparer(args, state);
            });

        new Homey.FlowCardAction('set_at_home_on')
            .register()
            .registerRunListener((args, state) => args.device.onActionSetAtHomeOn(args, state));

        new Homey.FlowCardAction('set_at_home_off')
            .register()
            .registerRunListener((args, state) => args.device.onActionSetAtHomeOff(args, state));

        new Homey.FlowCardAction('set_at_home_off_auto')
            .register()
            .registerRunListener((args, state) => args.device.onActionSetAtHomeOffAuto(args, state));

        new Homey.FlowCardAction('set_home_override_on')
            .register()
            .registerRunListener((args, state) => args.device.onActionSetHomeOverrideOn(args, state));

        new Homey.FlowCardAction('set_home_override_on_auto')
            .register()
            .registerRunListener((args, state) => args.device.onActionSetHomeOverrideOnAuto(args, state));

        new Homey.FlowCardAction('set_home_override_off')
            .register()
            .registerRunListener((args, state) => args.device.onActionSetHomeOverrideOff(args, state));

        new Homey.FlowCardAction('set_holiday_today')
            .register()
            .registerRunListener((args, state) => args.device.onActionSetHolidayToday(args, state));
    }

    check(args, types) {
        if (!args.country || !args.condition) {
            return false;
        }
        let hd;
        try {
            hd = holidays.isHoliday(args.country, new Date(), args.condition);
        } catch (err) {
            console.error(err);
        }
        return hd && hd.type && hd.type in types;
    }

}

module.exports = HeatingControllerApp;
