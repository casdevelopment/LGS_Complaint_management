import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/Home/HomeScreen';
import HistoryScreen from '../../screens/History/HistoryScreen';
import AccountScreen from '../../screens/Profile/AccountScreen';
import { useSelector } from 'react-redux';
import AdminCampusScreen from '../../screens/Complain/AdminCampusScreen';

import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();

function BottomTabNav() {
  const user = useSelector(state => state.auth.user);
  console.log(user?.role, 'roleeeeeee');
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          //   backgroundColor: 'red', // set your desired color
        },
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {user?.role === 'oic' || user?.role === 'employee' ? (
        <Tab.Screen name="History" component={AdminCampusScreen} />
      ) : (
        <Tab.Screen name="History" component={HistoryScreen} />
      )}
      <Tab.Screen name="Profile" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default BottomTabNav;
