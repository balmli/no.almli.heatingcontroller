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

describe("Check days period", function () {

  before(function () {
    days.setTimeZone('Europe/Oslo');
  });

  describe("Check days period", function () {
    it("Check 00:00 to 23:59 - '2021-10-20", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-20T07:00:00.000Z'), '00:00', '23:59');
      expect(startTs.format()).to.equal('2021-10-20T00:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-20T23:59:00+02:00');
    });
    it("Check 00:00 to 00:00 next day - '2021-10-20 a", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-20T00:00:00+02:00'), '00:00', '00:00');
      expect(startTs.format()).to.equal('2021-10-20T00:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T00:00:00+02:00');
    });
    it("Check 00:00 to 00:00 next day - '2021-10-20 b", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-20T07:00:00.000Z'), '00:00', '00:00');
      expect(startTs.format()).to.equal('2021-10-20T00:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T00:00:00+02:00');
    });
    it("Check 01:00 to 00:00 - '2021-10-20", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-20T07:00:00.000Z'), '01:00', '00:00');
      expect(startTs.format()).to.equal('2021-10-20T01:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T00:00:00+02:00');
    });
    it("Check 20:00 to 23:00 - '2021-10-20 a", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-20T07:00:00.000Z'), '20:00', '23:00');
      expect(startTs.format()).to.equal('2021-10-20T20:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-20T23:00:00+02:00');
    });
    it("Check 20:00 to 23:00 - '2021-10-20 b", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-20T20:00:00.000Z'), '20:00', '23:00');
      expect(startTs.format()).to.equal('2021-10-20T20:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-20T23:00:00+02:00');
    });
    it("Check 20:00 to 23:00 - 2021-10-21", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-21T05:00:00.000Z'), '20:00', '23:00');
      expect(startTs.format()).to.equal('2021-10-21T20:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T23:00:00+02:00');
    });
    it("Check 22:00 to 05:00 same day", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-20T07:00:00.000Z'), '22:00', '05:00');
      expect(startTs.format()).to.equal('2021-10-20T22:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T05:00:00+02:00');
    });
    it("Check 22:00 to 05:00 same day", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-20T23:01:00.000Z'), '22:00', '05:00');
      expect(startTs.format()).to.equal('2021-10-20T22:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T05:00:00+02:00');
    });
    it("Check 22:00 to 05:00 next day - a", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-21T01:00:00.000Z'), '22:00', '05:00');
      expect(startTs.format()).to.equal('2021-10-20T22:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T05:00:00+02:00');
    });
    it("Check 22:00 to 05:00 next day - b", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-20T21:30:00+02:00'), '22:00', '05:00');
      expect(startTs.format()).to.equal('2021-10-20T22:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T05:00:00+02:00');
    });
    it("Check 22:00 to 05:00 next day - c", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-20T22:00:00+02:00'), '22:00', '05:00');
      expect(startTs.format()).to.equal('2021-10-20T22:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T05:00:00+02:00');
    });
    it("Check 22:00 to 05:00 next day - c", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-21T00:00:00+02:00'), '22:00', '05:00');
      expect(startTs.format()).to.equal('2021-10-20T22:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T05:00:00+02:00');
    });
    it("Check 22:00 to 05:00 next day - c", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-21T04:30:00+02:00'), '22:00', '05:00');
      expect(startTs.format()).to.equal('2021-10-20T22:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T05:00:00+02:00');
    });
    it("Check 22:00 to 05:00 next day - c", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-21T05:00:00+02:00'), '22:00', '05:00');
      expect(startTs.format()).to.equal('2021-10-20T22:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-21T05:00:00+02:00');
    });
    it("Check 22:00 to 05:00 next day - c", function () {
      const { startTs, endTs } = pricesLib.daysPeriod(moment('2021-10-21T05:30:00+02:00'), '22:00', '05:00');
      expect(startTs.format()).to.equal('2021-10-21T22:00:00+02:00');
      expect(endTs.format()).to.equal('2021-10-22T05:00:00+02:00');
    });
  });
});

const checkLowestInPeriod = function (aDate, start, end, num_lowest_hours, state) {
  it("Lowest price check at " + aDate + ':' + start + '-' + end + ' with ' + num_lowest_hours + ' hours', function () {
    const prices = getPrices();
    const localTime = moment(aDate);
    const { startTs, endTs } = pricesLib.daysPeriod(localTime, start, end);
    const chk = pricesLib.pricesLowestInPeriod(prices, localTime, startTs, endTs, num_lowest_hours);
    //console.log('test:', localTime, startTs.format(), endTs.format(), num_lowest_hours, ' -> ', chk);
    expect(chk).to.equal(state);
  });
};

const checkHighestInPeriod = function (aDate, start, end, num_highest_hours, state) {
  it("Highest price check at " + aDate + ':' + start + '-' + end + ' with ' + num_highest_hours + ' hours', function () {
    const prices = getPrices();
    const localTime = moment(aDate);
    const { startTs, endTs } = pricesLib.daysPeriod(localTime, start, end);
    const chk = pricesLib.pricesHighestInPeriod(prices, localTime, startTs, endTs, num_highest_hours);
    //console.log('test:', localTime, startTs.format(), endTs.format(), num_highest_hours, ' -> ', chk);
    expect(chk).to.equal(state);
  });
};

describe("Current price is among the 'low hours' hours of lowest between 'start' and 'end' Bergen 20.10.2021", function () {

  before(function () {
    days.setTimeZone('Europe/Oslo');
  });

  describe("Current price is among the X hours of lowest between 01:00 and 04:00", function () {
    checkLowestInPeriod('2021-10-20T00:03:00', '01:00', '04:00', 1, false);
    checkLowestInPeriod('2021-10-20T00:03:00', '01:00', '04:00', 2, false);
    checkLowestInPeriod('2021-10-20T00:03:00', '01:00', '04:00', 3, false);
    checkLowestInPeriod('2021-10-20T00:03:00', '01:00', '04:00', 4, false);
    checkLowestInPeriod('2021-10-20T00:03:00', '01:00', '04:00', 5, false);

    checkLowestInPeriod('2021-10-20T01:03:00', '01:00', '04:00', 1, false);
    checkLowestInPeriod('2021-10-20T01:03:00', '01:00', '04:00', 2, false);
    checkLowestInPeriod('2021-10-20T01:03:00', '01:00', '04:00', 3, true);
    checkLowestInPeriod('2021-10-20T01:03:00', '01:00', '04:00', 4, true);
    checkLowestInPeriod('2021-10-20T01:03:00', '01:00', '04:00', 5, true);

    checkLowestInPeriod('2021-10-20T02:03:00', '01:00', '04:00', 1, false);
    checkLowestInPeriod('2021-10-20T02:03:00', '01:00', '04:00', 2, true);
    checkLowestInPeriod('2021-10-20T02:03:00', '01:00', '04:00', 3, true);
    checkLowestInPeriod('2021-10-20T02:03:00', '01:00', '04:00', 4, true);
    checkLowestInPeriod('2021-10-20T02:03:00', '01:00', '04:00', 5, true);

    checkLowestInPeriod('2021-10-20T03:03:00', '01:00', '04:00', 1, true);
    checkLowestInPeriod('2021-10-20T03:03:00', '01:00', '04:00', 2, true);
    checkLowestInPeriod('2021-10-20T03:03:00', '01:00', '04:00', 3, true);
    checkLowestInPeriod('2021-10-20T03:03:00', '01:00', '04:00', 4, true);
    checkLowestInPeriod('2021-10-20T03:03:00', '01:00', '04:00', 5, true);

    checkLowestInPeriod('2021-10-20T04:03:00', '01:00', '04:00', 1, false);
    checkLowestInPeriod('2021-10-20T04:03:00', '01:00', '04:00', 2, false);
    checkLowestInPeriod('2021-10-20T04:03:00', '01:00', '04:00', 3, false);
    checkLowestInPeriod('2021-10-20T04:03:00', '01:00', '04:00', 4, false);
    checkLowestInPeriod('2021-10-20T04:03:00', '01:00', '04:00', 5, false);
  });

  describe("Current price is among the X hours of lowest between 22:00 and 05:00", function () {
    checkLowestInPeriod('2021-10-20T20:03:00', '22:00', '05:00', 1, false);
    checkLowestInPeriod('2021-10-20T20:03:00', '22:00', '05:00', 2, false);
    checkLowestInPeriod('2021-10-20T20:03:00', '22:00', '05:00', 3, false);
    checkLowestInPeriod('2021-10-20T20:03:00', '22:00', '05:00', 4, false);
    checkLowestInPeriod('2021-10-20T20:03:00', '22:00', '05:00', 5, false);

    checkLowestInPeriod('2021-10-20T22:00:00', '22:00', '05:00', 1, false);
    checkLowestInPeriod('2021-10-20T22:00:00', '22:00', '05:00', 2, false);
    checkLowestInPeriod('2021-10-20T22:00:00', '22:00', '05:00', 3, false);
    checkLowestInPeriod('2021-10-20T22:00:00', '22:00', '05:00', 4, false);
    checkLowestInPeriod('2021-10-20T22:00:00', '22:00', '05:00', 5, false);

    checkLowestInPeriod('2021-10-21T00:00:00', '22:00', '05:00', 1, false);
    checkLowestInPeriod('2021-10-21T00:00:00', '22:00', '05:00', 2, false);
    checkLowestInPeriod('2021-10-21T00:00:00', '22:00', '05:00', 3, false);
    checkLowestInPeriod('2021-10-21T00:00:00', '22:00', '05:00', 4, false);
    checkLowestInPeriod('2021-10-21T00:00:00', '22:00', '05:00', 5, false);

    checkLowestInPeriod('2021-10-21T01:01:00', '22:00', '05:00', 1, false);
    checkLowestInPeriod('2021-10-21T01:01:00', '22:00', '05:00', 2, false);
    checkLowestInPeriod('2021-10-21T01:01:00', '22:00', '05:00', 3, false);
    checkLowestInPeriod('2021-10-21T01:01:00', '22:00', '05:00', 4, true);
    checkLowestInPeriod('2021-10-21T01:01:00', '22:00', '05:00', 5, true);

    checkLowestInPeriod('2021-10-21T03:00:10', '22:00', '05:00', 1, false);
    checkLowestInPeriod('2021-10-21T03:00:10', '22:00', '05:00', 2, true);
    checkLowestInPeriod('2021-10-21T03:00:10', '22:00', '05:00', 3, true);
    checkLowestInPeriod('2021-10-21T03:00:10', '22:00', '05:00', 4, true);
    checkLowestInPeriod('2021-10-21T03:00:10', '22:00', '05:00', 5, true);

    checkLowestInPeriod('2021-10-21T05:00:00', '22:00', '05:00', 1, false);
    checkLowestInPeriod('2021-10-21T05:00:00', '22:00', '05:00', 2, false);
    checkLowestInPeriod('2021-10-21T05:00:00', '22:00', '05:00', 3, false);
    checkLowestInPeriod('2021-10-21T05:00:00', '22:00', '05:00', 4, true);
    checkLowestInPeriod('2021-10-21T05:00:00', '22:00', '05:00', 5, true);

    checkLowestInPeriod('2021-10-21T05:01:00', '22:00', '05:00', 1, false);
    checkLowestInPeriod('2021-10-21T05:01:00', '22:00', '05:00', 2, false);
    checkLowestInPeriod('2021-10-21T05:01:00', '22:00', '05:00', 3, false);
    checkLowestInPeriod('2021-10-21T05:01:00', '22:00', '05:00', 4, false);
    checkLowestInPeriod('2021-10-21T05:01:00', '22:00', '05:00', 5, false);
  });

});

describe("Current price is among the 'high hours' hours of higherst between 'start' and 'end' Bergen 20.10.2021", function () {

  before(function () {
    days.setTimeZone('Europe/Oslo');
  });

  describe("Current price is among the X hours of highest between 01:00 and 04:00", function () {
    checkHighestInPeriod('2021-10-20T00:03:00', '01:00', '04:00', 1, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '01:00', '04:00', 2, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '01:00', '04:00', 3, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '01:00', '04:00', 4, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '01:00', '04:00', 5, false);

    checkHighestInPeriod('2021-10-20T01:03:00', '01:00', '04:00', 1, true);
    checkHighestInPeriod('2021-10-20T01:03:00', '01:00', '04:00', 2, true);
    checkHighestInPeriod('2021-10-20T01:03:00', '01:00', '04:00', 3, true);
    checkHighestInPeriod('2021-10-20T01:03:00', '01:00', '04:00', 4, true);
    checkHighestInPeriod('2021-10-20T01:03:00', '01:00', '04:00', 5, true);

    checkHighestInPeriod('2021-10-20T02:03:00', '01:00', '04:00', 1, false);
    checkHighestInPeriod('2021-10-20T02:03:00', '01:00', '04:00', 2, true);
    checkHighestInPeriod('2021-10-20T02:03:00', '01:00', '04:00', 3, true);
    checkHighestInPeriod('2021-10-20T02:03:00', '01:00', '04:00', 4, true);
    checkHighestInPeriod('2021-10-20T02:03:00', '01:00', '04:00', 5, true);

    checkHighestInPeriod('2021-10-20T03:03:00', '01:00', '04:00', 1, false);
    checkHighestInPeriod('2021-10-20T03:03:00', '01:00', '04:00', 2, false);
    checkHighestInPeriod('2021-10-20T03:03:00', '01:00', '04:00', 3, true);
    checkHighestInPeriod('2021-10-20T03:03:00', '01:00', '04:00', 4, true);
    checkHighestInPeriod('2021-10-20T03:03:00', '01:00', '04:00', 5, true);

    checkHighestInPeriod('2021-10-20T04:03:00', '01:00', '04:00', 1, false);
    checkHighestInPeriod('2021-10-20T04:03:00', '01:00', '04:00', 2, false);
    checkHighestInPeriod('2021-10-20T04:03:00', '01:00', '04:00', 3, false);
    checkHighestInPeriod('2021-10-20T04:03:00', '01:00', '04:00', 4, false);
    checkHighestInPeriod('2021-10-20T04:03:00', '01:00', '04:00', 5, false);
  });

  describe("Current price is among the X hours of highest between 08:00 and 16:00", function () {
    checkHighestInPeriod('2021-10-20T00:03:00', '08:00', '16:00', 1, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '08:00', '16:00', 2, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '08:00', '16:00', 3, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '08:00', '16:00', 4, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '08:00', '16:00', 5, false);

    checkHighestInPeriod('2021-10-20T08:03:00', '08:00', '16:00', 1, true);
    checkHighestInPeriod('2021-10-20T08:03:00', '08:00', '16:00', 2, true);
    checkHighestInPeriod('2021-10-20T08:03:00', '08:00', '16:00', 3, true);
    checkHighestInPeriod('2021-10-20T08:03:00', '08:00', '16:00', 4, true);
    checkHighestInPeriod('2021-10-20T08:03:00', '08:00', '16:00', 5, true);

    checkHighestInPeriod('2021-10-20T10:00:00', '08:00', '16:00', 1, false);
    checkHighestInPeriod('2021-10-20T10:00:00', '08:00', '16:00', 2, false);
    checkHighestInPeriod('2021-10-20T10:00:00', '08:00', '16:00', 3, true);
    checkHighestInPeriod('2021-10-20T10:00:00', '08:00', '16:00', 4, true);
    checkHighestInPeriod('2021-10-20T10:00:00', '08:00', '16:00', 5, true);

    checkHighestInPeriod('2021-10-20T12:03:00', '08:00', '16:00', 1, false);
    checkHighestInPeriod('2021-10-20T12:03:00', '08:00', '16:00', 2, false);
    checkHighestInPeriod('2021-10-20T12:03:00', '08:00', '16:00', 3, false);
    checkHighestInPeriod('2021-10-20T12:03:00', '08:00', '16:00', 4, false);
    checkHighestInPeriod('2021-10-20T12:03:00', '08:00', '16:00', 5, false);

    checkHighestInPeriod('2021-10-20T15:03:00', '08:00', '16:00', 1, false);
    checkHighestInPeriod('2021-10-20T15:03:00', '08:00', '16:00', 2, false);
    checkHighestInPeriod('2021-10-20T15:03:00', '08:00', '16:00', 3, false);
    checkHighestInPeriod('2021-10-20T15:03:00', '08:00', '16:00', 4, false);
    checkHighestInPeriod('2021-10-20T15:03:00', '08:00', '16:00', 5, false);

    checkHighestInPeriod('2021-10-20T16:00:00', '08:00', '16:00', 1, false);
    checkHighestInPeriod('2021-10-20T16:00:00', '08:00', '16:00', 2, false);
    checkHighestInPeriod('2021-10-20T16:00:00', '08:00', '16:00', 3, false);
    checkHighestInPeriod('2021-10-20T16:00:00', '08:00', '16:00', 4, false);
    checkHighestInPeriod('2021-10-20T16:00:00', '08:00', '16:00', 5, false);

    checkHighestInPeriod('2021-10-20T16:00:10', '08:00', '16:00', 1, false);
    checkHighestInPeriod('2021-10-20T16:00:10', '08:00', '16:00', 2, false);
    checkHighestInPeriod('2021-10-20T16:00:10', '08:00', '16:00', 3, false);
    checkHighestInPeriod('2021-10-20T16:00:10', '08:00', '16:00', 4, false);
    checkHighestInPeriod('2021-10-20T16:00:10', '08:00', '16:00', 5, false);
  });

  describe("Current price is among the X hours of highest between 13:00 and 16:01", function () {
    checkHighestInPeriod('2021-10-20T00:03:00', '13:00', '16:01', 1, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '13:00', '16:01', 2, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '13:00', '16:01', 3, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '13:00', '16:01', 4, false);
    checkHighestInPeriod('2021-10-20T00:03:00', '13:00', '16:01', 5, false);

    checkHighestInPeriod('2021-10-20T08:03:00', '13:00', '16:01', 1, false);
    checkHighestInPeriod('2021-10-20T08:03:00', '13:00', '16:01', 2, false);
    checkHighestInPeriod('2021-10-20T08:03:00', '13:00', '16:01', 3, false);
    checkHighestInPeriod('2021-10-20T08:03:00', '13:00', '16:01', 4, false);
    checkHighestInPeriod('2021-10-20T08:03:00', '13:00', '16:01', 5, false);

    checkHighestInPeriod('2021-10-20T10:00:00', '13:00', '16:01', 1, false);
    checkHighestInPeriod('2021-10-20T10:00:00', '13:00', '16:01', 2, false);
    checkHighestInPeriod('2021-10-20T10:00:00', '13:00', '16:01', 3, false);
    checkHighestInPeriod('2021-10-20T10:00:00', '13:00', '16:01', 4, false);
    checkHighestInPeriod('2021-10-20T10:00:00', '13:00', '16:01', 5, false);

    checkHighestInPeriod('2021-10-20T12:03:00', '13:00', '16:01', 1, false);
    checkHighestInPeriod('2021-10-20T12:03:00', '13:00', '16:01', 2, false);
    checkHighestInPeriod('2021-10-20T12:03:00', '13:00', '16:01', 3, false);
    checkHighestInPeriod('2021-10-20T12:03:00', '13:00', '16:01', 4, false);
    checkHighestInPeriod('2021-10-20T12:03:00', '13:00', '16:01', 5, false);

    checkHighestInPeriod('2021-10-20T15:03:00', '13:00', '16:01', 1, false);
    checkHighestInPeriod('2021-10-20T15:03:00', '13:00', '16:01', 2, false);
    checkHighestInPeriod('2021-10-20T15:03:00', '13:00', '16:01', 3, false);
    checkHighestInPeriod('2021-10-20T15:03:00', '13:00', '16:01', 4, true);
    checkHighestInPeriod('2021-10-20T15:03:00', '13:00', '16:01', 5, true);

    checkHighestInPeriod('2021-10-20T16:00:00', '13:00', '16:01', 1, false);
    checkHighestInPeriod('2021-10-20T16:00:00', '13:00', '16:01', 2, false);
    checkHighestInPeriod('2021-10-20T16:00:00', '13:00', '16:01', 3, true);
    checkHighestInPeriod('2021-10-20T16:00:00', '13:00', '16:01', 4, true);
    checkHighestInPeriod('2021-10-20T16:00:00', '13:00', '16:01', 5, true);

    checkHighestInPeriod('2021-10-20T16:00:10', '13:00', '16:01', 1, false);
    checkHighestInPeriod('2021-10-20T16:00:10', '13:00', '16:01', 2, false);
    checkHighestInPeriod('2021-10-20T16:00:10', '13:00', '16:01', 3, true);
    checkHighestInPeriod('2021-10-20T16:00:10', '13:00', '16:01', 4, true);
    checkHighestInPeriod('2021-10-20T16:00:10', '13:00', '16:01', 5, true);

    checkHighestInPeriod('2021-10-20T16:01:10', '13:00', '16:01', 1, false);
    checkHighestInPeriod('2021-10-20T16:01:10', '13:00', '16:01', 2, false);
    checkHighestInPeriod('2021-10-20T16:01:10', '13:00', '16:01', 3, false);
    checkHighestInPeriod('2021-10-20T16:01:10', '13:00', '16:01', 4, false);
    checkHighestInPeriod('2021-10-20T16:01:10', '13:00', '16:01', 5, false);
  });

  describe("Current price is among the X hours of highest between 22:00 and 05:00", function () {
    checkHighestInPeriod('2021-10-20T20:03:00', '22:00', '05:00', 1, false);
    checkHighestInPeriod('2021-10-20T20:03:00', '22:00', '05:00', 2, false);
    checkHighestInPeriod('2021-10-20T20:03:00', '22:00', '05:00', 3, false);
    checkHighestInPeriod('2021-10-20T20:03:00', '22:00', '05:00', 4, false);
    checkHighestInPeriod('2021-10-20T20:03:00', '22:00', '05:00', 5, false);

    checkHighestInPeriod('2021-10-20T22:00:00', '22:00', '05:00', 1, true);
    checkHighestInPeriod('2021-10-20T22:00:00', '22:00', '05:00', 2, true);
    checkHighestInPeriod('2021-10-20T22:00:00', '22:00', '05:00', 3, true);
    checkHighestInPeriod('2021-10-20T22:00:00', '22:00', '05:00', 4, true);
    checkHighestInPeriod('2021-10-20T22:00:00', '22:00', '05:00', 5, true);

    checkHighestInPeriod('2021-10-21T00:00:00', '22:00', '05:00', 1, false);
    checkHighestInPeriod('2021-10-21T00:00:00', '22:00', '05:00', 2, true);
    checkHighestInPeriod('2021-10-21T00:00:00', '22:00', '05:00', 3, true);
    checkHighestInPeriod('2021-10-21T00:00:00', '22:00', '05:00', 4, true);
    checkHighestInPeriod('2021-10-21T00:00:00', '22:00', '05:00', 5, true);

    checkHighestInPeriod('2021-10-21T01:01:00', '22:00', '05:00', 1, false);
    checkHighestInPeriod('2021-10-21T01:01:00', '22:00', '05:00', 2, false);
    checkHighestInPeriod('2021-10-21T01:01:00', '22:00', '05:00', 3, false);
    checkHighestInPeriod('2021-10-21T01:01:00', '22:00', '05:00', 4, true);
    checkHighestInPeriod('2021-10-21T01:01:00', '22:00', '05:00', 5, true);

    checkHighestInPeriod('2021-10-21T03:00:10', '22:00', '05:00', 1, false);
    checkHighestInPeriod('2021-10-21T03:00:10', '22:00', '05:00', 2, false);
    checkHighestInPeriod('2021-10-21T03:00:10', '22:00', '05:00', 3, false);
    checkHighestInPeriod('2021-10-21T03:00:10', '22:00', '05:00', 4, false);
    checkHighestInPeriod('2021-10-21T03:00:10', '22:00', '05:00', 5, false);

    checkHighestInPeriod('2021-10-21T05:00:00', '22:00', '05:00', 1, false);
    checkHighestInPeriod('2021-10-21T05:00:00', '22:00', '05:00', 2, false);
    checkHighestInPeriod('2021-10-21T05:00:00', '22:00', '05:00', 3, false);
    checkHighestInPeriod('2021-10-21T05:00:00', '22:00', '05:00', 4, false);
    checkHighestInPeriod('2021-10-21T05:00:00', '22:00', '05:00', 5, true);

    checkHighestInPeriod('2021-10-21T05:01:00', '22:00', '05:00', 1, false);
    checkHighestInPeriod('2021-10-21T05:01:00', '22:00', '05:00', 2, false);
    checkHighestInPeriod('2021-10-21T05:01:00', '22:00', '05:00', 3, false);
    checkHighestInPeriod('2021-10-21T05:01:00', '22:00', '05:00', 4, false);
    checkHighestInPeriod('2021-10-21T05:01:00', '22:00', '05:00', 5, false);
  });

});
