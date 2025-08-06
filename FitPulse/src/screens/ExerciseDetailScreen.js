import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getExerciseImage } from '../constants/exerciseImages';
import ImageLoader from '../components/ImageLoader'; // ✅ Import ImageLoader

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
    // Strength
    'Push-ups': [
      'Start in a high plank position with hands directly under your shoulders.',
      'Lower your body until your chest nearly touches the floor, keeping your elbows close to your body.',
      'Push back up to the starting position with explosive force.',
      'Keep your core engaged and your back flat throughout the movement.'
    ],
    'Squats': [
      'Stand with feet shoulder-width apart, chest up, and core tight.',
      'Lower your hips back and down as if sitting in a chair, keeping your knees behind your toes.',
      'Go as low as you can comfortably, aiming for thighs parallel to the floor.',
      'Drive through your heels to return to the starting position.'
    ],
    'Lunges': [
      'Stand tall, then take a big step forward with one leg.',
      'Lower your hips until both knees are bent at a 90-degree angle.',
      'Ensure your front knee is directly above your ankle and your back knee hovers just above the ground.',
      'Push off your front foot to return to the start and alternate legs.'
    ],
    'Pull-ups': [
      'Grip the pull-up bar with your hands slightly wider than shoulder-width, palms facing away.',
      'Hang with your arms fully extended, engaging your shoulders and core.',
      'Pull your body up until your chin is over the bar.',
      'Lower yourself back down with control to the starting position.'
    ],
    'Deadlifts': [
      'Stand with your mid-foot under the barbell.',
      'Hinge at your hips and bend your knees to grip the bar, keeping your back straight.',
      'Drive through your legs and lift the weight, keeping it close to your body.',
      'Stand up tall, then lower the weight back to the ground with control.'
    ],

    // Cardio
    'Jumping Jacks': [
      'Start standing with your feet together and arms at your sides.',
      'Simultaneously jump your feet out wide while raising your arms overhead.',
      'Immediately jump back to the starting position.',
      'Maintain a light and quick pace.'
    ],
    'High Knees': [
      'Stand in place with your feet hip-width apart.',
      'Drive your right knee up towards your chest as high as you can.',
      'Quickly switch and drive your left knee up.',
      'Continue alternating legs at a running pace.'
    ],
    'Burpees': [
      'Start standing, then drop into a squat with your hands on the ground.',
      'Kick your feet back into a high plank position.',
      'Immediately return your feet to the squat position.',
      'Jump up explosively from the squat position with your arms overhead.'
    ],
    'Mountain Climbers': [
      'Start in a high plank position with your hands under your shoulders.',
      'Drive your right knee towards your chest, then return it to the start.',
      'Immediately drive your left knee towards your chest.',
      'Continue alternating legs in a running motion while keeping your hips low.'
    ],
    'Jump Rope': [
      'Hold the jump rope handles with a firm grip.',
      'Swing the rope over your head and jump with both feet as it passes under you.',
      'Keep your jumps low to the ground and land softly on the balls of your feet.',
      'Maintain a steady rhythm and keep your core engaged.'
    ],

    // Flexibility
    'Planks': [
      'Place your forearms on the ground with elbows directly under your shoulders.',
      'Extend your legs back, forming a straight line from your head to your heels.',
      'Engage your core and glutes to prevent your hips from sagging.',
      'Hold this position and breathe steadily for the specified time.'
    ],
    'Child Pose': [
      'Kneel on the floor, then sit back on your heels.',
      'Hinge at your hips and fold forward, resting your forehead on the floor.',
      'Extend your arms out in front of you or rest them alongside your body.',
      'Breathe deeply and relax into the stretch.'
    ],
    'Downward Dog': [
      'Start on your hands and knees.',
      'Lift your hips up and back, forming an inverted V-shape with your body.',
      'Press your hands firmly into the floor and gently pedal your feet to stretch your hamstrings.',
      'Keep your head between your upper arms, looking towards your knees.'
    ],
    'Warrior Pose': [
      'Step your feet wide apart.',
      'Turn your right foot out 90 degrees and your left foot in slightly.',
      'Bend your right knee, keeping it over your ankle, and extend your arms parallel to the floor.',
      'Hold the pose, gazing over your right hand, then switch sides.'
    ],

    // HIIT
    'Sprint Intervals': [
      'Find an open space or use a treadmill.',
      'Warm up for 3-5 minutes with a light jog.',
      'Sprint at your maximum effort for the specified time.',
      'Slow down to a walk or light jog for the rest/recovery period.'
    ],
    'Plank Jacks': [
      'Start in a high plank position with your feet together.',
      'Keeping your core tight, jump your feet out wide.',
      'Immediately jump your feet back together to the starting position.',
      'Maintain a stable upper body and avoid letting your hips bounce.'
    ],
    'Squat Jumps': [
      'Start in a squat position with your thighs parallel to the floor.',
      'Engage your core and jump up explosively, extending your legs fully.',
      'Land softly back in the squat position to absorb the impact.',
      'Immediately go into the next jump.'
    ],
    'Bear Crawl': [
      'Start on all fours with your hands under your shoulders and knees under your hips.',
      'Lift your knees slightly off the ground, keeping your back flat.',
      'Move one hand and the opposite foot forward a short distance.',
      'Continue crawling forward, alternating sides, while keeping your hips low.'
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

        {/* ✅ Exercise Image with ImageLoader */}
        <View style={styles.imageSection}>
          <ImageLoader
            source={getExerciseImage(exercise.name)}
            placeholderSource={require('../../assets/images/exercise-placeholder.png')} // ✅ Add placeholder
            style={styles.exerciseImage}
            resizeMode="contain"
            loaderColor="#4CAF50"
            loaderSize="large"
          />
          
          {/* Optional: Fullscreen Button */}
          {/* <TouchableOpacity 
            style={styles.fullscreenButton}
            onPress={() => {
              // You can implement fullscreen image view here
              console.log('Open fullscreen image');
            }}
          >
            <Text style={styles.fullscreenButtonText}>🔍 View Fullscreen</Text>
          </TouchableOpacity> */}
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

// ✅ Updated styles (same as before, no changes needed)
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
    resizeMode: 'center',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9', // ✅ Background color while loading
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
