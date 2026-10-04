'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  TrendingUp,
  Building,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import NetworkStats from '@/components/NetworkStats';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const sData = await res.json();
          setData(sData);
        }
      } catch (err) {
        console.error('Admin stats error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 text-purple-300 text-xs font-semibold mb-3 border border-purple-800">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Administrator Control Hub • Role-Based Authorization</span>
          </div>
          <h1 className="text-3xl font-black text-white">System Analytics & Infrastructure</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time telemetry aggregated from PostgreSQL views, database triggers, and Neo4j graph centrality.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/admin/users"
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 transition flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" /> Manage Users & Audit Logs
          </a>
        </div>
      </div>

      {/* Analytical View Stats Cards */}
      {data?.stats && <NetworkStats stats={data.stats} />}

      {/* Main Grid: Graph Centrality Leaders & Industry Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Influencers (Degree Centrality from Neo4j) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Graph Degree Centrality Leaders
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Computed via Neo4j node degree aggregation query
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 border border-cyan-800 px-2.5 py-1 rounded-lg">
              Cypher: COUNT(neighbor)
            </span>
          </div>

          <div className="space-y-3">
            {(data?.topInfluencers || []).map((inf: any, idx: number) => (
              <div
                key={inf.userId}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold">
                    #{idx + 1}
                  </span>
                  <div>
                    <a
                      href={`/profile/${inf.userId}`}
                      className="text-sm font-bold text-white hover:text-cyan-400 transition"
                    >
                      {inf.name}
                    </a>
                    <p className="text-xs text-slate-400 line-clamp-1">{inf.headline}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-cyan-400">
                    {inf.connectionCount}
                  </span>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Connections</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Distribution View */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-400" />
                Industry Distribution View
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated via PostgreSQL View: <code className="text-purple-300">v_industry_distribution</code>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {(data?.industryDistribution || []).map((ind: any) => (
              <div
                key={ind.industry_id}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{ind.industry_name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {ind.company_count} registered enterprise{ind.company_count === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-purple-400">
                    {ind.professional_count}
                  </span>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Members</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
