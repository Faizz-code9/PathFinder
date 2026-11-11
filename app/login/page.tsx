'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Lock, Mail, ArrowRight, AlertCircle, Sparkles, Check } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('/dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('redirect');
      if (r) setRedirectUrl(r);
    }
  }, []);

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        if (!res.ok) {
          setError(`Server returned status ${res.status}. Please try again.`);
          setLoading(false);
          setActiveDemo(null);
          return;
        }
      }

      if (!res.ok) {
        setError(data.error || 'Authentication failed.');
        setLoading(false);
        setActiveDemo(null);
        return;
      }

      // Hard redirect ensures cookies are immediately recognized by middleware and server components
      window.location.href = redirectUrl;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Failed to connect to server.');
      setLoading(false);
      setActiveDemo(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const handleFillOnly = (e: React.MouseEvent, demoEmail: string) => {
    e.stopPropagation();
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    setActiveDemo(null);
  };

  const handleOneClickLogin = async (demoEmail: string, demoLabel: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setActiveDemo(demoLabel);
    await performLogin(demoEmail, 'password123');
  };

  const demoAccounts = [
    {
      label: 'Admin',
      name: 'System Admin',
      email: 'admin@pathfinder.io',
      icon: '🛡️',
      color: 'text-cyan-300',
      badgeBg: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/80',
    },
    {
      label: 'Alice Chen',
      name: 'Alice Chen (Google)',
      email: 'alice.chen@google.com',
      icon: '👤',
      color: 'text-blue-300',
      badgeBg: 'bg-blue-950/70 text-blue-300 border-blue-800/80',
    },
    {
      label: 'Bob Martinez',
      name: 'Bob Martinez (OpenAI)',
      email: 'bob.martinez@openai.com',
      icon: '👤',
      color: 'text-emerald-300',
      badgeBg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
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
          onSubmit={handleFormSubmit}
          className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
        >
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
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
            {loading && !activeDemo ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Quick Demo Accounts (1-Click Sign In):
              </p>
              <span className="text-[10px] text-slate-500 font-mono">pwd: password123</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map((account) => {
                const isCurrentActive = activeDemo === account.label && loading;
                return (
                  <div
                    key={account.email}
                    onClick={() => handleOneClickLogin(account.email, account.label)}
                    className="w-full flex items-center justify-between text-left text-xs bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="text-sm shrink-0">{account.icon}</span>
                      <div className="truncate">
                        <strong className={`${account.color} block text-xs truncate`}>
                          {account.name}
                        </strong>
                        <span className="text-[11px] text-slate-400 font-mono block truncate">
                          {account.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleFillOnly(e, account.email)}
                        title="Fill fields without signing in"
                        className="px-2 py-1 text-[10px] font-medium bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60 rounded-lg transition cursor-pointer"
                      >
                        Fill Only
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        className="px-2.5 py-1 text-[10px] font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg shadow-sm flex items-center gap-1 transition cursor-pointer"
                      >
                        {isCurrentActive ? (
                          <>
                            <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign In ⚡
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 pt-2">
            Don't have an account?{' '}
            <a href="/register" className="text-cyan-400 hover:underline font-medium cursor-pointer">
              Create one now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
