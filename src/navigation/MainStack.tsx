import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BirthDetailsFormScreen from '../screens/main/BirthDetailsFormScreen';
import { BottomTabNavigator } from './BottomTabs';

export type MainStackParamList = {
  MainTabs: undefined;
  BirthDetailsForm: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BirthDetailsForm"
        component={BirthDetailsFormScreen}
        options={{
          title: 'Birth Details',
          headerStyle: {
            backgroundColor: '#6B46C1',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};
