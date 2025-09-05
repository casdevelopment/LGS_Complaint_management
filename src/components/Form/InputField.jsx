import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputField = ({
  label,
  placeholder,
  isPassword,
  onChangeValue,
  limit = 100,
  value,
}) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={isPassword}
        value={value}
        onChangeText={val => onChangeValue(val)}
        maxLength={limit}
        autoCapitalize="none"
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    // fontFamily: 'Urbanist',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 18,
    marginBottom: 15,
    color: '#fff',
    // fontFamily: 'Urbanist',
  },
});
