// components/Timer.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Timer = ({ time }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Elapsed: {formatTime(time)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default Timer;
