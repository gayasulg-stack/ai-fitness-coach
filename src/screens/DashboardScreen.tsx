import React, { useState } from 'react';
import { 
  Dumbbell, 
  Flame, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  ChevronRight, 
  ArrowUpRight, 
  TrendingUp, 
  Calendar,
  Info,
  Eye,
  Apple,
  Sliders,
  Mic,
  Plus
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const DashboardScreen: React.FC = () => {
  const { 
    userProfile, 
    currentWorkout, 
    startWorkout, 
    setActiveScreen, 
    openAICoachWithPrompt,
    recommendations,
    openFormVisionModal,
    openMealScannerModal,
    openDayTuneModal,
    openVoiceCoachModal,
    loggedMeals
  } = useFitness();

  const [chartMetric, setChartMetric] = useState<'consistency' | 'weight' | 'strength'>('consistency');
  const [chartRange, setChartRange] = useState<'7d' | '30d' | '3m'>('7d');

  // Nutrition targets
  const targetProteinGrams = Math.round(userProfile.weightKg * 2.0);
  const totalProteinLogged = loggedMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalCaloriesLogged = loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  const proteinProgressPercent = Math.min(100, Math.round((totalProteinLogged / targetProteinGrams) * 100));

  // Days of week
  const weekDays = [
    { day: 'Mon', completed: true, label: 'Push A' },
    { day: 'Tue', completed: true, label: 'Pull A' },
    { day: 'Wed', completed: false, rest: true, label: 'Rest' },
    { day: 'Thu', completed: true, label: 'Legs A' },
    { day: 'Fri', completed: true, label: 'Upper' },
    { day: 'Sat', completed: false, isToday: true, label: 'Today' },
    { day: 'Sun', completed: false, label: 'Active' },
  ];

  // Chart dummy coordinates according to metric and timeframe
  const getChartData = () => {
    if (chartMetric === 'weight') {
      return {
        title: 'Bodyweight Trend',
        unit: 'kg',
        current: `${userProfile.weightKg} kg`,
        change: '-1.4 kg this month',
        points: [77.4, 77.1, 76.8, 76.6, 76.3, 76.1, 76.0]
      };
    }
    if (chartMetric === 'strength') {
      return {
        title: 'Bench Press Estimated 1RM',
        unit: 'kg',
        current: '82.5 kg',
        change: '+8.0 kg (10.7%)',
        points: [70, 72.5, 75, 75, 77.5, 80, 82.5]
      };
    }
    return {
      title: 'Training Consistency & Minutes',
      unit: 'min',
      current: '215 min',
      change: '4 / 5 sessions logged',
      points: [45, 50, 0, 48, 55, 0, 40]
    };
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Good morning, {userProfile.name.split(' ')[0]}
            </h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-sm md:text-base text-neutral-400 mt-1">
            Ready to get stronger today? Your progressive overload targets are ready.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-neutral-400 block font-medium">Program Focus</span>
            <span className="text-sm font-bold text-lime-400 capitalize">
              {userProfile.goal.replace('_', ' ')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-lime-400 font-bold text-lg shadow-sm">
            {userProfile.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* TODAY'S WORKOUT FEATURED CARD (Highest Priority) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-6 md:p-8 shadow-2xl">
        {/* Subtle accent glow in background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                Today's Workout
              </span>
              <span className="text-xs font-semibold text-neutral-400">
                {currentWorkout.difficulty}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {currentWorkout.title}
            </h2>

            <p className="text-sm text-neutral-300 leading-relaxed">
              {currentWorkout.description}
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-neutral-300 font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50">
                <Clock className="w-4 h-4 text-lime-400" />
                <span>{currentWorkout.durationMin} min</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50">
                <Dumbbell className="w-4 h-4 text-lime-400" />
                <span>{currentWorkout.exercises.length} exercises</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>~{currentWorkout.estimatedCalories} kcal</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Progress</span>
                <span className="text-lime-400 font-mono font-bold">0% completed</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-lime-400 rounded-full w-0" />
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => startWorkout(currentWorkout)}
              className="py-4 px-8 rounded-2xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-black text-base shadow-xl shadow-lime-400/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Workout</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openDayTuneModal()}
                className="flex-1 py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-lime-400 font-bold text-xs border border-lime-400/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Calibrate volume for today's soreness and energy"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Tune with AI</span>
              </button>

              <button
                onClick={() => setActiveScreen('workout')}
                className="py-3 px-4 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 font-semibold text-xs border border-neutral-700/80 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE AI SMART SUITE HUB */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Interactive AI Hub</h3>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">Multimodal Gemini Tools</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Tool 1: Form Vision */}
          <button
            onClick={() => openFormVisionModal()}
            className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-lime-400/50 hover:bg-neutral-850 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block group-hover:text-lime-400 transition-colors">
              AI Form Vision
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5 leading-tight">
              Instant biomechanics & posture scan
            </span>
          </button>

          {/* Tool 2: Macro Scanner */}
          <button
            onClick={() => openMealScannerModal()}
            className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-lime-400/50 hover:bg-neutral-850 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Apple className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block group-hover:text-lime-400 transition-colors">
              AI Macro Scanner
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5 leading-tight">
              Snap food & track recovery protein
            </span>
          </button>

          {/* Tool 3: Day Tune */}
          <button
            onClick={() => openDayTuneModal()}
            className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-lime-400/50 hover:bg-neutral-850 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sliders className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block group-hover:text-lime-400 transition-colors">
              AI Day Tuning
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5 leading-tight">
              Calibrate to energy & soreness
            </span>
          </button>

          {/* Tool 4: Live Voice Coach */}
          <button
            onClick={() => openVoiceCoachModal()}
            className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-lime-400/50 hover:bg-neutral-850 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block group-hover:text-lime-400 transition-colors">
              Live Voice Coach
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5 leading-tight">
              Hands-free real-time audio coach
            </span>
          </button>
        </div>
      </div>

      {/* WEEKLY PROGRESS + 4 FITNESS METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Card (1 col) */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-lime-400" />
                Weekly Progress
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 border border-lime-400/30">
                4 / 5 Done
              </span>
            </div>

            <p className="text-xs text-neutral-400 mb-5">
              Great job! You're 80% through your weekly goal. Keep your momentum going through the weekend.
            </p>

            {/* Mon-Sun circle indicators */}
            <div className="grid grid-cols-7 gap-1.5 text-center mb-6">
              {weekDays.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-neutral-400">{d.day}</span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      d.completed
                        ? 'bg-lime-400 text-neutral-950 shadow-md shadow-lime-400/20'
                        : d.isToday
                        ? 'border-2 border-dashed border-lime-400 text-lime-400 bg-lime-400/10'
                        : d.rest
                        ? 'bg-neutral-800/50 text-neutral-500 border border-neutral-800'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700/60'
                    }`}
                  >
                    {d.completed ? (
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    ) : d.isToday ? (
                      'GO'
                    ) : (
                      '—'
                    )}
                  </div>
                  <span className="text-[9px] text-neutral-500 truncate w-full">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Weekly Target</span>
            <span className="font-bold text-neutral-200">5 sessions / week</span>
          </div>
        </div>

        {/* 4 Fitness Metrics (2 cols) */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Workouts */}
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-400">Workouts</span>
              <div className="p-2 rounded-xl bg-lime-400/10 text-lime-400">
                <Dumbbell className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {userProfile.totalWorkouts}
              </span>
              <span className="block text-[11px] text-lime-400 font-medium mt-1">
                +4 this week
              </span>
            </div>
          </div>

          {/* Calories */}
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-400">Calories</span>
              <div className="p-2 rounded-xl bg-orange-400/10 text-orange-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {userProfile.totalCalories.toLocaleString()}
              </span>
              <span className="block text-[11px] text-orange-400 font-medium mt-1">
                kcal burned
              </span>
            </div>
          </div>

          {/* Workout Time */}
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-400">Workout Time</span>
              <div className="p-2 rounded-xl bg-blue-400/10 text-blue-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {Math.floor(userProfile.totalMinutes / 60)}h {userProfile.totalMinutes % 60}m
              </span>
              <span className="block text-[11px] text-neutral-400 font-medium mt-1">
                Total under tension
              </span>
            </div>
          </div>

          {/* Current Streak */}
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-400">Current Streak</span>
              <div className="p-2 rounded-xl bg-yellow-400/10 text-yellow-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {userProfile.streakDays}
              </span>
              <span className="block text-[11px] text-yellow-400 font-medium mt-1">
                days consistent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI COACH INSIGHT CARD (Visually Distinct) */}
      <div className="p-6 md:p-7 rounded-3xl bg-neutral-900 border border-lime-500/30 shadow-xl relative overflow-hidden glow-ai">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-lime-400 text-neutral-950 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-white tracking-tight">
                AI Coach Insight
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30">
                Smart Analysis
              </span>
            </div>
            <p className="text-sm text-neutral-300 max-w-3xl leading-relaxed">
              "You've completed 3 strength workouts this week. Your consistency is improving. Consider adding one recovery day before your next heavy session to maximize muscle protein synthesis and prevent CNS fatigue."
            </p>
          </div>

          <button
            onClick={() => openAICoachWithPrompt("Can you give me a personalized recovery plan for my soreness?")}
            className="py-3 px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700/80 text-lime-400 font-bold text-sm border border-lime-400/40 shrink-0 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI Coach</span>
          </button>
        </div>
      </div>

      {/* PROGRESS SUMMARY INTERACTIVE CHART */}
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-lime-400" />
              <h3 className="font-extrabold text-lg text-white">Progress Summary</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Tracking your key physiological markers and strength milestones
            </p>
          </div>

          {/* Metric Selector & Timeframe */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex p-1 rounded-xl bg-neutral-950 border border-neutral-800">
              <button
                onClick={() => setChartMetric('consistency')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  chartMetric === 'consistency' ? 'bg-neutral-800 text-lime-400' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Consistency
              </button>
              <button
                onClick={() => setChartMetric('weight')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  chartMetric === 'weight' ? 'bg-neutral-800 text-lime-400' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Weight
              </button>
              <button
                onClick={() => setChartMetric('strength')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  chartMetric === 'strength' ? 'bg-neutral-800 text-lime-400' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Strength
              </button>
            </div>

            <div className="flex p-1 rounded-xl bg-neutral-950 border border-neutral-800">
              {(['7d', '30d', '3m'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors cursor-pointer ${
                    chartRange === range ? 'bg-lime-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '3 Months'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Metric Highlight */}
        <div className="mb-6 flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-white">{chartData.current}</span>
          <span className="text-xs font-bold text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
            {chartData.change}
          </span>
        </div>

        {/* SVG Line Chart Graphic */}
        <div className="w-full h-48 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160" preserveAspectRatio="none">
            {/* Background Grid Lines */}
            <line x1="0" y1="40" x2="700" y2="40" stroke="#262626" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="700" y2="80" stroke="#262626" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="700" y2="120" stroke="#262626" strokeDasharray="4 4" />

            {/* Gradient Fill under line */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a3e635" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#a3e635" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Path */}
            <path
              d="M 20 120 Q 130 90, 240 70 T 470 50 T 680 30 L 680 150 L 20 150 Z"
              fill="url(#chartGradient)"
            />

            {/* Smooth curve line */}
            <path
              d="M 20 120 Q 130 90, 240 70 T 470 50 T 680 30"
              fill="none"
              stroke="#a3e635"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data points */}
            {[
              { cx: 20, cy: 120 },
              { cx: 130, cy: 95 },
              { cx: 240, cy: 70 },
              { cx: 350, cy: 65 },
              { cx: 470, cy: 50 },
              { cx: 580, cy: 42 },
              { cx: 680, cy: 30 }
            ].map((pt, idx) => (
              <g key={idx}>
                <circle cx={pt.cx} cy={pt.cy} r="5" fill="#a3e635" />
                <circle cx={pt.cx} cy={pt.cy} r="2" fill="#0a0a0a" />
              </g>
            ))}
          </svg>

          {/* X Axis Labels */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-3 font-mono">
            <span>Day 1</span>
            <span>Day 2</span>
            <span>Day 3</span>
            <span>Day 4</span>
            <span>Day 5</span>
            <span>Day 6</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* AI RECOMMENDATION CARDS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <h3 className="font-extrabold text-base text-white">Dynamic AI Recommendations</h3>
          </div>
          <button
            onClick={() => setActiveScreen('ai-coach')}
            className="text-xs text-lime-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Open Coach Chat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map(rec => (
            <div
              key={rec.id}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 px-2 py-0.5 rounded bg-lime-400/10 border border-lime-400/20">
                    {rec.badge}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white mb-1.5">{rec.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  {rec.message}
                </p>
              </div>

              {rec.actionLabel && (
                <button
                  onClick={() => {
                    if (rec.actionRoute === 'workout') {
                      setActiveScreen('workout');
                    } else {
                      openAICoachWithPrompt(`Regarding ${rec.title}: how do I best implement this advice?`);
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{rec.actionLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-lime-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
