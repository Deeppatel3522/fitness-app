import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const OnboardingScreen = ({ navigation }) => {
  const { updateProfile } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    fitnessGoal: '',
    experience: ''
  });

  const fitnessGoals = [
    'Weight Loss',
    'Muscle Building', 
    'Endurance',
    'General Fitness',
    'Strength Training'
  ];

  const experienceLevels = [
    'Beginner',
    'Intermediate', 
    'Advanced'
  ];

  const steps = [
    {
      title: "Welcome to FitnessTracker! 👋",
      subtitle: "Let's set up your profile to personalize your fitness journey",
      component: 'welcome'
    },
    {
      title: "What's your name?",
      subtitle: "We'll use this to personalize your experience",
      component: 'name'
    },
    {
      title: "Tell us about yourself",
      subtitle: "This helps us calculate your health metrics",
      component: 'basics'
    },
    {
      title: "Your fitness details",
      subtitle: "Let's customize your workout experience",
      component: 'fitness'
    }
  ];

  const updateField = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        completeOnboarding();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Welcome
        return true;
      case 1: // Name
        if (!profileData.name.trim()) {
          Alert.alert('Required', 'Please enter your name');
          return false;
        }
        return true;
      case 2: // Basics
        if (!profileData.age || !profileData.weight || !profileData.height) {
          Alert.alert('Required', 'Please fill in all your basic information');
          return false;
        }
        if (parseInt(profileData.age) < 13 || parseInt(profileData.age) > 120) {
          Alert.alert('Invalid Age', 'Please enter a valid age between 13 and 120');
          return false;
        }
        return true;
      case 3: // Fitness
        if (!profileData.fitnessGoal || !profileData.experience) {
          Alert.alert('Required', 'Please select your fitness goal and experience level');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const completeOnboarding = async () => {
    const profile = {
      name: profileData.name.trim(),
      age: parseInt(profileData.age),
      weight: parseInt(profileData.weight),
      height: parseInt(profileData.height),
      fitnessGoal: profileData.fitnessGoal,
      experience: profileData.experience,
      joinDate: new Date().toISOString()
    };

    const success = await updateProfile(profile);
    if (success) {
      Alert.alert(
        'Welcome aboard! 🎉',
        'Your profile has been created successfully. Let\'s start your fitness journey!',
        [
          {
            text: 'Let\'s Go!',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to save your profile. Please try again.');
    }
  };

  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.welcomeEmoji}>🏋️‍♀️</Text>
      <Text style={styles.welcomeText}>
        Ready to transform your fitness journey?
      </Text>
      <Text style={styles.welcomeSubtext}>
        We'll help you track workouts, set goals, and achieve amazing results!
      </Text>
    </View>
  );

  const renderName = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.inputLabel}>Your Name</Text>
      <TextInput
        style={styles.input}
        value={profileData.name}
        onChangeText={(text) => updateField('name', text)}
        placeholder="Enter your full name"
        placeholderTextColor="#999"
        autoFocus
      />
    </View>
  );

  const renderBasics = () => (
    <View style={styles.stepContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Age</Text>
        <TextInput
          style={styles.input}
          value={profileData.age}
          onChangeText={(text) => updateField('age', text)}
          placeholder="Your age"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={profileData.weight}
          onChangeText={(text) => updateField('weight', text)}
          placeholder="Your weight in kg"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={profileData.height}
          onChangeText={(text) => updateField('height', text)}
          placeholder="Your height in cm"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={3}
        />
      </View>
    </View>
  );

  const renderFitness = () => (
    <View style={styles.stepContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Primary Fitness Goal</Text>
        <View style={styles.optionsContainer}>
          {fitnessGoals.map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.optionButton,
                profileData.fitnessGoal === goal && styles.optionButtonSelected
              ]}
              onPress={() => updateField('fitnessGoal', goal)}
            >
              <Text style={[
                styles.optionText,
                profileData.fitnessGoal === goal && styles.optionTextSelected
              ]}>
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Experience Level</Text>
        <View style={styles.optionsContainer}>
          {experienceLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.optionButton,
                profileData.experience === level && styles.optionButtonSelected
              ]}
              onPress={() => updateField('experience', level)}
            >
              <Text style={[
                styles.optionText,
                profileData.experience === level && styles.optionTextSelected
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (steps[currentStep].component) {
      case 'welcome': return renderWelcome();
      case 'name': return renderName();
      case 'basics': return renderBasics();
      case 'fitness': return renderFitness();
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStep + 1) / steps.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {currentStep + 1} of {steps.length}
            </Text>
          </View>

          {/* Step Content */}
          <View style={styles.content}>
            <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
            <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>
            
            {renderCurrentStep()}
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.nextButton,
              currentStep === 0 && styles.fullWidthButton
            ]} 
            onPress={nextStep}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Complete Setup' : 
               currentStep === 0 ? 'Get Started' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  progressContainer: {
    padding: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  stepContainer: {
    flex: 1,
  },
  welcomeEmoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  fullWidthButton: {
    flex: 1,
    marginRight: 0,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default OnboardingScreen;
