const moment = require('../lib/moment-timezone-with-data');
const expect = require("chai").expect;
const pricesLib = require('../lib/prices');
const days = require("../lib/days");

let _prices = undefined;

days.setTimeZone('Europe/Oslo');

const getPrices = function () {
  if (_prices) {
    const aDate = moment('2021-10-19T22:00:00.000Z');
    for (let p of _prices) {
      expect(p.startsAt.toISOString()).to.equal(aDate.toISOString());
      aDate.add(1, 'hour');
    }
    expect(_prices.length).to.equal(50);
    return _prices;
  }
  const prices = [
    {
      startsAt: '2021-10-19T22:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.85835
    },
    {
      startsAt: '2021-10-19T23:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.64062
    },
    {
      startsAt: '2021-10-20T00:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.38904
    },
    {
      startsAt: '2021-10-20T01:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.10088
    },
    {
      startsAt: '2021-10-20T02:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.1005
    },
    {
      startsAt: '2021-10-20T03:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.61679
    },
    {
      startsAt: '2021-10-20T04:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88948
    },
    {
      startsAt: '2021-10-20T05:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.9961
    },
    {
      startsAt: '2021-10-20T06:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 1.03745
    },
    {
      startsAt: '2021-10-20T07:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.98618
    },
    {
      startsAt: '2021-10-20T08:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.90777
    },
    {
      startsAt: '2021-10-20T09:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88918
    },
    {
      startsAt: '2021-10-20T10:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88568
    },
    {
      startsAt: '2021-10-20T11:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.89152
    },
    {
      startsAt: '2021-10-20T12:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.89026
    },
    {
      startsAt: '2021-10-20T13:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88364
    },
    {
      startsAt: '2021-10-20T14:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88666
    },
    {
      startsAt: '2021-10-20T15:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.91302
    },
    {
      startsAt: '2021-10-20T16:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.9745
    },
    {
      startsAt: '2021-10-20T17:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 1.01176
    },
    {
      startsAt: '2021-10-20T18:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.91098
    },
    {
      startsAt: '2021-10-20T19:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88568
    },
    {
      startsAt: '2021-10-20T20:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.87255
    },
    {
      startsAt: '2021-10-20T21:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.78723
    },
    {
      startsAt: '2021-10-20T22:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.85835
    },
    {
      startsAt: '2021-10-20T23:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.64062
    },
    {
      startsAt: '2021-10-21T00:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.38904
    },
    {
      startsAt: '2021-10-21T01:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.10088
    },
    {
      startsAt: '2021-10-21T02:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.1005
    },
    {
      startsAt: '2021-10-21T03:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.61679
    },
    {
      startsAt: '2021-10-21T04:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88948
    },
    {
      startsAt: '2021-10-21T05:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.9961
    },
    {
      startsAt: '2021-10-21T06:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 1.03745
    },
    {
      startsAt: '2021-10-21T07:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.98618
    },
    {
      startsAt: '2021-10-21T08:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.90777
    },
    {
      startsAt: '2021-10-21T09:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88918
    },
    {
      startsAt: '2021-10-21T10:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88568
    },
    {
      startsAt: '2021-10-21T11:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.89152
    },
    {
      startsAt: '2021-10-21T12:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.89026
    },
    {
      startsAt: '2021-10-21T13:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88364
    },
    {
      startsAt: '2021-10-21T14:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88666
    },
    {
      startsAt: '2021-10-21T15:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.91302
    },
    {
      startsAt: '2021-10-21T16:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.9745
    },
    {
      startsAt: '2021-10-21T17:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 1.01176
    },
    {
      startsAt: '2021-10-21T18:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.91098
    },
    {
      startsAt: '2021-10-21T19:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.88568
    },
    {
      startsAt: '2021-10-21T20:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.87255
    },
    {
      startsAt: '2021-10-21T21:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.78723
    },
    {
      startsAt: '2021-10-21T22:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.85835
    },
    {
      startsAt: '2021-10-21T23:00:00.000Z',
      priceArea: 'Bergen',
      currency: 'Bergen',
      price: 0.64062
    }
  ];
  const timeZone = moment().tz();
  _prices = prices
    .map(p => {
      const startsAt = moment.tz(p.startsAt, 'UTC').tz(timeZone);
      const time = startsAt.unix();
      const price = p.price;
      return { startsAt, time, price };
    });
  return _prices;
};

const findSumLowest = function (aDate, start, end, hours, expectedSum) {
  it("Lowest sum of " + hours + ' prices starting at ' + aDate, function () {
    const prices = getPrices();
    const localTime = moment(aDate);
    const { startTs, endTs } = pricesLib.daysPeriod(localTime, start, end);
    const sumPrice = pricesLib.checkSumPrices(prices, localTime, startTs, endTs, hours, true);
    if (sumPrice) {
      expect(sumPrice.price).to.equal(expectedSum);
    } else {
      expect(expectedSum).eq(undefined);
    }
  });
};

const findSumHighest = function (aDate, start, end, hours, expectedSum) {
  it("Highest sum of " + hours + ' prices starting at ' + aDate, function () {
    const prices = getPrices();
    const localTime = moment(aDate);
    const { startTs, endTs } = pricesLib.daysPeriod(localTime, start, end);
    const sumPrice = pricesLib.checkSumPrices(prices, localTime, startTs, endTs, hours, false);
    if (sumPrice) {
      expect(sumPrice.price).to.equal(expectedSum);
    } else {
      expect(expectedSum).eq(undefined);
    }
  });
};

describe("The following X hours are the cheapest of the day Bergen 20.10.2021", function () {

  before(function () {
    days.setTimeZone('Europe/Oslo');
  });

  describe("The following 2 hours are the cheapest between 00:00 - 00:00 next day", function () {
    findSumLowest('2021-10-19T23:59:59', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T00:00:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T01:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T02:10:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T02:59:59', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T03:00:00', '00:00', '00:00', 2, 0.20138);
    findSumLowest('2021-10-20T03:03:00', '00:00', '00:00', 2, 0.20138);
    findSumLowest('2021-10-20T04:03:00', '00:00', '00:00', 2, 0.20138);
    findSumLowest('2021-10-20T04:59:59', '00:00', '00:00', 2, 0.20138);
    findSumLowest('2021-10-20T05:00:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T05:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T06:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T07:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T08:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T09:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T10:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T11:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T12:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T13:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T14:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T15:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T16:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T17:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T18:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T19:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T20:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T21:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T22:03:00', '00:00', '00:00', 2, undefined);
    findSumLowest('2021-10-20T23:03:00', '00:00', '00:00', 2, undefined);
  });

  describe("The following 4 hours are the cheapest between 00:00 - 00:00 next day", function () {
    findSumLowest('2021-10-20T00:00:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T01:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T01:59:59', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T02:00:00', '00:00', '00:00', 4, 1.20721);
    findSumLowest('2021-10-20T02:10:00', '00:00', '00:00', 4, 1.20721);
    findSumLowest('2021-10-20T03:03:00', '00:00', '00:00', 4, 1.20721);
    findSumLowest('2021-10-20T04:03:00', '00:00', '00:00', 4, 1.20721);
    findSumLowest('2021-10-20T05:03:00', '00:00', '00:00', 4, 1.20721);
    findSumLowest('2021-10-20T05:59:59', '00:00', '00:00', 4, 1.20721);
    findSumLowest('2021-10-20T06:00:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T06:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T07:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T08:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T09:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T10:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T11:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T12:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T13:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T14:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T15:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T16:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T17:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T18:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T19:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T20:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T21:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T22:03:00', '00:00', '00:00', 4, undefined);
    findSumLowest('2021-10-20T23:03:00', '00:00', '00:00', 4, undefined);
  });

  describe("The following 6 hours are the cheapest between 00:00 - 00:00 next day", function () {
    findSumLowest('2021-10-19T23:59:59', '00:00', '00:00', 6,  undefined);
    findSumLowest('2021-10-20T00:00:00', '00:00', '00:00', 6,  2.70618);
    findSumLowest('2021-10-20T01:03:00', '00:00', '00:00', 6, 2.70618);
    findSumLowest('2021-10-20T02:10:00', '00:00', '00:00', 6, 2.70618);
    findSumLowest('2021-10-20T03:03:00', '00:00', '00:00', 6, 2.70618);
    findSumLowest('2021-10-20T04:03:00', '00:00', '00:00', 6, 2.70618);
    findSumLowest('2021-10-20T05:03:00', '00:00', '00:00', 6, 2.70618);
    findSumLowest('2021-10-20T05:59:59', '00:00', '00:00', 6, 2.70618);
    findSumLowest('2021-10-20T06:00:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T06:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T07:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T08:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T09:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T10:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T11:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T12:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T13:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T14:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T15:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T16:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T17:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T18:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T19:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T20:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T21:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T22:03:00', '00:00', '00:00', 6, undefined);
    findSumLowest('2021-10-20T23:03:00', '00:00', '00:00', 6, undefined);
  });

  describe("The following 6 hours are the cheapest between 01:00 - 20:00", function () {
    findSumLowest('2021-10-19T23:59:59', '01:00', '20:00', 6,  undefined);
    findSumLowest('2021-10-20T00:00:00', '01:00', '20:00', 6,  undefined);
    findSumLowest('2021-10-20T01:00:00', '01:00', '20:00', 6,  2.73731);
    findSumLowest('2021-10-20T01:03:00', '01:00', '20:00', 6,  2.73731);
    findSumLowest('2021-10-20T02:10:00', '01:00', '20:00', 6,  2.73731);
    findSumLowest('2021-10-20T03:03:00', '01:00', '20:00', 6, 2.73731);
    findSumLowest('2021-10-20T04:03:00', '01:00', '20:00', 6, 2.73731);
    findSumLowest('2021-10-20T05:03:00', '01:00', '20:00', 6, 2.73731);
    findSumLowest('2021-10-20T05:59:59', '01:00', '20:00', 6, 2.73731);
    findSumLowest('2021-10-20T06:00:00', '01:00', '20:00', 6, 2.73731);
    findSumLowest('2021-10-20T06:03:00', '01:00', '20:00', 6, 2.73731);
    findSumLowest('2021-10-20T06:59:59', '01:00', '20:00', 6, 2.73731);
    findSumLowest('2021-10-20T07:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T08:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T09:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T10:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T11:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T12:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T13:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T14:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T15:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T16:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T17:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T18:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T19:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T20:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T21:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T22:03:00', '01:00', '20:00', 6, undefined);
    findSumLowest('2021-10-20T23:03:00', '01:00', '20:00', 6, undefined);
  });

  describe("The following 2 hours are the most expensive between 00:00 - 00:00 next day", function () {
    findSumHighest('2021-10-20T00:00:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T01:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T02:10:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T03:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T04:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T05:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T06:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T06:59:59', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T07:00:00', '00:00', '00:00', 2, 2.03355);
    findSumHighest('2021-10-20T07:03:00', '00:00', '00:00', 2, 2.03355);
    findSumHighest('2021-10-20T08:03:00', '00:00', '00:00', 2, 2.03355);
    findSumHighest('2021-10-20T08:59:59', '00:00', '00:00', 2, 2.03355);
    findSumHighest('2021-10-20T09:00:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T09:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T10:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T11:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T12:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T13:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T14:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T15:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T16:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T17:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T18:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T19:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T20:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T21:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T22:03:00', '00:00', '00:00', 2, undefined);
    findSumHighest('2021-10-20T23:03:00', '00:00', '00:00', 2, undefined);
  });

  describe("The following 4 hours are the most expensive between 00:00 - 00:00 next day", function () {
    findSumHighest('2021-10-20T00:00:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T01:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T02:10:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T03:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T04:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T05:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T06:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T06:59:59', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T07:00:00', '00:00', '00:00', 4, 3.9275);
    findSumHighest('2021-10-20T07:03:00', '00:00', '00:00', 4, 3.9275);
    findSumHighest('2021-10-20T08:03:00', '00:00', '00:00', 4, 3.9275);
    findSumHighest('2021-10-20T09:03:00', '00:00', '00:00', 4, 3.9275);
    findSumHighest('2021-10-20T10:03:00', '00:00', '00:00', 4, 3.9275);
    findSumHighest('2021-10-20T10:59:58', '00:00', '00:00', 4, 3.9275);
    findSumHighest('2021-10-20T11:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T12:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T13:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T14:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T15:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T16:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T17:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T18:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T19:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T20:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T21:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T22:03:00', '00:00', '00:00', 4, undefined);
    findSumHighest('2021-10-20T23:03:00', '00:00', '00:00', 4, undefined);
  });

  describe("The following 6 hours are the most expensive between 00:00 - 00:00 next day", function () {
    findSumHighest('2021-10-20T00:00:00', '00:00', '00:00', 6,  undefined);
    findSumHighest('2021-10-20T01:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T02:10:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T03:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T04:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T05:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T05:59:59', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T06:00:00', '00:00', '00:00', 6, 5.70616);
    findSumHighest('2021-10-20T06:03:00', '00:00', '00:00', 6, 5.70616);
    findSumHighest('2021-10-20T07:03:00', '00:00', '00:00', 6, 5.70616);
    findSumHighest('2021-10-20T08:03:00', '00:00', '00:00', 6, 5.70616);
    findSumHighest('2021-10-20T09:03:00', '00:00', '00:00', 6, 5.70616);
    findSumHighest('2021-10-20T10:03:00', '00:00', '00:00', 6, 5.70616);
    findSumHighest('2021-10-20T11:03:00', '00:00', '00:00', 6, 5.70616);
    findSumHighest('2021-10-20T11:59:59', '00:00', '00:00', 6, 5.70616);
    findSumHighest('2021-10-20T12:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T13:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T14:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T15:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T16:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T17:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T18:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T19:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T20:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T21:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T22:03:00', '00:00', '00:00', 6, undefined);
    findSumHighest('2021-10-20T23:03:00', '00:00', '00:00', 6, undefined);
  });

  describe("The following 6 hours are the most expensive between 08:00 - 16:00", function () {
    findSumHighest('2021-10-20T00:00:00', '08:00', '16:00', 6,  undefined);
    findSumHighest('2021-10-20T01:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T02:10:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T03:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T04:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T05:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T05:59:59', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T06:00:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T06:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T07:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T07:59:59', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T08:00:00', '08:00', '16:00', 6, 5.59778);
    findSumHighest('2021-10-20T08:03:00', '08:00', '16:00', 6, 5.59778);
    findSumHighest('2021-10-20T09:03:00', '08:00', '16:00', 6, 5.59778);
    findSumHighest('2021-10-20T10:03:00', '08:00', '16:00', 6, 5.59778);
    findSumHighest('2021-10-20T11:03:00', '08:00', '16:00', 6, 5.59778);
    findSumHighest('2021-10-20T11:59:59', '08:00', '16:00', 6, 5.59778);
    findSumHighest('2021-10-20T12:03:00', '08:00', '16:00', 6, 5.59778);
    findSumHighest('2021-10-20T13:03:00', '08:00', '16:00', 6, 5.59778);
    findSumHighest('2021-10-20T13:59:59', '08:00', '16:00', 6, 5.59778);
    findSumHighest('2021-10-20T14:00:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T14:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T15:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T16:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T17:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T18:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T19:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T20:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T21:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T22:03:00', '08:00', '16:00', 6, undefined);
    findSumHighest('2021-10-20T23:03:00', '08:00', '16:00', 6, undefined);
  });

});

