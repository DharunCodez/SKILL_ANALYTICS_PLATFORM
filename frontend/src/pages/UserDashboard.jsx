import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import * as api from '../services/api';
import useAuth from '../hooks/useAuth';
import ChatModal from '../components/ChatModal';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    LineChart, Line
} from 'recharts';
import {
    ChartBarIcon,
    AcademicCapIcon,
    BoltIcon,
    TrashIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline'; // Using heroicons

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({ name: '', category: 'Technical', yearsOfExperience: 0, score: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [facultyObj, setFacultyObj] = useState(null);
    const [rankInfo, setRankInfo] = useState({ rank: '...', totalStudents: '...' });
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        fetchSkills();
        if (user?.assignedFaculty && user.role === 'learner') {
            fetchFacultyDetails();
            fetchRank();
        }
    }, [user]);

    const fetchFacultyDetails = async () => {
        try {
            const { data } = await api.getMyFaculty();
            if (data) setFacultyObj(data);
        } catch (err) {
            console.error("Failed to fetch assigned faculty details", err);
        }
    };

    const fetchRank = async () => {
        try {
            const { data } = await api.getRank();
            setRankInfo(data);
        } catch (err) {
            console.error("Failed to fetch rank", err);
        }
    };

    const fetchSkills = async () => {
        try {
            const { data } = await api.getSkills();
            setSkills(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.name || newSkill.score < 0 || newSkill.score > 100) return;

        try {
            const { data } = await api.createSkill(newSkill);
            setSkills([...skills, data]);
            setNewSkill({ name: '', category: 'Technical', yearsOfExperience: 0, score: 0 });
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to add skill';
            setError(message);
        }
    };

    const handleDeleteSkill = async (id) => {
        if (window.confirm('Delete this skill permanently?')) {
            try {
                await api.deleteSkill(id);
                setSkills(skills.filter(s => s._id !== id));
            } catch (err) {
                console.error(err);
                setError('Failed to delete skill. Please try again.');
            }
        }
    }

    // Skill Gap Analysis Logic
    const getSkillGap = () => {
        return skills.map(skill => ({
            name: skill.name,
            current: skill.score,
            target: 85, // Industry standard target
            gap: 85 - skill.score > 0 ? 85 - skill.score : 0
        }));
    };

    // Personalized Recommendations
    const getRecommendations = () => {
        return skills
            .filter(s => s.score < 70)
            .map(s => ({
                id: s._id,
                skill: s.name,
                course: `Advanced ${s.name} Masterclass`,
                provider: 'Coursera / Udemy',
                duration: '4 Weeks',
                courseraUrl: `https://www.coursera.org/search?query=${encodeURIComponent(s.name)}`,
                udemyUrl: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(s.name)}`
            }));
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-slate-100 overflow-hidden font-sans relative">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <Sidebar />

            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 relative z-10">
                {/* Mobile Navbar could go here if needed, keeping simple for now */}

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 md:p-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                                Welcome back, {user?.name}!
                            </h1>
                            <p className="text-slate-400 mt-1">Here is your skill performance overview.</p>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="bg-white/5 backdrop-blur-md hover:bg-white/10 text-cyan-400 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/20"
                        >
                            <DocumentArrowDownIcon className="w-5 h-5" />
                            <span>Download Report</span>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    {/* Stats Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] shadow-xl transition-all group transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-400 font-medium">Total Skills</h3>
                                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                    <ChartBarIcon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white">{skills.length}</p>
                            <p className="text-xs text-slate-400 mt-2">+2 this month</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] shadow-xl transition-all group transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-400 font-medium">Avg Score</h3>
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <AcademicCapIcon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white">
                                {skills.length > 0 ? (skills.reduce((acc, curr) => acc + curr.score, 0) / skills.length).toFixed(1) : 0}%
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                                {rankInfo.rank !== 'N/A' ? (
                                    <>Rank <span className="text-purple-400 font-bold">#{rankInfo.rank}</span> in class of {rankInfo.totalStudents}</>
                                ) : (
                                    <>Top 15% of peers</>
                                )}
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] shadow-xl transition-all group transform hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-400 font-medium">Pending Actions</h3>
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <BoltIcon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white">{getRecommendations().length}</p>
                            <p className="text-xs text-slate-400 mt-2">Recommended courses</p>
                        </div>
                    </div>

                    {/* Main Charts Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Skill Proficiency Bar Chart */}
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl hover:border-white/20 transition-all">
                            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
                                Skill Proficiency
                            </h2>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={skills}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                        <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                            itemStyle={{ color: '#bae6fd' }}
                                            cursor={{ fill: '#334155', opacity: 0.2 }}
                                        />
                                        <Bar dataKey="score" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Skill Gap Radar Chart */}
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl hover:border-white/20 transition-all">
                            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                                Skill Balance
                            </h2>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skills}>
                                        <PolarGrid stroke="#334155" />
                                        <PolarAngleAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                                        <Radar name="My Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                            itemStyle={{ color: '#e9d5ff' }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations & Add Skill */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Add Skill Form */}
                        <div className="lg:col-span-1 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl h-fit">
                            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                                Add New Skill
                            </h2>
                            
                            {/* Skill Evaluation Call-To-Action */}
                            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Not sure about your score?</h3>
                                        <p className="text-xs text-slate-400">Take a rapid test to evaluate your skill.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate('/assessment')}
                                    className="shrink-0 px-4 py-2 bg-slate-800 hover:bg-emerald-600 border border-emerald-500/30 text-white rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-emerald-500/20"
                                >
                                    Take Assessment
                                </button>
                            </div>

                            <form onSubmit={handleAddSkill} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Skill Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Node.js"
                                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 font-light text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                        value={newSkill.name}
                                        onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Category</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 font-light text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                                            value={newSkill.category}
                                            onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                                        >
                                            <option value="Technical">Technical</option>
                                            <option value="Soft Skill">Soft Skill</option>
                                            <option value="Language">Language</option>
                                            <option value="Tool">Tool</option>
                                        </select>
                                        <div className="absolute right-4 top-4 pointer-events-none">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Proficiency Score - Slider */}
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">
                                        Proficiency Score
                                        <span className="text-slate-500 ml-1">— How confident are you in this skill?</span>
                                    </label>
                                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-md ${newSkill.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                                                newSkill.score >= 60 ? 'bg-cyan-500/20 text-cyan-400' :
                                                    newSkill.score >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {newSkill.score >= 80 ? '🌟 Expert' :
                                                    newSkill.score >= 60 ? '🚀 Advanced' :
                                                        newSkill.score >= 40 ? '📚 Intermediate' :
                                                            '🌱 Beginner'}
                                            </span>
                                            <span className={`text-2xl font-bold ${newSkill.score >= 80 ? 'text-emerald-400' :
                                                newSkill.score >= 60 ? 'text-cyan-400' :
                                                    newSkill.score >= 40 ? 'text-yellow-400' :
                                                        'text-red-400'
                                                }`}>{newSkill.score}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            style={{
                                                background: `linear-gradient(to right, ${newSkill.score >= 80 ? '#10b981' :
                                                    newSkill.score >= 60 ? '#06b6d4' :
                                                        newSkill.score >= 40 ? '#eab308' :
                                                            '#ef4444'
                                                    } ${newSkill.score}%, #1e293b ${newSkill.score}%)`
                                            }}
                                            value={newSkill.score}
                                            onChange={e => setNewSkill({ ...newSkill, score: Number(e.target.value) })}
                                            min="0" max="100" step="1"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-600 mt-1 px-0.5">
                                            <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Years Of Experience - Number Input */}
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">
                                        Years of Experience
                                        <span className="text-slate-500 ml-1">— How long have you practiced this?</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="50"
                                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 font-light text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                        value={newSkill.yearsOfExperience}
                                        onChange={e => setNewSkill({ ...newSkill, yearsOfExperience: Number(e.target.value) })}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Add Skill
                                </button>
                            </form>
                        </div>

                        {/* Recent Activity / Recommendations */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Recommendations */}
                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                    <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
                                    Recommended Actions
                                </h2>
                                {getRecommendations().length > 0 ? (
                                    <div className="space-y-4">
                                        {getRecommendations().map(rec => (
                                            <div key={rec.id} className="bg-slate-700/30 p-4 rounded-xl flex items-center justify-between border border-slate-700/50 hover:border-pink-500/30 transition-all">
                                                <div>
                                                    <h4 className="font-bold text-white mb-1">{rec.course}</h4>
                                                    <p className="text-sm text-slate-400">To improve <span className="text-pink-400">{rec.skill}</span> • {rec.provider}</p>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    <a
                                                        href={rec.courseraUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500 hover:text-white transition-colors"
                                                    >
                                                        Coursera
                                                    </a>
                                                    <a
                                                        href={rec.udemyUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500 hover:text-white transition-colors"
                                                    >
                                                        Udemy
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 italic">No low scores found. Great job!</p>
                                )}
                            </div>

                            {/* Skills List Table */}
                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                    <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                                    My Skills
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-slate-400 border-b border-slate-700/50 text-sm uppercase tracking-wider">
                                                <th className="p-4 font-medium">Name</th>
                                                <th className="p-4 font-medium">Category</th>
                                                <th className="p-4 font-medium">YOE</th>
                                                <th className="p-4 font-medium">Score</th>
                                                <th className="p-4 font-medium text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-300">
                                            {skills.map(skill => (
                                                <tr key={skill._id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                                                    <td className="p-4 font-medium text-white">{skill.name}</td>
                                                    <td className="p-4">
                                                        <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300 border border-slate-600">
                                                            {skill.category}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">{skill.yearsOfExperience || 0} Yrs</td>
                                                    <td className="p-4">
                                                        <div className="w-full max-w-[150px] bg-slate-700 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${skill.score >= 80 ? 'bg-emerald-500' :
                                                                    skill.score >= 50 ? 'bg-cyan-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${skill.score}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-slate-500 mt-1 block">{skill.score}%</span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteSkill(skill._id)}
                                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                            title="Delete Skill"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {skills.length === 0 && <div className="text-center py-8 text-slate-500">No skills added yet. Start by adding one!</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Chat with Faculty Floating Action Button */}
            {facultyObj && (
                <>
                    <button 
                        onClick={() => setIsChatOpen(true)}
                        className="fixed bottom-8 right-8 z-[60] bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all group flex items-center gap-3"
                    >
                        <div className="relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        </div>
                        <span className="font-bold hidden group-hover:block whitespace-nowrap overflow-hidden">
                            Message {facultyObj.name}
                        </span>
                    </button>

                    <ChatModal 
                        isOpen={isChatOpen} 
                        onClose={() => setIsChatOpen(false)} 
                        otherUser={facultyObj} 
                        currentUser={user} 
                    />
                </>
            )}
        </div>
    );
};

export default UserDashboard;
