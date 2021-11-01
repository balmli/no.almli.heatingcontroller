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
            expect(p.startsAt.toISOString()).to.equal( aDate.toISOString());
            aDate.add(1, 'hour');
        }
        expect(_prices.length).to.equal(24);
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

const checkFollowingHoursLowestPrice = function (aDate, startHour, following_hours, num_lowest_hours, state) {
    const aDays = moment(aDate);
    const prices = getPrices();
    it("Lowest price check at " + aDate + ' - ' + startHour, function () {
        const chk = pricesLib.pricesAmongLowest(prices, aDays, startHour, following_hours, num_lowest_hours);
        expect(chk).to.equal(state);
    });
};

const checkFollowingHoursHighestPrice = function (aDate, startHour, following_hours, num_highest_hours, state) {
    const aDays = moment(aDate);
    const prices = getPrices();
    it("Highest price check at " + aDate + ' - ' + startHour, function () {
        const chk = pricesLib.pricesAmongHighest(prices, aDays, startHour, following_hours, num_highest_hours);
        expect(chk).to.equal(state);
    });
};

describe("The following X hours are among Y hours of the days lowest prices Bergen 20.10.2021", function () {

    before(function () {
        days.setTimeZone('Europe/Oslo');
    });

    describe("The following 3 hours are among 8 hours of the days lowest prices", function () {
        checkFollowingHoursLowestPrice('2021-10-20', 0, 3, 8, true);
        checkFollowingHoursLowestPrice('2021-10-20', 1, 3, 8, true);
        checkFollowingHoursLowestPrice('2021-10-20', 2, 3, 8, true);
        checkFollowingHoursLowestPrice('2021-10-20', 3, 3, 8, true);
        checkFollowingHoursLowestPrice('2021-10-20', 4, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 5, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 6, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 7, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 8, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 9, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 10, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 11, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 12, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 13, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 14, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 15, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 16, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 17, 3, 8, false);
        checkFollowingHoursLowestPrice('2021-10-20', 18, 3, 8, false);
    });

});

describe("The following X hours are among Y hours of the days highest prices Bergen 20.10.2021", function () {

    before(function () {
        days.setTimeZone('Europe/Oslo');
    });

    describe("The following 2 hours are among the 6 hours of the days highest prices", function () {
        checkFollowingHoursHighestPrice('2021-10-20', 0, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 1, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 2, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 3, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 4, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 5, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 6, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 7, 2, 6,true);
        checkFollowingHoursHighestPrice('2021-10-20', 8, 2, 6, true);
        checkFollowingHoursHighestPrice('2021-10-20', 9, 2, 6, false);
        checkFollowingHoursHighestPrice('2021-10-20', 10, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 11, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 12, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 13, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 14, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 15, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 16, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 17, 2, 6,true);
        checkFollowingHoursHighestPrice('2021-10-20', 18, 2, 6,true);
        checkFollowingHoursHighestPrice('2021-10-20', 19, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 20, 2, 6,false);
        checkFollowingHoursHighestPrice('2021-10-20', 21, 2, 6,false);
    });

});
