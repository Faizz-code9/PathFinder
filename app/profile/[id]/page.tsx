'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  User,
  Briefcase,
  MapPin,
  ExternalLink,
  Sparkles,
  Award,
  Users,
  CheckCircle,
  Building,
  Calendar,
  Zap,
} from 'lucide-react';

export default function ProfileDetailPage() {
  const params = useParams();
  const userId = params?.id;

  const [data, setData] = useState<any>(null);
  const [mutuals, setMutuals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connectSent, setConnectSent] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const uData = await res.json();
          setData(uData);
          if (uData.connection?.status === 'pending') {
            setConnectSent(true);
          }
        }

        const mutRes = await fetch(`/api/connections/mutual?targetId=${userId}`);
        if (mutRes.ok) {
          const mData = await mutRes.json();
          setMutuals(mData.mutualConnections || []);
        }
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [userId]);

  const handleSendConnect = async () => {
    if (connecting || connectSent) return;
    setConnecting(true);
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: Number(userId),
          relType: 'colleague',
          message: 'I would like to connect on PathFinder.',
        }),
      });
      if (res.ok) {
        setConnectSent(true);
      }
    } catch (err) {
      console.error('Connect failed:', err);
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center text-slate-400">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading normalized 3NF profile record...</p>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <h2 className="text-xl font-bold text-white">User not found</h2>
        <p className="text-xs text-slate-400 mt-1">This profile may have been deactivated or removed.</p>
      </div>
    );
  }

  const { user, experiences = [], skills = [], connectionStrength = 0.2 } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={
                user.avatar_url ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
              }
              alt={user.full_name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-slate-800 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.full_name}</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-950 text-cyan-300 border border-blue-800">
                  {user.role === 'admin' ? 'System Administrator' : 'Verified Member'}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1.5 max-w-xl font-medium">
                {user.headline || 'Professional on PathFinder'}
              </p>
              {user.location && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {user.location}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={`/pathfinder?targetId=${user.id}`}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-cyan-500/20 text-xs transition"
            >
              <Sparkles className="w-4 h-4" />
              Find Warm Path
            </a>

            <button
              onClick={handleSendConnect}
              disabled={connectSent || connecting || data.connection?.status === 'accepted'}
              className={`flex items-center justify-center gap-2 text-xs font-semibold px-5 py-3 rounded-xl border transition ${
                data.connection?.status === 'accepted'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 cursor-default'
                  : connectSent
                  ? 'bg-slate-800 text-slate-400 border-slate-700 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
              }`}
            >
              {data.connection?.status === 'accepted' ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Connected
                </>
              ) : connectSent ? (
                'Request Sent'
              ) : connecting ? (
                'Connecting...'
              ) : (
                'Send Connect Request'
              )}
            </button>
          </div>
        </div>

        {/* Stored Function Affinity Metric */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Relational Connection Affinity: {(connectionStrength * 100).toFixed(0)}%
              </p>
              <p className="text-[11px] text-slate-400">
                Calculated via PL/pgSQL function <code className="text-cyan-300">calculate_connection_strength()</code>
              </p>
            </div>
          </div>

          {user.linkedin_url && (
            <a
              href={user.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              External Portfolio <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Main Content: Bio, Experiences, Skills, Mutuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Bio & Experiences */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Bio */}
          {user.bio && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                About
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {user.bio}
              </p>
            </div>
          )}

          {/* Experience Timeline */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Career History & Employment Experiences
            </h3>

            {experiences.length === 0 ? (
              <p className="text-xs text-slate-500">No career experiences recorded.</p>
            ) : (
              <div className="space-y-6 border-l-2 border-slate-800 pl-4 ml-2">
                {experiences.map((exp: any) => (
                  <div key={exp.id} className="relative group">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-slate-950" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                      <p className="text-xs font-semibold text-cyan-400 mt-0.5">
                        {exp.company_name}{' '}
                        {exp.industry_name && (
                          <span className="text-slate-400 font-normal">
                            • {exp.industry_name}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {exp.start_date ? new Date(exp.start_date).getFullYear() : '2020'} —{' '}
                          {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).getFullYear() : '2023'}
                        </span>
                        {exp.company_location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {exp.company_location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Skills & Mutuals */}
        <div className="space-y-8">
          {/* Skills */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              Verified Skills
            </h3>

            {skills.length === 0 ? (
              <p className="text-xs text-slate-500">No skills attached.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((s: any) => (
                  <span
                    key={s.id}
                    className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mutual Connections */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Mutual Connections ({mutuals.length})
            </h3>

            {mutuals.length === 0 ? (
              <p className="text-xs text-slate-500">No mutual connections in graph.</p>
            ) : (
              <div className="space-y-3">
                {mutuals.map((m: any) => (
                  <a
                    key={m.userId}
                    href={`/profile/${m.userId}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition group"
                  >
                    <img
                      src={
                        m.avatarUrl ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                      }
                      alt={m.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-cyan-400 truncate">
                        {m.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {m.headline || 'Professional'}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
