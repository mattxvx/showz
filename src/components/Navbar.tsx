import React from 'react';
import { Skull, Shield, ShieldCheck, Heart, Download, Plus, Cloud, CloudOff } from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenAddModal: () => void;
  favoritesCount: number;
  showOnlyFavorites: boolean;
  onToggleFavoritesOnly: () => void;
  canInstall: boolean;
  onInstallApp: () => void;
  isCloudConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  onToggleAdmin,
  onOpenAddModal,
  favoritesCount,
  showOnlyFavorites,
  onToggleFavoritesOnly,
  canInstall,
  onInstallApp,
  isCloudConnected = true,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/90 border-b border-neutral-800 px-4 lg:px-8 pb-3.5 safe-top transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Hardcore Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-800 to-black border border-red-500/60 shadow-lg shadow-red-950/60">
            <Skull className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-wider text-2xl text-white hc-font">
                SHOWZ
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-700/60">
                HARDCORE
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-medium">
              <span>Underground Gigs & Hardcore Shows</span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center gap-1 text-[10px] text-neutral-400" title={isCloudConnected ? "Cloud Sync Active (Firestore)" : "Offline Local Mode"}>
                {isCloudConnected ? (
                  <>
                    <Cloud className="w-3 h-3 text-red-500" />
                    <span className="text-red-400 font-semibold">LIVE CLOUD</span>
                  </>
                ) : (
                  <>
                    <CloudOff className="w-3 h-3 text-neutral-500" />
                    <span>LOCAL</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Saved Shows */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              showOnlyFavorites
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/60'
                : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
            title="Show saved gigs"
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">SAVED</span>
            {favoritesCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                showOnlyFavorites ? 'bg-black text-red-400' : 'bg-red-950 text-red-400 border border-red-800'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Install PWA Button */}
          {canInstall && (
            <button
              onClick={onInstallApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-neutral-900 text-red-400 border border-red-800/80 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">INSTALL</span>
            </button>
          )}

          {/* Quick Add Show Button for Admin */}
          {isAdmin && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-950/60 border border-red-500 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ ADD GIG</span>
            </button>
          )}

          {/* Admin Toggle Button */}
          <button
            onClick={onToggleAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider border transition-all cursor-pointer ${
              isAdmin
                ? 'bg-red-950/80 text-red-300 border-red-600 shadow-md shadow-red-950'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <span>ADMIN ON</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-0.5" />
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span>ADMIN</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
