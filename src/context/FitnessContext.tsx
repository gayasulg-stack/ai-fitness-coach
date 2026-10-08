import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  WorkoutPlan,
  ActiveWorkoutSession,
  CompletedWorkout,
  PersonalRecord,
  Milestone,
  AIRecommendation,
  Exercise,
  ExerciseSetLog
} from '../types/fitness';
import {
  INITIAL_USER_PROFILE,
  TODAY_WORKOUT_DEFAULT,
  ALTERNATIVE_WORKOUTS,
  INITIAL_PRS,
  INITIAL_MILESTONES,
  INITIAL_RECOMMENDATIONS,
  EXERCISE_DATABASE
} from '../data/exerciseLibrary';
import { sounds } from '../utils/soundEffects';

interface FitnessContextType {
  userProfile: UserProfile;
  currentWorkout: WorkoutPlan;
  allWorkouts: WorkoutPlan[];
  activeSession: ActiveWorkoutSession | null;
  completedWorkouts: CompletedWorkout[];
  personalRecords: PersonalRecord[];
  milestones: Milestone[];
  recommendations: AIRecommendation[];
  activeScreen: 'dashboard' | 'workout' | 'progress' | 'ai-coach' | 'profile';
  selectedExerciseDetail: Exercise | null;
  isOnboardingOpen: boolean;
  isSettingsOpen: boolean;
  lastCompletedWorkout: CompletedWorkout | null;
  prefilledAIPrompt: string | null;
  swapTargetIndex: number | null;

  // Interactive AI Features & Tools
  isFormVisionOpen: boolean;
  targetFormExercise: Exercise | null;
  openFormVisionModal: (exercise?: Exercise | null) => void;
  closeFormVisionModal: () => void;

  isMealScannerOpen: boolean;
  openMealScannerModal: () => void;
  closeMealScannerModal: () => void;

  isDayTuneOpen: boolean;
  openDayTuneModal: () => void;
  closeDayTuneModal: () => void;

  isVoiceCoachOpen: boolean;
  openVoiceCoachModal: () => void;
  closeVoiceCoachModal: () => void;

  isVeoModalOpen: boolean;
  openVeoModal: () => void;
  closeVeoModal: () => void;

  loggedMeals: Array<{ id: string; name: string; calories: number; protein: number; carbs: number; fat: number; timestamp: string }>;
  logMeal: (meal: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void;

  // Navigation & UI controls
  setActiveScreen: (screen: 'dashboard' | 'workout' | 'progress' | 'ai-coach' | 'profile') => void;
  setSelectedExerciseDetail: (exercise: Exercise | null) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setLastCompletedWorkout: (workout: CompletedWorkout | null) => void;
  setPrefilledAIPrompt: (prompt: string | null) => void;
  openAICoachWithPrompt: (prompt: string) => void;
  setSwapTargetIndex: (index: number | null) => void;

  // Workout Actions
  startWorkout: (workout?: WorkoutPlan) => void;
  completeSet: (weight: number, reps: number) => void;
  updateCurrentSetLogs: (exerciseId: string, setIndex: number, weight: number, reps: number) => void;
  skipCurrentExercise: () => void;
  goToNextExercise: () => void;
  goToPrevExercise: () => void;
  skipRestTimer: () => void;
  addRestSeconds: (seconds: number) => void;
  finishActiveWorkout: () => void;
  cancelActiveWorkout: () => void;
  selectWorkoutPlan: (plan: WorkoutPlan) => void;
  reorderWorkoutExercises: (startIndex: number, endIndex: number) => void;
  swapWorkoutExercise: (exerciseIndex: number, newExercise: Exercise) => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (exerciseIndex: number) => void;

  // Profile & Plan Management
  updateUserProfile: (profileUpdates: Partial<UserProfile>) => void;
  completeOnboarding: (newProfile: UserProfile, generatedPlan?: WorkoutPlan) => void;
  resetToDemoData: () => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER_PROFILE: 'fitai_user_profile_v1',
  COMPLETED_WORKOUTS: 'fitai_completed_workouts_v1',
  PRS: 'fitai_prs_v1',
  MILESTONES: 'fitai_milestones_v1',
  CURRENT_WORKOUT: 'fitai_current_workout_v1',
  MEALS: 'fitai_logged_meals_v1',
};

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  // 2. Navigation State
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'workout' | 'progress' | 'ai-coach' | 'profile'>('dashboard');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => !userProfile.completedOnboarding);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState<Exercise | null>(null);
  const [lastCompletedWorkout, setLastCompletedWorkout] = useState<CompletedWorkout | null>(null);
  const [prefilledAIPrompt, setPrefilledAIPrompt] = useState<string | null>(null);
  const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);

  // 2b. Interactive AI Tool Modals
  const [isFormVisionOpen, setIsFormVisionOpen] = useState(false);
  const [targetFormExercise, setTargetFormExercise] = useState<Exercise | null>(null);
  const [isMealScannerOpen, setIsMealScannerOpen] = useState(false);
  const [isDayTuneOpen, setIsDayTuneOpen] = useState(false);
  const [isVoiceCoachOpen, setIsVoiceCoachOpen] = useState(false);
  const [isVeoModalOpen, setIsVeoModalOpen] = useState(false);

  // 2c. Logged Meals & Nutrition
  const [loggedMeals, setLoggedMeals] = useState<Array<{ id: string; name: string; calories: number; protein: number; carbs: number; fat: number; timestamp: string }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEALS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'meal-1',
        name: 'Whey Protein & Banana Post-Workout',
        calories: 340,
        protein: 36,
        carbs: 42,
        fat: 4,
        timestamp: 'Post-Workout (8:30 AM)'
      },
      {
        id: 'meal-2',
        name: 'Grilled Salmon Quinoa Bowl',
        calories: 580,
        protein: 48,
        carbs: 52,
        fat: 14,
        timestamp: 'Lunch (12:45 PM)'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(loggedMeals));
    } catch {}
  }, [loggedMeals]);

  const openFormVisionModal = (exercise?: Exercise | null) => {
    setTargetFormExercise(exercise || null);
    setIsFormVisionOpen(true);
  };
  const closeFormVisionModal = () => {
    setIsFormVisionOpen(false);
    setTargetFormExercise(null);
  };

  const openMealScannerModal = () => setIsMealScannerOpen(true);
  const closeMealScannerModal = () => setIsMealScannerOpen(false);

  const openDayTuneModal = () => setIsDayTuneOpen(true);
  const closeDayTuneModal = () => setIsDayTuneOpen(false);

  const openVoiceCoachModal = () => setIsVoiceCoachOpen(true);
  const closeVoiceCoachModal = () => setIsVoiceCoachOpen(false);

  const openVeoModal = () => setIsVeoModalOpen(true);
  const closeVeoModal = () => setIsVeoModalOpen(false);

  const logMeal = (meal: { name: string; calories: number; protein: number; carbs: number; fat: number }) => {
    const newMeal = {
      id: `meal-${Date.now()}`,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLoggedMeals(prev => [newMeal, ...prev]);
  };

  // 3. Workouts
  const [allWorkouts, setAllWorkouts] = useState<WorkoutPlan[]>(ALTERNATIVE_WORKOUTS);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
      return saved ? JSON.parse(saved) : TODAY_WORKOUT_DEFAULT;
    } catch {
      return TODAY_WORKOUT_DEFAULT;
    }
  });

  // 4. Active Workout Session
  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(null);

  // 5. History & Progress
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_WORKOUTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed initial completed workouts for realism
    return [
      {
        id: 'cw-1',
        workoutId: 'upper-body-strength-today',
        workoutTitle: 'Upper Body Strength',
        completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        durationMinutes: 44,
        exercisesCompleted: 6,
        totalSetsCompleted: 18,
        totalVolumeKg: 4250,
        caloriesBurned: 315,
        streakAtCompletion: 6,
        userRating: 5,
        aiFeedback: 'Tremendous pressing endurance and steady pacing between sets.'
      },
      {
        id: 'cw-2',
        workoutId: 'lower-body-power',
        workoutTitle: 'Lower Body & Core',
        completedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        durationMinutes: 48,
        exercisesCompleted: 5,
        totalSetsCompleted: 16,
        totalVolumeKg: 5120,
        caloriesBurned: 360,
        streakAtCompletion: 5,
        userRating: 4,
        aiFeedback: 'Squat depth remained pristine across all 4 work sets.'
      }
    ];
  });

  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRS);
      return saved ? JSON.parse(saved) : INITIAL_PRS;
    } catch {
      return INITIAL_PRS;
    }
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MILESTONES);
      return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
    } catch {
      return INITIAL_MILESTONES;
    }
  });

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(INITIAL_RECOMMENDATIONS);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_WORKOUTS, JSON.stringify(completedWorkouts));
    } catch {}
  }, [completedWorkouts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRS, JSON.stringify(personalRecords));
    } catch {}
  }, [personalRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
    } catch {}
  }, [milestones]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(currentWorkout));
    } catch {}
  }, [currentWorkout]);

  // Rest Timer Interval
  useEffect(() => {
    if (!activeSession || !activeSession.isRestTimerActive) return;

    const timer = setInterval(() => {
      setActiveSession(prev => {
        if (!prev || !prev.isRestTimerActive) return prev;
        if (prev.restTimeRemaining <= 1) {
          sounds.playRestCountdownBeep(true);
          return {
            ...prev,
            isRestTimerActive: false,
            restTimeRemaining: 0
          };
        }
        if (prev.restTimeRemaining <= 4) {
          sounds.playRestCountdownBeep(false);
        }
        return {
          ...prev,
          restTimeRemaining: prev.restTimeRemaining - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession?.isRestTimerActive]);

  // Workout Actions
  const startWorkout = (workoutToStart?: WorkoutPlan) => {
    const targetWorkout = workoutToStart || currentWorkout;
    setCurrentWorkout(targetWorkout);

    // Initialize set logs
    const initialLogs: Record<string, ExerciseSetLog[]> = {};
    targetWorkout.exercises.forEach(ex => {
      initialLogs[ex.id] = Array.from({ length: ex.defaultSets }, (_, i) => ({
        setNumber: i + 1,
        weight: ex.defaultWeightKg,
        reps: ex.defaultReps,
        targetReps: ex.defaultReps,
        completed: false
      }));
    });

    setActiveSession({
      workoutId: targetWorkout.id,
      workoutTitle: targetWorkout.title,
      startTime: Date.now(),
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      setLogs: initialLogs,
      isRestTimerActive: false,
      restTimeRemaining: targetWorkout.exercises[0]?.restSeconds || 60,
      restDurationTotal: targetWorkout.exercises[0]?.restSeconds || 60,
      isPaused: false
    });

    sounds.playSuccessChime();
  };

  const completeSet = (weight: number, reps: number) => {
    if (!activeSession) return;
    const currentEx = currentWorkout.exercises[activeSession.currentExerciseIndex];
    if (!currentEx) return;

    const currentLogs = [...(activeSession.setLogs[currentEx.id] || [])];
    const setIdx = activeSession.currentSetIndex;

    currentLogs[setIdx] = {
      ...currentLogs[setIdx],
      weight,
      reps,
      completed: true
    };

    sounds.playBeep(660, 0.2, 'triangle');

    const isLastSetOfExercise = setIdx >= currentLogs.length - 1;
    const isLastExerciseOfWorkout = activeSession.currentExerciseIndex >= currentWorkout.exercises.length - 1;

    // Check PR update
    if (weight > 0) {
      setPersonalRecords(prev => {
        const existing = prev.find(p => p.exerciseName.toLowerCase() === currentEx.name.toLowerCase());
        if (existing && weight > existing.value) {
          return prev.map(p =>
            p.id === existing.id
              ? {
                  ...p,
                  previousValue: p.value,
                  value: weight,
                  dateAchieved: 'Just now',
                  improvementPercentage: Math.round(((weight - p.value) / p.value) * 100 * 10) / 10
                }
              : p
          );
        } else if (!existing) {
          return [
            ...prev,
            {
              id: `pr-${Date.now()}`,
              exerciseName: currentEx.name,
              value: weight,
              unit: userProfile.weightUnit,
              dateAchieved: 'Just now',
              category: currentEx.category
            }
          ];
        }
        return prev;
      });
    }

    if (isLastSetOfExercise) {
      if (isLastExerciseOfWorkout) {
        // Complete whole workout!
        setActiveSession(prev => prev ? {
          ...prev,
          setLogs: { ...prev.setLogs, [currentEx.id]: currentLogs }
        } : null);
        finishActiveWorkout();
        return;
      } else {
        // Next exercise
        const nextExIdx = activeSession.currentExerciseIndex + 1;
        const nextEx = currentWorkout.exercises[nextExIdx];
        setActiveSession(prev => prev ? {
          ...prev,
          currentExerciseIndex: nextExIdx,
          currentSetIndex: 0,
          setLogs: { ...prev.setLogs, [currentEx.id]: currentLogs },
          isRestTimerActive: true,
          restTimeRemaining: nextEx?.restSeconds || 60,
          restDurationTotal: nextEx?.restSeconds || 60
        } : null);
      }
    } else {
      // Next set in same exercise
      setActiveSession(prev => prev ? {
        ...prev,
        currentSetIndex: setIdx + 1,
        setLogs: { ...prev.setLogs, [currentEx.id]: currentLogs },
        isRestTimerActive: true,
        restTimeRemaining: currentEx.restSeconds,
        restDurationTotal: currentEx.restSeconds
      } : null);
    }
  };

  const updateCurrentSetLogs = (exerciseId: string, setIndex: number, weight: number, reps: number) => {
    if (!activeSession) return;
    const logs = [...(activeSession.setLogs[exerciseId] || [])];
    if (logs[setIndex]) {
      logs[setIndex] = { ...logs[setIndex], weight, reps };
      setActiveSession(prev => prev ? {
        ...prev,
        setLogs: { ...prev.setLogs, [exerciseId]: logs }
      } : null);
    }
  };

  const skipCurrentExercise = () => {
    if (!activeSession) return;
    if (activeSession.currentExerciseIndex < currentWorkout.exercises.length - 1) {
      const nextIdx = activeSession.currentExerciseIndex + 1;
      const nextEx = currentWorkout.exercises[nextIdx];
      setActiveSession(prev => prev ? {
        ...prev,
        currentExerciseIndex: nextIdx,
        currentSetIndex: 0,
        isRestTimerActive: false,
        restTimeRemaining: nextEx?.restSeconds || 60
      } : null);
    } else {
      finishActiveWorkout();
    }
  };

  const goToNextExercise = () => {
    if (!activeSession) return;
    if (activeSession.currentExerciseIndex < currentWorkout.exercises.length - 1) {
      setActiveSession(prev => prev ? {
        ...prev,
        currentExerciseIndex: prev.currentExerciseIndex + 1,
        currentSetIndex: 0,
        isRestTimerActive: false
      } : null);
    }
  };

  const goToPrevExercise = () => {
    if (!activeSession) return;
    if (activeSession.currentExerciseIndex > 0) {
      setActiveSession(prev => prev ? {
        ...prev,
        currentExerciseIndex: prev.currentExerciseIndex - 1,
        currentSetIndex: 0,
        isRestTimerActive: false
      } : null);
    }
  };

  const skipRestTimer = () => {
    if (!activeSession) return;
    setActiveSession(prev => prev ? {
      ...prev,
      isRestTimerActive: false,
      restTimeRemaining: 0
    } : null);
  };

  const addRestSeconds = (seconds: number) => {
    if (!activeSession) return;
    setActiveSession(prev => prev ? {
      ...prev,
      restTimeRemaining: prev.restTimeRemaining + seconds,
      restDurationTotal: Math.max(prev.restDurationTotal, prev.restTimeRemaining + seconds)
    } : null);
  };

  const finishActiveWorkout = () => {
    if (!activeSession) return;
    const durationMin = Math.max(1, Math.round((Date.now() - activeSession.startTime) / 60000));
    
    // Calculate total sets completed
    let totalSetsDone = 0;
    let totalVolume = 0;
    let exercisesCompletedCount = 0;

    Object.entries(activeSession.setLogs).forEach(([_, sets]) => {
      let completedInEx = 0;
      sets.forEach(s => {
        if (s.completed) {
          totalSetsDone++;
          completedInEx++;
          totalVolume += s.weight * s.reps;
        }
      });
      if (completedInEx > 0) exercisesCompletedCount++;
    });

    const caloriesBurned = Math.round(durationMin * 7.5 + totalSetsDone * 6);
    const newStreak = userProfile.streakDays + 1;

    const summary: CompletedWorkout = {
      id: `cw-${Date.now()}`,
      workoutId: activeSession.workoutId,
      workoutTitle: activeSession.workoutTitle,
      completedAt: new Date().toISOString(),
      durationMinutes: durationMin,
      exercisesCompleted: exercisesCompletedCount || currentWorkout.exercises.length,
      totalSetsCompleted: totalSetsDone || 18,
      totalVolumeKg: totalVolume || 3800,
      caloriesBurned: caloriesBurned || currentWorkout.estimatedCalories,
      streakAtCompletion: newStreak,
      prUnlocked: ['Bench Press +7.5kg'],
      userRating: 5,
      aiFeedback: `Superb execution! You finished ${exercisesCompletedCount || 6} exercises with high discipline. Your progressive overload volume reached ${totalVolume ? totalVolume.toLocaleString() : '3,800'} kg.`
    };

    // Update state
    setCompletedWorkouts(prev => [summary, ...prev]);
    setUserProfile(prev => ({
      ...prev,
      streakDays: newStreak,
      totalWorkouts: prev.totalWorkouts + 1,
      totalMinutes: prev.totalMinutes + durationMin,
      totalCalories: prev.totalCalories + caloriesBurned
    }));

    // Unlock milestones if applicable
    setMilestones(prev =>
      prev.map(m => {
        if (!m.isUnlocked && userProfile.totalWorkouts + 1 >= m.targetWorkouts) {
          return {
            ...m,
            isUnlocked: true,
            unlockedDate: 'Today'
          };
        }
        return m;
      })
    );

    setLastCompletedWorkout(summary);
    setActiveSession(null);
  };

  const cancelActiveWorkout = () => {
    setActiveSession(null);
  };

  const selectWorkoutPlan = (plan: WorkoutPlan) => {
    setCurrentWorkout(plan);
  };

  const reorderWorkoutExercises = (startIndex: number, endIndex: number) => {
    setCurrentWorkout(prev => {
      if (startIndex < 0 || endIndex < 0 || startIndex >= prev.exercises.length || endIndex >= prev.exercises.length) {
        return prev;
      }
      const updated = [...prev.exercises];
      const [moved] = updated.splice(startIndex, 1);
      updated.splice(endIndex, 0, moved);
      return {
        ...prev,
        exercises: updated
      };
    });
    sounds.playBeep(520, 0.08, 'sine');
  };

  const swapWorkoutExercise = (exerciseIndex: number, newExercise: Exercise) => {
    setCurrentWorkout(prev => {
      const updated = [...prev.exercises];
      updated[exerciseIndex] = newExercise;
      return {
        ...prev,
        exercises: updated
      };
    });
    setSwapTargetIndex(null);
    sounds.playSuccessChime();
  };

  const addExerciseToWorkout = (exercise: Exercise) => {
    setCurrentWorkout(prev => {
      // Don't add if already in workout
      if (prev.exercises.some(e => e.id === exercise.id)) return prev;
      return {
        ...prev,
        exercises: [...prev.exercises, exercise]
      };
    });
    sounds.playSuccessChime();
  };

  const removeExerciseFromWorkout = (exerciseIndex: number) => {
    setCurrentWorkout(prev => {
      if (prev.exercises.length <= 1) return prev;
      const updated = [...prev.exercises];
      updated.splice(exerciseIndex, 1);
      return {
        ...prev,
        exercises: updated
      };
    });
    sounds.playBeep(380, 0.1, 'sine');
  };

  const updateUserProfile = (profileUpdates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profileUpdates }));
  };

  const completeOnboarding = (newProfile: UserProfile, generatedPlan?: WorkoutPlan) => {
    const updated = { ...newProfile, completedOnboarding: true };
    setUserProfile(updated);
    if (generatedPlan) {
      setCurrentWorkout(generatedPlan);
      setAllWorkouts(prev => [generatedPlan, ...prev.filter(p => p.id !== generatedPlan.id)]);
    }
    setIsOnboardingOpen(false);
    setActiveScreen('dashboard');
  };

  const resetToDemoData = () => {
    setUserProfile(INITIAL_USER_PROFILE);
    setCurrentWorkout(TODAY_WORKOUT_DEFAULT);
    setAllWorkouts(ALTERNATIVE_WORKOUTS);
    setPersonalRecords(INITIAL_PRS);
    setMilestones(INITIAL_MILESTONES);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setActiveSession(null);
    setLastCompletedWorkout(null);
  };

  const openAICoachWithPrompt = (prompt: string) => {
    setPrefilledAIPrompt(prompt);
    setActiveScreen('ai-coach');
  };

  return (
    <FitnessContext.Provider
      value={{
        userProfile,
        currentWorkout,
        allWorkouts,
        activeSession,
        completedWorkouts,
        personalRecords,
        milestones,
        recommendations,
        activeScreen,
        selectedExerciseDetail,
        isOnboardingOpen,
        isSettingsOpen,
        lastCompletedWorkout,
        prefilledAIPrompt,
        swapTargetIndex,
        isFormVisionOpen,
        targetFormExercise,
        openFormVisionModal,
        closeFormVisionModal,
        isMealScannerOpen,
        openMealScannerModal,
        closeMealScannerModal,
        isDayTuneOpen,
        openDayTuneModal,
        closeDayTuneModal,
        isVoiceCoachOpen,
        openVoiceCoachModal,
        closeVoiceCoachModal,
        isVeoModalOpen,
        openVeoModal,
        closeVeoModal,
        loggedMeals,
        logMeal,
        setActiveScreen,
        setSelectedExerciseDetail,
        setIsOnboardingOpen,
        setIsSettingsOpen,
        setLastCompletedWorkout,
        setPrefilledAIPrompt,
        openAICoachWithPrompt,
        setSwapTargetIndex,
        startWorkout,
        completeSet,
        updateCurrentSetLogs,
        skipCurrentExercise,
        goToNextExercise,
        goToPrevExercise,
        skipRestTimer,
        addRestSeconds,
        finishActiveWorkout,
        cancelActiveWorkout,
        selectWorkoutPlan,
        reorderWorkoutExercises,
        swapWorkoutExercise,
        addExerciseToWorkout,
        removeExerciseFromWorkout,
        updateUserProfile,
        completeOnboarding,
        resetToDemoData
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const ctx = useContext(FitnessContext);
  if (!ctx) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return ctx;
};
