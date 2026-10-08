import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Dumbbell, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  Activity,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFitness } from '../context/FitnessContext';

export const WorkoutCompleteScreen: React.FC = () => {
  const { 
    lastCompletedWorkout, 
    setLastCompletedWorkout, 
    setActiveScreen, 
    userProfile 
  } = useFitness();

  const [rating, setRating] = useState<number>(5);

  useEffect(() => {
    // Launch energetic confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 350);
    } catch {}
  }, []);

  if (!lastCompletedWorkout) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center my-8 text-neutral-100 space-y-6">
        {/* Celebration Trophy Badge */}
        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-lime-400 text-neutral-950 flex items-center justify-center font-black text-3xl shadow-xl shadow-lime-400/25 glow-ai">
            <Trophy className="w-10 h-10 stroke-[2.5]" />
          </div>
          <span className="absolute -top-1 -right-2 text-2xl animate-bounce">
            🎉
          </span>
        </div>

        {/* Heading */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-lime-400 block mb-1">
            Session Finished
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Workout Complete! 🎉
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Great intensity on {lastCompletedWorkout.workoutTitle}. Your metrics have been synced.
          </p>
        </div>

        {/* 4 Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block mb-1">Duration</span>
            <div className="text-xl font-black text-white font-mono">
              {lastCompletedWorkout.durationMinutes} min
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block mb-1">Exercises</span>
            <div className="text-xl font-black text-white font-mono">
              {lastCompletedWorkout.exercisesCompleted}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block mb-1">Total Sets</span>
            <div className="text-xl font-black text-lime-400 font-mono">
              {lastCompletedWorkout.totalSetsCompleted}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block mb-1">Calories</span>
            <div className="text-xl font-black text-orange-400 font-mono">
              {lastCompletedWorkout.caloriesBurned} kcal
            </div>
          </div>
        </div>

        {/* Achievement Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/30 via-neutral-800 to-lime-950/30 border border-neutral-700 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-400/20 text-orange-400">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white block">
                🔥 {lastCompletedWorkout.streakAtCompletion || userProfile.streakDays} Day Streak!
              </span>
              <span className="text-xs text-neutral-400">
                You're in the top 10% of consistent athletes this month.
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-lime-400 uppercase tracking-wider px-2 py-1 rounded bg-lime-400/10">
            Unlocked
          </span>
        </div>

        {/* AI Coach Feedback Message */}
        <div className="p-5 rounded-2xl bg-neutral-950/80 border border-lime-500/30 text-left relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-lime-400 text-neutral-950">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
              AI Coach Post-Workout Assessment
            </span>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed italic">
            "{lastCompletedWorkout.aiFeedback}"
          </p>
        </div>

        {/* How did it feel? (RPE / Rating) */}
        <div className="pt-1">
          <span className="text-xs text-neutral-400 block mb-2 font-medium">
            How challenging was today's session?
          </span>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  rating >= star
                    ? 'bg-lime-400/20 border-lime-400 text-lime-400'
                    : 'bg-neutral-800/40 border-neutral-800 text-neutral-500 hover:text-white'
                }`}
              >
                <Star className={`w-5 h-5 ${rating >= star ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              setLastCompletedWorkout(null);
              setActiveScreen('progress');
            }}
            className="py-3.5 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-sm shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>View Progress</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setLastCompletedWorkout(null);
              setActiveScreen('dashboard');
            }}
            className="py-3.5 px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
