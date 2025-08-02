import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ExerciseItem from '../components/ExerciseItem';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';

const WorkoutScreen = ({ navigation, route }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const workout = route?.params?.workout || {
    name: 'Default Workout',
    duration: '30 min',
    difficulty: 'Intermediate'
  };

  const exercises = [
    { id: 1, name: 'Push-ups', sets: 3, reps: 12, rest: 60 },
    { id: 2, name: 'Squats', sets: 3, reps: 15, rest: 60 },
    { id: 3, name: 'Planks', sets: 3, reps: '30 sec', rest: 60 },
    { id: 4, name: 'Lunges', sets: 3, reps: 10, rest: 60 },
    { id: 5, name: 'Burpees', sets: 3, reps: 8, rest: 90 },
  ];

  useEffect(() => {
    if (workoutStarted && !workoutComplete) {
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [workoutStarted, workoutComplete]);

  const startWorkout = () => {
    setWorkoutStarted(true);
    Alert.alert('Workout Started!', 'Let\'s get moving! 💪');
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      completeWorkout();
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const completeWorkout = () => {
    setWorkoutComplete(true);
    Alert.alert(
      'Workout Complete! 🎉',
      `Great job! You completed the workout in ${Math.floor(elapsedTime / 60)} minutes and ${elapsedTime % 60} seconds.`,
      [
        {
          text: 'Continue',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const skipExercise = () => {
    nextExercise();
  };

  const progress = ((currentExercise + 1) / exercises.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Workout Header */}
        <View style={styles.header}>
          <Text style={styles.workoutTitle}>{workout.name}</Text>
          <Text style={styles.workoutMeta}>
            {workout.duration} • {workout.difficulty}
          </Text>
          <Timer time={elapsedTime} />
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            Exercise {currentExercise + 1} of {exercises.length}
          </Text>
          <ProgressBar progress={progress} />
        </View>

        {/* Current Exercise */}
        {workoutStarted && !workoutComplete && (
          <View style={styles.currentExerciseSection}>
            <ExerciseItem
              exercise={exercises[currentExercise]}
              isActive={true}
              onPress={() => 
                navigation.navigate('ExerciseDetail', { 
                  exercise: exercises[currentExercise] 
                })
              }
            />
          </View>
        )}

        {/* All Exercises List */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Workout Plan</Text>
          {exercises.map((exercise, index) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              isActive={index === currentExercise && workoutStarted}
              isCompleted={index < currentExercise && workoutStarted}
              onPress={() => 
                navigation.navigate('ExerciseDetail', { exercise })
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* Control Buttons */}
      <View style={styles.controlsSection}>
        {!workoutStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        ) : !workoutComplete ? (
          <View style={styles.workoutControls}>
            <TouchableOpacity 
              style={[styles.controlButton, styles.secondaryButton]} 
              onPress={previousExercise}
              disabled={currentExercise === 0}
            >
              <Text style={styles.controlButtonText}>Previous</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.skipButton]} 
              onPress={skipExercise}
            >
              <Text style={styles.controlButtonText}>Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.primaryButton]} 
              onPress={nextExercise}
            >
              <Text style={styles.controlButtonText}>
                {currentExercise === exercises.length - 1 ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  workoutMeta: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  progressSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  currentExerciseSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  exercisesSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  controlsSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  skipButton: {
    backgroundColor: '#FF9800',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkoutScreen;
