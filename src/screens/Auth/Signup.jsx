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
import { Formik } from 'formik';
import CustomDropdown from '../../components/Form/CustomDropdown';
import CustomInput from '../../components/Form/CustomInput';
import { signupSchema } from '../../utils/validationSchemas';
import { launchImageLibrary } from 'react-native-image-picker';

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
  const [profileImage, setProfileImage] = useState(null);
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode) {
        setProfileImage(response.assets[0]);
      }
    });
  };
  const handleSignup = async values => {
    console.log(values, 'mmmmmmmmuip');
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('regNumber', values.regNumber);
    formData.append('password', values.password);
    formData.append('campus', values.campus);
    formData.append('classValue', values.classValue);

    if (profileImage) {
      formData.append('profileImage', {
        uri: profileImage.uri,
        type: profileImage.type,
        name: profileImage.fileName,
      });
    }

    // try {
    //   const res = await fetch('https://your-api/signup', {
    //     method: 'POST',
    //     body: formData,
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //   });
    //   const data = await res.json();
    //   console.log('Signup success:', data);
    //   navigation.navigate('RoleSelectionScreen');
    // } catch (err) {
    //   console.error('Signup error:', err);
    // }
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
          <TouchableOpacity
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
          </TouchableOpacity>

          {/* <Formik
            initialValues={{
              name: '',
              email: '',
              regNumber: '',
              password: '',
              confirmPassword: '',
              campus: '',
              classValue: '',
            }}
            validationSchema={signupSchema}
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

                <CustomDropdown
                  data={campusData}
                  placeholder="Select your Campus"
                  value={values.campus}
                  onChange={val => setFieldValue('campus', val)}
                  error={touched.campus && errors.campus}
                />

                <CustomDropdown
                  data={classData}
                  placeholder="Select your class"
                  value={values.classValue}
                  onChange={val => setFieldValue('classValue', val)}
                  error={touched.classValue && errors.classValue}
                />

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginText}>Next</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik> */}

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
                    ? require('../../assets/Images/visible.png')
                    : require('../../assets/Images/hide.png')
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
                    ? require('../../assets/Images/visible.png')
                    : require('../../assets/Images/hide.png')
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

          <TouchableOpacity
            onPress={() => navigation.navigate('RoleSelectionScreen')}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Next</Text>
          </TouchableOpacity>

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
