import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import components
import WorkoutCard from '../components/WorkoutCard';
import StatsCard from '../components/StatsCard';
import QuickActionButton from '../components/QuickActionButton';

// Import context
import { useApp } from '../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const { todayStats, profile, customWorkouts,  isLoading, refreshData } = useApp();

const hasLoadedRef = useRef(false);

useFocusEffect(
    useCallback(() => {
      if (hasLoadedRef.current) {
        refreshData();
      } else {
        hasLoadedRef.current = true;
      }
    }, [refreshData])
  );

  const quickWorkouts = [
    { 
      id: 1, 
      name: 'Quick Cardio', 
      duration: '15 min', 
      difficulty: 'Beginner',
      previewExercise: 'Jumping Jacks',
      estimatedCalories: 120
    },
    { 
      id: 2, 
      name: 'Strength Training', 
      duration: '30 min', 
      difficulty: 'Intermediate',
      previewExercise: 'Push-ups',
      estimatedCalories: 200
    },
    { 
      id: 3, 
      name: 'Full Body Workout', 
      duration: '45 min', 
      difficulty: 'Advanced',
      previewExercise: 'Burpees',
      estimatedCalories: 350
    },
    { 
      id: 4, 
      name: 'Yoga & Stretch', 
      duration: '20 min', 
      difficulty: 'Beginner',
      previewExercise: 'Planks',
      estimatedCalories: 80
    },
  ];

  const handleStartWorkout = (workout) => {
    navigation.navigate('Workout', { workout });
  };

  const handleViewStats = () => {
    navigation.navigate('Stats');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
          </Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Today's Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.statsRow}>
            <StatsCard
              title="Workouts"
              value={todayStats.workouts}
              icon="💪"
              onPress={handleViewStats}
            />
            <StatsCard
              title="Calories"
              value={todayStats.calories}
              icon="🔥"
              onPress={handleViewStats}
            />
            <StatsCard
              title="Minutes"
              value={todayStats.minutes}
              icon="⏱️"
              onPress={handleViewStats}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <QuickActionButton
                title="Start Workout"
                icon="🏃‍♂️"
                onPress={() => navigation.navigate('Workout')}
            />
            <QuickActionButton
                title="My Workouts"
                icon="📋"
                onPress={() => navigation.navigate('MyWorkouts')}
            />
            <QuickActionButton
                title="Create Workout"
                icon="✨"
                onPress={() => navigation.navigate('WorkoutBuilder')}
            />
            <QuickActionButton
                title="View Profile"
                icon="👤"
                onPress={handleProfile}
            />
            </View>
        </View>

        {customWorkouts.length > 0 && (
          <View style={styles.workoutsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Custom Workouts</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MyWorkouts')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {/* Show first 2 custom workouts */}
            {customWorkouts.slice(0, 2).map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onPress={() => handleStartWorkout(workout)}
              />
            ))}
            
            {customWorkouts.length > 2 && (
              <TouchableOpacity 
                style={styles.viewMoreButton}
                onPress={() => navigation.navigate('MyWorkouts')}
              >
                <Text style={styles.viewMoreText}>
                  View {customWorkouts.length - 2} more workouts →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Recommended Workouts */}
        <View style={styles.workoutsSection}>
          <Text style={styles.sectionTitle}>Recommended Workouts</Text>
          {quickWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onPress={() => handleStartWorkout(workout)}
            />
          ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  statsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  viewMoreButton: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  viewMoreText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  workoutsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
});

export default HomeScreen;
