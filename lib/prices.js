'use strict';

const moment = require('./moment-timezone-with-data');
const heating = require('./heating');

const toHour = (aDate) => {
  return aDate.startOf('hour').toISOString();
}

const currentPrice = (prices, aDate) => {
  const currentHour = toHour(aDate);
  return prices.find(p => toHour(p.startsAt) === currentHour);
};

const priceRatio = (prices, aDate) => {
  const currentHour = toHour(aDate);
  const withIndex = pricesStarting(prices, aDate, 0, 24)
    .sort((a,b) => a.price - b.price)
    .findIndex(p => toHour(p.startsAt) === currentHour);
  return Math.round((1 - withIndex / 23) * 1000000) / 1000000
};

const pricesStarting = function (prices, aDate, startHour, num_hours) {
  const startingAt = aDate.hour(startHour).startOf('hour');
  return prices
    .filter(p => p.startsAt.isSameOrAfter(startingAt))
    .slice(0, num_hours);
};

const averagePricesStarting = function (prices, aDate, startHour, num_hours) {
  const startingAt = aDate.hour(startHour).startOf('hour');
  const arr = prices
    .filter(p => p.startsAt.isSameOrAfter(startingAt))
    .map(p => p.price)
    .slice(0, num_hours);
  if (arr.length === 0) {
    return 0;
  }
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length  * 10000000) / 10000000;
};

const checkAveragePrice = function (price, averagePrice, below, percentage) {
  return (price - averagePrice) / averagePrice * 100 * (below ? -1 : 1) > percentage;
};

const checkLowPrice = function (prices, low_hours, aDate) {
  return prices
    .sort((a,b) => a.price - b.price)
    .slice(0, low_hours)
    .filter(p => p.startsAt.isSameOrBefore(aDate) && moment(p.startsAt).add(1, 'hour').startOf('hour').isAfter(aDate));
};

const checkHighPrice = function (prices, high_hours, aDate) {
  return prices
    .sort((a,b) => b.price - a.price)
    .slice(0, high_hours)
    .filter(p => p.startsAt.isSameOrBefore(aDate) && moment(p.startsAt).add(1, 'hour').startOf('hour').isAfter(aDate));
};

const checkHighPrice2 = function (prices, high_hours, aDate, state) {
  return prices
    .map(p => {
      p.heating = heating.calcHeating(p.startsAt, state.atHome, state.homeOverride, state.heatingOptions);
      return p;
    })
    .filter(p => p.heating.heating === false)
    .filter((p, idx) => idx % 2 === 0)
    .sort((a,b) => b.price - a.price)
    .slice(0, high_hours)
    .filter(p => p.startsAt.isSameOrBefore(aDate) && moment(p.startsAt).add(1, 'hour').startOf('hour').isAfter(aDate));
};

const minOfHighestPrices = function (prices, num_hours) {
  const arr = prices
    .sort((a,b) => b.price - a.price)
    .slice(0, num_hours);
  if (arr.length > 0) {
    return arr[arr.length - 1];
  }
};

const maxOfLowestPrices = function (prices, num_hours) {
  const arr = prices
    .sort((a,b) => a.price - b.price)
    .slice(0, num_hours);
  if (arr.length > 0) {
    return arr[arr.length - 1];
  }
};

const pricesAmongLowest = (prices, aDate, startHour, numHours, numLowestHours) => {
  // Finds prices starting at 00:00 today
  const pricesToday = pricesStarting(prices, aDate, 0, 24);
  if (pricesToday.length === 0) {
    return false;
  }

  // Maximum price of lowest hours today
  const maxOfPeriodToday = maxOfLowestPrices(pricesToday, numLowestHours);

  // X following prices
  const pricesFollowing = pricesStarting(prices, aDate, startHour, numHours);
  if (pricesFollowing.length === 0) {
    return false;
  }

  // Maximum price of X following prices
  const maxOfFollowing = maxOfLowestPrices(pricesFollowing, numHours);

  return maxOfFollowing.price <= maxOfPeriodToday.price;
}

const pricesAmongHighest = (prices, aDate, startHour, numHours, numHighestHours) => {
  // Finds prices starting at 00:00 today
  const pricesToday = pricesStarting(prices, aDate, 0, 24);
  if (pricesToday.length === 0) {
    return false;
  }

  // Minimum price of highest hours today
  const minOfPeriodToday = minOfHighestPrices(pricesToday, numHighestHours);

  // X following prices
  const pricesFollowing = pricesStarting(prices, aDate, startHour, numHours);
  if (pricesFollowing.length === 0) {
    return false;
  }

  // Minimum price of X following prices
  const minOfFollowing = minOfHighestPrices(pricesFollowing, numHours);

  return minOfFollowing.price >= minOfPeriodToday.price;
}

module.exports = {
  currentPrice,
  priceRatio,
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

