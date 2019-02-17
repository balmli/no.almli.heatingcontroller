'use strict';

const Homey = require('homey');
const holidays = require('./lib/holidays');

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
