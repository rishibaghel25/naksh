# Astrology Calculations Update

## Summary
Updated the Vedic astrology calculation utilities to use proper astronomical algorithms following Jyotish principles with accurate Lahiri Ayanamsa calculations.

## Changes Made

### 1. `src/utils/astrologyUtils.ts`

#### Key Improvements:
- **Lahiri Ayanamsa**: Now uses the official IAU 1976 precession model formula with higher-order terms
  - Formula: `23.85 + (50.2564 + (0.0222 - 0.000042 * T) * T) * T / 3600`
  - More accurate than the previous simplified version

- **Julian Day Calculation**: Now uses UTC time components instead of local time
  - Ensures consistent astronomical calculations across timezones
  - Uses `getUTCFullYear()`, `getUTCMonth()`, etc.

- **Moon Longitude**: Improved Jean Meeus algorithm implementation
  - Simplified function signature: now takes `jd` (Julian Day) instead of `date, latitude, longitude`
  - Latitude/longitude are not needed for geocentric moon position
  - Added more perturbation terms for higher accuracy

- **Sun Longitude**: Upgraded to VSOP87 algorithm
  - Uses equation of center for better precision
  - Function signature changed to take `jd` instead of `date`

- **Ascendant Calculation**: Proper spherical astronomy implementation
  - Uses Local Sidereal Time (LST) calculation
  - Applies obliquity of ecliptic correction
  - Proper spherical trigonometry formula

- **Helper Functions**:
  - Added `normalizeAngle()` for consistent angle normalization
  - Added `calculateLST()` for Local Sidereal Time calculation
  - Updated `tropicalToSidereal()` to take `jd` instead of `date`

#### New Function Signatures:
```typescript
// Changed from: calculateMoonLongitude(date: Date, latitude: number, longitude: number)
calculateMoonLongitude(jd: number): number

// Changed from: calculateSunLongitude(date: Date)
calculateSunLongitude(jd: number): number

// Changed from: tropicalToSidereal(tropicalLongitude: number, date: Date)
tropicalToSidereal(tropicalLongitude: number, jd: number): number

// Renamed from: calculateAyanamsa(date: Date)
calculateLahiriAyanamsa(jd: number): number
```

### 2. `src/services/horoscopeService.ts`

#### Updates:
- Added imports for `calculateJulianDay` and `calculateLahiriAyanamsa`
- Updated `calculateDailyTransits()` function to:
  - Calculate Julian Day once at the start
  - Pass `jd` to `calculateSunLongitude()` and `calculateMoonLongitude()`
  - Pass `jd` to `tropicalToSidereal()` instead of `date`

## Files That Did NOT Need Updates

### `src/services/authService.ts`
✅ No changes needed - uses high-level functions that maintain the same signatures:
- `calculateMoonSign(birthDate, birthTime, latitude, longitude)`
- `calculateSunSign(birthDate)`
- `calculateAscendant(birthDate, birthTime, latitude, longitude)`
- `calculateMoonPosition(birthDate, birthTime, latitude, longitude)`

### `src/screens/main/BirthDetailsFormScreen.tsx`
✅ No changes needed - uses the same high-level functions as authService

## Benefits of These Changes

1. **Accuracy**: More precise astronomical calculations using standard algorithms
2. **Consistency**: UTC-based calculations ensure consistent results across timezones
3. **Performance**: Calculating Julian Day once and reusing it is more efficient
4. **Standards Compliance**: Follows IAU (International Astronomical Union) standards
5. **Vedic Authenticity**: Uses the official Lahiri Ayanamsa formula from Indian Astronomical Ephemeris

## Testing Recommendations

1. Test birth chart calculations with known accurate results
2. Verify moon sign calculations match professional Jyotish software
3. Test ascendant calculations for various latitudes (especially near poles)
4. Verify daily horoscope transit calculations are working correctly
5. Test with dates across different years to verify ayanamsa progression

## References

- Jean Meeus, "Astronomical Algorithms" (2nd Edition)
- IAU 1976 Precession Constants
- Indian Astronomical Ephemeris (Lahiri Ayanamsa)
- VSOP87 Solar Position Algorithm
