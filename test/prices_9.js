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

const checkCurrentPriceLowerThanNext = function (aDate, numHours, expectedLower) {
  it(`Current price at ${aDate} ${expectedLower ? 'is' : 'is not'} expected to be lower than next ${numHours} hours`,  function () {
    const prices = getPrices();
    const isLower = pricesLib.currentPriceLowerThanNext(prices, aDate, numHours);
    expect(isLower).eq(expectedLower);
  });
};

const checkCurrentPriceHigherThanNext = function (aDate, numHours, expectedHigher) {
  it(`Current price at ${aDate} ${expectedHigher ? 'is' : 'is not'} expected to be higher than next ${numHours} hours`,  function () {
    const prices = getPrices();
    const isLower = pricesLib.currentPriceHigherThanNext(prices, aDate, numHours);
    expect(isLower).eq(expectedHigher);
  });
};

describe("Current price at 20.10.2021", function () {

  before(function () {
    days.setTimeZone('Europe/Oslo');
  });

  describe("Current price lower at 20.10.2021T12", function () {
    checkCurrentPriceLowerThanNext('2021-10-20T12:00:00+02:00', 1, true);
    checkCurrentPriceLowerThanNext('2021-10-20T12:00:00+02:00', 2, true);
    checkCurrentPriceLowerThanNext('2021-10-20T12:00:00+02:00', 3, false);
    checkCurrentPriceLowerThanNext('2021-10-20T12:00:00+02:00', 4, false);
    checkCurrentPriceLowerThanNext('2021-10-20T12:00:00+02:00', 5, false);
    checkCurrentPriceLowerThanNext('2021-10-20T12:00:00+02:00', 6, false);
  });

  describe("Current price higher at 20.10.2021T14", function () {
    checkCurrentPriceHigherThanNext('2021-10-20T14:00:00+02:00', 1, true);
    checkCurrentPriceHigherThanNext('2021-10-20T14:00:00+02:00', 2, true);
    checkCurrentPriceHigherThanNext('2021-10-20T14:00:00+02:00', 3, false);
    checkCurrentPriceHigherThanNext('2021-10-20T14:00:00+02:00', 4, false);
    checkCurrentPriceHigherThanNext('2021-10-20T14:00:00+02:00', 5, false);
    checkCurrentPriceHigherThanNext('2021-10-20T14:00:00+02:00', 6, false);
  });

});
