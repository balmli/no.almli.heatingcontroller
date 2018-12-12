# HeatingController

Has modes for

- Home
- Night
- At work
- Home override

Will automatically set 'Home' to true if presence is detected.
Will automatically set 'Night' to on / off based on time.
Will automatically set 'At work' based on time, day of week and public holidays.

The 'Home override' state can be used to override the 'Home' state.

The 'Set heat on' and 'Set heat off' triggers can be used to turn heaters on / off, or set the thermostat temperature.

## Flow cards

### Device: HeatingController

#### Triggers

- Night starts
- Night ends
- At work starts
- At work ends
- Set heat on
- Set heat off

#### Conditions

- Is home
- Is home override
- Is night
- Is at work
- Is heating on

#### Actions

- Set home
- Set away
- Set home override on
- Set home override off

### Release Notes

#### 0.0.1
- Initial version
