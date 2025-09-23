import React, { useState, useEffect } from 'react';
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
import { Dropdown } from 'react-native-element-dropdown';
import { Formik } from 'formik';
import CustomDropdown from '../../components/Form/CustomDropdown';
import CustomInput from '../../components/Form/CustomInput';
import { signupSchema } from '../../utils/validationSchemas';
import { launchImageLibrary } from 'react-native-image-picker';
import { getAllCampus, getAllClasses } from '../../Network/apis';
import Loader from '../../components/Loader/Loader';
import { signupUser } from '../../Network/apis';

const { width, height } = Dimensions.get('window');

const Signup = ({ navigation, route }) => {
  const { role } = route.params || {}; // 👈 role comes here
  console.log('Selected role:', role);
  // const [role, setRole] = useState('Parent');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [campusData, setCampusData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [campusLoading, setCampusLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  // Fetch campus list on mount
  // useEffect(() => {
  //   const fetchCampuses = async () => {
  //     setCampusLoading(true); // 👈 show loader
  //     try {
  //       const res = await getAllCampus();
  //       const formatted = res?.data?.map(item => ({
  //         label: item.school, // 👈 depends on API response key
  //         value: item.schoolId,
  //       }));
  //       setCampusData(formatted || []);
  //     } catch (err) {
  //       console.error('Error loading campuses:', err);
  //     } finally {
  //       setCampusLoading(false); // 👈 hide loader
  //     }
  //   };
  //   fetchCampuses();
  // }, []);
  // const handleCampusChange = async (campusId, setFieldValue) => {
  //   setFieldValue('campus', campusId);
  //   setFieldValue('classValue', ''); // reset class
  //   setClassData([]); // reset old class list

  //   try {
  //     setClassLoading(true); // 👈 specific state for dropdown
  //     const res = await getAllClasses(campusId);
  //     const formatted = res?.data?.map(item => ({
  //       label: item.class, // 👈 depends on API response key
  //       value: item.classId,
  //     }));
  //     setClassData(formatted || []);
  //   } catch (err) {
  //     console.error('Error loading classes:', err);
  //   } finally {
  //     setClassLoading(false);
  //   }
  // };

  // Pick image with base64
  const selectImage = setFieldValue => {
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: true },
      response => {
        if (!response.didCancel && !response.errorCode) {
          const asset = response.assets[0];
          setFieldValue('profileImage', {
            uri: asset.uri,
            base64: asset.base64,
            type: asset.type,
            fileName: asset.fileName,
          });
        }
      },
    );
  };

  const handleSignup = async values => {
    try {
      setSignupLoading(true);

      const body = {
        name: values.name,
        email: values.email,
        phone: values.regNumber,
        password: values.password,
        confirmPassword: values.confirmPassword,
        userType: role?.toLowerCase(),
        profilePic: values.profileImage?.base64
          ? `data:${values.profileImage.type};base64,${values.profileImage.base64}`
          : null,
        ...(role?.toLowerCase() === 'parent' && {
          campus: String(values.campus),
          class: String(values.classValue),
        }),
      };
      console.log(body, 'body for the user');
      const data = await signupUser(body); // 🔹 call API function
      console.log('Signup success:', data);

      if (data?.messageCode === 200) {
        Alert.alert(
          'Success',
          data?.message || 'Signup successful!',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('OTPVerification', {
                  from: 'signup',
                  email: values.email,
                }),
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          'Error',
          data?.message || 'Signup failed. Please try again.',
        );
      }

      // navigation.navigate('OTPVerification', {
      //   from: 'signup', // 👈 tell OTP screen this is signup flow
      //   email: values.email,
      // });
    } catch (error) {
      console.error('Signup failed:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setSignupLoading(false);
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
          {/* <TouchableOpacity
            onPress={selectImage}
            style={{ alignSelf: 'center' }}
          >
            <Image
              source={
                profileImage
                  ? { uri: profileImage.uri }
                  : require('../../assets/Images/profile-picture.png')
              }
              style={styles.profilePic}
            />
          </TouchableOpacity> */}

          <Formik
            initialValues={{
              name: '',
              email: '',
              regNumber: '',
              password: '',
              confirmPassword: '',
              campus: '',
              classValue: '',
              profileImage: null,
            }}
            validationSchema={signupSchema(role)}
            onSubmit={handleSignup}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <>
                <TouchableOpacity
                  onPress={() => selectImage(setFieldValue)}
                  style={{ alignSelf: 'center' }}
                >
                  <Image
                    source={
                      values.profileImage
                        ? { uri: values.profileImage.uri }
                        : require('../../assets/Images/profile-picture.png')
                    }
                    style={styles.profilePic}
                  />
                </TouchableOpacity>
                <CustomInput
                  placeholder="Your full name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  error={touched.name && errors.name}
                />

                <CustomInput
                  placeholder="Your mail"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  error={touched.email && errors.email}
                />

                <CustomInput
                  placeholder="Enter your register number"
                  value={values.regNumber}
                  onChangeText={handleChange('regNumber')}
                  error={touched.regNumber && errors.regNumber}
                />

                <CustomInput
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  error={touched.password && errors.password}
                  showToggle
                />

                <CustomInput
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  error={touched.confirmPassword && errors.confirmPassword}
                  showToggle
                />

                {/* {role?.toLowerCase() === 'parent' && (
                  <>
                    <CustomDropdown
                      data={campusData}
                      placeholder="Select your Campus"
                      value={values.campus}
                      onChange={val => handleCampusChange(val, setFieldValue)}
                      error={touched.campus && errors.campus}
                    />

                    <CustomDropdown
                      data={classData}
                      placeholder={
                        classLoading
                          ? 'Loading classes...'
                          : 'Select your class'
                      }
                      value={values.classValue}
                      onChange={val => setFieldValue('classValue', val)}
                      error={touched.classValue && errors.classValue}
                      disabled={classLoading || !values.campus}
                    />
                  </>
                )} */}

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginText}>Next</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signupLink}>Signin!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {(campusLoading || signupLoading) && <Loader />}
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
    borderRadius: 40,
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
