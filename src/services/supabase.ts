import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Helper function to get Constants safely
const getConstants = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Constants = require('expo-constants').default;
    return Constants;
  } catch {
    return null;
  }
};

const Constants = getConstants();

// Get Supabase credentials from environment variables
const supabaseUrl = Constants?.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || 
                    process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants?.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Export configuration for debugging purposes (without exposing sensitive data)
export const getSupabaseConfig = () => ({
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Not configured',
  hasAnonKey: !!supabaseAnonKey,
});
