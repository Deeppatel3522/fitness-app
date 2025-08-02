import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const StatsCard = ({ title, value, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default StatsCard;
