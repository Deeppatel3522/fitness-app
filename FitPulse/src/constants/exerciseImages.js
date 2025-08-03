// Exercise image mappings
const exerciseImages = {
    // Strength
    'Push-ups': require('../../assets/images/exercises/push-ups.png'),
    'Squats': require('../../assets/images/exercises/squats.png'),
    'Lunges': require('../../assets/images/exercises/lunges.png'),
    'Pull-ups': require('../../assets/images/exercises/pull-ups.png'),
    'Deadlifts': require('../../assets/images/exercises/deadlift.png'),
    
    // Cardio
    'Jumping Jacks': require('../../assets/images/exercises/jumping-jacks.png'),
    'High Knees': require('../../assets/images/exercises/high-knees.png'),
    'Burpees': require('../../assets/images/exercises/burpees.png'),
    'Mountain Climbers': require('../../assets/images/exercises/mountain-climbers.png'),
    'Jump Rope': require('../../assets/images/exercises/rope-jump.png'),

    // Flexibility
    'Planks': require('../../assets/images/exercises/planks.png'),
    'Child Pose': require('../../assets/images/exercises/child-pose.png'),
    'Downward Dog': require('../../assets/images/exercises/downword-dog.png'),
    'Warrior Pose': require('../../assets/images/exercises/warrior-pose.png'),

    // HIIT
    'Sprint Intervals': require('../../assets/images/exercises/sprint-intervals.png'),
    'Plank Jacks': require('../../assets/images/exercises/plank-jack.png'),
    'Squat Jumps': require('../../assets/images/exercises/squat-jump.png'),
    'Bear Crawl': require('../../assets/images/exercises/bear-crwal.png')
  // Add more exercises as needed
};

// Default image for exercises without specific images
const defaultExerciseImage = require('../../assets/images/exercises/default-exercise.png');

export const getExerciseImage = (exerciseName) => {
  return exerciseImages[exerciseName] || defaultExerciseImage;
};

export default exerciseImages;
