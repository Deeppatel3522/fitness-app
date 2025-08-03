import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  USER_PROFILE: 'user_profile',
  WORKOUT_HISTORY: 'workout_history',
  DAILY_STATS: 'daily_stats',
  SETTINGS: 'app_settings',
  ACHIEVEMENTS: 'achievements',
  CUSTOM_WORKOUTS: 'custom_workouts'
};

// Default data structures
const DEFAULT_PROFILE = null;

const DEFAULT_SETTINGS = {
  reminderEnabled: true,
  reminderTime: '09:00',
  soundEnabled: true,
  theme: 'light'
};

// User Profile Methods
export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

export const getUserProfile = async () => {
  try {
    const profileData = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null; 
  }
};

export const isProfileComplete = (profile) => {
  if (!profile) return false;
  const requiredFields = ['name', 'age', 'weight', 'height', 'fitnessGoal', 'experience'];
  return requiredFields.every(field => 
    profile[field] !== null && 
    profile[field] !== undefined && 
    profile[field] !== ''
  );
};

// Workout History Methods
export const saveWorkoutSession = async (workoutData) => {
  try {
    const history = await getWorkoutHistory();
    const newSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...workoutData
    };
    history.unshift(newSession); // Add to beginning of array
    
    // Keep only last 100 workouts
    if (history.length > 100) {
      history.splice(100);
    }
    
    await AsyncStorage.setItem(KEYS.WORKOUT_HISTORY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error saving workout session:', error);
    return false;
  }
};

export const getWorkoutHistory = async () => {
  try {
    const historyData = await AsyncStorage.getItem(KEYS.WORKOUT_HISTORY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error('Error getting workout history:', error);
    return [];
  }
};

// Daily Stats Methods
export const updateDailyStats = async (statsUpdate) => {
  try {
    const today = new Date().toDateString();
    const dailyStats = await getDailyStats();
    
    if (!dailyStats[today]) {
      dailyStats[today] = {
        workouts: 0,
        calories: 0,
        minutes: 0,
        exercises: 0
      };
    }
    
    // Update stats
    Object.keys(statsUpdate).forEach(key => {
      dailyStats[today][key] += statsUpdate[key];
    });
    
    await AsyncStorage.setItem(KEYS.DAILY_STATS, JSON.stringify(dailyStats));
    return dailyStats[today];
  } catch (error) {
    console.error('Error updating daily stats:', error);
    return null;
  }
};

export const getDailyStats = async () => {
  try {
    const statsData = await AsyncStorage.getItem(KEYS.DAILY_STATS);
    return statsData ? JSON.parse(statsData) : {};
  } catch (error) {
    console.error('Error getting daily stats:', error);
    return {};
  }
};

export const getTodayStats = async () => {
  try {
    const today = new Date().toDateString();
    const dailyStats = await getDailyStats();
    return dailyStats[today] || { workouts: 0, calories: 0, minutes: 0, exercises: 0 };
  } catch (error) {
    console.error('Error getting today stats:', error);
    return { workouts: 0, calories: 0, minutes: 0, exercises: 0 };
  }
};

// Settings Methods
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const getSettings = async () => {
  try {
    const settingsData = await AsyncStorage.getItem(KEYS.SETTINGS);
    return settingsData ? JSON.parse(settingsData) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// Achievement Methods
export const updateAchievements = async (achievementId) => {
  try {
    const achievements = await getAchievements();
    if (!achievements.includes(achievementId)) {
      achievements.push(achievementId);
      await AsyncStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    }
    return achievements;
  } catch (error) {
    console.error('Error updating achievements:', error);
    return [];
  }
};

export const getAchievements = async () => {
  try {
    const achievementsData = await AsyncStorage.getItem(KEYS.ACHIEVEMENTS);
    return achievementsData ? JSON.parse(achievementsData) : [];
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

// Utility Methods
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export const exportData = async () => {
  try {
    const data = {};
    for (const key of Object.values(KEYS)) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        data[key] = JSON.parse(value);
      }
    }
    return data;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

// Custom Workout Template Methods (ADD THESE)
export const saveCustomWorkout = async (workoutTemplate) => {
  try {
    const customWorkouts = await getCustomWorkouts();
    const newWorkout = {
      id: `custom_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...workoutTemplate
    };
    
    customWorkouts.push(newWorkout);
    await AsyncStorage.setItem(KEYS.CUSTOM_WORKOUTS, JSON.stringify(customWorkouts));
    return newWorkout;
  } catch (error) {
    console.error('Error saving custom workout:', error);
    return null;
  }
};  

export const getCustomWorkouts = async () => {
  try {
    const workoutsData = await AsyncStorage.getItem(KEYS.CUSTOM_WORKOUTS);
    return workoutsData ? JSON.parse(workoutsData) : [];
  } catch (error) {
    console.error('Error getting custom workouts:', error);
    return [];
  }
};

export const deleteCustomWorkout = async (workoutId) => {
  try {
    const customWorkouts = await getCustomWorkouts();
    const filteredWorkouts = customWorkouts.filter(w => w.id !== workoutId);
    await AsyncStorage.setItem(KEYS.CUSTOM_WORKOUTS, JSON.stringify(filteredWorkouts));
    return true;
  } catch (error) {
    console.error('Error deleting custom workout:', error);
    return false;
  }
};
