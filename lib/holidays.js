'use strict';

const holidays_list = require('./holidays_list');

const calcDate = function (aDate, condition) {
  if (condition === 'yesterday') {
    return aDate.add(-1, 'day');
  } else if (condition === 'tomorrow') {
    return aDate.add(1, 'day');
  }
  return aDate;
};

const isHoliday = function (country, aDate, condition) {
  const holi = holidays_list[`${country}-${calcDate(aDate, condition).format('YYYY-MM-DD')}`];
  return !holi ? false : holi;
};

module.exports = {
  calcDate,
  isHoliday
};
