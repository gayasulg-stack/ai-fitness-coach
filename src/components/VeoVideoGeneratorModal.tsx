import React, { useState, useEffect } from 'react';
import { 
  X, 
  Video, 
  Sparkles, 
  Upload, 
  Play, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Film
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { generateVeoVideo, checkVeoVideoStatus, downloadVeoVideo } from '../services/aiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialExerciseName?: string;
  initialImageUrl?: string;
}

export const VeoVideoGeneratorModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  initialExerciseName = 'Barbell Bench Press',
  initialImageUrl = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'
}) => {
  const { currentWorkout } = useFitness();

  const [prompt, setPrompt] = useState(`Animate dynamic lifting motion of ${initialExerciseName} with proper elbow tuck and controlled tempo.`);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(initialImageUrl);
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stages = [
    'Encoding reference posture image...',
    'Synthesizing muscular kinematics with Veo...',
    'Generating 720p motion video...',
    'Finalizing video render...'
  ];

  useEffect(() => {
    if (initialImageUrl) {
      setSelectedImageUrl(initialImageUrl);
    }
    if (initialExerciseName) {
      setPrompt(`Animate dynamic lifting motion of ${initialExerciseName} with proper elbow tuck and controlled tempo.`);
    }
  }, [initialExerciseName, initialImageUrl]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setSelectedImageUrl(result);
      // Strip data url prefix for API
      const base64Data = result.split(',')[1];
      setCustomImageBase64(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgressStage(0);
    setError(null);
    setGeneratedVideoUrl(null);

    // Staged progression animation
    const stageTimer1 = setTimeout(() => setProgressStage(1), 1500);
    const stageTimer2 = setTimeout(() => setProgressStage(2), 3500);
    const stageTimer3 = setTimeout(() => setProgressStage(3), 6000);

    try {
      // Use custom uploaded image or sample image
      const imageBytes = customImageBase64 || 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const result = await generateVeoVideo(imageBytes, 'image/jpeg', prompt, aspectRatio);

      // Poll or finalize
      setTimeout(async () => {
        const videoUrl = await downloadVeoVideo(result.operationName);
        setGeneratedVideoUrl(videoUrl);
        setIsGenerating(false);
      }, 7500);
    } catch (err: any) {
      setError(err?.message || 'Video generation error. Please try again.');
      setIsGenerating(false);
    }

    return () => {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-8 my-8 text-neutral-100 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lime-400 text-neutral-950 flex items-center justify-center font-bold shadow-md shadow-lime-400/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Animate Exercise with Veo</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30">
                  veo-3.1-fast-generate-preview
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Turn reference workout photos into smooth biomechanical video demonstrations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!generatedVideoUrl ? (
          <div className="space-y-5">
            {/* Image Preview & Upload Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                1. Reference Posture / Exercise Photo
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                {/* Visual Preview */}
                <div className={`relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center ${
                  aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-h-56 mx-auto'
                }`}>
                  <img
                    src={selectedImageUrl}
                    alt="Reference Posture"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-neutral-950/80 text-[10px] text-lime-400 font-bold border border-neutral-800">
                    Source Posture
                  </div>
                </div>

                {/* Upload or Preset Options */}
                <div className="space-y-3">
                  <label className="p-4 rounded-2xl border border-dashed border-neutral-700 hover:border-lime-400/60 bg-neutral-950/50 hover:bg-neutral-950 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                    <Upload className="w-5 h-5 text-neutral-500 group-hover:text-lime-400 mb-1.5 transition-colors" />
                    <span className="text-xs font-bold text-white group-hover:text-lime-400">Upload Your Gym Photo</span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">JPG or PNG supported</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-xs">
                    <span className="text-neutral-400 block text-[11px] mb-1">Preset Exercise Source:</span>
                    <span className="font-semibold text-white truncate block">{initialExerciseName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Aspect Ratio Picker */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                2. Video Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    aspectRatio === '16:9'
                      ? 'bg-lime-400/10 border-lime-400 text-white font-bold'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm block">16:9 (Landscape)</span>
                  <span className="text-[11px] text-neutral-500">Wide desktop & tablet format</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    aspectRatio === '9:16'
                      ? 'bg-lime-400/10 border-lime-400 text-white font-bold'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm block">9:16 (Portrait)</span>
                  <span className="text-[11px] text-neutral-500">Vertical mobile phone format</span>
                </button>
              </div>
            </div>

            {/* 3. Prompt Configuration */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                3. Motion & Biomechanics Prompt
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={2}
                placeholder="Describe how the exercise motion should animate..."
                className="w-full p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400/60 resize-none"
              />
            </div>

            {/* Generation Progress Indicator if Active */}
            {isGenerating && (
              <div className="p-4 rounded-2xl bg-neutral-950 border border-lime-400/40 space-y-2 glow-ai animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-lime-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Generating Video with Veo...
                  </span>
                  <span className="text-neutral-500 font-mono">Stage {progressStage + 1} of 4</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-400 transition-all duration-700 rounded-full"
                    style={{ width: `${((progressStage + 1) / 4) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 italic">
                  "{stages[progressStage]}"
                </p>
              </div>
            )}

            {/* Generate CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 px-6 rounded-2xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-neutral-950 font-black text-base shadow-xl shadow-lime-400/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Video className="w-5 h-5 fill-current" />
                <span>{isGenerating ? 'Rendering Video...' : 'Generate Veo Exercise Video'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Video Result Player */
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-lime-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Veo Motion Video Rendered Successfully!</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">720p • {aspectRatio}</span>
            </div>

            {/* Video Player */}
            <div className={`relative rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl flex items-center justify-center ${
              aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-h-96 mx-auto'
            }`}>
              <video
                src={generatedVideoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-neutral-400">
              Generated demonstration for <strong className="text-white">{initialExerciseName}</strong> showing kinematic form and cadence.
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={generatedVideoUrl}
                download={`${initialExerciseName.toLowerCase().replace(/\s+/g, '-')}-veo.mp4`}
                className="py-3 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-lime-400/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Video</span>
              </a>

              <button
                onClick={() => setGeneratedVideoUrl(null)}
                className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Generate Another</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
