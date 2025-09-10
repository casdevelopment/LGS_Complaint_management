import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../utils/colors';

const ProfileMenuItem = ({ iconName, title, onPress }) => {
  const icons = {
    bell: require('../assets/Images/notifiBell.png'),
    lock: require('../assets/Images/unlock.png'),
  };
  return (
    <TouchableOpacity style={styles.menuItemContainer} onPress={onPress}>
      <View style={styles.leftContent}>
        <Image
          source={icons[iconName]} // dynamic image
          style={styles.menuIcon}
        />

        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      <Image
        source={require('../assets/Images/forwardArrow.png')}
        //   style={styles.menuIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 13,
    color: COLORS.black,
    fontFamily: 'Asap-Regular',
  },
});

export default ProfileMenuItem;
