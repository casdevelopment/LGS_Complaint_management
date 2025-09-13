import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Dropdown } from 'react-native-element-dropdown';
import { getConplainTypes } from '../../Network/apis';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { launchComplaint } from '../../Network/apis';

export default function ComplainForm({ navigation, route }) {
  const user = useSelector(state => state.auth.user);

  const { campus, category } = route.params; // 👈 now you have both!
  console.log(campus, category, 'oooooppp');
  const [complainTypes, setComplainTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchComplainTypes();
  }, []);

  const fetchComplainTypes = async () => {
    try {
      const res = await getConplainTypes();
      const formatted = res.data?.map(item => ({
        label: item.complainType,
        value: item.complainTypeId,
      }));
      setComplainTypes(formatted);
    } catch (err) {
      console.error('Error fetching complain types:', err);
    }
  };
  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'You can upload up to 5 images only.');
      return;
    }
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (!result.didCancel && result.assets?.length > 0) {
      setImages([...images, result.assets[0]]);
    }
  };
  const submitComplaint = async () => {
    if (!location || !subject || !description || !selectedType) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    // console.log(category.complainCategoryId, 'category');
    // console.log(campus.schoolId, 'campus');
    // console.log('complain_type_id', selectedType);
    // console.log('location', location);
    // console.log('subject', subject);
    // console.log('description', description);
    // console.log(images, 'images');

    const formData = new FormData();
    formData.append('CampusId', campus.schoolId);
    formData.append('ComplaintCategoryId', category.complainCategoryId);
    formData.append('ComplaintTypeId', selectedType);
    formData.append('LocationAddress', location);
    formData.append('ComplaintSubject', subject);
    formData.append('Latitude', '31.582045');
    formData.append('Longitude', '74.329376');
    formData.append('Description', description);
    formData.append('UserId', user.id);
    // 🔹 Add images as file1, file2, ...
    images.forEach((img, index) => {
      formData.append(`file${index + 1}`, {
        uri: img.uri,
        type: img.type || 'image/jpeg',
        name: img.fileName || `complain_${index + 1}.jpg`,
      });
    });

    try {
      const res = await launchComplaint(formData);
      Alert.alert('Success', 'Complaint submitted successfully!');
      navigation.navigate('HomeScreen');
    } catch (err) {
      console.error('Error submitting complaint:', err.response?.data || err);
      Alert.alert('Error', 'Failed to submit complaint');
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
          <TouchableOpacity
            style={styles.topLeft}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../../assets/Images/turn-back.png')}
              //style={styles.topLeft}
              resizeMode="stretch"
            />
          </TouchableOpacity>

          <Image
            source={require('../../assets/Images/topRightDarkCurve.png')}
            style={styles.topRight}
            resizeMode="stretch"
          />

          {/* Title */}
          <Text style={styles.title}>Complaint Form</Text>
          <Text style={styles.subtitle}>Enter your complain</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter Location"
              placeholderTextColor="#999"
              style={styles.input}
              value={location}
              onChangeText={text => setLocation(text)}
            />

            <Image
              source={require('../../assets/Images/Location-Pin.png')}
              style={styles.eyeButton}
              // resizeMode="stretch"
            />
          </View>

          <View>
            <Dropdown
              style={styles.dropdown}
              data={complainTypes}
              labelField="label"
              valueField="value"
              placeholder="Complain Type"
              placeholderStyle={{ color: '#999' }}
              value={selectedType}
              onChange={item => setSelectedType(item.value)}
            />

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Subject"
                placeholderTextColor="#999"
                style={styles.input}
                value={subject}
                onChangeText={text => setSubject(text)}
              />
            </View>
          </View>
          {/* Description Field */}
          <TextInput
            style={styles.description}
            placeholder="Description"
            placeholderTextColor="#999"
            multiline={true}
            textAlignVertical="top"
            value={description}
            onChangeText={text => setDescription(text)}
          />

          {/* Image Upload Row */}
          <View style={styles.imageRow}>
            {images.map((img, i) => (
              <View key={i} style={styles.imageWrapper}>
                <Image source={{ uri: img.uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() =>
                    setImages(images.filter((_, index) => index !== i))
                  }
                >
                  <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 5 && (
              <TouchableOpacity onPress={pickImage} style={styles.addImageBox}>
                <Text style={styles.addImageText}>+</Text>
                <Text style={styles.addLabel}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* <View style={styles.imageRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <TouchableOpacity key={i} style={styles.imageBox}>
                <Image
                  source={require('../../assets/Images/pdf.png')}
                  style={{ width: 60, height: 60, tintColor: '#aaa' }}
                />
              </TouchableOpacity>
            ))}
          </View> */}
          <Text style={styles.fileNote}>
            File size should be less than 500kb
          </Text>

          {/* Map Preview */}
          <Image
            source={require('../../assets/Images/map.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />

          {/* Launch Button */}
          <TouchableOpacity onPress={submitComplaint} style={styles.launchBtn}>
            <Text style={styles.launchText}>Launch Complain</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
  topLeft: {
    position: 'absolute',
    top: 30,
    left: 25,
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
    marginBottom: hp('4%'),
    alignSelf: 'center',
    fontFamily: 'Asap-Regular',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0a1a2f',
    marginLeft: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#0a1a2f',
    textAlign: 'center',
    marginBottom: 20,
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
    paddingVertical: hp('2.3%'),
    fontSize: 14,
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
  eyeButton: {
    padding: 5,
  },
  description: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    height: 120,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
    fontSize: 14,
  },

  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  imageBox: {
    width: 60,
    height: 63,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fileNote: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },

  mapImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },

  launchBtn: {
    backgroundColor: '#07294D',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  launchText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Asap-SemiBold',
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },

  imageWrapper: {
    position: 'relative',
    margin: 5,
  },

  previewImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  removeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  addImageBox: {
    width: wp('20%'),
    height: wp('20%'),
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addImageText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#666',
  },

  addLabel: {
    fontSize: 12,
    color: '#666',
  },
});
