const expect = require("chai").expect;
const dayjs = require('dayjs');
const pricesLib = require('../lib/prices');
const days = require("../lib/days");

let _prices = undefined;

const getPrices = function () {
    if (_prices) {
        return _prices;
    }
    const prices = [
        {
            startsAt: '2019-01-20T23:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.49599
        },
        {
            startsAt: '2019-01-21T00:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.49103
        },
        {
            startsAt: '2019-01-21T01:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.48919
        },
        {
            startsAt: '2019-01-21T02:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.48987
        },
        {
            startsAt: '2019-01-21T03:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.4955
        },
        {
            startsAt: '2019-01-21T04:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.52078
        },
        {
            startsAt: '2019-01-21T05:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.53604
        },
        {
            startsAt: '2019-01-21T06:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.60264
        },
        {
            startsAt: '2019-01-21T07:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.63073
        },
        {
            startsAt: '2019-01-21T08:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.60176
        },
        {
            startsAt: '2019-01-21T09:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.56754
        },
        {
            startsAt: '2019-01-21T10:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.55704
        },
        {
            startsAt: '2019-01-21T11:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.55344
        },
        {
            startsAt: '2019-01-21T12:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.55315
        },
        {
            startsAt: '2019-01-21T13:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.55772
        },
        {
            startsAt: '2019-01-21T14:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.56385
        },
        {
            startsAt: '2019-01-21T15:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.58008
        },
        {
            startsAt: '2019-01-21T16:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.59671
        },
        {
            startsAt: '2019-01-21T17:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.57979
        },
        {
            startsAt: '2019-01-21T18:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.54868
        },
        {
            startsAt: '2019-01-21T19:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.53634
        },
        {
            startsAt: '2019-01-21T20:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.53264
        },
        {
            startsAt: '2019-01-21T21:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.52185
        },
        {
            startsAt: '2019-01-21T22:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.50902
        },
        {
            startsAt: '2019-01-21T23:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.49599
        },
        {
            startsAt: '2019-01-22T00:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.49103
        },
        {
            startsAt: '2019-01-22T01:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.48919
        },
        {
            startsAt: '2019-01-22T02:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.48987
        },
        {
            startsAt: '2019-01-22T03:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.4955
        },
        {
            startsAt: '2019-01-22T04:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.52078
        },
        {
            startsAt: '2019-01-22T05:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.53604
        },
        {
            startsAt: '2019-01-22T06:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.60264
        },
        {
            startsAt: '2019-01-22T07:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.63073
        },
        {
            startsAt: '2019-01-22T08:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.60176
        },
        {
            startsAt: '2019-01-22T09:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.56754
        },
        {
            startsAt: '2019-01-22T10:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.55704
        },
        {
            startsAt: '2019-01-22T11:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.55344
        },
        {
            startsAt: '2019-01-22T12:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.55315
        },
        {
            startsAt: '2019-01-22T13:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.55772
        },
        {
            startsAt: '2019-01-22T14:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.56385
        },
        {
            startsAt: '2019-01-22T15:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.58008
        },
        {
            startsAt: '2019-01-22T16:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.59671
        },
        {
            startsAt: '2019-01-22T17:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.57979
        },
        {
            startsAt: '2019-01-22T18:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.54868
        },
        {
            startsAt: '2019-01-22T19:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.53634
        },
        {
            startsAt: '2019-01-22T20:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.53264
        },
        {
            startsAt: '2019-01-22T21:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.52185
        },
        {
            startsAt: '2019-01-22T22:00:00.000Z',
            priceArea: 'FI',
            currency: 'EUR',
            price: 0.50902
        }
    ];
    _prices = prices
      .map(p => {
          const date = dayjs(p.startsAt);
          const local = date.tz();
          p.startsAt = local;
          p.startIso = date.toISOString();
          p.startLocal = local.format();
          return p;
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
                endHour: 22.5,
            },
            notWorkday: {
                startHour: 7,
                endHour: 23,
            },
            workHours: {
                startHour: 7,
                endHour: 14
            },
            country: 'FI'
        }
    };
};

const checkLowPrice = function (aDate, aTime, numRows) {
    it("Low price at " + aTime, function () {
        let x = pricesLib.pricesStarting(getPrices(), dayjs(aDate).tz(), 0, 24);
        expect(pricesLib.checkLowPrice(x, 18, dayjs(aDate + 'T' + aTime).tz()).length).to.equal(numRows);
    });
};

const checkHighPrice = function (aDate, aTime, state, numRows) {
    it("High price at " + aTime, function () {
        let x = pricesLib.pricesStarting(getPrices(), dayjs(aDate).tz(), 0, 24);
        expect(pricesLib.checkHighPrice2(x, 6, dayjs(aDate + 'T' + aTime).tz(), state).length).to.equal(numRows);
    });
};

describe("Prices", function () {

    before(function() {
        days.setTimeZone('Europe/Helsinki');
    });

    describe("Check testdata", function () {
        it("48 hours", function () {
            expect(getPrices().length).to.equal(48);
        });
    });

    describe("Check no prices", function () {
        it("No prices: pricesStarting", function () {
            expect(pricesLib.pricesStarting([], dayjs('2019-01-21').tz(), 0, 24).length).to.equal(0);
        });
        it("No prices: checkLowPrice", function () {
            expect(pricesLib.checkLowPrice([], 18, dayjs('2019-01-21').tz()).length).to.equal(0);
        });
        it("No prices: checkHighPrice", function () {
            expect(pricesLib.checkHighPrice2([], 6, dayjs('2019-01-21').tz(), {}).length).to.equal(0);
        });
    });

    describe("Prices next hours", function () {
        it("2019-01-21: 24 hours", function () {
            const forDay = dayjs('2019-01-21').startOf('day').tz();
            const prcs = pricesLib.pricesStarting(getPrices(), forDay, 0, 24)
            expect(prcs.length).to.equal(24);
        });
        it("2019-01-22: 24 hours", function () {
            expect(pricesLib.pricesStarting(getPrices(), dayjs('2019-01-22').tz(), 0, 24).length).to.equal(24);
        });
        it("2019-01-21T10:00:00: 20 hours", function () {
            let prices = pricesLib.pricesStarting(getPrices(), dayjs('2019-01-21').tz(), 10, 20);
            expect(prices.length).to.equal(20);
            expect(prices[0].startsAt.format()).to.equal('2019-01-21T10:00:00+02:00');
            expect(prices[prices.length - 1].startsAt.format()).to.equal('2019-01-22T05:00:00+02:00');
        });
        it("2019-01-23: 0 hours", function () {
            expect(pricesLib.pricesStarting(getPrices(), dayjs('2019-01-23').tz(), 0, 24).length).to.equal(1);
        });
    });

    describe("Check low price", function () {
        checkLowPrice('2019-01-21', '00:00:00', 1);
        checkLowPrice('2019-01-21', '01:00:00', 1);
        checkLowPrice('2019-01-21', '02:00:00', 1);
        checkLowPrice('2019-01-21', '03:00:00', 1);
        checkLowPrice('2019-01-21', '04:00:00', 1);
        checkLowPrice('2019-01-21', '05:00:00', 1);
        checkLowPrice('2019-01-21', '06:00:00', 1);
        checkLowPrice('2019-01-21', '06:59:59', 1);
        checkLowPrice('2019-01-21', '07:00:00', 0);
        checkLowPrice('2019-01-21', '08:00:00', 0);
        checkLowPrice('2019-01-21', '09:00:00', 0);
        checkLowPrice('2019-01-21', '10:00:00', 1);
        checkLowPrice('2019-01-21', '11:00:00', 1);
        checkLowPrice('2019-01-21', '12:00:00', 1);
        checkLowPrice('2019-01-21', '13:00:00', 1);
        checkLowPrice('2019-01-21', '14:00:00', 1);
        checkLowPrice('2019-01-21', '15:00:00', 1);
        checkLowPrice('2019-01-21', '16:00:00', 0);
        checkLowPrice('2019-01-21', '17:00:00', 0);
        checkLowPrice('2019-01-21', '18:00:00', 0);
        checkLowPrice('2019-01-21', '19:00:00', 1);
        checkLowPrice('2019-01-21', '20:00:00', 1);
        checkLowPrice('2019-01-21', '21:00:00', 1);
        checkLowPrice('2019-01-21', '22:00:00', 1);
        checkLowPrice('2019-01-21', '23:00:00', 1);
    });

    describe("Check high price - working day - home", function () {
        let state = getState(true);
        checkHighPrice('2019-01-21', '00:00:00', state, 1);
        checkHighPrice('2019-01-21', '01:00:00', state, 0);
        checkHighPrice('2019-01-21', '02:00:00', state, 0);
        checkHighPrice('2019-01-21', '03:00:00', state, 0);
        checkHighPrice('2019-01-21', '04:00:00', state, 0);
        checkHighPrice('2019-01-21', '05:00:00', state, 0);
        checkHighPrice('2019-01-21', '06:00:00', state, 1);
        checkHighPrice('2019-01-21', '07:00:00', state, 0);
        checkHighPrice('2019-01-21', '08:00:00', state, 1);
        checkHighPrice('2019-01-21', '09:00:00', state, 0);
        checkHighPrice('2019-01-21', '10:00:00', state, 1);
        checkHighPrice('2019-01-21', '11:00:00', state, 0);
        checkHighPrice('2019-01-21', '12:00:00', state, 1);
        checkHighPrice('2019-01-21', '13:00:00', state, 0);
        checkHighPrice('2019-01-21', '14:00:00', state, 0);
        checkHighPrice('2019-01-21', '15:00:00', state, 0);
        checkHighPrice('2019-01-21', '16:00:00', state, 0);
        checkHighPrice('2019-01-21', '17:00:00', state, 0);
        checkHighPrice('2019-01-21', '18:00:00', state, 0);
        checkHighPrice('2019-01-21', '19:00:00', state, 0);
        checkHighPrice('2019-01-21', '20:00:00', state, 0);
        checkHighPrice('2019-01-21', '21:00:00', state, 0);
        checkHighPrice('2019-01-21', '22:00:00', state, 0);
        checkHighPrice('2019-01-21', '23:00:00', state, 1);
    });

    describe("Check high price - working day - away", function () {
        let state = getState(false);
        checkHighPrice('2019-01-21', '00:00:00', state, 0);
        checkHighPrice('2019-01-21', '01:00:00', state, 0);
        checkHighPrice('2019-01-21', '02:00:00', state, 0);
        checkHighPrice('2019-01-21', '03:00:00', state, 0);
        checkHighPrice('2019-01-21', '04:00:00', state, 0);
        checkHighPrice('2019-01-21', '05:00:00', state, 0);
        checkHighPrice('2019-01-21', '06:00:00', state, 0);
        checkHighPrice('2019-01-21', '07:00:00', state, 0);
        checkHighPrice('2019-01-21', '08:00:00', state, 1);
        checkHighPrice('2019-01-21', '09:00:00', state, 0);
        checkHighPrice('2019-01-21', '10:00:00', state, 1);
        checkHighPrice('2019-01-21', '11:00:00', state, 0);
        checkHighPrice('2019-01-21', '12:00:00', state, 1);
        checkHighPrice('2019-01-21', '13:00:00', state, 0);
        checkHighPrice('2019-01-21', '14:00:00', state, 1);
        checkHighPrice('2019-01-21', '15:00:00', state, 0);
        checkHighPrice('2019-01-21', '16:00:00', state, 1);
        checkHighPrice('2019-01-21', '17:00:00', state, 0);
        checkHighPrice('2019-01-21', '18:00:00', state, 1);
        checkHighPrice('2019-01-21', '19:00:00', state, 0);
        checkHighPrice('2019-01-21', '20:00:00', state, 0);
        checkHighPrice('2019-01-21', '21:00:00', state, 0);
        checkHighPrice('2019-01-21', '22:00:00', state, 0);
        checkHighPrice('2019-01-21', '23:00:00', state, 0);
    });

});