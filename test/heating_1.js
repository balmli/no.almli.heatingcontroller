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
        },
        country: 'NO'
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

const getHeatingOptionsNewDay2 = function () {
    return {
        workday: {
            startHour: 5,
            endHour: 22.5,
        },
        notWorkday: {
            startHour: 8,
            endHour: 0.3,
        },
        workHours: {
            startHour: 7.5,
            endHour: 14.5
        }
    };
};

const getHeatingOptionsNewDay3 = function () {
    return {
        workday: {
            startHour: 5,
            endHour: 0.2,
        },
        notWorkday: {
            startHour: 8,
            endHour: 0.3,
        },
        workHours: {
            startHour: 7.5,
            endHour: 14.5
        }
    };
};

describe("Heating", function () {

    describe("Heating on a Monday, at home, no home override", function () {
        it("Monday 04:00", function () {
            const aDate = new Date(2018, 11, 17, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 05:00", function () {
            const aDate = new Date(2018, 11, 17, 5, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 07:00", function () {
            const aDate = new Date(2018, 11, 17, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 10:00", function () {
            const aDate = new Date(2018, 11, 17, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 22:30", function () {
            const aDate = new Date(2018, 11, 17, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 23:00", function () {
            const aDate = new Date(2018, 11, 17, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Monday, at home, home override", function () {
        it("Monday 04:00", function () {
            const aDate = new Date(2018, 11, 17, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 05:00", function () {
            const aDate = new Date(2018, 11, 17, 5, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 07:00", function () {
            const aDate = new Date(2018, 11, 17, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 10:00", function () {
            const aDate = new Date(2018, 11, 17, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 22:30", function () {
            const aDate = new Date(2018, 11, 17, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 23:00", function () {
            const aDate = new Date(2018, 11, 17, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Monday, at home, no home override, holiday", function () {
        it("Monday 04:00", function () {
            const aDate = new Date(2018, 11, 17, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptionsHoliday());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 05:00", function () {
            const aDate = new Date(2018, 11, 17, 5, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptionsHoliday());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 07:00", function () {
            const aDate = new Date(2018, 11, 17, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptionsHoliday());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 10:00", function () {
            const aDate = new Date(2018, 11, 17, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptionsHoliday());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 22:30", function () {
            const aDate = new Date(2018, 11, 17, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptionsHoliday());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 23:00", function () {
            const aDate = new Date(2018, 11, 17, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, true, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Friday, at home, no home override", function () {
        it("Friday 04:00", function () {
            const aDate = new Date(2018, 11, 21, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Friday 05:00", function () {
            const aDate = new Date(2018, 11, 21, 5, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 07:00", function () {
            const aDate = new Date(2018, 11, 21, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Friday 10:00", function () {
            const aDate = new Date(2018, 11, 21, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Friday 22:30", function () {
            const aDate = new Date(2018, 11, 21, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 22:59", function () {
            const aDate = new Date(2018, 11, 21, 22, 59, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 23:00", function () {
            const aDate = new Date(2018, 11, 21, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Saturday, at home, no home override", function () {
        it("Saturday 04:00", function () {
            const aDate = new Date(2018, 11, 22, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 05:00", function () {
            const aDate = new Date(2018, 11, 22, 5, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 07:00", function () {
            const aDate = new Date(2018, 11, 22, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 10:00", function () {
            const aDate = new Date(2018, 11, 22, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 22:30", function () {
            const aDate = new Date(2018, 11, 22, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 22:59", function () {
            const aDate = new Date(2018, 11, 22, 22, 59, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 23:00", function () {
            const aDate = new Date(2018, 11, 22, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Sunday, at home, no home override", function () {
        it("Sunday 04:00", function () {
            const aDate = new Date(2018, 11, 16, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Sunday 05:00", function () {
            const aDate = new Date(2018, 11, 16, 5, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Sunday 07:00", function () {
            const aDate = new Date(2018, 11, 16, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Sunday 10:00", function () {
            const aDate = new Date(2018, 11, 16, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Sunday 22:30", function () {
            const aDate = new Date(2018, 11, 16, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Sunday 22:59", function () {
            const aDate = new Date(2018, 11, 16, 22, 59, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Sunday 23:00", function () {
            const aDate = new Date(2018, 11, 16, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Saturday, not at home, no home override", function () {
        it("Saturday 04:00", function () {
            const aDate = new Date(2018, 11, 22, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, false, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 10:00", function () {
            const aDate = new Date(2018, 11, 22, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, false, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 23:00", function () {
            const aDate = new Date(2018, 11, 22, 23, 0, 0, 0);
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

        it("Holiday 22:59", function () {
            const aDate = new Date(2018, 11, 25, 22, 59, 0, 0);
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

    describe("Heating on Maundy Thursday 2019", function () {
        it("Holiday 04:00", function () {
            const aDate = new Date(2019, 3, 18, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Holiday 10:00", function () {
            const aDate = new Date(2019, 3, 18, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Holiday 22:59", function () {
            const aDate = new Date(2019, 3, 18, 22, 59, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Holiday 23:00", function () {
            const aDate = new Date(2019, 3, 18, 23, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on Easter Monday 2019", function () {
        it("Holiday 04:00", function () {
            const aDate = new Date(2019, 3, 22, 4, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Holiday 10:00", function () {
            const aDate = new Date(2019, 3, 22, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Holiday 22:29", function () {
            const aDate = new Date(2019, 3, 22, 22, 29, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Holiday 22:30", function () {
            const aDate = new Date(2019, 3, 22, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Holiday 22:59", function () {
            const aDate = new Date(2019, 3, 22, 22, 59, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptions());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Holiday 23:00", function () {
            const aDate = new Date(2019, 3, 22, 23, 0, 0, 0);
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
            const aDate = new Date(2018, 11, 22, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 00:30", function () {
            const aDate = new Date(2018, 11, 22, 0, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 00:59", function () {
            const aDate = new Date(2018, 11, 22, 0, 59, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 01:00", function () {
            const aDate = new Date(2018, 11, 22, 1, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 01:01", function () {
            const aDate = new Date(2018, 11, 22, 1, 1, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 06:55", function () {
            const aDate = new Date(2018, 11, 22, 6, 55, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 07:00", function () {
            const aDate = new Date(2018, 11, 22, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 10:00", function () {
            const aDate = new Date(2018, 11, 22, 10, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 23:30", function () {
            const aDate = new Date(2018, 11, 22, 23, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });
    });

    describe("Heating on a Thursday - options 2", function () {
        it("Thursday 00:00", function () {
            const aDate = new Date(2019, 0, 31, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Thursday 00:17", function () {
            const aDate = new Date(2019, 0, 31, 0, 17, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Thursday 00:18", function () {
            const aDate = new Date(2019, 0, 31, 0, 18, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Thursday 07:00", function () {
            const aDate = new Date(2019, 0, 31, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Thursday 07:25", function () {
            const aDate = new Date(2019, 0, 31, 7, 25, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Thursday 08:00", function () {
            const aDate = new Date(2019, 0, 31, 8, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Thursday 22:29", function () {
            const aDate = new Date(2019, 0, 31, 22, 29, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Thursday 22:30", function () {
            const aDate = new Date(2019, 0, 31, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Friday - options 2", function () {
        it("Friday 00:00", function () {
            const aDate = new Date(2019, 1, 1, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Friday 00:17", function () {
            const aDate = new Date(2019, 1, 1, 0, 17, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Friday 00:18", function () {
            const aDate = new Date(2019, 1, 1, 0, 18, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Friday 07:00", function () {
            const aDate = new Date(2019, 1, 1, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 07:25", function () {
            const aDate = new Date(2019, 1, 1, 7, 25, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 08:00", function () {
            const aDate = new Date(2019, 1, 1, 8, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Friday 22:29", function () {
            const aDate = new Date(2019, 1, 1, 22, 29, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 22:30", function () {
            const aDate = new Date(2019, 1, 1, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 23:30", function () {
            const aDate = new Date(2019, 1, 1, 23, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });        
    });

    describe("Heating on a Saturday - options 2", function () {
        it("Saturday 00:00", function () {
            const aDate = new Date(2019, 1, 2, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 00:17", function () {
            const aDate = new Date(2019, 1, 2, 0, 17, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 00:18", function () {
            const aDate = new Date(2019, 1, 2, 0, 18, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 07:00", function () {
            const aDate = new Date(2019, 1, 2, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 07:25", function () {
            const aDate = new Date(2019, 1, 2, 7, 25, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 08:00", function () {
            const aDate = new Date(2019, 1, 2, 8, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 22:29", function () {
            const aDate = new Date(2019, 1, 2, 22, 29, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 22:30", function () {
            const aDate = new Date(2019, 1, 2, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 23:30", function () {
            const aDate = new Date(2019, 1, 2, 23, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });        
    });

    describe("Heating on a Sunday - options 2", function () {
        it("Sunday 00:00", function () {
            const aDate = new Date(2019, 1, 3, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Sunday 00:17", function () {
            const aDate = new Date(2019, 1, 3, 0, 17, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Sunday 00:18", function () {
            const aDate = new Date(2019, 1, 3, 0, 18, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Sunday 07:00", function () {
            const aDate = new Date(2019, 1, 3, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Sunday 07:25", function () {
            const aDate = new Date(2019, 1, 3, 7, 25, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Sunday 08:00", function () {
            const aDate = new Date(2019, 1, 3, 8, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Sunday 22:29", function () {
            const aDate = new Date(2019, 1, 3, 22, 29, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Sunday 22:30", function () {
            const aDate = new Date(2019, 1, 3, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Sunday 23:30", function () {
            const aDate = new Date(2019, 1, 3, 23, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Monday - options 2", function () {
        it("Monday 00:00", function () {
            const aDate = new Date(2019, 1, 4, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 00:11", function () {
            const aDate = new Date(2019, 1, 4, 0, 11, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 00:12", function () {
            const aDate = new Date(2019, 1, 4, 0, 12, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 07:00", function () {
            const aDate = new Date(2019, 1, 4, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 07:25", function () {
            const aDate = new Date(2019, 1, 4, 7, 25, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 08:00", function () {
            const aDate = new Date(2019, 1, 4, 8, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 22:29", function () {
            const aDate = new Date(2019, 1, 4, 22, 29, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 22:30", function () {
            const aDate = new Date(2019, 1, 4, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay2());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });
    });

    describe("Heating on a Thursday - options 3", function () {
        it("Thursday 00:00", function () {
            const aDate = new Date(2019, 0, 31, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Thursday 00:11", function () {
            const aDate = new Date(2019, 0, 31, 0, 11, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Thursday 00:12", function () {
            const aDate = new Date(2019, 0, 31, 0, 12, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Thursday 07:00", function () {
            const aDate = new Date(2019, 0, 31, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Thursday 07:25", function () {
            const aDate = new Date(2019, 0, 31, 7, 25, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Thursday 08:00", function () {
            const aDate = new Date(2019, 0, 31, 8, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Thursday 22:29", function () {
            const aDate = new Date(2019, 0, 31, 22, 29, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Thursday 22:30", function () {
            const aDate = new Date(2019, 0, 31, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Thursday 23:30", function () {
            const aDate = new Date(2019, 0, 31, 23, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });
    });

    describe("Heating on a Friday - options 3", function () {
        it("Friday 00:00", function () {
            const aDate = new Date(2019, 1, 1, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 00:11", function () {
            const aDate = new Date(2019, 1, 1, 0, 11, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 00:12", function () {
            const aDate = new Date(2019, 1, 1, 0, 12, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Friday 00:18", function () {
            const aDate = new Date(2019, 1, 1, 0, 18, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Friday 07:00", function () {
            const aDate = new Date(2019, 1, 1, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 07:25", function () {
            const aDate = new Date(2019, 1, 1, 7, 25, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 08:00", function () {
            const aDate = new Date(2019, 1, 1, 8, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Friday 22:29", function () {
            const aDate = new Date(2019, 1, 1, 22, 29, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 22:30", function () {
            const aDate = new Date(2019, 1, 1, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Friday 23:30", function () {
            const aDate = new Date(2019, 1, 1, 23, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });
    });

    describe("Heating on a Saturday - options 3", function () {
        it("Saturday 00:00", function () {
            const aDate = new Date(2019, 1, 2, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 00:17", function () {
            const aDate = new Date(2019, 1, 2, 0, 17, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 00:18", function () {
            const aDate = new Date(2019, 1, 2, 0, 18, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 07:00", function () {
            const aDate = new Date(2019, 1, 2, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 07:25", function () {
            const aDate = new Date(2019, 1, 2, 7, 25, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Saturday 08:00", function () {
            const aDate = new Date(2019, 1, 2, 8, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 22:29", function () {
            const aDate = new Date(2019, 1, 2, 22, 29, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 22:30", function () {
            const aDate = new Date(2019, 1, 2, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Saturday 23:30", function () {
            const aDate = new Date(2019, 1, 2, 23, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });
    });

    describe("Heating on a Sunday - options 3", function () {
        it("Sunday 00:00", function () {
            const aDate = new Date(2019, 1, 3, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Sunday 00:17", function () {
            const aDate = new Date(2019, 1, 3, 0, 17, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Sunday 00:18", function () {
            const aDate = new Date(2019, 1, 3, 0, 18, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Sunday 07:00", function () {
            const aDate = new Date(2019, 1, 3, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Sunday 07:25", function () {
            const aDate = new Date(2019, 1, 3, 7, 25, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Sunday 08:00", function () {
            const aDate = new Date(2019, 1, 3, 8, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Sunday 22:29", function () {
            const aDate = new Date(2019, 1, 3, 22, 29, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Sunday 22:30", function () {
            const aDate = new Date(2019, 1, 3, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });
    });

    describe("Heating on a Monday - options 3", function () {
        it("Monday 00:00", function () {
            const aDate = new Date(2019, 1, 4, 0, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 00:11", function () {
            const aDate = new Date(2019, 1, 4, 0, 11, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 00:12", function () {
            const aDate = new Date(2019, 1, 4, 0, 12, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(false);
            expect(heat.night).to.equal(true);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 07:00", function () {
            const aDate = new Date(2019, 1, 4, 7, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 07:25", function () {
            const aDate = new Date(2019, 1, 4, 7, 25, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 08:00", function () {
            const aDate = new Date(2019, 1, 4, 8, 0, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(true);
            expect(heat.heating).to.equal(false);
        });

        it("Monday 22:29", function () {
            const aDate = new Date(2019, 1, 4, 22, 29, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });

        it("Monday 22:30", function () {
            const aDate = new Date(2019, 1, 4, 22, 30, 0, 0);
            let heat = heating.calcHeating(aDate, true, false, getHeatingOptionsNewDay3());
            expect(heat.day).to.equal(true);
            expect(heat.night).to.equal(false);
            expect(heat.atWork).to.equal(false);
            expect(heat.heating).to.equal(true);
        });
    });
    
});