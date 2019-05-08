'use strict';

const holidays_list = require('./holidays_list');

let addDate = function (date, days) {
    let ret = new Date(date);
    ret.setDate(ret.getDate() + days);
    return ret;
};

let calcDate = function (aDate, condition) {
    if (condition === 'yesterday') {
        return addDate(aDate, -1);
    } else if (condition === 'tomorrow') {
        return addDate(aDate, 1);
    }
    return aDate;
};

let toJSONLocal = function (date) {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
};

let isHoliday = function (country, aDate, condition) {
    let holi = holidays_list[country + '-' + toJSONLocal(calcDate(aDate || new Date(), condition))];
    return !holi ? false : holi;
};

module.exports = {
    calcDate: calcDate,
    isHoliday: isHoliday
};
