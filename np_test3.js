'use strict';

const moment = require('moment-timezone');
const nordpool = require('./lib/nordpool');
const _ = require('lodash');
const heating = require('./lib/heating');

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

let handleData = function (prices, low_hours, num_hours, starting) {
    const high_hours = num_hours - low_hours;
    const startingAt = moment().hours(starting).minutes(0).second(0).millisecond(0);

    let pricesNextHours = _(prices)
        .filter(p => moment(p.startsAt).isSameOrAfter(startingAt))
        .take(num_hours)
        .value();

    console.log('pricesNextHours', pricesNextHours.length);
    //console.log('pricesNextHours ' + num_hours + ' hours starting ' + starting, pricesNextHours);

    let pricesSorted = _.sortBy(pricesNextHours, ['price']);
    //console.log('pricesSorted ', pricesSorted);

    let lowHours = _(pricesSorted).take(low_hours).value();
    //console.log('lowHours ', lowHours);

    const now = moment();
    let onNow = _(lowHours)
        .filter(p => moment(p.startsAt).isBefore(now) && moment(p.startsAt).add(1, 'hours').minutes(0).second(0).millisecond(0).isAfter(now))
        .size();

    console.log('onNow ', onNow);

    let onNowOrOff = _(prices)
        .filter(p => moment(p.startsAt).isSameOrAfter(startingAt))
        .take(num_hours)
        .sortBy(['price'])
        .take(low_hours)
        .filter(p => moment(p.startsAt).isBefore(now) && moment(p.startsAt).add(1, 'hours').minutes(0).second(0).millisecond(0).isAfter(now))
        .value();

    console.log('onNowOrOff ', onNowOrOff);
};

let findHeatingOffWhenHighPrices = function (prices, high_hours, num_hours, starting) {
    const now = moment();
    const startingAt = moment().hours(starting).minutes(0).second(0).millisecond(0);
    let pricesNextHours = _(prices)
        .filter(p => moment(p.startsAt).isSameOrAfter(startingAt))
        .take(num_hours)
        .value();
    //console.log('pricesNextHours ', pricesNextHours.length, pricesNextHours);

    let heatingOffWithHighPrices = _(pricesNextHours)
        .map(p => {
            p.heating = heating.calcHeating(moment(p.startsAt).toDate(), true, false, heatingOptions);
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
        .filter(p => moment(p.startsAt).isBefore(now) && moment(p.startsAt).add(1, 'hours').minutes(0).second(0).millisecond(0).isAfter(now));

    console.log('onNowOrOff ', onNowOrOff.value());

};

Promise.all([
    nordpool.getHourlyPrices(moment(), {priceArea: 'Bergen', currency: 'NOK'}),
    nordpool.getHourlyPrices(moment().add(1, 'days'), {priceArea: 'Bergen', currency: 'NOK'})
]).then(result => {
    let prices = result[0];
    Array.prototype.push.apply(prices, result[1]);
    handleData(prices, 18, 24, 0);
    findHeatingOffWhenHighPrices(prices, 6, 24, 0);
}).catch(console.error);



