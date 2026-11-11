import React from 'react';
import {
  Compass,
  ArrowRight,
  Shield,
  Zap,
  Layers,
  Search,
  Lock,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/15 to-purple-600/15 blur-3xl -z-10 pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
          Turn Cold Outreach Into <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Warm Introduction Intelligence
          </span>
        </h1>

        <p className="max-w-3xl mx-auto mt-6 text-base sm:text-lg text-slate-400 leading-relaxed">
          PathFinder bridges <strong className="text-white">PostgreSQL 16</strong> for ACID compliance, 3NF schema, and full-text GIN search with <strong className="text-white">Neo4j 5</strong> for sub-millisecond multi-hop graph pathfinding and friend-of-friend discovery.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/pathfinder"
            className="flex items-center gap-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-7 py-3.5 rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition duration-200"
          >
            <Compass className="w-5 h-5" />
            Launch Visual PathFinder
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/login"
            className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-3.5 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition"
          >
            Sign In with Demo Account
          </a>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Enterprise DBMS Feature Suite
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            PathFinder implements 7 advanced database capabilities across relational and graph engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Visual Shortest Path</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Interactive 2D physics canvas visualizing multi-hop connection chains with contextual introduction notes.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Dual-Write Distributed Sync</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              PostgreSQL acts as transactional source of truth with idempotent Cypher <code className="text-cyan-300">MERGE</code> sync and rollback protection.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">GIN Full-Text Search</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Inverted Generalized Search Tree on <code className="text-purple-300">to_tsvector</code> for instant lexical search with <code className="text-purple-300">ts_rank</code>.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Database Triggers & Audit</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              PostgreSQL <code className="text-emerald-300">trg_connection_audit</code> automatically captures connection transitions into an immutable audit table.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Analytical SQL Views</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              <code className="text-amber-300">v_network_analytics</code> and <code className="text-amber-300">v_user_connections</code> aggregate real-time network health metrics.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Role-Based Access (RBAC)</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Stateless JWT bearer tokens enforcing strict User vs Administrator privileges with route middleware protection.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
