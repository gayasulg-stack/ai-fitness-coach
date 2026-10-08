export type FitnessGoal = 
  | 'build_muscle' 
  | 'lose_weight' 
  | 'improve_fitness' 
  | 'increase_strength' 
  | 'improve_endurance' 
  | 'stay_active';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutLocation = 'gym' | 'home' | 'outdoors' | 'both';

export type EquipmentItem = 
  | 'No Equipment' 
  | 'Dumbbells' 
  | 'Barbell' 
  | 'Resistance Bands' 
  | 'Machines' 
  | 'Kettlebells' 
  | 'Pull-up Bar' 
  | 'Full Gym';

export type WorkoutDurationPref = '15–30 min' | '30–45 min' | '45–60 min' | '60+ min';

export interface UserProfile {
  name: string;
  email?: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  goal: FitnessGoal;
  experience: ExperienceLevel;
  location: WorkoutLocation;
  equipment: EquipmentItem[];
  frequencyDaysPerWeek: number;
  preferredDuration: WorkoutDurationPref;
  completedOnboarding: boolean;
  streakDays: number;
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft';
  aiPersona: 'supportive' | 'technical' | 'strict';
}

export interface ExerciseSetLog {
  setNumber: number;
  weight: number;
  reps: number;
  targetReps: number;
  completed: boolean;
  rpe?: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Legs' | 'Core' | 'Full Body';
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipmentNeeded: EquipmentItem;
  defaultSets: number;
  defaultReps: number;
  defaultWeightKg: number;
  restSeconds: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string[];
  formTips: string[];
  commonMistakes: string[];
  imagePlaceholderUrl?: string;
  iconName?: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetGoal: FitnessGoal;
  durationMin: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedCalories: number;
  exercises: Exercise[];
  focusMuscles: string[];
  dayOfWeek?: string;
}

export interface ActiveWorkoutSession {
  workoutId: string;
  workoutTitle: string;
  startTime: number;
  currentExerciseIndex: number;
  currentSetIndex: number;
  setLogs: Record<string, ExerciseSetLog[]>; // exerciseId -> logs
  isRestTimerActive: boolean;
  restTimeRemaining: number;
  restDurationTotal: number;
  isPaused: boolean;
}

export interface CompletedWorkout {
  id: string;
  workoutId: string;
  workoutTitle: string;
  completedAt: string;
  durationMinutes: number;
  exercisesCompleted: number;
  totalSetsCompleted: number;
  totalVolumeKg: number;
  caloriesBurned: number;
  streakAtCompletion: number;
  prUnlocked?: string[];
  userRating?: number;
  aiFeedback: string;
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  value: number;
  unit: string;
  previousValue?: number;
  dateAchieved: string;
  improvementPercentage?: number;
  category: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetWorkouts: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  referencedWorkoutId?: string;
  groundingSources?: { uri: string; title: string }[];
  modelUsed?: string;
}

export interface AIRecommendation {
  id: string;
  type: 'recovery' | 'progress' | 'workout' | 'nutrition';
  title: string;
  message: string;
  badge: string;
  actionLabel?: string;
  actionRoute?: string;
}
