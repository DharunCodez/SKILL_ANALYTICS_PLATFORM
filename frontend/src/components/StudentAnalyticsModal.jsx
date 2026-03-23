import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const StudentAnalyticsModal = ({ isOpen, onClose, student }) => {
    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="w-full max-w-5xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                            {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{student.name}'s Analytics</h2>
                            <p className="text-slate-400 text-sm">{student.email} • Rank: <span className="text-cyan-400 font-bold">#{student.rank}</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#0a0a0a]">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Average Score</p>
                            <p className="text-3xl font-bold text-white">{student.averageScore}%</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Skills</p>
                            <p className="text-3xl font-bold text-white">{student.skills?.length || 0}</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Class Position</p>
                            <p className="text-3xl font-bold text-cyan-400">Rank #{student.rank}</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-80">
                            <h3 className="text-lg font-bold mb-4 text-white">Skill Proficiency</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={student.skills}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                    <YAxis stroke="#64748b" fontSize={11} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                    <Bar dataKey="score" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-80">
                            <h3 className="text-lg font-bold mb-4 text-white">Skill Distribution</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={student.skills}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" />
                                    <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Detailed List */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold mb-4 text-white">Detailed Skill Breakdown</h3>
                        <div className="space-y-4">
                            {student.skills?.map(skill => (
                                <div key={skill._id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5">
                                    <div>
                                        <p className="font-bold text-white text-sm">{skill.name}</p>
                                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{skill.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-white">{skill.score}%</p>
                                        <div className="w-32 bg-slate-700 h-1.5 rounded-full mt-1">
                                            <div 
                                                className={`h-full rounded-full ${skill.score >= 80 ? 'bg-emerald-500' : skill.score >= 50 ? 'bg-cyan-500' : 'bg-red-500'}`} 
                                                style={{ width: `${skill.score}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAnalyticsModal;
