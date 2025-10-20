import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EmptyState from '../../components/EmptyState';
import LagnaChart from '../../components/LagnaChart';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useAuth } from '../../contexts/AuthContext';
import { MainStackParamList } from '../../navigation/MainStack';
import { getUserProfile } from '../../services/userService';
import { UserProfile } from '../../types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async (forceRefresh: boolean = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const profile = await getUserProfile(user.id, forceRefresh);
      setUserProfile(profile);
    } catch (err) {
      console.error('Error loading profile:', err);
      // Check if we have cached data to display
      if (userProfile) {
        setError('Unable to refresh. Showing cached data.');
      } else {
        setError('Failed to load your profile. Please check your connection and try again.');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    // Handle HH:MM:SS format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMoonSignDescription = (moonSign: string): string => {
    const descriptions: { [key: string]: string } = {
      'Aries': 'Dynamic and pioneering, your emotional nature is bold and direct. You seek independence and new experiences.',
      'Taurus': 'Grounded and stable, you find emotional security through material comfort and sensory pleasures.',
      'Gemini': 'Curious and adaptable, your emotions are expressed through communication and intellectual connection.',
      'Cancer': 'Deeply intuitive and nurturing, you are emotionally sensitive and connected to home and family.',
      'Leo': 'Warm and generous, you express emotions dramatically and seek recognition and creative expression.',
      'Virgo': 'Analytical and practical, you process emotions through service and attention to detail.',
      'Libra': 'Harmonious and diplomatic, you seek emotional balance through relationships and beauty.',
      'Scorpio': 'Intense and transformative, your emotional depth is profound and you seek truth beneath the surface.',
      'Sagittarius': 'Optimistic and philosophical, you find emotional fulfillment through exploration and wisdom.',
      'Capricorn': 'Disciplined and ambitious, you approach emotions with maturity and seek lasting achievement.',
      'Aquarius': 'Independent and humanitarian, your emotions are expressed through innovation and community.',
      'Pisces': 'Compassionate and mystical, you are deeply empathetic and connected to the spiritual realm.',
    };
    return descriptions[moonSign] || 'Your moon sign reveals your emotional nature and inner self.';
  };

  const handleEditProfile = () => {
    navigation.navigate('BirthDetailsForm');
  };

  if (loading) {
    return <LoadingIndicator message="Loading your cosmic profile..." />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <EmptyState
          icon="⚠️"
          title="Oops!"
          message={error}
          buttonText="Try Again"
          onButtonPress={loadProfile}
          variant="error"
        />
      </View>
    );
  }

  if (isProfileIncomplete()) {
    return (
      <View style={styles.centerContainer}>
        <EmptyState
          icon="🌙"
          title="Complete Your Profile"
          message="Add your birth details to unlock your personalized astrological profile and insights."
          buttonText="Add Birth Details"
          onButtonPress={handleEditProfile}
          variant="info"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cosmic Profile</Text>
        <Text style={styles.headerSubtitle}>{userProfile?.email}</Text>
      </View>

      {/* Moon Sign Card - Prominent Display */}
      {userProfile?.moon_sign && (
        <View style={styles.moonSignCard}>
          <View style={styles.moonSignHeader}>
            <Text style={styles.moonSignIcon}>🌙</Text>
            <View style={styles.moonSignTitleContainer}>
              <Text style={styles.moonSignLabel}>Moon Sign</Text>
              <Text style={styles.moonSignValue}>{userProfile.moon_sign}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.moonSignDescription}>
            {getMoonSignDescription(userProfile.moon_sign)}
          </Text>
        </View>
      )}

      {/* Astrological Information Grid */}
      <View style={styles.astroGrid}>
        {userProfile?.sun_sign && (
          <View style={styles.astroCard}>
            <Text style={styles.astroIcon}>☀️</Text>
            <Text style={styles.astroLabel}>Sun Sign</Text>
            <Text style={styles.astroValue}>{userProfile.sun_sign}</Text>
          </View>
        )}

        {userProfile?.ascendant && (
          <View style={styles.astroCard}>
            <Text style={styles.astroIcon}>⬆️</Text>
            <Text style={styles.astroLabel}>Ascendant</Text>
            <Text style={styles.astroValue}>{userProfile.ascendant}</Text>
          </View>
        )}

        {userProfile?.nakshatra && (
          <View style={styles.astroCard}>
            <Text style={styles.astroIcon}>⭐</Text>
            <Text style={styles.astroLabel}>Nakshatra</Text>
            <Text style={styles.astroValue}>{userProfile.nakshatra}</Text>
          </View>
        )}
      </View>

      {/* Lagna Chart Visualization */}
      {userProfile?.ascendant && userProfile?.moon_sign && userProfile?.sun_sign && (
        <View style={styles.birthChartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Birth Chart (Kundli)</Text>
            <Text style={styles.chartSubtitle}>Vedic Astrological Chart</Text>
          </View>
          <View style={styles.divider} />

          <LagnaChart
            ascendant={userProfile.ascendant}
            moonSign={userProfile.moon_sign}
            sunSign={userProfile.sun_sign}
          />

          <View style={styles.chartNote}>
            <Text style={styles.chartNoteText}>
              ✨ Your Lagna chart shows planetary positions at the time of your birth
            </Text>
          </View>
        </View>
      )}

      {/* Planetary Positions Summary */}
      <View style={styles.birthChartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Planetary Positions</Text>
          <Text style={styles.chartSubtitle}>Key Astrological Placements</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.chartElementsContainer}>
          {userProfile?.ascendant && (
            <View style={styles.chartElement}>
              <View style={styles.chartElementLeft}>
                <Text style={styles.chartPlanetIcon}>⬆️</Text>
                <Text style={styles.chartPlanetName}>Ascendant (Lagna)</Text>
              </View>
              <View style={styles.chartElementRight}>
                <Text style={styles.chartSignValue}>{userProfile.ascendant}</Text>
              </View>
            </View>
          )}

          {userProfile?.moon_sign && (
            <View style={styles.chartElement}>
              <View style={styles.chartElementLeft}>
                <Text style={styles.chartPlanetIcon}>🌙</Text>
                <Text style={styles.chartPlanetName}>Moon (Chandra)</Text>
              </View>
              <View style={styles.chartElementRight}>
                <Text style={styles.chartSignValue}>{userProfile.moon_sign}</Text>
              </View>
            </View>
          )}

          {userProfile?.sun_sign && (
            <View style={styles.chartElement}>
              <View style={styles.chartElementLeft}>
                <Text style={styles.chartPlanetIcon}>☀️</Text>
                <Text style={styles.chartPlanetName}>Sun (Surya)</Text>
              </View>
              <View style={styles.chartElementRight}>
                <Text style={styles.chartSignValue}>{userProfile.sun_sign}</Text>
              </View>
            </View>
          )}

          {userProfile?.nakshatra && (
            <View style={styles.chartElement}>
              <View style={styles.chartElementLeft}>
                <Text style={styles.chartPlanetIcon}>⭐</Text>
                <Text style={styles.chartPlanetName}>Nakshatra (Birth Star)</Text>
              </View>
              <View style={styles.chartElementRight}>
                <Text style={styles.chartSignValue}>{userProfile.nakshatra}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Birth Details Card */}
      <View style={styles.birthDetailsCard}>
        <Text style={styles.sectionTitle}>Birth Details</Text>
        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date of Birth</Text>
          <Text style={styles.detailValue}>
            {userProfile?.birth_date ? formatDate(userProfile.birth_date) : 'Not set'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time of Birth</Text>
          <Text style={styles.detailValue}>
            {userProfile?.birth_time ? formatTime(userProfile.birth_time) : 'Not set'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Place of Birth</Text>
          <Text style={styles.detailValue}>
            {userProfile?.birth_location || 'Not set'}
          </Text>
        </View>

        {userProfile?.birth_latitude && userProfile?.birth_longitude && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Coordinates</Text>
            <Text style={styles.detailValue}>
              {userProfile.birth_latitude.toFixed(4)}°, {userProfile.birth_longitude.toFixed(4)}°
            </Text>
          </View>
        )}
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
      </TouchableOpacity>
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
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  moonSignCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  moonSignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moonSignIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  moonSignTitleContainer: {
    flex: 1,
  },
  moonSignLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  moonSignValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  moonSignDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  astroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 20,
  },
  astroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 6,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  astroIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  astroLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  astroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  birthChartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
    borderTopWidth: 3,
    borderTopColor: '#8B5CF6',
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  chartElementsContainer: {
    marginBottom: 16,
  },
  chartElement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#D4AF37',
  },
  chartElementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chartPlanetIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  chartPlanetName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  chartElementRight: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chartSignValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
  chartNote: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
  },
  chartNoteText: {
    fontSize: 13,
    color: '#4338CA',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  birthDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  editButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
