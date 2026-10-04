'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, Building, Award, Users } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ProfileCard from '@/components/ProfileCard';

export default function SearchPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (selectedSkill) params.append('skill', selectedSkill);
      if (selectedCompany) params.append('company', selectedCompany);
      params.append('limit', '50');

      const res = await fetch(`/api/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query, selectedSkill, selectedCompany]);

  const popularSkills = [
    'PostgreSQL',
    'Neo4j & Cypher',
    'Distributed Systems',
    'Machine Learning & LLMs',
    'TypeScript',
    'Next.js & React',
    'System Design',
    'Cloud Architecture (GCP/AWS)',
  ];

  const popularCompanies = [
    'Google',
    'OpenAI',
    'Stripe',
    'Snowflake',
    'Databricks',
    'Meta',
    'Apple',
    'Netflix',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 text-purple-300 text-xs font-semibold mb-3 border border-purple-800">
          <Search className="w-3.5 h-3.5" />
          <span>PostgreSQL GIN Full-Text Index (idx_profiles_fts)</span>
        </div>
        <h1 className="text-3xl font-black text-white">Full-Text Directory Search</h1>
        <p className="text-sm text-slate-400 mt-1">
          Lexical matching across candidate names, professional headlines, and biographies ranked by <code className="text-purple-300">ts_rank</code>.
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={setQuery} placeholder="Search by name, headline, or keyword (e.g. Distributed Consensus, Spanner, Graph ML)..." />

      {/* Filters */}
      <div className="space-y-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        {/* Skills Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-cyan-400" /> Skills:
          </span>
          <button
            onClick={() => setSelectedSkill('')}
            className={`text-xs px-3 py-1 rounded-lg border transition ${
              !selectedSkill
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All Skills
          </button>
          {popularSkills.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSkill(selectedSkill === s ? '' : s)}
              className={`text-xs px-3 py-1 rounded-lg border transition ${
                selectedSkill === s
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Company Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-blue-400" /> Employers:
          </span>
          <button
            onClick={() => setSelectedCompany('')}
            className={`text-xs px-3 py-1 rounded-lg border transition ${
              !selectedCompany
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All Companies
          </button>
          {popularCompanies.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCompany(selectedCompany === c ? '' : c)}
              className={`text-xs px-3 py-1 rounded-lg border transition ${
                selectedCompany === c
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-400">
            Found <strong className="text-white">{users.length}</strong> matching candidate{users.length === 1 ? '' : 's'}
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Executing inverted GIN full-text index scan...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No professionals match your query</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or clearing the active filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => (
              <ProfileCard key={u.id} user={u} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
