import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Routes from './src/navigations/Routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView>
      <Routes />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
