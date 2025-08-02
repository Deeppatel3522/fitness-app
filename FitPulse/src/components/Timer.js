import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Timer = ({ time }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(time)}</Text>
      <Text style={styles.label}>Elapsed Time</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
});

export default Timer;
