import React, { useState } from 'react';
import { X, Skull, Flame } from 'lucide-react';

interface InstallPromptProps {
  canInstall: boolean;
  onInstall: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ canInstall, onInstall }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="fixed bottom-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.5rem))] left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom duration-300">
      <div className="p-4 rounded-2xl bg-neutral-950 border border-red-700/80 shadow-2xl shadow-red-950/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Skull className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1 uppercase tracking-wider">
              <span>INSTALL SHOWZ HC APP</span>
              <Flame className="w-3.5 h-3.5 text-red-400" />
            </h4>
            <p className="text-[11px] text-neutral-400">
              Offline gig finder & instant hardcore show updates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onInstall}
            className="px-3 py-1.5 rounded-xl bg-red-600 text-white hover:bg-red-500 text-xs font-black uppercase tracking-wider shadow transition-all cursor-pointer border border-red-500"
          >
            INSTALL
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
