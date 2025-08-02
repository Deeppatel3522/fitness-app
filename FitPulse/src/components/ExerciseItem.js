import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ExerciseItem = ({ exercise, isActive, isCompleted, onPress }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isActive && styles.activeContainer,
        isCompleted && styles.completedContainer
      ]} 
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={[
          styles.name,
          isActive && styles.activeName,
          isCompleted && styles.completedName
        ]}>
          {exercise.name}
        </Text>
        <Text style={[
          styles.details,
          isActive && styles.activeDetails,
          isCompleted && styles.completedDetails
        ]}>
          {exercise.sets} sets × {exercise.reps} reps
        </Text>
        <Text style={[
          styles.rest,
          isActive && styles.activeRest,
          isCompleted && styles.completedRest
        ]}>
          Rest: {exercise.rest}s
        </Text>
      </View>
      <View style={styles.status}>
        {isCompleted ? (
          <Text style={styles.completedIcon}>✓</Text>
        ) : isActive ? (
          <Text style={styles.activeIcon}>▶</Text>
        ) : (
          <Text style={styles.inactiveIcon}>○</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activeContainer: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  completedContainer: {
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  activeName: {
    color: '#2196F3',
  },
  completedName: {
    color: '#4CAF50',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  activeDetails: {
    color: '#2196F3',
  },
  completedDetails: {
    color: '#4CAF50',
  },
  rest: {
    fontSize: 12,
    color: '#999',
  },
  activeRest: {
    color: '#2196F3',
  },
  completedRest: {
    color: '#4CAF50',
  },
  status: {
    marginLeft: 10,
  },
  completedIcon: {
    fontSize: 20,
    color: '#4CAF50',
  },
  activeIcon: {
    fontSize: 16,
    color: '#2196F3',
  },
  inactiveIcon: {
    fontSize: 16,
    color: '#ccc',
  },
});

export default ExerciseItem;
