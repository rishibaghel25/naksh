# Authentication Context

## Overview

The AuthContext provides a centralized authentication state management solution for the NAKSH astrology app. It wraps the Supabase authentication service and provides a clean React API for components to interact with authentication.

## Usage

### 1. Wrap your app with AuthProvider

```typescript
import { AuthProvider } from './src/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### 2. Use the useAuth hook in components

```typescript
import { useAuth } from './src/contexts/AuthContext';

function LoginScreen() {
  const { login, loading, error, clearError } = useAuth();

  const handleLogin = async () => {
    const success = await login({
      email: 'user@example.com',
      password: 'password123',
    });

    if (success) {
      // Navigate to home screen
    }
  };

  return (
    <View>
      {error && <Text>{error}</Text>}
      <Button title="Login" onPress={handleLogin} disabled={loading} />
    </View>
  );
}
```

## API Reference

### AuthContext Value

The context provides the following values:

```typescript
interface AuthContextType {
  user: User | null;              // Current authenticated user
  session: Session | null;        // Current session
  loading: boolean;               // Loading state for auth operations
  error: string | null;           // Error message if any
  login: (data: LoginData) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}
```

### Methods

#### login(data: LoginData)

Authenticates a user with email and password.

**Parameters:**
- `data.email` (string) - User's email address
- `data.password` (string) - User's password

**Returns:** `Promise<boolean>` - True if login successful, false otherwise

**Example:**
```typescript
const success = await login({
  email: 'user@example.com',
  password: 'password123',
});
```

#### signup(data: SignupData)

Creates a new user account.

**Parameters:**
- `data.email` (string) - User's email address
- `data.password` (string) - User's password
- `data.birthDate` (string, optional) - Birth date in YYYY-MM-DD format
- `data.birthTime` (string, optional) - Birth time in HH:MM:SS format
- `data.birthLocation` (string, optional) - Birth location

**Returns:** `Promise<boolean>` - True if signup successful, false otherwise

**Example:**
```typescript
const success = await signup({
  email: 'newuser@example.com',
  password: 'password123',
  birthDate: '1990-01-01',
  birthTime: '12:00:00',
  birthLocation: 'New York',
});
```

#### logout()

Signs out the current user and clears the session.

**Returns:** `Promise<void>`

**Throws:** Error if logout fails

**Example:**
```typescript
try {
  await logout();
  // Navigate to login screen
} catch (error) {
  console.error('Logout failed:', error);
}
```

#### clearError()

Clears the current error message.

**Example:**
```typescript
clearError();
```

## Features

### Session Persistence

The authentication state is automatically persisted using AsyncStorage through the Supabase client. This means:

- Users remain logged in across app restarts
- Sessions are automatically restored on app launch
- No need to manually handle session storage

### Auth State Changes

The context automatically listens to authentication state changes and updates the UI accordingly:

- User logs in → context updates with user and session
- User logs out → context clears user and session
- Session expires → context updates automatically

### Loading States

The `loading` state is managed automatically during:

- Initial auth state check on app launch
- Login operations
- Signup operations
- Logout operations

### Error Handling

Errors are captured and exposed through the `error` state:

- Invalid credentials
- Network errors
- Supabase errors
- General exceptions

Use `clearError()` to dismiss error messages after displaying them to the user.

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 1.3**: User authentication via Supabase
- **Requirement 1.5**: User signup with account creation
- **Requirement 1.7**: Session persistence across app launches

## Implementation Details

### State Management

The context uses React's `useState` and `useEffect` hooks to manage:

- User object from Supabase
- Session object from Supabase
- Loading state for async operations
- Error messages

### Initialization

On mount, the context:

1. Retrieves any existing session from AsyncStorage
2. Sets up an auth state change listener
3. Updates the UI based on the current auth state

### Cleanup

On unmount, the context:

1. Unsubscribes from the auth state change listener
2. Prevents memory leaks

## Error Handling

The useAuth hook includes a safety check:

```typescript
if (context === undefined) {
  throw new Error('useAuth must be used within an AuthProvider');
}
```

This ensures developers don't accidentally use the hook outside of the AuthProvider.

## Next Steps

After implementing the authentication context, you can:

1. Create login and signup screens that use the `useAuth` hook
2. Implement protected routes that check the `user` state
3. Add password reset functionality
4. Add email verification
5. Add social authentication providers
