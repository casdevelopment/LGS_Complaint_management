import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const Timer = ({ initialSeconds, onTimerEnd, onResend }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (seconds === 0) {
      setDisabled(false); // Enable Resend button when timer reaches 0
      onTimerEnd(); // Notify parent that timer ended
    }
  }, [seconds, onTimerEnd]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleResend = () => {
    if (disabled) return;
    setDisabled(true);
    setSeconds(initialSeconds); // Reset timer
    onResend(); // Call the resend OTP function
  };

  return (
    <View style={styles.codecontainer}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.code}>Didn't receive any code?</Text>
        <TouchableOpacity onPress={handleResend} disabled={disabled}>
          <Text
            style={{
              marginLeft: 5,
              color: disabled ? '#94A3B8' : '#07294D',
              fontFamily: 'Asap-SemiBold',
              fontSize: 18,
            }}
          >
            Resend Again
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.timer}>
        {seconds > 0
          ? `Request new code in 00:${seconds < 10 ? `0${seconds}` : seconds}`
          : 'You can resend now'}
      </Text>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  codecontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 50,
  },
  code: {
    fontSize: 16,
    color: '#4D505F',
  },
  timer: {
    fontSize: 13,
    color: '#000000BF',
  },
});
