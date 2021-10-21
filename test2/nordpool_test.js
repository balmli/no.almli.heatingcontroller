'use strict';

const dayjs = require('dayjs');
const _ = require('lodash');
const days = require('../lib/days');
const nordpool = require('../lib/nordpool');
const heating = require('../lib/heating');
const pricesLib = require('../lib/prices');

const handleData = function (prices, low_hours, num_hours) {
    const localTime = dayjs().tz();

    let pricesNextHours = pricesLib.pricesStarting(prices, localTime, 0, 24);
    console.log('pricesNextHours', localTime.format(), prices.length, pricesNextHours.length);
    console.log('pricesNextHours ' + num_hours + ' hours ', pricesNextHours.map(p => ({
        startsAt: p.startsAt.toISOString(),
        startsAtLocal: p.startsAt.format(),
        price: p.price
    })));

    let pricesSorted = _.sortBy(pricesNextHours, ['price']);
    //console.log('pricesSorted ', pricesSorted);

    let lowHours = _(pricesSorted).take(low_hours).value();
    //console.log('lowHours ', lowHours);

    let onNow = _(lowHours)
        .filter(p => p.startsAt.isBefore(localTime) && p.startsAt.add(1, 'hour').startOf('hour').isAfter(localTime))
        .size();

    console.log('onNow ', onNow);

    const startingAt = localTime.startOf('day');

    let onNowOrOff = _(prices)
        .filter(p => p.startsAt.isSameOrAfter(startingAt))
        .take(num_hours)
        .sortBy(['price'])
        .take(low_hours)
        .filter(p => p.startsAt.isBefore(localTime) && p.startsAt.add(1, 'hour').startOf('hour').isAfter(localTime))
        .value();

    console.log('onNowOrOff ', startingAt, onNowOrOff);
};

const findHeatingOffWhenHighPrices = function (prices, high_hours, num_hours, heatingOptions) {
    const localTime = dayjs().tz();

    let pricesNextHours = pricesLib.pricesStarting(prices, localTime, 0, 24);

    let heatingOffWithHighPrices = _(pricesNextHours)
        .map(p => {
            p.heating = heating.calcHeating(p.startsAt, true, false, heatingOptions);
            return p;
        })
        .filter(p => p.heating.heating === false)
        .filter((p, idx) => idx % 2 === 0)
        .sortBy(['price'])
        .reverse()
        .take(high_hours)
        .value();
    console.log('heatingOffWithHighPrices ', heatingOffWithHighPrices.length, heatingOffWithHighPrices.map(p => ({
        startsAt: p.startsAt.toISOString(),
        startsAtLocal: p.startsAt.format(),
        price: p.price,
        heating: p.heating
    })));
};

const testNordpool = function ({priceArea, currency, country, timeZone}) {
    days.setTimeZone(timeZone);

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

    const localTime = dayjs().tz().startOf('day');

    nordpool.fetchPrices(localTime, { priceArea, currency })
      .then(prices => {
        handleData(prices, 18, 24);
        findHeatingOffWhenHighPrices(prices, 6, 24, heatingOptions);
      }).catch(console.error);

}

module.exports = {
    testNordpool
};
