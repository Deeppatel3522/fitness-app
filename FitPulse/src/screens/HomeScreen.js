import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import components
import WorkoutCard from '../components/WorkoutCard';
import StatsCard from '../components/StatsCard';
import QuickActionButton from '../components/QuickActionButton';

const HomeScreen = ({ navigation }) => {
  const [todayStats, setTodayStats] = useState({
    workouts: 2,
    calories: 450,
    minutes: 75,
  });

  const quickWorkouts = [
    { 
      id: 1, 
      name: 'Quick Cardio', 
      duration: '15 min', 
      difficulty: 'Beginner',
      previewExercise: 'Jumping Jacks'
    },
    { 
      id: 2, 
      name: 'Strength Training', 
      duration: '30 min', 
      difficulty: 'Intermediate',
      previewExercise: 'Push-ups'
    },
    { 
      id: 3, 
      name: 'Full Body Workout', 
      duration: '45 min', 
      difficulty: 'Advanced',
      previewExercise: 'Burpees'
    },
    { 
      id: 4, 
      name: 'Yoga & Stretch', 
      duration: '20 min', 
      difficulty: 'Beginner',
      previewExercise: 'Planks'
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
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
              title="View Profile"
              icon="👤"
              onPress={handleProfile}
            />
          </View>
        </View>

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
    justifyContent: 'space-around',
  },
  workoutsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
});

export default HomeScreen;
