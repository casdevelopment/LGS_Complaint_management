import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Auth/Splash';
import Onboarding from '../screens/Auth/Onboarding';
import Login from '../screens/Auth/Login';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import OTPVerification from '../screens/Auth/OTPVerification';
import NewPassword from '../screens/Auth/NewPassword';
import Signup from '../screens/Auth/Signup';
import HomeScreen from '../screens/Home/HomeScreen';
import RoleSelectionScreen from '../screens/Auth/RoleSelectionScreen';
import CategoryScreen from '../screens/Complain/CategoryScreen';
import CampusScreen from '../screens/Complain/CampusScreen';
import ComplainForm from '../screens/Complain/ComplainForm';
import ClosedComplain from '../screens/Complain/ClosedComplain';
import DroppedComplain from '../screens/Complain/DroppedComplain';
import AccountScreen from '../screens/Profile/AccountScreen';
import UpdatePassword from '../screens/Profile/UpdatePassword';
import BottomTabNav from './BottomTabs/BottomTabNav';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import NotificationScreen from '../screens/Profile/NotificationScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <BottomSheetModalProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="NewPassword" component={NewPassword} />
        <Stack.Screen name="Signup" component={Signup} />
        {/* <Stack.Screen name="HomeScreen" component={BottomTabNav} /> */}
        <Stack.Screen
          name="RoleSelectionScreen"
          component={RoleSelectionScreen}
        />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="CampusScreen" component={CampusScreen} />
        <Stack.Screen name="ComplainForm" component={ComplainForm} />
        <Stack.Screen name="ClosedComplain" component={ClosedComplain} />
        <Stack.Screen name="DroppedComplain" component={DroppedComplain} />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
}
