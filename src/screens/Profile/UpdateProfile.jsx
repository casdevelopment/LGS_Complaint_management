import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomInput from '../../components/Form/CustomInput';
import CustomDropdown from '../../components/Form/CustomDropdown';
import Header from '../../components/Header';
import Loader from '../../components/Loader/Loader';
import { getAllCampus, getAllClasses, updateProfile } from '../../Network/apis';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { setCredentials } from '../../Redux/slices/AuthSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateProfile = ({ navigation }) => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const [campusData, setCampusData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [campusLoading, setCampusLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(false);

  const isEmployeeOrAdmin =
    user?.role?.toLowerCase() === 'employee' ||
    user?.role?.toLowerCase() === 'oic';

  // Fetch campuses
  useEffect(() => {
    if (!isEmployeeOrAdmin) {
      (async () => {
        try {
          setCampusLoading(true);
          const res = await getAllCampus();
          const formatted = res?.data?.map(item => ({
            label: item.school,
            value: item.schoolId,
          }));
          setCampusData(formatted);
        } catch (err) {
          console.error(err);
        } finally {
          setCampusLoading(false);
        }
      })();
    }
  }, [isEmployeeOrAdmin]);

  const handleCampusChange = async (campusId, setFieldValue) => {
    setFieldValue('campus', campusId);
    setFieldValue('classValue', '');
    try {
      setClassLoading(true);
      const res = await getAllClasses(campusId);
      const formatted = res?.data?.map(item => ({
        label: item.class,
        value: item.classId,
      }));
      setClassData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setClassLoading(false);
    }
  };

  const handleUpdate = async values => {
    try {
      // if (!isEmployeeOrAdmin) {
      //   // if campus changed but no class selected
      //   if (values.campus !== String(user?.campusid) && !values.classValue) {
      //     Alert.alert('Error', 'Please select a class after changing campus');
      //     return;
      //   }
      // }

      setLoading(true);

      // Build body dynamically
      const body = {
        UserId: user?.id,
        Role: user?.role,
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      // if (!isEmployeeOrAdmin) {
      //   body.campus = values.campus
      //     ? String(values.campus)
      //     : String(user?.campusid);

      //   body.class = values.classValue
      //     ? String(values.classValue)
      //     : String(user?.campusclassid);
      // }

      console.log('Update body:', body);

      const res = await updateProfile(body);

      if (res?.messageCode === 200) {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        dispatch(
          setCredentials({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: res?.data?.user,
          }),
        );
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', res?.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Header title="Update Profile" />
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: hp('6%'),
          }}
        >
          <Formik
            initialValues={{
              name: user?.name || '',
              email: user?.email || '',
              phone: user?.phone || '',
              campus: user?.campusid || '',
              classValue: user?.campusclassid || '',
              profileImage: null,
            }}
            onSubmit={handleUpdate}
          >
            {({ handleChange, handleSubmit, values, setFieldValue }) => (
              <>
                {/* <TouchableOpacity
                onPress={() => selectImage(setFieldValue)}
                style={{ alignSelf: 'center', marginBottom: 20 }}
              >
                <Image
                  source={
                    values.profileImage
                      ? { uri: values.profileImage.uri }
                      : user?.profilePic
                      ? { uri: user.profilePic }
                      : require('../../assets/Images/profile-picture.png')
                  }
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 45,
                  }}
                />
              </TouchableOpacity> */}

                <CustomInput
                  placeholder="Your full name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                />
                <CustomInput
                  placeholder="Your mail"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  editable={false}
                />
                <CustomInput
                  placeholder="Phone"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                />

                {/* Show dropdowns only if not employee/admin */}
                {/* {!isEmployeeOrAdmin && (
                  <>
                    <CustomDropdown
                      data={campusData}
                      placeholder={user?.campus || 'Select Campus'}
                      value={values.campus}
                      onChange={val => handleCampusChange(val, setFieldValue)}
                    />

                    <CustomDropdown
                      data={classData}
                      placeholder={user?.campusclass || 'Select Class'}
                      value={values.classValue}
                      onChange={val => setFieldValue('classValue', val)}
                      disabled={!values.campus}
                    />
                  </>
                )} */}

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    marginTop: 30,
                    backgroundColor: '#07294D',
                    padding: 15,
                    borderRadius: 10,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 16 }}>Update</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
        {loading && <Loader />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdateProfile;
