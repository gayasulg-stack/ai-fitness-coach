import React from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:right-auto md:max-w-md z-50 flex items-center justify-between gap-3 rounded-2xl bg-neutral-900 border border-lime-400/50 p-3.5 text-xs text-neutral-200 shadow-2xl backdrop-blur-md glow-ai animate-fadeIn">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-lime-400/20 text-lime-400 shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-white block">Offline Mode Active</span>
          <span className="text-[11px] text-neutral-400">
            Workouts & progress tracking are cached and saving locally.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-lime-400 font-bold px-2 py-1 rounded bg-lime-400/10 shrink-0 border border-lime-400/20">
        <CheckCircle2 className="w-3 h-3" />
        <span>Cached</span>
      </div>
    </div>
  );
};
