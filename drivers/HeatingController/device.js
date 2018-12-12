'use strict';

const Homey = require('homey');

class HeatingControllerDevice extends Homey.Device {

    onInit() {
        this.log(this.getName() + ' -> virtual device initialized');

        this._at_home = undefined;
        this._night = undefined;
        this._at_work = undefined;
        this._home_override = undefined;

        this._nightStartsTrigger = new Homey.FlowCardTriggerDevice('night_starts');
        this._nightStartsTrigger.register();

        this._nightEndsTrigger = new Homey.FlowCardTriggerDevice('night_ends');
        this._nightEndsTrigger.register();

        this._atWorkStartsTrigger = new Homey.FlowCardTriggerDevice('at_work_starts');
        this._atWorkStartsTrigger.register();

        this._atWorkEndsTrigger = new Homey.FlowCardTriggerDevice('at_work_ends');
        this._atWorkEndsTrigger.register();

        this._setHeatOnTrigger = new Homey.FlowCardTriggerDevice('set_heat_on');
        this._setHeatOnTrigger.register();

        this._setHeatOffTrigger = new Homey.FlowCardTriggerDevice('set_heat_off');
        this._setHeatOffTrigger.register();

        this.isHomeCondition = new Homey.FlowCardCondition('is_home')
            .register()
            .registerRunListener((args, state) => {
                return args.device.getCapabilityValue('onoff');
            });

        this.isHomeOverrideCondition = new Homey.FlowCardCondition('is_home_override')
            .register()
            .registerRunListener((args, state) => {
                return args.device.getCapabilityValue('home_override');
            });

        this.NightCondition = new Homey.FlowCardCondition('is_night')
            .register()
            .registerRunListener((args, state) => {
                return args.device.getCapabilityValue('night');
            });

        this.isAtWorkCondition = new Homey.FlowCardCondition('is_at_work')
            .register()
            .registerRunListener((args, state) => {
                return args.device.getCapabilityValue('at_work');
            });

        this.isHeatingOnCondition = new Homey.FlowCardCondition('is_heating_on')
            .register()
            .registerRunListener((args, state) => {
                return args.device.getCapabilityValue('heating');
            });

        this._setAtHomeOnAction = new Homey.FlowCardAction('set_at_home_on')
            .register()
            .registerRunListener((args, state) => {
                args.device.setCapabilityValue('onoff', true);
                return this.checkTime(true);
            });

        this._setAtHomeOffAction = new Homey.FlowCardAction('set_at_home_off')
            .register()
            .registerRunListener((args, state) => {
                args.device.setCapabilityValue('onoff', false);
                return this.checkTime(false);
            });

        this._setHomeOverrideOnAction = new Homey.FlowCardAction('set_home_override_on')
            .register()
            .registerRunListener((args, state) => {
                args.device.setCapabilityValue('home_override', true);
                return this.checkTime(undefined, true);
            });

        this._setHomeOverrideOffAction = new Homey.FlowCardAction('set_home_override_off')
            .register()
            .registerRunListener((args, state) => {
                args.device.setCapabilityValue('home_override', false);
                return this.checkTime(undefined, false);
            });

        this.registerCapabilityListener('onoff', (value, opts) => {
            this.log(this.getName() + ' -> onoff changed: ', value, opts);
            return this.checkTime(value);
        });

        this.checkTime();
    }

    onAdded() {
        this.log(this.getName() + ' -> virtual device added', this.getData().id);
    }

    onDeleted() {
        this.log(this.getName() + ' -> virtual device deleted');
    }

    async checkTime(onoff, home_override) {
        this.clearCheckTime();

        let day = HeatingControllerDevice.isDay();
        this.log('day', day);

        let worktime = HeatingControllerDevice.isWorkTime();
        this.log('worktime', worktime);

        if (onoff === false || onoff === true) {
            this._at_home = onoff;
        } else {
            this._at_home = this.getCapabilityValue('onoff');
        }
        if (this._at_home === undefined || this._at_home === null) {
            this._at_home = true;
            await this.setCapabilityValue('onoff', this._at_home);
        }

        if (home_override === false || home_override === true) {
            this._home_override = home_override;
        } else {
            this._home_override = this.getCapabilityValue('home_override');
        }
        if (this._home_override === undefined || this._home_override === null) {
            this._home_override = false;
            await this.setCapabilityValue('home_override', this._home_override);
        }

        this._night = this.getCapabilityValue('night');
        if (this._night === undefined || this._night === null || !this._night && !day || this._night && day) {
            this._night = !day;
            await this.setCapabilityValue('night', this._night);
            if (this._night) {
                this._nightStartsTrigger.trigger(this);
            } else {
                this._nightEndsTrigger.trigger(this);
            }
            this.log('night trigger', this._night);
        }

        if (this._at_work === undefined || this._at_work === null || !this._at_work && worktime || this._at_work && !worktime) {
            this._at_work = worktime;
            await this.setCapabilityValue('at_work', this._at_work);
            if (this._at_work) {
                this._atWorkStartsTrigger.trigger(this);
            } else {
                this._atWorkEndsTrigger.trigger(this);
            }
            this.log('at_work trigger', this._at_work);
        }

        let currentHeat = this.getCapabilityValue('heating');
        //this.log('currentHeat', currentHeat);

        let newHeat = this._at_home === true && this._night === false && this._at_work === false ||
            this._home_override === true && this._night === false;

        if (currentHeat === undefined || newHeat !== currentHeat) {
            await this.setCapabilityValue('heating', newHeat);
            if (newHeat) {
                this._setHeatOnTrigger.trigger(this);
                this.log('heatOnTrigger', newHeat);
            } else {
                this._setHeatOffTrigger.trigger(this);
                this.log('heatOffTrigger', newHeat);
            }
        }

        this.scheduleCheckTime(60);

        return Promise.resolve();
    }


    clearCheckTime() {
        if (this.curTimeout) {
            clearTimeout(this.curTimeout);
            this.curTimeout = undefined;
            this.log('clear timeout');
        }
    }

    scheduleCheckTime(seconds) {
        this.clearCheckTime();
        this.log(`Checking time in ${seconds} seconds`);
        this.curTimeout = setTimeout(this.checkTime.bind(this), seconds * 1000);
    }

    static isDay() {
        let today = new Date();
        let workDay = today.getDay() >= 1 && today.getDay() <= 5;
        let hour = today.getHours() + today.getMinutes() / 60 + today.getSeconds() / 3600;
        return workDay && hour >= 5.5 && hour <= 22.5 || !workDay && hour >= 7.0 && hour <= 23;
    }

    static isWorkTime() {
        let today = new Date();
        let workDay = !HeatingControllerDevice.isHoliday() && today.getDay() >= 1 && today.getDay() <= 5;
        let hour = today.getHours() + today.getMinutes() / 60 + today.getSeconds() / 3600;
        return workDay && hour >= 7.0 && hour <= 15.5;
    }

    static isHoliday() {
        let today = new Date();
        let m = today.getMonth() + 1;
        let d = today.getDate();
        let easterDate = HeatingControllerDevice.easter(today.getFullYear());
        return (m === 1 && (d === 1)) ||
            (m === 5 && (d === 1 || d === 17)) ||
            (m === 12 && (d === 24 || d === 25 || d === 26 || d === 31)) ||
            HeatingControllerDevice.equals(today, HeatingControllerDevice.addDate(easterDate, -3)) ||
            HeatingControllerDevice.equals(today, HeatingControllerDevice.addDate(easterDate, -2)) ||
            HeatingControllerDevice.equals(today, HeatingControllerDevice.addDate(easterDate, 1)) ||
            HeatingControllerDevice.equals(today, HeatingControllerDevice.addDate(easterDate, 39)) ||
            HeatingControllerDevice.equals(today, HeatingControllerDevice.addDate(easterDate, 50));
    }

    static addDate(date, days) {
        let ret = new Date();
        ret.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        return ret;
    }

    static equals(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    static easter(y) {
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setFullYear(y);

        // Find the golden number.
        let a, b, c, m, d;
        a = y % 19;

        // Choose which version of the algorithm to use based on the given year.
        b = (2200 <= y && y <= 2299) ?
            ((11 * a) + 4) % 30 :
            ((11 * a) + 5) % 30;

        // Determine whether or not to compensate for the previous step.
        c = ((b === 0) || (b === 1 && a > 10)) ?
            (b + 1) :
            b;

        // Use c first to find the month: April or March.
        m = (1 <= c && c <= 19) ? 3 : 2;

        // Then use c to find the full moon after the northward equinox.
        d = (50 - c) % 31;

        // Mark the date of that full moon—the "Paschal" full moon.
        date.setMonth(m, d);

        // Count forward the number of days until the following Sunday (Easter).
        date.setMonth(m, d + (7 - date.getDay()));

        // Gregorian Western Easter Sunday
        return date;
    }

}

module.exports = HeatingControllerDevice;
