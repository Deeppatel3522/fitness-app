import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StatsScreen from './src/screens/StatsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Home"
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
