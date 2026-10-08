import React from 'react';
import { Dumbbell, Flame, Sparkles, User, Settings, Play } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { PWAInstallButton } from './PWAInstallButton';

export const Navbar: React.FC = () => {
  const { 
    userProfile, 
    activeSession, 
    setActiveScreen, 
    setIsSettingsOpen, 
    openAICoachWithPrompt 
  } = useFitness();

  return (
    <header className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Mobile Brand / Desktop Title */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-lime-400 text-neutral-950 flex items-center justify-center font-black">
            <Dumbbell className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">FitAI</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-lime-400" />
          <span>AI Engine: Active • Personalized for {userProfile.goal.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* In-App PWA Install Button */}
        <PWAInstallButton compact={true} />

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-200">
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span>{userProfile.streakDays}</span>
          <span className="hidden sm:inline text-neutral-400 text-[11px]">day streak</span>
        </div>

        {/* Quick AI advice chip */}
        <button
          onClick={() => openAICoachWithPrompt("What should I focus on for today's workout?")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-400/10 hover:bg-lime-400/20 border border-lime-400/30 text-lime-400 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>

        {/* Settings button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="App Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => setActiveScreen('profile')}
          className="flex items-center gap-2 p-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-600 flex items-center justify-center text-xs font-bold text-lime-400 ring-2 ring-lime-400/20">
            {userProfile.name.charAt(0) || 'A'}
          </div>
        </button>
      </div>
    </header>
  );
};
