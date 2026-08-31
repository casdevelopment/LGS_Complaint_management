import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
<<<<<<< HEAD
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { forgotPassword } from '../../Network/apis';
import CustomInput from '../../components/Form/CustomInput';
import Loader from '../../components/Loader/Loader';

const ForgotPassword = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const from = route?.params?.from || 'forgotPassword';

  const title =
    from === 'unverified' ? 'Verify Your Account' : 'Forgot Password';
  const subtitle =
    from === 'unverified'
      ? 'Your account is registered but not verified. Please verify your email to activate your account.'
      : 'Oops. It happens to the best of us. Enter your email address to reset your password';
  // ✅ Validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  // ✅ Submit handler
  const handleForgot = async values => {
    try {
      setLoading(true);

      const body = { Email: values.email };

      console.log('Forgot password body:', body);

      const res = await forgotPassword(body);

      if (res?.messageCode === 200) {
        Alert.alert(
          'Success',
          res?.message || 'OTP sent to your email!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (from === 'forgotPassword') {
                  navigation.navigate('OTPVerification', {
                    from: 'forgotPassword',
                    email: values.email,
                  });
                } else {
                  navigation.navigate('OTPVerification', {
                    from: 'signup',
                    email: values.email,
                  });
                }
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert('Error', res?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Forgot Password error:', error?.response?.data || error);
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };
=======
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

const { width, height } = Dimensions.get('window');

const ForgotPassword = ({ navigation }) => {
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
<<<<<<< HEAD
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Formik */}
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleForgot}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <Text style={styles.roleTitle}>Email</Text>
                <CustomInput
                  placeholder="Enter your email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && errors.email}
                />

                {/* Submit button */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.loginText}>Submit</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
=======
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Opps.It happens to the best of us. Input your email address to fix
            the issue
          </Text>

          {/* Password input */}
          <Text style={styles.roleTitle}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#999"
              secureTextEntry={!passwordVisible}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeButton}
            ></TouchableOpacity>
          </View>

          {/* Login button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('OTPVerification')}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Submit</Text>
          </TouchableOpacity>
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527

          {/* Signup */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
<<<<<<< HEAD
            <TouchableOpacity
              onPress={() => navigation.navigate('RoleSelectionScreen')}
            >
=======
            <TouchableOpacity>
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
              <Text style={styles.signupLink}>Signup!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
<<<<<<< HEAD
      {loading && <Loader />}
=======
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

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
=======

    fontFamily: 'Asap-Regular',
  },
  roleContainer: {
    flexDirection: 'row',
    marginVertical: hp('2%'),
  },
>>>>>>> 29e89e5b4b9472fa0e361b599efdccdb309b8527
  roleTitle: {
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
    marginTop: hp('20%'),
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
<<<<<<< HEAD
  signupContainer: {
    alignSelf: 'center',
    //position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('19%'), // ✅ no more absolute
    marginBottom: hp('2%'),
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
