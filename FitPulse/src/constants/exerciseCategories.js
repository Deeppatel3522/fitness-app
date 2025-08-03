export const EXERCISE_CATEGORIES = {
  STRENGTH: 'strength',
  CARDIO: 'cardio',
  FLEXIBILITY: 'flexibility',
  HIIT: 'hiit'
};

export const EXERCISE_DATABASE = {
  // Strength Exercises
  [EXERCISE_CATEGORIES.STRENGTH]: [
    { id: 1, name: 'Push-ups', sets: 3, reps: 12, rest: 60, difficulty: 'Beginner', muscle: 'Chest, Arms' },
    { id: 2, name: 'Squats', sets: 3, reps: 15, rest: 60, difficulty: 'Beginner', muscle: 'Legs, Glutes' },
    { id: 3, name: 'Lunges', sets: 3, reps: 10, rest: 60, difficulty: 'Intermediate', muscle: 'Legs, Glutes' },
    { id: 4, name: 'Pull-ups', sets: 3, reps: 8, rest: 90, difficulty: 'Advanced', muscle: 'Back, Arms' },
    { id: 5, name: 'Deadlifts', sets: 3, reps: 8, rest: 120, difficulty: 'Advanced', muscle: 'Full Body' },
  ],
  
  // Cardio Exercises
  [EXERCISE_CATEGORIES.CARDIO]: [
    { id: 6, name: 'Jumping Jacks', sets: 3, reps: 30, rest: 45, difficulty: 'Beginner', muscle: 'Full Body' },
    { id: 7, name: 'High Knees', sets: 3, reps: 20, rest: 45, difficulty: 'Beginner', muscle: 'Legs, Core' },
    { id: 8, name: 'Burpees', sets: 3, reps: 8, rest: 90, difficulty: 'Advanced', muscle: 'Full Body' },
    { id: 9, name: 'Mountain Climbers', sets: 3, reps: 20, rest: 60, difficulty: 'Intermediate', muscle: 'Core, Arms' },
    { id: 10, name: 'Jump Rope', sets: 3, reps: '1 min', rest: 60, difficulty: 'Intermediate', muscle: 'Full Body' },
  ],
  
  // Flexibility Exercises
  [EXERCISE_CATEGORIES.FLEXIBILITY]: [
    { id: 11, name: 'Planks', sets: 3, reps: '30 sec', rest: 60, difficulty: 'Beginner', muscle: 'Core' },
    { id: 12, name: 'Child Pose', sets: 3, reps: '30 sec', rest: 30, difficulty: 'Beginner', muscle: 'Back, Hips' },
    { id: 13, name: 'Downward Dog', sets: 3, reps: '30 sec', rest: 30, difficulty: 'Beginner', muscle: 'Full Body' },
    { id: 14, name: 'Warrior Pose', sets: 3, reps: '45 sec', rest: 45, difficulty: 'Intermediate', muscle: 'Legs, Core' },
  ],
  
  // HIIT Exercises
  [EXERCISE_CATEGORIES.HIIT]: [
    { id: 15, name: 'Sprint Intervals', sets: 5, reps: '30 sec', rest: 30, difficulty: 'Advanced', muscle: 'Legs, Cardio' },
    { id: 16, name: 'Plank Jacks', sets: 4, reps: 15, rest: 45, difficulty: 'Intermediate', muscle: 'Core, Full Body' },
    { id: 17, name: 'Squat Jumps', sets: 4, reps: 12, rest: 60, difficulty: 'Intermediate', muscle: 'Legs, Glutes' },
    { id: 18, name: 'Bear Crawl', sets: 3, reps: '20 steps', rest: 90, difficulty: 'Advanced', muscle: 'Full Body' },
  ]
};

export const PRESET_WORKOUTS = {
  beginner: [
    {
      id: 'beginner_1',
      name: 'Beginner Strength',
      duration: '20 min',
      difficulty: 'Beginner',
      category: EXERCISE_CATEGORIES.STRENGTH,
      exercises: [1, 2, 11], // Push-ups, Squats, Planks
      estimatedCalories: 150
    },
    {
      id: 'beginner_2',
      name: 'Beginner Cardio',
      duration: '15 min',
      difficulty: 'Beginner',
      category: EXERCISE_CATEGORIES.CARDIO,
      exercises: [6, 7], // Jumping Jacks, High Knees
      estimatedCalories: 120
    }
  ],
  intermediate: [
    {
      id: 'intermediate_1',
      name: 'Full Body HIIT',
      duration: '30 min',
      difficulty: 'Intermediate',
      category: EXERCISE_CATEGORIES.HIIT,
      exercises: [16, 17, 9], // Plank Jacks, Squat Jumps, Mountain Climbers
      estimatedCalories: 250
    },
    {
      id: 'intermediate_2',
      name: 'Strength Circuit',
      duration: '35 min',
      difficulty: 'Intermediate',
      category: EXERCISE_CATEGORIES.STRENGTH,
      exercises: [1, 2, 3, 9], // Push-ups, Squats, Lunges, Mountain Climbers
      estimatedCalories: 220
    }
  ],
  advanced: [
    {
      id: 'advanced_1',
      name: 'Elite HIIT',
      duration: '45 min',
      difficulty: 'Advanced',
      category: EXERCISE_CATEGORIES.HIIT,
      exercises: [15, 8, 18], // Sprint Intervals, Burpees, Bear Crawl
      estimatedCalories: 400
    },
    {
      id: 'advanced_2',
      name: 'Strength Master',
      duration: '50 min',
      difficulty: 'Advanced',
      category: EXERCISE_CATEGORIES.STRENGTH,
      exercises: [4, 5, 8, 3], // Pull-ups, Deadlifts, Burpees, Lunges
      estimatedCalories: 350
    }
  ]
};

export const getExerciseById = (id) => {
  for (const category of Object.values(EXERCISE_DATABASE)) {
    const exercise = category.find(ex => ex.id === id);
    if (exercise) return exercise;
  }
  return null;
};

export const getWorkoutExercises = (exerciseIds) => {
  return exerciseIds.map(id => getExerciseById(id)).filter(Boolean);
};
