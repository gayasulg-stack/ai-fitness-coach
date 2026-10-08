import React from 'react';
import { LayoutDashboard, Dumbbell, TrendingUp, Sparkles, User } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, activeSession } = useFitness();

  // If in active workout screen, we hide the bottom nav or show minimal version so full focus is on tracking
  if (activeSession) return null;

  interface TabItem {
    id: 'dashboard' | 'workout' | 'progress' | 'ai-coach' | 'profile';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isAI?: boolean;
  }

  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'ai-coach', label: 'AI Coach', icon: Sparkles, isAI: true },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800/90 px-3 py-2 pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveScreen(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-lime-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.isAI && (
                <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              )}
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5] scale-105' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
