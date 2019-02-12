const expect = require("chai").expect;
const holidays = require('../lib/holidays');

describe("Dutch holidays", function () {
    describe("2019", function () {
        it("Check 01.01.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 0, 1)).type).to.equal('public');
        });
        it("Check 19.04.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 3, 19)).type).to.equal('observance');
        });
        it("Check 21.04.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 3, 21)).type).to.equal('observance');
        });
        it("Check 22.04.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 3, 22)).type).to.equal('public');
        });
        it("Check 27.04.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 3, 27)).type).to.equal('public');
        });
        it("Check 04.05.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 4, 4)).type).to.equal('public');
        });
        it("Check 05.05.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 4, 5)).type).to.equal('public');
        });
        it("Check 12.05.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 4, 12)).type).to.equal('observance');
        });
        it("Check 30.05.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 4, 30)).type).to.equal('public');
        });
        it("Check 09.06.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 5, 9)).type).to.equal('observance');
        });
        it("Check 10.06.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 5, 10)).type).to.equal('public');
        });
        it("Check 16.06.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 5, 16)).type).to.equal('observance');
        });
        it("Check 04.07.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 6, 4))).to.equal(false);
        });
        it("Check 17.09.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 8, 17)).type).to.equal('observance');
        });
        it("Check 04.10.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 9, 4)).type).to.equal('observance');
        });
        it("Check 11.11.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 10, 11)).type).to.equal('observance');
        });
        it("Check 05.12.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 11, 5)).type).to.equal('observance');
        });
        it("Check 15.12.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 11, 15)).type).to.equal('observance');
        });
        it("Check 24.12.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 11, 24))).to.equal(false);
        });
        it("Check 25.12.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 11, 25)).type).to.equal('public');
        });
        it("Check 26.12.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 11, 26)).type).to.equal('public');
        });
        it("Check 31.12.2019", function () {
            expect(holidays.isHoliday('NL', new Date(2019, 11, 31)).type).to.equal('bank');
        });
    });
});
