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
  Platform,
  PermissionsAndroid,
  FlatList,
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
import Loader from '../../components/Loader/Loader';
import Geolocation from '@react-native-community/geolocation';
import { pick, keepLocalCopy } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import { launchCamera } from 'react-native-image-picker';
import AudioRecord from 'react-native-audio-record';

export default function ComplainForm({ navigation, route }) {
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const { campus, category, subcategory } = route.params; // 👈 now you have both!
  console.log(campus, category, subcategory, 'oooooppp');
  const [complainTypes, setComplainTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [files, setFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  console.log(coords, 'coordsss');

  useEffect(() => {
    (async () => {
      await requestPermissions(); // ask once when screen loads
    })();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return Object.values(grants).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED,
        );
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true;
  };

  // ✅ File size check (max 500KB)
  const checkFileSize = async uri => {
    try {
      const stat = await RNFS.stat(uri.replace('file://', ''));
      return stat.size <= 500 * 1024;
    } catch {
      return false;
    }
  };

  // 📂 Pick any document
  const handleDocumentPick = async () => {
    if (files.length >= 5) return Alert.alert('Limit Reached', 'Max 5 files');
    const hasPerm = await requestPermissions();
    if (!hasPerm) return;

    try {
      const [file] = await pick({ types: ['*/*'] });
      if (file) {
        // const valid = await checkFileSize(file.uri);
        // if (!valid) return Alert.alert('File too large', 'Max 500KB');

        setFiles(prev => [...prev, file]);

        await keepLocalCopy({
          files: [{ uri: file.uri, fileName: file.name }],
          destination: 'documentDirectory',
        });
      }
    } catch (err) {
      console.log('Doc pick error:', err);
    }
  };

  // 📸 Capture photo
  const captureImage = async () => {
    if (files.length >= 5) return Alert.alert('Limit Reached', 'Max 5 files');
    const hasPerm = await requestPermissions();
    if (!hasPerm) return;
    const res = await launchCamera({ mediaType: 'photo' });
    if (!res.didCancel && res.assets?.length) {
      const file = res.assets[0];
      // const valid = await checkFileSize(file.uri);
      // if (!valid) return Alert.alert('File too large', 'Max 500KB');
      setFiles(prev => [...prev, file]);
    }
  };

  // 🎥 Capture video
  const captureVideo = async () => {
    if (files.length >= 5) return Alert.alert('Limit Reached', 'Max 5 files');
    const hasPerm = await requestPermissions();
    if (!hasPerm) return;
    const res = await launchCamera({ mediaType: 'video' });
    if (!res.didCancel && res.assets?.length) {
      const file = res.assets[0];
      // const valid = await checkFileSize(file.uri);
      // if (!valid) return Alert.alert('File too large', 'Max 500KB');
      setFiles(prev => [...prev, file]);
    }
  };

  // 🎤 Audio recording
  const startRecording = async () => {
    if (files.length >= 5) return Alert.alert('Limit Reached', 'Max 5 files');
    const hasPerm = await requestPermissions();
    if (!hasPerm) return;

    AudioRecord.init({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: `audio_${Date.now()}.wav`,
    });

    AudioRecord.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    const audioFilePath = await AudioRecord.stop();
    setIsRecording(false);

    if (!audioFilePath) {
      console.warn('No audio file returned');
      return;
    }

    const valid = await checkFileSize(`file://${audioFilePath}`);
    if (!valid) {
      RNFS.unlink(audioFilePath);
      return Alert.alert('File too large', 'Max 500KB');
    }

    setFiles(prev => [
      ...prev,
      {
        uri: `file://${audioFilePath}`,
        type: 'audio/wav',
        name: `audio_${Date.now()}.wav`,
      },
    ]);
  };
  // 🎤 Toggle Audio Recording
  const toggleRecording = async () => {
    const hasPerm = await requestPermissions();
    if (!hasPerm) return;

    if (!isRecording) {
      // Start recording
      AudioRecord.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        wavFile: `audio_${Date.now()}.wav`,
      });

      AudioRecord.start();
      setIsRecording(true);
    } else {
      // Stop recording
      const audioFilePath = await AudioRecord.stop();
      setIsRecording(false);

      if (!audioFilePath) {
        console.warn('No audio file returned');
        return;
      }

      const valid = await checkFileSize(`file://${audioFilePath}`);
      if (!valid) {
        RNFS.unlink(audioFilePath);
        return Alert.alert('File too large', 'Max 500KB');
      }

      setFiles(prev => [
        ...prev,
        {
          uri: `file://${audioFilePath}`,
          type: 'audio/wav',
          name: `audio_${Date.now()}.wav`,
        },
      ]);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchComplainTypes();
    getLocation(isMounted);

    return () => {
      isMounted = false;
    };
  }, []);
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (hasPermission) return true;

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need your location to submit complaints',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // For iOS you should still add NSLocationWhenInUseUsageDescription in Info.plist
  };

  const getLocation = async isMounted => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Please enable location services in settings to submit complaints',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      pos => {
        if (isMounted) {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          console.log(
            'User location:',
            pos.coords.latitude,
            pos.coords.longitude,
          );
        }
      },
      error => {
        console.error('Location error:', error);
        if (isMounted) {
          Alert.alert('Error', 'Unable to fetch location');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

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
  const getExtensionFromType = type => {
    if (!type) return 'bin';
    const map = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'video/mp4': 'mp4',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
      'application/pdf': 'pdf',
    };
    return map[type] || 'bin';
  };
  const submitComplaint = async () => {
    if (!location || !subject || !description || !selectedType) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('CampusId', campus.schoolId);
    formData.append('ComplaintCategoryId', category.complainCategoryId);
    formData.append('ComplaintTypeId', selectedType);
    formData.append('LocationAddress', location);
    formData.append('ComplaintSubject', subject);
    formData.append('Latitude', coords.latitude || '');
    formData.append('Longitude', coords.longitude || '');
    formData.append('Description', description);
    formData.append('UserId', user.id);
    // 🔹 Add images as file1, file2, ...
    // images.forEach((img, index) => {
    //   formData.append(`file${index + 1}`, {
    //     uri: img.uri,
    //     type: img.type || 'image/jpeg',
    //     name: img.fileName || `complain_${index + 1}.jpg`,
    //   });
    // });
    files.forEach((file, index) => {
      const extension = getExtensionFromType(file.type);
      const fileName = file.name
        ? file.name // if picker already gives correct name (like PDF, IMG-xxx.jpg)
        : `file_${index + 1}.${extension}`; // fallback

      formData.append(`file${index + 1}`, {
        uri: file.uri,
        type: file.type,
        name: fileName,
      });
    });
    console.log(formData, 'formdata');

    try {
      setLoading(true);
      const res = await launchComplaint(formData);
      Alert.alert('Success', 'Complaint submitted successfully!');
      navigation.navigate('HomeScreen');
    } catch (err) {
      console.error('Error submitting complaint:', err.response?.data || err);
      Alert.alert('Error', 'Failed to submit complaint');
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
              placeholder="Complaint Type"
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
          {/* Upload Options */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginVertical: 10,
            }}
          >
            <TouchableOpacity onPress={handleDocumentPick} style={styles.btn}>
              <Text>📂 File</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={captureImage} style={styles.btn}>
              <Text>📸 Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={captureVideo} style={styles.btn}>
              <Text>🎥 Video</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleRecording} style={styles.btn}>
              <Text>
                {isRecording ? '⏹ Stop Recording' : '🎤 Start Recording'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Files Preview */}
          {/* Files Preview */}
          <FlatList
            horizontal
            data={files}
            keyExtractor={(item, i) => i.toString()}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item, index }) => (
              <View style={styles.fileWrapper}>
                {/* Preview depending on file type */}
                {item.type?.startsWith('image/') ? (
                  <Image source={{ uri: item.uri }} style={styles.fileImage} />
                ) : item.type?.startsWith('video/') ? (
                  <Text style={styles.fileEmoji}>🎥</Text>
                ) : item.type?.startsWith('audio/') ? (
                  <Text style={styles.fileEmoji}>🎧</Text>
                ) : (
                  <Text style={styles.fileEmoji}>📄</Text>
                )}

                {/* File name */}
                <Text numberOfLines={1} style={styles.fileName}>
                  {item.name || 'file'}
                </Text>

                {/* ❌ Remove button */}
                <TouchableOpacity
                  style={styles.removeFileBtn}
                  onPress={() =>
                    setFiles(prev => prev.filter((_, i) => i !== index))
                  }
                >
                  <Text style={styles.removeFileText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* <View style={styles.imageRow}>
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
          </View> */}
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
            <Text style={styles.launchText}>Launch Complaint</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loading && <Loader />}
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
    top: 45,
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
  btn: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  fileWrapper: {
    width: 70,
    height: 90,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    position: 'relative',
    padding: 5,
  },

  fileImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginBottom: 5,
  },

  fileEmoji: {
    fontSize: 28,
    marginBottom: 5,
  },

  fileName: {
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
    width: '100%',
  },

  removeFileBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ff4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  removeFileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 14,
  },
});
