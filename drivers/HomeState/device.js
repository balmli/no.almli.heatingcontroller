'use strict';

const Homey = require('homey');

class HomeStateDevice extends Homey.Device {

    onInit() {
        this.log(this.getName() + ' -> virtual device initialized');

        this._at_home = undefined;
        this._night = undefined;
        this._at_work = undefined;
        this._home_override = false;

        this._nightTrigger = new Homey.FlowCardTriggerDevice('night');
        this._nightTrigger.register();

        this._atWorkTrigger = new Homey.FlowCardTriggerDevice('at_work');
        this._atWorkTrigger.register();

        this._setHeatOnTrigger = new Homey.FlowCardTriggerDevice('set_heat_on');
        this._setHeatOnTrigger.register();

        this._setHeatOffTrigger = new Homey.FlowCardTriggerDevice('set_heat_off');
        this._setHeatOffTrigger.register();

        this.registerCapabilityListener('onoff', (value, opts) => {
            this.log(this.getName() + ' -> onoff changed: ', value, opts);
            return this.checkTime();
        });

        this.checkTime();
    }

    onAdded() {
        this.log(this.getName() + ' -> virtual device added', this.getData().id);
    }

    onDeleted() {
        this.log(this.getName() + ' -> virtual device deleted');
    }

    async checkTime() {

        let day = HomeStateDevice.isDay();
        this.log('day', day);

        let worktime = HomeStateDevice.isWorkTime();
        this.log('worktime', worktime);

        this._at_home = this.getCapabilityValue('onoff');
        if (this._at_home === undefined || this._at_home === null) {
            this._at_home = true;
            await this.setCapabilityValue('onoff', this._at_home);
        }

        this._night = this.getCapabilityValue('night');
        if (this._night === undefined || !this._night && !day || this._night && day) {
            this._night = !day;
            await this.setCapabilityValue('night', this._night);
            this._nightTrigger.trigger(this, {night: this._night});
            this.log('night trigger', this._night);
        }

        if (this._at_work === undefined || !this._at_work && worktime || this._at_work && !worktime) {
            this._at_work = worktime;
            await this.setCapabilityValue('at_work', this._at_work);
            this._atWorkTrigger.trigger(this, {atWork: this._at_work});
            this.log('at_work trigger', this._at_work);
        }

        let currentHeat = this.getCapabilityValue('heating');
        //this.log('currentHeat', currentHeat);

        let newHeat = this._at_home === true && this._night === false && this._at_work === false ||
            this._home_override === true && this._night === false;

        if (currentHeat === undefined || newHeat !== currentHeat) {
            await this.setCapabilityValue('heating', newHeat);
            if (newHeat) {
                this._setHeatOnTrigger.trigger(this, {heat: true});
                this.log('heatOnTrigger', newHeat);
            } else {
                this._setHeatOffTrigger.trigger(this, {heat: false});
                this.log('heatOffTrigger', newHeat);
            }
        }

        this.scheduleCheckTime(60);

        return Promise.resolve();
    }

    scheduleCheckTime(seconds) {
        if (this.curTimeout) {
            clearTimeout(this.curTimeout);
        }
        this.log(`Checking time in ${seconds} seconds`);
        this.curTimeout = setTimeout(this.checkTime.bind(this), seconds * 1000);
    }

    static isDay() {
        let today = new Date();
        let workDay = today.getDay() >= 1 && today.getDay() <= 5;
        let hour = today.getHours() + today.getMinutes() / 60 + today.getSeconds() / 3600;
        return workDay && hour >= 7.0 && hour <= 22.5 || !workDay && hour >= 7.0 && hour <= 22.5;
    }

    static isWorkTime() {
        let today = new Date();
        let workDay = !HomeStateDevice.isHoliday() && today.getDay() >= 1 && today.getDay() <= 5;
        let hour = today.getHours() + today.getMinutes() / 60 + today.getSeconds() / 3600;
        return workDay && hour >= 7.0 && hour <= 15.5;
    }

    static isHoliday() {
        return false;
    }

}

module.exports = HomeStateDevice;
