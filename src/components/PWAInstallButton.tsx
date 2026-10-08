import React, { useState } from 'react';
import { Download, Share2, X, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (compact) {
      return (
        <button
          onClick={install}
          title="Install FitAI Coach App"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-400 text-neutral-950 font-bold text-xs shadow-md shadow-lime-400/20 hover:bg-lime-300 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2 text-xs font-black text-neutral-950 shadow-md shadow-lime-400/20 hover:bg-lime-300 transition-all cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Install App Offline</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-700 bg-neutral-900 text-xs font-semibold text-neutral-300 hover:text-white hover:border-lime-400/40 transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-lime-400" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4">
            <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-neutral-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-lime-400 text-neutral-950">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-white">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                Install FitAI Coach to your home screen for full offline workout access:
              </p>

              <div className="space-y-2.5 text-xs text-neutral-300 mb-6 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-neutral-800 text-lime-400 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Tap the <strong className="text-white">Share</strong> icon (<Share2 className="w-3 h-3 inline text-lime-400" />) in the Safari toolbar.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-neutral-800 text-lime-400 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-neutral-800 text-lime-400 font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Tap <strong className="text-white">Add</strong> to launch with instant offline caching.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-lime-400 py-3 text-xs font-bold text-neutral-950 hover:bg-lime-300 transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
