'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Compass, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed.');
        setLoading(false);
        return;
      }

      // Hard redirect ensures cookies are immediately recognized by middleware and server components
      window.location.href = redirect;
    } catch (err) {
      setError('Failed to connect to server.');
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="max-w-md w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20 mb-4">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to PathFinder</h1>
        <p className="text-xs text-slate-400 mt-1.5">
          Access the hybrid graph-relational networking engine
        </p>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
      >
        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Quick Demo Credentials */}
        <div className="pt-3 border-t border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-400 mb-2">
            ⚡ Quick Demo Accounts (Password: <code className="text-cyan-400 font-mono">password123</code>):
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@pathfinder.io')}
              className="w-full flex items-center justify-between text-left text-xs bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 px-3 py-2 rounded-xl text-slate-300 hover:text-white transition group"
            >
              <span>🛡️ <strong className="text-cyan-300">Admin:</strong> admin@pathfinder.io</span>
              <span className="text-[10px] text-slate-500 group-hover:text-cyan-400">Click to fill</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('alice.chen@google.com')}
              className="w-full flex items-center justify-between text-left text-xs bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 px-3 py-2 rounded-xl text-slate-300 hover:text-white transition group"
            >
              <span>👤 <strong className="text-blue-300">Alice Chen (Google):</strong> alice.chen@google.com</span>
              <span className="text-[10px] text-slate-500 group-hover:text-cyan-400">Click to fill</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('bob.martinez@openai.com')}
              className="w-full flex items-center justify-between text-left text-xs bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 px-3 py-2 rounded-xl text-slate-300 hover:text-white transition group"
            >
              <span>👤 <strong className="text-emerald-300">Bob Martinez (OpenAI):</strong> bob.martinez@openai.com</span>
              <span className="text-[10px] text-slate-500 group-hover:text-cyan-400">Click to fill</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <a href="/register" className="text-cyan-400 hover:underline font-medium">
            Create one now
          </a>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading sign in...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
