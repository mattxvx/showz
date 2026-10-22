import React, { useState } from 'react';
import { X, Lock, KeyRound, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { verifyMasterPassword } from '../utils/auth';

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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const result = await verifyMasterPassword(password);
      if (result.success) {
        setPassword('');
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Access Denied.');
      }
    } catch (err) {
      setError('Authentication error occurred.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-safe bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-neutral-950 border border-red-900/60 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-950 text-red-500 border border-red-800 mb-2 shadow-lg shadow-red-950">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight hc-font">
            ADMIN VERIFICATION
          </h3>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto uppercase font-bold tracking-wider">
            Protected Live Production Console
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-neutral-300 mb-1.5 uppercase tracking-wider">
              Enter Admin Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 mt-2 p-2 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-950 transition-all cursor-pointer border border-red-500 disabled:opacity-50"
          >
            {isVerifying ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE ACCESS'}
          </button>

          <p className="text-[10px] text-center text-neutral-600 uppercase font-black tracking-widest pt-2">
            Protected by Salted SHA-256 Cryptography
          </p>
        </form>
      </div>
    </div>
  );
};
