import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export default function Loader() {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator animating={true} color="#07294D" size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHT,
    width: WIDTH,
  },
});
