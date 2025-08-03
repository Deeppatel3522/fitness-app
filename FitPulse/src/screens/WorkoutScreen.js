import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ExerciseItem from '../components/ExerciseItem';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import RestTimer from '../components/RestTimer';
import { useApp } from '../context/AppContext';
import { getExerciseById, getWorkoutExercises } from '../constants/exerciseCategories'; // Add this import

const WorkoutScreen = ({ navigation, route }) => {
  const { completeWorkout } = useApp();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);

  const workout = route?.params?.workout || {
    name: 'Default Workout',
    duration: '30 min',
    difficulty: 'Intermediate',
    estimatedCalories: 250
  };

  // 🔥 DYNAMIC EXERCISE LOADING - Replace hardcoded exercises
  const getWorkoutExercises = () => {
    // Case 1: Custom workout with exercises array
    if (workout.exercises && Array.isArray(workout.exercises)) {
      // Check if exercises are already full objects or just IDs
      if (workout.exercises.length > 0 && typeof workout.exercises[0] === 'object') {
        return workout.exercises; // Already full exercise objects
      } else {
        // Exercise IDs - resolve them from database
        return workout.exercises.map(id => getExerciseById(id)).filter(Boolean);
      }
    }
    
    // Case 2: Preset workout with exercise IDs
    if (workout.exerciseIds && Array.isArray(workout.exerciseIds)) {
      return workout.exerciseIds.map(id => getExerciseById(id)).filter(Boolean);
    }
    
    // Case 3: Default fallback exercises
    return [
      { id: 1, name: 'Push-ups', sets: 3, reps: 12, rest: 60 },
      { id: 2, name: 'Squats', sets: 3, reps: 15, rest: 60 },
      { id: 3, name: 'Planks', sets: 3, reps: '30 sec', rest: 60 },
      { id: 4, name: 'Lunges', sets: 3, reps: 10, rest: 60 },
      { id: 5, name: 'Burpees', sets: 3, reps: 8, rest: 90 },
    ];
  };

  const exercises = getWorkoutExercises(); // 🔥 Now dynamic!

  // Add safety check for empty exercises
  useEffect(() => {
    if (exercises.length === 0) {
      Alert.alert(
        'No Exercises Found',
        'This workout has no exercises. Returning to home.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [exercises]);

  useEffect(() => {
    if (workoutStarted && !workoutComplete && !isResting) {
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [workoutStarted, workoutComplete, isResting]);

  // Rest timer effect
  useEffect(() => {
    if (isResting && restTime > 0) {
      const restTimer = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(restTimer);
    }
  }, [isResting, restTime]);

  const startWorkout = () => {
    if (exercises.length === 0) {
      Alert.alert('Error', 'No exercises found in this workout');
      return;
    }
    setWorkoutStarted(true);
    Alert.alert('Workout Started!', 'Let\'s get moving! 💪');
  };

  const startRest = (duration) => {
    setIsResting(true);
    setRestTime(duration);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  const nextExercise = () => {
    // Mark current exercise as completed
    if (!completedExercises.includes(currentExercise)) {
      setCompletedExercises([...completedExercises, currentExercise]);
    }

    if (currentExercise < exercises.length - 1) {
      // Start rest period before next exercise
      const restDuration = exercises[currentExercise].rest || 60; // Default 60s rest
      startRest(restDuration);
      setCurrentExercise(currentExercise + 1);
    } else {
      finishWorkout();
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const finishWorkout = async () => {
    setWorkoutComplete(true);
    
    // Calculate calories burned based on duration and intensity
    const estimatedCaloriesPerMinute = workout.estimatedCalories ? workout.estimatedCalories / 30 : 8;
    const caloriesBurned = Math.round((elapsedTime / 60) * estimatedCaloriesPerMinute);
    
    const workoutData = {
      name: workout.name,
      duration: Math.round(elapsedTime / 60), // in minutes
      caloriesBurned,
      exercises: exercises.map(ex => ex.name),
      difficulty: workout.difficulty,
      completedExercises: completedExercises.length,
      totalExercises: exercises.length,
      workoutType: workout.isCustom ? 'custom' : 'preset'
    };

    const success = await completeWorkout(workoutData);
    
    Alert.alert(
      'Workout Complete! 🎉',
      `Great job! You completed ${completedExercises.length}/${exercises.length} exercises in ${Math.floor(elapsedTime / 60)} minutes and burned approximately ${caloriesBurned} calories.`,
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

  // Safety check - prevent division by zero
  const progress = exercises.length > 0 ? ((currentExercise + 1) / exercises.length) * 100 : 0;

  // Show loading or error state if no exercises
  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No exercises found in this workout</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Workout Header */}
        <View style={styles.header}>
          <Text style={styles.workoutTitle}>{workout.name}</Text>
          <Text style={styles.workoutMeta}>
            {workout.duration} • {workout.difficulty}
          </Text>
          <Text style={styles.exerciseCount}>
            {exercises.length} exercises • {workout.estimatedCalories || 'N/A'} cal
          </Text>
          <Timer time={elapsedTime} />
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            Exercise {currentExercise + 1} of {exercises.length}
          </Text>
          <ProgressBar progress={progress} />
          <Text style={styles.completedText}>
            Completed: {completedExercises.length}/{exercises.length} exercises
          </Text>
        </View>

        {/* Current Exercise */}
        {workoutStarted && !workoutComplete && exercises[currentExercise] && (
          <View style={styles.currentExerciseSection}>
            <Text style={styles.currentExerciseTitle}>Current Exercise:</Text>
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
              key={exercise.id || index}
              exercise={exercise}
              isActive={index === currentExercise && workoutStarted}
              isCompleted={completedExercises.includes(index)}
              onPress={() => 
                navigation.navigate('ExerciseDetail', { exercise })
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* Rest Timer Modal */}
      <RestTimer
        visible={isResting}
        timeLeft={restTime}
        onSkip={skipRest}
        nextExercise={currentExercise < exercises.length ? exercises[currentExercise]?.name || 'Next Exercise' : 'Finish'}
      />

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
              onPress={currentExercise === exercises.length - 1 ? finishWorkout : nextExercise}
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
    marginBottom: 5,
  },
  exerciseCount: {
    fontSize: 14,
    color: '#4CAF50',
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
  completedText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  currentExerciseSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  currentExerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
