import React from 'react';
import { X, Check, Moon, Sliders, Bell, Shield, Sparkles, RotateCcw, Wifi, Download, Smartphone } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    userProfile, 
    updateUserProfile, 
    resetToDemoData,
    setIsOnboardingOpen 
  } = useFitness();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-8 my-8 text-neutral-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white">App Settings</h2>
            <p className="text-xs text-neutral-400">Configure units, coach persona, and preferences</p>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Measurement Units */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-lime-400" />
            Measurement Units
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300">Weight Units</span>
              <div className="flex rounded-lg bg-neutral-800 p-0.5 border border-neutral-700">
                <button
                  onClick={() => updateUserProfile({ weightUnit: 'kg' })}
                  className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                    userProfile.weightUnit === 'kg' ? 'bg-lime-400 text-neutral-950' : 'text-neutral-400'
                  }`}
                >
                  KG
                </button>
                <button
                  onClick={() => updateUserProfile({ weightUnit: 'lbs' })}
                  className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                    userProfile.weightUnit === 'lbs' ? 'bg-lime-400 text-neutral-950' : 'text-neutral-400'
                  }`}
                >
                  LBS
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300">Height Units</span>
              <div className="flex rounded-lg bg-neutral-800 p-0.5 border border-neutral-700">
                <button
                  onClick={() => updateUserProfile({ heightUnit: 'cm' })}
                  className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                    userProfile.heightUnit === 'cm' ? 'bg-lime-400 text-neutral-950' : 'text-neutral-400'
                  }`}
                >
                  CM
                </button>
                <button
                  onClick={() => updateUserProfile({ heightUnit: 'ft' })}
                  className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                    userProfile.heightUnit === 'ft' ? 'bg-lime-400 text-neutral-950' : 'text-neutral-400'
                  }`}
                >
                  FT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AI Coach Persona */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lime-400" />
            AI Coach Persona
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'supportive', label: 'Supportive', desc: 'Positive encouragement & steady habit building' },
              { id: 'technical', label: 'Technical', desc: 'Sports science, biomechanics & data-driven' },
              { id: 'strict', label: 'Strict Trainer', desc: 'High discipline, zero excuses & tough love' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => updateUserProfile({ aiPersona: p.id as any })}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  userProfile.aiPersona === p.id
                    ? 'bg-lime-400/10 border-lime-400 text-white'
                    : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <span className="font-bold text-xs block mb-1 text-white">{p.label}</span>
                <span className="text-[10px] text-neutral-400 block leading-tight">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Theme */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Moon className="w-4 h-4 text-lime-400" />
            Display Theme
          </h3>
          <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-semibold">Premium Charcoal & Lime (Dark Mode)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 border border-lime-400/30">
              Active
            </span>
          </div>
        </div>

        {/* 4. Offline & Workbox Caching */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-lime-400" />
            Offline Availability & Workbox Cache
          </h3>
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white block">Offline Workout & Asset Cache</span>
                <span className="text-[11px] text-neutral-400">
                  Plans, exercises, and progress are stored in CacheStorage + LocalStorage
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 border border-lime-400/30 shrink-0">
                Active
              </span>
            </div>
            <div className="pt-1 flex items-center justify-between border-t border-neutral-800/80">
              <span className="text-xs text-neutral-400">PWA Standalone App</span>
              <PWAInstallButton compact={true} />
            </div>
          </div>
        </div>

        {/* 5. Reset & Re-plan */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setIsSettingsOpen(false);
              setIsOnboardingOpen(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-lime-400 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-run Onboarding & AI Plan</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all stats to demo default state?')) {
                resetToDemoData();
                setIsSettingsOpen(false);
              }
            }}
            className="py-2.5 px-4 rounded-xl text-neutral-400 hover:text-red-400 text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
