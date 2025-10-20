import {
    CreateUserProfileInput,
    UpdateUserProfileInput,
    UserProfile
} from '../types';
import {
    getUserFriendlyErrorMessage,
    isNetworkError,
    withRetry
} from '../utils/errorUtils';
import {
    cacheUserProfile,
    getCachedUserProfile,
    invalidateHoroscopeCache,
    invalidateUserProfileCache
} from './cacheService';
import { supabase } from './supabase';

/**
 * User Service
 * Handles CRUD operations for user profiles in Supabase with caching support
 * Includes retry logic and network error handling
 */

/**
 * Fetches a user profile from Supabase by user ID
 * Implements caching for faster loading and offline support
 * Includes retry logic for network errors
 * @param userId - The UUID of the user
 * @param forceRefresh - If true, bypasses cache and fetches from server
 * @returns The user profile or null if not found
 * @throws Error if the fetch operation fails
 */
export const getUserProfile = async (
  userId: string,
  forceRefresh: boolean = false
): Promise<UserProfile | null> => {
  try {
    // Try to load from cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedProfile = await getCachedUserProfile();
      if (cachedProfile && cachedProfile.id === userId) {
        return cachedProfile;
      }
    }

    // Fetch from Supabase with retry logic
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If no rows returned, return null instead of throwing
        if (error.code === 'PGRST116') {
          return null;
        }
        
        throw new Error(getUserFriendlyErrorMessage(error));
      }

      return data as UserProfile;
    };

    const profile = await withRetry(fetchProfile, {
      maxRetries: 2,
      delayMs: 1000,
      timeoutMs: 10000,
    });

    if (profile) {
      // Cache the fetched profile
      await cacheUserProfile(profile);
    }

    return profile;
  } catch (error) {
    // On network error, try to return cached data as fallback
    if (isNetworkError(error)) {
      console.warn('Network error, returning cached profile');
      const cachedProfile = await getCachedUserProfile();
      if (cachedProfile && cachedProfile.id === userId) {
        return cachedProfile;
      }
    }
    
    if (error instanceof Error) {
      throw new Error(getUserFriendlyErrorMessage(error));
    }
    throw new Error('An unexpected error occurred while fetching user profile');
  }
};

/**
 * Creates a new user profile in Supabase
 * Includes retry logic for network errors
 * @param userId - The UUID of the user
 * @param profileData - The profile data to create
 * @returns The created user profile
 * @throws Error if the creation fails
 */
export const createUserProfile = async (
  userId: string,
  profileData: CreateUserProfileInput
): Promise<UserProfile> => {
  try {
    const profileToCreate = {
      id: userId,
      email: profileData.email,
      birth_date: profileData.birth_date || null,
      birth_time: profileData.birth_time || null,
      birth_location: profileData.birth_location || null,
      birth_latitude: profileData.birth_latitude || null,
      birth_longitude: profileData.birth_longitude || null,
      birth_timezone: profileData.birth_timezone || null,
      moon_sign: null,
      sun_sign: null,
      ascendant: null,
      nakshatra: null,
      birth_chart: null,
    };

    const createProfile = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileToCreate)
        .select()
        .single();

      if (error) {
        throw new Error(getUserFriendlyErrorMessage(error));
      }

      if (!data) {
        throw new Error('Failed to create user profile: No data returned');
      }

      return data as UserProfile;
    };

    return await withRetry(createProfile, {
      maxRetries: 2,
      delayMs: 1000,
      timeoutMs: 10000,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(getUserFriendlyErrorMessage(error));
    }
    throw new Error('An unexpected error occurred while creating user profile');
  }
};

/**
 * Updates an existing user profile in Supabase
 * Invalidates cache after successful update
 * Includes retry logic for network errors
 * @param userId - The UUID of the user
 * @param profileData - The profile data to update
 * @returns The updated user profile
 * @throws Error if the update fails
 */
export const updateUserProfile = async (
  userId: string,
  profileData: UpdateUserProfileInput
): Promise<UserProfile> => {
  try {
    const updateData: any = {
      ...profileData,
      updated_at: new Date().toISOString(),
    };

    const updateProfile = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(getUserFriendlyErrorMessage(error));
      }

      if (!data) {
        throw new Error('Failed to update user profile: No data returned');
      }

      return data as UserProfile;
    };

    const updatedProfile = await withRetry(updateProfile, {
      maxRetries: 2,
      delayMs: 1000,
      timeoutMs: 15000,
    });

    // Invalidate old cache and cache the new profile
    await invalidateUserProfileCache();
    await cacheUserProfile(updatedProfile);
    
    // Also invalidate horoscope cache since profile changed
    await invalidateHoroscopeCache();

    return updatedProfile;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(getUserFriendlyErrorMessage(error));
    }
    throw new Error('An unexpected error occurred while updating user profile');
  }
};

/**
 * Deletes a user profile from Supabase
 * Includes retry logic for network errors
 * @param userId - The UUID of the user
 * @throws Error if the deletion fails
 */
export const deleteUserProfile = async (userId: string): Promise<void> => {
  try {
    const deleteProfile = async () => {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new Error(getUserFriendlyErrorMessage(error));
      }
    };

    await withRetry(deleteProfile, {
      maxRetries: 2,
      delayMs: 1000,
      timeoutMs: 10000,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(getUserFriendlyErrorMessage(error));
    }
    throw new Error('An unexpected error occurred while deleting user profile');
  }
};
