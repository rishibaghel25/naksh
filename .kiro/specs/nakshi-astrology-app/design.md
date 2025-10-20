# Design Document - NAKSH Astrology App

## Overview

NAKSH is a React Native mobile application that provides personalized Vedic astrology insights. The app uses Supabase for backend services (authentication, database) and implements astrological calculations based on "Astrology of the Seers" principles. The architecture follows a clean, modular approach with clear separation between UI, business logic, and data layers.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│         React Native App                │
│  ┌───────────────────────────────────┐  │
│  │     Navigation Layer              │  │
│  │  (React Navigation - Stack/Tabs)  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │        Screen Components          │  │
│  │  - Auth (Login/Signup)            │  │
│  │  - Home (Horoscope)               │  │
│  │  - Profile (Chart/Moon Sign)      │  │
│  │  - Settings                       │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Business Logic Layer         │  │
│  │  - Astrology Calculations         │  │
│  │  - Horoscope Generator            │  │
│  │  - Chart Calculator               │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │       Services Layer              │  │
│  │  - Auth Service (Supabase)        │  │
│  │  - User Service (CRUD)            │  │
│  │  - Horoscope Service              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Supabase Backend    │
        │  - Authentication     │
        │  - PostgreSQL DB      │
        │  - Row Level Security │
        └───────────────────────┘
```

### Technology Stack

- **Frontend Framework**: React Native (Expo or React Native CLI)
- **Navigation**: React Navigation v6 (Stack + Bottom Tabs)
- **Backend**: Supabase (Auth + Database)
- **State Management**: React Context API / React Query for server state
- **UI Components**: React Native Paper or custom components
- **Astrology Calculations**: Custom JavaScript library based on Swiss Ephemeris or similar
- **Date/Time**: date-fns or moment.js for date handling
- **Storage**: AsyncStorage for local persistence

## Components and Interfaces

### 1. Authentication Flow

**Components:**
- `LoginScreen`: Email/password login form
- `SignupScreen`: Registration form with birth details
- `AuthContext`: Manages authentication state globally

**Flow:**
```
App Launch → Check Auth State
  ├─ Not Authenticated → LoginScreen
  │   ├─ Login Success → MainApp (Bottom Tabs)
  │   └─ Navigate to SignupScreen
  │       └─ Signup Success → MainApp
  └─ Authenticated → MainApp (Bottom Tabs)
```

### 2. Main Application (Bottom Tabs)

**Components:**
- `BottomTabNavigator`: Container for three tabs
  - `HomeScreen`: Daily horoscope display
  - `ProfileScreen`: User astrological profile
  - `SettingsScreen`: App settings and preferences

### 3. Home Screen Components

**Components:**
- `HoroscopeCard`: Displays daily horoscope content
- `DateDisplay`: Shows current date
- `LoadingIndicator`: Loading state during calculation
- `EmptyState`: Prompts user to complete profile if birth data missing

**Data Flow:**
```
HomeScreen Mount
  → Fetch User Birth Data
  → Calculate Daily Horoscope
    → Get Current Planetary Positions
    → Apply "Astrology of the Seers" principles
    → Generate Personalized Reading
  → Display Horoscope
```

### 4. Profile Screen Components

**Components:**
- `ChartVisualization`: Birth chart display (simplified wheel or list)
- `MoonSignCard`: Moon sign with description
- `BirthDetailsForm`: Edit birth information
- `AstrologicalInfo`: Additional chart details (ascendant, planets, etc.)

### 5. Settings Screen Components

**Components:**
- `SettingsList`: List of settings options
- `LogoutButton`: Sign out functionality
- `ProfileEditLink`: Navigate to edit birth details
- `AppInfo`: Version and about information

## Data Models

### User Profile Schema (Supabase)

```typescript
interface UserProfile {
  id: string;                    // UUID, references auth.users
  email: string;
  created_at: timestamp;
  updated_at: timestamp;
  
  // Birth Information
  birth_date: date;              // YYYY-MM-DD
  birth_time: time;              // HH:MM:SS
  birth_location: string;        // City name
  birth_latitude: number;        // Decimal degrees
  birth_longitude: number;       // Decimal degrees
  birth_timezone: string;        // IANA timezone
  
  // Calculated Astrological Data
  moon_sign: string;             // Vedic moon sign (Rashi)
  sun_sign: string;              // Vedic sun sign
  ascendant: string;             // Rising sign (Lagna)
  nakshatra: string;             // Birth star
  
  // Chart Data (JSON)
  birth_chart: json;             // Complete chart data
}
```

### Horoscope Cache Schema (Optional)

```typescript
interface HoroscopeCache {
  id: string;
  user_id: string;               // References user_profile
  date: date;                    // Date of horoscope
  content: text;                 // Generated horoscope text
  created_at: timestamp;
}
```

### Database Setup

**Tables:**
1. `user_profiles` - Stores user birth and astrological data
2. `horoscope_cache` (optional) - Caches generated horoscopes

**Row Level Security (RLS):**
- Users can only read/write their own profile data
- Horoscope cache accessible only to the owner

## Astrology Calculation Engine

### Core Calculations

Based on "Astrology of the Seers" principles:

1. **Birth Chart Calculation**
   - Convert birth time to UTC
   - Calculate planetary positions using ephemeris data
   - Determine house cusps (Whole Sign or Placidus system)
   - Calculate Vedic positions (sidereal zodiac with Lahiri ayanamsa)

2. **Moon Sign Determination**
   - Calculate Moon's position at birth
   - Determine which Rashi (sign) the Moon occupies
   - Identify Nakshatra (lunar mansion)

3. **Daily Horoscope Generation**
   - Get current planetary transits
   - Compare transits to natal chart
   - Apply Vedic astrology principles:
     - Dasha system (planetary periods)
     - Transit effects on natal Moon
     - Yogas and combinations
   - Generate personalized reading

### Astrology Service Interface

```typescript
interface AstrologyService {
  calculateBirthChart(birthData: BirthData): BirthChart;
  getMoonSign(birthChart: BirthChart): string;
  getNakshatra(birthChart: BirthChart): string;
  generateDailyHoroscope(birthChart: BirthChart, date: Date): string;
  getCurrentTransits(date: Date): PlanetaryPositions;
}
```

### Implementation Approach

For MVP, we'll use:
- Pre-calculated ephemeris data or a JavaScript astronomy library
- Simplified Vedic calculations
- Template-based horoscope generation with dynamic elements
- Future: Integrate with Swiss Ephemeris or similar for precise calculations

## Navigation Structure

```
AuthStack (if not authenticated)
  ├─ LoginScreen
  └─ SignupScreen

MainStack (if authenticated)
  └─ BottomTabs
      ├─ HomeTab → HomeScreen
      ├─ ProfileTab → ProfileScreen
      └─ SettingsTab → SettingsScreen
```

## Error Handling

### Authentication Errors
- Invalid credentials → Display error message
- Network errors → Retry mechanism with user feedback
- Session expiry → Redirect to login

### Data Errors
- Missing birth data → Prompt user to complete profile
- Invalid birth data → Validation messages
- Calculation errors → Fallback to generic content

### Network Errors
- Offline mode → Display cached data if available
- Supabase connection issues → Retry with exponential backoff
- Timeout handling → User-friendly error messages

## Testing Strategy

### Unit Tests
- Astrology calculation functions
- Date/time conversion utilities
- Data validation logic
- Service layer methods

### Integration Tests
- Supabase authentication flow
- User profile CRUD operations
- Horoscope generation pipeline
- Navigation flows

### Component Tests
- Screen rendering with different states
- Form validation
- User interactions (button clicks, navigation)
- Loading and error states

### End-to-End Tests (Optional)
- Complete user journey: signup → login → view horoscope
- Profile update flow
- Logout and re-login

## UI/UX Design Principles

### Modern, Clean Interface
- Minimalist design with ample white space
- Soft color palette inspired by cosmic themes (deep blues, purples, golds)
- Clear typography with good readability
- Smooth animations and transitions

### Component Styling
- Consistent spacing and padding
- Rounded corners for cards and buttons
- Subtle shadows for depth
- Responsive layout for different screen sizes

### User Experience
- Fast loading with skeleton screens
- Clear feedback for all actions
- Intuitive navigation
- Helpful empty states and onboarding

## Security Considerations

1. **Authentication**
   - Use Supabase Auth with secure token management
   - Implement proper session handling
   - Secure storage of tokens using secure storage solutions

2. **Data Privacy**
   - Row Level Security on all database tables
   - No exposure of other users' data
   - Secure API calls with authentication headers

3. **Input Validation**
   - Validate all user inputs on client and server
   - Sanitize data before storage
   - Prevent injection attacks

## Performance Optimization

1. **Lazy Loading**
   - Load screens on demand
   - Defer heavy calculations until needed

2. **Caching**
   - Cache horoscope data for the current day
   - Store user profile locally for offline access
   - Use React Query for intelligent data caching

3. **Optimization**
   - Minimize re-renders with React.memo
   - Optimize images and assets
   - Use FlatList for any scrollable lists

## Future Enhancements

- Push notifications for daily horoscope
- Compatibility analysis between users
- Detailed transit predictions
- Remedies and recommendations
- Multiple language support
- Dark mode
- Widget for home screen
