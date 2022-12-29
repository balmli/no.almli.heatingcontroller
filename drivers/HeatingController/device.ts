import {Device} from "homey";
import moment from 'moment-timezone';

import {
    heating,
    HeatingOptions,
    HolidayToday,
    NordpoolPrice,
    NordpoolPrices,
    PriceApi,
    PriceComparer,
    PriceFetcher,
    PriceFetcherMethod,
    PricesFetchClient
} from '@balmli/homey-utility-prices'

const Logger = require('../../lib/Logger');

module.exports = class HeatingControllerDevice extends Device {

    logger: any;
    priceApi = new PriceApi()
    priceComparer = new PriceComparer(this.priceApi)
    pricesFetchClient = new PricesFetchClient({logger: this.log});
    priceFetcher!: PriceFetcher;

    _at_home?: boolean;
    _home_override?: boolean;
    _home_on_next_period?: boolean;
    _ho_off_next_period?: boolean;
    _lastPrice?: NordpoolPrice;
    _prices?: NordpoolPrices;
    _deleted?: boolean;

    checkTimeout?: NodeJS.Timeout;

    async onInit() {
        this.logger = new Logger({
            logFunc: this.log,
            errorFunc: this.error,
        });
        await this.migrate();
        await this.fixPrice(this.getSetting('currency'));
        this._at_home = undefined;
        this._home_override = undefined;
        this._home_on_next_period = false;
        this._ho_off_next_period = false;

        this._lastPrice = undefined;
        this._prices = undefined;

        this.registerCapabilityListener('onoff', async (value: any, opts: any) => {
            this.log(this.getName() + ' -> onoff changed: ', value, opts);
            await this.doCheckTime({onoff: value});
            if (value) {
                this.homey.flow.getDeviceTriggerCard('home_was_set_on').trigger(this, {}).catch(this.error);
            } else {
                this.homey.flow.getDeviceTriggerCard('home_was_set_off').trigger(this, {}).catch(this.error);
            }
        });

        this.priceFetcher = new PriceFetcher({
            logger: this.logger,
            pricesFetchClient: this.pricesFetchClient,
            // @ts-ignore
            utilityBillApi: this.homey.app.utilityBillApi,
            device: this,
        });
        this.priceFetcher.on('prices', this.pricesEvent.bind(this));
        this.priceFetcher.on('priceChanged', this.pricesChangedEvent.bind(this));
        this.setFetcherOptions(this.getSettings());
        this.priceFetcher.start();
        this.scheduleCheckTime(5);
        this.log(this.getName() + ' -> device initialized');
    }

    setFetcherOptions(settings: any) {
        this.priceFetcher.setNordpoolOptions({currency: settings.currency, priceArea: settings.priceArea});
        this.priceFetcher.setFetchMethod(settings.pricesFromUtilityBill ?
            PriceFetcherMethod.utilityPriceClient :
            PriceFetcherMethod.nordpool);

        let syncTime = this.getStoreValue('syncTime');
        if (syncTime === undefined || syncTime === null) {
            syncTime = Math.round(Math.random() * 3600);
            this.setStoreValue('syncTime', syncTime).catch((err: any) => this.log(err));
        }
        this.priceFetcher.setFetchTime(syncTime);
    }

    async migrate() {
        try {
            if (!this.hasCapability('price_ratio')) {
                await this.addCapability('price_ratio');
            }
            this.log(this.getName() + ' -> migrated OK');
        } catch (err) {
            this.error(err);
        }
    }

    async fixPrice(selectedCurrency: string): Promise<void> {
        try {
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
        } catch (err) {
            this.error(err);
        }
    }

    async onSettings({oldSettings, newSettings, changedKeys}: {
        oldSettings: any;
        newSettings: any;
        changedKeys: string[];
    }): Promise<string | void> {
        if (changedKeys.includes('currency') ||
            changedKeys.includes('priceArea') ||
            changedKeys.includes('pricesFromUtilityBill')) {
            await this.fixPrice(newSettings.currency);
            this._lastPrice = undefined;
            this.setFetcherOptions(newSettings);
            this.pricesFetchClient.clearStorage(this);
            this.priceFetcher.start();
            this.scheduleCheckTime(5);
        }
    }

    async onActionSetAtHomeOn() {
        await this.setCapabilityValue('onoff', true).catch(this.error);
        await this.homey.flow.getDeviceTriggerCard('home_was_set_on').trigger(this, {}).catch(this.error);
        return this.doCheckTime({onoff: true});
    }

    async onActionSetAtHomeOff() {
        this._home_on_next_period = false;
        await this.setCapabilityValue('onoff', false).catch(this.error);
        await this.homey.flow.getDeviceTriggerCard('home_was_set_off').trigger(this, {}).catch(this.error);
        return this.doCheckTime({onoff: false});
    }

    async onActionSetAtHomeOffAuto() {
        this._home_on_next_period = true;
        await this.setCapabilityValue('onoff', false).catch(this.error);
        await this.homey.flow.getDeviceTriggerCard('home_was_set_off').trigger(this, {}).catch(this.error);
        return this.doCheckTime({onoff: false});
    }

    async onActionSetHomeOverrideOn() {
        this._ho_off_next_period = false;
        await this.setCapabilityValue('home_override', true).catch(this.error);
        await this.homey.flow.getDeviceTriggerCard('homeoverride_set_on').trigger(this, {}).catch(this.error);
        return this.doCheckTime({home_override: true});
    }

    async onActionSetHomeOverrideOnAuto() {
        this._ho_off_next_period = true;
        await this.setCapabilityValue('home_override', true).catch(this.error);
        await this.homey.flow.getDeviceTriggerCard('homeoverride_set_on').trigger(this, {}).catch(this.error);
        return this.doCheckTime({home_override: true});
    }

    async onActionSetHomeOverrideOff() {
        await this.setCapabilityValue('home_override', false).catch(this.error);
        await this.homey.flow.getDeviceTriggerCard('home_override_set_off').trigger(this, {}).catch(this.error);
        return this.doCheckTime({home_override: false});
    }

    async onActionSetHolidayToday(args: any) {
        await this.setSettings({holiday_today: args.holiday}).catch(this.error);
        return this.doCheckTime();
    }

    async onActionClearHolidayToday() {
        await this.setSettings({holiday_today: ''}).catch(this.error);
        return this.doCheckTime();
    }

    onAdded() {
        this.log(this.getName() + ' -> device added', this.getData().id);
    }

    onDeleted() {
        this._deleted = true;
        this.priceFetcher.destroy();
        this.clearCheckTime();
        this.log(this.getName() + ' -> device deleted');
    }

    pricesEvent(prices: NordpoolPrices) {
        this._prices = prices;
        this.priceComparer.updatePrices(prices);
    }

    async pricesChangedEvent(currentPrice: NordpoolPrice) {
    }

    clearCheckTime() {
        if (this.checkTimeout) {
            this.homey.clearTimeout(this.checkTimeout);
            this.checkTimeout = undefined;
        }
    }

    scheduleCheckTime(seconds = 60) {
        if (this._deleted) {
            return;
        }
        this.clearCheckTime();
        this.log(`Checking time in ${seconds} seconds`);
        this.checkTimeout = this.homey.setTimeout(this.doCheckTime.bind(this), seconds * 1000);
    }

    async doCheckTime(props: any = {}) {
        const onoff = props.onoff;
        const home_override = props.home_override;
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
                await this.setCapabilityValue('onoff', this._at_home).catch(this.error);
            }

            if (home_override === false || home_override === true) {
                this._home_override = home_override;
            } else {
                this._home_override = this.getCapabilityValue('home_override');
            }
            if (this._home_override === undefined || this._home_override === null) {
                this._home_override = false;
                await this.setCapabilityValue('home_override', this._home_override).catch(this.error);
            }

            await this.onCheckData();
        } catch (err) {
            this.error(err);
        } finally {
            this.scheduleCheckTime();
        }
    }

    async onCheckData() {
        if (!this._prices) {
            return;
        }
        try {
            const localTime = moment();
            const heatingOptions = this._getHeatingOptions();
            let calcHeating = heating.calcHeating(localTime, this._at_home, this._home_override, heatingOptions);
            this.log('Heating:', calcHeating);

            const curNight = this.getCapabilityValue('night');
            let nightChanged = false;
            if (curNight === undefined || curNight === null || calcHeating.night !== curNight) {
                nightChanged = true;
                await this.setCapabilityValue('night', calcHeating.night).catch(this.error);
            }

            const curAtWork = this.getCapabilityValue('at_work');
            let atWorkChanged = false;
            if (curAtWork === undefined || curAtWork === null || calcHeating.atWork !== curAtWork) {
                atWorkChanged = true;
                await this.setCapabilityValue('at_work', calcHeating.atWork).catch(this.error);
            }

            if (nightChanged || atWorkChanged) {
                let recalcHeating = false;
                if (this._home_on_next_period) {
                    recalcHeating = true;
                    this._home_on_next_period = false;
                    this._at_home = true;
                    await this.setCapabilityValue('onoff', true).catch(this.error);
                    await this.homey.flow.getDeviceTriggerCard('home_was_set_on').trigger(this, {}).catch(this.error);
                    this.log('Automatically set home mode');
                }
                if (this._ho_off_next_period) {
                    recalcHeating = true;
                    this._ho_off_next_period = false;
                    this._home_override = false;
                    await this.setCapabilityValue('home_override', false).catch(this.error);
                    await this.homey.flow.getDeviceTriggerCard('home_override_set_off').trigger(this, {}).catch(this.error);
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
                await this.setCapabilityValue('heating', calcHeating.heating).catch(this.error);
            }

            const currentPrice = this.priceApi.currentPrice(this._prices, localTime);
            const startAtHour = currentPrice ? this.priceApi.toHour(currentPrice.startsAt) : undefined;
            const priceRatio = this.priceApi.priceRatio(this._prices, localTime);
            const price = currentPrice ? currentPrice.price : undefined;
            let priceChanged = false;

            if (currentPrice) {
                this.log('Current price:', startAtHour, price);

                priceChanged = !this._lastPrice || startAtHour !== this.priceApi.toHour(this._lastPrice.startsAt);
                this._lastPrice = currentPrice;
                const priceCapability = `price_${this.getSetting('currency')}`;
                if (this.hasCapability(priceCapability)) {
                    await this.setCapabilityValue(priceCapability, price).catch(this.error);
                }
                if (priceRatio !== undefined && this.hasCapability('price_ratio')) {
                    await this.setCapabilityValue('price_ratio', priceRatio).catch(this.error);
                }
            }

            if (nightChanged) {
                if (calcHeating.night) {
                    await this.homey.flow.getDeviceTriggerCard('night_starts').trigger(this, {}).catch(this.error);
                    this.log('Night starts trigger');
                } else {
                    await this.homey.flow.getDeviceTriggerCard('night_ends').trigger(this, {}).catch(this.error);
                    this.log('Night ends trigger');
                }
            }

            if (atWorkChanged) {
                if (calcHeating.atWork) {
                    await this.homey.flow.getDeviceTriggerCard('at_work_starts').trigger(this, {}).catch(this.error);
                    this.log('At work starts trigger');
                } else {
                    await this.homey.flow.getDeviceTriggerCard('at_work_ends').trigger(this, {}).catch(this.error);
                    this.log('At work ends trigger');
                }
            }

            if (heatChanged) {
                if (calcHeating.heating) {
                    await this.homey.flow.getDeviceTriggerCard('comfort_mode').trigger(this, {}).catch(this.error);
                    this.log('Comfort mode trigger');
                } else {
                    await this.homey.flow.getDeviceTriggerCard('eco_mode').trigger(this, {}).catch(this.error);
                    this.log('ECO mode trigger');
                }
            }

            if (priceChanged) {
                const sorted = this.priceApi.pricesSorted(this._prices, localTime);
                const priceMin = sorted.length > 0 ? sorted[0].price : undefined;
                const priceMax = sorted.length > 0 ? sorted[sorted.length - 1].price : undefined;
                const priceLevel = this.priceApi.priceLevel(this._prices, localTime);
                await this.homey.flow.getDeviceTriggerCard('price_changed').trigger(this, {
                    price,
                    heating: calcHeating.heating,
                    priceRatio,
                    priceMin,
                    priceMax,
                    priceLevel: priceLevel ? priceLevel.code : '',
                    priceLevelDescr: priceLevel ? priceLevel.description : '',
                }).catch(this.error);
                this.log('Price changed trigger', startAtHour, price, priceRatio);
            }

            if (priceChanged || heatChanged) {
                await this.homey.flow.getDeviceTriggerCard('high_x_hours_of_day').trigger(this, {
                    heating: calcHeating.heating,
                    high_price: true
                }, {
                    atHome: this._at_home,
                    homeOverride: this._home_override,
                    high_price: true,
                    heatingOptions: heatingOptions
                }).catch(this.error);

                await this.homey.flow.getDeviceTriggerCard('high_x_hours_of_day').trigger(this, {
                    heating: calcHeating.heating,
                    high_price: false
                }, {
                    atHome: this._at_home,
                    homeOverride: this._home_override,
                    high_price: false,
                    heatingOptions: heatingOptions
                }).catch(this.error);

                await this.homey.flow.getDeviceTriggerCard('low_x_hours_of_day').trigger(this, {
                    heating: calcHeating.heating,
                    low_price: true
                }, {
                    low_price: true
                }).catch(this.error);

                await this.homey.flow.getDeviceTriggerCard('low_x_hours_of_day').trigger(this, {
                    heating: calcHeating.heating,
                    low_price: false
                }, {
                    low_price: false
                }).catch(this.error);
            }
        } catch (err) {
            this.error(err);
        }
    }

    _getHeatingOptions(): HeatingOptions {
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
            holiday_today: settings.holiday_today === 'holiday' ? HolidayToday.holiday :
                settings.holiday_today === 'not_holiday' ? HolidayToday.not_holiday :
                    HolidayToday.automatic
        };
    }

};
