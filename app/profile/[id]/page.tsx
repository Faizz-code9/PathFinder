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
  Pencil,
  Plus,
  Trash2,
  X,
  Check,
} from 'lucide-react';

export default function ProfileDetailPage() {
  const params = useParams();
  const userId = params?.id;

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [mutuals, setMutuals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connectSent, setConnectSent] = useState(false);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'experience'>('info');
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [allCompanies, setAllCompanies] = useState<any[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: '',
    headline: '',
    location: '',
    bio: '',
    avatarUrl: '',
    linkedinUrl: '',
    selectedSkillIds: [] as number[],
  });

  const [newExpForm, setNewExpForm] = useState({
    companyId: 1,
    title: '',
    startDate: '2023-01-01',
    isCurrent: true,
  });

  const loadProfile = async () => {
    if (!userId) return;
    try {
      // 1. Current logged-in user
      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      // 2. Profile user details
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const uData = await res.json();
        setData(uData);
        if (uData.connection?.status === 'pending') {
          setConnectSent(true);
        }

        // Initialize edit form
        setEditForm({
          fullName: uData.user.full_name || '',
          headline: uData.user.headline || '',
          location: uData.user.location || '',
          bio: uData.user.bio || '',
          avatarUrl: uData.user.avatar_url || '',
          linkedinUrl: uData.user.linkedin_url || '',
          selectedSkillIds: (uData.skills || []).map((s: any) => Number(s.id)),
        });
      }

      // 3. Mutual connections
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
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  // Load skills & companies when opening edit modal
  useEffect(() => {
    if (isEditing) {
      async function loadOptions() {
        try {
          const [skillsRes, compRes] = await Promise.all([
            fetch('/api/skills'),
            fetch('/api/companies'),
          ]);
          if (skillsRes.ok) {
            const sData = await skillsRes.json();
            setAllSkills(sData.skills || []);
          }
          if (compRes.ok) {
            const cData = await compRes.json();
            setAllCompanies(cData.companies || []);
            if (cData.companies?.length > 0) {
              setNewExpForm((prev) => ({ ...prev, companyId: cData.companies[0].id }));
            }
          }
        } catch (err) {
          console.error('Error loading edit options:', err);
        }
      }
      loadOptions();
    }
  }, [isEditing]);

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

  const handleToggleSkill = (skillId: number) => {
    setEditForm((prev) => {
      const exists = prev.selectedSkillIds.includes(skillId);
      const nextSkills = exists
        ? prev.selectedSkillIds.filter((id) => id !== skillId)
        : [...prev.selectedSkillIds, skillId];
      return { ...prev, selectedSkillIds: nextSkills };
    });
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const payload: any = {
        fullName: editForm.fullName,
        headline: editForm.headline,
        location: editForm.location,
        bio: editForm.bio,
        avatarUrl: editForm.avatarUrl,
        linkedinUrl: editForm.linkedinUrl,
        skills: editForm.selectedSkillIds,
      };

      if (newExpForm.title.trim()) {
        payload.newExperience = {
          companyId: Number(newExpForm.companyId),
          title: newExpForm.title.trim(),
          startDate: newExpForm.startDate,
          isCurrent: newExpForm.isCurrent,
        };
      }

      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await loadProfile();
        setIsEditing(false);
        setNewExpForm({ companyId: allCompanies[0]?.id || 1, title: '', startDate: '2023-01-01', isCurrent: true });
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteExperience = async (expId: number) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteExperienceId: expId }),
      });
      if (res.ok) {
        await loadProfile();
      }
    } catch (err) {
      console.error('Delete experience error:', err);
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
  const isSelf = currentUser && (Number(currentUser.userId) === Number(userId) || currentUser.role === 'admin');

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

          {/* Action Buttons: If Self -> Show Edit Button; If Other -> Show Connect & Warm Path */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {isSelf ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-cyan-500/20 text-xs transition hover:scale-105"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile & Skills
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Affinity Metric (for others) or Status Note (for self) */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          {isSelf ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Your Personal Professional Profile</p>
                <p className="text-[11px] text-slate-400">
                  Update your employment history and technical skills to improve graph pathfinding and affinity matching.
                </p>
              </div>
            </div>
          ) : (
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
          )}

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
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                About
              </h3>
              {isSelf && (
                <button
                  onClick={() => {
                    setActiveTab('info');
                    setIsEditing(true);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit Bio
                </button>
              )}
            </div>
            {user.bio ? (
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {user.bio}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic">
                {isSelf ? 'Click "Edit Profile" to add an introduction bio.' : 'No biography provided yet.'}
              </p>
            )}
          </div>

          {/* Experience Timeline */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                Career History & Employment Experiences
              </h3>
              {isSelf && (
                <button
                  onClick={() => {
                    setActiveTab('experience');
                    setIsEditing(true);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </button>
              )}
            </div>

            {experiences.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center">
                <p className="text-xs text-slate-400">No career history recorded yet.</p>
                {isSelf && (
                  <button
                    onClick={() => {
                      setActiveTab('experience');
                      setIsEditing(true);
                    }}
                    className="mt-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    + Add your first role
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6 border-l-2 border-slate-800 pl-4 ml-2">
                {experiences.map((exp: any) => (
                  <div key={exp.id} className="relative group flex items-start justify-between gap-4">
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

                    {isSelf && (
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        title="Delete experience"
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 transition rounded-lg hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                Verified Skills
              </h3>
              {isSelf && (
                <button
                  onClick={() => {
                    setActiveTab('skills');
                    setIsEditing(true);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>

            {skills.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center">
                <p className="text-xs text-slate-400">No skills attached yet.</p>
                {isSelf && (
                  <button
                    onClick={() => {
                      setActiveTab('skills');
                      setIsEditing(true);
                    }}
                    className="mt-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    + Select your skills
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((s: any) => (
                  <span
                    key={s.id}
                    className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 shadow-sm"
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
                {mutuals.map((m: any, idx: number) => {
                  const mUserId =
                    typeof m.userId === 'object' && m.userId !== null && 'low' in m.userId
                      ? String(m.userId.low)
                      : String(m.userId || `mutual-${idx}`);

                  return (
                    <a
                      key={mUserId}
                      href={`/profile/${mUserId}`}
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* EDIT PROFILE MODAL (Dual-Write PostgreSQL + Neo4j)        */}
      {/* ======================================================== */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-cyan-400" />
                  Edit Profile & Portfolio
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Changes synchronize across PostgreSQL relational tables and Neo4j graph nodes.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 px-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
                  activeTab === 'info'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Basic Info
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
                  activeTab === 'skills'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Technical Skills ({editForm.selectedSkillIds.length})
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
                  activeTab === 'experience'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Add Experience
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        placeholder="e.g. San Francisco, CA"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={editForm.headline}
                      onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                      placeholder="e.g. Staff Distributed Systems Engineer"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      About / Bio
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell the network about your engineering focus, interests, and background..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Avatar Image URL
                      </label>
                      <input
                        type="text"
                        value={editForm.avatarUrl}
                        onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Portfolio / LinkedIn URL
                      </label>
                      <input
                        type="text"
                        value={editForm.linkedinUrl}
                        onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Click skills to attach them to your profile. Shared skills automatically increase your connection affinity with peers.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {allSkills.map((s) => {
                      const isSelected = editForm.selectedSkillIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleToggleSkill(s.id)}
                          className={`text-xs font-medium px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-inner'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-cyan-400" /> Add New Role
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Company</label>
                        <select
                          value={newExpForm.companyId}
                          onChange={(e) => setNewExpForm({ ...newExpForm, companyId: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                        >
                          {allCompanies.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={newExpForm.title}
                          onChange={(e) => setNewExpForm({ ...newExpForm, title: e.target.value })}
                          placeholder="e.g. Senior Software Engineer"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={newExpForm.startDate}
                          onChange={(e) => setNewExpForm({ ...newExpForm, startDate: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                        />
                      </div>
                      <label className="flex items-center gap-2 mt-4 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newExpForm.isCurrent}
                          onChange={(e) => setNewExpForm({ ...newExpForm, isCurrent: e.target.checked })}
                          className="rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-0"
                        />
                        Currently working here
                      </label>
                    </div>
                  </div>

                  {/* Current Experiences List with delete option */}
                  {experiences.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Existing Experiences ({experiences.length})
                      </p>
                      <div className="space-y-2">
                        {experiences.map((exp: any) => (
                          <div
                            key={exp.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                          >
                            <div>
                              <p className="font-bold text-white">{exp.title}</p>
                              <p className="text-slate-400">{exp.company_name}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-950/40 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                PostgreSQL 3NF + Neo4j Dual-Write
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saveLoading}
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
                >
                  {saveLoading ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
