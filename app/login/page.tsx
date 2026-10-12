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

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError('Failed to connect to server.');
      setLoading(false);
    }
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
          className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 pt-3">
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
