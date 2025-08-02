import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    age: 28,
    weight: 70,
    height: 175,
    fitnessGoal: 'Muscle Building',
    experience: 'Intermediate',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const fitnessGoals = ['Weight Loss', 'Muscle Building', 'Endurance', 'General Fitness'];
  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    const bmi = profile.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const saveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const cancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const achievements = [
    { title: 'First Workout', description: 'Complete your first workout', achieved: true },
    { title: '7 Day Streak', description: 'Workout for 7 consecutive days', achieved: true },
    { title: 'Burn 1000 Calories', description: 'Burn 1000 calories in workouts', achieved: false },
    { title: '30 Day Challenge', description: 'Complete 30 days of workouts', achieved: false },
  ];

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(parseFloat(bmi));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.goal}>{profile.fitnessGoal}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Health Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{bmi}</Text>
              <Text style={styles.statLabel}>BMI</Text>
              <Text style={styles.statSubtext}>{bmiCategory}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{profile.weight}kg</Text>
              <Text style={styles.statLabel}>Weight</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{profile.height}cm</Text>
              <Text style={styles.statLabel}>Height</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{profile.age}</Text>
              <Text style={styles.statLabel}>Age</Text>
            </View>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Details</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.name}
                  onChangeText={(text) => setEditedProfile({...editedProfile, name: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.age.toString()}
                  onChangeText={(text) => setEditedProfile({...editedProfile, age: parseInt(text) || 0})}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.weight.toString()}
                  onChangeText={(text) => setEditedProfile({...editedProfile, weight: parseInt(text) || 0})}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.height.toString()}
                  onChangeText={(text) => setEditedProfile({...editedProfile, height: parseInt(text) || 0})}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Fitness Goal</Text>
                <Text style={styles.detailValue}>{profile.fitnessGoal}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Experience Level</Text>
                <Text style={styles.detailValue}>{profile.experience}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map((achievement, index) => (
            <View
              key={index}
              style={[
                styles.achievementItem,
                achievement.achieved && styles.achievementAchieved
              ]}
            >
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementEmoji}>
                  {achievement.achieved ? '🏆' : '⭐'}
                </Text>
              </View>
              <View style={styles.achievementContent}>
                <Text style={[
                  styles.achievementTitle,
                  achievement.achieved && styles.achievementTitleAchieved
                ]}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
              </View>
              {achievement.achieved && (
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementBadgeText}>✓</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Stats')}
          >
            <Text style={styles.actionButtonText}>View Statistics</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={() => Alert.alert('Feature Coming Soon', 'Export data feature will be available in a future update.')}
          >
            <Text style={[styles.actionButtonText, styles.secondaryActionButtonText]}>
              Export Data
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  goal: {
    fontSize: 16,
    color: '#666',
  },
  statsSection: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
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
  statSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  detailsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: '#2196F3',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editForm: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  achievementAchieved: {
    backgroundColor: '#e8f5e8',
  },
  achievementIcon: {
    marginRight: 15,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  achievementTitleAchieved: {
    color: '#4CAF50',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  achievementBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryActionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  secondaryActionButtonText: {
    color: '#4CAF50',
  },
});

export default ProfileScreen;
