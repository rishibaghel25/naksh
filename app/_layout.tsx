import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import ErrorBoundary from '@/src/components/ErrorBoundary';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { RootNavigator } from '@/src/navigation/RootNavigator';
import { isSupabaseConfigured } from '@/src/services/supabase';

export default function RootLayout() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Supabase and check configuration
    const initialize = async () => {
      try {
        // Verify Supabase is configured
        if (!isSupabaseConfigured()) {
          console.error('Supabase is not properly configured');
        }
        
        // Add any other initialization logic here
        // For example, loading fonts, checking for updates, etc.
        
        // Small delay to show splash screen
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error during app initialization:', error);
        // Still set initialized to true to allow app to load
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  // Show splash/loading screen during initialization
  if (!isInitialized) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
