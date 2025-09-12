import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const CustomDropdown = ({
  data,
  value,
  onChange,
  placeholder,
  error,
  disabled,
}) => {
  return (
    <View style={{ marginBottom: 12 }}>
      <Dropdown
        style={[styles.dropdown, disabled && { backgroundColor: '#eee' }]} // 👈 gray out when disabled
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={item => onChange(item.value)}
        disable={disabled}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdown: {
    height: 55,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
});
