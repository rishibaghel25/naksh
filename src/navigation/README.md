# Navigation Structure

This directory contains the navigation setup for the NAKSH Astrology App.

## Overview

The app uses React Navigation with a combination of Stack and Bottom Tab navigators to provide a seamless user experience.

## Structure

### RootNavigator (`RootNavigator.tsx`)
The root navigator that switches between authenticated and unauthenticated states:
- Shows a loading indicator while checking authentication state
- Renders `AuthStack` when user is not authenticated
- Renders `BottomTabNavigator` when user is authenticated
- Integrates with `AuthContext` to respond to auth state changes

### AuthStack (`AuthStack.tsx`)
Stack navigator for authentication screens:
- **LoginScreen**: Email/password login
- **SignupScreen**: User registration with birth details
- Uses native stack navigator with slide animations
- No header shown for cleaner auth experience

### BottomTabNavigator (`BottomTabs.tsx`)
Bottom tab navigator for main app screens:
- **Home Tab**: Daily horoscope display
- **Profile Tab**: User astrological profile and birth chart
- **Settings Tab**: App settings and preferences

#### Tab Configuration
- **Icons**: Uses Ionicons with filled/outline variants for active/inactive states
- **Colors**: 
  - Active: `#6B46C1` (purple)
  - Inactive: `#9CA3AF` (gray)
- **Header**: Purple background with white text
- **Tab Bar**: White background with subtle border

## Usage

### In App.tsx or Main Entry Point

```tsx
import { AuthProvider } from './src/contexts/AuthContext';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
```

### Navigation Between Screens

#### From Login to Signup
```tsx
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const navigation = useNavigation<NavigationProp>();
navigation.navigate('Signup');
```

#### Between Bottom Tabs
```tsx
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabsParamList } from '../navigation';

type NavigationProp = BottomTabNavigationProp<BottomTabsParamList, 'Home'>;

const navigation = useNavigation<NavigationProp>();
navigation.navigate('Profile');
```

## Type Safety

All navigation routes are typed using TypeScript:

```tsx
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type BottomTabsParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};
```

## Authentication Flow

1. App launches → `RootNavigator` checks auth state via `useAuth()`
2. If `loading === true` → Show loading indicator
3. If `user === null` → Show `AuthStack` (Login/Signup)
4. If `user !== null` → Show `BottomTabNavigator` (Home/Profile/Settings)
5. On logout → Auth state changes → Automatically switches back to `AuthStack`

## Design Principles

- **Cosmic Theme**: Purple (`#6B46C1`) as primary color
- **Clean UI**: Modern, minimalist design with ample spacing
- **Smooth Transitions**: Native animations for better UX
- **Responsive**: Works across different screen sizes
- **Accessible**: Clear labels and proper contrast ratios

## Requirements Satisfied

- **Requirement 2.3**: React Navigation with bottom tab navigation ✓
- **Requirement 6.1**: Bottom navigation bar when authenticated ✓
- **Requirement 6.2**: Three tabs (Home, Profile, Settings) ✓
- **Requirement 6.3**: Tab navigation functionality ✓
- **Requirement 6.4**: Active tab highlighting ✓
- **Requirement 6.5**: Modern, intuitive icons ✓
