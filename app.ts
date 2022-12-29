import Homey from 'homey';
import moment from 'moment-timezone';

import {holidays, Holiday} from '@balmli/homey-public-holidays'
import {UtilityBillApi} from '@balmli/homey-utility-prices-client'

module.exports = class HeatingControllerApp extends Homey.App {

    utilityBillApi?: UtilityBillApi;

    async onInit() {
        moment.tz.setDefault(this.homey.clock.getTimezone());
        this.utilityBillApi = new UtilityBillApi({logger: this.log, homey: this.homey});
        await this._initFlows();
        this.log('HeatingControllerApp is running...');
    }

    async _initFlows() {
        this.homey.flow.getConditionCard('is_public_holiday')
            .registerRunListener((args) => this.check(args, {'public': true}));
        this.homey.flow.getConditionCard('is_bank_holiday')
            .registerRunListener((args) => this.check(args, {'bank': true}));
        this.homey.flow.getConditionCard('is_observance_holiday')
            .registerRunListener((args) => this.check(args, {'observance': true}));
        this.homey.flow.getConditionCard('is_holiday')
            .registerRunListener((args) => this.check(args, {'public': true, 'bank': true, 'observance': true}));

        this.homey.flow.getConditionCard('is_workingday')
            .registerRunListener((args) => {
                const theDay = holidays.calcDate(moment().toDate(), args.condition);
                return theDay.getDay() >= 1 && theDay.getDay() <= 5 && !this.check(args, {
                    'public': true,
                    'bank': true,
                    'observance': true
                });
            });

        this.homey.flow.getDeviceTriggerCard('high_x_hours_of_day')
            .registerRunListener((args, state) => args.device.priceComparer.heatingOffHighPriceComparer(args, state));
        this.homey.flow.getDeviceTriggerCard('low_x_hours_of_day')
            .registerRunListener((args, state) => args.device.priceComparer.lowHoursComparer(args, state));

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
            .registerRunListener(args => args.device._lastPrice && (args.price > args.device._lastPrice.price));

        this.homey.flow.getConditionCard('high_x_hours_of_day_condition')
            .registerRunListener((args, state) => {
                state.high_price = true;
                return args.device.priceComparer.highHoursComparer(args, state);
            });

        this.homey.flow.getConditionCard('low_x_hours_of_day_condition')
            .registerRunListener((args, state) => {
                state.low_price = true;
                return args.device.priceComparer.lowHoursComparer(args, state);
            });

        this.homey.flow.getConditionCard('price_below_avg_condition')
            .registerRunListener((args, state) => {
                state.below = true;
                return args.device.priceComparer.priceAvgComparer(args, state);
            });

        this.homey.flow.getConditionCard('price_below_avg_next_hours_condition')
            .registerRunListener((args, state) => {
                state.below = true;
                return args.device.priceComparer.priceAvgComparer(args, state);
            });

        this.homey.flow.getConditionCard('price_above_avg_condition')
            .registerRunListener((args, state) => {
                state.below = false;
                return args.device.priceComparer.priceAvgComparer(args, state);
            });

        this.homey.flow.getConditionCard('price_above_avg_next_hours_condition')
            .registerRunListener((args, state) => {
                state.below = false;
                return args.device.priceComparer.priceAvgComparer(args, state);
            });

        this.homey.flow.getConditionCard('prices_among_lowest_condition')
            .registerRunListener((args, state) => args.device.priceComparer.priceAmongLowestComparer(args, state));

        this.homey.flow.getConditionCard('prices_among_highest_condition')
            .registerRunListener((args, state) => args.device.priceComparer.priceAmongHighestComparer(args, state));

        this.homey.flow.getConditionCard('price_lowest_among_in_period')
            .registerRunListener((args, state) => args.device.priceComparer.priceLowestInPeriodComparer(args, state));

        this.homey.flow.getConditionCard('price_highest_among_in_period')
            .registerRunListener((args, state) => args.device.priceComparer.priceHighestInPeriodComparer(args, state));

        this.homey.flow.getConditionCard('price_lowest_among_in_period_2')
            .registerRunListener((args, state) => args.device.priceComparer.priceLowestInPeriodComparer(args, state));

        this.homey.flow.getConditionCard('price_highest_among_in_period_2')
            .registerRunListener((args, state) => args.device.priceComparer.priceHighestInPeriodComparer(args, state));

        this.homey.flow.getConditionCard('price_lower_next_hours')
            .registerRunListener((args, state) => args.device.priceComparer.priceLowerNextHoursComparer(args, state));

        this.homey.flow.getConditionCard('price_higher_next_hours')
            .registerRunListener((args, state) => args.device.priceComparer.priceHigherNextHoursComparer(args, state));

        this.homey.flow.getConditionCard('prices_lowest_next_hours')
            .registerRunListener((args, state) => args.device.priceComparer.priceLowestNextHoursComparer(args, state));

        this.homey.flow.getConditionCard('prices_highest_next_hours')
            .registerRunListener((args, state) => args.device.priceComparer.priceHighestNextHoursComparer(args, state));

        this.homey.flow.getConditionCard('prices_lowest_next_hours_2')
            .registerRunListener((args, state) => args.device.priceComparer.priceLowestNextHoursComparer(args, state));

        this.homey.flow.getConditionCard('prices_highest_next_hours_2')
            .registerRunListener((args, state) => args.device.priceComparer.priceHighestNextHoursComparer(args, state));

        this.homey.flow.getConditionCard('price_diff_high_low')
            .registerRunListener((args, state) => args.device.priceComparer.priceDiffHighLowComparer(args, state));

        this.homey.flow.getConditionCard('price_diff_high_low2')
            .registerRunListener((args, state) => args.device.priceComparer.priceDiffHighLowComparer2(args, state));

        this.homey.flow.getActionCard('set_at_home_on')
            .registerRunListener((args, state) => args.device.onActionSetAtHomeOn());

        this.homey.flow.getActionCard('set_at_home_off')
            .registerRunListener((args, state) => args.device.onActionSetAtHomeOff());

        this.homey.flow.getActionCard('set_at_home_off_auto')
            .registerRunListener((args, state) => args.device.onActionSetAtHomeOffAuto());

        this.homey.flow.getActionCard('set_home_override_on')
            .registerRunListener((args, state) => args.device.onActionSetHomeOverrideOn());

        this.homey.flow.getActionCard('set_home_override_on_auto')
            .registerRunListener((args, state) => args.device.onActionSetHomeOverrideOnAuto());

        this.homey.flow.getActionCard('set_home_override_off')
            .registerRunListener((args, state) => args.device.onActionSetHomeOverrideOff());

        this.homey.flow.getActionCard('set_holiday_today')
            .registerRunListener((args, state) => args.device.onActionSetHolidayToday(args));

        this.homey.flow.getActionCard('clear_holiday_today')
            .registerRunListener((args, state) => args.device.onActionClearHolidayToday());
    }

    check(args: any, types: any) {
        if (!args.country || !args.condition) {
            return false;
        }
        let hd;
        try {
            hd = holidays.isHoliday(args.country, moment().toDate(), args.condition);
        } catch (err) {
            console.error(err);
        }
        if (hd == false) {
            return false;
        }
        const hdd = hd as Holiday;
        return hdd.type in types;
    }

}
