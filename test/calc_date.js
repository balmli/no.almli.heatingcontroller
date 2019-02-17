const chai = require("chai");
chai.use(require('chai-datetime'));
const expect = chai.expect;
const holidays = require('../lib/holidays');

describe("Calc date", function () {
    describe("Check", function () {
        it("Check 01.01.2019", function () {
            expect(holidays.calcDate(new Date(2019, 0, 1))).to.equalDate(new Date(2019, 0, 1));
        });
        it("Check 02.01.2019 yesterday", function () {
            expect(holidays.calcDate(new Date(2019, 0, 2), 'yesterday')).to.equalDate(new Date(2019, 0, 1));
        });
        it("Check 02.01.2019 tomorrow", function () {
            expect(holidays.calcDate(new Date(2019, 0, 2), 'tomorrow')).to.equalDate(new Date(2019, 0, 3));
        });
    });
});
