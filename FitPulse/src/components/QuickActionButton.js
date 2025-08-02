import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const QuickActionButton = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 120,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QuickActionButton;
