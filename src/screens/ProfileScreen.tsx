import React from 'react';
import { 
  User, 
  Target, 
  Dumbbell, 
  Settings, 
  Shield, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  Flame, 
  Clock, 
  MapPin, 
  Bell
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const ProfileScreen: React.FC = () => {
  const { 
    userProfile, 
    setIsSettingsOpen, 
    setIsOnboardingOpen, 
    resetToDemoData,
    openAICoachWithPrompt 
  } = useFitness();

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header Profile Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-neutral-800 border-2 border-lime-400/40 text-lime-400 flex items-center justify-center font-black text-2xl shadow-xl shadow-lime-400/10">
              {userProfile.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{userProfile.name}</h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Fitness Level: <span className="text-neutral-200 capitalize font-semibold">{userProfile.experience}</span>
              </p>
              <p className="text-xs text-neutral-400">
                Main Goal: <span className="text-lime-400 capitalize font-semibold">{userProfile.goal.replace('_', ' ')}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-center"
          >
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Personal Information */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <User className="w-4 h-4 text-lime-400" />
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <span className="text-neutral-400 block mb-0.5">Age</span>
              <span className="text-white font-bold text-sm">{userProfile.age} yrs</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <span className="text-neutral-400 block mb-0.5">Gender</span>
              <span className="text-white font-bold text-sm">{userProfile.gender}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <span className="text-neutral-400 block mb-0.5">Height</span>
              <span className="text-white font-bold text-sm">{userProfile.heightCm} {userProfile.heightUnit}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <span className="text-neutral-400 block mb-0.5">Weight</span>
              <span className="text-white font-bold text-sm">{userProfile.weightKg} {userProfile.weightUnit}</span>
            </div>
          </div>
        </div>

        {/* 2. Fitness Goals & Schedule */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-lime-400" />
              Fitness Goals & Schedule
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <span className="text-neutral-400 block mb-0.5">Weekly Frequency</span>
              <span className="text-white font-bold text-sm">{userProfile.frequencyDaysPerWeek} days / week</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <span className="text-neutral-400 block mb-0.5">Preferred Duration</span>
              <span className="text-white font-bold text-sm">{userProfile.preferredDuration}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 col-span-2">
              <span className="text-neutral-400 block mb-0.5">Primary Training Location</span>
              <span className="text-lime-400 font-bold text-sm capitalize">{userProfile.location}</span>
            </div>
          </div>
        </div>

        {/* 3. Available Equipment */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-lime-400" />
              Available Equipment
            </h3>
            <span className="text-xs text-neutral-400">{userProfile.equipment.length} items</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {userProfile.equipment.map(item => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-xs border border-neutral-700 font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 4. AI Coach Config */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lime-400" />
              AI Coach Setup
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-400/10 text-lime-400">
              Active
            </span>
          </div>

          <p className="text-xs text-neutral-400">
            Tone: <span className="text-white font-semibold capitalize">{userProfile.aiPersona}</span>. FitAI continuously adapts volume and recovery based on logged repetitions.
          </p>

          <button
            onClick={() => openAICoachWithPrompt("Evaluate my overall training split and recommend any periodization adjustments.")}
            className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-lime-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ask Coach for Macro Analysis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Account & App Actions List */}
      <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 divide-y divide-neutral-800">
        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="w-full py-3.5 px-3 flex items-center justify-between hover:bg-neutral-800/40 rounded-xl transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <RotateCcw className="w-4 h-4 text-lime-400" />
            <span className="text-sm font-semibold text-neutral-200">Re-run AI Onboarding & Generate New Plan</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full py-3.5 px-3 flex items-center justify-between hover:bg-neutral-800/40 rounded-xl transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-semibold text-neutral-200">Notifications & Daily Reminders</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full py-3.5 px-3 flex items-center justify-between hover:bg-neutral-800/40 rounded-xl transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-semibold text-neutral-200">Privacy & Data Security</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </button>

        <button
          onClick={() => openAICoachWithPrompt("Can you give me guidance on how to navigate and use FitAI Coach?")}
          className="w-full py-3.5 px-3 flex items-center justify-between hover:bg-neutral-800/40 rounded-xl transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-semibold text-neutral-200">Help & Support Guide</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </button>
      </div>

      {/* Logout / Reset Demo */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={() => {
            if (window.confirm('Reset all progress and restart demo?')) {
              resetToDemoData();
            }
          }}
          className="text-xs font-semibold text-neutral-500 hover:text-red-400 transition-colors cursor-pointer py-2 px-4"
        >
          Reset Application & Clear Cache
        </button>
      </div>
    </div>
  );
};
