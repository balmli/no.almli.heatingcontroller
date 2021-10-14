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

const checkAvgPrice = function (aDate, startHour, below, percentage, state) {
    const aDays = dayjs(aDate).tz();
    const startingAt = aDays.hour(startHour).startOf('hour');
    const prices = getPrices();
    it("Average price check at " + aDate + ' - ' + startHour, function () {
        const price = pricesLib.pricesStarting(prices, aDays, startHour, 1);
        expect(price.length).to.equal(1);
        let avg = pricesLib.averagePricesStarting(prices, aDays, 0, 24);
        let chk = pricesLib.checkAveragePrice(price[0].price, avg, below, percentage);
        expect(chk).to.equal(state);
    });
};

describe("Average price change", function () {

    before(function() {
        days.setTimeZone('Europe/Oslo');
    });

    describe("1 percent", function () {
        it("0.53775 >= 1% higher than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.53775, 0.5290425, false, 1)).to.equal(true);
        });
        it("0.52678 NOT >= 1% higher than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.52678, 0.5290425, false, 1)).to.equal(false);
        });
    });

    describe("2 percent", function () {
        it("0.54716 >= 2% higher than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.54716, 0.5290425, false, 2)).to.equal(true);
        });
        it("0.53775 NOT >= 2% higher than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.53775, 0.5290425, false, 2)).to.equal(false);
        });
    });

    describe("5 percent", function () {
        it("0.55619 >= 5% higher than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.55619, 0.5290425, false, 5)).to.equal(true);
        });
        it("0.5526 NOT >= 5% higher than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.5526, 0.5290425, false, 5)).to.equal(false);
        });
    });

    describe("-1 percent", function () {
        it("0.49941 <= 1% lower than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.49441, 0.5290425, true, 1)).to.equal(true);
        });
        it("0.52678 NOT <= 1% lower than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.52678, 0.5290425, true, 1)).to.equal(false);
        });
    });

    describe("-3 percent", function () {
        it("0.51067 <= 3% lower than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.51067, 0.5290425, true, 3)).to.equal(true);
        });
        it("0.52164 NOT <= 3% lower than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.52164, 0.5290425, true, 3)).to.equal(false);
        });
    });

    describe("-5 percent", function () {
        it("0.49417 <= 5% lower than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.49417, 0.5290425, true, 5)).to.equal(true);
        });
        it("0.52164 NOT <= 5% lower than 0.5290425", function () {
            expect(pricesLib.checkAveragePrice(0.52164, 0.5290425, true, 5)).to.equal(false);
        });
    });
});

describe("Average prices Kr.sand 31.01.2019", function () {

    before(function() {
        days.setTimeZone('Europe/Oslo');
    });

    describe("Check testdata", function () {
        it("48 hours", function () {
            expect(getPrices().length).to.equal(48);
        });
    });

    describe("Check average below 1 % of average", function () {
        checkAvgPrice('2019-01-31', 0, true, 1, true);
        checkAvgPrice('2019-01-31', 1, true, 1, true);
        checkAvgPrice('2019-01-31', 2, true, 1, true);
        checkAvgPrice('2019-01-31', 3, true, 1, true);
        checkAvgPrice('2019-01-31', 4, true, 1, true);
        checkAvgPrice('2019-01-31', 5, true, 1, true);
        checkAvgPrice('2019-01-31', 6, true, 1, false);
        checkAvgPrice('2019-01-31', 7, true, 1, false);
        checkAvgPrice('2019-01-31', 8, true, 1, false);
        checkAvgPrice('2019-01-31', 9, true, 1, false);
        checkAvgPrice('2019-01-31', 10, true, 1, false);
        checkAvgPrice('2019-01-31', 11, true, 1, false);
        checkAvgPrice('2019-01-31', 12, true, 1, false);
        checkAvgPrice('2019-01-31', 13, true, 1, false);
        checkAvgPrice('2019-01-31', 14, true, 1, false);
        checkAvgPrice('2019-01-31', 15, true, 1, false);
        checkAvgPrice('2019-01-31', 16, true, 1, false);
        checkAvgPrice('2019-01-31', 17, true, 1, false);
        checkAvgPrice('2019-01-31', 18, true, 1, false);
        checkAvgPrice('2019-01-31', 19, true, 1, false);
        checkAvgPrice('2019-01-31', 20, true, 1, false);
        checkAvgPrice('2019-01-31', 21, true, 1, false);
        checkAvgPrice('2019-01-31', 22, true, 1, true);
        checkAvgPrice('2019-01-31', 23, true, 1, true);
    });

    describe("Check average above 1 % of average", function () {
        checkAvgPrice('2019-01-31', 0, false, 1, false);
        checkAvgPrice('2019-01-31', 1, false, 1, false);
        checkAvgPrice('2019-01-31', 2, false, 1, false);
        checkAvgPrice('2019-01-31', 3, false, 1, false);
        checkAvgPrice('2019-01-31', 4, false, 1, false);
        checkAvgPrice('2019-01-31', 5, false, 1, false);
        checkAvgPrice('2019-01-31', 6, false, 1, false);
        checkAvgPrice('2019-01-31', 7, false, 1, true);
        checkAvgPrice('2019-01-31', 8, false, 1, true);
        checkAvgPrice('2019-01-31', 9, false, 1, true);
        checkAvgPrice('2019-01-31', 10, false, 1, true);
        checkAvgPrice('2019-01-31', 11, false, 1, true);
        checkAvgPrice('2019-01-31', 12, false, 1, true);
        checkAvgPrice('2019-01-31', 13, false, 1, true);
        checkAvgPrice('2019-01-31', 14, false, 1, true);
        checkAvgPrice('2019-01-31', 15, false, 1, true);
        checkAvgPrice('2019-01-31', 16, false, 1, true);
        checkAvgPrice('2019-01-31', 17, false, 1, true);
        checkAvgPrice('2019-01-31', 18, false, 1, true);
        checkAvgPrice('2019-01-31', 19, false, 1, true);
        checkAvgPrice('2019-01-31', 20, false, 1, true);
        checkAvgPrice('2019-01-31', 21, false, 1, false);
        checkAvgPrice('2019-01-31', 22, false, 1, false);
        checkAvgPrice('2019-01-31', 23, false, 1, false);
    });

    describe("Check average below 3 % of average", function () {
        checkAvgPrice('2019-01-31', 0, true, 3, true);
        checkAvgPrice('2019-01-31', 1, true, 3, true);
        checkAvgPrice('2019-01-31', 2, true, 3, true);
        checkAvgPrice('2019-01-31', 3, true, 3, true);
        checkAvgPrice('2019-01-31', 4, true, 3, true);
        checkAvgPrice('2019-01-31', 5, true, 3, false);
        checkAvgPrice('2019-01-31', 6, true, 3, false);
        checkAvgPrice('2019-01-31', 7, true, 3, false);
        checkAvgPrice('2019-01-31', 8, true, 3, false);
        checkAvgPrice('2019-01-31', 9, true, 3, false);
        checkAvgPrice('2019-01-31', 10, true, 3, false);
        checkAvgPrice('2019-01-31', 11, true, 3, false);
        checkAvgPrice('2019-01-31', 12, true, 3, false);
        checkAvgPrice('2019-01-31', 13, true, 3, false);
        checkAvgPrice('2019-01-31', 14, true, 3, false);
        checkAvgPrice('2019-01-31', 15, true, 3, false);
        checkAvgPrice('2019-01-31', 16, true, 3, false);
        checkAvgPrice('2019-01-31', 17, true, 3, false);
        checkAvgPrice('2019-01-31', 18, true, 3, false);
        checkAvgPrice('2019-01-31', 19, true, 3, false);
        checkAvgPrice('2019-01-31', 20, true, 3, false);
        checkAvgPrice('2019-01-31', 21, true, 3, false);
        checkAvgPrice('2019-01-31', 22, true, 3, true);
        checkAvgPrice('2019-01-31', 23, true, 3, true);
    });

    describe("Check average above 3 % of average", function () {
        checkAvgPrice('2019-01-31', 0, false, 3, false);
        checkAvgPrice('2019-01-31', 1, false, 3, false);
        checkAvgPrice('2019-01-31', 2, false, 3, false);
        checkAvgPrice('2019-01-31', 3, false, 3, false);
        checkAvgPrice('2019-01-31', 4, false, 3, false);
        checkAvgPrice('2019-01-31', 5, false, 3, false);
        checkAvgPrice('2019-01-31', 6, false, 3, false);
        checkAvgPrice('2019-01-31', 7, false, 3, true);
        checkAvgPrice('2019-01-31', 8, false, 3, true);
        checkAvgPrice('2019-01-31', 9, false, 3, true);
        checkAvgPrice('2019-01-31', 10, false, 3, true);
        checkAvgPrice('2019-01-31', 11, false, 3, false);
        checkAvgPrice('2019-01-31', 12, false, 3, false);
        checkAvgPrice('2019-01-31', 13, false, 3, true);
        checkAvgPrice('2019-01-31', 14, false, 3, false);
        checkAvgPrice('2019-01-31', 15, false, 3, false);
        checkAvgPrice('2019-01-31', 16, false, 3, true);
        checkAvgPrice('2019-01-31', 17, false, 3, true);
        checkAvgPrice('2019-01-31', 18, false, 3, true);
        checkAvgPrice('2019-01-31', 19, false, 3, true);
        checkAvgPrice('2019-01-31', 20, false, 3, false);
        checkAvgPrice('2019-01-31', 21, false, 3, false);
        checkAvgPrice('2019-01-31', 22, false, 3, false);
        checkAvgPrice('2019-01-31', 23, false, 3, false);
    });

});