<<<<<<< HEAD
import React from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
import {
  View,
  Text,
  StyleSheet,
  Image,
<<<<<<< HEAD
=======
  TextInput,
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
<<<<<<< HEAD
  Alert,
=======
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
<<<<<<< HEAD
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomInput from '../../components/Form/CustomInput';
import { resetPassword } from '../../Network/apis';

const { width, height } = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const NewPassword = ({ navigation, route }) => {
  const email = route.params?.email; // 👈 from OTPVerification

  const handleSubmitForm = async (values, { setSubmitting }) => {
    try {
      const res = await resetPassword({
        email,
        password: values.password,
        confirmPassword: values.password,
      });

      console.log('Password reset success:', res);

      Alert.alert(
        'Success',
        'Your password has been reset successfully. Please login with your new password.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
      );
    } catch (error) {
      console.error('Reset password failed:', error?.response?.data || error);
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Failed to reset password. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };
=======

const { width, height } = Dimensions.get('window');

const NewPassword = ({ navigation }) => {
  const [role, setRole] = useState('Parent');
  const [passwordVisible, setPasswordVisible] = useState(false);
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
<<<<<<< HEAD
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
=======
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
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
          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>Enter your new password below</Text>

<<<<<<< HEAD
          {/* Formik form */}
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmitForm}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                {/* Password */}
                <Text style={styles.label}>Password</Text>
                <CustomInput
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  secureTextEntry
                  showToggle
                  error={
                    touched.password && errors.password ? errors.password : ''
                  }
                />

                {/* Confirm Password */}
                <Text style={styles.label}>Confirm Password</Text>
                <CustomInput
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  secureTextEntry
                  showToggle
                  error={
                    touched.confirmPassword && errors.confirmPassword
                      ? errors.confirmPassword
                      : ''
                  }
                />

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  style={[styles.loginButton, isSubmitting && { opacity: 0.6 }]}
                >
                  <Text style={styles.loginText}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
=======
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
              <Text>{passwordVisible ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Password input */}
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
              <Text>{passwordVisible ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginText}>Submit</Text>
          </TouchableOpacity>
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527

          {/* Signup */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
<<<<<<< HEAD
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
=======
            <TouchableOpacity>
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
              <Text style={styles.signupLink}>Signup!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NewPassword;

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
<<<<<<< HEAD
    fontFamily: 'Asap-Regular',
  },
  label: {
=======

    fontFamily: 'Asap-Regular',
  },
  roleContainer: {
    flexDirection: 'row',
    marginVertical: hp('2%'),
  },
  roleTitle: {
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
    marginBottom: hp('1%'),
    fontFamily: 'Asap-Regular',
    fontSize: 16,
    color: '#07294D',
  },
<<<<<<< HEAD
=======
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
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
  loginButton: {
    backgroundColor: '#07294D',
    borderRadius: 10,
    paddingVertical: hp('2.2%'),
    alignItems: 'center',
<<<<<<< HEAD
    marginTop: hp('8%'),
=======
    marginTop: hp('14%'),
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
<<<<<<< HEAD
  signupContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('22%'),
    marginBottom: hp('4%'),
=======
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
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
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
