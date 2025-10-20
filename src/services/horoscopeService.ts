/**
 * Horoscope Generation Service
 * Generates personalized daily horoscopes based on Vedic astrology principles
 * from "Astrology of the Seers"
 */

import { UserProfile } from '../types';
import {
  calculateJulianDay,
  calculateMoonLongitude,
  calculateSunLongitude,
  getSignFromLongitude,
  tropicalToSidereal,
  VEDIC_SIGNS
} from '../utils/astrologyUtils';
import { cacheHoroscope, getCachedHoroscope } from './cacheService';

// Transit aspects and their effects
interface Transit {
  planet: string;
  sign: string;
  aspectToMoon: number; // Degrees of separation
}

interface DailyTransits {
  sun: Transit;
  moon: Transit;
}

/**
 * Generate personalized daily horoscope for a user
 * Implements caching to avoid recalculation for the same day
 */
export async function generateDailyHoroscope(
  userProfile: UserProfile,
  date: Date = new Date()
): Promise<string> {
  try {
    // Validate user profile has required data
    if (!userProfile.moon_sign || !userProfile.birth_latitude || !userProfile.birth_longitude) {
      return getFallbackHoroscope();
    }

    // Check cache first
    const cachedHoroscope = await getCachedHoroscope(date);
    if (cachedHoroscope) {
      return cachedHoroscope;
    }

    // Calculate current transits
    const transits = calculateDailyTransits(date, userProfile);

    // Generate horoscope based on moon sign and transits
    const horoscope = generateHoroscopeContent(
      userProfile.moon_sign,
      userProfile.nakshatra,
      transits,
      date
    );

    // Cache the generated horoscope
    await cacheHoroscope(horoscope, date);

    return horoscope;
  } catch (error) {
    console.error('Error generating horoscope:', error);
    
    // Try to return cached horoscope as fallback
    const cachedHoroscope = await getCachedHoroscope(date);
    if (cachedHoroscope) {
      return cachedHoroscope;
    }
    
    return getFallbackHoroscope();
  }
}

/**
 * Calculate current planetary transits for the given date
 */
function calculateDailyTransits(date: Date, userProfile: UserProfile): DailyTransits {
  // Calculate Julian Day for the current date
  const jd = calculateJulianDay(date);
  
  // Calculate current Sun position
  const tropicalSunLong = calculateSunLongitude(jd);
  const siderealSunLong = tropicalToSidereal(tropicalSunLong, jd);
  const sunSign = getSignFromLongitude(siderealSunLong);

  // Calculate current Moon position
  const tropicalMoonLong = calculateMoonLongitude(jd);
  const siderealMoonLong = tropicalToSidereal(tropicalMoonLong, jd);
  const moonSign = getSignFromLongitude(siderealMoonLong);

  // Calculate aspect to natal moon (simplified - sign-based)
  const natalMoonSignIndex = VEDIC_SIGNS.indexOf(userProfile.moon_sign as any);
  const transitMoonSignIndex = VEDIC_SIGNS.indexOf(moonSign as any);
  const moonAspect = ((transitMoonSignIndex - natalMoonSignIndex + 12) % 12) * 30;

  const transitSunSignIndex = VEDIC_SIGNS.indexOf(sunSign as any);
  const sunAspect = ((transitSunSignIndex - natalMoonSignIndex + 12) % 12) * 30;

  return {
    sun: {
      planet: 'Sun',
      sign: sunSign,
      aspectToMoon: sunAspect,
    },
    moon: {
      planet: 'Moon',
      sign: moonSign,
      aspectToMoon: moonAspect,
    },
  };
}

/**
 * Generate horoscope content based on moon sign, nakshatra, and transits
 */
function generateHoroscopeContent(
  moonSign: string,
  nakshatra: string | undefined,
  transits: DailyTransits,
  date: Date
): string {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

  // Get moon sign specific guidance
  const moonSignGuidance = getMoonSignGuidance(moonSign);

  // Get transit-based insights
  const transitInsights = getTransitInsights(transits, moonSign);

  // Get nakshatra-based wisdom (if available)
  const nakshatraWisdom = nakshatra ? getNakshatraWisdom(nakshatra) : '';

  // Compose the horoscope
  let horoscope = `${dayOfWeek}'s Guidance for ${moonSign} Moon\n\n`;

  horoscope += `${moonSignGuidance}\n\n`;

  if (transitInsights) {
    horoscope += `Today's Cosmic Influences:\n${transitInsights}\n\n`;
  }

  if (nakshatraWisdom) {
    horoscope += `Nakshatra Wisdom (${nakshatra}):\n${nakshatraWisdom}\n\n`;
  }

  horoscope += getGeneralGuidance(transits);

  return horoscope;
}

/**
 * Get moon sign specific guidance based on "Astrology of the Seers" principles
 */
function getMoonSignGuidance(moonSign: string): string {
  const guidance: Record<string, string> = {
    Aries:
      'Your fiery nature seeks expression today. Channel your dynamic energy into purposeful action. The warrior spirit within you is awakened - use it wisely for constructive endeavors.',
    Taurus:
      'Stability and comfort call to you. Ground yourself in the material world while remaining open to spiritual growth. Your natural patience is a gift - trust in divine timing.',
    Gemini:
      'Communication flows through you like a river. Share your ideas and connect with others. Your curious mind seeks knowledge - follow the threads of wisdom that appear.',
    Cancer:
      'Emotional depth is your strength. Honor your feelings while maintaining boundaries. The nurturing energy within you can heal both yourself and others today.',
    Leo:
      'Your inner light shines brightly. Express your authentic self with confidence. Leadership comes naturally - inspire others through your example and generosity of spirit.',
    Virgo:
      'Attention to detail serves you well. Organize and refine your environment and thoughts. Service to others brings fulfillment, but remember to serve yourself with equal devotion.',
    Libra:
      'Balance and harmony guide your path. Seek equilibrium in all relationships and decisions. Your diplomatic nature can bridge divides - use this gift with awareness.',
    Scorpio:
      'Transformation stirs within your depths. Embrace change and release what no longer serves. Your intensity is power - direct it toward regeneration and truth.',
    Sagittarius:
      'Expansion and wisdom call to you. Explore new horizons, whether physical or philosophical. Your optimistic spirit uplifts others - share your vision generously.',
    Capricorn:
      'Discipline and structure support your goals. Build steadily toward your aspirations. Your practical wisdom combined with spiritual awareness creates lasting achievement.',
    Aquarius:
      'Innovation and humanitarian ideals inspire you. Think beyond convention and embrace your uniqueness. Your vision for collective progress can manifest through conscious action.',
    Pisces:
      'Spiritual sensitivity heightens your awareness. Trust your intuition and creative imagination. Compassion flows naturally from you - extend it to yourself as well as others.',
  };

  return guidance[moonSign] || guidance.Aries;
}

/**
 * Get transit-based insights
 */
function getTransitInsights(transits: DailyTransits, natalMoonSign: string): string {
  const insights: string[] = [];

  // Moon transit insights
  const moonAspect = transits.moon.aspectToMoon;
  if (moonAspect === 0) {
    insights.push(
      'The Moon returns to your natal position, bringing emotional clarity and a fresh start.'
    );
  } else if (moonAspect === 120 || moonAspect === 240) {
    insights.push(
      'The Moon forms a harmonious trine, supporting emotional flow and positive connections.'
    );
  } else if (moonAspect === 180) {
    insights.push(
      'The Moon opposes your natal position, inviting balance between inner needs and outer demands.'
    );
  } else if (moonAspect === 90 || moonAspect === 270) {
    insights.push(
      'The Moon creates dynamic tension, catalyzing growth through emotional challenges.'
    );
  }

  // Sun transit insights
  const sunAspect = transits.sun.aspectToMoon;
  if (sunAspect === 0) {
    insights.push(
      'The Sun illuminates your emotional nature, bringing vitality and self-awareness.'
    );
  } else if (sunAspect === 120 || sunAspect === 240) {
    insights.push(
      'The Sun supports your emotional well-being with harmonious, creative energy.'
    );
  }

  // Transit sign insights
  if (transits.moon.sign === natalMoonSign) {
    insights.push(
      'With the Moon in your natal sign, your intuition is particularly strong today.'
    );
  }

  return insights.join(' ');
}

/**
 * Get nakshatra-based wisdom
 */
function getNakshatraWisdom(nakshatra: string): string {
  const wisdom: Record<string, string> = {
    Ashwini: 'Swift action and healing energy surround you. Trust your pioneering spirit.',
    Bharani: 'Creative power and transformation are your gifts. Honor life cycles.',
    Krittika: 'Sharp discernment cuts through illusion. Use your clarity wisely.',
    Rohini: 'Beauty and growth flourish through you. Nurture what you wish to see bloom.',
    Mrigashira: 'Curiosity leads to discovery. Follow your quest for knowledge.',
    Ardra: 'Storms bring renewal. Embrace change as a purifying force.',
    Punarvasu: 'Return to your center. Renewal and restoration are available.',
    Pushya: 'Nourishment and support flow naturally. Share your abundance.',
    Ashlesha: 'Deep wisdom lies in the shadows. Embrace your mystical nature.',
    Magha: 'Ancestral power supports you. Honor your lineage and authority.',
    'Purva Phalguni': 'Joy and creativity are your birthright. Celebrate life.',
    'Uttara Phalguni': 'Generosity and partnership bring fulfillment. Give and receive freely.',
    Hasta: 'Skillful hands create magic. Your craftsmanship manifests intentions.',
    Chitra: 'Artistic vision illuminates your path. Create beauty consciously.',
    Swati: 'Independence and flexibility serve you. Move with the wind.',
    Vishakha: 'Determined focus achieves goals. Channel your intensity purposefully.',
    Anuradha: 'Devotion and friendship deepen bonds. Cultivate meaningful connections.',
    Jyeshtha: 'Leadership and protection are your domain. Use power responsibly.',
    Mula: 'Root out what no longer serves. Transformation begins at the foundation.',
    'Purva Ashadha': 'Invincible spirit carries you forward. Trust your inner strength.',
    'Uttara Ashadha': 'Victory comes through righteousness. Stand in your truth.',
    Shravana: 'Listen deeply to wisdom. Knowledge comes through receptivity.',
    Dhanishta: 'Rhythm and prosperity align. Move in harmony with cosmic timing.',
    Shatabhisha: 'Healing and mystery intertwine. Explore hidden dimensions.',
    'Purva Bhadrapada': 'Spiritual fire purifies. Embrace transformation courageously.',
    'Uttara Bhadrapada': 'Deep wisdom and compassion unite. Serve the greater good.',
    Revati: 'Journey\'s end brings new beginnings. Trust in divine guidance.',
  };

  return wisdom[nakshatra] || 'Your birth star guides you with unique wisdom.';
}

/**
 * Get general guidance for the day
 */
function getGeneralGuidance(transits: DailyTransits): string {
  const guidance = [
    'Remember: The stars incline but do not compel. Your free will shapes your destiny.',
    'Practice: Take time for meditation or quiet reflection to align with cosmic rhythms.',
    'Affirmation: I am in harmony with the universe and trust in divine timing.',
  ];

  return guidance.join('\n');
}

/**
 * Fallback horoscope when user data is incomplete or errors occur
 */
function getFallbackHoroscope(): string {
  return `Welcome to Your Daily Guidance

To receive personalized astrological insights based on "Astrology of the Seers" principles, please complete your birth profile with your birth date, time, and location.

General Wisdom for Today:
The cosmos invites you to align with your highest purpose. Take time to connect with your inner wisdom through meditation or quiet reflection. Trust that the universe supports your growth and evolution.

Remember: You are a unique expression of cosmic consciousness. Your journey is sacred, and each day offers opportunities for awakening and transformation.

Complete your profile to unlock personalized daily horoscopes tailored to your birth chart.`;
}
