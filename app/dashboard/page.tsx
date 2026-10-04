'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
} from 'lucide-react';
import NetworkStats from '@/components/NetworkStats';
import ProfileCard from '@/components/ProfileCard';
import ConnectionCard from '@/components/ConnectionCard';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    activeUsers: 50,
    totalConnections: 45,
    totalCompanies: 15,
    totalSkills: 15,
    avgConnectionsPerUser: 1.8,
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch current user
      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      // 2. Fetch network stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const sData = await statsRes.json();
        if (sData.stats) setStats(sData.stats);
      }

      // 3. Fetch FoF suggestions
      const suggRes = await fetch('/api/suggestions?limit=6');
      if (sResOk(suggRes)) {
        const suggData = await suggRes.json();
        setSuggestions(suggData.suggestions || []);
      }

      // 4. Fetch pending incoming connections
      const connRes = await fetch('/api/connections?status=pending');
      if (connRes.ok) {
        const connData = await connRes.json();
        const incoming = (connData.connections || []).filter(
          (c: any) => c.direction === 'incoming'
        );
        setPendingRequests(incoming);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sResOk = (res: Response) => res.ok;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAcceptConnection = async (id: number) => {
    try {
      const res = await fetch(`/api/connections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      if (res.ok) {
        setPendingRequests(pendingRequests.filter((c) => c.connection_id !== id));
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  const handleRejectConnection = async (id: number) => {
    try {
      const res = await fetch(`/api/connections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });
      if (res.ok) {
        setPendingRequests(pendingRequests.filter((c) => c.connection_id !== id));
      }
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-900/40 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-cyan-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hybrid Graph Engine Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome back, {currentUser?.full_name || 'Professional'}!
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Traverse the professional network graph to discover explainable warm introduction pathways.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/pathfinder"
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition hover:scale-105 text-sm"
            >
              <Compass className="w-4 h-4" />
              Find Warm Path
            </a>
            <a
              href="/search"
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold px-4 py-3 rounded-xl border border-slate-700 transition text-sm"
            >
              <Search className="w-4 h-4" />
              Explore Network
            </a>
          </div>
        </div>
      </div>

      {/* Network Stats View Widgets */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Live Network Analytics
          </h2>
          <span className="text-xs text-slate-400">PostgreSQL View: <code>v_network_analytics</code></span>
        </div>
        <NetworkStats stats={stats} />
      </section>

      {/* Pending Connection Requests (if any) */}
      {pendingRequests.length > 0 && (
        <section className="bg-amber-950/20 border border-amber-900/40 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Connection Requests ({pendingRequests.length})
            </h3>
            <span className="text-xs text-amber-400/80">Triggers automated audit log upon accept</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((conn) => (
              <ConnectionCard
                key={conn.connection_id}
                connection={conn}
                onAccept={handleAcceptConnection}
                onReject={handleRejectConnection}
              />
            ))}
          </div>
        </section>
      )}

      {/* FoF Graph Recommendations */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              People You May Know
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Graph-aggregated Friend-of-Friend (FoF) recommendations ranked by mutual connection count
            </p>
          </div>
          <a
            href="/suggestions"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {suggestions.slice(0, 6).map((sugg) => (
            <ProfileCard
              key={sugg.userId}
              user={{
                id: sugg.userId,
                full_name: sugg.name,
                headline: sugg.headline,
                location: sugg.location,
                avatar_url: sugg.avatarUrl,
                currentRoles: sugg.currentRoles,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
