'use strict';

const Homey = require('homey'),
    _ = require('lodash'),
    moment = require('moment'),
    nordpool = require('../../lib/nordpool'),
    heating = require('../../lib/heating');

let heatingOptions = {
    workday: {
        startHour: 5,
        endHour: 22.5,
    },
    notWorkday: {
        startHour: 7,
        endHour: 23,
    },
    workHours: {
        startHour: 7,
        endHour: 14
    }
};

class HeatingControllerDevice extends Homey.Device {

    onInit() {
        this.log(this.getName() + ' -> virtual device initialized');

        this._at_home = undefined;
        this._home_override = undefined;

        this._lastFetchData = undefined;
        this._lastPrice = undefined;
        this._prices = undefined;

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

        this._priceChangedTrigger = new Homey.FlowCardTriggerDevice('price_changed');
        this._priceChangedTrigger.register();

        this._setLowPriceHeatOnTrigger = new Homey.FlowCardTriggerDevice('low_price_heating');
        this._setLowPriceHeatOnTrigger
            .register()
            .registerRunListener(this._lowHoursComparer.bind(this));

        this._setLowPriceHeatOffTrigger = new Homey.FlowCardTriggerDevice('low_price_heating');
        this._setLowPriceHeatOffTrigger
            .register()
            .registerRunListener(this._lowHoursComparer.bind(this));

        this._lowHoursOnTrigger = new Homey.FlowCardTriggerDevice('low_x_hours_of_day');
        this._lowHoursOnTrigger
            .register()
            .registerRunListener(this._lowHoursComparer.bind(this));

        this._lowHoursOffTrigger = new Homey.FlowCardTriggerDevice('low_x_hours_of_day');
        this._lowHoursOffTrigger
            .register()
            .registerRunListener(this._lowHoursComparer.bind(this));

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

        this.isNightCondition = new Homey.FlowCardCondition('is_night')
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

        this.scheduleCheckTime(10);
    }

    onAdded() {
        this.log(this.getName() + ' -> virtual device added', this.getData().id);
    }

    onDeleted() {
        this.log(this.getName() + ' -> virtual device deleted');
    }

    async checkTime(onoff, home_override) {
        this.clearCheckTime();

        if (onoff === false || onoff === true) {
            this._at_home = onoff;
        } else {
            this._at_home = await this.getCapabilityValue('onoff');
        }
        if (!this._at_home) {
            this._at_home = true;
            this.setCapabilityValue('onoff', this._at_home);
        }

        if (home_override === false || home_override === true) {
            this._home_override = home_override;
        } else {
            this._home_override = await this.getCapabilityValue('home_override');
        }
        if (!this._home_override) {
            this._home_override = false;
            this.setCapabilityValue('home_override', this._home_override);
        }

        const currentHour = moment().format('YYYY-MM-DD\THH');
        if (!this._prices || !this._lastFetchData || this._lastFetchData.format('YYYY-MM-DD\THH') !== currentHour) {
            this.fetchData();
        } else if (this._prices) {
            this.onData();
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

    async fetchData() {
        let settings = this.getSettings();
        let priceArea = settings.priceArea || 'Oslo';
        let currency = settings.currency || 'NOK';
        this.log('fetchData: ', this.getData().id, settings, priceArea);
        Promise.all([
            nordpool.getHourlyPrices(moment(), {priceArea: priceArea, currency: currency}),
            nordpool.getHourlyPrices(moment().add(1, 'days'), {priceArea: priceArea, currency: currency})
        ]).then(result => {
            let prices = result[0];
            Array.prototype.push.apply(prices, result[1]);
            this._lastFetchData = moment();
            this._prices = prices;
            return this.onData();
        }).catch(err => {
            console.error(err);
        });
    }

    async onData() {

        let calcHeating = heating.calcHeating(new Date(), this._at_home, this._home_override, heatingOptions);
        this.log('calcHeating', calcHeating);

        let curNight = await this.getCapabilityValue('night');
        if (!curNight || calcHeating.night !== curNight) {
            this.setCapabilityValue('night', calcHeating.night);
            if (calcHeating.night) {
                this._nightStartsTrigger.trigger(this);
                this.log('night starts trigger');
            } else {
                this._nightEndsTrigger.trigger(this);
                this.log('night ends trigger');
            }
        }

        let curAtWork = await this.getCapabilityValue('at_work');
        if (!curAtWork || calcHeating.atWork !== curAtWork) {
            this.setCapabilityValue('at_work', calcHeating.atWork);
            if (calcHeating.atWork) {
                this._atWorkStartsTrigger.trigger(this);
                this.log('at_work starts trigger');
            } else {
                this._atWorkEndsTrigger.trigger(this);
                this.log('at_work ends trigger');
            }
        }

        let curHeating = await this.getCapabilityValue('heating');
        let heatChanged = !curHeating || calcHeating.heating !== curHeating;
        if (heatChanged) {
            this.setCapabilityValue('heating', calcHeating.heating);
            if (calcHeating.heating) {
                this._setHeatOnTrigger.trigger(this);
                this.log('heatOnTrigger');
            } else {
                this._setHeatOffTrigger.trigger(this);
                this.log('heatOffTrigger');
            }
        }

        const currentHour = moment().format('YYYY-MM-DD\THH');
        const currentPrice = this._prices.find(p => moment(p.startsAt).format('YYYY-MM-DD\THH') === currentHour);

        this.log('currentPrice', currentPrice.startsAt, currentPrice.price);

        let priceChanged = !this._lastPrice || currentPrice.startsAt !== this._lastPrice.startsAt;
        if (priceChanged) {
            this._lastPrice = currentPrice;
            this._priceChangedTrigger.trigger(this, currentPrice);
            this.setCapabilityValue("price", currentPrice.price).catch(console.error);
            this.log('price_changed trigger', currentPrice);
        }

        if (priceChanged || heatChanged) {
            this._setLowPriceHeatOnTrigger.trigger(this, {
                onoff: true
            }, {
                heating: calcHeating.heating,
                onofftrigger: true,
                prices: this._prices
            }).catch(console.error);

            this._setLowPriceHeatOffTrigger.trigger(this, {
                onoff: false
            }, {
                heating: calcHeating.heating,
                onofftrigger: false,
                prices: this._prices
            }).catch(console.error);
        }

        if (priceChanged) {
            this._lowHoursOnTrigger.trigger(this, {
                onoff: true
            }, {
                heating: undefined,
                onofftrigger: true,
                prices: this._prices
            }).catch(console.error);

            this._lowHoursOffTrigger.trigger(this, {
                onoff: false
            }, {
                heating: undefined,
                onofftrigger: false,
                prices: this._prices
            }).catch(console.error);
        }
    }

    _lowHoursComparer(args, state) {
        if (!args.low_hours) {
            return false;
        }

        const now = moment();
        const startingAt = moment().hours(0).minutes(0).second(0).millisecond(0);

        // Finds prices starting at 00:00 today
        let pricesNextHours = _(state.prices)
            .filter(p => moment(p.startsAt).isSameOrAfter(startingAt))
            .take(24)
            .value();
        if (pricesNextHours.length === 0) {
            return false;
        }

        // Search for X lowest prices
        let onNowOrOff = _(pricesNextHours)
            .sortBy(['price'])
            .take(args.low_hours)
            .filter(p => moment(p.startsAt).isBefore(now) && moment(p.startsAt).add(1, 'hours').minutes(0).second(0).millisecond(0).isAfter(now));

        // Will trig if onofftrigger is true and found, or onofftrigger is false and not found
        return (state.heating === undefined || state.heating === true) && state.onofftrigger === true && onNowOrOff.size() === 1 ||
            (state.heating === undefined || state.heating === false) && state.onofftrigger === false && onNowOrOff.size() === 0;
    }

}

module.exports = HeatingControllerDevice;
