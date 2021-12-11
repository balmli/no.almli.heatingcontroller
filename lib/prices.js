'use strict';

const moment = require('./moment-timezone-with-data');
const heating = require('./heating');

const toHour = (aDate) => {
  return moment(aDate).startOf('hour').toISOString();
}

const currentPrice = (prices, aDate) => {
  const currentHour = toHour(aDate);
  return prices.find(p => toHour(p.startsAt) === currentHour);
};

const priceRatio = (prices, aDate) => {
  const currentHour = toHour(aDate);
  const withIndex = pricesStarting(prices, aDate, 0, 24)
    .concat()
    .sort((a, b) => a.price - b.price)
    .findIndex(p => toHour(p.startsAt) === currentHour);
  return Math.round((1 - withIndex / 23) * 1000000) / 1000000
};

const pricesStarting = function (prices, aDate, startHour, num_hours) {
  const startingAt = moment(aDate).hour(startHour).startOf('hour');
  return prices
    .filter(p => p.startsAt.isSameOrAfter(startingAt))
    .slice(0, num_hours);
};

const averagePricesStarting = function (prices, aDate, startHour, num_hours) {
  const startingAt = moment(aDate).hour(startHour).startOf('hour');
  const arr = prices
    .filter(p => p.startsAt.isSameOrAfter(startingAt))
    .map(p => p.price)
    .slice(0, num_hours);
  if (arr.length === 0) {
    return 0;
  }
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10000000) / 10000000;
};

const checkAveragePrice = function (price, averagePrice, below, percentage) {
  return (price - averagePrice) / averagePrice * 100 * (below ? -1 : 1) > percentage;
};

const checkLowPrice = function (prices, low_hours, aDate) {
  return prices
    .concat()
    .sort((a, b) => a.price - b.price)
    .slice(0, low_hours)
    .filter(p => p.startsAt.isSameOrBefore(aDate) && moment(p.startsAt).add(1, 'hour').startOf('hour').isAfter(aDate));
};

const checkHighPrice = function (prices, high_hours, aDate) {
  return prices
    .concat()
    .sort((a, b) => b.price - a.price)
    .slice(0, high_hours)
    .filter(p => p.startsAt.isSameOrBefore(aDate) && moment(p.startsAt).add(1, 'hour').startOf('hour').isAfter(aDate));
};

const checkHighPrice2 = function (prices, high_hours, aDate, state, filter = true) {
  return prices
    .map(p => {
      p.heating = heating.calcHeating(p.startsAt, state.atHome, state.homeOverride, state.heatingOptions);
      return p;
    })
    .filter(p => p.heating.heating === false)
    .filter((p, idx) => idx % 2 === 0)
    .sort((a, b) => b.price - a.price)
    .slice(0, high_hours)
    .filter(p => !filter || filter && p.startsAt.isSameOrBefore(aDate) && moment(p.startsAt).add(1, 'hour').startOf('hour').isAfter(aDate));
};

const minOfHighestPrices = function (prices, num_hours) {
  const arr = prices
    .concat()
    .sort((a, b) => b.price - a.price)
    .slice(0, num_hours);
  if (arr.length > 0) {
    return arr[arr.length - 1];
  }
};

const maxOfLowestPrices = function (prices, num_hours) {
  const arr = prices
    .concat()
    .sort((a, b) => a.price - b.price)
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

const daysPeriod = (aDate, start, end) => {
  const starts = start.split(':');
  const startHour = parseInt(starts[0]) + parseInt(starts[1]) / 60;
  const ends = end.split(':');
  let endHour = parseInt(ends[0]) + parseInt(ends[1]) / 60;
  if (startHour === endHour) {
    endHour += 24;
  }

  let startTs = moment(aDate).startOf('day').add(startHour, 'hour');
  let endTs = moment(aDate).startOf('day').add(endHour, 'hour');

  if (startHour >= endHour) {
    if (aDate.isSameOrBefore(endTs)) {
      startTs.add(-1, 'day');
    } else {
      endTs.add(1, 'day');
    }
  }

  return { startTs, endTs };
}

const pricesLowestInPeriod = (prices, aDate, startingAt, endingAt, numLowestHours) => {
  if (aDate.isBefore(startingAt)
    || aDate.isAfter(endingAt)) {
    // Not in period
    return false;
  }

  // Finds prices in period
  const pricesInPeriod = prices
    .concat()
    .filter(p => p.startsAt.isSameOrAfter(startingAt)
      && p.startsAt.isBefore(endingAt));
  if (pricesInPeriod.length === 0) {
    // No prices
    return false;
  }

  // Maximum price of the lowest
  const maxOfPeriod = maxOfLowestPrices(pricesInPeriod, numLowestHours);

  const current = currentPrice(prices, aDate);

  return !!maxOfPeriod && current.price <= maxOfPeriod.price;
}

const pricesHighestInPeriod = (prices, aDate, startingAt, endingAt, numHighestHours) => {
  if (aDate.isBefore(startingAt)
    || aDate.isAfter(endingAt)) {
    // Not in period
    return false;
  }

  // Finds prices in period
  const pricesInPeriod = prices
    .concat()
    .filter(p => p.startsAt.isSameOrAfter(startingAt)
      && p.startsAt.isBefore(endingAt));
  if (pricesInPeriod.length === 0) {
    // No prices
    return false;
  }

  // Minimum price of the highest
  const minOfPeriod = minOfHighestPrices(pricesInPeriod, numHighestHours);

  const current = currentPrice(prices, aDate);

  return !!minOfPeriod && current.price >= minOfPeriod.price;
}

const checkSumPrices = (prices, aDate, startingAt, endingAt, hours, low = true) => {
  if (aDate.isBefore(startingAt)
    || aDate.isAfter(endingAt)) {
    // Not in period
    return false;
  }

  const pricesInPeriod = prices
    .filter(p => p.startsAt.isSameOrAfter(startingAt)
      && p.startsAt.isBefore(endingAt));
  if (pricesInPeriod.length === 0) {
    // No prices
    return false;
  }

  const sumPrices = [];
  for (let a = 0; a < pricesInPeriod.length - hours + 1; a++) {
    const val = {
      startsAt: moment(pricesInPeriod[a].startsAt),
      endsAt: moment(pricesInPeriod[a].startsAt).add(hours, 'hour'),
      price: 0
    }
    for (let b = 0; b < hours; b++) {
      val.price += pricesInPeriod[a + b].price;
    }
    sumPrices.push(val);
  }

  const arr = low ?
    sumPrices
      .sort((a, b) => a.price - b.price) :
    sumPrices
      .sort((a, b) => b.price - a.price);

  if (arr.length > 0
    && aDate.isSameOrAfter(arr[0].startsAt)
    && aDate.isBefore(arr[0].endsAt)
  ) {
    return arr[0];
  }
}

module.exports = {
  toHour,
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
  pricesAmongHighest,
  daysPeriod,
  pricesLowestInPeriod,
  pricesHighestInPeriod,
  checkSumPrices,
};

