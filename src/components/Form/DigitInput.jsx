import { StyleSheet, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const DigitInput = ({ onComplete, reset }) => {
  const inputRefs = Array.from({ length: 5 }, () => useRef(null));
  const [values, setValues] = useState(Array(5).fill(''));

  useEffect(() => {
    setValues(Array(5).fill(''));
    inputRefs[0].current.focus();
  }, [reset]);

  const handleTextChange = (text, index) => {
    const newValues = [...values];
    newValues[index] = text;
    setValues(newValues);

    if (text.length === 1 && index === inputRefs.length - 1) {
      const completeCode = newValues.join('');
      onComplete(completeCode);
    }

    if (text.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      index > 0 &&
      values[index] === ''
    ) {
      const newValues = [...values];
      newValues[index - 1] = '';
      setValues(newValues);
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <View style={styles.container}>
      {inputRefs.map((_, index) => (
        <TextInput
          key={index}
          ref={inputRefs[index]}
          style={styles.DigitInputStyle}
          keyboardType="number-pad"
          maxLength={1}
          value={values[index]}
          onChangeText={text => handleTextChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          textAlign="center"
        />
      ))}
    </View>
  );
};

export default DigitInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  DigitInputStyle: {
    width: wp('15%'),
    height: hp('8%'),
    borderRadius: 10,
    borderWidth: 1,
  },
});
