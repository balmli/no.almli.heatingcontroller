# caldate

> calendar date for date-holidays

[![NPM version](https://badge.fury.io/js/caldate.svg)](https://www.npmjs.com/package/caldate/)
[![Build Status](https://secure.travis-ci.org/commenthol/caldate.svg?branch=master)](https://travis-ci.org/commenthol/caldate)


## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Class: CalDate](#class-caldate)
  * [new CalDate(opts)](#new-caldateopts)
  * [CalDate.set(opts)](#caldatesetopts)
  * [CalDate.isEqualDate(calDate)](#caldateisequaldatecaldate)
  * [CalDate.getDay()](#caldategetday)
  * [CalDate.setOffset(number, unit)](#caldatesetoffsetnumber-unit)
  * [CalDate.setTime(hour, minute, second)](#caldatesettimehour-minute-second)
  * [CalDate.setDuration(duration)](#caldatesetdurationduration)
  * [CalDate.update()](#caldateupdate)
  * [CalDate.toEndDate()](#caldatetoenddate)
  * [CalDate.toTimezone(timezone)](#caldatetotimezonetimezone)
  * [CalDate.toDate()](#caldatetodate)
  * [CalDate.toISOString()](#caldatetoisostring)
  * [CalDate.toString()](#caldatetostring)
* [Contribution and License Agreement](#contribution-and-license-agreement)
* [License](#license)
* [References](#references)

<!-- toc! -->

## Class: CalDate

### new CalDate(opts)

constructs a new CalDate instance

**Parameters**

**opts**: `Object | Date`, See `set(opts)`


**Example**:
```js
var CalDate = require('caldate')
var caldate = new CalDate('2000-01-01 12:00:00')
caldate.year
//> 2000
caldate.month
//> 1
```

### CalDate.set(opts)

set calendar date

**Parameters**

**opts**: `Object | Date`, defaults to `1900-01-01`

**opts.year**: `String`, set calendar date

**opts.month**: `String`, January equals to 1, December to 12

**opts.day**: `String`, set calendar date

**opts.hour**: `String`, set calendar date

**opts.minute**: `String`, set calendar date

**opts.second**: `String`, set calendar date

**opts.duration**: `String`, defaults to 24 hours


### CalDate.isEqualDate(calDate)

checks if Date is equal to `calDate`

**Parameters**

**calDate**: `CalDate`, checks if Date is equal to `calDate`

**Returns**: `Boolean`, true if date matches

### CalDate.getDay()

get day of week

**Returns**: `Number`, day of week 0=sunday, 1=monday, ...

### CalDate.setOffset(number, unit)

set offset per unit

**Parameters**

**number**: `Number`, set offset per unit

**unit**: `String`, Unit in days `d`, hours `h, minutes `m`

**Returns**: `Object`, this

### CalDate.setTime(hour, minute, second)

set time per hour, minute or second while maintaining duration at midnight

**Parameters**

**hour**: `Number`, set time per hour, minute or second while maintaining duration at midnight

**minute**: `Number`, set time per hour, minute or second while maintaining duration at midnight

**second**: `Number`, set time per hour, minute or second while maintaining duration at midnight

**Returns**: `Object`, this

### CalDate.setDuration(duration)

set duration in hours

**Parameters**

**duration**: `Number`, in hours

**Returns**: `Object`, this

### CalDate.update()

update internal data to real date

**Returns**: `Object`, this

### CalDate.toEndDate()

get end date of calendar date

**Returns**: `CalDate`

### CalDate.toTimezone(timezone)

move internal date to a date in `timezone`

**Parameters**

**timezone**: `String`, e.g. 'America/New_York'

**Returns**: `Date`

### CalDate.toDate()

convert to Date

**Returns**: `Date`

### CalDate.toISOString()

get Date in ISO format


### CalDate.toString()

get Date as String `YYYY-MM-DD HH:MM:SS`




## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the ISC license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and licence.

## License

Copyright (c) 2016 commenthol ([ISC License](http://opensource.org/licenses/ISC))

See [LICENSE][] for more information.

## References

<!-- !ref -->

* [LICENSE][LICENSE]

<!-- ref! -->

[LICENSE]: ./LICENSE
