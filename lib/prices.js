'use strict';

const _ = require('lodash'),
    moment = require('moment'),
    heating = require('./heating');

let pricesStarting = function (prices, aMoment, startHour, num_hours) {
    const startingAt = aMoment.hours(startHour).minutes(0).second(0).millisecond(0);
    return _(prices)
        .filter(p => moment(p.startsAt).isSameOrAfter(startingAt))
        .take(num_hours)
        .value();
};

let averagePricesStarting = function (prices, aMoment, startHour, num_hours) {
    const startingAt = aMoment.hours(startHour).minutes(0).second(0).millisecond(0);
    let avg = _(prices)
        .filter(p => moment(p.startsAt).isSameOrAfter(startingAt))
        .take(num_hours)
        .meanBy(p => p.price);
    return Math.round(avg * 10000000) / 10000000;
};

let checkAveragePrice = function (price, averagePrice, below, percentage) {
    return (price - averagePrice) / averagePrice * 100 * (below ? -1 : 1) > percentage;
};

let checkLowPrice = function (prices, low_hours, aMoment) {
    return _(prices)
        .sortBy(['price'])
        .take(low_hours)
        .filter(p => moment(p.startsAt).isSameOrBefore(aMoment) && moment(p.startsAt).add(1, 'hours').minutes(0).second(0).millisecond(0).isAfter(aMoment));
};

let checkHighPrice = function (prices, high_hours, aMoment, state) {
    return _(prices)
        .map(p => {
            p.heating = heating.calcHeating(moment(p.startsAt).toDate(), state.atHome, state.homeOverride, state.heatingOptions);
            return p;
        })
        .filter(p => p.heating.heating === false)
        .filter((p, idx) => idx % 2 === 0)
        .sortBy(['price'])
        .reverse()
        .take(high_hours)
        .filter(p => moment(p.startsAt).isSameOrBefore(aMoment) && moment(p.startsAt).add(1, 'hours').minutes(0).second(0).millisecond(0).isAfter(aMoment));
};

module.exports = {
    pricesStarting: pricesStarting,
    averagePricesStarting: averagePricesStarting,
    checkAveragePrice: checkAveragePrice,
    checkLowPrice: checkLowPrice,
    checkHighPrice: checkHighPrice
};

