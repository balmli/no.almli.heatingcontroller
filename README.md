# Heating Controller

The 'Heating Controller' is a device for easily controlling temperatures and modes for thermostats and sockets for heating.

To switch between 'Comfort' and 'ECO' modes, just two flows are necessary: one 'Comfort' flow with comfort temperatures and modes, and one 'ECO' flow with ECO temperatures and modes.

Each 'HeatingController' device has its own schedule that can be changed from 'Advanced settings'. Several devices can be used, each with their own schedule.

The app has support for public holidays for several countries, and utility prices for Austria, Belgium, Germany, Luxembourg, France, Netherlands, Nordic and Baltic countries.

#### Install

To install the device:

1. Add the 'HeatingController' device.
2. Go to 'Advanced settings' and adjust the schedule.
3. Select 'Price area' and 'Currency' for utility prices.
4. Select 'Country for holidays' for public and bank holidays.

##### Default schedule

Default schedule:

- Comfort mode for working days: 05:00 - 22:30
- Comfort mode for weekends and holidays: 07:00 - 23:00
- Work hours: 07:00 - 14:00

#### Modes

The device has modes for:

- Home / Away
- Night / Day
- At work / Not at work
- Home override

The device can be turned 'On' / 'Off' to switch between 'Home' and 'Away' - modes.  If going away for a few days or on a holiday the device can be switched off to enable energy saving mode.  The device must be switched on again to switch back to 'Home' mode, or the 'Set away, and automatically switch to home mode on next schedule' action can be used to automatically go back to 'Home' mode when the next 'Night / Day' or 'At work / Not at work' modes triggers. 

It is not neccessary to switch to 'Away' mode if going to work, ref. the 'At work' - mode.

The 'Night' and 'At work' modes are automatically set based on time, day of week and public holidays.  The start and end hours can be configured for both 'Night' and 'At work'.

If preferrable, presence can be used for the 'Home' / 'Away' and 'At work' / 'Not at work' modes. The users of the Homey must enable 'Home/Away Detection' in Settings->Privacy, and presence must be enabled in the device 'Advanced settings'.

The 'Home override' mode can be used to keep comfort mode on, even if 'At work'.  The 'Set home override on, and automatically off on next schedule' action can be used to automatically turn the 'Home override' mode off when the next 'Night / Day' or 'At work / Not at work' modes triggers. 

#### Comfort and ECO mode triggers

The 'Comfort mode' and 'ECO mode' triggers can be used to turn heaters on / off, or set the thermostat temperatures or thermostat modes, and will trigger if the 'Home', 'Night', 'At work' or 'Home override' modes changes.

##### Rules

- 'Comfort mode': 'Home' and 'Day' and 'Not at work' or 'Home override' and 'Day'
- 'ECO mode': otherwise

##### Example

Adjust the target temperature for thermostats based on comfort / ECO modes.  The target temperature for a thermostat is set to 22 ℃ for the period between 05:00 - 07:00 and 14:00 - 22:30, and 19 ℃ in the period from 07:00 - 14:00 and 22:30 - 24:00.

![Example](https://balmli.github.io/no.almli.heatingcontroller/example1.png "Example 1")

Needs two flows:

- Set thermostat temperature to 22 ℃ if comfort mode.
- Set thermostat temperature to 19 ℃ if ECO mode.

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

#### Average price condition

The 'Current price is [x] percent above / below today's average' conditions will compare the current price to the average price for the whole day.

##### Example

Turn the socket for the water heater 'Off' when the price is 3 % higher than the average for the whole day, and 'On' otherwise.

Needs one flow:

- When: Utility price changed, 
- And: Current price is 3 percent above today's average
- Then: Turn socket off, Else: Turn socket on

#### Mode triggers

The 'Home mode set to on', 'Home mode set to off', 'Home override set to on' and 'Home override set to off' will trigger based on changes to 'Home' and 'Home override' modes.

The 'Night starts', 'Night ends', 'At work starts' and 'At work ends' will trigger based on changes to the 'Night' and 'At work' modes.

#### Utility price changed trigger

The 'Utility price changed' will trig every hour, based on utility prices in the Nordpool area.  The price area and currency can be configured.

##### Price areas

- Austria: AT
- Belgium: BE
- Denmark: DK1, DK2
- Estonia: EE
- Finland: FI
- France: FR
- Germany and Luxembourg: DE-LU
- Latvia: LV
- Lithuania: LT
- Netherlands: NL
- Norway: Oslo, Kr.sand, Bergen, Molde, Tr.heim, Tromsø
- Sweden: SE1, SE2, SE3, SE4

##### Currencies

- EUR, DKK, NOK, SEK

## Flow cards

### Device: HeatingController

#### Triggers

- Comfort mode
- ECO mode
- High prices [x] hours of the day (tokens: heating, high price)
- Low prices [x] hours of the day (tokens: heating, low price)
- Home mode set to on
- Home mode set to off
- Home override set to on
- Home override set to off
- Night starts
- Night ends
- At work starts
- At work ends
- Utility price changed (tokens: price, heating, price ratio)

#### Conditions

- Is home / away
- Is home override on / off
- Is night / day
- Is at work / not at work
- Is comfort mode / ECO mode
- Is current price below / above
- Current price is among / is not among the [x] hours of the days lowest prices
- Current price is among / is not among the [x] hours of the days highest prices
- The following [x] hours are among / are not among the [y] hours of today's lowest prices
- The following [x] hours are among / are not among the [y] hours of today's highest prices
- Current price is / is not [x] % above today's average
- Current price is / is not [x] % below today's average
- Current price is / is not [x] % above the average of the next [y] hours
- Current price is / is not [x] % below the average of the next [y] hours
- Is public holiday today / yesterday / tomorrow.
- Is bank holiday today / yesterday / tomorrow.
- Is observance holiday today / yesterday / tomorrow.
- Is holiday (public, bank or observance) today / yesterday / tomorrow.
- Is working day today / yesterday / tomorrow.

#### Actions

- Set home
- Set away
- Set away, and automatically switch to home mode on next schedule
- Set home override on
- Set home override on, and automatically off on next schedule
- Set home override off
- Set holiday today.  Holiday can be overridden with this action.

#### Capabilities 

- On / off (home / away)
- Home override (true/false)
- Night (true/false)
- At work (true/false)
- Heating (true/false)
- Price (per kWh)
- Price ratio (calculated from all hours on a day, with 1 for the lowest price and 0 for the highest price)

## Feedback:

Please report issues at the [issues section on Github](https://github.com/balmli/no.almli.heatingcontroller/issues).

### Release Notes:

#### 1.5.12

- Added 'heating' token to 'Utility price changed' trigger

#### 1.5.11

- Fix for timezone

#### 1.5.10

- Fixed date handling

#### 1.5.9

- Updated 'price ratio' calculation

#### 1.5.8

- Added 'price ratio', which is a number between 0 and 1 for today's prices
- Updated flow titles

#### 1.5.7

- Reduced memory consumption

#### 1.5.6

- Fixed bug in settings

#### 1.5.5

- Fixed issues with 'High prices [x] hours of the day (tokens: heating, high price)' and 'Low prices [x] hours of the day (tokens: heating, low price)' triggers
- Fixed issues “Utility price changed” trigger
- Reduced memory consumption

#### 1.5.4

- Fixed issue with timezones
- Reduced memory consumption

#### 1.5.3

- Reduced memory consumption

#### 1.5.2

- Fixed bug when changing settings
- Fixed bug in 'The following [x] hours are !{{|not}} among the [y] hours of today's lowest prices' condition 

#### 1.5.1

- Utility prices for more countries
- Added 'The following [x] hours are !{{|not}} among the [y] hours of today's lowest prices' condition
- Added 'The following [x] hours are !{{|not}} among the [y] hours of today's highest prices' condition

#### 1.5.0

- SDK3 - changes
- "Presence for modes" option removed
- Updated holidays
- Fixed decimals for Insights
- Fixed issue with timezones

#### 1.4.1

- Price in insights

#### 1.4.0

- Added 'Current price is among / is not among the [x] hours of the days highest prices' condition
- Added 'Current price is / is not [x] % above the average of the next [y] hours' condition
- Added 'Current price is / is not [x] % below the average of the next [y] hours' condition

#### 1.3.3

- Fix 'Is current price below / above' condition

#### 1.3.2

- Fixed utility prices.

#### 1.3.1

- Added README.txt

#### 1.3.0

- Fixed price capability
- Use Homey compose
- Updated Athom api

#### 1.2.0

- Updated Athom api
 
#### 1.1.0

- Updated holidays.
- Reduced size. 

#### 0.8.0

- Added 'Current price is [x] percent below today's average' condition.
- Added 'Current price is [x] percent above today's average' condition. 

#### 0.7.0

- Added 'Set away, and automatically switch to home mode on next schedule' action.
- Added 'Set home override on, and automatically off on next schedule' action.
- Added condition for working day.

#### 0.6.0

- Can select country for holidays.
- Added conditions for holidays (public, bank, observance).

#### 0.5.4

- Fixed bug for end hours after midnight. 

#### 0.5.3

- Take 'working day the next day' into consideration for 'Comfort' and 'ECO' - modes.
- Fixed bug for 'onoff' capability.

#### 0.5.2

- Support end hours after midnight.

#### 0.5.1

- Fixed bug for 'Set home' and 'Set away' actions.

#### 0.5.0

- Added triggers for 'Home' and 'Home override' modes
- Added 'Current price among [x] hours of the days lowest prices' condition

#### 0.4.1

- Minor bug fixes

#### 0.4.0

- Presence can be used for Home/Away and At work/Not at work modes 
- Price as EUR/kWh, DKK/kWh, SEK/kWh, NOK/kWh

#### 0.3.1

- Fix parsing of prices with spaces

#### 0.3.0

- Added "if current utility price below / above" condition

#### 0.2.0

- Improved triggers

#### 0.1.0

- Fetches utility prices

#### 0.0.1
- Initial version
