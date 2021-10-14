const expect = require("chai").expect;
const dayjs = require('dayjs');
const days = require('../lib/days');

describe("Prices", function () {

    before(function() {
        days.setTimeZone('Europe/Oslo');
    });

    describe("Timestamp for Oslo 2019-01-21", function () {
        it("2019-01-21", function () {
            expect(dayjs('2019-01-21').utc().toISOString()).to.equal('2019-01-20T23:00:00.000Z');
        });
    });

});