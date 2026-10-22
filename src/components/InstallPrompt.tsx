import React, { useState } from 'react';
import { X, Music, Sparkles } from 'lucide-react';

interface InstallPromptProps {
  canInstall: boolean;
  onInstall: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ canInstall, onInstall }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="fixed bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.5rem))] left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom duration-300">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1">
              <span>Install Showz App</span>
              <Sparkles className="w-3 h-3 text-pink-400" />
            </h4>
            <p className="text-[11px] text-slate-300">
              Offline gig finder & instant admin show management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onInstall}
            className="px-3 py-1.5 rounded-xl bg-white text-slate-950 hover:bg-slate-200 text-xs font-black shadow transition-all cursor-pointer"
          >
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
