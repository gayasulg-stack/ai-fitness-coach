import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Sparkles, 
  Apple, 
  Flame, 
  Dumbbell, 
  CheckCircle2, 
  RotateCcw, 
  ChevronRight,
  Plus,
  Scale
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { analyzeMealNutrition, AIMealAnalysisResult } from '../services/aiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_MEALS = [
  {
    name: 'Grilled Salmon & Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    desc: 'Wild caught salmon, tricolor quinoa, steamed broccoli, olive oil'
  },
  {
    name: 'Whey Protein Recovery Shake',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    desc: 'Whey isolate, 1 large banana, almond milk, peanut butter'
  },
  {
    name: 'Steak & Sweet Potato Plate',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    desc: 'Sirloin steak, baked sweet potato, asparagus, sea salt'
  },
  {
    name: 'Greek Yogurt & Berry Parfait',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    desc: 'Non-fat Greek yogurt, mixed organic berries, chia seeds, raw honey'
  }
];

export const AIMealScannerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { userProfile, logMeal } = useFitness();

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_MEALS[0].image);
  const [textDescription, setTextDescription] = useState<string>(SAMPLE_MEALS[0].desc);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [result, setResult] = useState<AIMealAnalysisResult | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setIsCameraActive(false);
      alert('Camera access unavailable. You can use sample meals or upload a photo.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
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
        runMealAnalysis(dataUrl, textDescription);
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
          runMealAnalysis(reader.result, textDescription);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const runMealAnalysis = async (imgSource: string = selectedImage, desc: string = textDescription) => {
    setIsScanning(true);
    setResult(null);
    setIsLogged(false);

    let base64 = '';
    if (imgSource.startsWith('data:')) {
      base64 = imgSource.split(',')[1];
    }

    try {
      const data = await analyzeMealNutrition(base64 || null, desc, userProfile.goal);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleLogMeal = () => {
    if (!result) return;
    logMeal({
      name: result.mealName,
      calories: result.calories,
      protein: result.proteinGrams,
      carbs: result.carbsGrams,
      fat: result.fatGrams
    });
    setIsLogged(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">AI Nutrition & Macro Scanner</h2>
                <span className="bg-lime-400/20 text-lime-400 border border-lime-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gemini Vision
                </span>
              </div>
              <p className="text-xs text-neutral-400">Snap meal or enter ingredients for instant protein & macro tracking</p>
            </div>
          </div>
          <button 
            onClick={() => { stopCamera(); onClose(); }} 
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport / Frame */}
        <div className="mt-4 relative bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden aspect-video max-h-64 flex items-center justify-center">
          {isCameraActive ? (
            <div className="relative w-full h-full bg-black">
              <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                <button
                  onClick={captureCameraPhoto}
                  className="px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                  Capture Meal
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2.5 bg-neutral-800 text-white font-medium text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img src={selectedImage} alt="Meal preview" className="w-full h-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/30" />
              
              {isScanning && (
                <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-xs flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-4 border-lime-400/20 border-t-lime-400 animate-spin" />
                  <p className="mt-3 text-sm font-semibold text-lime-400">Scanning Macronutrients & Recovery Bioavailability...</p>
                </div>
              )}

              {!isScanning && (
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                  <span className="text-xs bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-neutral-300 font-medium truncate max-w-xs">
                    {textDescription || 'Ready to scan'}
                  </span>
                  <button
                    onClick={() => runMealAnalysis(selectedImage, textDescription)}
                    className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    Scan Macros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-neutral-800/60">
          <div className="flex items-center gap-2">
            <button
              onClick={startCamera}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-lime-400" />
              Take Photo
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-neutral-400" />
              Upload Image
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-neutral-400 mr-1">Sample Plates:</span>
            {SAMPLE_MEALS.map((meal, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedImage(meal.image);
                  setTextDescription(meal.desc);
                  runMealAnalysis(meal.image, meal.desc);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                  textDescription === meal.desc
                    ? 'bg-lime-400/20 text-lime-400 border border-lime-400/40 font-bold'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {meal.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Text description editor */}
        <div className="mt-3">
          <input
            type="text"
            value={textDescription}
            onChange={e => setTextDescription(e.target.value)}
            placeholder="Or describe ingredients (e.g. 200g chicken breast, 1 sweet potato, olive oil)"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400"
          />
        </div>

        {/* Nutrition Result Breakdown */}
        {result && (
          <div className="mt-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
              <div>
                <h3 className="font-bold text-base text-white">{result.mealName}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Recovery Score: {result.recoveryRating}/100</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-lime-400">{result.calories}</span>
                <span className="text-xs font-semibold text-neutral-400">kcal</span>
              </div>
            </div>

            {/* 3 Macro Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="bg-neutral-900 border border-lime-400/30 rounded-xl p-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Protein</span>
                <span className="text-xl sm:text-2xl font-black text-lime-400">{result.proteinGrams}g</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Muscle Synthesis</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Carbs</span>
                <span className="text-xl sm:text-2xl font-black text-white">{result.carbsGrams}g</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Glycogen Refill</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Fat</span>
                <span className="text-xl sm:text-2xl font-black text-neutral-300">{result.fatGrams}g</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Hormone Health</span>
              </div>
            </div>

            {/* Recovery Analysis */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-300 space-y-1">
              <p className="leading-relaxed">{result.recoveryAnalysis}</p>
              <p className="text-lime-400/90 font-medium">💡 {result.optimizationTip}</p>
            </div>

            {/* Log Button */}
            <button
              onClick={handleLogMeal}
              disabled={isLogged}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isLogged
                  ? 'bg-neutral-800 text-lime-400 cursor-default'
                  : 'bg-lime-400 hover:bg-lime-300 text-neutral-950 shadow-lg shadow-lime-400/20'
              }`}
            >
              {isLogged ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Logged to Today's Nutrition Progress!
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Log to Daily Nutrition Tracker (+{result.proteinGrams}g Protein)
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
