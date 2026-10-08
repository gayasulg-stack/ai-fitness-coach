import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  Zap, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  HeartHandshake,
  Check,
  Search,
  Globe,
  ExternalLink,
  Mic,
  MicOff,
  Radio,
  Film,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { askAICoach, transcribeAudio } from '../services/aiService';
import { ChatMessage } from '../types/fitness';
import { LiveVoiceCoachModal } from '../components/LiveVoiceCoachModal';
import { VeoVideoGeneratorModal } from '../components/VeoVideoGeneratorModal';

export const AICoachScreen: React.FC = () => {
  const { userProfile, prefilledAIPrompt, setPrefilledAIPrompt, currentWorkout } = useFitness();

  // Model & Grounding preferences
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [enableSearchGrounding, setEnableSearchGrounding] = useState<boolean>(true);

  // Modals state
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [isVeoVideoOpen, setIsVeoVideoOpen] = useState(false);

  // Microphone audio transcription state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-1',
        sender: 'ai',
        text: `Hi ${userProfile.name.split(' ')[0]}! You completed your upper-body workout today. How are you feeling?`,
        timestamp: '10:14 AM',
        modelUsed: 'gemini-3.5-flash'
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'My shoulders feel a little sore.',
        timestamp: '10:15 AM'
      },
      {
        id: 'msg-3',
        sender: 'ai',
        text: "That's normal after a challenging session. Consider light mobility work today, ensure at least 25g of protein with your recovery meal, and avoid another heavy shoulder session until you've fully recovered.",
        timestamp: '10:15 AM',
        modelUsed: 'gemini-3.5-flash',
        suggestedFollowUps: [
          'What stretches help shoulder mobility?',
          'What should I eat right now?',
          'How long should I rest my shoulders?'
        ],
        groundingSources: [
          { title: 'American College of Sports Medicine (ACSM) Recovery Guidelines', uri: 'https://www.acsm.org' }
        ]
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts
  const suggestedPrompts = [
    'Create my workout plan',
    'What should I eat for muscle recovery?',
    'Latest research on bench press progressive overload',
    'How do I fix squat knee valgus collapse?',
    'Give me a 10-minute mobility cooldown routine'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle prefilled prompt from other parts of the app
  useEffect(() => {
    if (prefilledAIPrompt) {
      handleSendMessage(prefilledAIPrompt);
      setPrefilledAIPrompt(null);
    }
  }, [prefilledAIPrompt]);

  // Audio recording & Transcription with gemini-3.5-transcribe
  const startAudioRecording = async () => {
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsTranscribing(true);
        try {
          const text = await transcribeAudio(audioBlob);
          if (text) {
            setInput(prev => (prev ? `${prev} ${text}` : text));
          }
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      setIsRecordingAudio(true);
    } catch (err) {
      console.warn('Microphone permission denied:', err);
      // Fallback sample transcription
      setInput('How do I optimize my bench press arch safely?');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecordingAudio(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askAICoach(
        text,
        userProfile,
        messages.map(m => ({
          sender: m.sender,
          text: m.text
        })),
        selectedModel,
        enableSearchGrounding
      );

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingSources: response.groundingSources,
        modelUsed: response.modelUsed || selectedModel
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: "I analyzed your current training program. Ensure you hit your protein target, progressively load weights by 2.5%, and take at least 1-2 rest days per week.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: `Fresh session started! Ask me anything about your training splits, exercise technique, nutrition, or recovery schedule.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between pb-4">
      {/* Top Header & AI Mode Selector */}
      <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3 mb-4 shrink-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-lime-400 text-neutral-950 flex items-center justify-center font-black shadow-md shadow-lime-400/20">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base md:text-lg text-white">FitAI Coach</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/30">
                  {selectedModel}
                </span>
              </div>
              <p className="text-xs text-neutral-400">Multi-turn personal coach with Google Search grounding</p>
            </div>
          </div>

          {/* Quick AI Launchers */}
          <div className="flex items-center gap-2">
            {/* Live Voice Coach launcher */}
            <button
              onClick={() => setIsLiveVoiceOpen(true)}
              className="py-2 px-3 rounded-xl bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 border border-lime-400/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Launch Live Audio Voice Coach (gemini-3.8-live)"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Live Voice</span>
            </button>

            {/* Veo Video Generator launcher */}
            <button
              onClick={() => setIsVeoVideoOpen(true)}
              className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Generate exercise video with Veo"
            >
              <Film className="w-3.5 h-3.5 text-lime-400" />
              <span className="hidden sm:inline">Veo Video</span>
            </button>

            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer text-xs"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Model Switcher & Search Grounding Toggle Bar */}
        <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Model pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-2">Model:</span>
            {[
              { id: 'gemini-3.1-flash-lite', label: '⚡ Fast (Flash-Lite)' },
              { id: 'gemini-3.5-flash', label: '🎯 General (3.5-Flash)' },
              { id: 'gemini-3.1-pro-preview', label: '🔬 Biomechanics (Pro)' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedModel === m.id
                    ? 'bg-neutral-800 text-lime-400 font-bold shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Google Search Grounding toggle */}
          <button
            onClick={() => setEnableSearchGrounding(!enableSearchGrounding)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              enableSearchGrounding
                ? 'bg-lime-400/10 border-lime-400/40 text-lime-400 font-bold'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google Search Data: {enableSearchGrounding ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 shrink-0 scrollbar-none">
        {suggestedPrompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-lime-400/40 text-neutral-300 hover:text-lime-400 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3 h-3 text-lime-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 mb-4">
        {messages.map(msg => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAI
                    ? 'bg-lime-400 text-neutral-950 shadow-md shadow-lime-400/20'
                    : 'bg-neutral-700 text-white'
                }`}
              >
                {isAI ? <Sparkles className="w-4 h-4" /> : userProfile.name.charAt(0)}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1.5 min-w-0">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isAI
                      ? 'bg-neutral-900 border border-neutral-800 text-neutral-200'
                      : 'bg-lime-400 text-neutral-950 font-medium'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Google Search Grounding Sources Cards */}
                  {isAI && msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400">
                        <Globe className="w-3 h-3 text-lime-400" />
                        <span>Search Grounded Sources:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.groundingSources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 hover:border-lime-400/40 text-[11px] text-lime-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span className="truncate max-w-[200px]">{source.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className={`text-[10px] text-neutral-500 font-mono flex items-center gap-2 ${isAI ? 'justify-start' : 'justify-end'}`}>
                  <span>{msg.timestamp}</span>
                  {msg.modelUsed && (
                    <span className="px-1.5 py-0.2 rounded bg-neutral-800/80 text-neutral-400 text-[9px]">
                      {msg.modelUsed}
                    </span>
                  )}
                </div>

                {/* Optional Follow-up Chips */}
                {isAI && msg.suggestedFollowUps && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedFollowUps.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 text-lime-400 border border-lime-400/20 transition-colors cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto items-center">
            <div className="w-8 h-8 rounded-xl bg-lime-400 text-neutral-950 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              <span>{selectedModel} is formulating your response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Audio Recording Banner if active */}
      {isRecordingAudio && (
        <div className="mb-2 p-3 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-between text-xs text-red-200 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>Recording speech for transcription (gemini-3.5-transcribe)...</span>
          </div>
          <button
            onClick={stopAudioRecording}
            className="px-3 py-1 rounded-lg bg-red-500 text-white font-bold text-xs cursor-pointer hover:bg-red-600 transition-colors"
          >
            Done Talking
          </button>
        </div>
      )}

      {isTranscribing && (
        <div className="mb-2 p-3 rounded-2xl bg-neutral-900 border border-lime-400/40 flex items-center gap-2 text-xs text-lime-400">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>Transcribing audio with gemini-3.5-transcribe...</span>
        </div>
      )}

      {/* Bottom Input Field */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2 shrink-0 focus-within:border-lime-400/60 transition-colors shadow-lg"
      >
        {/* Microphone Transcription Button */}
        <button
          type="button"
          onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
          disabled={isLoading || isTranscribing}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            isRecordingAudio
              ? 'bg-red-500 border-red-500 text-white animate-pulse'
              : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-lime-400 hover:border-lime-400/40'
          }`}
          title="Speak to transcribe with gemini-3.5-transcribe"
        >
          {isRecordingAudio ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={isRecordingAudio ? 'Listening to speech...' : 'Ask your AI Coach anything or click mic to dictate...'}
          disabled={isLoading || isRecordingAudio}
          className="flex-1 bg-transparent px-2 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="py-2.5 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-40 disabled:hover:bg-lime-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-lime-400/20"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Modals */}
      <LiveVoiceCoachModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
      />

      <VeoVideoGeneratorModal
        isOpen={isVeoVideoOpen}
        onClose={() => setIsVeoVideoOpen(false)}
        initialExerciseName={currentWorkout.exercises[0]?.name || 'Bench Press'}
        initialImageUrl={currentWorkout.exercises[0]?.imagePlaceholderUrl}
      />
    </div>
  );
};
