import React, { useState, useEffect } from 'react';
import { 
  X, 
  Minus, 
  Plus, 
  Check, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  SkipForward, 
  Volume2, 
  Info, 
  Flame, 
  Play, 
  Pause,
  ArrowRight,
  ChevronLeft,
  ArrowLeftRight,
  Eye,
  Mic,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { sounds } from '../utils/soundEffects';

export const ActiveWorkoutScreen: React.FC = () => {
  const { 
    activeSession, 
    currentWorkout, 
    completeSet, 
    skipCurrentExercise, 
    goToNextExercise, 
    goToPrevExercise, 
    skipRestTimer, 
    addRestSeconds, 
    finishActiveWorkout, 
    cancelActiveWorkout, 
    setSelectedExerciseDetail,
    openAICoachWithPrompt,
    setSwapTargetIndex,
    openFormVisionModal,
    openVoiceCoachModal
  } = useFitness();

  if (!activeSession) return null;

  const currentExercise = currentWorkout.exercises[activeSession.currentExerciseIndex];
  const nextExercise = currentWorkout.exercises[activeSession.currentExerciseIndex + 1];
  const totalExercises = currentWorkout.exercises.length;
  const currentExNumber = activeSession.currentExerciseIndex + 1;

  // Active set numbers
  const totalSets = currentExercise?.defaultSets || 3;
  const currentSetNumber = activeSession.currentSetIndex + 1;

  // Weight & Reps state for active set
  const [weight, setWeight] = useState<number>(() => {
    const existing = activeSession.setLogs[currentExercise?.id]?.[activeSession.currentSetIndex];
    return existing ? existing.weight : currentExercise?.defaultWeightKg || 60;
  });

  const [reps, setReps] = useState<number>(() => {
    const existing = activeSession.setLogs[currentExercise?.id]?.[activeSession.currentSetIndex];
    return existing ? existing.reps : currentExercise?.defaultReps || 10;
  });

  // Elapsed workout time
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [spokenFeedback, setSpokenFeedback] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - activeSession.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession.startTime]);

  // Sync weight & reps when current exercise or set changes
  useEffect(() => {
    if (currentExercise) {
      const existing = activeSession.setLogs[currentExercise.id]?.[activeSession.currentSetIndex];
      if (existing) {
        setWeight(existing.weight);
        setReps(existing.reps);
      } else {
        setWeight(currentExercise.defaultWeightKg);
        setReps(currentExercise.defaultReps);
      }
    }
  }, [activeSession.currentExerciseIndex, activeSession.currentSetIndex, currentExercise?.id]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCompleteSet = () => {
    completeSet(weight, reps);
  };

  const adjustWeight = (delta: number) => {
    setWeight(prev => Math.max(0, Math.round((prev + delta) * 2) / 2));
  };

  const adjustReps = (delta: number) => {
    setReps(prev => Math.max(1, prev + delta));
  };

  const speakCue = (cueText: string) => {
    setSpokenFeedback(cueText);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cueText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => setSpokenFeedback(null), 4000);
  };

  const getExerciseCue = () => {
    const name = currentExercise?.name?.toLowerCase() || '';
    if (name.includes('squat')) return 'Drive knees outward, brace core, push floor away!';
    if (name.includes('bench') || name.includes('press')) return 'Pack lats down, retract scaps, drive feet into floor!';
    if (name.includes('deadlift')) return 'Hinge at the hips, lats engaged, drag bar against shins!';
    if (name.includes('pull') || name.includes('row')) return 'Lead with elbows, pause 1 second at full scapular contraction!';
    return 'Control the eccentric tempo and explode with intent on contraction!';
  };

  // Smart AI weight suggestion based on last set
  const previousSetLog = activeSession.currentSetIndex > 0 
    ? activeSession.setLogs[currentExercise?.id]?.[activeSession.currentSetIndex - 1]
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col text-neutral-100 overflow-y-auto">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-20 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Do you want to discard this workout session?')) {
                cancelActiveWorkout();
              }
            }}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            title="Exit workout"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 block">
              Active Tracking
            </span>
            <span className="font-bold text-sm text-white">{currentWorkout.title}</span>
          </div>
        </div>

        {/* Workout Elapsed Time & Finish */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono font-bold text-neutral-200">
            <Clock className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Finish and log this workout now?')) {
                finishActiveWorkout();
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-lime-400/20 hover:bg-lime-400/30 text-lime-400 border border-lime-400/40 text-xs font-bold transition-colors cursor-pointer"
          >
            Finish Workout
          </button>
        </div>
      </header>

      {/* Main Active Tracking Stage */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 flex flex-col justify-between space-y-5">
        {/* Overall Workout Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300">
              Exercise {currentExNumber} of {totalExercises}
            </span>
            <span>
              {Math.round(((currentExNumber - 1) / totalExercises) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-lime-400 transition-all duration-300 rounded-full"
              style={{ width: `${(currentExNumber / totalExercises) * 100}%` }}
            />
          </div>
        </div>

        {/* INTERACTIVE AI LIVE COPILOT BAR */}
        <div className="bg-neutral-900/90 border border-lime-400/30 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-lg glow-ai">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-lime-400/10 flex items-center justify-center text-lime-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white block">AI Live Companion</span>
              <span className="text-[10px] text-neutral-400">Instant vision form check & voice cues</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openFormVisionModal(currentExercise)}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-lime-400 border border-lime-400/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Camera posture and joint analysis"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Form Check</span>
            </button>

            <button
              onClick={() => speakCue(getExerciseCue())}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Vocal coaching cue"
            >
              <Volume2 className="w-3.5 h-3.5 text-lime-400" />
              <span>Voice Cue</span>
            </button>

            <button
              onClick={openVoiceCoachModal}
              className="px-2.5 py-1.5 bg-lime-400 hover:bg-lime-300 text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Speak hands-free with AI coach"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Talk Live</span>
            </button>
          </div>
        </div>

        {/* Spoken feedback notification if active */}
        {spokenFeedback && (
          <div className="p-3 bg-lime-400/15 border border-lime-400/40 rounded-xl text-xs text-lime-300 font-semibold flex items-center gap-2 animate-in fade-in">
            <Zap className="w-4 h-4 text-lime-400 shrink-0" />
            <span>AI Coach says: "{spokenFeedback}"</span>
          </div>
        )}

        {/* REST TIMER OVERLAY / BANNER IF ACTIVE */}
        {activeSession.isRestTimerActive && (
          <div className="p-5 rounded-3xl bg-neutral-900 border border-lime-500/40 shadow-xl flex flex-col items-center text-center glow-ai animate-fadeIn">
            <span className="text-[11px] font-bold uppercase tracking-wider text-lime-400 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Rest Interval
            </span>
            <div className="text-4xl md:text-5xl font-mono font-black text-white tracking-tight my-2">
              {formatTime(activeSession.restTimeRemaining)}
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Breathe deeply. Recover before Set {currentSetNumber}.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => addRestSeconds(30)}
                className="py-2 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 transition-colors cursor-pointer"
              >
                +30s Rest
              </button>
              <button
                onClick={skipRestTimer}
                className="py-2 px-5 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 text-xs font-bold transition-colors cursor-pointer shadow-md shadow-lime-400/20"
              >
                Skip Rest & Start
              </button>
            </div>
          </div>
        )}

        {/* CURRENT EXERCISE CARD */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
                {currentExercise?.category} • {currentExercise?.equipmentNeeded}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                {currentExercise?.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSwapTargetIndex(activeSession.currentExerciseIndex)}
                className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-lime-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700 hover:border-lime-400/40"
                title="Swap equipment for this exercise"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Swap Equipment</span>
              </button>
              <button
                onClick={() => setSelectedExerciseDetail(currentExercise)}
                className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="View instructions & form tips"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Smart load suggestion if set 1 done */}
          {previousSetLog && (
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-lime-400" />
                <span className="text-neutral-300">
                  Previous: <strong className="text-white">{previousSetLog.weight}kg × {previousSetLog.reps}</strong>
                </span>
              </div>
              <button
                onClick={() => setWeight(prev => prev + 2.5)}
                className="text-lime-400 font-bold hover:underline"
              >
                AI Suggests: +2.5kg for Set {currentSetNumber}
              </button>
            </div>
          )}

          {/* Current Set Badge */}
          <div className="flex items-center justify-between py-2 border-y border-neutral-800">
            <div className="text-sm font-semibold text-neutral-400">
              Current Target
            </div>
            <div className="px-3 py-1 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/30 text-xs font-black">
              Set {currentSetNumber} of {totalSets}
            </div>
          </div>

          {/* WEIGHT & REPS INTERACTIVE ADJUSTERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Weight Counter */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Weight (kg)
              </span>
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => adjustWeight(-2.5)}
                  className="w-11 h-11 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white flex items-center justify-center font-bold text-lg transition-transform cursor-pointer"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="text-3xl font-black text-white font-mono">
                  {weight}
                </div>
                <button
                  onClick={() => adjustWeight(2.5)}
                  className="w-11 h-11 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white flex items-center justify-center font-bold text-lg transition-transform cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {[-5, -1, +1, +5].map(step => (
                  <button
                    key={step}
                    onClick={() => adjustWeight(step)}
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-400 hover:text-lime-400 hover:bg-neutral-800 cursor-pointer"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </div>

            {/* Reps Counter */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Reps
              </span>
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => adjustReps(-1)}
                  className="w-11 h-11 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white flex items-center justify-center font-bold text-lg transition-transform cursor-pointer"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="text-3xl font-black text-lime-400 font-mono">
                  {reps}
                </div>
                <button
                  onClick={() => adjustReps(1)}
                  className="w-11 h-11 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white flex items-center justify-center font-bold text-lg transition-transform cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {[-2, -1, +1, +2].map(step => (
                  <button
                    key={step}
                    onClick={() => adjustReps(step)}
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-400 hover:text-lime-400 hover:bg-neutral-800 cursor-pointer"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SETS LOGGED CHECKLIST FOR CURRENT EXERCISE */}
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-bold text-neutral-400 block mb-1">
              Sets Breakdown
            </span>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: totalSets }, (_, i) => {
                const log = activeSession.setLogs[currentExercise?.id]?.[i];
                const isCompleted = log?.completed;
                const isCurrent = i === activeSession.currentSetIndex;

                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isCompleted
                        ? 'bg-lime-400/10 border-lime-400 text-lime-400'
                        : isCurrent
                        ? 'bg-neutral-800 border-neutral-700 text-white'
                        : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-500'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-[11px] font-semibold mb-0.5">
                      <span>Set {i + 1}</span>
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-mono font-bold block">
                      {log ? `${log.weight}kg × ${log.reps}` : `Target: ${currentExercise?.defaultReps}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAIN CTAS */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleCompleteSet}
              className="w-full py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 text-neutral-950 font-black text-base shadow-xl shadow-lime-400/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Complete Set {currentSetNumber}</span>
            </button>

            <div className="flex items-center justify-between text-xs">
              <button
                onClick={skipCurrentExercise}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer py-1 flex items-center gap-1"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Skip Exercise</span>
              </button>

              <button
                onClick={() => openAICoachWithPrompt(`I am doing ${currentExercise?.name} right now. How do I maintain optimal mind-muscle connection?`)}
                className="text-lime-400 hover:underline transition-colors cursor-pointer py-1 flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Coach</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM BANNER: NEXT EXERCISE TEASER */}
        {nextExercise ? (
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400">
                <ChevronRight className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Next Exercise
                </span>
                <span className="font-bold text-sm text-white">{nextExercise.name}</span>
              </div>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {nextExercise.defaultSets} × {nextExercise.defaultReps}
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-lime-950/20 border border-lime-500/20 text-center text-xs text-lime-400 font-medium">
            🔥 Final exercise of today's workout! Finish strong!
          </div>
        )}
      </main>
    </div>
  );
};
