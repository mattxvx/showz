import React, { useState } from 'react';
import { X, Lock, KeyRound, Skull } from 'lucide-react';
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
      setError('Incorrect Passcode. (Default is 1234)');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-safe bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-950 text-red-500 border border-red-800 mb-2">
            <Skull className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight hc-font">ADMIN PASSCODE</h3>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            Add hardcore shows, edit lineups, upload flyers, and sync to live Firebase Cloud database.
          </p>
        </div>

        {/* 1-Click Demo Unlock Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-black border border-red-900/60 flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-red-400 uppercase tracking-wider">
            <Lock className="w-4 h-4 text-red-500" />
            <span>INSTANT DEMO ACCESS</span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Default passcode is <code className="text-red-400 bg-red-950 px-1.5 py-0.5 rounded font-mono font-bold">1234</code>
          </p>
          <button
            type="button"
            onClick={handleQuickDemoUnlock}
            className="w-full py-2 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-md transition-all cursor-pointer border border-red-500"
          >
            ⚡ ONE-CLICK QUICK UNLOCK
          </button>
        </div>

        {!showChangePin ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">
                Enter Admin PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  autoFocus
                  placeholder="e.g. 1234"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600 tracking-widest text-center"
                />
              </div>
              {error && <p className="text-xs text-red-400 font-bold mt-1.5 text-center">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-950 transition-all cursor-pointer border border-red-500"
            >
              ENTER ADMIN
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowChangePin(true)}
                className="text-xs text-neutral-500 hover:text-neutral-300 font-bold uppercase transition-colors"
              >
                Change Admin PIN
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                Enter New PIN (min 4 digits)
              </label>
              <input
                type="password"
                placeholder="New PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600 tracking-widest text-center"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowChangePin(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-3 rounded-xl bg-red-600 text-white text-xs font-black uppercase"
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
