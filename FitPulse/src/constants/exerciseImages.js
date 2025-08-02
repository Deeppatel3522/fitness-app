// Exercise image mappings
const exerciseImages = {
  'Push-ups': require('../../assets/images/exercises/push-ups.png'),
  'Squats': require('../../assets/images/exercises/squats.png'),
  'Planks': require('../../assets/images/exercises/planks.png'),
  'Lunges': require('../../assets/images/exercises/lunges.png'),
  'Burpees': require('../../assets/images/exercises/burpees.png'),
  'Jumping Jacks': require('../../assets/images/exercises/jumping-jacks.png'),
  'Mountain Climbers': require('../../assets/images/exercises/mountain-climbers.png'),
  'High Knees': require('../../assets/images/exercises/high-knees.png'),
  // Add more exercises as needed
};

// Default image for exercises without specific images
const defaultExerciseImage = require('../../assets/images/exercises/default-exercise.png');

export const getExerciseImage = (exerciseName) => {
  return exerciseImages[exerciseName] || defaultExerciseImage;
};

export default exerciseImages;
