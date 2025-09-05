import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React from 'react';

const { width, height } = Dimensions.get('window');

const background = require('../../assets/Images/groupBackground.png');
export default function ImagesSection({ illustration }) {
  return (
    <View style={styles.phoneContainer}>
      <Image source={background} style={styles.phoneFrame} />
      <View style={styles.phoneContent}>
        <Image source={illustration} style={styles.illustration} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phoneContainer: {
    width: width * 0.8,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: 10,
  },
  phoneFrame: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  phoneContent: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: height * 0.6,
    resizeMode: 'contain',
  },
});
