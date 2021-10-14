'use strict';

const holidays = require('./holidays');

const isDay = function (aDate, opts) {
  let hour = aDate.hour() + aDate.minute() / 60 + aDate.second() / 3600;
  let workdayToday = isWorkDay(aDate, opts);
  let workdayTomorrow = isWorkDay(aDate.add(1, 'day'), opts);
  let startHour = workdayToday ? opts.workday.startHour : opts.notWorkday.startHour;
  let endHour = workdayToday ? opts.workday.endHour : opts.notWorkday.endHour;
  let endHour1 = startHour <= endHour ? 0 : endHour;
  let endHour2 = workdayTomorrow ? (opts.workday.startHour <= opts.workday.endHour ? opts.workday.endHour : 24) :
    (opts.notWorkday.startHour <= opts.notWorkday.endHour ? opts.notWorkday.endHour : 24);

  return hour < endHour1 || hour >= startHour && hour < endHour2;
};

const isWorkDay = function (aDate, opts) {
  return !isHoliday(aDate, opts) && aDate.day() >= 1 && aDate.day() <= 5;
};

const isWorkTime = function (aDate, opts) {
  let hour = aDate.hour() + aDate.minute() / 60 + aDate.second() / 3600;
  return isWorkDay(aDate, opts) &&
    (opts.workHours.startHour <= opts.workHours.endHour ?
      hour >= opts.workHours.startHour && hour < opts.workHours.endHour :
      hour >= opts.workHours.startHour || hour < opts.workHours.endHour);
};

const isHoliday = function (aDate, opts) {
  if (opts && (opts.holiday_today === 'holiday' || opts.holiday_today === 'not_holiday')) {
    return opts.holiday_today === 'holiday';
  }
  let hd = holidays.isHoliday(opts.country || 'NO', aDate);
  return hd && (hd.type === 'public' || hd.type === 'bank');
};

const calcHeating = function (aDate, atHome, homeOverride, opts) {
  let day = isDay(aDate, opts);
  let night = !day;
  let atWork = isWorkTime(aDate, opts);
  return {
    date: aDate.toISOString(),
    lDate: aDate.format('YYYY-MM-DDTHH:mm:ss'),
    atHome: atHome,
    homeOverride: homeOverride,
    day: day,
    night: night,
    atWork: atWork,
    heating: atHome === true && night === false && atWork === false || homeOverride === true && night === false
  }
};

module.exports = {
  calcHeating
};

