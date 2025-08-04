import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AppProvider, useApp } from '../../src/context/AppContext';
import * as dataService from '../../src/services/dataService';

// Mock the data service
jest.mock('../../src/services/dataService');

describe('AppContext', () => {
  const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    expect(result.current.todayStats).toEqual({
      workouts: 0,
      calories: 0,
      minutes: 0,
      exercises: 0
    });
    expect(result.current.customWorkouts).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('updates profile successfully', async () => {
    dataService.saveUserProfile.mockResolvedValue(true);
    
    const { result } = renderHook(() => useApp(), { wrapper });

    const newProfile = {
      name: 'Jane Doe',
      age: 25,
      weight: 60,
      height: 165
    };

    await act(async () => {
      const success = await result.current.updateProfile(newProfile);
      expect(success).toBe(true);
    });

    expect(dataService.saveUserProfile).toHaveBeenCalledWith(newProfile);
  });

  it('creates custom workout successfully', async () => {
    const mockWorkout = {
      name: 'Test Workout',
      duration: '30 min',
      difficulty: 'Beginner',
      exercises: []
    };

    dataService.saveCustomWorkout.mockResolvedValue({
      id: 'custom_123',
      ...mockWorkout
    });

    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      const savedWorkout = await result.current.createCustomWorkout(mockWorkout);
      expect(savedWorkout.id).toBe('custom_123');
    });
  });
});
