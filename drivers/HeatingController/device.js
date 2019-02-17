'use strict';

const Homey = require('homey'),
    {HomeyAPI} = require('athom-api'),
    _ = require('lodash'),
    moment = require('moment'),
    pricesLib = require('../../lib/prices'),
    nordpool = require('../../lib/nordpool'),
    heating = require('../../lib/heating');

class HeatingControllerDevice extends Homey.Device {

    onInit() {
        this.log(this.getName() + ' -> virtual device initialized');

        this._at_home = undefined;
        this._home_override = undefined;
        this._home_on_next_period = false;
        this._ho_off_next_period = false;

        this._lastFetchData = undefined;
        this._lastPrice = undefined;
        this._prices = undefined;

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
            .registerRunListener((args, state) => args.device.getCapabilityValue('onoff'));

        this.isHomeOverrideCondition = new Homey.FlowCardCondition('is_home_override')
            .register()
            .registerRunListener((args, state) => args.device.getCapabilityValue('home_override'));

        this.isNightCondition = new Homey.FlowCardCondition('is_night')
            .register()
            .registerRunListener((args, state) => args.device.getCapabilityValue('night'));

        this.isAtWorkCondition = new Homey.FlowCardCondition('is_at_work')
            .register()
            .registerRunListener((args, state) => args.device.getCapabilityValue('at_work'));

        this.isHeatingOnCondition = new Homey.FlowCardCondition('is_heating_on')
            .register()
            .registerRunListener((args, state) => args.device.getCapabilityValue('heating'));

        this._currentPriceBelowCondition = new Homey.FlowCardCondition('current_price_below');
        this._currentPriceBelowCondition
            .register()
            .registerRunListener(args => args.price > _.get(this._lastPrice, 'price'));

        this._lowPriceXhoursCondition = new Homey.FlowCardCondition('low_x_hours_of_day_condition');
        this._lowPriceXhoursCondition
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                state.prices = device._prices;
                state.low_price = true;
                return device._lowHoursComparer(args, state);
            });

        this._setAtHomeOnAction = new Homey.FlowCardAction('set_at_home_on')
            .register()
            .registerRunListener(this.onActionSetAtHomeOn.bind(this));

        this._setAtHomeOffAction = new Homey.FlowCardAction('set_at_home_off')
            .register()
            .registerRunListener(this.onActionSetAtHomeOff.bind(this));

        this._setAtHomeOffAction = new Homey.FlowCardAction('set_at_home_off_auto')
            .register()
            .registerRunListener(this.onActionSetAtHomeOffAuto.bind(this));

        this._setHomeOverrideOnAction = new Homey.FlowCardAction('set_home_override_on')
            .register()
            .registerRunListener(this.onActionSetHomeOverrideOn.bind(this));

        this._setHomeOverrideOnAction = new Homey.FlowCardAction('set_home_override_on_auto')
            .register()
            .registerRunListener(this.onActionSetHomeOverrideOnAuto.bind(this));

        this._setHomeOverrideOffAction = new Homey.FlowCardAction('set_home_override_off')
            .register()
            .registerRunListener(this.onActionSetHomeOverrideOff.bind(this));

        this._setHolidayTodayAction = new Homey.FlowCardAction('set_holiday_today')
            .register()
            .registerRunListener(this.onActionSetHolidayToday.bind(this));

        this.registerCapabilityListener('onoff', (value, opts) => {
            if (value) {
                this._homeWasSetOnTrigger.trigger(this);
            } else {
                this._homeWasSetOffTrigger.trigger(this);
            }
            this.log(this.getName() + ' -> onoff changed: ', value, opts);
            return this.checkTime(value);
        });

        this.scheduleCheckTime(10);
    }

    onActionSetAtHomeOn(args, state) {
        const device = args.device;
        device._homeWasSetOnTrigger.trigger(device);
        device.setCapabilityValue('onoff', true).catch(console.error);
        return device.checkTime(true);
    }

    onActionSetAtHomeOff(args, state) {
        const device = args.device;
        device._home_on_next_period = false;
        device._homeWasSetOffTrigger.trigger(device);
        device.setCapabilityValue('onoff', false).catch(console.error);
        return device.checkTime(false);
    }

    onActionSetAtHomeOffAuto(args, state) {
        const device = args.device;
        device._home_on_next_period = true;
        device._homeWasSetOffTrigger.trigger(device);
        device.setCapabilityValue('onoff', false).catch(console.error);
        return device.checkTime(false);
    }

    onActionSetHomeOverrideOn(args, state) {
        const device = args.device;
        device._ho_off_next_period = false;
        device._homeOverrideSetOnTrigger.trigger(device);
        device.setCapabilityValue('home_override', true).catch(console.error);
        return device.checkTime(undefined, true);
    }

    onActionSetHomeOverrideOnAuto(args, state) {
        const device = args.device;
        device._ho_off_next_period = true;
        device._homeOverrideSetOnTrigger.trigger(device);
        device.setCapabilityValue('home_override', true).catch(console.error);
        return device.checkTime(undefined, true);
    }

    onActionSetHomeOverrideOff(args, state) {
        const device = args.device;
        device._homeOverrideSetOffTrigger.trigger(device);
        device.setCapabilityValue('home_override', false).catch(console.error);
        return device.checkTime(undefined, false);
    }

    onActionSetHolidayToday(args, state) {
        const device = args.device;
        device.setSettings({holiday_today: args.holiday}).catch(console.error);
        return device.checkTime();
    }

    onAdded() {
        this.log(this.getName() + ' -> virtual device added', this.getData().id);
    }

    onDeleted() {
        this.log(this.getName() + ' -> virtual device deleted');
    }

    async checkTime(onoff, home_override) {
        this.log('checkTime with device: ', this.getData().id);
        this.clearCheckTime();

        if (onoff === false || onoff === true) {
            this._at_home = onoff;
        } else {
            this._at_home = await this.getCapabilityValue('onoff');
        }
        if (this._at_home === undefined || this._at_home === null) {
            this._at_home = true;
            this.setCapabilityValue('onoff', this._at_home).catch(console.error);
        }

        if (home_override === false || home_override === true) {
            this._home_override = home_override;
        } else {
            this._home_override = await this.getCapabilityValue('home_override');
        }
        if (this._home_override === undefined || this._home_override === null) {
            this._home_override = false;
            this.setCapabilityValue('home_override', this._home_override).catch(console.error);
        }

        const currentHour = moment().format('YYYY-MM-DD\THH');
        if (!this._prices || !this._lastFetchData || this._lastFetchData.format('YYYY-MM-DD\THH') !== currentHour) {
            return this.fetchData();
        } else if (this._prices) {
            return this.onData();
        } else {
            this.scheduleCheckTime(60);
            return Promise.resolve();
        }
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
            this.log('fetchData: got data ', this.getData().id, prices.length);
            return this.onData();
        }).catch(err => {
            console.error(err);
            this.scheduleCheckTime(60);
            return Promise.reject(err);
        });
    }

    async onData() {

        let heatingOptions = this._getHeatingOptions();
        let presence = await this._getPresence(heatingOptions);
        let calcHeating = heating.calcHeating(new Date(), this._at_home, this._home_override, heatingOptions, presence);
        let nigthAtWorkChanged = false;
        this.log('calcHeating', calcHeating);

        let curNight = await this.getCapabilityValue('night');
        if (curNight === undefined || curNight === null || calcHeating.night !== curNight) {
            nigthAtWorkChanged = true;
            this.setCapabilityValue('night', calcHeating.night).catch(console.error);
            if (calcHeating.night) {
                this._nightStartsTrigger.trigger(this);
                this.log('night starts trigger');
            } else {
                this._nightEndsTrigger.trigger(this);
                this.log('night ends trigger');
            }
        }

        let curAtWork = await this.getCapabilityValue('at_work');
        if (curAtWork === undefined || curAtWork === null || calcHeating.atWork !== curAtWork) {
            nigthAtWorkChanged = true;
            this.setCapabilityValue('at_work', calcHeating.atWork).catch(console.error);
            if (calcHeating.atWork) {
                this._atWorkStartsTrigger.trigger(this);
                this.log('at_work starts trigger');
            } else {
                this._atWorkEndsTrigger.trigger(this);
                this.log('at_work ends trigger');
            }
        }

        if (nigthAtWorkChanged) {
            let recalcHeating = false;
            if (this._home_on_next_period) {
                recalcHeating = true;
                this._home_on_next_period = false;
                this._at_home = true;
                this._homeWasSetOnTrigger.trigger(this);
                this.setCapabilityValue('onoff', true).catch(console.error);
                this.log('automatically set home mode');
            }
            if (this._ho_off_next_period) {
                recalcHeating = true;
                this._ho_off_next_period = false;
                this._home_override = false;
                this._homeOverrideSetOffTrigger.trigger(this);
                this.setCapabilityValue('home_override', false).catch(console.error);
                this.log('automatically set home override off');
            }
            if (recalcHeating) {
                calcHeating = heating.calcHeating(new Date(), this._at_home, this._home_override, heatingOptions, presence);
                this.log('calcHeating recalc', calcHeating);
            }
        }

        let curHeating = await this.getCapabilityValue('heating');
        let heatChanged = curHeating === undefined || curHeating === null || calcHeating.heating !== curHeating;
        if (heatChanged) {
            this.setCapabilityValue('heating', calcHeating.heating).catch(console.error);
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
                this.setCapabilityValue('price', currentPrice.price).catch(console.error);
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

        this.scheduleCheckTime(60);
        return Promise.resolve();
    }

    _heatingOffHighPriceComparer(args, state) {
        if (!args.high_hours || args.high_hours <= 0 || args.high_hours >= 24) {
            return false;
        }

        // Finds prices starting at 00:00 today
        let pricesNextHours = pricesLib.pricesStarting(state.prices, moment(), 0, 24);
        if (pricesNextHours.length === 0) {
            return false;
        }

        // Check if high price now.  Must be ECO mode, and will skip consecutive hours.
        let highPriceNow = pricesLib.checkHighPrice(pricesNextHours, args.high_hours, moment(), state);

        return state.high_price === false && highPriceNow.size() === 0 || state.high_price === true && highPriceNow.size() === 1;
    }

    _lowHoursComparer(args, state) {
        if (!args.low_hours || args.low_hours <= 0 || args.low_hours >= 24) {
            return false;
        }

        // Finds prices starting at 00:00 today
        let pricesNextHours = pricesLib.pricesStarting(state.prices, moment(), 0, 24);
        if (pricesNextHours.length === 0) {
            return false;
        }

        // Check if low price now
        let lowPriceNow = pricesLib.checkLowPrice(pricesNextHours, args.low_hours, moment());

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
            },
            country: settings.country,
            presenceForModes: settings.presenceForModes,
            holiday_today: settings.holiday_today
        };
    }

    async getApi() {
        if (!this._api) {
            this._api = await HomeyAPI.forCurrentHomey();
        }
        return this._api;
    }

    async getUsers() {
        try {
            const api = await this.getApi();
            return await api.users.getUsers();
        } catch (error) {
            console.error(error);
        }
    }

    async _getPresence(heatingOptions) {
        if (heatingOptions.presenceForModes) {
            let numPresent = 0;
            let users = await this.getUsers();
            if (users) {
                for (let user in users) {
                    let u = users[user];
                    if (u.present === true) {
                        numPresent++;
                    }
                }
            }
            return numPresent > 0;
        }
        return undefined;
    }

}

module.exports = HeatingControllerDevice;
