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

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.notification}
          onPress={() => navigation.navigate('WebNotificationScreen')}
        >
          <Image
            source={require('../assets/Images/mail.png')}
            style={styles.bellIcon}
          />
          {/* {count = 9} */}
          {console.log('Notification Count:', count)}
          {count > 0 && (
           <View style={styles.badge}>
              <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    backgroundColor: '#07294D',
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1.4%'),
    position: 'relative',
  },
  webNotification: {
    marginRight: 8,
  },
  bellIcon: {
    width: 20,
    height: 20,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Asap-Medium',
  },
});
