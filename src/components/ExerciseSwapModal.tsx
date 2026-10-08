import React, { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  Dumbbell, 
  Filter, 
  Search, 
  Check, 
  Eye, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { EXERCISE_DATABASE } from '../data/exerciseLibrary';
import { EquipmentItem, Exercise } from '../types/fitness';

export const ExerciseSwapModal: React.FC = () => {
  const { 
    currentWorkout, 
    swapTargetIndex, 
    setSwapTargetIndex, 
    swapWorkoutExercise, 
    setSelectedExerciseDetail 
  } = useFitness();

  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [matchCategoryOnly, setMatchCategoryOnly] = useState<boolean>(true);

  if (swapTargetIndex === null || swapTargetIndex === undefined) return null;

  const currentExercise = currentWorkout.exercises[swapTargetIndex];
  if (!currentExercise) return null;

  const equipmentOptions: (string)[] = [
    'All',
    'No Equipment',
    'Dumbbells',
    'Barbell',
    'Resistance Bands',
    'Machines',
    'Kettlebells',
    'Pull-up Bar'
  ];

  // Filter exercises
  const availableSubstitutes = EXERCISE_DATABASE.filter(ex => {
    // Exclude the one currently in this slot
    if (ex.id === currentExercise.id) return false;

    // Filter by category if enabled
    if (matchCategoryOnly && ex.category !== currentExercise.category) {
      return false;
    }

    // Filter by equipment
    if (selectedEquipment !== 'All' && ex.equipmentNeeded !== selectedEquipment) {
      return false;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ex.name.toLowerCase().includes(q);
      const matchMuscle = ex.primaryMuscles.some(m => m.toLowerCase().includes(q));
      const matchEq = ex.equipmentNeeded.toLowerCase().includes(q);
      if (!matchName && !matchMuscle && !matchEq) return false;
    }

    return true;
  });

  const handleSelectSwap = (newEx: Exercise) => {
    swapWorkoutExercise(swapTargetIndex, newEx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-8 my-8 text-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-lime-400/20 text-lime-400">
                <ArrowLeftRight className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-extrabold text-white">Swap Exercise</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                Slot #{swapTargetIndex + 1}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Replace <strong className="text-white">{currentExercise.name}</strong> to accommodate available gym or home equipment.
            </p>
          </div>

          <button
            onClick={() => setSwapTargetIndex(null)}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Target Summary Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700">
              {currentExercise.imagePlaceholderUrl ? (
                <img src={currentExercise.imagePlaceholderUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                  <Dumbbell className="w-5 h-5" />
                </div>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                Currently Scheduled
              </span>
              <span className="font-bold text-sm text-white">{currentExercise.name}</span>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-neutral-400 block text-[11px]">Requires</span>
            <span className="text-orange-400 font-bold px-2 py-0.5 rounded bg-orange-400/10 border border-orange-400/20">
              {currentExercise.equipmentNeeded}
            </span>
          </div>
        </div>

        {/* Search & Equipment Filters */}
        <div className="pt-4 space-y-3 shrink-0">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search replacement exercises or muscles (e.g. chest, dumbbells)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400/60"
            />
          </div>

          {/* Category match toggle & Equipment scroll */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={matchCategoryOnly}
                onChange={e => setMatchCategoryOnly(e.target.checked)}
                className="rounded border-neutral-700 text-lime-400 focus:ring-0 cursor-pointer"
              />
              <span>Target same muscle group ({currentExercise.category})</span>
            </label>
            <span className="text-neutral-500 font-mono text-[11px]">
              {availableSubstitutes.length} Available Alternatives
            </span>
          </div>

          {/* Equipment Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {equipmentOptions.map(eq => (
              <button
                key={eq}
                onClick={() => setSelectedEquipment(eq)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedEquipment === eq
                    ? 'bg-lime-400 border-lime-400 text-neutral-950 font-bold shadow-sm'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>

        {/* Alternatives List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 mt-4 pr-1 min-h-[220px]">
          {availableSubstitutes.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-neutral-600" />
              <p className="text-sm">No alternative exercises match the selected filters.</p>
              <button
                onClick={() => {
                  setSelectedEquipment('All');
                  setMatchCategoryOnly(false);
                  setSearchQuery('');
                }}
                className="text-xs text-lime-400 hover:underline font-semibold cursor-pointer"
              >
                Clear all filters to see full library
              </button>
            </div>
          ) : (
            availableSubstitutes.map(alt => {
              const isAlreadyInPlan = currentWorkout.exercises.some(e => e.id === alt.id);
              return (
                <div
                  key={alt.id}
                  className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                      {alt.imagePlaceholderUrl ? (
                        <img src={alt.imagePlaceholderUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-sm text-white group-hover:text-lime-400 transition-colors truncate">
                          {alt.name}
                        </h4>
                        {isAlreadyInPlan && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 shrink-0">
                            In Plan
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                        <span className="text-lime-400 font-semibold text-[11px] px-1.5 py-0.5 rounded bg-lime-400/10 border border-lime-400/20">
                          {alt.equipmentNeeded}
                        </span>
                        <span>•</span>
                        <span className="text-[11px]">{alt.defaultSets} × {alt.defaultReps} reps</span>
                        <span>•</span>
                        <span className="text-[11px] text-neutral-400">{alt.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedExerciseDetail(alt)}
                      className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Preview exercise technique"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleSelectSwap(alt)}
                      className="py-2 px-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-lime-400/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Swap In</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info note */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            Swapping preserves total workout duration & rep targets.
          </span>
          <button
            onClick={() => setSwapTargetIndex(null)}
            className="text-neutral-400 hover:text-white font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
