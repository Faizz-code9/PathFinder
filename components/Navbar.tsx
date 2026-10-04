'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  Users,
  UserCheck,
  Search,
  ShieldAlert,
  LogOut,
  Sparkles,
  Layers,
  Menu,
  X,
  User,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error('Navbar auth error:', err);
      }
    }
    fetchMe();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Don't show full navbar on login or register pages
  if (pathname === '/login' || pathname === '/register') {
    return (
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Path<span className="text-cyan-400">Finder</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg shadow-md shadow-blue-600/30 transition"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>
    );
  }

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Layers },
    { name: 'PathFinder', href: '/pathfinder', icon: Compass, highlight: true },
    { name: 'My Network', href: '/network', icon: Users },
    { name: 'Suggestions', href: '/suggestions', icon: Sparkles },
    { name: 'Search', href: '/search', icon: Search },
  ];

  if (currentUser?.role === 'admin') {
    navLinks.push({ name: 'Admin Hub', href: '/admin', icon: ShieldAlert, highlight: false });
  }

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <a href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Path<span className="text-cyan-400">Finder</span>
              </span>
              <span className="hidden md:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Hybrid DBMS
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600/15 text-cyan-300 border border-blue-500/30'
                      : link.highlight
                      ? 'text-cyan-400 hover:bg-cyan-950/40 hover:text-cyan-300'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight && !isActive ? 'text-cyan-400' : ''}`} />
                  {link.name}
                  {link.highlight && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* User profile & actions */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <a
                href={`/profile/${currentUser.id}`}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-900 transition"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={currentUser.full_name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-tight">
                    {currentUser.full_name || currentUser.email}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {currentUser.role === 'admin' ? '🛡️ Admin' : 'User'}
                  </p>
                </div>
              </a>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/login"
                className="text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition"
              >
                Register
              </a>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-blue-600/20 text-cyan-300'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </a>
            );
          })}
          {currentUser && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <a
                href={`/profile/${currentUser.id}`}
                className="flex items-center gap-2 text-sm text-slate-300"
              >
                <User className="w-4 h-4" />
                My Profile
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-red-400"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
