import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    // <KeyboardAvoidingView
    //   style={{ flex: 1, backgroundColor: 'red' }}
    //   behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    // >
    //   <ScrollView
    //     contentContainerStyle={{ flexGrow: 1 }}
    //     keyboardShouldPersistTaps="handled"
    //   >
    <View style={styles.container}>
      {/* Top-right curve */}
      <Image
        source={require('../../assets/Images/topRightDarkCurve.png')}
        style={styles.topRight}
        resizeMode="stretch"
      />

      {/* Title */}
      <Text style={styles.title}>Who Are You?</Text>
      <Text style={styles.subtitle}>
        Please tell us a little bit more about yourself
      </Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleBox,
            selectedRole === 'Parent' && styles.selectedRole,
          ]}
          onPress={() => setSelectedRole('Parent')}
        >
          <Image
            source={
              selectedRole === 'Parent'
                ? require('../../assets/Images/familywhite.png') // white version
                : require('../../assets/Images/familyBlack.png') // black version
            }
            style={{ width: 50, height: 50, marginBottom: 10 }}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.roleText,
              selectedRole === 'Parent' && { color: '#fff' }, // text turns white on dark bg
            ]}
          >
            Parent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleBox,
            selectedRole === 'Employee' && styles.selectedRole,
          ]}
          onPress={() => setSelectedRole('Employee')}
        >
          <Image
            source={
              selectedRole === 'Employee'
                ? require('../../assets/Images/employeeWhite.png') // white version
                : require('../../assets/Images/employeeBlack.png') // black version
            }
            style={{ width: 50, height: 50, marginBottom: 10 }}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.roleText,
              selectedRole === 'Employee' && { color: '#fff' },
            ]}
          >
            Employee
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeScreen')}
        style={styles.loginButton}
      >
        <Text style={styles.loginText}>Continue</Text>
      </TouchableOpacity>

      {/* Signup */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signupLink}>Signin!</Text>
        </TouchableOpacity>
      </View>
    </View>
    //   </ScrollView>
    // </KeyboardAvoidingView>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: hp('13%'),
  },
  title: {
    fontSize: 32,
    color: '#07294D',
    fontFamily: 'Asap-SemiBold',
    marginBottom: hp('2.5%'),
    alignSelf: 'center',
  },

  roleContainer: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  roleBox: {
    flex: 1,
    height: hp('22%'),
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedRole: {
    backgroundColor: '#0A2342',
  },
  roleIcon: {
    fontSize: 30,
    marginBottom: 10,
    color: '#0A2342',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A2342',
  },
  continueBtn: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#0A2342',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    fontSize: 14,
    color: '#555',
  },
  signIn: {
    color: '#0A2342',
    fontWeight: '700',
  },

  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  subtitle: {
    fontSize: 16,
    color: '#07294D',
    marginBottom: hp('4%'),
    alignSelf: 'center',
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

  loginButton: {
    marginTop: hp('30%'),
    backgroundColor: '#07294D',
    borderRadius: 10,
    paddingVertical: hp('2.2%'),

    alignItems: 'center',
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
