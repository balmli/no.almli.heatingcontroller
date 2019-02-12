# date-easter

> Calculates Easter for a given year

## Synopsis

````js
var easter = require('date-easter')
easter.easter(2016)
// { year: 2016, month: 3, day: 27 }
easter.gregorianEaster(new Date('2016-01-01'))
// { year: 2016, month: 3, day: 27 }
easter.julianEaster(2016)
// { year: 2016, month: 4, day: 18 }
easter.orthodoxEaster(2016)
// { year: 2016, month: 5, day: 1 }
````

## Description

All methods return an object with the following properties
- **year**: Year (begins at 0)
- **month**: Month (1 ... 12)
- **day**: Day (1 ... 31)  
- **toString()**: Returns a formatted String `YYYY-MM-DD`

### easter

Shortcut for `gregorianEaster`.

### gregorianEaster

Returns the date of Gregorian Easter for a given year. Uses the extended [Gaussian Easter algorithm][].

### julianEaster

Returns the date of Julian Easter for a given year in the Julian Calender

### orthodoxEaster

Returns the date of Julian Easter for a given year in the Gregorian Calender

## References

- Date::Easter Perl Package <https://metacpan.org/pod/Date::Easter> Rich Bowen <rbowen@rcbowen.com>
- <http://www.chariot.net.au/~gmarts/eastcalc.htm>
- [Gaussian Easter algorithm][]

## License

Copyright (c) 2015 commenthol

Software is released under [MIT][license].

[license]: ./LICENSE
[Gaussian Easter algorithm]: https://de.wikipedia.org/wiki/Gau%C3%9Fsche_Osterformel#Eine_erg.C3.A4nzte_Osterformel
