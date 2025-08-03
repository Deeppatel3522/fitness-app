import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { getDailyStats } from '../services/dataService';

const StatsScreen = ({ navigation }) => {
  const { workoutHistory, todayStats } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [statsData, setStatsData] = useState({});

  useEffect(() => {
    loadStatsData();
  }, [workoutHistory, selectedPeriod]);

  const loadStatsData = async () => {
    const dailyStats = await getDailyStats();
    setStatsData(dailyStats);
  };

  const periods = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ];

  const calculatePeriodStats = () => {
    const now = new Date();
    let startDate;

    switch(selectedPeriod) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    const filteredWorkouts = workoutHistory.filter(workout => 
      new Date(workout.date) >= startDate
    );

    const totalWorkouts = filteredWorkouts.length;
    const totalTime = filteredWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const totalCalories = filteredWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalTime / totalWorkouts) : 0;

    // Find best day
    const dayCount = {};
    filteredWorkouts.forEach(workout => {
      const day = new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long' });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    const bestDay = Object.keys(dayCount).reduce((a, b) => 
      dayCount[a] > dayCount[b] ? a : b, 'Monday'
    ) || 'Monday';

    return {
      workouts: totalWorkouts,
      totalTime,
      calories: totalCalories,
      avgDuration,
      bestDay,
      streak: calculateStreak()
    };
  };

  const calculateStreak = () => {
    if (workoutHistory.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const hasWorkout = workoutHistory.some(workout => 
        new Date(workout.date).toDateString() === dateString
      );
      
      if (hasWorkout) {
        streak++;
      } else if (i > 0) { // Allow for today to not have a workout yet
        break;
      }
    }
    
    return streak;
  };

  const stats = calculatePeriodStats();

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const recentWorkouts = workoutHistory.slice(0, 5);

  const goals = [
    { title: 'Weekly Workouts', current: stats.workouts, target: 5, unit: 'workouts' },
    { title: 'Calories Burned', current: stats.calories, target: 2000, unit: 'cal' },
    { title: 'Total Time', current: stats.totalTime, target: 150, unit: 'min' },
    { title: 'Workout Streak', current: stats.streak, target: 7, unit: 'days' },
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

        {/* Performance Cards */}
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
          {recentWorkouts.length > 0 ? recentWorkouts.map((workout, index) => (
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
                  {workout.duration}min • {workout.caloriesBurned} cal
                </Text>
              </View>
              <View style={styles.historyIcon}>
                <Text style={styles.historyIconText}>💪</Text>
              </View>
            </View>
          )) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No workouts yet. Start your fitness journey!</Text>
            </View>
          )}
        </View>

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>🎯 Progress Summary</Text>
            <Text style={styles.insightText}>
              You've completed {stats.workouts} workouts this {selectedPeriod}, 
              burning {stats.calories.toLocaleString()} calories in {formatTime(stats.totalTime)}. 
              {stats.workouts > 0 ? 'Keep up the excellent work!' : 'Start your first workout today!'}
            </Text>
          </View>
          {stats.workouts > 0 && (
            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>📈 Consistency Tip</Text>
              <Text style={styles.insightText}>
                Your best workout day is {stats.bestDay}. Try scheduling more 
                workouts on this day to maximize your results and build consistency.
              </Text>
            </View>
          )}
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
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
