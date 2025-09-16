import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useSelector } from 'react-redux';
import NotificationService from '../utils/NotificationService';

export default function Routes() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
      {/* <NotificationService /> */}
      {/* <AuthStack /> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
