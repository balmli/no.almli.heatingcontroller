'use strict';

const Holidays = require('date-holidays');

const cache = [];
const dateCache = [];

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

let getCountry = function (country) {
    if (country in cache) {
        return cache[country];
    }
    let hd = new Holidays(country);
    cache[country] = hd;
    return hd;
};

let isHoliday = function (country, aDate, condition) {
    let key = country + '-' + aDate.getFullYear() + '-' + aDate.getMonth() + '-' + aDate.getDate() + (condition || '');
    if (key in dateCache) {
        return dateCache[key];
    }
    let dh = getCountry(country).isHoliday(calcDate(aDate || new Date(), condition));
    dateCache[key] = dh;
    return dh;
};

module.exports = {
    calcDate: calcDate,
    isHoliday: isHoliday
};
