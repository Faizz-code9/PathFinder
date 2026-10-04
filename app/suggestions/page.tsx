'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Users, RefreshCw } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/suggestions?limit=24');
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (err) {
      console.error('Fetch suggestions error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-semibold mb-3 border border-cyan-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cypher: Friend-of-Friend (FoF) Graph Aggregation</span>
          </div>
          <h1 className="text-3xl font-black text-white">People You May Know</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Intelligent recommendations ranked by mutual connection intersection count in Neo4j and enriched with PostgreSQL career histories.
          </p>
        </div>

        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2.5 rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Graph
        </button>
      </div>

      {/* Suggestions Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Traversing 2-hop topological neighbors in Neo4j...</p>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No suggestions currently available</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try connecting with more people to expand your friend-of-friend network radius.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((sugg) => (
            <div key={sugg.userId} className="relative">
              {sugg.mutualCount > 0 && (
                <div className="absolute top-3 right-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 shadow-sm">
                  {sugg.mutualCount} mutual connection{sugg.mutualCount === 1 ? '' : 's'}
                </div>
              )}
              <ProfileCard
                user={{
                  id: sugg.userId,
                  full_name: sugg.name,
                  headline: sugg.headline,
                  location: sugg.location,
                  avatar_url: sugg.avatarUrl,
                  currentRoles: sugg.currentRoles,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
