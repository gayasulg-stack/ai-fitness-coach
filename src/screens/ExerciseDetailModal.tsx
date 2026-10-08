import React from 'react';
import { 
  X, 
  Dumbbell, 
  Clock, 
  Flame, 
  Sparkles, 
  Play, 
  Check, 
  AlertCircle, 
  CheckCircle2,
  Eye
} from 'lucide-react';
import { Exercise } from '../types/fitness';
import { useFitness } from '../context/FitnessContext';

interface Props {
  exercise: Exercise | null;
  onClose: () => void;
  onStartExercise?: () => void;
}

export const ExerciseDetailModal: React.FC<Props> = ({ exercise, onClose, onStartExercise }) => {
  const { openAICoachWithPrompt, startWorkout, openFormVisionModal } = useFitness();

  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-neutral-950/70 hover:bg-neutral-900 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Visual */}
        <div className="relative h-60 md:h-72 w-full bg-neutral-950 overflow-hidden">
          {exercise.imagePlaceholderUrl ? (
            <img
              src={exercise.imagePlaceholderUrl}
              alt={exercise.name}
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-600">
              <Dumbbell className="w-20 h-20 stroke-[1]" />
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />

          {/* Title on visual */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-lime-400 text-neutral-950 text-[11px] font-black uppercase tracking-wider">
                {exercise.difficulty}
              </span>
              <span className="text-xs text-neutral-300 font-semibold px-2 py-0.5 rounded bg-neutral-800/80 border border-neutral-700">
                {exercise.equipmentNeeded}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {exercise.name}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Key Parameters Cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center">
              <span className="text-[11px] text-neutral-400 block font-medium">Sets</span>
              <span className="text-xl font-extrabold text-white">{exercise.defaultSets}</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center">
              <span className="text-[11px] text-neutral-400 block font-medium">Reps</span>
              <span className="text-xl font-extrabold text-lime-400">{exercise.defaultReps}</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center">
              <span className="text-[11px] text-neutral-400 block font-medium">Weight</span>
              <span className="text-xl font-extrabold text-white">{exercise.defaultWeightKg} kg</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center">
              <span className="text-[11px] text-neutral-400 block font-medium">Rest</span>
              <span className="text-xl font-extrabold text-neutral-200">{exercise.restSeconds}s</span>
            </div>
          </div>

          {/* Targeted Muscle Groups */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              Target Muscle Groups
            </h3>
            <div className="flex flex-wrap gap-2">
              {exercise.primaryMuscles.map(m => (
                <span key={m} className="px-3 py-1 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/30 text-xs font-semibold">
                  Primary: {m}
                </span>
              ))}
              {exercise.secondaryMuscles.map(m => (
                <span key={m} className="px-3 py-1 rounded-xl bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs">
                  Secondary: {m}
                </span>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Execution Instructions
            </h3>
            <div className="space-y-2.5">
              {exercise.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                  <span className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 text-lime-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Tips & Common Mistakes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-950/50 border border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-lime-400 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Form Master Tips</span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1.5 list-disc list-inside">
                {exercise.formTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/50 border border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Avoid These Mistakes</span>
              </div>
              <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
                {exercise.commonMistakes.map((mis, i) => (
                  <li key={i}>{mis}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                if (onStartExercise) {
                  onStartExercise();
                } else {
                  startWorkout();
                }
              }}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-sm shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Workout Now</span>
            </button>

            <button
              onClick={() => {
                onClose();
                openFormVisionModal(exercise);
              }}
              className="py-3.5 px-5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-lime-400 border border-lime-400/40 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Check Form Vision</span>
            </button>

            <button
              onClick={() => {
                onClose();
                openAICoachWithPrompt(`How can I optimize my technique and progressive overload on ${exercise.name}?`);
              }}
              className="py-3.5 px-5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span>Ask AI Coach</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
