'use strict';

const holidays = require('./holidays');

let isDay = function (aDate, opts) {
    let hour = aDate.getHours() + aDate.getMinutes() / 60 + aDate.getSeconds() / 3600;
    let workdayToday = isWorkDay(aDate, opts);
    let workdayTomorrow = isWorkDay(addDate(aDate, 1), opts);
    let startHour = workdayToday ? opts.workday.startHour : opts.notWorkday.startHour;
    let endHour = workdayToday ? opts.workday.endHour : opts.notWorkday.endHour;
    let endHour1 = startHour <= endHour ? 0 : endHour;
    let endHour2 = workdayTomorrow ? (opts.workday.startHour <= opts.workday.endHour ? opts.workday.endHour : 24) :
        (opts.notWorkday.startHour <= opts.notWorkday.endHour ? opts.notWorkday.endHour : 24);

    return hour < endHour1 || hour >= startHour && hour < endHour2;
};

let isWorkDay = function (aDate, opts) {
    return !isHoliday(aDate, opts) && aDate.getDay() >= 1 && aDate.getDay() <= 5;
};

let isWorkTime = function (aDate, opts) {
    let hour = aDate.getHours() + aDate.getMinutes() / 60 + aDate.getSeconds() / 3600;
    return isWorkDay(aDate, opts) &&
        (opts.workHours.startHour <= opts.workHours.endHour ?
            hour >= opts.workHours.startHour && hour < opts.workHours.endHour :
            hour >= opts.workHours.startHour || hour < opts.workHours.endHour);
};

let isHoliday = function (aDate, opts) {
    if (opts && (opts.holiday_today === 'holiday' || opts.holiday_today === 'not_holiday')) {
        return opts.holiday_today === 'holiday';
    }
    let hd = holidays.isHoliday(opts.country || 'NO', aDate);
    return hd && (hd.type === 'public' || hd.type === 'bank' || hd.type === 'observance');
};

let addDate = function (date, days) {
    var ret = new Date(date);
    ret.setDate(ret.getDate() + days);
    return ret;
};

let calcHeating = function (aDate, atHome, homeOverride, opts, presence) {
    let day = isDay(aDate, opts);
    let night = !day;
    let atHome2 = opts.presenceForModes && presence === true || !opts.presenceForModes && atHome;
    let atWork = opts.presenceForModes && presence === false || !opts.presenceForModes && isWorkTime(aDate, opts);
    return {
        date: aDate,
        atHome: atHome2,
        homeOverride: homeOverride,
        day: day,
        night: night,
        atWork: atWork,
        heating: atHome2 === true && night === false && atWork === false || homeOverride === true && night === false
    }
};

module.exports = {
    isDay: isDay,
    isWorkTime: isWorkTime,
    calcHeating: calcHeating
};

