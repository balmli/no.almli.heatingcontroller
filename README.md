# HeatingController

The 'HeatingController' is a device to easily manage temperatures and modes for thermostats and sockets for heating.

#### Modes

The device has modes for:

- Home / Away
- Night / Day
- At work / Not at work
- Home override

The device can be turned 'On' / 'Off' to switch between 'Home' and 'Away' - modes.  If going away for a few days or on a holiday the device can be switched off to enable energy saving mode.  The device must be switched on again to switch back to 'Home' mode.  It is not neccessary to switch to 'Away' mode if going to work, ref. the 'At work' - mode.

The 'Night' and 'At work' modes are automatically set based on time, day of week and public holidays.  The start and end hours can be configured for both 'Night' and 'At work'.

The 'Home override' mode can be used to keep comfort mode on, even if 'At work'.

#### Mode triggers

The 'Night starts', 'Night ends', 'At work starts' and 'At work ends' will trigger based on changes to the 'Night' and 'At work' modes.

#### Utility price changed trigger

The 'Utility price changed' will trig every hour, based on utility prices in the Nordpool area.  The price area and currency can be configured.

##### Price areas

- Norway: Oslo, Kr.sand, Bergen, Molde, Tr.heim, Tromsø
- Sweden: SE1, SE2, SE3, SE4
- Denmark: DK1, DK2
- Finland: FI
- Estonia: EE
- Latvia: LT
- Lithuania: LV

##### Currencies

- EUR, DKK, NOK, SEK

#### Comfort and ECO mode triggers

The 'Comfort mode' and 'ECO mode' triggers can be used to turn heaters on / off, or set the thermostat temperatures or thermostat modes, and will trigger if the 'Home', 'Night', 'At work' or 'Home override' modes changes.

##### Rules

- 'Comfort mode': 'Home' and 'Day' and 'Not at work' or 'Home override' and 'Day'
- 'ECO mode': otherwise

##### Example

Adjust the target temperature for thermostats based on comfort / ECO modes.  The target temperature for a thermostat is set to 22 ℃ for the period between 05:00 - 07:00 and 14:00 - 22:30, and 19 ℃ in the period from 07:00 - 14:00 and 22:30 - 24:00.

![Example](https://balmli.github.io/no.almli.heatingcontroller/example1.png "Example 1")

Needs one flow:

- Set thermostat temperature to 22 ℃ if comfort mode, otherwise 19 ℃ if ECO mode.

#### High prices trigger

The 'High prices [x] hours of the day' trigger can be used to turn heaters off or lower the thermostat temperatures if 'ECO mode' is enabled and the utility prices are high.  The number of hours for high prices can be selected.

##### Rules

- Only hours where 'ECO mode' is enabled are controlled
- The selected number of hours with the highest prices are found
- If there are two consecutive hours with high prices the second hour is skipped, to avoid having heaters turned off too long, or having thermostat temperatures to low too long

##### Example

Set the target temperature for a thermostat to 22 ℃ during daytime, not at work and not away, 19 ℃ during the night, at work or away, and 17 ℃ when prices are high and at night, at work or away.

![Example](https://balmli.github.io/no.almli.heatingcontroller/example2.png "Example 2")

Needs three flows:

- Flow 1: set thermostat temperature to 22 ℃ if comfort mode.
- Flow 2: set thermostat temperature to 19 ℃ if ECO mode and low price.
- Flow 3: set thermostat temperature to 17 ℃ if ECO mode and high price.

#### Low prices trigger

The 'Low prices [x] hours of the day' trigger can be used to keep a heater on if the utility price is low and off if the utility price is high.  The 'Comfort mode' / 'ECO mode' is not taken into consideration for this trigger.

##### Example

Turn the socket for the water heater 'On' during the 18 hours with the lowest prices of the day, and 'Off' the other 6 hours.

![Example](https://balmli.github.io/no.almli.heatingcontroller/example3.png "Example 3")

Needs one flow:

- Turn socket on if 'low price' and off if 'high price'

#### Install

To install the device:

1. Add the 'HeatingController' device.
2. Adjust start and end hours in 'Advanced settings'.
3. Select 'Price area' and 'Currency' in 'Advanced settings' for utility prices.

##### Default periods

Default values for periods:

- Comfort mode for working days: 05:00 - 22:30
- Comfort mode for weekends and holidays: 07:00 - 23:00
- Work hours: 07:00 - 14:00

## Flow cards

### Device: HeatingController

#### Triggers

- Night starts
- Night ends
- At work starts
- At work ends
- Utility price changed (tokens: price, price area, currency)
- Comfort mode
- ECO mode
- High prices [x] hours of the day (tokens: heating, high price)
- Low prices [x] hours of the day (tokens: heating, low price)

#### Conditions

- Is home / away
- Is home override on / off
- Is night / day
- Is at work / not at work
- Is comfort mode / ECO mode
- Is current price below/above

#### Actions

- Set home
- Set away
- Set home override on
- Set home override off
- Set holiday today.  Default is Norwegian holidays, but can be overridden with this action.

## Feedback:

Please report issues at the [issues section on Github](https://github.com/balmli/no.almli.heatingcontroller/issues).

### Release Notes:

#### 0.3.0

- Added "if current utility price below / above" condition

#### 0.2.0

- Improved triggers

#### 0.1.0

- Fetches utility prices

#### 0.0.1
- Initial version
