import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView, // Using ScrollView in case content overflows
} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import ProfileMenuItem from '../../components/ProfileMenuItem';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function AccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="My Account" />
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/Images/profile-picture.png')}
            style={styles.profileImage}
          />

          <TouchableOpacity style={styles.editImageButton}>
            <Image
              source={require('../../assets/Images/edit-line.png')}
              // style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>Ahmed Hassan</Text>
          <Text style={styles.profileEmail}>youremail@domain.com</Text>
          <Text style={styles.profilePhone}>📞 +01 234 567 89</Text>
          <Text style={styles.profileCollege}>Garrison College Boys</Text>
          <Text style={styles.profileClass}>Class VII B</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Image
            source={require('../../assets/Images/edit-line.png')}
            // style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <ProfileMenuItem
          iconName="bell"
          title="Notification & Offer"
          onPress={() => console.log('Notification & Offer Pressed')}
        />
        <ProfileMenuItem
          iconName="lock"
          title="Update Password"
          onPress={() => navigation.navigate('UpdatePassword')}
        />
        {/* Add more ProfileMenuItem components here if needed */}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => console.log('Logout Pressed')}
      >
        <Image source={require('../../assets/Images/out.png')} />
        {/* <FontAwesome5
          name="redo-alt"
          size={18}
          color="#dc3545"
          style={styles.logoutIcon}
        /> */}
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
    alignItems: 'center',
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
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#eee',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  profileCollege: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginTop: 8,
  },
  profileClass: {
    fontSize: 13,
    color: '#888',
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
    marginTop: hp('30%'),
    // justifyContent: 'center',
    // flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#fff',
    // borderRadius: 15,
    // marginHorizontal: 20,
    // paddingVertical: 15,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 3,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545', // Red for logout
  },
});
