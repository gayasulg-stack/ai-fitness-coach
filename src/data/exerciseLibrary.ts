import { Exercise, WorkoutPlan, PersonalRecord, Milestone, AIRecommendation, UserProfile } from '../types/fitness';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  age: 28,
  gender: 'Non-specified',
  heightCm: 178,
  weightKg: 76,
  goal: 'build_muscle',
  experience: 'intermediate',
  location: 'gym',
  equipment: ['Barbell', 'Dumbbells', 'Machines', 'Pull-up Bar', 'Full Gym'],
  frequencyDaysPerWeek: 4,
  preferredDuration: '45–60 min',
  completedOnboarding: true,
  streakDays: 7,
  totalWorkouts: 24,
  totalMinutes: 1120, // ~18h 40m
  totalCalories: 8420,
  weightUnit: 'kg',
  heightUnit: 'cm',
  aiPersona: 'supportive',
};

export const EXERCISE_DATABASE: Exercise[] = [
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    category: 'Chest',
    primaryMuscles: ['Chest (Pectoralis Major)'],
    secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    equipmentNeeded: 'Barbell',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeightKg: 60,
    restSeconds: 90,
    difficulty: 'Intermediate',
    instructions: [
      'Lie flat on the bench with your eyes directly under the racked bar.',
      'Grip the bar slightly wider than shoulder width with thumbs wrapped securely.',
      'Unrack the bar by extending your arms and establish a stable brace through your core and feet.',
      'Lower the bar with control to your mid-chest while tucking elbows at roughly 45 degrees.',
      'Press powerfully upward until arms are extended, locking out smoothly without shrugging.'
    ],
    formTips: [
      'Retract your shoulder blades and drive feet flat into the floor.',
      'Breathe in on the way down, exhale as you push through the sticking point.',
      'Keep your wrists stacked directly over your forearms.'
    ],
    commonMistakes: [
      'Bouncing the bar violently off the sternum.',
      'Flaring elbows out at a 90-degree angle, placing excess strain on rotator cuffs.',
      'Lifting hips off the bench during heavy effort.'
    ],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Bent-Over Row',
    category: 'Back',
    primaryMuscles: ['Latissimus Dorsi', 'Rhomboids'],
    secondaryMuscles: ['Biceps', 'Rear Deltoids'],
    equipmentNeeded: 'Dumbbells',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeightKg: 24,
    restSeconds: 75,
    difficulty: 'Intermediate',
    instructions: [
      'Place one knee and same-side hand firmly on a flat bench for support.',
      'Keep your back flat and nearly parallel to the floor.',
      'Hold a dumbbell in the active hand hanging straight down.',
      'Pull the dumbbell up toward your hip, leading with your elbow.',
      'Squeeze your back muscles at the top of the motion, then lower under control.'
    ],
    formTips: [
      'Think of your hand as a hook; pull through your elbow.',
      'Do not rotate your torso aggressively to swing the dumbbell.'
    ],
    commonMistakes: [
      'Rounding the lower back.',
      'Using body momentum instead of controlled lats contraction.'
    ],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'shoulder-press',
    name: 'Seated Dumbbell Shoulder Press',
    category: 'Shoulders',
    primaryMuscles: ['Anterior & Lateral Deltoids'],
    secondaryMuscles: ['Triceps', 'Upper Trapezius'],
    equipmentNeeded: 'Dumbbells',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeightKg: 18,
    restSeconds: 75,
    difficulty: 'Intermediate',
    instructions: [
      'Sit on an upright bench with dumbbells resting on your thighs.',
      'Kick the dumbbells up to shoulder height with palms facing forward or slightly angled.',
      'Press the dumbbells straight overhead until your arms are extended.',
      'Pause for a fraction of a second at the peak without clashing weights.',
      'Lower smoothly back to ear height before the next rep.'
    ],
    formTips: [
      'Keep your core tight and maintain natural curvature in your spine.',
      'Avoid pressing behind your neck.'
    ],
    commonMistakes: [
      'Arching the lower back excessively off the backrest.',
      'Dropping elbows too low and losing shoulder tension.'
    ],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'lat-pulldown',
    name: 'Cable Lat Pulldown',
    category: 'Back',
    primaryMuscles: ['Latissimus Dorsi'],
    secondaryMuscles: ['Biceps', 'Rear Deltoids', 'Teres Major'],
    equipmentNeeded: 'Machines',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 50,
    restSeconds: 60,
    difficulty: 'Beginner',
    instructions: [
      'Sit with thighs secured snugly under the padded thigh rollers.',
      'Grasp the wide bar with an overhand grip wider than shoulder width.',
      'Lean back slightly (approx 10–15 degrees) and engage your core.',
      'Pull the bar down toward your upper collarbone by driving elbows downward.',
      'Control the ascent as your arms straighten completely to feel a deep lat stretch.'
    ],
    formTips: [
      'Initiate the movement by depressing your shoulder blades down first.',
      'Focus on squeezing under your armpits.'
    ],
    commonMistakes: [
      'Swinging your entire upper torso backwards to yank weight down.',
      'Pulling the bar behind the neck.'
    ],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bicep-curl',
    name: 'Incline Dumbbell Bicep Curl',
    category: 'Arms',
    primaryMuscles: ['Biceps Brachii'],
    secondaryMuscles: ['Brachialis', 'Brachioradialis'],
    equipmentNeeded: 'Dumbbells',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 12,
    restSeconds: 60,
    difficulty: 'Beginner',
    instructions: [
      'Adjust an incline bench to around 45 to 60 degrees and sit back.',
      'Hold a dumbbell in each hand with arms hanging straight down.',
      'Curl the dumbbells upward while supinating your forearms (turning palms up).',
      'Squeeze biceps forcefully at the top peak of the curl.',
      'Lower under slow control to the full stretch at the bottom.'
    ],
    formTips: [
      'Keep your upper arms pinned back; don’t swing elbows forward.',
      'Controlled tempo: 1 second up, 2 seconds down.'
    ],
    commonMistakes: [
      'Using shoulder momentum to lift the weights.',
      'Cutting the bottom range of motion short.'
    ],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tricep-pushdown',
    name: 'Cable Tricep Pushdown',
    category: 'Arms',
    primaryMuscles: ['Triceps (All three heads)'],
    secondaryMuscles: ['Forearms'],
    equipmentNeeded: 'Machines',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 25,
    restSeconds: 60,
    difficulty: 'Beginner',
    instructions: [
      'Attach a rope or straight bar to a high cable pulley.',
      'Grip the attachment firmly with elbows tucked close to your torso.',
      'Push down until your elbows are completely locked out.',
      'Squeeze the triceps for a beat at the bottom lockout.',
      'Slowly allow the cable to bring your forearms back to 90 degrees without letting elbows drift.'
    ],
    formTips: [
      'Keep your elbows pinned in place like hinges.',
      'Stand with a slight forward hip hinge for balance.'
    ],
    commonMistakes: [
      'Letting the elbows flare out or drift forward during the press.',
      'Using bodyweight to press down instead of pure tricep extension.'
    ],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    category: 'Legs',
    primaryMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    equipmentNeeded: 'Barbell',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeightKg: 85,
    restSeconds: 120,
    difficulty: 'Intermediate',
    instructions: [
      'Rest the barbell across your upper traps and unrack with a solid stance.',
      'Place feet shoulder-width apart with toes angled out slightly.',
      'Inhale deeply and brace your abdominal wall tightly.',
      'Send hips back and bend knees, sinking down until thighs are parallel or below.',
      'Drive aggressively through mid-foot to stand back up, exhaling at the top.'
    ],
    formTips: [
      'Keep chest tall and maintain neutral spine throughout.',
      'Knees should track in line with your second toe.'
    ],
    commonMistakes: [
      'Knees caving inward (valgus collapse) during the ascent.',
      'Shifting weight onto the toes and lifting heels.'
    ],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'romanian-deadlift',
    name: 'Dumbbell Romanian Deadlift',
    category: 'Legs',
    primaryMuscles: ['Hamstrings', 'Glutes'],
    secondaryMuscles: ['Lower Back', 'Forearms'],
    equipmentNeeded: 'Dumbbells',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeightKg: 28,
    restSeconds: 90,
    difficulty: 'Intermediate',
    instructions: [
      'Stand tall holding dumbbells in front of your thighs.',
      'Maintain a soft bend in the knees and lock your core.',
      'Push your hips straight back as you trace the dumbbells down your shins.',
      'Stop when you feel a deep, controlled stretch in your hamstrings.',
      'Contract your glutes hard and push hips forward to return to standing.'
    ],
    formTips: [
      'This is a hip hinge, not a squat; keep shins perpendicular to the floor.',
      'Keep dumbbells skimming close to your legs.'
    ],
    commonMistakes: [
      'Rounding the lower back at the bottom of the movement.',
      'Bending the knees too much and turning it into a squat.'
    ],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'push-ups',
    name: 'Standard Push-ups',
    category: 'Chest',
    primaryMuscles: ['Chest', 'Anterior Deltoids'],
    secondaryMuscles: ['Triceps', 'Core'],
    equipmentNeeded: 'No Equipment',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeightKg: 0,
    restSeconds: 60,
    difficulty: 'Beginner',
    instructions: [
      'Assume a high plank position with hands slightly wider than shoulder width.',
      'Maintain a rigid straight line from head to heels by squeezing glutes and core.',
      'Lower chest until 2 inches above the ground while keeping elbows angled at 45 degrees.',
      'Press the floor away to return to top lockout.'
    ],
    formTips: ['Do not let hips sag or hike into the air.', 'Engage your lats to stabilize shoulders.'],
    commonMistakes: ['Flaring elbows out to 90 degrees.', 'Partial range of motion.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'db-bench-press',
    name: 'Dumbbell Flat Bench Press',
    category: 'Chest',
    primaryMuscles: ['Chest (Pectoralis Major)'],
    secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    equipmentNeeded: 'Dumbbells',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeightKg: 22,
    restSeconds: 75,
    difficulty: 'Intermediate',
    instructions: [
      'Sit on flat bench with dumbbells resting on thighs.',
      'Kick dumbbells up as you lie back and press to starting overhead position.',
      'Lower weights in a slight arc toward outer chest until deep stretch is reached.',
      'Press inward and upward, converging slightly at the peak without clacking weights.'
    ],
    formTips: ['Allows greater active chest stretch than barbell bench press.', 'Keep feet planted firmly.'],
    commonMistakes: ['Letting elbows drop excessively below bench plane, straining shoulders.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'machine-chest-press',
    name: 'Seated Machine Chest Press',
    category: 'Chest',
    primaryMuscles: ['Chest (Pectoralis Major)'],
    secondaryMuscles: ['Triceps', 'Front Shoulders'],
    equipmentNeeded: 'Machines',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 45,
    restSeconds: 60,
    difficulty: 'Beginner',
    instructions: [
      'Adjust seat height so handles align with mid-chest.',
      'Plant feet firmly and grip handles with palms facing down.',
      'Press handles forward until arms are almost fully extended.',
      'Return smoothly under controlled tempo to the starting position.'
    ],
    formTips: ['Keep back and head pinned against the backrest.', 'Focus on deep pectoral contraction.'],
    commonMistakes: ['Letting stack slam down between repetitions.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'band-chest-press',
    name: 'Standing Resistance Band Chest Press',
    category: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps', 'Shoulders', 'Core'],
    equipmentNeeded: 'Resistance Bands',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeightKg: 15,
    restSeconds: 45,
    difficulty: 'Beginner',
    instructions: [
      'Anchor resistance band at chest height behind you or loop around upper back.',
      'Step forward into a staggered stance to create tension.',
      'Press hands forward until arms straighten, feeling peak contraction.',
      'Control the band as your elbows travel back to the starting point.'
    ],
    formTips: ['Maintain forward lean to resist backward pull of the band.', 'Squeeze chest hard at apex.'],
    commonMistakes: ['Rushing the eccentric (return) phase.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups / Chin-ups',
    category: 'Back',
    primaryMuscles: ['Latissimus Dorsi'],
    secondaryMuscles: ['Biceps', 'Upper Back', 'Core'],
    equipmentNeeded: 'Pull-up Bar',
    defaultSets: 3,
    defaultReps: 8,
    defaultWeightKg: 0,
    restSeconds: 90,
    difficulty: 'Advanced',
    instructions: [
      'Grip the pull-up bar slightly wider than shoulder width with palms facing away.',
      'Hang with full arm extension, packing shoulder blades down and back.',
      'Pull chest up toward the bar by driving elbows down to your ribs.',
      'Lower under control to a dead hang before initiating the next rep.'
    ],
    formTips: ['Avoid swinging or kicking legs (kipping).', 'Lead with your collarbone.'],
    commonMistakes: ['Not reaching full lockout at the bottom.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'band-lat-pulldown',
    name: 'Resistance Band Kneeling Lat Pulldown',
    category: 'Back',
    primaryMuscles: ['Latissimus Dorsi'],
    secondaryMuscles: ['Biceps', 'Rhomboids'],
    equipmentNeeded: 'Resistance Bands',
    defaultSets: 3,
    defaultReps: 14,
    defaultWeightKg: 18,
    restSeconds: 60,
    difficulty: 'Beginner',
    instructions: [
      'Anchor band high above (door anchor or tall bar) and kneel upright.',
      'Grasp band ends with arms elevated in a "V" shape.',
      'Pull elbows down and slightly inward toward your hips.',
      'Pause and squeeze lats for a 1-second peak hold, then slowly release.'
    ],
    formTips: ['Keep chest proud and shoulders back.', 'Feel the contraction under armpits.'],
    commonMistakes: ['Arching lower back violently.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'overhead-barbell-press',
    name: 'Standing Overhead Barbell Press',
    category: 'Shoulders',
    primaryMuscles: ['Deltoids (Anterior & Lateral)'],
    secondaryMuscles: ['Triceps', 'Upper Trapezius', 'Core'],
    equipmentNeeded: 'Barbell',
    defaultSets: 3,
    defaultReps: 8,
    defaultWeightKg: 40,
    restSeconds: 90,
    difficulty: 'Intermediate',
    instructions: [
      'Rack bar at collarbone height. Grip slightly wider than shoulders.',
      'Unrack, step back, and squeeze glutes and quads tightly.',
      'Press bar vertically overhead, tilting head back slightly to clear chin.',
      'Lock out overhead with bar centered directly over mid-foot.'
    ],
    formTips: ['Do not lean back into an incline bench simulation.', 'Brace abs like preparing for a punch.'],
    commonMistakes: ['Excessive lumbar hyperextension.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'db-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'Shoulders',
    primaryMuscles: ['Lateral Deltoids'],
    secondaryMuscles: ['Trapezius'],
    equipmentNeeded: 'Dumbbells',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeightKg: 8,
    restSeconds: 60,
    difficulty: 'Beginner',
    instructions: [
      'Stand holding dumbbells at your sides with a slight forward torso hinge.',
      'Raise arms laterally with elbows soft until weights reach shoulder height.',
      'Pour imaginary pitchers of water slightly forward at the peak.',
      'Lower smoothly over 2 seconds.'
    ],
    formTips: ['Lead with elbows, not wrists.', 'Use lighter weight with strict control.'],
    commonMistakes: ['Swinging torso and shrugging neck traps.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'band-overhead-press',
    name: 'Standing Band Shoulder Press',
    category: 'Shoulders',
    primaryMuscles: ['Shoulders (Deltoids)'],
    secondaryMuscles: ['Triceps'],
    equipmentNeeded: 'Resistance Bands',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 12,
    restSeconds: 45,
    difficulty: 'Beginner',
    instructions: [
      'Stand on center of loop band with feet shoulder-width apart.',
      'Bring band handles up to shoulder level with elbows underneath.',
      'Press directly overhead to full extension.',
      'Control the band descent back to shoulders.'
    ],
    formTips: ['Keep core brace rigid throughout the movement.'],
    commonMistakes: ['Letting resistance snap arms down.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kettlebell-press',
    name: 'Kettlebell Overhead Press',
    category: 'Shoulders',
    primaryMuscles: ['Deltoids', 'Triceps'],
    secondaryMuscles: ['Rotator Cuff', 'Core'],
    equipmentNeeded: 'Kettlebells',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeightKg: 16,
    restSeconds: 60,
    difficulty: 'Intermediate',
    instructions: [
      'Clean kettlebell into rack position against your chest and forearm.',
      'Press kettlebell straight upward, allowing arm to rotate naturally.',
      'Lock out with bicep near ear.',
      'Lower with control back to rack position.'
    ],
    formTips: ['Crush grip the handle for enhanced shoulder stability.'],
    commonMistakes: ['Pressing forward rather than directly overhead.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'goblet-squat',
    name: 'Kettlebell / Dumbbell Goblet Squat',
    category: 'Legs',
    primaryMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Core', 'Upper Back'],
    equipmentNeeded: 'Kettlebells',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 20,
    restSeconds: 75,
    difficulty: 'Beginner',
    instructions: [
      'Hold kettlebell horns or dumbbell vertically close against your sternum.',
      'Stand with feet shoulder-width and toes flared 15 degrees.',
      'Squat down between your hips, touching elbows between knees at bottom.',
      'Drive through floor to return to standing.'
    ],
    formTips: ['Keep chest proud and elbows inside the knees at the bottom.'],
    commonMistakes: ['Leaning too far forward.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bench-dips',
    name: 'Bench / Chair Dips',
    category: 'Arms',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Front Deltoids', 'Chest'],
    equipmentNeeded: 'No Equipment',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 0,
    restSeconds: 60,
    difficulty: 'Beginner',
    instructions: [
      'Sit on edge of a sturdy bench or chair with hands next to hips.',
      'Slide hips off the bench with legs bent or extended forward.',
      'Lower body by bending elbows to 90 degrees.',
      'Press through palms to lockout triceps.'
    ],
    formTips: ['Keep hips close to the bench to minimize anterior shoulder strain.'],
    commonMistakes: ['Shrugging shoulders up toward ears.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'overhead-db-extension',
    name: 'Seated Dumbbell Overhead Tricep Extension',
    category: 'Arms',
    primaryMuscles: ['Triceps (Long Head)'],
    secondaryMuscles: ['Forearms'],
    equipmentNeeded: 'Dumbbells',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeightKg: 18,
    restSeconds: 60,
    difficulty: 'Intermediate',
    instructions: [
      'Sit on an upright bench holding one dumbbell vertically with both hands.',
      'Press dumbbell overhead until arms are extended.',
      'Lower weight behind your head by bending elbows while keeping upper arms still.',
      'Extend arms back to top lockout, feeling the long head contract.'
    ],
    formTips: ['Keep elbows tucked in rather than excessively flaring out.'],
    commonMistakes: ['Arching lower back.'],
    imagePlaceholderUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
  }
];

export const TODAY_WORKOUT_DEFAULT: WorkoutPlan = {
  id: 'upper-body-strength-today',
  title: 'Upper Body Strength',
  subtitle: 'Hypertrophy & Form Focus',
  description: 'A balanced upper body session engineered to build pressing power, pull strength, and arm definition with optimized rest intervals.',
  targetGoal: 'build_muscle',
  durationMin: 45,
  difficulty: 'Intermediate',
  estimatedCalories: 320,
  exercises: EXERCISE_DATABASE.slice(0, 6),
  focusMuscles: ['Chest', 'Lats', 'Deltoids', 'Biceps', 'Triceps'],
  dayOfWeek: 'Today'
};

export const ALTERNATIVE_WORKOUTS: WorkoutPlan[] = [
  TODAY_WORKOUT_DEFAULT,
  {
    id: 'lower-body-power',
    title: 'Lower Body & Core Power',
    subtitle: 'Quad & Posterior Chain Focus',
    description: 'Explosive compound squats and targeted hamstring hinge variations to build lower-body strength and trunk stability.',
    targetGoal: 'increase_strength',
    durationMin: 50,
    difficulty: 'Intermediate',
    estimatedCalories: 380,
    exercises: [EXERCISE_DATABASE[6], EXERCISE_DATABASE[7]],
    focusMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
    dayOfWeek: 'Tomorrow'
  },
  {
    id: 'push-hypertrophy',
    title: 'Push Day: Chest & Shoulders',
    subtitle: 'Pressing Overload',
    description: 'Concentrated anterior chain volume targeting upper chest, front deltoids, and tricep lockouts.',
    targetGoal: 'build_muscle',
    durationMin: 40,
    difficulty: 'Intermediate',
    estimatedCalories: 290,
    exercises: [EXERCISE_DATABASE[0], EXERCISE_DATABASE[2], EXERCISE_DATABASE[5]],
    focusMuscles: ['Chest', 'Shoulders', 'Triceps'],
    dayOfWeek: 'Friday'
  }
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    title: 'Started Journey',
    description: 'Completed onboarding & set up first personalized plan.',
    targetWorkouts: 1,
    isUnlocked: true,
    unlockedDate: '3 weeks ago',
    icon: 'Flag'
  },
  {
    id: 'm2',
    title: '10 Workouts Milestone',
    description: 'Built foundational consistency and mastered prime movement patterns.',
    targetWorkouts: 10,
    isUnlocked: true,
    unlockedDate: '10 days ago',
    icon: 'Trophy'
  },
  {
    id: 'm3',
    title: '25 Workouts Milestone',
    description: 'Solidified a permanent fitness habit.',
    targetWorkouts: 25,
    isUnlocked: false,
    icon: 'Zap'
  },
  {
    id: 'm4',
    title: '50 Workouts Club',
    description: 'Half-century of completed training sessions.',
    targetWorkouts: 50,
    isUnlocked: false,
    icon: 'Flame'
  },
  {
    id: 'm5',
    title: '100 Workouts Elite',
    description: 'Achieved elite athlete consistency.',
    targetWorkouts: 100,
    isUnlocked: false,
    icon: 'Crown'
  }
];

export const INITIAL_PRS: PersonalRecord[] = [
  {
    id: 'pr-1',
    exerciseName: 'Bench Press',
    value: 75,
    unit: 'kg',
    previousValue: 67.5,
    dateAchieved: '3 days ago',
    improvementPercentage: 11.1,
    category: 'Chest'
  },
  {
    id: 'pr-2',
    exerciseName: 'Barbell Squat',
    value: 90,
    unit: 'kg',
    previousValue: 80,
    dateAchieved: '1 week ago',
    improvementPercentage: 12.5,
    category: 'Legs'
  },
  {
    id: 'pr-3',
    exerciseName: 'Deadlift',
    value: 110,
    unit: 'kg',
    previousValue: 100,
    dateAchieved: '2 weeks ago',
    improvementPercentage: 10.0,
    category: 'Posterior'
  },
  {
    id: 'pr-4',
    exerciseName: 'Push-ups',
    value: 35,
    unit: 'reps',
    previousValue: 28,
    dateAchieved: '4 days ago',
    improvementPercentage: 25.0,
    category: 'Calisthenics'
  }
];

export const INITIAL_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'rec-1',
    type: 'recovery',
    title: 'Recovery Recommendation',
    message: "You've trained 3 strength days this week. Your consistency is improving. Consider adding one recovery day before your next heavy session.",
    badge: 'Optimal Recovery',
    actionLabel: 'Schedule Rest Day',
    actionRoute: 'schedule'
  },
  {
    id: 'rec-2',
    type: 'progress',
    title: 'Progress Recommendation',
    message: 'Your bench press has increased 11.1% over the last month. You are ready to try 62.5 kg on your next working sets.',
    badge: 'Strength Surge',
    actionLabel: 'Apply Progressive Overload',
    actionRoute: 'workout'
  },
  {
    id: 'rec-3',
    type: 'workout',
    title: 'Workout Recommendation',
    message: 'Based on your recent push volume, today’s recommended session is Upper Body Strength with emphasis on controlled rowing eccentrics.',
    badge: 'Today’s Focus',
    actionLabel: 'Start Upper Body',
    actionRoute: 'workout'
  }
];
