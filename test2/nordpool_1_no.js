'use strict';

const dayjs = require('dayjs');
const _ = require('lodash');
const days = require('../lib/days');
const nordpool = require('../lib/nordpool');
const heating = require('../lib/heating');
const pricesLib = require('../lib/prices');

days.setTimeZone('Europe/Oslo');

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
    },
    country: 'NO'
};

let handleData = function (prices, low_hours, num_hours) {
    const high_hours = num_hours - low_hours;
    const localTime = dayjs().tz();

    let pricesNextHours = pricesLib.pricesStarting(prices, localTime, 0, 24);
    console.log('pricesNextHours', localTime, pricesNextHours.length);
    console.log('pricesNextHours ' + num_hours + ' hours ', pricesNextHours);

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

let findHeatingOffWhenHighPrices = function (prices, high_hours, num_hours) {
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
    console.log('heatingOffWithHighPrices ', heatingOffWithHighPrices.length, heatingOffWithHighPrices);

    let onNowOrOff = _(heatingOffWithHighPrices)
        .filter(p => p.startsAt.isBefore(localTime) && p.startsAt.add(1, 'hour').startOf('hour').isAfter(localTime));

    console.log('onNowOrOff ', onNowOrOff.value());

};

const localTime = dayjs().tz().startOf('day');

Promise.all([
    nordpool.getHourlyPrices(localTime, {priceArea: 'Bergen', currency: 'NOK'}),
    nordpool.getHourlyPrices(localTime.add(1, 'day'), {priceArea: 'Bergen', currency: 'NOK'})
]).then(result => {
    let prices = result[0];
    Array.prototype.push.apply(prices, result[1]);
    handleData(prices, 18, 24);
    findHeatingOffWhenHighPrices(prices, 6, 24);
}).catch(console.error);



