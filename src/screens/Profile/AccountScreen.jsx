import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import ProfileMenuItem from '../../components/ProfileMenuItem';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS } from '../../utils/colors';
import { logout, resetAuth } from '../../Redux/slices/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      Alert.alert(
        'Logout',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            onPress: async () => {
              // 2. Remove token from AsyncStorage
              await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);

              // 3. Dispatch Redux logout action
              dispatch(logout());
              dispatch(resetAuth());
            },
          },
        ],
        { cancelable: true },
      );
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Logout Failed', 'Something went wrong. Please try again.');
    }
  };
  return (
    <View style={styles.container}>
      <Header title="My Account" />
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              user?.profilePic
                ? { uri: user.profilePic } // base64 or remote image
                : require('../../assets/Images/profile-picture.png') // fallback dummy
            }
            style={styles.profileImage}
          />

          <TouchableOpacity style={styles.editImageButton}>
            <Image source={require('../../assets/Images/edit-line.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <Text style={styles.profilePhone}>📞 {user?.phone}</Text>
          <Text style={styles.profileCollege}>{user?.campus}</Text>
          <Text style={styles.profileClass}>{user?.campusclass}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('UpdateProfile')}
          style={styles.editProfileButton}
        >
          <Image source={require('../../assets/Images/edit-line.png')} />
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <ProfileMenuItem
          iconName="bell"
          title="Notification & Offer"
          onPress={() => navigation.navigate('NotificationScreen')}
        />
        <ProfileMenuItem
          iconName="lock"
          title="Update Password"
          onPress={() => navigation.navigate('UpdatePassword')}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.logoutButton,
          { position: 'absolute', bottom: 100, left: 10 },
        ]}
        onPress={handleLogout}
      >
        <Image
          style={styles.logoutIcon}
          source={require('../../assets/Images/out.png')}
        />

        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    marginTop: hp('0.6%'),
    width: wp('22%'),
    height: hp('11.5%'),
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff', // Example blue for edit icon
    borderRadius: 15,
    padding: 5,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 21,
    fontFamily: 'Asap-SemiBold',
    color: COLORS.primary,
  },
  profileEmail: {
    fontSize: 13,
    fontFamily: 'Asap-Medium',
    color: COLORS.primary,
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 13,
    fontFamily: 'Asap-Medium',
    color: COLORS.primary,
    marginTop: 2,
  },
  profileCollege: {
    fontSize: 16,
    fontFamily: 'Asap-SemiBold',
    color: COLORS.primary,
    marginTop: 8,
  },
  profileClass: {
    fontSize: 12,
    fontFamily: 'Asap-Light',
    color: COLORS.primary,
    marginTop: 2,
  },
  editProfileButton: {
    padding: 10,
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
    overflow: 'hidden', // Ensures border radius clips content
  },
  logoutButton: {
    marginLeft: 20,
    flexDirection: 'row',

    alignItems: 'center',
  },
  logoutIcon: {
    marginRight: 4,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 13,
    fontFamily: 'Asap-SemiBold',
    color: COLORS.red, // Red for logout
  },
});
