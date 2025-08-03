import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // ✅ Add this import
import { useApp } from '../context/AppContext';
import WorkoutCard from '../components/WorkoutCard';
import { PRESET_WORKOUTS } from '../constants/exerciseCategories';

const MyWorkoutsScreen = ({ navigation }) => {
  const { customWorkouts, removeCustomWorkout, isLoading } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  // Get all preset workouts for display
  const allPresetWorkouts = [
    ...PRESET_WORKOUTS.beginner,
    ...PRESET_WORKOUTS.intermediate,
    ...PRESET_WORKOUTS.advanced
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDeleteWorkout = (workoutId, workoutName) => {
    Alert.alert(
      'Delete Workout',
      `Are you sure you want to delete "${workoutName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await removeCustomWorkout(workoutId);
            if (success) {
              Alert.alert('Success', 'Workout deleted successfully');
            } else {
              Alert.alert('Error', 'Failed to delete workout');
            }
          }
        }
      ]
    );
  };

  const startWorkout = (workout) => {
    navigation.navigate('Workout', { workout });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Create Button */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Workouts</Text>
            <Text style={styles.subtitle}>
              {customWorkouts.length} custom workouts created
            </Text>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('WorkoutBuilder')}
          >
            <Text style={styles.createButtonText}>+ Create</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Workouts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            My Custom Workouts ({customWorkouts.length})
          </Text>
          
          {customWorkouts.length > 0 ? (
            customWorkouts.map((workout) => (
              <View key={workout.id} style={styles.workoutContainer}>
                <View style={styles.workoutCardWrapper}>
                  <WorkoutCard
                    workout={workout}
                    onPress={() => startWorkout(workout)}
                  />
                  <TouchableOpacity
                    style={styles.deleteButtonX}
                    onPress={() => handleDeleteWorkout(workout.id, workout.name)}
                  >
                    <Ionicons name="close" size={20} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Custom Workouts Yet</Text>
              <Text style={styles.emptyStateText}>
                Create your first custom workout to get started!
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('WorkoutBuilder')}
              >
                <Text style={styles.emptyStateButtonText}>Create First Workout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Preset Workouts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Preset Workouts ({allPresetWorkouts.length})
          </Text>
          
          {allPresetWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onPress={() => startWorkout(workout)}
            />
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Workout Library Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{customWorkouts.length}</Text>
              <Text style={styles.statLabel}>Custom</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{allPresetWorkouts.length}</Text>
              <Text style={styles.statLabel}>Preset</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {customWorkouts.length + allPresetWorkouts.length}
              </Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  workoutContainer: {
    marginBottom: 10,
  },
  workoutCardWrapper: {
    position: 'relative', // Allows absolute positioning of delete button
  },
  deleteButtonX: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'transparent',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsSection: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default MyWorkoutsScreen;
