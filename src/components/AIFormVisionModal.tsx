import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  RotateCcw, 
  Activity, 
  Eye, 
  Layers, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  Zap,
  Play
} from 'lucide-react';
import { Exercise } from '../types/fitness';
import { analyzeExerciseForm, AIFormAnalysisResult } from '../services/aiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialExercise?: Exercise | null;
}

const SAMPLE_DEMO_REPS = [
  {
    name: 'Barbell Back Squat',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    cue: 'Check depth and knee tracking'
  },
  {
    name: 'Barbell Bench Press',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    cue: 'Check elbow tuck and wrist angle'
  },
  {
    name: 'Romanian Deadlift',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    cue: 'Check spine neutrality and hip hinge'
  },
  {
    name: 'Push-Ups',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80',
    cue: 'Check core sagging and head position'
  }
];

export const AIFormVisionModal: React.FC<Props> = ({ isOpen, onClose, initialExercise }) => {
  const [exerciseName, setExerciseName] = useState<string>(initialExercise?.name || 'Barbell Back Squat');
  const [selectedImage, setSelectedImage] = useState<string>(
    initialExercise?.image || SAMPLE_DEMO_REPS[0].image
  );
  const [targetCue, setTargetCue] = useState<string>('Check depth and spine neutrality');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIFormAnalysisResult | null>(null);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialExercise) {
      setExerciseName(initialExercise.name);
      if (initialExercise.image) {
        setSelectedImage(initialExercise.image);
      }
    }
  }, [initialExercise]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setAnalysisResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Could not access camera:', err);
      setIsCameraActive(false);
      alert('Camera access unavailable. You can use sample exercise reps or upload a photo.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCountdown(null);
  };

  const captureRepFromCamera = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          doCapture();
          return null;
        }
        return prev - 1;
      });
    }, 900);
  };

  const doCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedImage(dataUrl);
        stopCamera();
        runAnalysis(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          runAnalysis(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (imgSource: string = selectedImage) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Extract base64
    let base64 = '';
    let mimeType = 'image/jpeg';
    if (imgSource.startsWith('data:')) {
      const parts = imgSource.split(',');
      base64 = parts[1];
      const match = parts[0].match(/:(.*?);/);
      if (match) mimeType = match[1];
    } else {
      // Fetch and convert image URL to base64
      try {
        const res = await fetch(imgSource);
        const blob = await res.blob();
        mimeType = blob.type || 'image/jpeg';
        const buffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        base64 = btoa(binary);
      } catch {
        base64 = '';
      }
    }

    try {
      const result = await analyzeExerciseForm(base64, mimeType, exerciseName, targetCue);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playVoiceCue = (cueText: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cueText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">AI Form & Biomechanics Vision</h2>
                <span className="bg-lime-400/20 text-lime-400 border border-lime-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Vision AI
                </span>
              </div>
              <p className="text-xs text-neutral-400">Instant posture, joint angles, and rep safety analysis via Gemini Vision</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exercise Selection & Cue Focus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">Target Exercise</label>
            <input
              type="text"
              value={exerciseName}
              onChange={e => setExerciseName(e.target.value)}
              placeholder="e.g. Barbell Squat, Deadlift, Bench Press"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">Focus Cue</label>
            <input
              type="text"
              value={targetCue}
              onChange={e => setTargetCue(e.target.value)}
              placeholder="e.g. Knee alignment, bar path, lumbar spine"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
            />
          </div>
        </div>

        {/* Viewport / Frame Capture Area */}
        <div className="mt-4 relative bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden aspect-video max-h-80 flex items-center justify-center">
          {isCameraActive ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video 
                ref={videoRef} 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-6xl font-black text-lime-400 animate-ping">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Camera Guides */}
              <div className="absolute inset-4 border border-dashed border-lime-400/40 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <span className="text-[10px] text-lime-400 bg-black/60 px-2 py-0.5 rounded self-start">
                  Position full body in frame
                </span>
                <span className="text-[10px] text-neutral-300 bg-black/60 px-2 py-0.5 rounded self-end">
                  Hold at bottom inflection point
                </span>
              </div>

              {/* Capture controls */}
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                <button
                  onClick={captureRepFromCamera}
                  disabled={countdown !== null}
                  className="px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
                >
                  <Camera className="w-4 h-4" />
                  Capture & Analyze
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center group">
              <img 
                src={selectedImage} 
                alt={exerciseName} 
                className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/30" />

              {/* Biomechanical skeleton overlay effect */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-lime-400/20 border-t-lime-400 animate-spin" />
                    <Sparkles className="w-6 h-6 text-lime-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-lime-400">Gemini Vision Scanning Biomechanics...</p>
                  <p className="text-xs text-neutral-400 mt-1">Evaluating spine axis, joint flexion, and stability</p>
                </div>
              )}

              {/* Overlay controls when not analyzing */}
              {!isAnalyzing && (
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                  <span className="text-xs bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-neutral-300 font-medium">
                    Frame ready for analysis
                  </span>
                  <button
                    onClick={() => runAnalysis(selectedImage)}
                    className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-lime-400/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Scan Form Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Source Switchers */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-neutral-800/60">
          <div className="flex items-center gap-2">
            <button
              onClick={startCamera}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-lime-400" />
              Use Live Camera
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-neutral-400" />
              Upload Photo/Video
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*,video/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </div>

          {/* Quick Demo Previews */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-neutral-400 mr-1">Demo Reps:</span>
            {SAMPLE_DEMO_REPS.map((demo, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setExerciseName(demo.name);
                  setSelectedImage(demo.image);
                  setTargetCue(demo.cue);
                  runAnalysis(demo.image);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                  exerciseName === demo.name 
                    ? 'bg-lime-400/20 text-lime-400 border border-lime-400/40 font-bold' 
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {demo.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Results Dashboard */}
        {analysisResult && (
          <div className="mt-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
            {/* Top Score Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border font-black ${
                  analysisResult.score >= 88 
                    ? 'bg-lime-400/10 border-lime-400/40 text-lime-400' 
                    : analysisResult.score >= 75 
                    ? 'bg-amber-400/10 border-amber-400/40 text-amber-400'
                    : 'bg-red-400/10 border-red-400/40 text-red-400'
                }`}>
                  <span className="text-xl leading-none">{analysisResult.score}</span>
                  <span className="text-[9px] uppercase font-bold text-neutral-400 mt-0.5">/100</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">Form Score: {analysisResult.status.toUpperCase()}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      analysisResult.injuryRisk === 'low'
                        ? 'bg-lime-400/10 text-lime-400 border-lime-400/30'
                        : analysisResult.injuryRisk === 'moderate'
                        ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                        : 'bg-red-400/10 text-red-400 border-red-400/30'
                    }`}>
                      {analysisResult.injuryRisk} Injury Risk
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Analyzed biomechanical planes for {exerciseName}
                  </p>
                </div>
              </div>

              {/* Spoken Audio Cue Button */}
              <button
                onClick={() => playVoiceCue(analysisResult.immediateCorrectionCue)}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-lime-400 rounded-xl text-xs font-bold flex items-center gap-2 border border-neutral-700 self-start sm:self-auto transition-colors"
                title="Listen to vocal coach cue"
              >
                <Volume2 className="w-4 h-4" />
                Play Vocal Cue
              </button>
            </div>

            {/* Immediate Correction Banner */}
            <div className="bg-lime-400/10 border border-lime-400/30 rounded-xl p-3.5 flex items-start gap-3">
              <Zap className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-lime-400 block mb-0.5">
                  Immediate Rep Correction Cue
                </span>
                <p className="text-sm font-semibold text-white">
                  "{analysisResult.immediateCorrectionCue}"
                </p>
              </div>
            </div>

            {/* Biomechanical Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                  Spinal Alignment & Torso
                </span>
                <p className="text-xs text-neutral-200 leading-relaxed">
                  {analysisResult.spineAlignment}
                </p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-1">
                  Joint Angles & Bar Path
                </span>
                <p className="text-xs text-neutral-200 leading-relaxed">
                  {analysisResult.jointAngles}
                </p>
              </div>
            </div>

            {/* Key Findings List */}
            <div>
              <span className="text-[11px] font-bold uppercase text-neutral-400 block mb-2">
                Detailed Biomechanical Observations
              </span>
              <div className="space-y-1.5">
                {analysisResult.keyFindings.map((finding, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300 bg-neutral-900/60 px-3 py-2 rounded-lg border border-neutral-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
