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
import SubCategoryScreen from '../screens/Complain/SubCategoryScreen';
import AdminClassScreen from '../screens/Complain/AdminClassScreen';
import ClassComplains from '../screens/Complain/ClassComplains';
import StudentScreen from '../screens/Student/StudentScreen';
import AdminOpenComplaints from '../screens/Complain/AdminOpenComplaints';
import AdminDropComplaints from '../screens/Complain/AdminDropComplaints';
import { useSelector } from 'react-redux';
import AdminClosedComplaint from '../screens/Complain/AdminClosedComplaint';
import AdminImplementedComplaints from '../screens/Complain/AdminImplementedComplaints';
import AdminAcknowledgeComplaints from '../screens/Complain/AdminAcknowledgeComplaints';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  const user = useSelector(state => state.auth.user);
  const initialRoute = user?.role === 'parent' ? 'StudentScreen' : 'HomeScreen';
  return (
    <BottomSheetModalProvider>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="StudentScreen" component={StudentScreen} />
        <Stack.Screen name="HomeScreen" component={BottomTabNav} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="SubCategoryScreen" component={SubCategoryScreen} />
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
          name="AdminOpenComplaints"
          component={AdminOpenComplaints}
        />
        <Stack.Screen
          name="AdminDropComplaints"
          component={AdminDropComplaints}
        />
        <Stack.Screen
          name="AdminClosedComplaint"
          component={AdminClosedComplaint}
        />
        <Stack.Screen
          name="AdminImplementedComplaints"
          component={AdminImplementedComplaints}
        />
        <Stack.Screen
          name="AdminAcknowledgeComplaints"
          component={AdminAcknowledgeComplaints}
        />
        <Stack.Screen
          name="ImplementedComplain"
          component={ImplementedComplain}
        />
        <Stack.Screen
          name="AcknowledgeComplain"
          component={AcknowledgeComplain}
        />
        <Stack.Screen name="AdminClassScreen" component={AdminClassScreen} />
        <Stack.Screen name="ClassComplains" component={ClassComplains} />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
}
