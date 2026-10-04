'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Zap,
  TrendingUp,
  MapPin,
  Building,
  CheckCircle,
  AlertCircle,
  Users,
  ChevronRight,
  Share2,
} from 'lucide-react';
import PathGraph from '@/components/PathGraph';

function PathfinderContent() {
  const searchParams = useSearchParams();
  const initialTarget = searchParams.get('targetId') || '15'; // Default target: Noah Schmidt (15)

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [sourceId, setSourceId] = useState<number>(2); // Default source: Alice Chen (2)
  const [targetId, setTargetId] = useState<number>(Number(initialTarget) || 15);
  const [loading, setLoading] = useState(false);
  const [pathResult, setPathResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  // Subgraph for background network visualization
  const [subgraph, setSubgraph] = useState<{ nodes: any[]; links: any[] }>({
    nodes: [],
    links: [],
  });

  // 1. Fetch all users for dropdown selector
  useEffect(() => {
    async function loadData() {
      try {
        const usersRes = await fetch('/api/users?limit=60');
        if (usersRes.ok) {
          const uData = await usersRes.json();
          setAllUsers(uData.users || []);
        }

        const graphRes = await fetch('/api/graph/subgraph?limit=80');
        if (graphRes.ok) {
          const gData = await graphRes.json();
          setSubgraph(gData);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    }
    loadData();
  }, []);

  // 2. Execute PathFinder Traversal
  const findPath = async (sId?: number, tId?: number) => {
    const src = sId !== undefined ? sId : sourceId;
    const tgt = tId !== undefined ? tId : targetId;

    if (src === tgt) {
      setError('Source and target cannot be the same user.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/pathfinder?sourceId=${src}&targetId=${tgt}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Path calculation failed.');
        setPathResult(null);
      } else {
        setPathResult(data);
      }
    } catch (err) {
      setError('Failed to reach graph traversal engine.');
      setPathResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial auto-run
  useEffect(() => {
    if (sourceId && targetId && sourceId !== targetId) {
      findPath(sourceId, targetId);
    }
  }, []);

  const pathNodeIds = pathResult?.nodes ? pathResult.nodes.map((n: any) => Number(n.userId)) : [];

  // Merge path nodes with subgraph to give full context
  const combinedNodes = [...subgraph.nodes];
  if (pathResult?.nodes) {
    pathResult.nodes.forEach((pn: any) => {
      if (!combinedNodes.some((n) => Number(n.id) === Number(pn.userId))) {
        combinedNodes.push({
          id: Number(pn.userId),
          name: pn.name,
          headline: pn.headline,
          avatarUrl: pn.avatarUrl,
        });
      }
    });
  }

  const quickPresets = [
    { title: 'Alice → Noah (3 Hops)', s: 2, t: 15 },
    { title: 'Alice → Olivia (4 Hops)', s: 2, t: 16 },
    { title: 'Bob → Liam (4 Hops)', s: 3, t: 13 },
    { title: 'Carol → Victor (4 Hops)', s: 4, t: 23 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-3">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Neo4j Index-Free Adjacency Traversal Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Visual Warm-Path Finder
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Discover optimal multi-hop introduction pathways between any two professionals in the network graph with semantic affinity scoring.
        </p>
      </div>

      {/* Traversal Control Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Preset Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Demo Vectors:
          </span>
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSourceId(preset.s);
                setTargetId(preset.t);
                findPath(preset.s, preset.t);
              }}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition ${
                sourceId === preset.s && targetId === preset.t
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* User Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Source User */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
              ● Origin Person (Source)
            </label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl px-3.5 py-3 outline-none focus:border-cyan-500 transition"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.headline || u.email})
                </option>
              ))}
            </select>
          </div>

          {/* Arrow Divider */}
          <div className="md:col-span-2 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-inner">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Target User */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider">
              ● Target Professional
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl px-3.5 py-3 outline-none focus:border-cyan-500 transition"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.headline || u.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => findPath()}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition hover:scale-[1.01] disabled:opacity-50 text-sm"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Traversing Graph Adjacency Records...
            </span>
          ) : (
            <>
              <Zap className="w-4 h-4 text-cyan-200" />
              Calculate Shortest Warm Path (Cypher Traversal)
            </>
          )}
        </button>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Traversal Results & Interactive Visualizer */}
      {pathResult && (
        <div className="space-y-6">
          {/* Path Score Banner */}
          {pathResult.pathFound ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl">
                  {pathResult.degrees}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Degrees of Separation
                  </p>
                  <p className="text-lg font-bold text-white">
                    {pathResult.degrees} {pathResult.degrees === 1 ? 'Hop' : 'Hops'} Away
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xl">
                  {pathResult.overallWarmth}%
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Warmth Index Rating
                  </p>
                  <p className="text-lg font-bold text-emerald-300">
                    {pathResult.overallWarmth >= 70
                      ? 'High Affinity Pathway'
                      : 'Moderate Relationship'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-black text-xl">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Intermediaries
                  </p>
                  <p className="text-lg font-bold text-white">
                    {pathResult.nodes.length - 2} Mutual Contacts
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-900/60 text-amber-300 text-sm">
              <p className="font-bold">No path found within 6 degrees of separation.</p>
              <p className="text-xs text-amber-400/80 mt-1">
                Try connecting with more peers to expand your network reach.
              </p>
            </div>
          )}

          {/* Interactive HTML5 Canvas Graph */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                Live 2D Physics Graph Canvas
              </h3>
              <span className="text-xs text-slate-400">
                Active Path highlighted with animated photon particles
              </span>
            </div>
            <PathGraph
              nodes={combinedNodes}
              links={subgraph.links}
              pathNodeIds={pathNodeIds}
              height={520}
            />
          </div>

          {/* Explainable Introduction Blueprint */}
          {pathResult.hops && pathResult.hops.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Actionable Warm Introduction Blueprint
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Contextual annotations generated via PL/pgSQL stored procedure <code className="text-cyan-300">get_hop_context()</code>
                </p>
              </div>

              <div className="space-y-4">
                {pathResult.hops.map((hop: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-950 text-cyan-400 border border-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                        #{hop.hopIndex}
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={
                            hop.from.avatarUrl ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                          }
                          alt={hop.from.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <span className="font-bold text-white text-sm">{hop.from.name}</span>
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                        <img
                          src={
                            hop.to.avatarUrl ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                          }
                          alt={hop.to.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <span className="font-bold text-white text-sm">{hop.to.name}</span>
                      </div>
                    </div>

                    <div className="sm:text-right pl-12 sm:pl-0">
                      <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 mb-1">
                        {hop.context}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Strength Score: <strong className="text-slate-200">{hop.strength}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mathematical Proof callout */}
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-900/50 text-xs text-slate-300 flex items-start gap-3">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Algorithmic Efficiency Proof:</strong>
                  <p className="text-slate-400 mt-0.5">
                    This {pathResult.degrees}-hop shortest path traversal was executed natively by Neo4j's Index-Free Adjacency engine in constant memory time O(k). In contrast, executing this traversal in relational SQL would require evaluating multi-table recursive self-joins across millions of intermediate rows.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PathfinderPage() {
  return (
    <Suspense
      fallback={
        <div className="py-32 text-center text-slate-400">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading Visual PathFinder...</p>
        </div>
      }
    >
      <PathfinderContent />
    </Suspense>
  );
}
