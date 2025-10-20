/**
 * Cache Service
 * Handles data persistence and caching using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

// Cache keys
const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  HOROSCOPE: 'horoscope',
  HOROSCOPE_DATE: 'horoscope_date',
} as const;

/**
 * Cache user profile data
 */
export const cacheUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      CACHE_KEYS.USER_PROFILE,
      JSON.stringify(profile)
    );
  } catch (error) {
    console.error('Error caching user profile:', error);
  }
};

/**
 * Get cached user profile
 */
export const getCachedUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.USER_PROFILE);
    if (cached) {
      return JSON.parse(cached) as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting cached user profile:', error);
    return null;
  }
};

/**
 * Cache today's horoscope with date key
 */
export const cacheHoroscope = async (
  horoscope: string,
  date: Date = new Date()
): Promise<void> => {
  try {
    const dateKey = formatDateKey(date);
    await AsyncStorage.multiSet([
      [CACHE_KEYS.HOROSCOPE, horoscope],
      [CACHE_KEYS.HOROSCOPE_DATE, dateKey],
    ]);
  } catch (error) {
    console.error('Error caching horoscope:', error);
  }
};

/**
 * Get cached horoscope if it's for today
 */
export const getCachedHoroscope = async (
  date: Date = new Date()
): Promise<string | null> => {
  try {
    const dateKey = formatDateKey(date);
    const [[, cachedHoroscope], [, cachedDate]] = await AsyncStorage.multiGet([
      CACHE_KEYS.HOROSCOPE,
      CACHE_KEYS.HOROSCOPE_DATE,
    ]);

    // Return cached horoscope only if it's for the requested date
    if (cachedHoroscope && cachedDate === dateKey) {
      return cachedHoroscope;
    }

    return null;
  } catch (error) {
    console.error('Error getting cached horoscope:', error);
    return null;
  }
};

/**
 * Invalidate user profile cache (call when profile is updated)
 */
export const invalidateUserProfileCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CACHE_KEYS.USER_PROFILE);
  } catch (error) {
    console.error('Error invalidating user profile cache:', error);
  }
};

/**
 * Invalidate horoscope cache
 */
export const invalidateHoroscopeCache = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      CACHE_KEYS.HOROSCOPE,
      CACHE_KEYS.HOROSCOPE_DATE,
    ]);
  } catch (error) {
    console.error('Error invalidating horoscope cache:', error);
  }
};

/**
 * Clear all cached data (call on logout)
 */
export const clearAllCache = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      CACHE_KEYS.USER_PROFILE,
      CACHE_KEYS.HOROSCOPE,
      CACHE_KEYS.HOROSCOPE_DATE,
    ]);
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
};

/**
 * Format date as YYYY-MM-DD for cache key
 */
function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
