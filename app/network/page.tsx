'use client';

import React, { useState, useEffect } from 'react';
import { Users, Clock, UserCheck, Search, Filter } from 'lucide-react';
import ConnectionCard from '@/components/ConnectionCard';

export default function NetworkPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'accepted' | 'pending'>('all');

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/connections');
      if (res.ok) {
        const data = await res.json();
        setConnections(data.connections || []);
      }
    } catch (err) {
      console.error('Fetch connections failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleAccept = async (id: number) => {
    try {
      const res = await fetch(`/api/connections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      if (res.ok) fetchConnections();
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch(`/api/connections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });
      if (res.ok) fetchConnections();
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const handleRemove = async (id: number) => {
    if (!confirm('Are you sure you want to remove this connection?')) return;
    try {
      const res = await fetch(`/api/connections/${id}`, { method: 'DELETE' });
      if (res.ok) fetchConnections();
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  const accepted = connections.filter((c) => c.status === 'accepted');
  const pendingIncoming = connections.filter(
    (c) => c.status === 'pending' && c.direction === 'incoming'
  );
  const pendingOutgoing = connections.filter(
    (c) => c.status === 'pending' && c.direction === 'outgoing'
  );

  const displayedList =
    activeTab === 'accepted'
      ? accepted
      : activeTab === 'pending'
      ? [...pendingIncoming, ...pendingOutgoing]
      : connections;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold mb-3 border border-blue-800">
          <Users className="w-3.5 h-3.5" />
          <span>PostgreSQL View: v_user_connections</span>
        </div>
        <h1 className="text-3xl font-black text-white">My Professional Network</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your verified direct connections and incoming connection requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`text-sm font-semibold px-4 py-2 rounded-xl transition ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          All ({connections.length})
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          className={`text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'accepted'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Active Connections ({accepted.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending ({pendingIncoming.length + pendingOutgoing.length})
        </button>
      </div>

      {/* Connections List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Querying database view records...</p>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No connections found in this view</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Discover professionals and build your network with warm introductions.
          </p>
          <a
            href="/search"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Search className="w-4 h-4" /> Search Professionals
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map((conn) => (
            <ConnectionCard
              key={conn.connection_id}
              connection={conn}
              onAccept={handleAccept}
              onReject={handleReject}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
