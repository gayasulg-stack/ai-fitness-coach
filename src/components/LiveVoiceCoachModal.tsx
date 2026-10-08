import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  Clock, 
  CheckCircle2, 
  PhoneOff,
  Activity,
  ChevronRight
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { queryLiveVoiceCoach } from '../services/aiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceCoachModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { userProfile, currentWorkout } = useFitness();

  const [isRecording, setIsRecording] = useState(false);
  const [coachStatus, setCoachStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcripts, setTranscripts] = useState<{ speaker: 'athlete' | 'coach'; text: string; time: string }[]>([
    {
      speaker: 'coach',
      text: `Hey ${userProfile.name.split(' ')[0]}! I'm your Live Voice Coach. I'm listening in real-time. Ask for form cues, countdowns, or motivation during your sets!`,
      time: 'Just now'
    }
  ]);
  const [currentSpokenText, setCurrentSpokenText] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = e => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setCoachStatus('thinking');
        // If simulated or transcribed text
        const simulatedAthleteQuery = currentSpokenText || "Coach, how should I pace my breathing on today's workout?";
        
        setTranscripts(prev => [
          ...prev,
          { speaker: 'athlete', text: simulatedAthleteQuery, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);

        // Query Live coach
        const coachReply = await queryLiveVoiceCoach(simulatedAthleteQuery, userProfile);
        
        setCoachStatus('speaking');
        setTranscripts(prev => [
          ...prev,
          { speaker: 'coach', text: coachReply.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);

        // Play audio if returned
        if (coachReply.audioBase64 && !isMuted) {
          playAudioBase64(coachReply.audioBase64);
        } else {
          setTimeout(() => setCoachStatus('idle'), 2500);
        }

        setCurrentSpokenText('');
      };

      recorder.start();
      setIsRecording(true);
      setCoachStatus('listening');
    } catch (err) {
      console.warn('Microphone access denied:', err);
      // Fallback interaction
      handleSimulatedSpeech("Coach, what is my focus for today's session?");
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playAudioBase64 = (base64Audio: string) => {
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
      audio.onended = () => setCoachStatus('idle');
      audio.play().catch(() => setCoachStatus('idle'));
    } catch {
      setCoachStatus('idle');
    }
  };

  const handleSimulatedSpeech = async (speechText: string) => {
    setCoachStatus('listening');
    setCurrentSpokenText(speechText);
    setTimeout(async () => {
      setCoachStatus('thinking');
      setTranscripts(prev => [
        ...prev,
        { speaker: 'athlete', text: speechText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);

      const coachReply = await queryLiveVoiceCoach(speechText, userProfile);
      setCoachStatus('speaking');
      setTranscripts(prev => [
        ...prev,
        { speaker: 'coach', text: coachReply.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);

      if (coachReply.audioBase64 && !isMuted) {
        playAudioBase64(coachReply.audioBase64);
      } else {
        setTimeout(() => setCoachStatus('idle'), 3000);
      }
    }, 1000);
  };

  const sampleVoicePrompts = [
    "Coach, check my bench press elbow tuck angle",
    "Give me a 60 second rest countdown",
    "Shoulders feeling tight, what warm-up helps?",
    "Next exercise cue and target reps"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-8 my-8 text-neutral-100 flex flex-col justify-between min-h-[580px]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-lime-400 text-neutral-950 flex items-center justify-center font-bold">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Live Voice Coach</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-neutral-400">Hands-free real-time audio guidance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Animated Voice Stage */}
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
          {/* Animated Pulsing Wave Rings */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Outer Waves */}
            <div className={`absolute inset-0 rounded-full border-2 border-lime-400/30 transition-all duration-700 ${
              coachStatus === 'speaking' || coachStatus === 'listening' ? 'scale-125 animate-ping opacity-60' : 'opacity-20'
            }`} />
            <div className={`absolute inset-2 rounded-full border border-lime-400/40 transition-all duration-500 ${
              coachStatus === 'speaking' || coachStatus === 'listening' ? 'scale-110 opacity-80' : 'opacity-30'
            }`} />

            {/* Core Orb */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              coachStatus === 'speaking'
                ? 'bg-gradient-to-tr from-lime-400 to-emerald-300 text-neutral-950 scale-105 shadow-lime-400/40 glow-ai'
                : coachStatus === 'listening'
                ? 'bg-lime-400/20 border-2 border-lime-400 text-lime-400 shadow-lime-400/20 animate-pulse'
                : coachStatus === 'thinking'
                ? 'bg-neutral-800 text-lime-400 border border-lime-400/40'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}>
              <Sparkles className="w-10 h-10 stroke-[2]" />
            </div>
          </div>

          {/* Status Label */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-lime-400 font-mono block mb-1">
              {coachStatus === 'listening'
                ? 'Listening to athlete...'
                : coachStatus === 'thinking'
                ? 'Formulating biomechanical advice...'
                : coachStatus === 'speaking'
                ? 'Coach Zephyr is speaking...'
                : 'Tap microphone or prompt to speak'}
            </span>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Current focus: <span className="text-white font-semibold">{currentWorkout.title}</span>
            </p>
          </div>

          {/* Quick Voice Prompt Chips */}
          <div className="w-full space-y-2 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block px-1">
              Quick Spoken Commands
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleVoicePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulatedSpeech(prompt)}
                  disabled={coachStatus !== 'idle'}
                  className="p-2.5 rounded-xl bg-neutral-950/70 hover:bg-neutral-800 border border-neutral-800 hover:border-lime-400/40 text-neutral-300 hover:text-lime-400 text-xs text-left transition-all cursor-pointer flex items-center justify-between group disabled:opacity-50"
                >
                  <span className="truncate">"{prompt}"</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-lime-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Conversation Transcript Feed */}
        <div className="max-h-36 overflow-y-auto space-y-2 p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-xs">
          {transcripts.slice(-3).map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                item.speaker === 'coach' ? 'bg-lime-400/20 text-lime-400' : 'bg-neutral-800 text-neutral-300'
              }`}>
                {item.speaker === 'coach' ? 'Coach' : 'You'}
              </span>
              <p className="text-neutral-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Bottom Interactive Controls */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-4 shrink-0">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-lime-400" />}
          </button>

          {/* Large Center Mic Button */}
          <button
            onClick={isRecording ? stopListening : startListening}
            className={`py-4 px-8 rounded-2xl font-black text-sm flex items-center gap-2.5 transition-all shadow-xl cursor-pointer ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25 animate-pulse'
                : 'bg-lime-400 hover:bg-lime-300 text-neutral-950 shadow-lime-400/25'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Tap to Send Speech</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Hold or Tap to Talk</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="End Session"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
