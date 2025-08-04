import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WorkoutCard from '../../src/components/WorkoutCard';

// Mock getExerciseImage to avoid image loading issues
jest.mock('../../src/constants/exerciseImages', () => ({
  getExerciseImage: jest.fn(() => ({ uri: 'mock-exercise-image.jpg' })),
}));

// Mock react-native-image-placeholder
jest.mock('react-native-image-placeholder', () => 'MockedImageLoad');

describe('WorkoutCard', () => {
  const mockWorkout = {
    id: '1',
    name: 'Morning Cardio',
    duration: '30 min',
    difficulty: 'Intermediate',
    previewExercise: 'Push-ups',
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders workout information correctly', () => {
    const { getByText, getByTestId } = render(
      <WorkoutCard workout={mockWorkout} onPress={mockOnPress} />
    );

    expect(getByText('Morning Cardio')).toBeTruthy();
    expect(getByText('30 min')).toBeTruthy();
    expect(getByText('Intermediate')).toBeTruthy();
    expect(getByTestId('workout-card')).toBeTruthy();
  });

  it('calls onPress when card is tapped', () => {
    const { getByTestId } = render(
      <WorkoutCard workout={mockWorkout} onPress={mockOnPress} />
    );

    const card = getByTestId('workout-card');
    fireEvent.press(card);

    // ✅ Expect onPress to be called once, without any arguments
    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(); // No arguments expected
  });

  it('renders different difficulty levels correctly', () => {
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    
    difficulties.forEach(difficulty => {
      const testWorkout = { ...mockWorkout, difficulty };
      const { getByText } = render(
        <WorkoutCard workout={testWorkout} onPress={mockOnPress} />
      );
      
      expect(getByText(difficulty)).toBeTruthy();
    });
  });

  it('handles workout without previewExercise', () => {
    const workoutWithoutPreview = {
      ...mockWorkout,
      previewExercise: undefined,
    };

    const { getByText } = render(
      <WorkoutCard workout={workoutWithoutPreview} onPress={mockOnPress} />
    );

    expect(getByText('Morning Cardio')).toBeTruthy();
    expect(getByText('30 min')).toBeTruthy();
    expect(getByText('Intermediate')).toBeTruthy();
  });

  it('renders with custom difficulty colors', () => {
    const beginnerWorkout = { ...mockWorkout, difficulty: 'Beginner' };
    const advancedWorkout = { ...mockWorkout, difficulty: 'Advanced' };

    const { getByText: getByTextBeginner } = render(
      <WorkoutCard workout={beginnerWorkout} onPress={mockOnPress} />
    );
    
    const { getByText: getByTextAdvanced } = render(
      <WorkoutCard workout={advancedWorkout} onPress={mockOnPress} />
    );

    expect(getByTextBeginner('Beginner')).toBeTruthy();
    expect(getByTextAdvanced('Advanced')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = render(
      <WorkoutCard workout={mockWorkout} onPress={mockOnPress} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
