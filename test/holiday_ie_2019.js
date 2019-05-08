const expect = require("chai").expect;
const holidays = require('../lib/holidays');

describe("Irish holidays", function () {
    describe("2019", function () {
        it("Check 01.01.2019", function () {
            expect(holidays.isHoliday('IE', new Date(2019, 0, 1)).type).to.equal('public');
        });
        it("Check 17.03.2019", function () {
            expect(holidays.isHoliday('IE', new Date(2019, 2, 17)).type).to.equal('public');
        });
        it("Check 19.04.2019", function () {
            expect(holidays.isHoliday('IE', new Date(2019, 3, 19)).type).to.equal('bank');
        });
        it("Check 22.04.2019", function () {
            expect(holidays.isHoliday('IE', new Date(2019, 3, 22)).type).to.equal('public');
        });
        it("Check 06.05.2019", function () {
            expect(holidays.isHoliday('IE', new Date(2019, 4, 6)).type).to.equal('public');
        });
        it("Check 03.06.2019", function () {
            expect(holidays.isHoliday('IE', new Date(2019, 5, 3)).type).to.equal('public');
        });
        it("Check 05.08.2019", function () {
            expect(holidays.isHoliday('IE', new Date(2019, 7, 5)).type).to.equal('public');
        });
        it("Check 28.10.2019", function () {
            expect(holidays.isHoliday('IE', new Date(2019, 9, 28)).type).to.equal('public');
        });
        it("Check 25.12.2019", function () {
            expect(holidays.isHoliday('IE', new Date(2019, 11, 25)).type).to.equal('public');
        });
        it("Check 26.12.2019", function () {
            expect(holidays.isHoliday('IE', new Date(2019, 11, 26)).type).to.equal('public');
        });
    });
});

