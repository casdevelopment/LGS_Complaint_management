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
import { Dropdown } from 'react-native-element-dropdown';

const campusData = [
  { label: 'Campus A', value: 'a' },
  { label: 'Campus B', value: 'b' },
  { label: 'Campus C', value: 'c' },
];

const classData = [
  { label: 'Class 1', value: '1' },
  { label: 'Class 2', value: '2' },
  { label: 'Class 3', value: '3' },
];

const { width, height } = Dimensions.get('window');

const Signup = ({ navigation }) => {
  const [role, setRole] = useState('Parent');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [campus, setCampus] = useState(null);
  const [classValue, setClassValue] = useState(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Top-right curve */}
          <Image
            source={require('../../assets/Images/topRightDarkCurve.png')}
            style={styles.topRight}
            resizeMode="stretch"
          />

          {/* Title */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to get login
          </Text>
          <Image
            style={styles.profilePic}
            source={require('../../assets/Images/profile-picture.png')}
          />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Your full name"
              placeholderTextColor="#999"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Your mail"
              placeholderTextColor="#999"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter your register number"
              placeholderTextColor="#999"
              style={styles.input}
            />
          </View>

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
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirm Password"
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
          <View>
            <Dropdown
              style={styles.dropdown}
              data={campusData}
              labelField="label"
              valueField="value"
              placeholder="Select your Campus"
              placeholderStyle={{ color: '#999' }}
              value={campus}
              onChange={item => setCampus(item.value)}
            />

            <Dropdown
              style={styles.dropdown}
              data={classData}
              labelField="label"
              valueField="value"
              placeholder="Select your class"
              placeholderStyle={{ color: '#999' }}
              value={classValue}
              onChange={item => setClassValue(item.value)}
            />
          </View>

          {/* Login button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('RoleSelectionScreen')}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Next</Text>
          </TouchableOpacity>

          {/* Forgot password */}
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity> */}

          {/* Signup */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signupLink}>Signin!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: hp('13%'),
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
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#07294D',
    marginBottom: hp('5%'),
    alignSelf: 'center',
    fontFamily: 'Asap-Regular',
  },
  profilePic: {
    height: 80,
    width: 80,
    marginBottom: 10,
    alignSelf: 'center',
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
    marginBottom: hp('8%'),
    backgroundColor: '#07294D',
    borderRadius: 10,
    paddingVertical: hp('2.2%'),
    alignItems: 'center',
    marginTop: hp('5%'),
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
  dropdown: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
});
