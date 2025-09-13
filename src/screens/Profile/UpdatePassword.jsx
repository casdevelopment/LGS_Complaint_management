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
                );
                resetForm();
                navigation.goBack();
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
                  error={touched.oldPassword && errors.oldPassword}
                />

                <Text style={styles.label}>New Password</Text>
                <CustomInput
                  placeholder="New Password"
                  secureTextEntry
                  value={values.newPassword}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  error={touched.newPassword && errors.newPassword}
                />

                <Text style={styles.label}>Confirm Password</Text>
                <CustomInput
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
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
    backgroundColor: '#fff',
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

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   Dimensions,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import Header from '../../components/Header';

// const { width, height } = Dimensions.get('window');

// const UpdatePassword = ({ navigation }) => {
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1 }}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Header title="Update Password" />
//         <View style={styles.container}>
//           {/* Top-right curve */}

//           {/* Password input */}
//           <Text style={styles.roleTitle}>Enter Old Password</Text>
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder="Password"
//               placeholderTextColor="#999"
//               secureTextEntry={!passwordVisible}
//               style={styles.input}
//             />
//             <TouchableOpacity
//               onPress={() => setPasswordVisible(!passwordVisible)}
//               style={styles.eyeButton}
//             >
//               <Image
//                 source={
//                   passwordVisible
//                     ? require('../../assets/Images/visible.png') // 👁️ visible
//                     : require('../../assets/Images/hide.png') // 🙈 hidden
//                 }
//                 style={styles.eyeIcon}
//               />
//             </TouchableOpacity>
//           </View>

//           {/* Password input */}
//           <Text style={styles.roleTitle}>Password</Text>
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder="Password"
//               placeholderTextColor="#999"
//               secureTextEntry={!passwordVisible}
//               style={styles.input}
//             />
//             <TouchableOpacity
//               onPress={() => setPasswordVisible(!passwordVisible)}
//               style={styles.eyeButton}
//             >
//               <Image
//                 source={
//                   passwordVisible
//                     ? require('../../assets/Images/visible.png') // 👁️ visible
//                     : require('../../assets/Images/hide.png') // 🙈 hidden
//                 }
//                 style={styles.eyeIcon}
//               />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.roleTitle}>Confirm Password</Text>
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder="Password"
//               placeholderTextColor="#999"
//               secureTextEntry={!passwordVisible}
//               style={styles.input}
//             />
//             <TouchableOpacity
//               onPress={() => setPasswordVisible(!passwordVisible)}
//               style={styles.eyeButton}
//             >
//               <Image
//                 source={
//                   passwordVisible
//                     ? require('../../assets/Images/visible.png') // 👁️ visible
//                     : require('../../assets/Images/hide.png') // 🙈 hidden
//                 }
//                 style={styles.eyeIcon}
//               />
//             </TouchableOpacity>
//           </View>

//           {/* Login button */}
//           <TouchableOpacity
//             // onPress={() => navigation.navigate('Login')}
//             style={styles.loginButton}
//           >
//             <Text style={styles.loginText}>Update</Text>
//           </TouchableOpacity>

//           {/* Signup */}
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default UpdatePassword;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//     paddingTop: hp('8%'),
//   },
//   topRight: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//   },
//   title: {
//     fontSize: 32,
//     color: '#07294D',
//     fontFamily: 'Asap-SemiBold',
//     marginBottom: hp('2.5%'),
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#07294D',
//     marginBottom: hp('8%'),

//     fontFamily: 'Asap-Regular',
//   },
//   roleContainer: {
//     flexDirection: 'row',
//     marginVertical: hp('2%'),
//   },
//   roleTitle: {
//     marginBottom: hp('1%'),
//     fontFamily: 'Asap-Regular',
//     fontSize: 16,
//     color: '#07294D',
//   },
//   roleOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   radioOuter: {
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     borderWidth: 2,
//     borderColor: '#0D1B2A',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 6,
//   },
//   radioOuterActive: {
//     borderColor: '#0D1B2A',
//   },
//   radioInner: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#0D1B2A',
//   },
//   roleText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   inputContainer: {
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     backgroundColor: '#f9f9f9',
//   },
//   input: {
//     flex: 1,
//     paddingVertical: hp('2.2%'),
//     fontSize: 14,
//   },
//   eyeButton: {
//     padding: 5,
//   },
//   loginButton: {
//     marginTop: hp('28%'),
//     backgroundColor: '#07294D',
//     borderRadius: 10,
//     paddingVertical: hp('2.2%'),
//     alignItems: 'center',
//     // marginTop: hp('14%'),
//   },
//   loginText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   forgotButton: {
//     alignSelf: 'flex-end',
//     marginTop: 10,
//   },
//   forgotText: {
//     fontSize: 13,
//     color: '#0D1B2A',
//   },
//   signupContainer: {
//     alignSelf: 'center',
//     position: 'absolute',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     bottom: hp('4'),
//   },
//   signupText: {
//     fontSize: 14,
//     color: '#555',
//   },
//   signupLink: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#0D1B2A',
//   },
// });
