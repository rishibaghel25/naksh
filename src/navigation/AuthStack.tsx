import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LocationPickerScreen from '../screens/auth/LocationPickerScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  LocationPicker: {
    onLocationSelect: (location: {
      address: string;
      latitude: number;
      longitude: number;
    }) => void;
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen
        name="LocationPicker"
        component={LocationPickerScreen}
        options={{
          headerShown: true,
          title: 'Select Birth Location',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};
