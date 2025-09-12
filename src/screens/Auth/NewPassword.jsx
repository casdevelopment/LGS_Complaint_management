import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
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
          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>Enter your new password below</Text>

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

          {/* Signup */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
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
    fontFamily: 'Asap-Regular',
  },
  label: {
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
    marginTop: hp('8%'),
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
