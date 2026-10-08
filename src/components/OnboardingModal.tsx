import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Flame, 
  Target, 
  Zap, 
  Activity, 
  Heart, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Calendar,
  X
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { 
  FitnessGoal, 
  ExperienceLevel, 
  WorkoutLocation, 
  EquipmentItem, 
  WorkoutDurationPref,
  UserProfile,
  WorkoutPlan
} from '../types/fitness';
import { EXERCISE_DATABASE } from '../data/exerciseLibrary';
import confetti from 'canvas-confetti';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, userProfile, completeOnboarding } = useFitness();
  const [step, setStep] = useState<number>(1);

  // Form states initialized with current user profile
  const [name, setName] = useState(userProfile.name || 'Alex Johnson');
  const [age, setAge] = useState(userProfile.age || 28);
  const [gender, setGender] = useState(userProfile.gender || 'Not specified');
  const [heightCm, setHeightCm] = useState(userProfile.heightCm || 178);
  const [weightKg, setWeightKg] = useState(userProfile.weightKg || 76);
  const [goal, setGoal] = useState<FitnessGoal>(userProfile.goal || 'build_muscle');
  const [experience, setExperience] = useState<ExperienceLevel>(userProfile.experience || 'intermediate');
  const [location, setLocation] = useState<WorkoutLocation>(userProfile.location || 'gym');
  const [equipment, setEquipment] = useState<EquipmentItem[]>(userProfile.equipment || ['Barbell', 'Dumbbells', 'Machines']);
  const [frequency, setFrequency] = useState<number>(userProfile.frequencyDaysPerWeek || 4);
  const [duration, setDuration] = useState<WorkoutDurationPref>(userProfile.preferredDuration || '45–60 min');

  // Generation step animation
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationPhase, setGenerationPhase] = useState(0);
  const [isPlanReady, setIsPlanReady] = useState(false);

  useEffect(() => {
    if (step === 8) {
      setGenerationProgress(10);
      setGenerationPhase(0);
      setIsPlanReady(false);

      const t1 = setTimeout(() => { setGenerationProgress(35); setGenerationPhase(1); }, 700);
      const t2 = setTimeout(() => { setGenerationProgress(65); setGenerationPhase(2); }, 1400);
      const t3 = setTimeout(() => { setGenerationProgress(90); setGenerationPhase(3); }, 2100);
      const t4 = setTimeout(() => {
        setGenerationProgress(100);
        setIsPlanReady(true);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}
      }, 2800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [step]);

  if (!isOnboardingOpen) return null;

  const toggleEquipment = (item: EquipmentItem) => {
    if (item === 'No Equipment') {
      setEquipment(['No Equipment']);
      return;
    }
    const filtered = equipment.filter(e => e !== 'No Equipment');
    if (filtered.includes(item)) {
      setEquipment(filtered.filter(e => e !== item));
    } else {
      setEquipment([...filtered, item]);
    }
  };

  const handleFinish = () => {
    // Generate tailored workout plan based on selections
    const planExercises = EXERCISE_DATABASE.filter(ex => {
      if (equipment.includes('No Equipment')) {
        return ex.equipmentNeeded === 'No Equipment' || ex.id === 'bicep-curl';
      }
      return true;
    }).slice(0, 6);

    const generatedPlan: WorkoutPlan = {
      id: `ai-custom-plan-${Date.now()}`,
      title: goal === 'build_muscle' ? 'Upper Body Hypertrophy' : goal === 'lose_weight' ? 'High-Intensity Shred' : 'Functional Power Split',
      subtitle: `${experience.toUpperCase()} • ${duration}`,
      description: `Optimized AI routine designed for your ${goal.replace('_', ' ')} goal with emphasis on progressive overload and safe biomechanics.`,
      targetGoal: goal,
      durationMin: duration === '15–30 min' ? 25 : duration === '30–45 min' ? 40 : duration === '45–60 min' ? 50 : 65,
      difficulty: experience === 'beginner' ? 'Beginner' : experience === 'advanced' ? 'Advanced' : 'Intermediate',
      estimatedCalories: 330,
      exercises: planExercises.length > 0 ? planExercises : EXERCISE_DATABASE.slice(0, 5),
      focusMuscles: ['Chest', 'Back', 'Shoulders', 'Arms', 'Core'],
      dayOfWeek: 'Today'
    };

    const newProfile: UserProfile = {
      ...userProfile,
      name,
      age: Number(age) || 28,
      gender,
      heightCm: Number(heightCm) || 178,
      weightKg: Number(weightKg) || 75,
      goal,
      experience,
      location,
      equipment: equipment.length > 0 ? equipment : ['Dumbbells'],
      frequencyDaysPerWeek: frequency,
      preferredDuration: duration,
      completedOnboarding: true
    };

    completeOnboarding(newProfile, generatedPlan);
  };

  const goalsList: { id: FitnessGoal; title: string; desc: string; icon: any }[] = [
    { id: 'build_muscle', title: 'Build Muscle', desc: 'Maximize hypertrophy and develop lean athletic muscle mass.', icon: Dumbbell },
    { id: 'lose_weight', title: 'Lose Weight', desc: 'Burn calories, accelerate metabolism, and shed body fat.', icon: Flame },
    { id: 'improve_fitness', title: 'Improve Fitness', desc: 'Boost cardiovascular stamina, mobility, and day-to-day vitality.', icon: Activity },
    { id: 'increase_strength', title: 'Increase Strength', desc: 'Lift heavier, master compound lifts, and build dense tendon power.', icon: Target },
    { id: 'improve_endurance', title: 'Improve Endurance', desc: 'Enhance aerobic capacity, stamina, and muscular resilience.', icon: Heart },
    { id: 'stay_active', title: 'Stay Active', desc: 'Establish healthy consistent habits that fit effortlessly into your routine.', icon: Zap }
  ];

  const experienceOptions: { id: ExperienceLevel; title: string; desc: string }[] = [
    { id: 'beginner', title: 'Beginner', desc: 'New to resistance training or returning after a long break (< 6 months).' },
    { id: 'intermediate', title: 'Intermediate', desc: 'Consistent training for 1–2+ years with good form on core compound movements.' },
    { id: 'advanced', title: 'Advanced', desc: 'Experienced lifter (3+ years) comfortable with periodization and high intensity.' }
  ];

  const locationOptions: { id: WorkoutLocation; title: string; desc: string }[] = [
    { id: 'gym', title: 'Commercial Gym', desc: 'Access to barbells, cable machines, racks, and free weights.' },
    { id: 'home', title: 'Home Workout', desc: 'Convenient training in your living room or home garage gym.' },
    { id: 'outdoors', title: 'Outdoors', desc: 'Parks, calisthenics bars, running tracks, and bodyweight training.' },
    { id: 'both', title: 'Both Gym & Home', desc: 'Hybrid schedule alternating between gym days and quick home sessions.' }
  ];

  const equipmentList: EquipmentItem[] = [
    'No Equipment',
    'Dumbbells',
    'Barbell',
    'Resistance Bands',
    'Machines',
    'Kettlebells',
    'Pull-up Bar',
    'Full Gym'
  ];

  const phases = [
    'Analyzing your goals & biomechanics',
    'Matching optimal exercises & recovery intervals',
    'Building your weekly periodized schedule',
    'Optimizing rep ranges & volume progression'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-8 my-8 text-neutral-100 flex flex-col min-h-[580px] justify-between">
        {/* Close button if user already finished onboarding once */}
        {userProfile.completedOnboarding && step < 8 && (
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Step indicator */}
        {step > 1 && step < 8 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span className="font-semibold text-lime-400">Step {step - 1} of 6</span>
              <span>{Math.round(((step - 1) / 6) * 100)}% Completed</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-lime-400 transition-all duration-300 rounded-full"
                style={{ width: `${((step - 1) / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* SCREEN 1: WELCOME */}
        {step === 1 && (
          <div className="text-center py-6 flex-1 flex flex-col justify-center items-center">
            <div className="w-20 h-20 rounded-3xl bg-lime-400/10 border border-lime-400/30 text-lime-400 flex items-center justify-center mb-6 shadow-xl shadow-lime-400/10 glow-ai">
              <Sparkles className="w-10 h-10" />
            </div>
            <span className="text-xs uppercase tracking-widest text-lime-400 font-bold px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 mb-3">
              FitAI Coach
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
              Your AI Personal Trainer
            </h1>
            <p className="text-base text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
              Personalized workouts. Smarter progress. Better results. Tailored dynamically to your body, goals, and equipment.
            </p>

            <div className="w-full max-w-sm space-y-3">
              <button
                onClick={() => setStep(2)}
                className="w-full py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-base transition-all transform active:scale-95 shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setIsOnboardingOpen(false);
                }}
                className="w-full py-3 px-6 rounded-2xl bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 font-medium text-sm transition-colors cursor-pointer"
              >
                Already have an account? Log in
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: FITNESS GOAL */}
        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              What is your main fitness goal?
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              Choose your primary objective. FitAI Coach adapts your weekly volume and load distribution accordingly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 flex-1">
              {goalsList.map(item => {
                const Icon = item.icon;
                const isSelected = goal === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setGoal(item.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-lime-400/10 border-lime-400 text-white shadow-md shadow-lime-400/10'
                        : 'bg-neutral-800/40 border-neutral-800 text-neutral-300 hover:bg-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-lime-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-lime-400 text-neutral-950 flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1 text-white">{item.title}</h3>
                      <p className="text-xs text-neutral-400 leading-normal">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 3: EXPERIENCE LEVEL */}
        {step === 3 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              What is your fitness experience?
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              This helps your AI coach recommend the safest exercise difficulty and optimal rest times.
            </p>

            <div className="space-y-3 mb-6 flex-1">
              {experienceOptions.map(item => {
                const isSelected = experience === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setExperience(item.id)}
                    className={`w-full p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-lime-400/10 border-lime-400 text-white shadow-md shadow-lime-400/10'
                        : 'bg-neutral-800/40 border-neutral-800 text-neutral-300 hover:bg-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-lg text-white">{item.title}</span>
                      </div>
                      <p className="text-xs text-neutral-400 max-w-md">{item.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-lime-400 border-lime-400 text-neutral-950' : 'border-neutral-700 bg-neutral-800'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 4: WORKOUT LOCATION */}
        {step === 4 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Where do you usually work out?
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              We tailor your movement selections to fit your training environment.
            </p>

            <div className="space-y-3 mb-6 flex-1">
              {locationOptions.map(item => {
                const isSelected = location === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setLocation(item.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-lime-400/10 border-lime-400 text-white shadow-md shadow-lime-400/10'
                        : 'bg-neutral-800/40 border-neutral-800 text-neutral-300 hover:bg-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <h3 className="font-bold text-base text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-neutral-400">{item.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-lime-400 border-lime-400 text-neutral-950' : 'border-neutral-700 bg-neutral-800'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 5: EQUIPMENT */}
        {step === 5 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              What equipment do you have access to?
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              Select all that apply. FitAI will ensure your workouts only require available gear.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
              {equipmentList.map(item => {
                const isSelected = equipment.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleEquipment(item)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-lime-400/10 border-lime-400 text-white'
                        : 'bg-neutral-800/40 border-neutral-800 text-neutral-300 hover:bg-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <span className="font-semibold text-sm text-neutral-200">{item}</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isSelected ? 'bg-lime-400 border-lime-400 text-neutral-950' : 'border-neutral-700 bg-neutral-800'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 6: WORKOUT SCHEDULE */}
        {step === 6 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              How often can you work out?
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              Consistency outperforms intensity. Choose a sustainable weekly frequency.
            </p>

            <div className="mb-6">
              <label className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-2.5 block flex items-center gap-2">
                <Calendar className="w-4 h-4 text-lime-400" />
                Days Per Week
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6].map(days => (
                  <button
                    key={days}
                    onClick={() => setFrequency(days)}
                    className={`py-3 px-2 rounded-xl text-center font-bold text-sm transition-all cursor-pointer border ${
                      frequency === days
                        ? 'bg-lime-400 border-lime-400 text-neutral-950 shadow-md shadow-lime-400/20'
                        : 'bg-neutral-800/40 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {days} days
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-2.5 block flex items-center gap-2">
                <Clock className="w-4 h-4 text-lime-400" />
                Preferred Workout Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['15–30 min', '30–45 min', '45–60 min', '60+ min'] as WorkoutDurationPref[]).map(dur => (
                  <button
                    key={dur}
                    onClick={() => setDuration(dur)}
                    className={`py-3 px-2 rounded-xl text-center font-bold text-xs transition-all cursor-pointer border ${
                      duration === dur
                        ? 'bg-lime-400 border-lime-400 text-neutral-950 shadow-md shadow-lime-400/20'
                        : 'bg-neutral-800/40 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 7: BASIC INFORMATION */}
        {step === 7 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Tell us a bit about yourself
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              Keep it simple. Used strictly to compute energy expenditure and progressive loading.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-neutral-300 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 mb-1 block">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    min={14}
                    max={95}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 mb-1 block">Gender (Optional)</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 border border-neutral-700/80 text-white focus:outline-none focus:border-lime-400 transition-colors"
                  >
                    <option value="Not specified">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 mb-1 block">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={e => setHeightCm(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 mb-1 block">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={e => setWeightKg(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 8: AI PLAN GENERATION */}
        {step === 8 && (
          <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
            {!isPlanReady ? (
              <>
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-neutral-800" />
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-lime-400 border-t-transparent animate-spin"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-lime-400">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                  Building your personalized plan…
                </h2>
                <p className="text-xs text-lime-400 font-mono tracking-wide mb-6">
                  {phases[generationPhase]}
                </p>

                {/* Progress breakdown */}
                <div className="w-full max-w-sm space-y-2.5 text-left mb-6">
                  {phases.map((ph, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs">
                      {idx < generationPhase ? (
                        <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                      ) : idx === generationPhase ? (
                        <div className="w-4 h-4 rounded-full border-2 border-lime-400 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-neutral-700 shrink-0" />
                      )}
                      <span className={idx <= generationPhase ? 'text-neutral-200 font-medium' : 'text-neutral-500'}>
                        {ph}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-3xl bg-lime-400 text-neutral-950 flex items-center justify-center mb-6 shadow-xl shadow-lime-400/20">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-2">
                  Your personalized plan is ready.
                </h2>
                <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
                  We engineered an upper-lower frequency split targeting {goal.replace('_', ' ')} with exercises matched to your equipment.
                </p>

                <div className="w-full max-w-sm p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 text-left mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-lime-400 mb-1">
                    Generated Recommendation
                  </div>
                  <h4 className="font-bold text-white text-base">Upper Body Strength</h4>
                  <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                    <span>{duration}</span>
                    <span>•</span>
                    <span>6 Exercises</span>
                    <span>•</span>
                    <span>~320 kcal</span>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full max-w-sm py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-base transition-all transform active:scale-95 shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View My Plan</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Navigation Buttons for steps 2 to 7 */}
        {step > 1 && step < 8 && (
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80">
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 font-semibold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-lime-400/10"
            >
              <span>{step === 7 ? 'Generate My Plan' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
