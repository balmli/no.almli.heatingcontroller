const expect = require("chai").expect;
const holidays = require('../lib/holidays');

describe("Australian holidays", function () {
    describe("2019", function () {
        it("Check 01.01.2019", function () {
            expect(holidays.isHoliday('AU', new Date(2019, 0, 1)).type).to.equal('public');
        });
        it("Check 19.04.2019", function () {
            expect(holidays.isHoliday('AU', new Date(2019, 3, 19)).type).to.equal('public');
        });
        it("Check 22.04.2019", function () {
            expect(holidays.isHoliday('AU', new Date(2019, 3, 22)).type).to.equal('public');
        });
        it("Check 25.12.2019", function () {
            expect(holidays.isHoliday('AU', new Date(2019, 11, 25)).type).to.equal('public');
        });
        it("Check 26.12.2019", function () {
            expect(holidays.isHoliday('AU', new Date(2019, 11, 26)).type).to.equal('public');
        });
        it("Check 31.12.2019", function () {
            expect(holidays.isHoliday('AU', new Date(2019, 11, 31)).type).to.equal('observance');
        });
    });
});

