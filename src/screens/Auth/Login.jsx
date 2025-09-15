import React, { useState, useCallback } from 'react';
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
  PermissionsAndroid,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomInput from '../../components/Form/CustomInput';
import { loginUser } from '../../Network/apis';
import Loader from '../../components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials, setAuthenticated } from '../../Redux/slices/AuthSlice';
import { useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { useFocusEffect } from '@react-navigation/native';

const Login = ({ navigation }) => {
  const [role, setRole] = useState('Parent');
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState(null); // store token in state
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS == 'android') {
        requestPermissionAndroid();
      } else {
        requestIosPermission();
      }
    }, []),
  );

  // ✅ Validation Schema
  const validationSchema = Yup.object().shape({
    emailOrPhone: Yup.string()
      .required('Email or Phone is required')
      .min(4, 'Too short'),
    password: Yup.string()
      .required('Password is required')
      .min(5, 'Password must be at least 5 characters'),
  });

  const requestPermissionAndroid = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getToken();
    } else {
      getToken();
    }
  };
  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('FCM Token:', token);
        setFcmToken(token);
      }
    } catch (err) {
      console.error('Error fetching FCM token:', err);
    }
  };

  // ✅ Submit Handler
  const handleLogin = async values => {
    try {
      setLoading(true);

      const body = {
        Role: role.toLowerCase(),
        EmailOrPhone: values.emailOrPhone,
        Password: values.password,
        FCMToken: fcmToken || '',
      };
      console.log(body, 'mmmmmmmmop');
      const res = await loginUser(body);
      console.log('Login res:', res.data);
      if (res?.messageCode === 200) {
        await AsyncStorage.setItem('accessToken', res?.data?.accessToken);
        await AsyncStorage.setItem('refreshToken', res?.data?.refreshToken);
        dispatch(
          setCredentials({
            accessToken: res?.data?.accessToken,
            refreshToken: res?.data?.refreshToken,
            user: res?.data?.user,
          }),
        );
        dispatch(setAuthenticated({ isAuthenticated: true }));
        // navigation.navigate('HomeScreen', {
        //   screen: 'Home',
        //   params: { role },
        // });
      } else {
        Alert.alert('Error', res?.message || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Login error:', error?.response?.data || error);
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
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to get login
          </Text>
          <Text style={styles.roleTitle}>Login As</Text>

          {/* Role selection */}
          <View style={styles.roleContainer}>
            {['Parent', 'Employee', 'OIC'].map(item => (
              <TouchableOpacity
                key={item}
                style={styles.roleOption}
                onPress={() => setRole(item)}
              >
                <View
                  style={[
                    styles.radioOuter,
                    role === item && styles.radioOuterActive,
                  ]}
                >
                  {role === item && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.roleText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Formik */}
          <Formik
            initialValues={{ emailOrPhone: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
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
                <Text style={styles.roleTitle}>Phone Number or Email</Text>
                <CustomInput
                  placeholder="Phone Number or Email"
                  value={values.emailOrPhone}
                  onChangeText={handleChange('emailOrPhone')}
                  onBlur={handleBlur('emailOrPhone')}
                  error={touched.emailOrPhone && errors.emailOrPhone}
                />

                <Text style={styles.roleTitle}>Password</Text>
                <CustomInput
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  showToggle
                  error={touched.password && errors.password}
                />

                {/* Login button */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.loginText}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          {/* Forgot password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

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

export default Login;

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
    marginBottom: hp('5%'),
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
  loginButton: {
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
});
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// const Login = ({ navigation }) => {
//   const [role, setRole] = useState('Parent');
//   console.log(role, 'mmmmmmmu');
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
//         <View style={styles.container}>
//           {/* Top-right curve */}
//           <Image
//             source={require('../../assets/Images/topRightDarkCurve.png')}
//             style={styles.topRight}
//             resizeMode="stretch"
//           />

//           {/* Title */}
//           <Text style={styles.title}>Sign in</Text>
//           <Text style={styles.subtitle}>
//             Enter your credentials to get login
//           </Text>
//           <Text style={styles.roleTitle}>Login As</Text>
//           {/* Role selection */}
//           <View style={styles.roleContainer}>
//             {['Parent', 'OIC', 'Admin'].map(item => (
//               <TouchableOpacity
//                 key={item}
//                 style={styles.roleOption}
//                 onPress={() => setRole(item)}
//               >
//                 <View
//                   style={[
//                     styles.radioOuter,
//                     role === item && styles.radioOuterActive,
//                   ]}
//                 >
//                   {role === item && <View style={styles.radioInner} />}
//                 </View>
//                 <Text style={styles.roleText}>{item}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Phone/Email input */}
//           <Text style={styles.roleTitle}>Phone Number or Email</Text>
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder="Phone Number or Email"
//               placeholderTextColor="#999"
//               style={styles.input}
//             />
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

//           {/* Login button */}
//           <TouchableOpacity
//             style={styles.loginButton}
//             onPress={() =>
//               navigation.navigate('HomeScreen', {
//                 screen: 'Home',
//                 params: { role },
//               })
//             }
//           >
//             <Text style={styles.loginText}>Login</Text>
//           </TouchableOpacity>

//           {/* Forgot password */}
//           <TouchableOpacity
//             onPress={() => navigation.navigate('ForgotPassword')}
//             style={styles.forgotButton}
//           >
//             <Text style={styles.forgotText}>Forgot password?</Text>
//           </TouchableOpacity>

//           {/* Signup */}
//           <View style={styles.signupContainer}>
//             <Text style={styles.signupText}>Don’t have an account? </Text>
//             <TouchableOpacity
//               onPress={() => navigation.navigate('RoleSelectionScreen')}
//             >
//               <Text style={styles.signupLink}>Signup!</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//     paddingTop: hp('13%'),
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
//     backgroundColor: '#07294D',
//     borderRadius: 10,
//     paddingVertical: hp('2.2%'),
//     alignItems: 'center',
//     marginTop: hp('5%'),
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
