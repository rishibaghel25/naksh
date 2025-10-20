import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EmptyState from '../../components/EmptyState';
import HoroscopeCard from '../../components/HoroscopeCard';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useAuth } from '../../contexts/AuthContext';
import { generateDailyHoroscope } from '../../services/horoscopeService';
import { getUserProfile } from '../../services/userService';
import { UserProfile } from '../../types';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [horoscope, setHoroscope] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHoroscope();
  }, [user]);

  const loadHoroscope = async (forceRefresh: boolean = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch user profile (with optional force refresh)
      const profile = await getUserProfile(user.id, forceRefresh);
      setUserProfile(profile);

      // Generate daily horoscope (caching handled internally)
      const horoscopeText = await generateDailyHoroscope(
        profile || ({ id: user.id, email: user.email } as UserProfile),
        new Date()
      );
      setHoroscope(horoscopeText);
    } catch (err) {
      console.error('Error loading horoscope:', err);
      // Check if we have cached data to display
      if (horoscope) {
        setError('Unable to refresh. Showing cached data.');
      } else {
        setError('Failed to load your daily horoscope. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isProfileIncomplete = () => {
    if (!userProfile) return true;
    
    // Check if essential birth data is missing
    const missingBirthData = !userProfile.birth_date || 
                             !userProfile.birth_time || 
                             !userProfile.birth_location;
    
    // Check if astrological calculations are missing
    const missingAstroData = !userProfile.moon_sign || 
                             !userProfile.sun_sign || 
                             !userProfile.nakshatra;
    
    return missingBirthData || missingAstroData;
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoadingIndicator message="Consulting the stars..." />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <EmptyState
          icon="⚠️"
          title="Oops!"
          message={error}
          buttonText="Try Again"
          onButtonPress={loadHoroscope}
          variant="error"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Date Display */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
      </View>

      {/* Profile Incomplete Warning - Only show if profile is incomplete */}
      {isProfileIncomplete() ? (
        <EmptyState
          icon="✨"
          title="Complete Your Profile"
          message="To receive personalized astrological insights based on your birth chart, please complete your profile with your birth date, time, and location."
          buttonText="Complete Profile"
          onButtonPress={() => {
            // TODO: Navigate to profile/birth details form
            console.log('Navigate to profile');
          }}
          variant="warning"
        />
      ) : (
        <>
          {/* Horoscope Card - Only show when profile is complete */}
          <HoroscopeCard
            horoscope={horoscope}
            moonSign={userProfile?.moon_sign}
            nakshatra={userProfile?.nakshatra}
          />

          {/* Refresh Button */}
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={() => loadHoroscope(true)}
          >
            <Text style={styles.refreshButtonText}>🔄 Refresh Reading</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
});

export default HomeScreen;
