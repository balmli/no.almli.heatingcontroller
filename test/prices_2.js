const moment = require('../lib/moment-timezone-with-data');
const expect = require("chai").expect;
const pricesLib = require('../lib/prices');
const days = require("../lib/days");

let _prices = undefined;

const getPrices = function () {
    if (_prices) {
        return _prices;
    }
    const prices = [
        {
            startsAt: '2019-01-30T23:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.49495
        },
        {
            startsAt: '2019-01-31T00:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.49058
        },
        {
            startsAt: '2019-01-31T01:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.48981
        },
        {
            startsAt: '2019-01-31T02:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.49029
        },
        {
            startsAt: '2019-01-31T03:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.49417
        },
        {
            startsAt: '2019-01-31T04:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.52164
        },
        {
            startsAt: '2019-01-31T05:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.53076
        },
        {
            startsAt: '2019-01-31T06:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54493
        },
        {
            startsAt: '2019-01-31T07:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54726
        },
        {
            startsAt: '2019-01-31T08:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54658
        },
        {
            startsAt: '2019-01-31T09:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54619
        },
        {
            startsAt: '2019-01-31T10:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54435
        },
        {
            startsAt: '2019-01-31T11:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54425
        },
        {
            startsAt: '2019-01-31T12:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54571
        },
        {
            startsAt: '2019-01-31T13:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54435
        },
        {
            startsAt: '2019-01-31T14:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.5427
        },
        {
            startsAt: '2019-01-31T15:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54794
        },
        {
            startsAt: '2019-01-31T16:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.55619
        },
        {
            startsAt: '2019-01-31T17:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.5526
        },
        {
            startsAt: '2019-01-31T18:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54716
        },
        {
            startsAt: '2019-01-31T19:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.53775
        },
        {
            startsAt: '2019-01-31T20:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.52678
        },
        {
            startsAt: '2019-01-31T21:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.51067
        },
        {
            startsAt: '2019-01-31T22:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.49941
        },
        {
            startsAt: '2019-01-31T23:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.49563
        },
        {
            startsAt: '2019-02-01T00:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.48751
        },
        {
            startsAt: '2019-02-01T01:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.48326
        },
        {
            startsAt: '2019-02-01T02:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.48394
        },
        {
            startsAt: '2019-02-01T03:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.48993
        },
        {
            startsAt: '2019-02-01T04:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.5077
        },
        {
            startsAt: '2019-02-01T05:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.52142
        },
        {
            startsAt: '2019-02-01T06:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.53407
        },
        {
            startsAt: '2019-02-01T07:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54731
        },
        {
            startsAt: '2019-02-01T08:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54026
        },
        {
            startsAt: '2019-02-01T09:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.5362
        },
        {
            startsAt: '2019-02-01T10:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54605
        },
        {
            startsAt: '2019-02-01T11:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54141
        },
        {
            startsAt: '2019-02-01T12:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.53745
        },
        {
            startsAt: '2019-02-01T13:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.53765
        },
        {
            startsAt: '2019-02-01T14:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.53697
        },
        {
            startsAt: '2019-02-01T15:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54113
        },
        {
            startsAt: '2019-02-01T16:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54953
        },
        {
            startsAt: '2019-02-01T17:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.54364
        },
        {
            startsAt: '2019-02-01T18:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.53205
        },
        {
            startsAt: '2019-02-01T19:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.52335
        },
        {
            startsAt: '2019-02-01T20:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.52152
        },
        {
            startsAt: '2019-02-01T21:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.50915
        },
        {
            startsAt: '2019-02-01T22:00:00.000Z',
            priceArea: 'Kr.sand',
            currency: 'NOK',
            price: 0.49186
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

const getState = function (atHome) {
    return {
        atHome: atHome,
        homeOverride: false,
        heatingOptions: {
            workday: {
                startHour: 5,
                endHour: 23,
            },
            notWorkday: {
                startHour: 7,
                endHour: 23,
            },
            workHours: {
                startHour: 7,
                endHour: 14
            },
            country: 'NO'
        }
    };
};

const checkHighPrice = function (aDate, aTime, state, numRows) {
    it("High price at " + aTime, function () {
        let x = pricesLib.pricesStarting(getPrices(), moment(aDate), 0, 24);
        expect(pricesLib.checkHighPrice2(x, 4, moment(aDate + 'T' + aTime), state).length).to.equal(numRows);
    });
};

describe("Prices Kr.sand 31.01.2019", function () {

    before(function() {
        days.setTimeZone('Europe/Oslo');
    });

    describe("Check testdata", function () {
        it("48 hours", function () {
            expect(getPrices().length).to.equal(48);
        });
    });

    describe("Check high price - working day - home", function () {
        let state = getState(true);
        checkHighPrice('2019-01-31', '00:00:00', state, 0);
        checkHighPrice('2019-01-31', '01:00:00', state, 0);
        checkHighPrice('2019-01-31', '02:00:00', state, 0);
        checkHighPrice('2019-01-31', '03:00:00', state, 0);
        checkHighPrice('2019-01-31', '04:00:00', state, 0);
        checkHighPrice('2019-01-31', '05:00:00', state, 0);
        checkHighPrice('2019-01-31', '06:00:00', state, 0);
        checkHighPrice('2019-01-31', '07:00:00', state, 0);
        checkHighPrice('2019-01-31', '08:00:00', state, 1);
        checkHighPrice('2019-01-31', '09:00:00', state, 0);
        checkHighPrice('2019-01-31', '10:00:00', state, 1);
        checkHighPrice('2019-01-31', '11:00:00', state, 0);
        checkHighPrice('2019-01-31', '12:00:00', state, 1);
        checkHighPrice('2019-01-31', '13:00:00', state, 0);
        checkHighPrice('2019-01-31', '14:00:00', state, 0);
        checkHighPrice('2019-01-31', '15:00:00', state, 0);
        checkHighPrice('2019-01-31', '16:00:00', state, 0);
        checkHighPrice('2019-01-31', '17:00:00', state, 0);
        checkHighPrice('2019-01-31', '18:00:00', state, 0);
        checkHighPrice('2019-01-31', '19:00:00', state, 0);
        checkHighPrice('2019-01-31', '20:00:00', state, 0);
        checkHighPrice('2019-01-31', '21:00:00', state, 0);
        checkHighPrice('2019-01-31', '22:00:00', state, 0);
        checkHighPrice('2019-01-31', '23:00:00', state, 1);
    });


});