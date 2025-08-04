import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getUserProfile,
  saveUserProfile,
  getCustomWorkouts,
  saveCustomWorkout
} from '../../src/services/dataService';

describe('DataService', () => {
  beforeEach(() => {
    AsyncStorage.clear();
  });

  describe('getUserProfile', () => {
    it('returns null when no profile exists', async () => {
      const profile = await getUserProfile();
      expect(profile).toBeNull();
    });

    it('returns saved profile data', async () => {
      const mockProfile = { name: 'John', age: 30 };
      await AsyncStorage.setItem('user_profile', JSON.stringify(mockProfile));

      const profile = await getUserProfile();
      expect(profile).toEqual(mockProfile);
    });
  });

  describe('saveUserProfile', () => {
    it('saves profile data successfully', async () => {
      const mockProfile = { name: 'Jane', age: 25 };
      
      const result = await saveUserProfile(mockProfile);
      
      expect(result).toBe(true);
      
      const savedData = await AsyncStorage.getItem('user_profile');
      expect(JSON.parse(savedData)).toEqual(mockProfile);
    });
  });

  describe('getCustomWorkouts', () => {
    it('returns empty array when no workouts exist', async () => {
      const workouts = await getCustomWorkouts();
      expect(workouts).toEqual([]);
    });

    it('returns saved custom workouts', async () => {
      const mockWorkouts = [
        { id: '1', name: 'Workout 1' },
        { id: '2', name: 'Workout 2' }
      ];
      await AsyncStorage.setItem('custom_workouts', JSON.stringify(mockWorkouts));

      const workouts = await getCustomWorkouts();
      expect(workouts).toEqual(mockWorkouts);
    });
  });
});
