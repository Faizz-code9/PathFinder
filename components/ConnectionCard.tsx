'use client';

import React from 'react';
import { Check, X, Trash2, MapPin, Sparkles, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface ConnectionCardProps {
  connection: {
    connection_id: number;
    partner_id: number;
    partner_name: string;
    partner_headline?: string;
    partner_location?: string;
    partner_avatar?: string;
    rel_type: string;
    status: 'pending' | 'accepted' | 'rejected';
    direction: 'incoming' | 'outgoing';
    created_at: string;
  };
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onRemove?: (id: number) => void;
  loading?: boolean;
}

export default function ConnectionCard({
  connection,
  onAccept,
  onReject,
  onRemove,
  loading = false,
}: ConnectionCardProps) {
  const isPending = connection.status === 'pending';
  const isIncoming = connection.direction === 'incoming';
  const isAccepted = connection.status === 'accepted';

  return (
    <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
      <div className="flex items-start gap-4">
        <img
          src={
            connection.partner_avatar ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
          }
          alt={connection.partner_name}
          className="w-13 h-13 rounded-2xl object-cover border border-slate-700"
        />
        <div>
          <div className="flex items-center gap-2">
            <a
              href={`/profile/${connection.partner_id}`}
              className="font-bold text-white hover:text-cyan-400 transition"
            >
              {connection.partner_name}
            </a>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {connection.rel_type}
            </span>
            {isPending && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
            {connection.partner_headline || 'Professional'}
          </p>
          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
            {connection.partner_location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {connection.partner_location}
              </span>
            )}
            <span className="flex items-center gap-1">
              {isIncoming ? (
                <>
                  <ArrowDownLeft className="w-3 h-3 text-cyan-400" /> Received Request
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-3 h-3 text-blue-400" /> Sent Request
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 self-end sm:self-center">
        {isAccepted && (
          <>
            <a
              href={`/pathfinder?targetId=${connection.partner_id}`}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Traverse
            </a>
            <button
              onClick={() => onRemove && onRemove(connection.connection_id)}
              disabled={loading}
              title="Remove Connection"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}

        {isPending && isIncoming && (
          <>
            <button
              onClick={() => onAccept && onAccept(connection.connection_id)}
              disabled={loading}
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
            >
              <Check className="w-3.5 h-3.5" />
              Accept
            </button>
            <button
              onClick={() => onReject && onReject(connection.connection_id)}
              disabled={loading}
              className="text-xs font-semibold bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-800/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <X className="w-3.5 h-3.5" />
              Decline
            </button>
          </>
        )}

        {isPending && !isIncoming && (
          <button
            onClick={() => onRemove && onRemove(connection.connection_id)}
            disabled={loading}
            className="text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition"
          >
            Cancel Request
          </button>
        )}
      </div>
    </div>
  );
}
