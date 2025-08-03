// components/RestTimer.js

import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RestTimer = ({ visible, timeLeft, onSkip, nextExercise }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60) || 0;
    const secs = seconds % 60 || 0;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Rest Time</Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          <Text style={styles.next}>Next: {nextExercise}</Text>

          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip Rest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  next: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  skipButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RestTimer;
