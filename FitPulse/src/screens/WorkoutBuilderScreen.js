import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EXERCISE_CATEGORIES, EXERCISE_DATABASE } from '../constants/exerciseCategories';
import { useApp } from '../context/AppContext';

const WorkoutBuilderScreen = ({ navigation }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(EXERCISE_CATEGORIES.STRENGTH);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [difficulty, setDifficulty] = useState('Beginner');
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const { createCustomWorkout } = useApp();

  const categories = [
    { key: EXERCISE_CATEGORIES.STRENGTH, label: 'Strength', icon: '💪' },
    { key: EXERCISE_CATEGORIES.CARDIO, label: 'Cardio', icon: '❤️' },
    { key: EXERCISE_CATEGORIES.FLEXIBILITY, label: 'Flexibility', icon: '🧘' },
    { key: EXERCISE_CATEGORIES.HIIT, label: 'HIIT', icon: '🔥' },
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const addExercise = (exercise) => {
    if (!selectedExercises.find(ex => ex.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
    setShowExercisePicker(false);
  };

  const removeExercise = (exerciseId) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== exerciseId));
  };

  const estimateWorkoutDuration = () => {
    const totalSets = selectedExercises.reduce((sum, ex) => sum + ex.sets, 0);
    const averageSetTime = 45; // seconds per set
    const averageRestTime = 60; // seconds rest
    const totalSeconds = totalSets * (averageSetTime + averageRestTime);
    return Math.round(totalSeconds / 60); // minutes
  };

  const estimateCalories = () => {
    const duration = estimateWorkoutDuration();
    const intensityMultiplier = {
      'Beginner': 4,
      'Intermediate': 6,
      'Advanced': 8
    };
    return Math.round(duration * intensityMultiplier[difficulty]);
  };

  const saveCustomWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    const customWorkout = {
      id: `custom_${Date.now()}`,
      name: workoutName,
      duration: `${estimateWorkoutDuration()} min`,
      difficulty,
      category: 'custom',
      exercises: selectedExercises,
      estimatedCalories: estimateCalories(),
      isCustom: true
    };

    const savedWorkout = await createCustomWorkout(customWorkout);

    if (savedWorkout) {
      Alert.alert(
        'Workout Saved! 🎉',
        `Your custom workout "${workoutName}" has been saved to your workout library.`,
        [
          {
            text: 'Start Now',
            onPress: () => navigation.navigate('Workout', { 
              workout: { ...savedWorkout, exercises: selectedExercises } 
            })
          },
          {
            text: 'View My Workouts',
            onPress: () => navigation.navigate('MyWorkouts')
          },
          {
            text: 'Create Another',
            onPress: () => {
              setWorkoutName('');
              setSelectedExercises([]);
              setDifficulty('Beginner');
            }
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Custom Workout</Text>
          <Text style={styles.subtitle}>Build your personalized workout routine</Text>
        </View>

        {/* Workout Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Name</Text>
          <TextInput
            style={styles.input}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="Enter workout name"
            placeholderTextColor="#999"
          />
        </View>

        {/* Difficulty Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty Level</Text>
          <View style={styles.difficultyContainer}>
            {difficulties.map(level => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyButton,
                  difficulty === level && styles.difficultyButtonActive
                ]}
                onPress={() => setDifficulty(level)}
              >
                <Text style={[
                  styles.difficultyText,
                  difficulty === level && styles.difficultyTextActive
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Exercise Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.key && styles.categoryTextActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Exercises */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Exercises ({selectedExercises.length})
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowExercisePicker(true)}
            >
              <Text style={styles.addButtonText}>+ Add Exercise</Text>
            </TouchableOpacity>
          </View>

          {selectedExercises.length > 0 ? (
            selectedExercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} sets × {exercise.reps} reps
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeExercise(exercise.id)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No exercises added yet. Tap "Add Exercise" to get started.
              </Text>
            </View>
          )}
        </View>

        {/* Workout Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Estimated Duration</Text>
              <Text style={styles.summaryValue}>{estimateWorkoutDuration()} min</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Estimated Calories</Text>
              <Text style={styles.summaryValue}>{estimateCalories()} cal</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Exercises</Text>
              <Text style={styles.summaryValue}>{selectedExercises.length}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Create Workout Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.createButton,
            (!workoutName || selectedExercises.length === 0) && styles.createButtonDisabled
          ]}
          onPress={saveCustomWorkout}
          disabled={!workoutName || selectedExercises.length === 0}
        >
          <Text style={styles.createButtonText}>Create Workout</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise Picker Modal */}
      <Modal visible={showExercisePicker} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Exercise</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowExercisePicker(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {Object.entries(EXERCISE_DATABASE).map(([category, exercises]) => (
              <View key={category}>
                <Text style={styles.modalCategoryTitle}>
                  {categories.find(c => c.key === category)?.label || category}
                </Text>
                {exercises.map(exercise => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={[
                      styles.modalExerciseItem,
                      selectedExercises.find(ex => ex.id === exercise.id) && styles.modalExerciseItemSelected
                    ]}
                    onPress={() => addExercise(exercise)}
                    disabled={!!selectedExercises.find(ex => ex.id === exercise.id)}
                  >
                    <View>
                      <Text style={styles.modalExerciseName}>{exercise.name}</Text>
                      <Text style={styles.modalExerciseDetails}>
                        {exercise.sets} sets × {exercise.reps} reps • {exercise.difficulty}
                      </Text>
                    </View>
                    {selectedExercises.find(ex => ex.id === exercise.id) && (
                      <Text style={styles.selectedIcon}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  difficultyButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  difficultyText: {
    fontSize: 14,
    color: '#666',
  },
  difficultyTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#f44336',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bottomSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    backgroundColor: '#f44336',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalCategoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    marginTop: 20,
  },
  modalExerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  modalExerciseItemSelected: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  modalExerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  modalExerciseDetails: {
    fontSize: 14,
    color: '#666',
  },
  selectedIcon: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default WorkoutBuilderScreen;
