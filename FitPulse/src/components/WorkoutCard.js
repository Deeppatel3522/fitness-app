import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getExerciseImage } from '../constants/exerciseImages';
import { Ionicons } from '@expo/vector-icons';

const WorkoutCard = ({ workout, onPress }) => {
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#2196F3';
    }
  };

  // Get a preview image (you can use the first exercise of the workout)
  const previewImage = workout.previewExercise ? 
    getExerciseImage(workout.previewExercise) : 
    require('../../assets/images/exercises/default-exercise.png');

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={previewImage}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name}>{workout.name}</Text>
        <View style={styles.details}>
          <Text style={styles.duration}>{workout.duration}</Text>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(workout.difficulty) }
          ]}>
            <Text style={styles.difficultyText}>{workout.difficulty}</Text>
          </View>
        </View>
      </View>
      <View style={styles.arrow}>
        <Ionicons name='play' size={16} color={"#4CAF50"}/>
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
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  arrow: {
    marginLeft: 10,
    paddingRight: 25
  },
  arrowText: {
    fontSize: 16,
    color: '#4CAF50',
  },
});

export default WorkoutCard;
