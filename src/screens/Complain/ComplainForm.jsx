import React from 'react';
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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Dropdown } from 'react-native-element-dropdown';

export default function ComplainForm({ navigation }) {
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
              data={[]}
              labelField="label"
              valueField="value"
              placeholder="Complain Type"
              placeholderStyle={{ color: '#999' }}
              //   value={campus}
              //   onChange={item => setCampus(item.value)}
            />

            <Dropdown
              style={styles.dropdown}
              data={[]}
              labelField="label"
              valueField="value"
              placeholder="Subject"
              placeholderStyle={{ color: '#999' }}
              //   value={classValue}
              //   onChange={item => setClassValue(item.value)}
            />
          </View>
          {/* Description Field */}
          <TextInput
            style={styles.description}
            placeholder="Description"
            placeholderTextColor="#999"
            multiline={true}
            textAlignVertical="top"
          />

          {/* Image Upload Row */}
          <View style={styles.imageRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <TouchableOpacity key={i} style={styles.imageBox}>
                <Image
                  source={require('../../assets/Images/pdf.png')}
                  style={{ width: 60, height: 60, tintColor: '#aaa' }}
                />
              </TouchableOpacity>
            ))}
          </View>
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
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeScreen')}
            style={styles.launchBtn}
          >
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
});
