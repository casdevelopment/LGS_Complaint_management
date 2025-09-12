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
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InputField from '../../components/Form/InputField';
import Timer from '../../components/Timer/TimerSection';
import DigitInput from '../../components/Form/DigitInput';
import Loader from '../../components/Loader/Loader';
import { verifySignupOTP, verifyForgotOtp } from '../../Network/apis';

const { width, height } = Dimensions.get('window');

const OTPVerification = ({ navigation, route }) => {
  const { from, email } = route.params || {}; // 👈 data passed from Signup or ForgotPassword
  console.log(from, email, 'mmmmmmmm');
  const [value, setValue] = useState('');
  const [OTP, setOTP] = useState('');

  const [loading, setLoading] = useState(false);

  const [reset, setReset] = useState(false);
  const handleVerify = async () => {
    try {
      setLoading(true);

      if (from === 'signup') {
        // 🔹 Call signup verification API
        const res = await verifySignupOTP({
          email,
          otp: OTP,
        });
        console.log('Signup OTP verified:', res);

        if (res?.messageCode === 200) {
          Alert.alert(
            'Success',
            res?.message || 'OTP verified successfully!',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Login'),
              },
            ],
            { cancelable: false },
          );
        } else {
          Alert.alert(
            'Error',
            res?.message || 'OTP verification failed. Please try again.',
          );
        }
      } else if (from === 'forgotPassword') {
        // 🔹 Call forgot password verification API
        const res = await verifyForgotOtp({
          email,
          otp: OTP,
        });
        console.log('Forgot Password OTP verified:', res);

        if (res?.messageCode === 200) {
          Alert.alert(
            'Success',
            res?.message || 'OTP verified successfully!',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('NewPassword', { email }),
              },
            ],
            { cancelable: false },
          );
        } else {
          Alert.alert(
            'Error',
            res?.message || 'OTP verification failed. Please try again.',
          );
        }
      }
    } catch (error) {
      console.error('OTP verification failed:', error?.response?.data || error);
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>
            Please enter the 5-digit code sent to your email user@gmail.com for
            verification
          </Text>

          <DigitInput onComplete={val => setOTP(val)} reset={reset} />

          <Timer
            initialSeconds={60}
            onTimerEnd={() => console.log('LEGS')}
            onResend={() => console.log('LEGS')}
          />

          {/* Login button */}
          <TouchableOpacity onPress={handleVerify} style={styles.loginButton}>
            <Text style={styles.loginText}>
              {from === 'signup' ? 'Verification' : 'Submit'}
            </Text>
          </TouchableOpacity>

          {/* Signup */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Signup!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {loading && <Loader />}
    </KeyboardAvoidingView>
  );
};

export default OTPVerification;

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
    backgroundColor: '#07294D',
    borderRadius: 10,
    paddingVertical: hp('2.2%'),
    alignItems: 'center',
    marginTop: hp('10%'),
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
