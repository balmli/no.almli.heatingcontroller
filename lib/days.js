'use strict';

const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(utc);
dayjs.extend(timezone);

const setTimeZone = (tz) => {
  dayjs.tz.setDefault(tz);
};

module.exports = {
  setTimeZone
};
