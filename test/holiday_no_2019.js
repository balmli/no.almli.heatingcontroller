const expect = require("chai").expect;
const holidays = require('../lib/holidays');

describe("Norwegian holidays", function () {
    describe("2019", function () {
        it("Check 01.01.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 0, 1)).type).to.equal('public');
        });
        it("Check 02.01.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 0, 2))).to.equal(false);
        });
        it("Check 01.01.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2018, 11, 31), 'tomorrow').type).to.equal('public');
        });
        it("Check 01.01.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 0, 2), 'yesterday').type).to.equal('public');
        });
        it("Check 10.02.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 1, 10)).type).to.equal('observance');
        });
        it("Check 18.04.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 3, 18)).type).to.equal('public');
        });
        it("Check 19.04.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 3, 19)).type).to.equal('public');
        });
        it("Check 22.04.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 3, 22)).type).to.equal('public');
        });
        it("Check 01.05.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 4, 1)).type).to.equal('public');
        });
        it("Check 02.05.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 4, 2))).to.equal(false);
        });
        it("Check 17.05.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 4, 17)).type).to.equal('public');
        });
        it("Check 29.05.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 4, 29))).to.equal(false);
        });
        it("Check 30.05.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 4, 30)).type).to.equal('public');
        });
        it("Check 08.06.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 5, 8))).to.equal(false);
        });
        it("Check 09.06.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 5, 9)).type).to.equal('public');
        });
        it("Check 10.06.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 5, 10)).type).to.equal('public');
        });
        it("Check 04.07.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 6, 4))).to.equal(false);
        });
        it("Check 01.12.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 11, 1)).type).to.equal('observance');
        });
        it("Check 24.12.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 11, 24)).type).to.equal('bank');
        });
        it("Check 25.12.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 11, 25)).type).to.equal('public');
        });
        it("Check 26.12.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 11, 26)).type).to.equal('public');
        });
        it("Check 31.12.2019", function () {
            expect(holidays.isHoliday('NO', new Date(2019, 11, 31))).to.equal(false);
        });
    });
});
