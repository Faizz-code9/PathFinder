'use client';

import React, { useState } from 'react';
import { UserPlus, Check, Sparkles, MapPin, Briefcase } from 'lucide-react';

interface ProfileCardProps {
  user: {
    id: number;
    full_name: string;
    headline?: string;
    location?: string;
    avatar_url?: string;
    skills?: any[];
    experiences?: any[];
    currentRoles?: any[];
  };
  onConnect?: (userId: number) => void;
  showConnectButton?: boolean;
}

export default function ProfileCard({
  user,
  onConnect,
  showConnectButton = true,
}: ProfileCardProps) {
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (requestSent || loading) return;

    setLoading(true);
    try {
      if (onConnect) {
        onConnect(user.id);
        setRequestSent(true);
      } else {
        const res = await fetch('/api/connections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverId: user.id,
            relType: 'colleague',
            message: 'I would like to connect on PathFinder.',
          }),
        });
        if (res.ok) {
          setRequestSent(true);
        }
      }
    } catch (err) {
      console.error('Connect failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const skillsList = Array.isArray(user.skills)
    ? user.skills.slice(0, 3)
    : [];

  return (
    <div className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition duration-200 flex flex-col justify-between shadow-lg shadow-black/20">
      <div>
        {/* Header with Avatar & Name */}
        <div className="flex items-start gap-4">
          <img
            src={
              user.avatar_url ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
            }
            alt={user.full_name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-800 group-hover:border-cyan-500/50 transition shadow-md"
          />
          <div className="flex-1 min-w-0">
            <a
              href={`/profile/${user.id}`}
              className="text-base font-bold text-white hover:text-cyan-400 transition truncate block"
            >
              {user.full_name}
            </a>
            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
              {user.headline || 'Professional on PathFinder'}
            </p>
            {user.location && (
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {user.location}
              </p>
            )}
          </div>
        </div>

        {/* Skills Preview */}
        {skillsList.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skillsList.map((skill: any, idx: number) => {
              const name = typeof skill === 'string' ? skill : skill.name;
              return (
                <span
                  key={idx}
                  className="text-[10px] font-medium bg-slate-800/80 text-cyan-300 border border-slate-700/60 px-2 py-0.5 rounded-md"
                >
                  {name}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <a
          href={`/pathfinder?targetId=${user.id}`}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-cyan-950/30 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Find Path
        </a>

        {showConnectButton && (
          <button
            onClick={handleConnect}
            disabled={requestSent || loading}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              requestSent
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 cursor-default'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
            }`}
          >
            {requestSent ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Sent
              </>
            ) : loading ? (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                Connect
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
