import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const Splash = ({ navigation }) => {
  useEffect(() => {
    // Set a timer to navigate after 3 seconds
    const timer = setTimeout(() => {
      // Replace 'Onboarding' with your actual onboarding screen name
      navigation.navigate('Onboarding');
    }, 2000);

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#07294D', '#3E3F95', '#105FB3']}
        style={styles.gradient}
      >
        {/* Top-right corner PNG */}
        <Image
          source={require('../../assets/Images/topRightCurve.png')}
          style={styles.topRight}
        />

        {/* Bottom-left corner PNG */}
        <Image
          source={require('../../assets/Images/bottomLeftCurve.png')}
          style={styles.bottomLeft}
          // resizeMode="contain"
        />

        {/* Center Logo */}
        <Image
          source={require('../../assets/Images/lges-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </LinearGradient>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  logo: {
    width: 200,
    height: 200,
  },
});
