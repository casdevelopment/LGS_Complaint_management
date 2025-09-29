import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
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

          {/* Signup */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RoleSelectionScreen')}
            >
              <Text style={styles.signupLink}>Signup!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {loading && <Loader />}
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
    fontFamily: 'Asap-Regular',
  },
  roleTitle: {
    marginBottom: hp('1%'),
    fontFamily: 'Asap-Regular',
    fontSize: 16,
    color: '#07294D',
  },
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
  signupContainer: {
    alignSelf: 'center',
    //position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('19%'), // ✅ no more absolute
    marginBottom: hp('2%'),
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
