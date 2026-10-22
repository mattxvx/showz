import React, { useState } from 'react';
import { X, Lock, KeyRound, Sparkles } from 'lucide-react';
import { getStoredAdminPIN, setStoredAdminPIN } from '../utils/storage';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showChangePin, setShowChangePin] = useState(false);
  const [newPin, setNewPin] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = getStoredAdminPIN();
    if (pin === stored || pin === '1234') {
      onSuccess();
      onClose();
    } else {
      setError('Incorrect PIN. (Default demo PIN is 1234)');
    }
  };

  const handleQuickDemoUnlock = () => {
    onSuccess();
    onClose();
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setError('New PIN must be at least 4 digits');
      return;
    }
    setStoredAdminPIN(newPin);
    alert('Admin PIN updated!');
    setShowChangePin(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-safe bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-white">Admin Authentication</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Manage shows, create new concerts, edit lineups, and export/import event backups.
          </p>
        </div>

        {/* 1-Click Demo Unlock Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Mockup / Testing Mode</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Default passcode is <code className="text-purple-300 bg-purple-900/40 px-1.5 py-0.5 rounded font-mono">1234</code>. Or unlock instantly:
          </p>
          <button
            type="button"
            onClick={handleQuickDemoUnlock}
            className="w-full py-2 px-4 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all cursor-pointer"
          >
            ⚡ One-Click Instant Unlock
          </button>
        </div>

        {!showChangePin ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter Admin Passcode / PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  autoFocus
                  placeholder="e.g. 1234"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 tracking-widest text-center"
                />
              </div>
              {error && <p className="text-xs text-rose-400 mt-1.5 text-center">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
            >
              Sign In to Admin
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowChangePin(true)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Change Admin PIN
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter New Admin PIN (min 4 digits)
              </label>
              <input
                type="password"
                placeholder="New PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 tracking-widest text-center"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowChangePin(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-3 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Update PIN
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
