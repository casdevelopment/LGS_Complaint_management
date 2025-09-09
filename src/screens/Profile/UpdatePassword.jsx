import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/Header';

const { width, height } = Dimensions.get('window');

const UpdatePassword = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Update Password" />
        <View style={styles.container}>
          {/* Top-right curve */}

          {/* Password input */}
          <Text style={styles.roleTitle}>Enter Old Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!passwordVisible}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeButton}
            >
              <Image
                source={
                  passwordVisible
                    ? require('../../assets/Images/visible.png') // 👁️ visible
                    : require('../../assets/Images/hide.png') // 🙈 hidden
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Password input */}
          <Text style={styles.roleTitle}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!passwordVisible}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeButton}
            >
              <Image
                source={
                  passwordVisible
                    ? require('../../assets/Images/visible.png') // 👁️ visible
                    : require('../../assets/Images/hide.png') // 🙈 hidden
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.roleTitle}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!passwordVisible}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeButton}
            >
              <Image
                source={
                  passwordVisible
                    ? require('../../assets/Images/visible.png') // 👁️ visible
                    : require('../../assets/Images/hide.png') // 🙈 hidden
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <TouchableOpacity
            // onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Update</Text>
          </TouchableOpacity>

          {/* Signup */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: hp('8%'),
  },
  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  title: {
    fontSize: 32,
    color: '#07294D',
    fontFamily: 'Asap-SemiBold',
    marginBottom: hp('2.5%'),
  },
  subtitle: {
    fontSize: 16,
    color: '#07294D',
    marginBottom: hp('8%'),

    fontFamily: 'Asap-Regular',
  },
  roleContainer: {
    flexDirection: 'row',
    marginVertical: hp('2%'),
  },
  roleTitle: {
    marginBottom: hp('1%'),
    fontFamily: 'Asap-Regular',
    fontSize: 16,
    color: '#07294D',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#0D1B2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioOuterActive: {
    borderColor: '#0D1B2A',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D1B2A',
  },
  roleText: {
    fontSize: 14,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    paddingVertical: hp('2.2%'),
    fontSize: 14,
  },
  eyeButton: {
    padding: 5,
  },
  loginButton: {
    marginTop: hp('28%'),
    backgroundColor: '#07294D',
    borderRadius: 10,
    paddingVertical: hp('2.2%'),
    alignItems: 'center',
    // marginTop: hp('14%'),
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotText: {
    fontSize: 13,
    color: '#0D1B2A',
  },
  signupContainer: {
    alignSelf: 'center',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: hp('4'),
  },
  signupText: {
    fontSize: 14,
    color: '#555',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D1B2A',
  },
});
