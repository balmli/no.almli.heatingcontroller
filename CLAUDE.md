# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Homey app (smart home platform) that provides intelligent heating control with utility price optimization. The app allows users to manage heating schedules based on time, occupancy modes (Home/Away, Night/Day, At work), and dynamic electricity pricing from Nordpool markets.

## Build and Development Commands

```bash
# Build the TypeScript project
npm run build

# Run Homey validate
homey app validate

# Build and install on local Homey device
homey app install

# Run app on Homey device
homey app run
```

## Architecture

### Core Components

**Main App (`app.ts`)**
- Extends `Homey.App`
- Initializes flow cards (triggers, conditions, actions)
- Manages holiday checking logic using `@balmli/homey-public-holidays`
- Provides `UtilityBillApi` instance to devices for price fetching
- Uses `moment-timezone` for date/time handling with Homey's configured timezone

**Device (`drivers/HeatingController/device.ts`)**
- Main device logic for heating control
- Manages multiple capabilities: `onoff`, `home_override`, `night`, `at_work`, `heating`, `price_*`, `price_ratio`
- Uses `PriceFetcher` to fetch prices from either Nordpool or Utility Bill app
- Uses `PriceComparer` for price-based condition evaluation
- Implements mode transitions (Comfort/ECO) based on occupancy and schedule
- Handles capability migrations for app updates

**Driver (`drivers/HeatingController/driver.ts`)**
- Basic driver implementation for device pairing

### External Dependencies

**@balmli/homey-utility-prices**
- Local dependency (symlinked via `node-homey-utility-prices`)
- Provides price fetching, comparison, and heating logic
- Key exports: `PriceFetcher`, `PriceComparer`, `PriceApi`, `heating` module
- Path alias configured in `tsconfig.json`

**@balmli/homey-utility-prices-client**
- Client for communicating with Utility Bill Homey app

**@balmli/homey-public-holidays**
- Holiday data for multiple European countries

**@balmli/homey-logger**
- Logging utility with log levels

### Flow Cards System

The app uses Homey Compose (`.homeycompose/`) to define flow cards:
- **Triggers**: Events like `comfort_mode`, `eco_mode`, `price_changed`, `high_x_hours_of_day`, `low_x_hours_of_day`
- **Conditions**: Price comparisons, schedule checks, holiday checks
- **Actions**: Mode changes like `set_at_home_on`, `set_home_override_on`, `fetch_prices`

Flow card definitions in `.homeycompose/flow/` are compiled into `app.json` by Homey CLI.

### Heating Modes Logic

**Comfort Mode**: Enabled when Home AND Day AND (Not at work OR Home override)
**ECO Mode**: All other conditions

The app calculates these modes based on:
- Time-based schedules (configurable start/end hours for workdays/weekends)
- Occupancy states (home/away, at work)
- Overrides (home override flag)
- Holiday calendar integration

### Price Optimization

The device supports multiple price-based features:
- Current price tracking with multiple currencies (EUR, NOK, SEK, DKK)
- High/low price detection for X hours of day
- Price comparison to daily average
- Consecutive hours with lowest/highest total price
- Price among X lowest/highest in time periods
- Integration with Nordpool spot prices or Utility Bill app

### Settings

Device settings control:
- Schedule hours (workday/non-workday start/end, work hours)
- Price area (Nordpool regions)
- Currency
- Country for holidays
- Price source (Nordpool or Utility Bill app)

## Key Implementation Details

**Price Fetching**
- Each device has a random sync offset (0-3600 seconds) to avoid simultaneous API calls
- Stored in device store as `syncTime`
- Prices are cached and refetched at appropriate intervals

**Capability Management**
- Dynamic capability management based on selected currency (only shows relevant price capability)
- Migration logic in `migrate()` and `fixPrice()` methods to add/remove capabilities on app updates

**Time Checking**
- Scheduled checks via `scheduleCheckTime()` to update modes
- Triggers events when modes change (night/day, at work, heating on/off)

**Store Values**
- `syncTime`: Random offset for price fetching
- `_holidayToday`: Manual holiday override

## Testing

Tests are located in `test2/` directory and focus on Nordpool price fetching for different regions.

## Homey SDK

This app uses Homey SDK v3 (configured in `app.json`). Minimum Homey firmware version is 5.0.0.

## Node.js Version

Node.js 18.20.8 (specified in `.nvmrc`)

## TypeScript Configuration

- Extends `@tsconfig/node12`
- Outputs to `build/` directory
- Allows JavaScript files
- Path alias for local `@balmli/homey-utility-prices` dependency
