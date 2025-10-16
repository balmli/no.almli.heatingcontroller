# Specification: Upgrading to @balmli/homey-utility-prices v2.0.1 with 15-Minute Price Intervals

## Executive Summary

This specification outlines the necessary changes to upgrade the Homey Heating Controller app to support 15-minute (quarter-hour) electricity price intervals, as Nord Pool transitions from hourly to quarter-hourly pricing slots. The upgrade involves updating to @balmli/homey-utility-prices v2.0.1 and adapting the app to handle 96 daily price slots instead of the current 24.

## Background

### Current State
- **Library Version**: @balmli/homey-utility-prices v2.0.1 (already updated in package.json)
- **Price Intervals**: Currently designed for 60-minute intervals (24 prices per day)
- **Price Updates**: Triggers fire once per hour when price changes
- **Flow Cards**: Limited to max 23-24 hour selections

### Target State
- **Price Intervals**: Support for 15-minute intervals (96 prices per day)
- **Price Updates**: Triggers fire every 15 minutes (4x per hour)
- **Backward Compatibility**: Must maintain support for hourly prices where applicable
- **Flow Cards**: Support both hour-based and slot-based configurations

## Technical Changes from @balmli/homey-utility-prices v2.0.1

Based on `QUARTER_HOUR_USAGE.md`, the library now provides:

1. **Enhanced Price Objects**:
   - `startsAt`: Slot start timestamp
   - `endsAt`: Slot end timestamp
   - `durationMinutes`: Slot duration (15, 30, or 60 minutes)
   - `price`: Price value

2. **Fetch Schedule**:
   - **Price Fetching**: Once per hour at configured offset (default: 3 seconds past)
   - **Price Updates**: Every 15 minutes at XX:00:03, XX:15:03, XX:30:03, XX:45:03
   - **Event**: `priceChanged` fires 4 times per hour for Nordpool sources

3. **Backward Compatibility**:
   - Missing `durationMinutes` defaults to 60 minutes
   - Legacy hourly data continues to work

## Impact Analysis

### Critical Issues Identified

#### 1. Price Change Detection Logic ([device.ts:337](../drivers/HeatingController/device.ts#L337))

**Current Implementation**:
```typescript
priceChanged = !this._lastPrice ||
    startAtHour !== this.priceApi.toHour(this._lastPrice.startsAt);
```

**Problem**: Uses `toHour()` which returns the same value for all 15-minute slots within an hour (e.g., 14:00, 14:15, 14:30, 14:45 all return 14).

**Impact**:
- Price change triggers will NOT fire when transitioning between 15-minute slots within the same hour
- Users' flows depending on price changes will miss 75% of price transitions

**Required Change**: Must compare actual slot timestamps, not just hours.

#### 2. Sync Time Randomization ([device.ts:87](../drivers/HeatingController/device.ts#L87))

**Current Implementation**:
```typescript
syncTime = Math.round(Math.random() * 3600); // 0-60 minutes
```

**Issue**: Spreads API calls across full hour, but price updates now occur every 15 minutes

**Consideration**: May need adjustment to 0-900 seconds (15-minute window)

### Medium Impact Areas

#### 3. Event Frequency
- `priceChanged` events will fire 4x more frequently
- Performance impact on complex flows needs evaluation
- May affect users with rate-limited actions in flows

#### 4. User Interface Terminology
- "X hours" becomes ambiguous when dealing with 15-minute slots
- Users need education on slot-based vs hour-based selection
- Consider maintaining hour-based UI with internal slot conversion

### Low/No Impact Areas

#### 5. Unaffected Components
- Heating schedule logic (uses fractional hours independently)
- Currency capability management
- 60-second check intervals (appropriate for 15-min slots)
- Price storage capabilities (format unchanged)

## Implementation Plan

### Phase 1: Core Compatibility (Required)

#### Task 1.1: Fix Price Change Detection
**File**: [drivers/HeatingController/device.ts](../drivers/HeatingController/device.ts)
**Line**: 337

**Current**:
```typescript
priceChanged = !this._lastPrice ||
    startAtHour !== this.priceApi.toHour(this._lastPrice.startsAt);
```

**Proposed**:
```typescript
priceChanged = !this._lastPrice ||
    this._lastPrice.startsAt !== currentPrice.startsAt;
```

**Alternative** (if slot-based comparison needed):
```typescript
const currentSlot = Math.floor(currentPrice.startsAt / (15 * 60)); // 15-min slots since epoch
const lastSlot = this._lastPrice ? Math.floor(this._lastPrice.startsAt / (15 * 60)) : -1;
priceChanged = currentSlot !== lastSlot;
```

### Phase 2: Optimization

#### Task 2.1: Adjust Sync Time Window
**File**: [drivers/HeatingController/device.ts](../drivers/HeatingController/device.ts)
**Line**: 87

Reduce randomization window:
```typescript
// Spread across 15 minutes
syncTime = Math.round(Math.random() * 900); // 0-15 minutes
```

## Conclusion

The upgrade to 15-minute price intervals is achievable with minimal changes. The most critical fix is updating the price change detection logic at line 337 in device.ts.

**Excellent news**: The flow cards require NO changes at all - the @balmli/homey-utility-prices v2.0.1 library already transparently converts hour parameters to slots internally through its `hoursToSlotCount()` method. Users will continue to work with the familiar hour-based interface (selecting 1-24 hours) while the system automatically handles 96 slots per day behind the scenes.

The library already provides all necessary infrastructure for 15-minute slots; the app only needs the price change detection fix to fully leverage these capabilities.
