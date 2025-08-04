import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import { useApp } from '../../src/context/AppContext';

// Mock the context
jest.mock('../../src/context/AppContext');

const mockNavigation = {
  navigate: jest.fn(),
};

describe('HomeScreen', () => {
  const mockContextValue = {
    todayStats: { workouts: 2, calories: 150, minutes: 45 },
    profile: { name: 'John Doe' },
    customWorkouts: [],
    isLoading: false,
    refreshData: jest.fn(),
  };

  beforeEach(() => {
    useApp.mockReturnValue(mockContextValue);
    jest.clearAllMocks();
  });

  it('renders welcome message with user name', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    expect(getByText(/Welcome back, John/i)).toBeTruthy();
  });

  it('displays today stats correctly', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    expect(getByText('2')).toBeTruthy(); // workouts
    expect(getByText('150')).toBeTruthy(); // calories
    expect(getByText('45')).toBeTruthy(); // minutes
  });

  it('shows loading screen when isLoading is true', () => {
    useApp.mockReturnValue({
      ...mockContextValue,
      isLoading: true,
    });

    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    expect(getByText('Loading your data...')).toBeTruthy();
  });

  it('navigates to WorkoutBuilder when Create Workout is pressed', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    const createButton = getByText('Create Workout');
    fireEvent.press(createButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('WorkoutBuilder');
  });
});
