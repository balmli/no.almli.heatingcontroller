'use strict';

let isDay = function (aDate, opts) {
    let workDay = isWorkDay(aDate, opts);
    let hour = aDate.getHours() + aDate.getMinutes() / 60 + aDate.getSeconds() / 3600;
    return workDay && hour >= opts.workday.startHour && hour < opts.workday.endHour ||
        !workDay && hour >= opts.notWorkday.startHour && hour < opts.notWorkday.endHour;
};

let isWorkDay = function (aDate, opts) {
    return !isHoliday(aDate, opts) && aDate.getDay() >= 1 && aDate.getDay() <= 5;
};

let isWorkTime = function (aDate, opts) {
    let hour = aDate.getHours() + aDate.getMinutes() / 60 + aDate.getSeconds() / 3600;
    return isWorkDay(aDate, opts) && hour >= opts.workHours.startHour && hour < opts.workHours.endHour;
};

let isHoliday = function (aDate, opts) {
    if (opts && (opts.holiday_today === 'holiday' || opts.holiday_today === 'not_holiday')) {
        return opts.holiday_today === 'holiday';
    }

    // Norwegian holidays
    let today = new Date();
    let m = aDate.getMonth() + 1;
    let d = aDate.getDate();
    let easterDate = easter(aDate.getFullYear());
    return (m === 1 && (d === 1)) ||
        (m === 5 && (d === 1 || d === 17)) ||
        (m === 12 && (d === 24 || d === 25 || d === 26 || d === 31)) ||
        equals(aDate, addDate(easterDate, -3)) ||
        equals(aDate, addDate(easterDate, -2)) ||
        equals(aDate, addDate(easterDate, 1)) ||
        equals(aDate, addDate(easterDate, 39)) ||
        equals(aDate, addDate(easterDate, 50));
};

let addDate = function (date, days) {
    let ret = new Date();
    ret.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    return ret;
};

let equals = function (d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

let easter = function (y) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setFullYear(y);

    // Find the golden number.
    let a, b, c, m, d;
    a = y % 19;

    // Choose which version of the algorithm to use based on the given year.
    b = (2200 <= y && y <= 2299) ?
        ((11 * a) + 4) % 30 :
        ((11 * a) + 5) % 30;

    // Determine whether or not to compensate for the previous step.
    c = ((b === 0) || (b === 1 && a > 10)) ?
        (b + 1) :
        b;

    // Use c first to find the month: April or March.
    m = (1 <= c && c <= 19) ? 3 : 2;

    // Then use c to find the full moon after the northward equinox.
    d = (50 - c) % 31;

    // Mark the date of that full moon—the "Paschal" full moon.
    date.setMonth(m, d);

    // Count forward the number of days until the following Sunday (Easter).
    date.setMonth(m, d + (7 - date.getDay()));

    // Gregorian Western Easter Sunday
    return date;
};

let calcHeating = function (aDate, atHome, homeOverride, opts) {
    let day = isDay(aDate, opts);
    let night = !day;
    let atWork = isWorkTime(aDate, opts);
    return {
        date: aDate,
        atHome: atHome,
        homeOverride: homeOverride,
        day: day,
        night: night,
        atWork: atWork,
        heating: atHome === true && night === false && atWork === false || homeOverride === true && night === false
    }
};

module.exports = {
    isDay: isDay,
    isWorkTime: isWorkTime,
    calcHeating: calcHeating
};

