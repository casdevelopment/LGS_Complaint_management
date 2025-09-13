import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useSelector } from 'react-redux';

export default function Routes() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
      {/* <AuthStack /> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
