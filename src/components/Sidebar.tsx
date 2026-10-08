import React from 'react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  TrendingUp, 
  Sparkles, 
  User, 
  Flame, 
  Play, 
  Settings, 
  RotateCcw
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const Sidebar: React.FC = () => {
  const { 
    activeScreen, 
    setActiveScreen, 
    activeSession, 
    userProfile, 
    setIsSettingsOpen, 
    setIsOnboardingOpen 
  } = useFitness();

  interface NavItem {
    id: 'dashboard' | 'workout' | 'progress' | 'ai-coach' | 'profile';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'ai-coach', label: 'AI Coach', icon: Sparkles, badge: 'AI' },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-neutral-900/90 border-r border-neutral-800/80 p-5 shrink-0 select-none backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-lime-400 text-neutral-950 flex items-center justify-center font-black text-xl shadow-lg shadow-lime-400/20">
          <Dumbbell className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg tracking-tight text-white">FitAI</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-400 border border-lime-400/30">
              COACH
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">Next-gen Personal Trainer</p>
        </div>
      </div>

      {/* Active Workout Quick Bar if in progress */}
      {activeSession && (
        <div className="mb-6 p-3 rounded-xl bg-lime-950/40 border border-lime-500/30">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-lime-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              Live Workout
            </span>
            <span className="text-neutral-400 font-mono text-[11px]">In progress</span>
          </div>
          <p className="text-xs font-medium text-neutral-200 truncate mb-2.5">
            {activeSession.workoutTitle}
          </p>
          <button
            onClick={() => {}}
            className="w-full py-1.5 px-3 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Resume Workout
          </button>
        </div>
      )}

      {/* Main Nav Items */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-neutral-800 text-lime-400 shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-lime-400 stroke-[2.4]' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Streak & Motivation Pill */}
      <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span>Consistency Streak</span>
          </div>
          <span className="text-xs font-bold text-orange-400">{userProfile.streakDays} Days</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-lime-400 rounded-full"
            style={{ width: `${Math.min(100, (userProfile.streakDays / 10) * 100)}%` }}
          />
        </div>
        <p className="text-[11px] text-neutral-500 mt-2">
          {userProfile.streakDays >= 7 ? '🔥 Unstoppable rhythm!' : '3 days to unlock 10-day medal!'}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-2 hover:text-neutral-200 transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-neutral-800/50"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => setIsOnboardingOpen(true)}
          title="Restart Onboarding"
          className="flex items-center gap-1.5 hover:text-lime-400 transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-neutral-800/50 text-[11px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Re-Plan</span>
        </button>
      </div>
    </aside>
  );
};
