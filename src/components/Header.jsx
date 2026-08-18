import { StyleSheet, Text, View, TouchableOpacity, Image, Switch } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

export default function Header({ title, suggestion = null, setSuggestions = null }) {
  const navigation = useNavigation();
  return (
    <View
      style={{
        paddingTop: hp('6%'),
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
      {suggestion!=null && setSuggestions &&<View style={styles.suggestionContainer}>
        <Text style={[styles.sugtxt]}>Sugesstion{' '}</Text>
        <Switch style={styles.SugSwitch} value={suggestion} onValueChange={setSuggestions} />
      </View>}
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
  suggestionContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    fontFamily: 'Asap-SemiBold',
    alignItems: 'center',
  },
  sugtxt:{
    fontSize: 16,
    color: '#07294D',
    fontFamily: 'Asap-Regular',
  },
  SugSwitch: {
    height: 30,
    width: 40,
  },
  title: {
    fontSize: 32,
    color: '#07294D',
    fontFamily: 'Asap-SemiBold',
    marginBottom: hp('2.5%'),
    alignSelf: 'center',
  },
});
