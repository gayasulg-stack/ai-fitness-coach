import React, { useState } from 'react';
import { 
  Dumbbell, 
  Clock, 
  Flame, 
  Play, 
  Sparkles, 
  Eye, 
  ChevronRight, 
  Layers, 
  ArrowLeftRight, 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { Exercise, WorkoutPlan } from '../types/fitness';
import { EXERCISE_DATABASE } from '../data/exerciseLibrary';

export const WorkoutScreen: React.FC = () => {
  const { 
    currentWorkout, 
    allWorkouts, 
    selectWorkoutPlan, 
    startWorkout, 
    setSelectedExerciseDetail,
    openAICoachWithPrompt,
    reorderWorkoutExercises,
    setSwapTargetIndex,
    removeExerciseFromWorkout,
    addExerciseToWorkout
  } = useFitness();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // HTML5 Drag and Drop handlers
  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (targetIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderWorkoutExercises(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Manual move handlers
  const moveUp = (index: number) => {
    if (index > 0) {
      reorderWorkoutExercises(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < currentWorkout.exercises.length - 1) {
      reorderWorkoutExercises(index, index + 1);
    }
  };

  // Exercises not currently in workout
  const unassignedExercises = EXERCISE_DATABASE.filter(
    dbEx => !currentWorkout.exercises.some(curr => curr.id === dbEx.id)
  );

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Program Split Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
            Training Routine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Today's Workout Plan
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Fully customizable: drag to reorder or swap exercises based on equipment availability.
          </p>
        </div>

        {/* Alternative workouts pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {allWorkouts.map(w => {
            const isSelected = w.id === currentWorkout.id;
            return (
              <button
                key={w.id}
                onClick={() => selectWorkoutPlan(w)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-lime-400 border-lime-400 text-neutral-950 font-bold shadow-md shadow-lime-400/20'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {w.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Workout Overview Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30">
                {currentWorkout.dayOfWeek || 'Today'}
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                {currentWorkout.difficulty} Level
              </span>
              <span className="text-xs text-neutral-500">•</span>
              <span className="text-xs text-neutral-400">
                Customizable Order
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white">
              {currentWorkout.title}
            </h2>

            <p className="text-sm text-neutral-300 leading-relaxed">
              {currentWorkout.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-neutral-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <Clock className="w-4 h-4 text-lime-400" />
                <span className="font-semibold">{currentWorkout.durationMin} min</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <Dumbbell className="w-4 h-4 text-lime-400" />
                <span className="font-semibold">{currentWorkout.exercises.length} exercises</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-semibold">~{currentWorkout.estimatedCalories} kcal</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <button
              onClick={() => startWorkout(currentWorkout)}
              className="py-4 px-8 rounded-2xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-black text-base shadow-xl shadow-lime-400/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Workout</span>
            </button>

            <button
              onClick={() => openAICoachWithPrompt(`Can you analyze today's workout "${currentWorkout.title}" and suggest an optimal warm-up routine?`)}
              className="py-2.5 px-4 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-lime-400 text-xs font-semibold border border-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Warm-up Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Tip & Drag-and-Drop Hint Banner */}
      <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-lime-400/10 text-lime-400 shrink-0">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <span className="text-neutral-300">
            <strong className="text-white">Equipment in use?</strong> Drag cards using the handle (<GripVertical className="w-3.5 h-3.5 inline text-neutral-400" />) or tap <strong>Swap</strong> to substitute any machine, barbell, or free weight.
          </span>
        </div>
        <span className="text-[11px] font-mono text-lime-400 shrink-0">
          Auto-saves in real time
        </span>
      </div>

      {/* Exercise List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Exercise Sequence</h3>
          <p className="text-xs text-neutral-400">
            Reorder movements or swap equipment stations to fit your gym setup
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-400">
          {currentWorkout.exercises.length} Movements Scheduled
        </span>
      </div>

      {/* Exercise Cards List with Drag and Drop & Swap controls */}
      <div className="space-y-3">
        {currentWorkout.exercises.map((ex, index) => {
          const isDragging = draggedIndex === index;
          const isOver = dragOverIndex === index;

          return (
            <div
              key={ex.id}
              draggable
              onDragStart={e => handleDragStart(index, e)}
              onDragOver={e => handleDragOver(index, e)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(index, e)}
              onDragEnd={handleDragEnd}
              className={`p-4 md:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                isDragging
                  ? 'opacity-40 bg-neutral-900 border-lime-400 scale-[0.98]'
                  : isOver
                  ? 'bg-neutral-900 border-lime-400 shadow-lg shadow-lime-400/10'
                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Left: Drag Handle + Thumbnail + Title + Details */}
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                {/* Drag Handle & Manual Steppers */}
                <div className="flex flex-col items-center justify-center gap-1 shrink-0 text-neutral-500">
                  <div
                    title="Drag to reorder"
                    className="p-1 rounded hover:text-white cursor-grab active:cursor-grabbing hover:bg-neutral-800 transition-colors"
                  >
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      title="Move Up"
                      className="p-0.5 rounded text-neutral-500 hover:text-lime-400 disabled:opacity-20 disabled:hover:text-neutral-500 cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === currentWorkout.exercises.length - 1}
                      title="Move Down"
                      className="p-0.5 rounded text-neutral-500 hover:text-lime-400 disabled:opacity-20 disabled:hover:text-neutral-500 cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-xl bg-neutral-950 overflow-hidden shrink-0 border border-neutral-800">
                  {ex.imagePlaceholderUrl ? (
                    <img
                      src={ex.imagePlaceholderUrl}
                      alt={ex.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute top-1 left-1 w-5 h-5 rounded-md bg-neutral-950/90 text-lime-400 text-[10px] font-bold flex items-center justify-center border border-neutral-800">
                    {index + 1}
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-base text-white group-hover:text-lime-400 transition-colors truncate">
                      {ex.name}
                    </h4>
                    {/* Equipment badge with highlighted border */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-400/10 text-orange-400 border border-orange-400/20">
                      {ex.equipmentNeeded}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                      {ex.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                    <span className="text-lime-400 font-semibold">
                      {ex.defaultSets} sets × {ex.defaultReps} reps
                    </span>
                    <span>•</span>
                    <span>Rest: {ex.restSeconds}s</span>
                    <span>•</span>
                    <span>Target: {ex.defaultWeightKg} kg</span>
                  </div>
                </div>
              </div>

              {/* Right Actions: Swap, Preview, Remove */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Swap Exercise Button */}
                <button
                  onClick={() => setSwapTargetIndex(index)}
                  className="py-2 px-3 rounded-xl bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 border border-lime-400/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Swap this exercise with another piece of equipment"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Swap</span>
                </button>

                {/* View Details */}
                <button
                  onClick={() => setSelectedExerciseDetail(ex)}
                  className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="View instructions & form tips"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Guide</span>
                </button>

                {/* Optional Remove */}
                {currentWorkout.exercises.length > 2 && (
                  <button
                    onClick={() => removeExerciseFromWorkout(index)}
                    className="p-2 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Remove from routine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Exercise Drawer / Quick Picker */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="font-bold text-sm text-white block">Want to add another exercise?</span>
          <span className="text-xs text-neutral-400">
            Expand your routine with supplementary isolation or mobility work.
          </span>
        </div>

        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="py-2 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-lime-400 border border-lime-400/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddMenu ? 'Hide Exercise List' : 'Browse Exercise Library'}</span>
        </button>
      </div>

      {/* Expanded Add Exercise Menu */}
      {showAddMenu && (
        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white">Select Exercise to Add</h4>
            <span className="text-xs text-neutral-500 font-mono">
              {unassignedExercises.length} Exercises Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {unassignedExercises.map(ex => (
              <div
                key={ex.id}
                className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between gap-2 hover:border-neutral-700 transition-colors"
              >
                <div className="min-w-0">
                  <h5 className="font-bold text-xs text-white truncate">{ex.name}</h5>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5">
                    <span className="text-lime-400 font-medium">{ex.equipmentNeeded}</span>
                    <span>•</span>
                    <span>{ex.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addExerciseToWorkout(ex);
                  }}
                  className="py-1 px-2.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Launch Workout Floating CTA */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={() => startWorkout(currentWorkout)}
          className="w-full sm:w-auto min-w-[280px] py-4 px-8 rounded-2xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-black text-base shadow-xl shadow-lime-400/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-95 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Launch Today's Session</span>
        </button>
      </div>
    </div>
  );
};
