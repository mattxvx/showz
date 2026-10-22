import React from 'react';
import { Music, Shield, ShieldCheck, Heart, Download, Plus } from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenAddModal: () => void;
  favoritesCount: number;
  showOnlyFavorites: boolean;
  onToggleFavoritesOnly: () => void;
  canInstall: boolean;
  onInstallApp: () => void;
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
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 lg:px-8 pb-3.5 safe-top transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 shadow-lg shadow-purple-900/30">
            <Music className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Showz
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Local Shows & Live Music Finder
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Favorites Filter Button */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              showOnlyFavorites
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/40'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
            title="Show saved favorites"
          >
            <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-current' : ''}`} />
            <span className="hidden md:inline">Saved</span>
            {favoritesCount > 0 && (
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                showOnlyFavorites ? 'bg-white text-pink-600' : 'bg-pink-500/20 text-pink-300'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Install PWA Button (Visible if browser trigger is ready) */}
          {canInstall && (
            <button
              onClick={onInstallApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all animate-bounce"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Quick Add Show Button for Admin */}
          {isAdmin && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Show</span>
            </button>
          )}

          {/* Admin Toggle Button */}
          <button
            onClick={onToggleAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
              isAdmin
                ? 'bg-purple-950/80 text-purple-300 border-purple-500/50 shadow-md shadow-purple-950'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Admin Mode</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Admin Portal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
