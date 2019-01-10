'use strict';

const moment = require('moment-timezone');
const nordpool = require('./lib/nordpool');
const _ = require('lodash');

let handleData = function (prices, low_hours, num_hours, starting) {
    const startingAt = moment().hours(starting).minutes(0).second(0).millisecond(0); // Starting 05:00

    let pricesNextHours = _(prices)
        .filter(p => moment(p.startsAt).isSameOrAfter(startingAt))
        .take(num_hours)
        .value();

    console.log('pricesNextHours', pricesNextHours.length);
    //console.log('pricesNextHours ' + num_hours + ' hours starting ' + starting, pricesNextHours);

    let pricesSorted = _.sortBy(pricesNextHours, ['price']);
    //console.log('pricesSorted ', pricesSorted);

    let lowHours = _(pricesSorted).take(low_hours).value();
    console.log('lowHours ', lowHours);

    const now = moment();
    const plus1hour = moment().add(1, 'hours').minutes(0).second(0).millisecond(0);
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

Promise.all([
    nordpool.getHourlyPrices(moment(), {priceArea: 'Bergen', currency: 'NOK'}),
    nordpool.getHourlyPrices(moment().add(1, 'days'), {priceArea: 'Bergen', currency: 'NOK'})
]).then(result => {
    let prices = result[0];
    Array.prototype.push.apply(prices, result[1]);
    handleData(prices, 18, 24, 0);
}).catch(console.error);



