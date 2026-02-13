import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import * as api from '../services/api';
import useAuth from '../hooks/useAuth';
import {
    ChartBarIcon,
    TrashIcon,
    PencilSquareIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ArrowTrendingUpIcon,
    XMarkIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';

const levelLabels = ['', 'Novice', 'Elementary', 'Intermediate', 'Advanced', 'Master'];
const levelEmojis = ['', '🌱', '📖', '⚡', '🔥', '👑'];

const MySkills = () => {
    const { user } = useAuth();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', category: '', level: 1, score: 0 });
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const { data } = await api.getSkills();
            setSkills(data);
        } catch (err) {
            setError('Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSkill = async (id) => {
        if (window.confirm('Delete this skill permanently?')) {
            try {
                await api.deleteSkill(id);
                setSkills(skills.filter(s => s._id !== id));
            } catch (err) {
                setError('Failed to delete skill');
            }
        }
    };

    const handleEditStart = (skill) => {
        setEditingId(skill._id);
        setEditData({ name: skill.name, category: skill.category, level: skill.level, score: skill.score });
    };

    const handleEditSave = async (id) => {
        try {
            const { data } = await api.updateSkill(id, editData);
            setSkills(skills.map(s => s._id === id ? data : s));
            setEditingId(null);
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update skill';
            setError(message);
        }
    };

    const handleEditCancel = () => {
        setEditingId(null);
    };

    // Filters and sorting
    const categories = ['All', ...new Set(skills.map(s => s.category))];

    const filteredSkills = skills
        .filter(s => filterCategory === 'All' || s.category === filterCategory)
        .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'score') return b.score - a.score;
            if (sortBy === 'level') return b.level - a.level;
            return 0;
        });

    // Stats
    const avgScore = skills.length > 0 ? (skills.reduce((a, c) => a + c.score, 0) / skills.length).toFixed(1) : 0;
    const highestSkill = skills.length > 0 ? skills.reduce((a, b) => a.score > b.score ? a : b) : null;
    const lowestSkill = skills.length > 0 ? skills.reduce((a, b) => a.score < b.score ? a : b) : null;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-cyan-400';
        if (score >= 40) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-emerald-500';
        if (score >= 60) return 'bg-cyan-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Radar chart data for skill balance
    const radarData = skills.map(s => ({
        name: s.name.length > 10 ? s.name.substring(0, 10) + '...' : s.name,
        score: s.score,
        target: 85
    }));

    // Gap analysis data
    const gapData = skills.map(s => ({
        name: s.name.length > 12 ? s.name.substring(0, 12) + '...' : s.name,
        current: s.score,
        gap: Math.max(85 - s.score, 0)
    }));

    if (loading) {
        return (
            <div className="flex h-screen bg-slate-900 text-slate-100 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-6 md:p-12">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                                My Skills
                            </h1>
                            <p className="text-slate-400 mt-1">Track, manage, and grow your skillset</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50">
                            <p className="text-slate-400 text-sm mb-1">Total Skills</p>
                            <p className="text-2xl font-bold text-white">{skills.length}</p>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50">
                            <p className="text-slate-400 text-sm mb-1">Average Score</p>
                            <p className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}%</p>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50">
                            <p className="text-slate-400 text-sm mb-1">Strongest Skill</p>
                            <p className="text-lg font-bold text-emerald-400 truncate">{highestSkill?.name || '—'}</p>
                            <p className="text-xs text-slate-500">{highestSkill ? `${highestSkill.score}%` : ''}</p>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50">
                            <p className="text-slate-400 text-sm mb-1">Needs Improvement</p>
                            <p className="text-lg font-bold text-red-400 truncate">{lowestSkill?.name || '—'}</p>
                            <p className="text-xs text-slate-500">{lowestSkill ? `${lowestSkill.score}%` : ''}</p>
                        </div>
                    </div>

                    {/* Charts Row */}
                    {skills.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Skill Gap Analysis */}
                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                                <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                                    <span className="w-2 h-5 bg-cyan-500 rounded-full"></span>
                                    Skill Gap Analysis
                                </h2>
                                <p className="text-xs text-slate-500 mb-4">Target benchmark: 85% (Industry Standard)</p>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={gapData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                            <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                                            <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={90} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                                itemStyle={{ color: '#bae6fd' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="current" stackId="a" fill="#06b6d4" name="Your Score" radius={[0, 0, 0, 0]} />
                                            <Bar dataKey="gap" stackId="a" fill="#334155" name="Gap to Target" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Radar */}
                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                                <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                                    <span className="w-2 h-5 bg-purple-500 rounded-full"></span>
                                    Skill Balance Overview
                                </h2>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                            <PolarGrid stroke="#334155" />
                                            <PolarAngleAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                                            <Radar name="Your Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                                            <Radar name="Target (85)" dataKey="target" stroke="#475569" fill="none" strokeDasharray="5 5" />
                                            <Legend />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search, Filter & Sort Bar */}
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 mb-6 flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search skills..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="w-4 h-4 text-slate-500" />
                            <div className="flex gap-1.5 flex-wrap">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilterCategory(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCategory === cat
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <select
                            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-sm focus:outline-none"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="score">Sort by Score</option>
                            <option value="level">Sort by Level</option>
                        </select>
                    </div>

                    {/* Skill Cards Grid */}
                    {filteredSkills.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredSkills.map(skill => (
                                <div
                                    key={skill._id}
                                    className="bg-slate-800/60 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 transition-all group overflow-hidden"
                                >
                                    {/* Score bar at top */}
                                    <div className="h-1.5 bg-slate-700">
                                        <div
                                            className={`h-full ${getScoreBg(skill.score)} transition-all duration-500`}
                                            style={{ width: `${skill.score}%` }}
                                        ></div>
                                    </div>

                                    <div className="p-5">
                                        {editingId === skill._id ? (
                                            /* Edit Mode */
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                                    value={editData.name}
                                                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                />
                                                <select
                                                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm focus:outline-none"
                                                    value={editData.category}
                                                    onChange={e => setEditData({ ...editData, category: e.target.value })}
                                                >
                                                    <option value="Technical">Technical</option>
                                                    <option value="Soft Skill">Soft Skill</option>
                                                    <option value="Language">Language</option>
                                                    <option value="Tool">Tool</option>
                                                </select>
                                                <div>
                                                    <label className="text-xs text-slate-500">Score: {editData.score}%</label>
                                                    <input
                                                        type="range" min="0" max="100"
                                                        className="w-full accent-cyan-500"
                                                        value={editData.score}
                                                        onChange={e => setEditData({ ...editData, score: Number(e.target.value) })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500">Level</label>
                                                    <div className="flex gap-1 mt-1">
                                                        {[1, 2, 3, 4, 5].map(l => (
                                                            <button
                                                                key={l}
                                                                type="button"
                                                                onClick={() => setEditData({ ...editData, level: l })}
                                                                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${editData.level === l
                                                                    ? 'bg-cyan-500 text-white'
                                                                    : 'bg-slate-700 text-slate-400'
                                                                    }`}
                                                            >
                                                                {l}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-1">
                                                    <button
                                                        onClick={() => handleEditSave(skill._id)}
                                                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-all"
                                                    >
                                                        <CheckIcon className="w-4 h-4" /> Save
                                                    </button>
                                                    <button
                                                        onClick={handleEditCancel}
                                                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition-all"
                                                    >
                                                        <XMarkIcon className="w-4 h-4" /> Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* View Mode */
                                            <>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                                                            {skill.name}
                                                        </h3>
                                                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-700/50 rounded-full text-xs text-slate-400 border border-slate-600/50">
                                                            {skill.category}
                                                        </span>
                                                    </div>
                                                    <span className={`text-2xl font-bold ${getScoreColor(skill.score)}`}>
                                                        {skill.score}%
                                                    </span>
                                                </div>

                                                {/* Progress bar */}
                                                <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                                                    <div
                                                        className={`h-2 rounded-full ${getScoreBg(skill.score)} transition-all duration-500`}
                                                        style={{ width: `${skill.score}%` }}
                                                    ></div>
                                                </div>

                                                {/* Level */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{levelEmojis[skill.level]}</span>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-300">{levelLabels[skill.level]}</p>
                                                            <p className="text-[10px] text-slate-500">Level {skill.level} of 5</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <div
                                                                key={i}
                                                                className={`w-2 h-4 rounded-sm ${i <= skill.level ? getScoreBg(skill.score) : 'bg-slate-700'
                                                                    }`}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-2 border-t border-slate-700/50">
                                                    <button
                                                        onClick={() => handleEditStart(skill)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg text-xs font-medium transition-all"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSkill(skill._id)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-medium transition-all"
                                                    >
                                                        <TrashIcon className="w-4 h-4" /> Delete
                                                    </button>
                                                    <a
                                                        href={`https://www.coursera.org/search?query=${encodeURIComponent(skill.name)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg text-xs font-medium transition-all"
                                                    >
                                                        <ArrowTrendingUpIcon className="w-4 h-4" /> Learn
                                                    </a>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-800/50 p-12 rounded-2xl border border-slate-700/50 text-center">
                            <ChartBarIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-400 mb-2">No skills found</h3>
                            <p className="text-slate-500">
                                {searchTerm || filterCategory !== 'All'
                                    ? 'Try changing your search or filter.'
                                    : 'Head to the Dashboard to add your first skill!'
                                }
                            </p>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default MySkills;
