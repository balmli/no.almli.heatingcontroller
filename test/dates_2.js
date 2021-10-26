const moment = require('../lib/moment-timezone-with-data');
const expect = require("chai").expect;
const days = require('../lib/days');

describe("Prices", function () {

    before(function() {
        days.setTimeZone('Europe/Helsinki');
    });

    describe("Timestamp for Helsinki 2019-01-21", function () {
        it("2019-01-21", function () {
            expect(moment('2019-01-21').utc().toISOString()).to.equal('2019-01-20T22:00:00.000Z');
        });
    });

});