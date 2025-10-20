import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import {
    calculateAscendant,
    calculateMoonPosition,
    calculateMoonSign,
    calculateNakshatra,
    calculateSunSign,
} from '../../utils/astrologyUtils';

interface BirthDetailsFormScreenProps {
  navigation: any;
}

const BirthDetailsFormScreen: React.FC<BirthDetailsFormScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  
  // Form state
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [birthTime, setBirthTime] = useState<Date>(new Date());
  const [birthLocation, setBirthLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [timezone, setTimezone] = useState('');
  
  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadExistingProfile();
  }, [user]);

  const loadExistingProfile = async () => {
    if (!user) return;

    try {
      // Load from cache first for faster display
      const profile = await getUserProfile(user.id, false);
      if (profile) {
        // Pre-fill form with existing data
        if (profile.birth_date) {
          setBirthDate(new Date(profile.birth_date));
        }
        if (profile.birth_time) {
          const [hours, minutes] = profile.birth_time.split(':');
          const time = new Date();
          time.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
          setBirthTime(time);
        }
        if (profile.birth_location) setBirthLocation(profile.birth_location);
        if (profile.birth_latitude) setLatitude(profile.birth_latitude.toString());
        if (profile.birth_longitude) setLongitude(profile.birth_longitude.toString());
        if (profile.birth_timezone) setTimezone(profile.birth_timezone);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate birth location
    if (!birthLocation.trim()) {
      newErrors.birthLocation = 'Please enter your birth city';
    } else if (birthLocation.trim().length < 2) {
      newErrors.birthLocation = 'Birth location must be at least 2 characters';
    }

    // Validate latitude
    if (!latitude.trim()) {
      newErrors.latitude = 'Latitude is required for accurate calculations';
    } else {
      const lat = parseFloat(latitude);
      if (isNaN(lat)) {
        newErrors.latitude = 'Please enter a valid number (e.g., 40.7128)';
      } else if (lat < -90 || lat > 90) {
        newErrors.latitude = 'Latitude must be between -90° and 90°';
      }
    }

    // Validate longitude
    if (!longitude.trim()) {
      newErrors.longitude = 'Longitude is required for accurate calculations';
    } else {
      const lon = parseFloat(longitude);
      if (isNaN(lon)) {
        newErrors.longitude = 'Please enter a valid number (e.g., -74.0060)';
      } else if (lon < -180 || lon > 180) {
        newErrors.longitude = 'Longitude must be between -180° and 180°';
      }
    }

    // Validate timezone
    if (!timezone.trim()) {
      newErrors.timezone = 'Timezone is required (e.g., America/New_York)';
    } else {
      // Basic timezone format validation
      const timezonePattern = /^[A-Za-z]+\/[A-Za-z_]+$/;
      if (!timezonePattern.test(timezone.trim())) {
        newErrors.timezone = 'Please use IANA format (e.g., America/New_York, Asia/Kolkata)';
      }
    }

    // Validate birth date is not in the future
    if (birthDate > new Date()) {
      newErrors.birthDate = 'Birth date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to save your birth details');
      return;
    }

    if (!validateForm()) {
      Alert.alert(
        'Validation Error', 
        'Please correct the highlighted fields before saving',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);

    try {
      // Format birth date as YYYY-MM-DD
      const formattedDate = birthDate.toISOString().split('T')[0];
      
      // Format birth time as HH:MM:SS
      const hours = birthTime.getHours().toString().padStart(2, '0');
      const minutes = birthTime.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:00`;

      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      // Calculate astrological data
      const moonSign = calculateMoonSign(birthDate, formattedTime, lat, lon);
      const sunSign = calculateSunSign(birthDate);
      const ascendant = calculateAscendant(birthDate, formattedTime, lat, lon);
      const moonPosition = calculateMoonPosition(birthDate, formattedTime, lat, lon);
      const nakshatra = calculateNakshatra(moonPosition.longitude);

      // Update profile with birth details and calculated astrological data
      await updateUserProfile(user.id, {
        birth_date: formattedDate,
        birth_time: formattedTime,
        birth_location: birthLocation.trim(),
        birth_latitude: lat,
        birth_longitude: lon,
        birth_timezone: timezone.trim(),
        moon_sign: moonSign,
        sun_sign: sunSign,
        ascendant: ascendant,
        nakshatra: nakshatra,
      });

      Alert.alert(
        '✨ Success!',
        'Your birth details have been saved and your astrological profile has been calculated.',
        [
          {
            text: 'View Profile',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving birth details:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      Alert.alert(
        'Save Failed',
        errorMessage + '\n\nPlease check your internet connection and try again.',
        [
          { text: 'OK' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthDate(selectedDate);
      if (errors.birthDate) {
        setErrors({ ...errors, birthDate: '' });
      }
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setBirthTime(selectedTime);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Birth Details</Text>
          <Text style={styles.headerSubtitle}>
            Enter your birth information to calculate your astrological profile
          </Text>
        </View>

        {/* Birth Date */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Birth Date *</Text>
          <TouchableOpacity
            style={[styles.dateTimeButton, errors.birthDate && styles.inputError]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {birthDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
          {errors.birthDate && (
            <Text style={styles.errorText}>{errors.birthDate}</Text>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Birth Time */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Birth Time *</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {birthTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={birthTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
            />
          )}
        </View>

        {/* Birth Location */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Birth Location (City) *</Text>
          <TextInput
            style={[styles.input, errors.birthLocation && styles.inputError]}
            value={birthLocation}
            onChangeText={(text) => {
              setBirthLocation(text);
              if (errors.birthLocation) {
                setErrors({ ...errors, birthLocation: '' });
              }
            }}
            placeholder="e.g., New York, NY"
            placeholderTextColor="#9CA3AF"
          />
          {errors.birthLocation && (
            <Text style={styles.errorText}>{errors.birthLocation}</Text>
          )}
        </View>

        {/* Latitude */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Latitude *</Text>
          <TextInput
            style={[styles.input, errors.latitude && styles.inputError]}
            value={latitude}
            onChangeText={(text) => {
              setLatitude(text);
              if (errors.latitude) {
                setErrors({ ...errors, latitude: '' });
              }
            }}
            placeholder="e.g., 40.7128"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          {errors.latitude && (
            <Text style={styles.errorText}>{errors.latitude}</Text>
          )}
          <Text style={styles.helpText}>
            Range: -90 to 90 (North is positive, South is negative)
          </Text>
        </View>

        {/* Longitude */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Longitude *</Text>
          <TextInput
            style={[styles.input, errors.longitude && styles.inputError]}
            value={longitude}
            onChangeText={(text) => {
              setLongitude(text);
              if (errors.longitude) {
                setErrors({ ...errors, longitude: '' });
              }
            }}
            placeholder="e.g., -74.0060"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          {errors.longitude && (
            <Text style={styles.errorText}>{errors.longitude}</Text>
          )}
          <Text style={styles.helpText}>
            Range: -180 to 180 (East is positive, West is negative)
          </Text>
        </View>

        {/* Timezone */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Timezone *</Text>
          <TextInput
            style={[styles.input, errors.timezone && styles.inputError]}
            value={timezone}
            onChangeText={(text) => {
              setTimezone(text);
              if (errors.timezone) {
                setErrors({ ...errors, timezone: '' });
              }
            }}
            placeholder="e.g., America/New_York"
            placeholderTextColor="#9CA3AF"
          />
          {errors.timezone && (
            <Text style={styles.errorText}>{errors.timezone}</Text>
          )}
          <Text style={styles.helpText}>
            Use IANA timezone format (e.g., America/New_York, Asia/Kolkata)
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            You can find coordinates and timezone for your birth location using online tools like Google Maps or timeanddate.com
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Calculating...' : '✨ Save & Calculate'}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  dateTimeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#1F2937',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#4338CA',
    lineHeight: 18,
  },
  saveButton: {
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
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default BirthDetailsFormScreen;
