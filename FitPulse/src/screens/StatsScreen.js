import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StatsScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const periods = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ];

  const weeklyStats = {
    workouts: 5,
    totalTime: 240, // minutes
    calories: 1200,
    avgDuration: 48,
    bestDay: 'Tuesday',
    streak: 3,
  };

  const monthlyStats = {
    workouts: 18,
    totalTime: 960,
    calories: 4800,
    avgDuration: 53,
    bestDay: 'Monday',
    streak: 7,
  };

  const yearlyStats = {
    workouts: 156,
    totalTime: 7800,
    calories: 39000,
    avgDuration: 50,
    bestDay: 'Wednesday',
    streak: 14,
  };

  const getCurrentStats = () => {
    switch(selectedPeriod) {
      case 'week': return weeklyStats;
      case 'month': return monthlyStats;
      case 'year': return yearlyStats;
      default: return weeklyStats;
    }
  };

  const stats = getCurrentStats();

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const workoutHistory = [
    { date: '2025-08-02', name: 'Full Body Workout', duration: 45, calories: 320 },
    { date: '2025-08-01', name: 'Cardio Session', duration: 30, calories: 250 },
    { date: '2025-07-31', name: 'Strength Training', duration: 60, calories: 400 },
    { date: '2025-07-30', name: 'Yoga Flow', duration: 25, calories: 150 },
    { date: '2025-07-29', name: 'HIIT Workout', duration: 35, calories: 280 },
  ];

  const goals = [
    { title: 'Weekly Workouts', current: 5, target: 7, unit: 'workouts' },
    { title: 'Calories Burned', current: 1200, target: 1500, unit: 'cal' },
    { title: 'Total Time', current: 240, target: 300, unit: 'min' },
    { title: 'Workout Streak', current: 3, target: 7, unit: 'days' },
  ];

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.periodButtonTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Stats */}
        <View style={styles.mainStatsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.mainStatCard}>
              <Text style={styles.mainStatValue}>{stats.workouts}</Text>
              <Text style={styles.mainStatLabel}>Workouts</Text>
            </View>
            <View style={styles.mainStatCard}>
              <Text style={styles.mainStatValue}>{stats.calories.toLocaleString()}</Text>
              <Text style={styles.mainStatLabel}>Calories</Text>
            </View>
            <View style={styles.mainStatCard}>
              <Text style={styles.mainStatValue}>{formatTime(stats.totalTime)}</Text>
              <Text style={styles.mainStatLabel}>Total Time</Text>
            </View>
            <View style={styles.mainStatCard}>
              <Text style={styles.mainStatValue}>{stats.avgDuration}min</Text>
              <Text style={styles.mainStatLabel}>Avg Duration</Text>
            </View>
          </View>
        </View>

        {/* Additional Stats */}
        <View style={styles.additionalStatsSection}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.performanceCards}>
            <View style={styles.performanceCard}>
              <Text style={styles.performanceValue}>{stats.streak}</Text>
              <Text style={styles.performanceLabel}>Day Streak</Text>
              <Text style={styles.performanceSubtext}>🔥 Keep it up!</Text>
            </View>
            <View style={styles.performanceCard}>
              <Text style={styles.performanceValue}>{stats.bestDay}</Text>
              <Text style={styles.performanceLabel}>Best Day</Text>
              <Text style={styles.performanceSubtext}>Most active</Text>
            </View>
          </View>
        </View>

        {/* Goals Progress */}
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Weekly Goals</Text>
          {goals.map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalProgress}>
                  {goal.current} / {goal.target} {goal.unit}
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${getProgressPercentage(goal.current, goal.target)}%` }
                  ]}
                />
              </View>
              <Text style={styles.goalPercentage}>
                {Math.round(getProgressPercentage(goal.current, goal.target))}% complete
              </Text>
            </View>
          ))}
        </View>

        {/* Recent Workouts */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          {workoutHistory.map((workout, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyDate}>
                <Text style={styles.historyDateText}>
                  {new Date(workout.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
              </View>
              <View style={styles.historyContent}>
                <Text style={styles.historyName}>{workout.name}</Text>
                <Text style={styles.historyStats}>
                  {workout.duration}min • {workout.calories} cal
                </Text>
              </View>
              <View style={styles.historyIcon}>
                <Text style={styles.historyIconText}>💪</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>🎯 You're doing great!</Text>
            <Text style={styles.insightText}>
              You've completed {stats.workouts} workouts this {selectedPeriod}, 
              burning {stats.calories.toLocaleString()} calories. 
              Keep up the excellent work!
            </Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>📈 Consistency Tip</Text>
            <Text style={styles.insightText}>
              Your best workout day is {stats.bestDay}. Try scheduling more 
              workouts on this day to maximize your results.
            </Text>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 25,
    padding: 5,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#4CAF50',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  mainStatsSection: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mainStatCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  mainStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  mainStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  additionalStatsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  performanceCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceCard: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  performanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  performanceSubtext: {
    fontSize: 12,
    color: '#999',
  },
  goalsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  goalItem: {
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goalProgress: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  goalPercentage: {
    fontSize: 12,
    color: '#666',
  },
  historySection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyDate: {
    width: 60,
    alignItems: 'center',
    marginRight: 15,
  },
  historyDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  historyContent: {
    flex: 1,
  },
  historyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  historyStats: {
    fontSize: 14,
    color: '#666',
  },
  historyIcon: {
    marginLeft: 10,
  },
  historyIconText: {
    fontSize: 20,
  },
  insightsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  insightCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default StatsScreen;
