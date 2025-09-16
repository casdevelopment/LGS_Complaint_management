// components/Header.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const HomeHeader = ({
  navigation,
  userName = 'Ahmed Hassan',
  userClass = 'Class VII B',
  count,
}) => {
  return (
    <View style={styles.header}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={require('../assets/Images/profile-picture.png')}
          style={styles.avatar}
        />
        <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userClass}>{userClass}</Text>
        </TouchableOpacity>
      </View>

      {/* Notification */}
      <TouchableOpacity
        style={styles.notification}
        onPress={() => navigation.navigate('NotificationScreen')}
      >
        <Image
          source={require('../assets/Images/mail.png')}
          style={styles.bellIcon}
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count ?? 0}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    marginTop: hp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Asap-Medium',
    color: '#07294D',
  },
  userClass: {
    fontSize: 12,
    color: '#07294D',
    fontFamily: 'Asap-Light',
  },
  notification: {
    flexDirection: 'row',
    backgroundColor: '#07294D',
    width: wp('15%'),
    paddingHorizontal: wp('2%'),
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1.4%'),
  },
  bellIcon: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
  badge: {},
  badgeText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Asap-Medium',
  },
});
