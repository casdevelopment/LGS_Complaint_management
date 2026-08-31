import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
<<<<<<< HEAD
import AppStack from './AppStack';
import { useSelector } from 'react-redux';

export default function Routes() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
=======

export default function Routes() {
  return (
    <NavigationContainer>
      <AuthStack />
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
