import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  showToggle = false,
  error,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#999"
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={showToggle ? !visible : secureTextEntry}
        />

        {showToggle && (
          <TouchableOpacity
            onPress={() => setVisible(!visible)}
            style={styles.eyeButton}
          >
            <Image
              source={
                visible
                  ? require('../../assets/Images/visible.png')
                  : require('../../assets/Images/hide.png')
              }
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: hp('2.2%'),
    fontSize: 14,
  },
  eyeButton: { padding: 5 },
  eyeIcon: { width: 20, height: 20, tintColor: '#555' },
  error: { fontSize: 12, color: 'red', marginTop: 4 },
});
