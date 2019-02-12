const expect = require("chai").expect;
const holidays = require('../lib/holidays');

describe("Swedish holidays", function () {
    describe("2019", function () {
        it("Check 01.01.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 0, 1)).type).to.equal('public');
        });
        it("Check 06.01.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 0, 6)).type).to.equal('public');
        });
        it("Check 13.01.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 0, 13)).type).to.equal('observance');
        });
        it("Check 03.03.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 2, 3)).type).to.equal('observance');
        });
        it("Check 25.03.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 2, 25)).type).to.equal('observance');
        });
        it("Check 19.04.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 3, 19)).type).to.equal('public');
        });
        it("Check 21.04.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 3, 21)).type).to.equal('observance');
        });
        it("Check 22.04.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 3, 22)).type).to.equal('public');
        });
        it("Check 30.04.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 3, 30)).type).to.equal('observance');
        });
        it("Check 01.05.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 4, 1)).type).to.equal('public');
        });
        it("Check 26.05.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 4, 26)).type).to.equal('observance');
        });
        it("Check 06.06.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 5, 6)).type).to.equal('public');
        });
        it("Check 09.06.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 5, 9)).type).to.equal('observance');
        });
        it("Check 22.06.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 5, 22)).type).to.equal('public');
        });
        it("Check 04.07.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 6, 4))).to.equal(false);
        });
        it("Check 10.12.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 11, 10)).type).to.equal('observance');
        });
        it("Check 13.12.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 11, 13)).type).to.equal('observance');
        });
        it("Check 24.12.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 11, 24)).type).to.equal('observance');
        });
        it("Check 25.12.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 11, 25)).type).to.equal('public');
        });
        it("Check 26.12.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 11, 26)).type).to.equal('public');
        });
        it("Check 31.12.2019", function () {
            expect(holidays.isHoliday('SE', new Date(2019, 11, 31)).type).to.equal('observance');
        });
    });
});

