import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getExerciseImage } from '../constants/exerciseImages';

const { width } = Dimensions.get('window');

const ExerciseDetailScreen = ({ route, navigation }) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState([]);
  
  const exercise = route?.params?.exercise || {
    name: 'Unknown Exercise',
    sets: 3,
    reps: 12,
    rest: 60
  };

  const exerciseInstructions = {
    'Push-ups': [
      'Start in a plank position with arms straight',
      'Lower your body until chest nearly touches the floor',
      'Push back up to starting position',
      'Keep your core tight throughout the movement'
    ],
    'Squats': [
      'Stand with feet shoulder-width apart',
      'Lower your hips back and down as if sitting in a chair',
      'Keep your chest up and knees behind toes',
      'Drive through heels to return to starting position'
    ],
    'Planks': [
      'Start in push-up position on forearms',
      'Keep your body in a straight line',
      'Engage your core and breathe normally',
      'Hold the position for the specified time'
    ],
    'Lunges': [
      'Stand with feet hip-width apart',
      'Step forward with one leg, lowering hips',
      'Keep front knee over ankle, not pushed out past toes',
      'Push back to starting position and repeat'
    ],
    'Burpees': [
      'Start standing, then squat down',
      'Jump feet back into plank position',
      'Do a push-up (optional)',
      'Jump feet back to squat, then jump up with arms overhead'
    ]
  };

  const instructions = exerciseInstructions[exercise.name] || [
    'Follow proper form for this exercise',
    'Maintain control throughout the movement',
    'Breathe steadily during the exercise',
    'Rest between sets as needed'
  ];

  const completeSet = () => {
    if (!completedSets.includes(currentSet)) {
      setCompletedSets([...completedSets, currentSet]);
    }
    if (currentSet < exercise.sets) {
      setCurrentSet(currentSet + 1);
    }
  };

  const resetSets = () => {
    setCurrentSet(1);
    setCompletedSets([]);
  };

  const allSetsComplete = completedSets.length === exercise.sets;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Exercise Header */}
        <View style={styles.header}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <View style={styles.exerciseStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{exercise.sets}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{exercise.reps}</Text>
              <Text style={styles.statLabel}>Reps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{exercise.rest}s</Text>
              <Text style={styles.statLabel}>Rest</Text>
            </View>
          </View>
        </View>

        {/* Exercise Image */}
        <View style={styles.imageSection}>
          <Image 
            source={getExerciseImage(exercise.name)}
            style={styles.exerciseImage}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.fullscreenButton}
            onPress={() => {
              // You can implement fullscreen image view here
              console.log('Open fullscreen image');
            }}
          >
            <Text style={styles.fullscreenButtonText}>🔍 View Fullscreen</Text>
          </TouchableOpacity>
        </View>

        {/* Current Set Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Current Progress</Text>
          <View style={styles.setsContainer}>
            {Array.from({ length: exercise.sets }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.setIndicator,
                  completedSets.includes(index + 1) && styles.setCompleted,
                  currentSet === index + 1 && styles.setActive
                ]}
              >
                <Text style={[
                  styles.setNumber,
                  completedSets.includes(index + 1) && styles.setCompletedText,
                  currentSet === index + 1 && styles.setActiveText
                ]}>
                  {index + 1}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.currentSetText}>
            {allSetsComplete 
              ? 'All sets complete! 🎉' 
              : `Set ${currentSet} of ${exercise.sets}`
            }
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>How to perform:</Text>
          {instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>{index + 1}.</Text>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Tips:</Text>
          <Text style={styles.tipText}>
            • Focus on proper form over speed{'\n'}
            • Breathe steadily throughout the movement{'\n'}
            • Take rest between sets as needed{'\n'}
            • Stop if you feel any pain
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {!allSetsComplete ? (
          <TouchableOpacity style={styles.completeButton} onPress={completeSet}>
            <Text style={styles.completeButtonText}>
              Complete Set {currentSet}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.resetButton]} 
              onPress={resetSets}
            >
              <Text style={styles.actionButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.continueButton]} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.actionButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  imageSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    alignItems: 'center',
  },
  exerciseImage: {
    width: width - 40,
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  fullscreenButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fullscreenButtonText: {
    fontSize: 14,
    color: '#666',
  },
  progressSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  setsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  setIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  setCompleted: {
    backgroundColor: '#4CAF50',
  },
  setActive: {
    backgroundColor: '#2196F3',
  },
  setNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  setCompletedText: {
    color: '#fff',
  },
  setActiveText: {
    color: '#fff',
  },
  currentSetText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  instructionsSection: {
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
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 10,
    minWidth: 25,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  tipsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 100,
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  actionSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#FF9800',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExerciseDetailScreen;
