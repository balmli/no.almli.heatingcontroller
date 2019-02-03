const expect = require("chai").expect;
const heating = require('../lib/heating');

const getHeatingOptions = function () {
    return {
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
        }
    };
};

const getHeatingOptionsHoliday = function () {
    let opts = getHeatingOptions();
    opts.holiday_today = 'holiday';
    return opts;
};

const getHeatingOptionsPresence = function () {
    let opts = getHeatingOptions();
    opts.presenceForModes = true;
    return opts;
};

const getHeatingOptionsNewDay = function () {
    return {
        workday: {
            startHour: 5,
            endHour: 22.5,
        },
        notWorkday: {
            startHour: 7,
            endHour: 1,
        },
        workHours: {
            startHour: 7,
            endHour: 14
        }
    };
};

describe("Heating", function () {

    describe("Heating on a Monday, at home, no home override", function () {
        it("Monday 04:00", function () {
            const aDate = new Date(2018, 11, 19, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 05:00", function () {
            const aDate = new Date(2018, 11, 19, 5, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 07:00", function () {
            const aDate = new Date(2018, 11, 19, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 10:00", function () {
            const aDate = new Date(2018, 11, 19, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 22:30", function () {
            const aDate = new Date(2018, 11, 19, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 23:00", function () {
            const aDate = new Date(2018, 11, 19, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Monday, at home, home override", function () {
        it("Monday 04:00", function () {
            const aDate = new Date(2018, 11, 19, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 05:00", function () {
            const aDate = new Date(2018, 11, 19, 5, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 07:00", function () {
            const aDate = new Date(2018, 11, 19, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 10:00", function () {
            const aDate = new Date(2018, 11, 19, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 22:30", function () {
            const aDate = new Date(2018, 11, 19, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 23:00", function () {
            const aDate = new Date(2018, 11, 19, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Monday, at home, no home override, holiday", function () {
        it("Monday 04:00", function () {
            const aDate = new Date(2018, 11, 19, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptionsHoliday());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 05:00", function () {
            const aDate = new Date(2018, 11, 19, 5, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptionsHoliday());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 07:00", function () {
            const aDate = new Date(2018, 11, 19, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptionsHoliday());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 10:00", function () {
            const aDate = new Date(2018, 11, 19, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptionsHoliday());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 22:30", function () {
            const aDate = new Date(2018, 11, 19, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptionsHoliday());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 23:00", function () {
            const aDate = new Date(2018, 11, 19, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Saturday, at home, no home override", function () {
        it("Saturday 04:00", function () {
            const aDate = new Date(2018, 10, 24, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 05:00", function () {
            const aDate = new Date(2018, 10, 24, 5, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 07:00", function () {
            const aDate = new Date(2018, 10, 24, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 10:00", function () {
            const aDate = new Date(2018, 10, 24, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 22:30", function () {
            const aDate = new Date(2018, 10, 24, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 23:00", function () {
            const aDate = new Date(2018, 10, 24, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Saturday, not at home, no home override", function () {
        it("Saturday 04:00", function () {
            const aDate = new Date(2018, 10, 24, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, false, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 10:00", function () {
            const aDate = new Date(2018, 10, 24, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, false, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 23:00", function () {
            const aDate = new Date(2018, 10, 24, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, false, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a holiday", function () {
        it("Holiday 04:00", function () {
            const aDate = new Date(2018, 11, 25, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Holiday 10:00", function () {
            const aDate = new Date(2018, 11, 25, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Holiday 23:00", function () {
            const aDate = new Date(2018, 11, 25, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a working day - presence: Not home", function () {
        it("Working day 04:00", function () {
            const aDate = new Date(2018, 10, 19, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsPresence(), false);
            expect(heat.atHome).to.equal(false);
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Working day 10:00", function () {
            const aDate = new Date(2018, 10, 19, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsPresence(), false);
            expect(heat.atHome).to.equal(false);
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Working day 18:00", function () {
            const aDate = new Date(2018, 10, 19, 18, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsPresence(), false);
            expect(heat.atHome).to.equal(false);
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Working day 23:00", function () {
            const aDate = new Date(2018, 10, 19, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsPresence(), false);
            expect(heat.atHome).to.equal(false);
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a working day - presence: Home", function () {
        it("Working day 04:00", function () {
            const aDate = new Date(2018, 10, 19, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsPresence(), true);
            expect(heat.atHome).to.equal(true);
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Working day 10:00", function () {
            const aDate = new Date(2018, 10, 19, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsPresence(), true);
            expect(heat.atHome).to.equal(true);
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Working day 18:00", function () {
            const aDate = new Date(2018, 10, 19, 18, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsPresence(), true);
            expect(heat.atHome).to.equal(true);
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Working day 23:00", function () {
            const aDate = new Date(2018, 10, 19, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsPresence(), true);
            expect(heat.atHome).to.equal(true);
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a saturday - options ", function () {
        it("Saturday 00:00", function () {
            const aDate = new Date(2018, 10, 24, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 00:30", function () {
            const aDate = new Date(2018, 10, 24, 0, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 00:59", function () {
            const aDate = new Date(2018, 10, 24, 0, 59, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 01:00", function () {
            const aDate = new Date(2018, 10, 24, 1, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 01:01", function () {
            const aDate = new Date(2018, 10, 24, 1, 1, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 06:55", function () {
            const aDate = new Date(2018, 10, 24, 6, 55, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 07:00", function () {
            const aDate = new Date(2018, 10, 24, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 10:00", function () {
            const aDate = new Date(2018, 10, 24, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 23:30", function () {
            const aDate = new Date(2018, 10, 24, 23, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });
    });

});