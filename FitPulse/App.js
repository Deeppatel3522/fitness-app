import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Provider
import { AppProvider, useApp } from './src/context/AppContext';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StatsScreen from './src/screens/StatsScreen';
import WorkoutBuilderScreen from './src/screens/WorkoutBuilderScreen';
import MyWorkoutsScreen from './src/screens/MyWorkoutsScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoading, isFirstLaunch } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isFirstLaunch ? "Onboarding" : "Home"}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Fitness Tracker' }}
      />
      <Stack.Screen 
        name="Workout" 
        component={WorkoutScreen} 
        options={{ title: 'Start Workout' }}
      />
      <Stack.Screen 
        name="ExerciseDetail" 
        component={ExerciseDetailScreen} 
        options={{ title: 'Exercise Details' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{ title: 'Statistics' }}
      />
      <Stack.Screen 
        name="WorkoutBuilder" 
        component={WorkoutBuilderScreen} 
        options={{ title: 'Create Workout' }}
      />
      <Stack.Screen 
        name="MyWorkouts" 
        component={MyWorkoutsScreen} 
        options={{ title: 'My Workouts' }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
  );
}
