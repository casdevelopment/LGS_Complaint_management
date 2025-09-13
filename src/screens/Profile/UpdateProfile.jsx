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
import {
  getAllCampus,
  getAllClasses,
  updateUserProfile,
} from '../../Network/apis';
import { updateUser } from '../../Redux/slices/AuthSlice'; // <- update in Redux

const UpdateProfile = ({ navigation }) => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const [campusData, setCampusData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch campuses
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllCampus();
        const formatted = res?.data?.map(item => ({
          label: item.school,
          value: item.schoolId,
        }));
        setCampusData(formatted);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleCampusChange = async (campusId, setFieldValue) => {
    setFieldValue('campus', campusId);
    setFieldValue('classValue', '');
    try {
      const res = await getAllClasses(campusId);
      const formatted = res?.data?.map(item => ({
        label: item.class,
        value: item.classId,
      }));
      setClassData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleUpdate = async values => {
    try {
      setLoading(true);

      const body = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        campus: String(values.campus),
        class: String(values.classValue),
        profilePic: values.profileImage?.base64
          ? `data:${values.profileImage.type};base64,${values.profileImage.base64}`
          : user?.profilePic,
      };

      const res = await updateUserProfile(body);

      if (res?.messageCode === 200) {
        dispatch(updateUser(body)); // update Redux
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
        <Formik
          initialValues={{
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            campus: user?.campus || '',
            classValue: user?.campusclass || '',
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
              />
              <CustomInput
                placeholder="Phone"
                value={values.phone}
                onChangeText={handleChange('phone')}
              />

              <CustomDropdown
                data={campusData}
                placeholder={values.campus}
                value={values.campus}
                onChange={val => handleCampusChange(val, setFieldValue)}
              />

              <CustomDropdown
                data={classData}
                placeholder={values.classValue}
                value={values.classValue}
                onChange={val => setFieldValue('classValue', val)}
                disabled={!values.campus}
              />

              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  marginTop: 20,
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
        {loading && <Loader />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UpdateProfile;
