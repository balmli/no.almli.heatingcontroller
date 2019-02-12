'use strict'

const moment = require('moment-timezone')
const { toNumber, isDate, pad0 } = require('./utils')

const PROPS = ['year', 'month', 'day', 'hour', 'minute', 'second']

class CalDate {
  /**
   * constructs a new CalDate instance
   * @param {Object|Date} [opts] - See `set(opts)`
   * @example
   * const CalDate = require('caldate')
   * const caldate = new CalDate('2000-01-01 12:00:00')
   * caldate.year
   * //> 2000
   * caldate.month
   * //> 1
   */
  constructor (opts) {
    this.set(opts)
  }

  /**
   * set calendar date
   * @param {Object|Date} [opts] - defaults to `1900-01-01`
   * @param {String} opts.year
   * @param {String} opts.month - January equals to 1, December to 12
   * @param {String} opts.day
   * @param {String} opts.hour
   * @param {String} opts.minute
   * @param {String} opts.second
   * @param {String} opts.duration - defaults to 24 hours
   */
  set (opts) {
    opts = opts || { year: 1900, month: 1, day: 1 }
    if (isDate(opts)) {
      this.year = opts.getFullYear()
      this.month = opts.getMonth() + 1
      this.day = opts.getDate()
      this.hour = opts.getHours()
      this.minute = opts.getMinutes()
      this.second = opts.getSeconds()
    } else {
      PROPS.forEach((p) => {
        this[p] = toNumber(opts[p]) || 0
      })
      this.month = this.month || 1
      this.day = this.day || 1
    }
    this.duration = opts.duration || 24 // duration is in hours
    return this
  }

  /**
   * checks if Date is equal to `calDate`
   * @param {CalDate} calDate
   * @return {Boolean} true if date matches
   */
  isEqualDate (calDate) {
    let res = true
    this.update()
    ;['year', 'month', 'day'].forEach((p) => {
      res &= (this[p] === calDate[p])
    })
    return !!res
  }

  /**
   * get day of week
   * @return {Number} day of week 0=sunday, 1=monday, ...
   */
  getDay () {
    return this.toDate().getDay()
  }

  /**
   * set offset per unit
   * @param {Number} number
   * @param {String} unit - Unit in days `d`, hours `h, minutes `m`
   * @return {Object} this
   */
  setOffset (number, unit) {
    if (number) {
      if (typeof number === 'object') {
        unit = number.unit
        number = number.number
      }
      unit = unit || 'd'
      number = parseFloat(number, 10)
      if (isNaN(number)) {
        throw new Error('Number required')
      }

      const o = { day: 0 }
      if (unit === 'd') {
        o.day = number | 0
        number -= o.day
        number *= 24
      }
      if (unit === 'd' || unit === 'h') {
        o.hour = (number % 24) | 0
        number -= o.hour
        number *= 60
      }
      o.minute = (number % 60) | 0
      number -= o.minute
      number *= 60
      o.second = (number % 60) | 0

      this.day += o.day
      this.hour += o.hour
      this.minute += o.minute
      this.second += o.second
    }
    this.update()
    return this
  }

  /**
   * set time per hour, minute or second while maintaining duration at midnight
   * @param {Number} [hour]
   * @param {Number} [minute]
   * @param {Number} [second]
   * @return {Object} this
   */
  setTime (hour, minute, second) {
    hour = hour || 0
    minute = minute || 0
    second = second || 0
    // the holiday usually ends at midnight - if this is not the case set different duration explicitely
    this.duration = 24 - (hour + minute / 60 + second / 3600)
    this.hour = hour
    this.minute = minute
    this.second = second
    this.update()
    return this
  }

  /**
   * set duration in hours
   * @param {Number} duration in hours
   * @return {Object} this
   */
  setDuration (duration) {
    this.duration = duration
    return this
  }

  /**
   * update internal data to real date
   * @return {Object} this
   */
  update () {
    if (this.year) {
      const d = new CalDate(this.toDate())
      PROPS.forEach((p) => {
        this[p] = d[p]
      })
    }
    return this
  }

  /**
   * get end date of calendar date
   * @return {CalDate}
   */
  toEndDate () {
    const d = new CalDate(this.toDate())
    d.minute += ((this.duration * 60) | 0)
    d.update()
    return d
  }

  /**
   * move internal date to a date in `timezone`
   * @param {String} timezone - e.g. 'America/New_York'
   * @return {Date}
   */
  toTimezone (timezone) {
    if (timezone) {
      return new Date(moment.tz(this.toString(), timezone).format())
    } else {
      return this.toDate()
    }
  }

  /**
   * convert to Date
   * @return {Date}
   */
  toDate () {
    return new Date(
      this.year, this.month - 1, this.day,
      this.hour, this.minute, this.second, 0
    )
  }

  /**
   * get Date in ISO format
   */
  toISOString () {
    return this.toString(true)
  }

  /**
   * get Date as String `YYYY-MM-DD HH:MM:SS`
   */
  toString (iso) {
    const d = new CalDate(this.toDate())
    return (
      pad0(d.year, 4) + '-' +
      pad0(d.month) + '-' +
      pad0(d.day) +
      (iso ? 'T' : ' ') +
      pad0(d.hour) + ':' +
      pad0(d.minute) + ':' +
      pad0(d.second) +
      (iso ? 'Z' : '')
    )
  }
}
module.exports = CalDate
