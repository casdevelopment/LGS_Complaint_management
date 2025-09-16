import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomTabNav from './BottomTabs/BottomTabNav';
import UpdateProfile from '../screens/Profile/UpdateProfile';
import AccountScreen from '../screens/Profile/AccountScreen';
import UpdatePassword from '../screens/Profile/UpdatePassword';
import NotificationScreen from '../screens/Profile/NotificationScreen';
import CategoryScreen from '../screens/Complain/CategoryScreen';
import CampusScreen from '../screens/Complain/CampusScreen';
import ComplainForm from '../screens/Complain/ComplainForm';
import ClosedComplain from '../screens/Complain/ClosedComplain';
import DroppedComplain from '../screens/Complain/DroppedComplain';
import AttendedScreen from '../screens/Complain/AttendedScreen';
import UnattendedScreen from '../screens/Complain/UnattendedScreen';
import OpenedComplain from '../screens/Complain/OpenedComplain';
import ImplementedComplain from '../screens/Complain/ImplementedComplain';
import AcknowledgeComplain from '../screens/Complain/AcknowledgeComplain';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <BottomSheetModalProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={BottomTabNav} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
        <Stack.Screen name="CampusScreen" component={CampusScreen} />
        <Stack.Screen name="ComplainForm" component={ComplainForm} />
        <Stack.Screen name="ClosedComplain" component={ClosedComplain} />
        <Stack.Screen name="DroppedComplain" component={DroppedComplain} />
        <Stack.Screen name="AttendedScreen" component={AttendedScreen} />
        <Stack.Screen name="UnattendedScreen" component={UnattendedScreen} />
        <Stack.Screen name="OpenedComplain" component={OpenedComplain} />
        <Stack.Screen
          name="ImplementedComplain"
          component={ImplementedComplain}
        />
        <Stack.Screen
          name="AcknowledgeComplain"
          component={AcknowledgeComplain}
        />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
}
