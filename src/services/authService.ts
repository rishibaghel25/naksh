import { AuthError, Session, User } from '@supabase/supabase-js';
import { getUserFriendlyErrorMessage, withTimeout } from '../utils/errorUtils';
import { supabase } from './supabase';

export interface SignupBirthData {
  birthDate: Date;
  birthTime: Date;
  birthLocation: string;
  birthLatitude?: number | null;
  birthLongitude?: number | null;
}

export interface SignupData {
  email: string;
  password: string;
  birthData?: SignupBirthData;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

class AuthService {
  /**
   * Sign up a new user with email and password
   * Includes timeout handling
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const signupOperation = async () => {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (error) {
          const friendlyMessage = getUserFriendlyErrorMessage(error);
          return { 
            user: null, 
            session: null, 
            error: { ...error, message: friendlyMessage } as AuthError 
          };
        }

        // If signup successful and user data exists, create user profile
        if (authData.user) {
          await this.createUserProfile(authData.user.id, data);
        }

        return {
          user: authData.user,
          session: authData.session,
          error: null,
        };
      };

      return await withTimeout(signupOperation(), 15000);
    } catch (error) {
      const friendlyMessage = getUserFriendlyErrorMessage(error);
      return {
        user: null,
        session: null,
        error: { message: friendlyMessage } as AuthError,
      };
    }
  }

  /**
   * Log in an existing user
   * Includes timeout handling
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const loginOperation = async () => {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) {
          const friendlyMessage = getUserFriendlyErrorMessage(error);
          return { 
            user: null, 
            session: null, 
            error: { ...error, message: friendlyMessage } as AuthError 
          };
        }

        return {
          user: authData.user,
          session: authData.session,
          error: null,
        };
      };

      return await withTimeout(loginOperation(), 15000);
    } catch (error) {
      const friendlyMessage = getUserFriendlyErrorMessage(error);
      return {
        user: null,
        session: null,
        error: { message: friendlyMessage } as AuthError,
      };
    }
  }

  /**
   * Log out the current user
   * Includes timeout handling
   */
  async logout(): Promise<{ error: AuthError | null }> {
    try {
      const logoutOperation = async () => {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          const friendlyMessage = getUserFriendlyErrorMessage(error);
          return { error: { ...error, message: friendlyMessage } as AuthError };
        }
        
        return { error: null };
      };

      return await withTimeout(logoutOperation(), 10000);
    } catch (error) {
      const friendlyMessage = getUserFriendlyErrorMessage(error);
      return { error: { message: friendlyMessage } as AuthError };
    }
  }

  /**
   * Get the current session
   */
  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data.session, error };
    } catch (error) {
      return { session: null, error: error as AuthError };
    }
  }

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { user: data.user, error };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  }

  /**
   * Create user profile in database after signup
   */
  private async createUserProfile(userId: string, data: SignupData): Promise<void> {
    try {
      const profileData: any = {
        id: userId,
        email: data.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add birth data if provided
      if (data.birthData) {
        // Format date as YYYY-MM-DD
        const birthDate = data.birthData.birthDate;
        profileData.birth_date = birthDate.toISOString().split('T')[0];
        
        // Format time as HH:MM:SS
        const birthTime = data.birthData.birthTime;
        const hours = birthTime.getHours().toString().padStart(2, '0');
        const minutes = birthTime.getMinutes().toString().padStart(2, '0');
        const seconds = birthTime.getSeconds().toString().padStart(2, '0');
        profileData.birth_time = `${hours}:${minutes}:${seconds}`;
        
        profileData.birth_location = data.birthData.birthLocation;
        
        // Add coordinates if provided
        if (data.birthData.birthLatitude !== null && data.birthData.birthLatitude !== undefined) {
          profileData.birth_latitude = data.birthData.birthLatitude;
        }
        if (data.birthData.birthLongitude !== null && data.birthData.birthLongitude !== undefined) {
          profileData.birth_longitude = data.birthData.birthLongitude;
        }

        // Calculate astrological data if we have coordinates
        if (profileData.birth_latitude && profileData.birth_longitude) {
          const { 
            calculateMoonSign, 
            calculateSunSign, 
            calculateAscendant, 
            calculateMoonPosition 
          } = await import('../utils/astrologyUtils');

          try {
            // Calculate all astrological data
            const moonSign = calculateMoonSign(
              birthDate,
              profileData.birth_time,
              profileData.birth_latitude,
              profileData.birth_longitude
            );

            const sunSign = calculateSunSign(birthDate);

            const ascendant = calculateAscendant(
              birthDate,
              profileData.birth_time,
              profileData.birth_latitude,
              profileData.birth_longitude
            );

            const moonPosition = calculateMoonPosition(
              birthDate,
              profileData.birth_time,
              profileData.birth_latitude,
              profileData.birth_longitude
            );

            // Add calculated data to profile
            profileData.moon_sign = moonSign;
            profileData.sun_sign = sunSign;
            profileData.ascendant = ascendant;
            profileData.nakshatra = moonPosition.nakshatra;
          } catch (calcError) {
            console.error('Error calculating astrological data:', calcError);
            // Continue without astrological data - user can recalculate later
          }
        }
      }

      const { data: insertedProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting user profile:', insertError);
        
        // Check if it's an RLS error
        if (insertError.code === '42501') {
          console.error('RLS POLICY ERROR: Row Level Security is blocking profile creation.');
          console.error('SOLUTION: Go to Supabase Dashboard → SQL Editor and run:');
          console.error('ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;');
          console.error('GRANT ALL ON user_profiles TO authenticated;');
        }
        
        // Don't throw - allow signup to complete even if profile creation fails
        // User can complete profile later
        console.warn('Profile creation failed, but signup will continue');
        return;
      }

      console.log('✅ User profile created successfully:', {
        id: insertedProfile?.id,
        hasBirthData: !!insertedProfile?.birth_date,
        hasAstroData: !!insertedProfile?.moon_sign,
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      // Don't throw - allow signup to complete
      console.warn('Profile creation failed, but signup will continue');
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }
}

export const authService = new AuthService();
