# Implementation Plan - NAKSH Astrology App

## Project Structure Note

This project uses Expo Router (file-based routing). The current implementation has created a custom navigation structure in `src/navigation/` that needs to be integrated with the Expo Router setup in `app/_layout.tsx`. Task 20 will handle this integration.

**Testing Policy:** This project focuses on rapid development and implementation. No test files or test cases will be created. All validation will be done through manual testing and real-world usage.

## Implementation Status

**Completed (Tasks 1-10):**
- ✅ Project structure and Supabase configuration
- ✅ Database schema with RLS policies
- ✅ Authentication context and service
- ✅ Login and Signup screens with full functionality
- ✅ Navigation structure (AuthStack, BottomTabs, RootNavigator)
- ✅ User profile service (CRUD operations)
- ✅ Astrology calculation utilities
- ✅ Horoscope generation service (fully implemented)
- ✅ Home screen with daily horoscope display (fully functional)

**Remaining (Tasks 11-19):**
- ⏳ Reusable UI components (optional - can extract from existing screens)
- ⏳ Profile screen implementation
- ⏳ Birth chart visualization
- ⏳ Birth details form
- ⏳ Settings screen implementation
- ⏳ Logout functionality
- ⏳ Error handling and validation (partially done)
- ⏳ Data persistence and caching
- ⏳ App entry point integration with Expo Router

## Setup Commands

Before starting the implementation tasks, run these commands to set up the project:

```bash
# Create React Native project with Expo (recommended for easier setup)
npx create-expo-app NAKSH
cd NAKSH

# Install navigation dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

# Install Supabase
npm install @supabase/supabase-js

# Install additional dependencies
npm install @react-native-async-storage/async-storage
npm install react-native-paper
npm install date-fns

# For development
npm install --save-dev @types/react @types/react-native
```

**Supabase Setup:**
1. Create account at https://supabase.com
2. Create new project
3. Get API URL and anon key from project settings
4. Create `.env` file with:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## Implementation Tasks

- [x] 1. Initialize project structure and Supabase configuration
  - Create folder structure: `/src/screens`, `/src/components`, `/src/services`, `/src/utils`, `/src/types`, `/src/contexts`
  - Create Supabase client configuration file at `src/services/supabase.ts`
  - Set up environment variables for Supabase credentials
  - Create TypeScript interfaces for User Profile and Birth Data in `src/types/index.ts`
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Set up Supabase database schema
  - Create `user_profiles` table with columns: id, email, birth_date, birth_time, birth_location, birth_latitude, birth_longitude, birth_timezone, moon_sign, sun_sign, ascendant, nakshatra, birth_chart (jsonb), created_at, updated_at
  - Enable Row Level Security (RLS) on `user_profiles` table
  - Create RLS policies: users can only read/update their own profile
  - Create database migration script or SQL file in `/supabase` folder
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 3. Implement authentication context and service
  - Create `AuthContext` in `src/contexts/AuthContext.tsx` with login, signup, logout, and session state
  - Implement `authService` in `src/services/authService.ts` with Supabase auth methods
  - Add session persistence using AsyncStorage
  - Create custom hook `useAuth()` for accessing auth context
  - _Requirements: 1.3, 1.5, 1.7_

- [x] 4. Build Login screen UI and functionality
  - Create `LoginScreen.tsx` in `src/screens/auth/` with email and password input fields
  - Implement form validation for email and password
  - Add login button that calls auth service
  - Display error messages for invalid credentials
  - Add navigation link to SignupScreen
  - Style with modern, clean design using React Native Paper or custom components
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 5. Build Signup screen UI and functionality
  - Create `SignupScreen.tsx` in `src/screens/auth/` with email, password, and birth detail fields
  - Add input fields for birth date (date picker), birth time (time picker), and birth location (text input)
  - Implement form validation for all fields
  - Add signup button that creates account and stores birth data
  - Display validation errors appropriately
  - Add navigation link back to LoginScreen
  - _Requirements: 1.5, 1.6, 5.5_

- [x] 6. Set up navigation structure
  - Create `AuthStack` navigator in `src/navigation/AuthStack.tsx` with Login and Signup screens
  - Create `BottomTabNavigator` in `src/navigation/BottomTabs.tsx` with Home, Profile, and Settings tabs
  - Create root navigator in `src/navigation/RootNavigator.tsx` that switches between AuthStack and BottomTabs based on auth state
  - Configure tab icons and labels for bottom navigation
  - Integrate navigation with AuthContext to handle auth state changes
  - _Requirements: 2.3, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. Implement user profile service
  - Create `userService.ts` in `src/services/` with CRUD operations for user profiles
  - Implement `getUserProfile(userId)` to fetch profile from Supabase
  - Implement `createUserProfile(userId, profileData)` to create new profile
  - Implement `updateUserProfile(userId, profileData)` to update existing profile
  - Implement `deleteUserProfile(userId)` to delete profile
  - Add error handling for all service methods
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 8. Create astrology calculation utilities
  - Create `astrologyUtils.ts` in `src/utils/` with core calculation functions
  - Implement `calculateMoonSign(birthDate, birthTime, latitude, longitude)` function
  - Implement `calculateSunSign(birthDate)` function
  - Implement `calculateNakshatra(moonPosition)` function
  - Implement `calculateAscendant(birthDate, birthTime, latitude, longitude)` function
  - Implement `calculateMoonPosition()` for complete moon data
  - Use simplified Vedic astrology formulas based on "Astrology of the Seers" principles
  - Add helper functions for coordinate conversions and sidereal calculations
  - _Requirements: 3.3, 4.5, 7.5_

- [x] 9. Implement horoscope generation service
  - Create `horoscopeService.ts` in `src/services/` with horoscope generation logic
  - Implement `generateDailyHoroscope(userProfile, date)` function
  - Create template-based horoscope content with dynamic elements based on moon sign and transits
  - Add logic to incorporate "Astrology of the Seers" principles in readings
  - Implement basic transit calculations for current date using astrologyUtils
  - Add fallback content for edge cases
  - _Requirements: 3.2, 3.3, 3.4_

- [x] 10. Build Home screen with daily horoscope display
  - Update `HomeScreen.tsx` in `src/screens/main/` with horoscope display layout
  - Fetch user profile data on screen mount using userService
  - Display current date prominently
  - Call horoscope service to generate daily reading
  - Show loading indicator while generating horoscope
  - Display horoscope content in a card with modern styling
  - Handle empty state when user profile is incomplete with prompt to complete profile
  - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [x] 11. Create reusable UI components (OPTIONAL - components already inline in screens)
  - Extract `HoroscopeCard.tsx` component from HomeScreen for reusability
  - Extract `LoadingIndicator.tsx` component for loading states
  - Extract `EmptyState.tsx` component for empty/incomplete profile states
  - Note: This task is optional as components are already functional inline in screens
  - _Requirements: 3.4, 2.4_

- [x] 12. Build Profile screen with astrological information
  - Update `ProfileScreen.tsx` in `src/screens/main/` with complete profile layout
  - Fetch user profile data on screen mount using userService
  - Display user's moon sign prominently with description based on "Astrology of the Seers"
  - Display sun sign, ascendant, and nakshatra in organized sections
  - Show birth details (date, time, location) in a card
  - Add "Edit Profile" button to navigate to birth details form (Task 14)
  - Display loading indicator while fetching data
  - Handle empty state when profile is incomplete with prompt to add birth details
  - Style with cosmic theme matching HomeScreen design
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 13. Add birth chart visualization to Profile screen
  - Add a birth chart section to `ProfileScreen.tsx`
  - Display simplified birth chart in list format showing planetary positions
  - Show key chart elements: Sun, Moon, Ascendant positions in their signs
  - Display nakshatra information
  - Use card-based layout with cosmic theme (blues, purples, golds)
  - Note: Full chart wheel visualization can be added later as enhancement
  - _Requirements: 4.2_

- [x] 14. Create birth details form screen
  - Create `BirthDetailsFormScreen.tsx` in `src/screens/main/`
  - Add date picker for birth date using React Native DateTimePicker or similar
  - Add time picker for birth time
  - Add text input for birth location (city name)
  - Add numeric inputs for latitude and longitude (manual entry for MVP)
  - Add timezone input or auto-detect from location
  - Implement form validation for all required fields
  - Add save button that calculates astrological data and updates profile
  - Use astrologyUtils to calculate moon sign, sun sign, ascendant, and nakshatra on save
  - Call userService.updateUserProfile with all birth and calculated data
  - Show success message and navigate back to Profile screen on save
  - Handle errors gracefully with user-friendly messages
  - Style consistently with other screens
  - _Requirements: 4.5, 5.4, 7.5, 4.2, 4.3_

- [x] 15. Build Settings screen with logout functionality
  - Update `SettingsScreen.tsx` in `src/screens/main/` with complete settings layout
  - Create settings list with the following options:
    - "Edit Birth Details" button that navigates to BirthDetailsFormScreen
    - "Logout" button with confirmation dialog
  - Implement logout functionality that calls AuthContext.logout()
  - Ensure logout clears session and navigates to login screen
  - Display app version and about information at bottom
  - Add user email display at top of settings
  - Style with card-based layout matching other screens
  - Handle logout errors with user-friendly messages
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 16. Implement data persistence and caching
  - Add AsyncStorage caching for user profile data in userService
  - Cache profile data after fetching from Supabase
  - Load cached profile on app start for faster display
  - Cache today's horoscope with date key to avoid recalculation
  - Implement cache invalidation when profile is updated
  - Clear all cached data on logout in AuthContext
  - Add offline mode support - display cached data when network unavailable
  - _Requirements: 7.2, 7.3, 7.4_

- [x] 17. Enhance error handling and validation
  - Review and improve error handling in all service methods (already partially implemented)
  - Add network error detection with retry logic in services
  - Improve validation messages in BirthDetailsFormScreen
  - Add error boundary component to catch React errors gracefully
  - Ensure all async operations have proper loading and error states
  - Add timeout handling for long-running operations
  - _Requirements: 1.4, 1.6, 3.5_

- [x] 18. Integrate navigation with Expo Router
  - Update `app/_layout.tsx` to wrap app with AuthContext provider
  - Replace default Expo Router tabs with custom RootNavigator from src/navigation
  - Ensure auth state properly controls navigation between AuthStack and MainStack
  - Initialize Supabase client on app start
  - Add splash screen or loading state during auth initialization
  - Remove or repurpose default Expo Router screens in app/(tabs)
  - Test complete navigation flow: launch → login → main app → logout
  - _Requirements: 1.1, 1.7, 2.1, 2.2, 6.1, 6.2, 6.3_

- [x] 19. Final UI polish and consistency
  - Review all screens for consistent color scheme (cosmic theme: blues, purples, golds)
  - Ensure consistent spacing, padding, and typography across all screens
  - Add smooth transitions between screens
  - Verify rounded corners and shadows are consistent on all cards
  - Test responsive layout on different screen sizes
  - Add subtle animations for loading states and transitions
  - Ensure accessibility (readable text, proper contrast, touch targets)
  - _Requirements: 2.4_
