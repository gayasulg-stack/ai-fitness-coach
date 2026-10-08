import React, { useState } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Clock, 
  Dumbbell, 
  Trophy, 
  CheckCircle2, 
  Lock, 
  ArrowUpRight, 
  Calendar,
  Sparkles,
  ChevronRight,
  Zap,
  Flag,
  Crown
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const ProgressScreen: React.FC = () => {
  const { 
    userProfile, 
    personalRecords, 
    milestones, 
    completedWorkouts,
    openAICoachWithPrompt 
  } = useFitness();

  const [activeTab, setActiveTab] = useState<'week' | 'month' | '3months' | '6months'>('month');
  const [selectedChart, setSelectedChart] = useState<'weight' | 'frequency' | 'strength' | 'calories'>('strength');

  // Chart data simulation depending on view
  const chartConfigs = {
    strength: {
      title: 'Strength Progress (Compound Index)',
      metric: '+11.1%',
      subtitle: 'Based on 1RM calculations',
      data: [65, 68, 70, 71, 73, 75, 78],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'Now'],
      unit: 'kg'
    },
    weight: {
      title: 'Bodyweight Trajectory',
      metric: `${userProfile.weightKg} kg`,
      subtitle: '-1.8 kg steady lean transformation',
      data: [78.2, 77.8, 77.4, 76.9, 76.5, 76.2, 76.0],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'Now'],
      unit: 'kg'
    },
    frequency: {
      title: 'Workout Frequency & Adherence',
      metric: '92% adherence',
      subtitle: 'Target 4 sessions per week achieved',
      data: [4, 5, 3, 4, 5, 4, 4],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'Now'],
      unit: 'days'
    },
    calories: {
      title: 'Total Active Energy Expenditure',
      metric: '8,420 kcal',
      subtitle: '~320 kcal average per training day',
      data: [1200, 1450, 1100, 1380, 1500, 1420, 1370],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'Now'],
      unit: 'kcal'
    }
  };

  const currentChart = chartConfigs[selectedChart];

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
            Analytics & Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Your Progress
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time biometric progression, personal records, and habit milestone tracking.
          </p>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex p-1 rounded-2xl bg-neutral-900 border border-neutral-800">
          {(['week', 'month', '3months', '6months'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-lime-400 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab === 'week' ? 'Week' : tab === 'month' ? 'Month' : tab === '3months' ? '3 Months' : '6 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* TOP SUMMARY CARDS (3 cards: Streak, Workouts, Total Time) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current Streak */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 block mb-1">Current Streak</span>
            <div className="text-3xl font-black text-white tracking-tight">
              {userProfile.streakDays} <span className="text-lg font-medium text-neutral-400">days</span>
            </div>
            <span className="text-xs text-orange-400 font-semibold mt-1 inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current" /> Active streak
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-400/10 text-orange-400 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-current" />
          </div>
        </div>

        {/* Workouts */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 block mb-1">Workouts</span>
            <div className="text-3xl font-black text-white tracking-tight">
              {userProfile.totalWorkouts}
            </div>
            <span className="text-xs text-lime-400 font-semibold mt-1 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% on schedule
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-lime-400/10 text-lime-400 flex items-center justify-center">
            <Dumbbell className="w-6 h-6" />
          </div>
        </div>

        {/* Total Time */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 block mb-1">Total Time</span>
            <div className="text-3xl font-black text-white tracking-tight">
              {Math.floor(userProfile.totalMinutes / 60)}h {userProfile.totalMinutes % 60}m
            </div>
            <span className="text-xs text-blue-400 font-semibold mt-1 inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> High quality volume
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-400/10 text-blue-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* PROGRESS CHARTS SECTION */}
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-white">Progress Charts</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select metric to view trendlines and progressive adaptation
            </p>
          </div>

          {/* Metric Switchers */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'strength', label: 'Strength Progress' },
              { id: 'weight', label: 'Weight Trend' },
              { id: 'frequency', label: 'Workout Frequency' },
              { id: 'calories', label: 'Calories Burned' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedChart(m.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  selectedChart === m.id
                    ? 'bg-neutral-800 border-lime-400/40 text-lime-400'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Header Stats */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-black text-white">{currentChart.metric}</span>
          <span className="text-xs text-neutral-400 font-medium">{currentChart.subtitle}</span>
        </div>

        {/* Chart Canvas / SVG */}
        <div className="w-full h-52 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160" preserveAspectRatio="none">
            <line x1="0" y1="40" x2="700" y2="40" stroke="#262626" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2="700" y2="80" stroke="#262626" strokeDasharray="3 3" />
            <line x1="0" y1="120" x2="700" y2="120" stroke="#262626" strokeDasharray="3 3" />

            <defs>
              <linearGradient id="progGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a3e635" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a3e635" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Dynamic visual path */}
            <path
              d="M 20 130 C 120 120, 220 90, 340 80 C 460 70, 560 50, 680 30 L 680 150 L 20 150 Z"
              fill="url(#progGradient)"
            />
            <path
              d="M 20 130 C 120 120, 220 90, 340 80 C 460 70, 560 50, 680 30"
              fill="none"
              stroke="#a3e635"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {[
              { x: 20, y: 130 },
              { x: 130, y: 115 },
              { x: 240, y: 92 },
              { x: 350, y: 80 },
              { x: 460, y: 68 },
              { x: 570, y: 48 },
              { x: 680, y: 30 }
            ].map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="5" fill="#a3e635" />
                <circle cx={pt.x} cy={pt.y} r="2" fill="#0a0a0a" />
              </g>
            ))}
          </svg>

          {/* X axis labels */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-3 font-mono">
            {currentChart.labels.map((lbl, idx) => (
              <span key={idx}>{lbl}</span>
            ))}
          </div>
        </div>
      </div>

      {/* PERSONAL RECORDS (PR CARDS) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="font-extrabold text-lg text-white">Personal Records (PRs)</h3>
          </div>
          <span className="text-xs text-neutral-400">All-time tracked lifts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {personalRecords.map(pr => (
            <div
              key={pr.id}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 font-semibold truncate">
                  {pr.exerciseName}
                </span>
                <span className="text-[10px] font-bold text-lime-400 px-1.5 py-0.5 rounded bg-lime-400/10">
                  {pr.improvementPercentage ? `+${pr.improvementPercentage}%` : 'PR'}
                </span>
              </div>

              <div className="text-2xl font-black text-white font-mono">
                {pr.value} <span className="text-xs font-semibold text-neutral-400">{pr.unit}</span>
              </div>

              <span className="text-[11px] text-neutral-500 mt-2 block">
                Achieved {pr.dateAchieved}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MILESTONES TIMELINE */}
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-neutral-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-lg text-white">Milestones Journey</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Key consistency benchmarks unlocked as you progress
            </p>
          </div>
          <span className="text-xs font-bold text-lime-400 bg-lime-400/10 px-2.5 py-1 rounded-full border border-lime-400/20">
            {userProfile.totalWorkouts} Completed Workouts
          </span>
        </div>

        {/* Timeline Horizontal / Vertical */}
        <div className="relative space-y-6 before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-neutral-800">
          {milestones.map((milestone, idx) => {
            const isUnlocked = milestone.isUnlocked;
            return (
              <div key={milestone.id} className="relative flex items-start gap-4 pl-2">
                {/* Node icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                    isUnlocked
                      ? 'bg-lime-400 text-neutral-950 shadow-md shadow-lime-400/20 ring-4 ring-neutral-900'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700 ring-4 ring-neutral-900'
                  }`}
                >
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Milestone Content */}
                <div className={`p-4 rounded-2xl flex-1 border transition-all ${
                  isUnlocked
                    ? 'bg-neutral-950/60 border-lime-400/30'
                    : 'bg-neutral-950/30 border-neutral-800/80 opacity-70'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-white">{milestone.title}</h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {isUnlocked ? `Unlocked ${milestone.unlockedDate || 'Recently'}` : `Target: ${milestone.targetWorkouts} sessions`}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{milestone.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
