import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
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
import { isValidEmail, isValidPassword } from '../../utils/errorUtils';

interface SignupScreenProps {
  navigation: any;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  birthDate?: string;
  birthTime?: string;
  birthLocation?: string;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signup, loading, error, clearError } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [birthTime, setBirthTime] = useState<Date | null>(null);
  const [birthLocation, setBirthLocation] = useState('');
  const [birthLatitude, setBirthLatitude] = useState<number | null>(null);
  const [birthLongitude, setBirthLongitude] = useState<number | null>(null);
  
  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = isValidPassword(password);
      if (!passwordValidation.valid) {
        errors.password = passwordValidation.message;
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Birth date validation
    if (!birthDate) {
      errors.birthDate = 'Birth date is required for astrological calculations';
    } else if (birthDate > new Date()) {
      errors.birthDate = 'Birth date cannot be in the future';
    }

    // Birth time validation
    if (!birthTime) {
      errors.birthTime = 'Birth time is required for accurate chart calculations';
    }

    // Birth location validation - must be selected from map to get coordinates
    if (!birthLocation.trim()) {
      errors.birthLocation = 'Birth location is required';
    } else if (birthLocation.trim().length < 2) {
      errors.birthLocation = 'Please enter a valid location';
    } else if (birthLatitude === null || birthLongitude === null) {
      errors.birthLocation = 'Please select your birth location from the map to get accurate coordinates';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    // Clear previous errors
    clearError();
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prepare birth data
    const birthData = {
      birthDate: birthDate!,
      birthTime: birthTime!,
      birthLocation: birthLocation.trim(),
      birthLatitude: birthLatitude,
      birthLongitude: birthLongitude,
    };

    // Attempt signup
    const success = await signup({
      email: email.trim(),
      password,
      birthData,
    });

    if (!success) {
      // Error is handled by AuthContext
      return;
    }

    // Navigation is handled by RootNavigator based on auth state
  };

  const handleNavigateToLogin = () => {
    clearError();
    setValidationErrors({});
    navigation.navigate('Login');
  };

  const handleOpenLocationPicker = () => {
    navigation.navigate('LocationPicker', {
      onLocationSelect: (location: {
        address: string;
        latitude: number;
        longitude: number;
      }) => {
        setBirthLocation(location.address);
        setBirthLatitude(location.latitude);
        setBirthLongitude(location.longitude);
        if (validationErrors.birthLocation) {
          setValidationErrors({ ...validationErrors, birthLocation: undefined });
        }
      },
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthDate(selectedDate);
      if (validationErrors.birthDate) {
        setValidationErrors({ ...validationErrors, birthDate: undefined });
      }
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setBirthTime(selectedTime);
      if (validationErrors.birthTime) {
        setValidationErrors({ ...validationErrors, birthTime: undefined });
      }
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: Date | null): string => {
    if (!time) return 'Select time';
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join NAKSH for personalized astrology insights
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  validationErrors.email && styles.inputError,
                ]}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: undefined });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {validationErrors.email && (
                <Text style={styles.errorText}>{validationErrors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  validationErrors.password && styles.inputError,
                ]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (validationErrors.password) {
                    setValidationErrors({ ...validationErrors, password: undefined });
                  }
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {validationErrors.password && (
                <Text style={styles.errorText}>{validationErrors.password}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.input,
                  validationErrors.confirmPassword && styles.inputError,
                ]}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (validationErrors.confirmPassword) {
                    setValidationErrors({ ...validationErrors, confirmPassword: undefined });
                  }
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {validationErrors.confirmPassword && (
                <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>
              )}
            </View>

            {/* Birth Details Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Birth Details</Text>
              <Text style={styles.sectionSubtitle}>
                Required for personalized astrology readings
              </Text>
            </View>

            {/* Birth Date Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birth Date</Text>
              <TouchableOpacity
                style={[
                  styles.pickerButton,
                  validationErrors.birthDate && styles.inputError,
                ]}
                onPress={() => setShowDatePicker(true)}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.pickerText,
                    !birthDate && styles.pickerPlaceholder,
                  ]}
                >
                  {formatDate(birthDate)}
                </Text>
              </TouchableOpacity>
              {validationErrors.birthDate && (
                <Text style={styles.errorText}>{validationErrors.birthDate}</Text>
              )}
              {showDatePicker && (
                <DateTimePicker
                  value={birthDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* Birth Time Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birth Time</Text>
              <TouchableOpacity
                style={[
                  styles.pickerButton,
                  validationErrors.birthTime && styles.inputError,
                ]}
                onPress={() => setShowTimePicker(true)}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.pickerText,
                    !birthTime && styles.pickerPlaceholder,
                  ]}
                >
                  {formatTime(birthTime)}
                </Text>
              </TouchableOpacity>
              {validationErrors.birthTime && (
                <Text style={styles.errorText}>{validationErrors.birthTime}</Text>
              )}
              {showTimePicker && (
                <DateTimePicker
                  value={birthTime || new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}
            </View>

            {/* Birth Location Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birth Location (Required)</Text>
              <Text style={styles.helperText}>
                Tap to select your exact birth location from the map
              </Text>
              <TouchableOpacity
                style={[
                  styles.locationPickerButton,
                  validationErrors.birthLocation && styles.inputError,
                  birthLatitude && birthLongitude && styles.locationPickerSelected,
                ]}
                onPress={handleOpenLocationPicker}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.locationPickerText,
                    !birthLocation && styles.pickerPlaceholder,
                  ]}
                  numberOfLines={2}
                >
                  {birthLocation || 'Tap to select location from map'}
                </Text>
                <Text style={styles.mapIcon}>
                  {birthLatitude && birthLongitude ? '✓ 📍' : '📍'}
                </Text>
              </TouchableOpacity>
              {validationErrors.birthLocation && (
                <Text style={styles.errorText}>{validationErrors.birthLocation}</Text>
              )}
              {birthLatitude && birthLongitude && (
                <Text style={styles.successText}>
                  ✓ Location coordinates captured
                </Text>
              )}
            </View>

            {/* Auth Error Message */}
            {error && (
              <View style={styles.authErrorContainer}>
                <Text style={styles.authErrorText}>{error}</Text>
              </View>
            )}

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={handleNavigateToLogin}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  successText: {
    color: '#10B981',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A2E',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerText: {
    fontSize: 16,
    color: '#1A1A2E',
  },
  pickerPlaceholder: {
    color: '#999',
  },
  locationPickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationPickerSelected: {
    borderColor: '#10B981',
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
  },
  locationPickerText: {
    fontSize: 16,
    color: '#1A1A2E',
    flex: 1,
  },
  mapIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  authErrorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  authErrorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignupScreen;
export { SignupScreen };

