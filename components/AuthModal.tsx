import React, { useState } from 'react';
import { supabase, isSupabaseConfigured, getSupabaseError } from '../lib/supabase';
import { X, Lock, Mail, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userEmail: string) => void;
}

type AuthStatus = 'idle' | 'loading' | 'success' | 'error' | 'unconfigured';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-slate-800">Auth Unavailable</h3>
              <p className="text-sm text-slate-600 mt-1">
                Supabase is not configured. Authentication features are temporarily disabled.
              </p>
              <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded">
                Error: {getSupabaseError()}
              </p>
              <p className="text-xs text-slate-600 mt-2">
                Check your .env file and restart the development server.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-200 text-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Attempt sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!signInError) {
        // Sign in successful
        setStatus('success');
        setEmail('');
        setPassword('');
        onSuccess(email);
        onClose();
        return;
      }

      // If sign in fails, try sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      // Sign up successful
      setStatus('success');
      setEmail('');
      setPassword('');
      setErrorMessage('Account created! Check your email to confirm.');
      
      // Keep modal open to show success message, auto-close after 3 seconds
      setTimeout(() => {
        onSuccess(email);
        onClose();
      }, 3000);
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-800 mb-1">Sign In / Register</h3>
        <p className="text-xs text-slate-400 mb-6">Save favorite cities and receive personalized health alerts.</p>

        {/* Error Message Display */}
        {status === 'error' && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-rose-800">Authentication Error</p>
              <p className="text-xs text-rose-700 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Success Message Display */}
        {status === 'success' && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-3">
            <div className="flex-1">
              <p className="text-xs font-semibold text-emerald-800">Success!</p>
              <p className="text-xs text-emerald-700 mt-1">Account created. Redirecting...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                disabled={status === 'loading' || status === 'success'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                disabled={status === 'loading' || status === 'success'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Processing...' : status === 'success' ? 'Success!' : 'Continue'}
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Don't have an account? Sign up with your email above.
        </p>
      </div>
    </div>
  );
};
