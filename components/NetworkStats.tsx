'use client';

import React from 'react';
import { Users, Share2, Building, Award, TrendingUp, ShieldCheck } from 'lucide-react';

interface NetworkStatsProps {
  stats: {
    activeUsers: number;
    totalConnections: number;
    totalCompanies: number;
    totalSkills: number;
    avgConnectionsPerUser: number;
  };
}

export default function NetworkStats({ stats }: NetworkStatsProps) {
  const cards = [
    {
      title: 'Active Professionals',
      value: stats.activeUsers.toLocaleString(),
      subtitle: 'Verified 3NF PostgreSQL records',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-cyan-400',
    },
    {
      title: 'Graph Relationships',
      value: stats.totalConnections.toLocaleString(),
      subtitle: 'Neo4j :KNOWS edges',
      icon: Share2,
      color: 'from-cyan-500 to-teal-500',
      textColor: 'text-teal-400',
    },
    {
      title: 'Avg Connections / User',
      value: stats.avgConnectionsPerUser.toFixed(1),
      subtitle: 'Calculated via SQL View',
      icon: TrendingUp,
      color: 'from-indigo-500 to-blue-500',
      textColor: 'text-indigo-400',
    },
    {
      title: 'Companies & Sectors',
      value: stats.totalCompanies.toLocaleString(),
      subtitle: 'Relational hierarchy mapping',
      icon: Building,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-pink-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <span className={`text-2xl font-black ${card.textColor}`}>
                {card.value}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
