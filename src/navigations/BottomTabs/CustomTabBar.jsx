import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { COLORS } from '../../utils/colors';

// Import your image assets
const icons = {
  Home: {
    light: require('../../assets/Images/homeLight.png'), // Replace with your light image path
    dark: require('../../assets/Images/homeDark.png'), // Replace with your dark image path
  },
  History: {
    light: require('../../assets/Images/historyLight.png'),
    dark: require('../../assets/Images/historyDark.png'),
  },
  Profile: {
    light: require('../../assets/Images/userLight.png'),
    dark: require('../../assets/Images/userDark.png'),
  },
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconSource = isFocused
          ? icons[route.name].dark
          : icons[route.name].light;

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.tabItem}
          >
            {isFocused ? (
              <View style={styles.selectedTabBackground}>
                <Image source={iconSource} style={styles.icon} />
                <Text style={styles.tabLabel}>{route.name}</Text>
              </View>
            ) : (
              <Image source={iconSource} style={styles.icon} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: 7,
    left: 0,
    right: 0,
    marginHorizontal: 19,
    borderRadius: 10,
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTabBackground: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  tabLabel: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: 'Asap-Medium',
    color: COLORS.primary, // Text color for the focused tab
  },
});

export default CustomTabBar;
