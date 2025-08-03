import React, { createContext, useContext, useEffect, useReducer } from 'react';
import {
  getUserProfile,
  saveUserProfile,
  getTodayStats,
  updateDailyStats,
  getWorkoutHistory,
  saveWorkoutSession,
  getAchievements,
  updateAchievements,
  getCustomWorkouts,  
  saveCustomWorkout,  
  deleteCustomWorkout 
} from '../services/dataService';

// Initial state - ENSURE customWorkouts is included
const initialState = {
  profile: null,
  todayStats: { workouts: 0, calories: 0, minutes: 0, exercises: 0 },
  workoutHistory: [],
  achievements: [],
  customWorkouts: [], // ✅ MAKE SURE THIS IS HERE
  isLoading: true,
  isFirstLaunch: true,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PROFILE: 'SET_PROFILE',
  SET_TODAY_STATS: 'SET_TODAY_STATS',
  SET_WORKOUT_HISTORY: 'SET_WORKOUT_HISTORY',
  SET_ACHIEVEMENTS: 'SET_ACHIEVEMENTS',
  SET_CUSTOM_WORKOUTS: 'SET_CUSTOM_WORKOUTS', // ✅ MAKE SURE THIS IS HERE
  ADD_CUSTOM_WORKOUT: 'ADD_CUSTOM_WORKOUT',
  REMOVE_CUSTOM_WORKOUT: 'REMOVE_CUSTOM_WORKOUT',
  SET_FIRST_LAUNCH: 'SET_FIRST_LAUNCH',
  ADD_WORKOUT_SESSION: 'ADD_WORKOUT_SESSION',
  UPDATE_STATS: 'UPDATE_STATS'
};

// Reducer - ENSURE all cases handle customWorkouts
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case actionTypes.SET_PROFILE:
      return { ...state, profile: action.payload };
    
    case actionTypes.SET_TODAY_STATS:
      return { ...state, todayStats: action.payload };
    
    case actionTypes.SET_WORKOUT_HISTORY:
      return { ...state, workoutHistory: action.payload };
    
    case actionTypes.SET_ACHIEVEMENTS:
      return { ...state, achievements: action.payload };
    
    case actionTypes.SET_CUSTOM_WORKOUTS: // ✅ MAKE SURE THIS CASE EXISTS
      return { ...state, customWorkouts: action.payload };
    
    case actionTypes.ADD_CUSTOM_WORKOUT:
      return { 
        ...state, 
        customWorkouts: [...state.customWorkouts, action.payload] 
      };
    
    case actionTypes.REMOVE_CUSTOM_WORKOUT:
      return {
        ...state,
        customWorkouts: state.customWorkouts.filter(w => w.id !== action.payload)
      };
    
    case actionTypes.SET_FIRST_LAUNCH:
      return { ...state, isFirstLaunch: action.payload };
    
    case actionTypes.ADD_WORKOUT_SESSION:
      return {
        ...state,
        workoutHistory: [action.payload, ...state.workoutHistory]
      };
    
    case actionTypes.UPDATE_STATS:
      return {
        ...state,
        todayStats: {
          ...state.todayStats,
          ...action.payload
        }
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data with better error handling
  const loadInitialData = async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      // Use Promise.allSettled to handle individual failures gracefully
      const results = await Promise.allSettled([
        getUserProfile(),
        getTodayStats(), 
        getWorkoutHistory(),
        getAchievements(),
        getCustomWorkouts()  // ✅ MAKE SURE THIS IS CALLED
      ]);

      // Extract results with fallbacks
      const profile = results[0].status === 'fulfilled' ? results[0].value : null;
      const todayStats = results[1].status === 'fulfilled' ? results[1].value : { workouts: 0, calories: 0, minutes: 0, exercises: 0 };
      const workoutHistory = results[2].status === 'fulfilled' ? results[2].value : [];
      const achievements = results[3].status === 'fulfilled' ? results[3].value : [];
      const customWorkouts = results[4].status === 'fulfilled' ? results[4].value : []; // ✅ SAFE FALLBACK

      
      // Check if profile is complete for first launch detection
      const isProfileComplete = profile && profile.name && profile.age && profile.weight && profile.height;
      const isFirstLaunch = !isProfileComplete;
      
      
      // Dispatch all data
      dispatch({ type: actionTypes.SET_PROFILE, payload: profile });
      dispatch({ type: actionTypes.SET_TODAY_STATS, payload: todayStats });
      dispatch({ type: actionTypes.SET_WORKOUT_HISTORY, payload: workoutHistory });
      dispatch({ type: actionTypes.SET_ACHIEVEMENTS, payload: achievements });
      dispatch({ type: actionTypes.SET_CUSTOM_WORKOUTS, payload: customWorkouts }); // ✅ MAKE SURE THIS IS DISPATCHED
      dispatch({ type: actionTypes.SET_FIRST_LAUNCH, payload: isFirstLaunch });

      // Log any individual failures
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const labels = ['Profile', 'Stats', 'History', 'Achievements', 'CustomWorkouts'];
          console.error(`Failed to load ${labels[index]}:`, result.reason);
        }
      });

    } catch (error) {
      console.error('Error loading initial data:', error);
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      
      // Set safe defaults to prevent app from breaking
      dispatch({ type: actionTypes.SET_FIRST_LAUNCH, payload: true });
      dispatch({ type: actionTypes.SET_CUSTOM_WORKOUTS, payload: [] }); // ✅ SAFE DEFAULT
      
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
      
    }
  };

  // Load data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Action creators
  const updateProfile = async (profileData) => {
    try {
      const success = await saveUserProfile(profileData);
      if (success) {
        dispatch({ type: actionTypes.SET_PROFILE, payload: profileData });
        dispatch({ type: actionTypes.SET_FIRST_LAUNCH, payload: false });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  };

  const completeWorkout = async (workoutData) => {
    try {
      const statsUpdate = {
        workouts: 1,
        calories: workoutData.caloriesBurned || 0,
        minutes: workoutData.duration || 0,
        exercises: workoutData.exercises?.length || 0
      };

      const success = await saveWorkoutSession(workoutData);
      if (success) {
        const newStats = await updateDailyStats(statsUpdate);
        if (newStats) {
          dispatch({ type: actionTypes.UPDATE_STATS, payload: newStats });
        }

        const newSession = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          ...workoutData
        };
        dispatch({ type: actionTypes.ADD_WORKOUT_SESSION, payload: newSession });

        await checkAchievements(newStats, state.workoutHistory.length + 1);
        
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  };

  const createCustomWorkout = async (workoutTemplate) => {
    try {
      const newWorkout = await saveCustomWorkout(workoutTemplate);
      if (newWorkout) {
        dispatch({ type: actionTypes.ADD_CUSTOM_WORKOUT, payload: newWorkout });
        return newWorkout;
      }
      return null;
    } catch (error) {
      console.error('Error creating custom workout:', error);
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return null;
    }
  };

  const removeCustomWorkout = async (workoutId) => {
    try {
      const success = await deleteCustomWorkout(workoutId);
      if (success) {
        dispatch({ type: actionTypes.REMOVE_CUSTOM_WORKOUT, payload: workoutId });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      return false;
    }
  };

  const checkAchievements = async (todayStats, totalWorkouts) => {
    const newAchievements = [];
    
    if (totalWorkouts === 1) {
      newAchievements.push('first_workout');
    }
    
    if (totalWorkouts === 10) {
      newAchievements.push('10_workouts');
    }
    
    if (todayStats.calories >= 1000) {
      newAchievements.push('1000_calories_day');
    }

    for (const achievement of newAchievements) {
      await updateAchievements(achievement);
    }

    if (newAchievements.length > 0) {
      const allAchievements = await getAchievements();
      dispatch({ type: actionTypes.SET_ACHIEVEMENTS, payload: allAchievements });
    }
  };

  const value = {
    ...state,
    updateProfile,
    completeWorkout,
    createCustomWorkout,
    removeCustomWorkout,
    refreshData: loadInitialData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
