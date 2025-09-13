import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNav from './BottomTabs/BottomTabNav';
import UpdateProfile from '../screens/Profile/UpdateProfile';
import AccountScreen from '../screens/Profile/AccountScreen';
import UpdatePassword from '../screens/Profile/UpdatePassword';
import NotificationScreen from '../screens/Profile/NotificationScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={BottomTabNav} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
    </Stack.Navigator>
  );
}
