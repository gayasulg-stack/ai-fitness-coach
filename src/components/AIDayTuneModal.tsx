import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Sparkles, 
  BatteryCharging, 
  Clock, 
  Flame, 
  Check, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight,
  Dumbbell
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { adaptWorkoutPlan, AIWorkoutAdaptationResult } from '../services/aiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SORENESS_OPTIONS = [
  'Chest',
  'Shoulders',
  'Lower Back',
  'Quads',
  'Hamstrings',
  'Biceps / Triceps',
  'Core'
];

const TIME_OPTIONS = [15, 30, 45, 60];

export const AIDayTuneModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { userProfile, currentWorkout, selectWorkoutPlan } = useFitness();

  const [energyLevel, setEnergyLevel] = useState<number>(75);
  const [availableMinutes, setAvailableMinutes] = useState<number>(currentWorkout.durationMinutes || 45);
  const [selectedSoreness, setSelectedSoreness] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [adaptedResult, setAdaptedResult] = useState<AIWorkoutAdaptationResult | null>(null);
  const [applied, setApplied] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleSoreness = (area: string) => {
    setSelectedSoreness(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleGenerateAdaptation = async () => {
    setIsGenerating(true);
    setAdaptedResult(null);
    setApplied(false);

    try {
      const result = await adaptWorkoutPlan(
        selectedSoreness,
        energyLevel,
        availableMinutes,
        userProfile,
        currentWorkout
      );
      setAdaptedResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyPlan = () => {
    if (!adaptedResult) return;

    // Construct valid workout plan
    const newWorkoutPlan = {
      ...currentWorkout,
      title: adaptedResult.adaptedTitle,
      durationMinutes: adaptedResult.estimatedMinutes,
      estimatedCalories: adaptedResult.estimatedCalories,
      exercises: adaptedResult.adaptedExercises.map((ex: any, idx: number) => ({
        id: ex.id || `adapted-${idx}-${Date.now()}`,
        name: ex.name,
        targetMuscles: ex.targetMuscles || 'Full Body',
        sets: Number(ex.sets) || 3,
        reps: String(ex.reps) || '10-12',
        weightKg: Number(ex.weightKg) || 20,
        restSeconds: Number(ex.restSeconds) || 60,
        difficulty: (energyLevel < 60 ? 'Beginner' : 'Intermediate') as any,
        equipment: 'Dumbbell' as any,
        image: currentWorkout.exercises[idx]?.image || currentWorkout.exercises[0]?.image,
        description: ex.aiAdaptationNote || 'Custom calibrated set'
      }))
    };

    selectWorkoutPlan(newWorkoutPlan);
    setApplied(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">AI Day Workout Tuning</h2>
                <span className="bg-lime-400/20 text-lime-400 border border-lime-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Adaptive AI
                </span>
              </div>
              <p className="text-xs text-neutral-400">Calibrate today's plan to your energy, soreness & available time</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mt-4">
          {/* Energy Slider */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-lime-400" />
                <span className="text-xs font-bold text-neutral-200">Energy & Recovery Level</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                energyLevel >= 75 ? 'text-lime-400 bg-lime-400/10' : energyLevel >= 50 ? 'text-amber-400 bg-amber-400/10' : 'text-red-400 bg-red-400/10'
              }`}>
                {energyLevel}% {energyLevel >= 75 ? '⚡ High' : energyLevel >= 50 ? '🔋 Moderate' : '🥱 Fatigued'}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={energyLevel}
              onChange={e => setEnergyLevel(Number(e.target.value))}
              className="w-full accent-lime-400 bg-neutral-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Time Limit Chips */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <Clock className="w-4 h-4 text-lime-400" />
              <span className="text-xs font-bold text-neutral-200">Available Workout Duration</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {TIME_OPTIONS.map(time => (
                <button
                  key={time}
                  onClick={() => setAvailableMinutes(time)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    availableMinutes === time
                      ? 'bg-lime-400 text-neutral-950 shadow-md shadow-lime-400/20'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                  }`}
                >
                  {time} min
                </button>
              ))}
            </div>
          </div>

          {/* Soreness Heatmap Chips */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
            <span className="text-xs font-bold text-neutral-200 block mb-2">
              Any Soreness or Tight Muscle Groups?
            </span>
            <div className="flex flex-wrap gap-2">
              {SORENESS_OPTIONS.map(area => {
                const isSelected = selectedSoreness.includes(area);
                return (
                  <button
                    key={area}
                    onClick={() => toggleSoreness(area)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400/50 text-amber-300 font-semibold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {isSelected ? '⚠️ ' : ''}{area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateAdaptation}
            disabled={isGenerating}
            className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20 transition-all"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                Gemini Tuning Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate AI Calibrated Plan
              </>
            )}
          </button>
        </div>

        {/* Adapted Plan Preview */}
        {adaptedResult && (
          <div className="mt-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div>
                <h4 className="text-sm font-bold text-white">{adaptedResult.adaptedTitle}</h4>
                <p className="text-xs text-neutral-400">{adaptedResult.estimatedMinutes} min • ~{adaptedResult.estimatedCalories} kcal</p>
              </div>
              <span className="text-xs bg-lime-400/20 text-lime-400 border border-lime-400/30 px-2 py-0.5 rounded-md font-bold">
                Ready
              </span>
            </div>

            {/* Coach Rationale */}
            <div className="bg-lime-400/10 border border-lime-400/20 rounded-xl p-3 text-xs text-lime-300">
              <span className="font-bold block mb-0.5">AI Coach Rationale:</span>
              {adaptedResult.rationale}
            </div>

            {/* Adapted Exercise list preview */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {adaptedResult.adaptedExercises.map((ex, idx) => (
                <div key={idx} className="bg-neutral-900 border border-neutral-800/80 rounded-lg p-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{ex.name}</span>
                    <span className="text-neutral-400 text-[11px] block">{ex.sets} sets × {ex.reps} • {ex.aiAdaptationNote || 'Calibrated'}</span>
                  </div>
                  <span className="text-lime-400 font-bold">{ex.weightKg || 20} kg</span>
                </div>
              ))}
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApplyPlan}
              disabled={applied}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                applied
                  ? 'bg-neutral-800 text-lime-400 cursor-default'
                  : 'bg-lime-400 hover:bg-lime-300 text-neutral-950 shadow-md'
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Plan Applied to Today's Workout!
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Apply This Adapted Plan Now
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
