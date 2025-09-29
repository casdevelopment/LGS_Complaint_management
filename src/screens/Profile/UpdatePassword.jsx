import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

import Header from '../../components/Header';
import { updatePassword } from '../../Network/apis';
import CustomInput from '../../components/Form/CustomInput';
import { useSelector } from 'react-redux';

// ✅ Validation Schema
const UpdatePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string()
    .min(5, 'Password must be at least 5 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

const UpdatePassword = ({ navigation }) => {
  const user = useSelector(state => state.auth.user);

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
          <Formik
            initialValues={{
              oldPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={UpdatePasswordSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const payload = {
                  UserId: user?.id, // 👉 replace with logged-in user id
                  Role: user?.role, // 👉 replace dynamically if needed
                  OldPassword: values.oldPassword,
                  NewPassword: values.newPassword,
                };

                const response = await updatePassword(payload);

                Alert.alert(
                  'Success',
                  response?.message || 'Password updated successfully',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        resetForm();
                        navigation.goBack(); // 👈 only after OK press
                      },
                    },
                  ],
                );
              } catch (error) {
                Alert.alert(
                  'Error',
                  error.response?.data?.message || 'Something went wrong',
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                <Text style={styles.label}>Enter Old Password</Text>
                <CustomInput
                  placeholder="Old Password"
                  secureTextEntry
                  value={values.oldPassword}
                  onChangeText={handleChange('oldPassword')}
                  onBlur={handleBlur('oldPassword')}
                  showToggle
                  error={touched.oldPassword && errors.oldPassword}
                />

                <Text style={styles.label}>New Password</Text>
                <CustomInput
                  placeholder="New Password"
                  secureTextEntry
                  value={values.newPassword}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  showToggle
                  error={touched.newPassword && errors.newPassword}
                />

                <Text style={styles.label}>Confirm Password</Text>
                <CustomInput
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  showToggle
                  error={touched.confirmPassword && errors.confirmPassword}
                />

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.updateButton}
                  disabled={isSubmitting}
                >
                  <Text style={styles.updateText}>
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 20,
    paddingTop: hp('6%'),
  },
  label: {
    marginBottom: hp('1%'),
    fontFamily: 'Asap-Regular',
    fontSize: 16,
    color: '#07294D',
  },
  updateButton: {
    marginTop: hp('6%'),
    backgroundColor: '#07294D',
    borderRadius: 10,
    paddingVertical: hp('2.2%'),
    alignItems: 'center',
  },
  updateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
