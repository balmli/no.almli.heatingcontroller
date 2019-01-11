'use strict';

const Homey = require('homey'),
    _ = require('lodash'),
    moment = require('moment'),
    nordpool = require('../../lib/nordpool'),
    heating = require('../../lib/heating');

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

        this._comfortModeTrigger = new Homey.FlowCardTriggerDevice('comfort_mode');
        this._comfortModeTrigger.register();

        this._ecoModeTrigger = new Homey.FlowCardTriggerDevice('eco_mode');
        this._ecoModeTrigger.register();

        this._priceChangedTrigger = new Homey.FlowCardTriggerDevice('price_changed');
        this._priceChangedTrigger.register();

        this._highPriceTrueTrigger = new Homey.FlowCardTriggerDevice('high_x_hours_of_day');
        this._highPriceTrueTrigger
            .register()
            .registerRunListener(this._heatingOffHighPriceComparer.bind(this));

        this._highPriceFalseTrigger = new Homey.FlowCardTriggerDevice('high_x_hours_of_day');
        this._highPriceFalseTrigger
            .register()
            .registerRunListener(this._heatingOffHighPriceComparer.bind(this));

        this._lowPriceTrueTrigger = new Homey.FlowCardTriggerDevice('low_x_hours_of_day');
        this._lowPriceTrueTrigger
            .register()
            .registerRunListener(this._lowHoursComparer.bind(this));

        this._lowPriceFalseTrigger = new Homey.FlowCardTriggerDevice('low_x_hours_of_day');
        this._lowPriceFalseTrigger
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
        this.log('fetchData: ', this.getData().id, priceArea, currency);
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

        let heatingOptions = this._getHeatingOptions();
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
                this._comfortModeTrigger.trigger(this);
                this.log('comfortModeTrigger');
            } else {
                this._ecoModeTrigger.trigger(this);
                this.log('ecoModeTrigger');
            }
        }

        const currentHour = moment().format('YYYY-MM-DD\THH');
        const currentPrice = this._prices.find(p => moment(p.startsAt).format('YYYY-MM-DD\THH') === currentHour);

        if (currentPrice && currentPrice.price) {
            this.log('currentPrice', currentPrice.startsAt, currentPrice.price);

            let priceChanged = !this._lastPrice || currentPrice.startsAt !== this._lastPrice.startsAt;
            if (priceChanged) {
                this._lastPrice = currentPrice;
                this._priceChangedTrigger.trigger(this, currentPrice);
                this.setCapabilityValue("price", currentPrice.price).catch(console.error);
                this.log('price_changed trigger', currentPrice);
            }

            if (priceChanged || heatChanged) {
                this._highPriceTrueTrigger.trigger(this, {
                    heating: calcHeating.heating,
                    high_price: true
                }, {
                    atHome: this._at_home,
                    homeOverride: this._home_override,
                    heating: calcHeating.heating,
                    high_price: true,
                    heatingOptions: heatingOptions,
                    prices: this._prices
                }).catch(console.error);

                this._highPriceFalseTrigger.trigger(this, {
                    heating: calcHeating.heating,
                    high_price: false
                }, {
                    atHome: this._at_home,
                    homeOverride: this._home_override,
                    heating: calcHeating.heating,
                    high_price: false,
                    heatingOptions: heatingOptions,
                    prices: this._prices
                }).catch(console.error);

                this._lowPriceTrueTrigger.trigger(this, {
                    heating: calcHeating.heating,
                    low_price: true
                }, {
                    atHome: this._at_home,
                    homeOverride: this._home_override,
                    heating: calcHeating.heating,
                    low_price: true,
                    heatingOptions: heatingOptions,
                    prices: this._prices
                }).catch(console.error);

                this._lowPriceFalseTrigger.trigger(this, {
                    heating: calcHeating.heating,
                    low_price: false
                }, {
                    atHome: this._at_home,
                    homeOverride: this._home_override,
                    heating: calcHeating.heating,
                    low_price: false,
                    heatingOptions: heatingOptions,
                    prices: this._prices
                }).catch(console.error);
            }
        }
    }

    _heatingOffHighPriceComparer(args, state) {
        if (!args.high_hours || args.high_hours <= 0 || args.high_hours >= 24) {
            return false;
        }

        // Finds prices starting at 00:00 today
        const startingAt = moment().hours(0).minutes(0).second(0).millisecond(0);
        let pricesNextHours = _(state.prices)
            .filter(p => moment(p.startsAt).isSameOrAfter(startingAt))
            .take(24)
            .value();
        if (pricesNextHours.length === 0) {
            return false;
        }

        // Check if high price now.  Must be ECO mode, and will skip consecutive hours.
        const now = moment();
        let highPriceNow = _(pricesNextHours)
            .map(p => {
                p.heating = heating.calcHeating(moment(p.startsAt).toDate(), state.atHome, state.homeOverride, state.heatingOptions);
                return p;
            })
            .filter(p => p.heating.heating === false)
            .filter((p, idx) => idx % 2 === 0)
            .sortBy(['price'])
            .reverse()
            .take(args.high_hours)
            .filter(p => moment(p.startsAt).isBefore(now) && moment(p.startsAt).add(1, 'hours').minutes(0).second(0).millisecond(0).isAfter(now));

        return state.high_price === false && highPriceNow.size() === 0 || state.high_price === true && highPriceNow.size() === 1;
    }

    _lowHoursComparer(args, state) {
        if (!args.low_hours || args.low_hours <= 0 || args.low_hours >= 24) {
            return false;
        }

        // Finds prices starting at 00:00 today
        const startingAt = moment().hours(0).minutes(0).second(0).millisecond(0);
        let pricesNextHours = _(state.prices)
            .filter(p => moment(p.startsAt).isSameOrAfter(startingAt))
            .take(24)
            .value();
        if (pricesNextHours.length === 0) {
            return false;
        }

        // Check if low price now
        const now = moment();
        let lowPriceNow = _(pricesNextHours)
            .sortBy(['price'])
            .take(args.low_hours)
            .filter(p => moment(p.startsAt).isBefore(now) && moment(p.startsAt).add(1, 'hours').minutes(0).second(0).millisecond(0).isAfter(now));

        return state.low_price === true && lowPriceNow.size() === 1 || state.low_price === false && lowPriceNow.size() === 0;
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
            }
        };
    }

}

module.exports = HeatingControllerDevice;
