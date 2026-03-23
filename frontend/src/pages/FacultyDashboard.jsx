import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import * as api from '../services/api';
import useAuth from '../hooks/useAuth';
import ChatModal from '../components/ChatModal';
import StudentAnalyticsModal from '../components/StudentAnalyticsModal';

export default function FacultyDashboard() {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatUser, setChatUser] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await api.getFacultyStudents();
                setStudents(data);
            } catch (error) {
                console.error("Failed to fetch learners", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />
            <div className="container mx-auto p-6 lg:p-12 relative z-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent transform">
                        Faculty Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2">Manage your assigned learners under Staff ID: <strong className="text-cyan-400 font-mono tracking-wider bg-cyan-900/30 px-2 py-1 rounded">{user?.staffId || "N/A"}</strong></p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl mb-6 font-bold flex items-center gap-2">
                        <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
                        My Students
                    </h2>

                    {students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {students.map((student) => (
                                <div key={student._id} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all group shrink-0 relative overflow-hidden">
                                    {/* Rank Badge */}
                                    <div className="absolute top-0 right-0 px-4 py-2 bg-cyan-600/20 text-cyan-400 font-bold text-sm rounded-bl-2xl border-l border-b border-cyan-500/30">
                                        Rank #{student.rank}
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-xl font-bold text-[#0a0a0a]">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight group-hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => setSelectedStudent(student)}>{student.name}</h3>
                                                <p className="text-slate-400 text-xs">{student.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-white/5">
                                        <div className="text-center flex-1 border-r border-slate-700/50">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Avg Score</p>
                                            <p className="text-lg font-bold text-white">{student.averageScore}%</p>
                                        </div>
                                        <div className="text-center flex-1" onClick={() => setSelectedStudent(student)} style={{cursor: 'pointer'}}>
                                            <p className="text-[10px] text-cyan-500 uppercase font-bold tracking-widest">Analytics</p>
                                            <p className="text-[10px] text-slate-400 underline">View Full Report</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 mt-5">
                                        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Skills Acquired</p>
                                        {student.skills && student.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {student.skills.map(skill => (
                                                    <div key={skill._id} className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs flex items-center gap-2">
                                                        <span className="text-slate-300 font-medium">{skill.name}</span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${skill.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : skill.score >= 50 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
                                                            {skill.score}%
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-600 text-xs italic">No skills evaluated yet.</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex justify-between items-center border-t border-slate-700/50 pt-4 mt-6">
                                        <div className="text-xs text-slate-500">
                                            Role: <span className="text-slate-300 capitalize">{student.role}</span>
                                        </div>
                                        <button 
                                            onClick={() => setChatUser(student)}
                                            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider transition-all hover:bg-cyan-900/30 px-3 py-1.5 rounded-lg"
                                        >
                                            Message
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-900/30 border border-slate-700/30 rounded-2xl">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <p className="text-lg text-white font-medium mb-1">No Students Yet</p>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">Share your Staff ID <strong className="text-cyan-400">{user?.staffId}</strong> with your learners so they can link their profile to your dashboard.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Background Effects */}
            <div className="fixed top-[0%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

            <ChatModal 
                isOpen={!!chatUser} 
                onClose={() => setChatUser(null)} 
                otherUser={chatUser} 
                currentUser={user} 
            />

            <StudentAnalyticsModal
                isOpen={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
                student={selectedStudent}
            />
        </div>
    );
}
