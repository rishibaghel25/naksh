# Navigation Integration with Expo Router

## Overview

This document explains how the custom React Navigation structure is integrated with Expo Router in the NAKSH astrology app.

## Architecture

The app uses a hybrid approach:
- **Expo Router** manages the root app layout and initialization
- **React Navigation** handles the actual navigation between screens

## Structure

```
app/_layout.tsx (Expo Router Root)
  └─ AuthProvider (Context)
      └─ RootNavigator (React Navigation)
          ├─ AuthStack (Not authenticated)
          │   ├─ LoginScreen
          │   └─ SignupScreen
          └─ MainStack (Authenticated)
              └─ BottomTabNavigator
                  ├─ HomeScreen
                  ├─ ProfileScreen
                  └─ SettingsScreen
```

## Key Components

### 1. app/_layout.tsx
- Entry point for the app
- Wraps the app with `AuthProvider`
- Initializes Supabase on app start
- Shows splash screen during initialization
- Renders `RootNavigator` once initialized

### 2. RootNavigator
- Uses `NavigationContainer` from React Navigation
- Switches between `AuthStack` and `MainStack` based on auth state
- Shows loading indicator while checking auth state

### 3. AuthStack
- Contains Login and Signup screens
- Shown when user is not authenticated
- No headers for clean auth experience

### 4. MainStack
- Contains BottomTabNavigator and other main app screens
- Shown when user is authenticated
- Includes BirthDetailsForm as a modal screen

### 5. BottomTabNavigator
- Three tabs: Home, Profile, Settings
- Custom icons and styling
- Purple theme (#6B46C1) matching app design

## Navigation Flow

### App Launch
1. App starts → `app/_layout.tsx` loads
2. Supabase initializes
3. Splash screen shows briefly
4. `AuthProvider` checks for existing session
5. `RootNavigator` renders based on auth state

### Login Flow
1. User on LoginScreen
2. Enters credentials
3. AuthContext.login() called
4. On success, auth state updates
5. RootNavigator automatically switches to MainStack
6. User sees HomeScreen (default tab)

### Logout Flow
1. User on SettingsScreen
2. Taps logout button
3. AuthContext.logout() called
4. Session cleared, cache cleared
5. Auth state updates to null
6. RootNavigator automatically switches to AuthStack
7. User sees LoginScreen

## Benefits of This Approach

1. **Clean Separation**: Auth logic separate from navigation
2. **Automatic Switching**: Navigation responds to auth state changes
3. **Type Safety**: TypeScript types for all navigation params
4. **Flexibility**: Easy to add new screens or modify navigation
5. **Expo Router Compatible**: Works seamlessly with Expo's file-based routing

## Testing the Navigation

To test the complete navigation flow:

```bash
# Start the app
npm start

# Then press:
# - 'a' for Android
# - 'i' for iOS
# - 'w' for web
```

### Test Scenarios

1. **Fresh Install**
   - Should show LoginScreen
   - Can navigate to SignupScreen
   - After signup, should show HomeScreen

2. **Returning User**
   - Should show HomeScreen directly (session persisted)
   - Can navigate between tabs
   - Can logout and return to LoginScreen

3. **Session Expiry**
   - If session expires, should automatically redirect to LoginScreen

## Files Modified

- `app/_layout.tsx` - Updated to use AuthProvider and RootNavigator
- `src/navigation/RootNavigator.tsx` - Added NavigationContainer
- `src/services/authService.ts` - Added error utility imports
- `src/services/userService.ts` - Added error utility imports
- `src/screens/auth/LoginScreen.tsx` - Added validation utility imports
- `src/screens/auth/SignupScreen.tsx` - Added validation utility imports

## Files Removed

- `app/(tabs)/_layout.tsx` - Replaced by custom BottomTabNavigator
- `app/(tabs)/index.tsx` - Replaced by custom HomeScreen
- `app/(tabs)/explore.tsx` - Not needed for astrology app
- `app/modal.tsx` - Not needed for astrology app

## Environment Variables

Ensure `.env` file contains:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Troubleshooting

### Issue: App shows blank screen
- Check if Supabase credentials are configured in `.env`
- Check console for initialization errors

### Issue: Navigation not switching after login
- Verify AuthContext is properly updating user state
- Check if RootNavigator is receiving auth state updates

### Issue: TypeScript errors
- Run `npx tsc --noEmit` to check for type errors
- Ensure all navigation param types are defined

## Next Steps

With navigation integrated, you can now:
1. Test the complete user flow
2. Add more screens as needed
3. Implement deep linking (optional)
4. Add push notifications (optional)
