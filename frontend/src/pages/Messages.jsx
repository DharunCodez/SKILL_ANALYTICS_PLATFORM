import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import useAuth from '../hooks/useAuth';
import * as api from '../services/api';
import ChatModal from '../components/ChatModal';

const Messages = () => {
    const { user } = useAuth();
    const [faculty, setFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const { data } = await api.getMyFaculty();
                setFaculty(data);
            } catch (err) {
                console.error("Error fetching faculty", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.role === 'learner') {
            fetchFaculty();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 relative">
                <Navbar />
                <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-10">
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                                Messaging Center
                            </h1>
                            <p className="text-slate-400 mt-2">Connect and collaborate with your academic mentors.</p>
                        </header>

                        {user?.role === 'learner' ? (
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
                                    Your Instructor
                                </h2>

                                {faculty ? (
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-800/40 p-6 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-2xl font-bold text-slate-900">
                                                {faculty.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{faculty.name}</h3>
                                                <p className="text-slate-400 text-sm">{faculty.email}</p>
                                                <div className="mt-1">
                                                    <span className="text-[10px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 font-bold uppercase tracking-tighter">Verified Faculty</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setIsChatOpen(true)}
                                            className="w-full md:w-auto px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            Open Conversation
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-dashed border-slate-700">
                                        <p className="text-slate-400 mb-6">You haven't linked with a faculty member yet.</p>
                                        <a 
                                            href="/settings" 
                                            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-white/10"
                                        >
                                            Go to Settings to Link Faculty
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
                                <p className="text-slate-400">Please use the <strong>Faculty Dashboard</strong> to message your students.</p>
                                <a 
                                    href="/faculty" 
                                    className="mt-6 inline-block px-6 py-2 bg-cyan-600 text-white rounded-lg text-sm font-bold"
                                >
                                    Go to Dashboard
                                </a>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <ChatModal 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
                otherUser={faculty} 
                currentUser={user} 
            />

            {/* Background Decorations */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        </div>
    );
};

export default Messages;
