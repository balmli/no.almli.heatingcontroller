'use strict';

const moment = require('../lib/moment-timezone-with-data');
const days = require('../lib/days');
const nordpool = require('../lib/nordpool');
const heating = require('../lib/heating');
const pricesLib = require('../lib/prices');

const handleData = function (prices, low_hours, num_hours) {
    const localTime = moment();

    let pricesNextHours = pricesLib.pricesStarting(prices, localTime, 0, 24);
    console.log('pricesNextHours', localTime.format(), prices.length, pricesNextHours.length);
    console.log('pricesNextHours ' + num_hours + ' hours ', pricesNextHours);

    let pricesSorted = pricesNextHours
      .sort((a,b) => a.price - b.price);
    //console.log('pricesSorted ', pricesSorted);

    let lowHours = pricesSorted.slice(0, low_hours);
    //console.log('lowHours ', lowHours);

    let onNow = lowHours
        .filter(p => p.startsAt.isBefore(localTime) && moment(p.startsAt).add(1, 'hour').startOf('hour').isAfter(localTime))
        .length

    console.log('onNow ', onNow);

    const startingAt = localTime.startOf('day');

  let onNowOrOff = prices
    .filter(p => p.startsAt.isSameOrAfter(startingAt))
    .slice(0, num_hours)
    .sort((a, b) => a.price - b.price)
    .slice(0, lowHours)
    .filter(p => p.startsAt.isBefore(localTime) && moment(p.startsAt).add(1, 'hour').startOf('hour').isAfter(localTime));

    console.log('onNowOrOff ', startingAt, onNowOrOff);
};

const findHeatingOffWhenHighPrices = function (prices, high_hours, num_hours, heatingOptions) {
    const localTime = moment();

    let pricesNextHours = pricesLib.pricesStarting(prices, localTime, 0, 24);

    let heatingOffWithHighPrices = pricesNextHours
        .map(p => {
            p.heating = heating.calcHeating(p.startsAt, true, false, heatingOptions);
            return p;
        })
        .filter(p => p.heating.heating === false)
        .filter((p, idx) => idx % 2 === 0)
      .sort((a,b) => b.price - a.price)
        .slice(0, high_hours);

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

    const localTime = moment().startOf('day');

    nordpool.fetchPrices(localTime, { priceArea, currency })
      .then(prices => {
        handleData(prices, 18, 24);
        findHeatingOffWhenHighPrices(prices, 6, 24, heatingOptions);
      }).catch(console.error);

}

module.exports = {
    testNordpool
};
