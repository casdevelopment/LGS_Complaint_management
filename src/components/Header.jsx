import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

export default function Header({ title }) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        paddingTop: hp('10%'),
      }}
    >
      <TouchableOpacity
        style={styles.topLeft}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require('../assets/Images/turn-back.png')}
          //style={styles.topLeft}
          resizeMode="stretch"
        />
      </TouchableOpacity>

      <Image
        source={require('../assets/Images/topRightDarkCurve.png')}
        style={styles.topRight}
        resizeMode="stretch"
      />

      {/* Title */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  topLeft: {
    position: 'absolute',
    top: 45,
    left: 25,
  },
  title: {
    fontSize: 32,
    color: '#07294D',
    fontFamily: 'Asap-SemiBold',
    marginBottom: hp('2.5%'),
    alignSelf: 'center',
  },
});
