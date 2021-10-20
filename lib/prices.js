'use strict';

const _ = require('lodash');
const heating = require('./heating');

const pricesStarting = function (prices, aDate, startHour, num_hours) {
  const startingAt = aDate.hour(startHour).startOf('hour');
  return _(prices)
    .filter(p => p.startsAt.isSameOrAfter(startingAt))
    .take(num_hours)
    .value();
};

const averagePricesStarting = function (prices, aDate, startHour, num_hours) {
  const startingAt = aDate.hour(startHour).startOf('hour');
  let avg = _(prices)
    .filter(p => p.startsAt.isSameOrAfter(startingAt))
    .take(num_hours)
    .meanBy(p => p.price);
  return Math.round(avg * 10000000) / 10000000;
};

const checkAveragePrice = function (price, averagePrice, below, percentage) {
  return (price - averagePrice) / averagePrice * 100 * (below ? -1 : 1) > percentage;
};

const checkLowPrice = function (prices, low_hours, aDate) {
  return _(prices)
    .sortBy(['price'])
    .take(low_hours)
    .filter(p => p.startsAt.isSameOrBefore(aDate) &&p.startsAt.add(1, 'hour').startOf('hour').isAfter(aDate));
};

const checkHighPrice = function (prices, high_hours, aDate) {
  return _(prices)
    .sortBy(['price'])
    .reverse()
    .take(high_hours)
    .filter(p => p.startsAt.isSameOrBefore(aDate) && p.startsAt.add(1, 'hour').startOf('hour').isAfter(aDate));
};

const checkHighPrice2 = function (prices, high_hours, aDate, state) {
  return _(prices)
    .map(p => {
      p.heating = heating.calcHeating(p.startsAt, state.atHome, state.homeOverride, state.heatingOptions);
      return p;
    })
    .filter(p => p.heating.heating === false)
    .filter((p, idx) => idx % 2 === 0)
    .sortBy(['price'])
    .reverse()
    .take(high_hours)
    .filter(p => p.startsAt.isSameOrBefore(aDate) && p.startsAt.add(1, 'hour').startOf('hour').isAfter(aDate));
};

const minOfHighestPrices = function (prices, num_hours) {
  return _(prices)
    .sortBy(['price'])
    .reverse()
    .take(num_hours)
    .minBy(p => p.price);
};

const maxOfLowestPrices = function (prices, num_hours) {
  return _(prices)
    .sortBy(['price'])
    .take(num_hours)
    .maxBy(p => p.price);
};

const pricesAmongLowest = (prices, aDate, startHour, numHours, numLowestHours) => {
  // Finds prices starting at 00:00 today
  const pricesToday = pricesStarting(prices, aDate, 0, 24);
  if (pricesToday.length === 0) {
    return false;
  }

  // Maximum price of lowest hours today
  let maxOfPeriodToday = maxOfLowestPrices(pricesToday, numLowestHours);

  // X following prices
  const pricesFollowing = pricesStarting(prices, aDate, startHour, numHours);
  if (pricesFollowing.length === 0) {
    return false;
  }

  // Maximum price of X following prices
  let maxOfFollowing = maxOfLowestPrices(pricesFollowing, numHours);

  return (maxOfFollowing.price <= maxOfPeriodToday.price);
}

const pricesAmongHighest = (prices, aDate, startHour, numHours, numHighestHours) => {
  // Finds prices starting at 00:00 today
  const pricesToday = pricesStarting(prices, aDate, 0, 24);
  if (pricesToday.length === 0) {
    return false;
  }

  // Minimum price of highest hours today
  let minOfPeriodToday = minOfHighestPrices(pricesToday, numHighestHours);

  // X following prices
  const pricesFollowing = pricesStarting(prices, aDate, startHour, numHours);
  if (pricesFollowing.length === 0) {
    return false;
  }

  // Minimum price of X following prices
  let minOfFollowing = minOfHighestPrices(pricesFollowing, numHours);

  return (minOfFollowing.price >= minOfPeriodToday.price);
}

module.exports = {
  pricesStarting,
  averagePricesStarting,
  checkAveragePrice,
  checkLowPrice,
  checkHighPrice,
  checkHighPrice2,
  minOfHighestPrices,
  maxOfLowestPrices,
  pricesAmongLowest,
  pricesAmongHighest
};

