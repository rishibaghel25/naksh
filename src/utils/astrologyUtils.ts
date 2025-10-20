/**
 * Corrected Vedic Astrology Calculation Utilities
 * Following proper Jyotish principles with accurate Lahiri Ayanamsa
 * Based on Jean Meeus "Astronomical Algorithms" and IAU standards
 */

// Vedic zodiac signs (Rashis)
export const VEDIC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

// Nakshatras (27 lunar mansions)
export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
] as const;

export interface BirthData {
  birthDate: Date;
  birthTime: string; // HH:MM format
  latitude: number;
  longitude: number;
}

export interface MoonPosition {
  longitude: number; // 0-360 degrees
  sign: string;
  nakshatra: string;
}

export interface VedicChart {
  moonSign: string;
  sunSign: string;
  ascendant: string;
  nakshatra: string;
  moonLongitude: number;
  sunLongitude: number;
  ascendantLongitude: number;
  ayanamsa: number;
}

/**
 * Calculate Lahiri Ayanamsa (most widely used in Vedic astrology)
 * Uses the official formula from Indian Astronomical Ephemeris
 */
export function calculateLahiriAyanamsa(jd: number): number {
  // Lahiri Ayanamsa formula for Julian Day
  // Reference epoch: 21 March 285 CE (when tropical and sidereal coincided)
  const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000.0
  
  // Lahiri Ayanamsa formula (IAU 1976 precession model)
  // This is the official formula used by Indian Astronomical Ephemeris
  const ayanamsa = 23.85 + (50.2564 + (0.0222 - 0.000042 * T) * T) * T / 3600;
  
  return ayanamsa;
}

/**
 * Calculate Julian Day Number from a date
 * This uses UTC time for consistency
 */
export function calculateJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
            Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  let jd = jdn + (hour - 12) / 24 + minute / 1440 + second / 86400;
  
  return jd;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

/**
 * Normalize angle to 0-360 range
 */
function normalizeAngle(angle: number): number {
  angle = angle % 360;
  if (angle < 0) angle += 360;
  return angle;
}

/**
 * Calculate Moon's geocentric longitude using Jean Meeus algorithm
 * This is the standard astronomical calculation used worldwide
 */
export function calculateMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000.0
  
  // Moon's mean longitude
  const L_prime = 218.3164477 + 481267.88123421 * T 
                  - 0.0015786 * T * T 
                  + T * T * T / 538841 
                  - T * T * T * T / 65194000;
  
  // Mean elongation of Moon
  const D = 297.8501921 + 445267.1114034 * T 
            - 0.0018819 * T * T 
            + T * T * T / 545868 
            - T * T * T * T / 113065000;
  
  // Sun's mean anomaly
  const M = 357.5291092 + 35999.0502909 * T 
            - 0.0001536 * T * T 
            + T * T * T / 24490000;
  
  // Moon's mean anomaly
  const M_prime = 134.9633964 + 477198.8675055 * T 
                  + 0.0087414 * T * T 
                  + T * T * T / 69699 
                  - T * T * T * T / 14712000;
  
  // Moon's argument of latitude
  const F = 93.2720950 + 483202.0175233 * T 
            - 0.0036539 * T * T 
            - T * T * T / 3526000 
            + T * T * T * T / 863310000;
  
  // Additional arguments for planetary perturbations
  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.290 * T;
  
  // Calculate ecliptic longitude with major periodic terms
  let lambda = L_prime;
  
  // Major perturbation terms (Jean Meeus algorithm)
  lambda += 6.288774 * Math.sin(toRadians(M_prime));
  lambda += 1.274027 * Math.sin(toRadians(2 * D - M_prime));
  lambda += 0.658314 * Math.sin(toRadians(2 * D));
  lambda += 0.213618 * Math.sin(toRadians(2 * M_prime));
  lambda -= 0.185116 * Math.sin(toRadians(M));
  lambda -= 0.114332 * Math.sin(toRadians(2 * F));
  lambda += 0.058793 * Math.sin(toRadians(2 * (D - M_prime)));
  lambda += 0.057066 * Math.sin(toRadians(2 * D - M - M_prime));
  lambda += 0.053322 * Math.sin(toRadians(2 * D + M_prime));
  lambda += 0.045758 * Math.sin(toRadians(2 * D - M));
  lambda -= 0.040923 * Math.sin(toRadians(M - M_prime));
  lambda -= 0.034720 * Math.sin(toRadians(D));
  lambda -= 0.030383 * Math.sin(toRadians(M + M_prime));
  lambda += 0.015327 * Math.sin(toRadians(2 * (D - F)));
  lambda -= 0.012528 * Math.sin(toRadians(M_prime + 2 * F));
  lambda += 0.010980 * Math.sin(toRadians(M_prime - 2 * F));
  lambda += 0.010675 * Math.sin(toRadians(4 * D - M_prime));
  lambda += 0.010034 * Math.sin(toRadians(3 * M_prime));
  lambda += 0.008548 * Math.sin(toRadians(4 * D - 2 * M_prime));
  lambda -= 0.007888 * Math.sin(toRadians(2 * D + M - M_prime));
  lambda -= 0.006766 * Math.sin(toRadians(2 * D + M));
  lambda -= 0.005163 * Math.sin(toRadians(D - M_prime));
  
  // Additional corrections for higher accuracy
  lambda += 0.004987 * Math.sin(toRadians(D + M));
  lambda += 0.004036 * Math.sin(toRadians(2 * D - M + M_prime));
  lambda += 0.003994 * Math.sin(toRadians(2 * D + 2 * M_prime));
  lambda += 0.003861 * Math.sin(toRadians(4 * D));
  lambda += 0.003665 * Math.sin(toRadians(2 * D - 3 * M_prime));
  lambda -= 0.002689 * Math.sin(toRadians(M - 2 * M_prime));
  lambda -= 0.002602 * Math.sin(toRadians(2 * D - 2 * F + M_prime));
  lambda += 0.002390 * Math.sin(toRadians(2 * D - M - 2 * M_prime));
  lambda -= 0.002348 * Math.sin(toRadians(D + M_prime));
  lambda += 0.002236 * Math.sin(toRadians(2 * D - 2 * M));
  lambda -= 0.002120 * Math.sin(toRadians(M + 2 * M_prime));
  lambda -= 0.002069 * Math.sin(toRadians(2 * M));
  
  // Planetary perturbations
  lambda += 0.003958 * Math.sin(toRadians(A1));
  lambda += 0.001962 * Math.sin(toRadians(L_prime - F));
  lambda += 0.000318 * Math.sin(toRadians(A2));
  
  return normalizeAngle(lambda);
}

/**
 * Calculate Sun's geocentric longitude using VSOP87 simplified
 */
export function calculateSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  
  // Sun's mean longitude
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  
  // Sun's mean anomaly
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  
  // Sun's equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(toRadians(M))
          + (0.019993 - 0.000101 * T) * Math.sin(toRadians(2 * M))
          + 0.000289 * Math.sin(toRadians(3 * M));
  
  // Sun's true longitude
  const sunLong = L0 + C;
  
  return normalizeAngle(sunLong);
}

/**
 * Calculate Local Sidereal Time
 */
function calculateLST(jd: number, longitude: number): number {
  const T = (jd - 2451545.0) / 36525;
  
  // Greenwich Mean Sidereal Time at 0h UT
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
           + 0.000387933 * T * T - T * T * T / 38710000;
  
  gmst = normalizeAngle(gmst);
  
  // Local Sidereal Time = GMST + longitude
  const lst = normalizeAngle(gmst + longitude);
  
  return lst;
}

/**
 * Calculate Ascendant (Lagna) using proper spherical astronomy
 * Internal function that works with Julian Day
 */
function calculateAscendantInternal(jd: number, latitude: number, longitude: number): number {
  // Calculate Local Sidereal Time
  const lst = calculateLST(jd, longitude);
  
  // Calculate obliquity of ecliptic
  const T = (jd - 2451545.0) / 36525;
  const epsilon = 23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
  
  // Convert to radians
  const lstRad = toRadians(lst);
  const latRad = toRadians(latitude);
  const epsRad = toRadians(epsilon);
  
  // Calculate ascendant using spherical trigonometry
  // tan(ascendant) = cos(LST) / (-sin(LST) * cos(obliquity) + tan(latitude) * sin(obliquity))
  const numerator = Math.cos(lstRad);
  const denominator = -Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  
  let ascendant = toDegrees(Math.atan2(numerator, denominator));
  ascendant = normalizeAngle(ascendant);
  
  return ascendant;
}

/**
 * Convert tropical longitude to sidereal (Vedic) longitude
 */
export function tropicalToSidereal(tropicalLongitude: number, jd: number): number {
  const ayanamsa = calculateLahiriAyanamsa(jd);
  let siderealLongitude = tropicalLongitude - ayanamsa;
  return normalizeAngle(siderealLongitude);
}

/**
 * Get zodiac sign from sidereal longitude (0-360 degrees)
 */
export function getSignFromLongitude(longitude: number): string {
  const signIndex = Math.floor(longitude / 30);
  return VEDIC_SIGNS[signIndex % 12];
}

/**
 * Calculate Nakshatra from moon longitude
 */
export function calculateNakshatra(moonLongitude: number): string {
  const nakshatraSpan = 360 / 27; // 13.333... degrees per nakshatra
  const nakshatraIndex = Math.floor(moonLongitude / nakshatraSpan);
  return NAKSHATRAS[nakshatraIndex % 27];
}

/**
 * Calculate Moon sign from birth data
 */
export function calculateMoonSign(
  birthDate: Date,
  birthTime: string,
  latitude: number,
  longitude: number
): string {
  // Parse birth time
  const [hours, minutes] = birthTime.split(':').map(Number);
  
  // Create date-time object
  const dateTime = new Date(birthDate);
  dateTime.setHours(hours, minutes, 0, 0);
  
  // Calculate Julian Day
  const jd = calculateJulianDay(dateTime);
  
  // Calculate tropical moon longitude
  const tropicalMoonLong = calculateMoonLongitude(jd);
  
  // Convert to sidereal (Vedic)
  const siderealMoonLong = tropicalToSidereal(tropicalMoonLong, jd);
  
  // Get sign
  return getSignFromLongitude(siderealMoonLong);
}

/**
 * Calculate Sun sign from birth date
 */
export function calculateSunSign(birthDate: Date): string {
  // Calculate Julian Day
  const jd = calculateJulianDay(birthDate);
  
  // Calculate tropical sun longitude
  const tropicalSunLong = calculateSunLongitude(jd);
  
  // Convert to sidereal (Vedic)
  const siderealSunLong = tropicalToSidereal(tropicalSunLong, jd);
  
  // Get sign
  return getSignFromLongitude(siderealSunLong);
}

/**
 * Calculate Ascendant (Lagna/Rising Sign) from birth data
 */
export function calculateAscendant(
  birthDate: Date,
  birthTime: string,
  latitude: number,
  longitude: number
): string {
  // Parse birth time
  const [hours, minutes] = birthTime.split(':').map(Number);
  
  // Create date-time object
  const dateTime = new Date(birthDate);
  dateTime.setHours(hours, minutes, 0, 0);
  
  // Calculate Julian Day
  const jd = calculateJulianDay(dateTime);
  
  // Calculate tropical ascendant
  const tropicalAscendant = calculateAscendantInternal(jd, latitude, longitude);
  
  // Convert to sidereal (Vedic)
  const siderealAscendant = tropicalToSidereal(tropicalAscendant, jd);
  
  // Get sign
  return getSignFromLongitude(siderealAscendant);
}

/**
 * Calculate complete moon position including sign and nakshatra
 */
export function calculateMoonPosition(
  birthDate: Date,
  birthTime: string,
  latitude: number,
  longitude: number
): MoonPosition {
  // Parse birth time
  const [hours, minutes] = birthTime.split(':').map(Number);
  
  // Create date-time object
  const dateTime = new Date(birthDate);
  dateTime.setHours(hours, minutes, 0, 0);
  
  // Calculate Julian Day
  const jd = calculateJulianDay(dateTime);
  
  // Calculate tropical moon longitude
  const tropicalMoonLong = calculateMoonLongitude(jd);
  
  // Convert to sidereal (Vedic)
  const siderealMoonLong = tropicalToSidereal(tropicalMoonLong, jd);
  
  return {
    longitude: siderealMoonLong,
    sign: getSignFromLongitude(siderealMoonLong),
    nakshatra: calculateNakshatra(siderealMoonLong)
  };
}

/**
 * Calculate complete Vedic chart with all major placements
 */
export function calculateVedicChart(
  birthDate: Date,
  birthTime: string,
  latitude: number,
  longitude: number
): VedicChart {
  // Parse birth time
  const [hours, minutes] = birthTime.split(':').map(Number);
  
  // Create date-time object
  const dateTime = new Date(birthDate);
  dateTime.setHours(hours, minutes, 0, 0);
  
  // Calculate Julian Day
  const jd = calculateJulianDay(dateTime);
  
  // Calculate Lahiri Ayanamsa
  const ayanamsa = calculateLahiriAyanamsa(jd);
  
  // Calculate tropical longitudes
  const tropicalMoonLong = calculateMoonLongitude(jd);
  const tropicalSunLong = calculateSunLongitude(jd);
  const tropicalAscendant = calculateAscendantInternal(jd, latitude, longitude);
  
  // Convert to sidereal (subtract ayanamsa)
  const siderealMoonLong = tropicalToSidereal(tropicalMoonLong, jd);
  const siderealSunLong = tropicalToSidereal(tropicalSunLong, jd);
  const siderealAscendant = tropicalToSidereal(tropicalAscendant, jd);
  
  // Get signs
  const moonSign = getSignFromLongitude(siderealMoonLong);
  const sunSign = getSignFromLongitude(siderealSunLong);
  const ascendant = getSignFromLongitude(siderealAscendant);
  
  // Get nakshatra
  const nakshatra = calculateNakshatra(siderealMoonLong);
  
  return {
    moonSign,
    sunSign,
    ascendant,
    nakshatra,
    moonLongitude: siderealMoonLong,
    sunLongitude: siderealSunLong,
    ascendantLongitude: siderealAscendant,
    ayanamsa
  };
}