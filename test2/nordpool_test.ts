import moment from 'moment-timezone';

import {heating, NordpoolApi, PriceApi} from '@balmli/homey-utility-prices';

const priceApi = new PriceApi()
const nordpool = new NordpoolApi()

export const testNordpool = async function (
    {priceArea, currency, country, timeZone, date}:
        { priceArea: string, currency: string, country: string, timeZone: string, date?: string }
) {
    try {
        moment.tz.setDefault(timeZone);

        const localTime = (date ? moment(date) : moment()).startOf('day');
        const atHome = true;
        const homeOverride = false;
        const heatingOptions = {
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
            },
            country
        };
        const state = {atHome, homeOverride, heatingOptions};

        console.log('localTime:', localTime);

        const prices = await nordpool.fetchPrices(localTime, {priceArea, currency});
        console.log('prices:', prices.length, prices);

        const pricesNextHours = priceApi.pricesStarting(prices, localTime, 0, 24);

        pricesNextHours
            .map((p: any) => {
                p.heating = heating.calcHeating(p.startsAt, atHome, homeOverride, heatingOptions);
                p.lowPrice22Hours = priceApi.checkLowPrice(pricesNextHours, 22, p.startsAt).length === 1;
                p.highPrice6Hours = priceApi.checkHighPrice2(pricesNextHours, 6, p.startsAt, state).length === 1;
                return p;
            });
        console.log('pricesNextHours:', pricesNextHours.length, pricesNextHours);

        const heatingOffWithHighPrices = priceApi.checkHighPrice2(pricesNextHours, 6, localTime, state, false);
        console.log('heatingOffWithHighPrices:', heatingOffWithHighPrices.length, heatingOffWithHighPrices);

    } catch (err) {
        console.log('Error:', err);
    }
}
