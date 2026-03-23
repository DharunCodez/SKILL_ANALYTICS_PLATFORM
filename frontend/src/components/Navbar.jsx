import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import * as api from '../services/api';
// Using generic SVG for Bell to avoid dependency issues if heroicons fails install
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
);

const Navbar = () => {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error(error);
        }
    };

    const markRead = async (id) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            await api.markNotificationRead(id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <nav className="bg-gray-900/50 backdrop-blur-xl border-b border-white/10 p-4 text-white shadow-lg relative z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    SkillVerify
                </Link>

                <div className="flex gap-6 items-center">
                    {user ? (
                        <>
                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative hover:text-cyan-400 transition focus:outline-none"
                                >
                                    <BellIcon />
                                    {notifications.filter(n => !n.isRead).length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center animate-pulse">
                                            {notifications.filter(n => !n.isRead).length}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-3 w-80 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                                        <div className="p-3 border-b border-white/10 bg-white/5 font-semibold flex justify-between items-center">
                                            <span>Notifications</span>
                                            <span className="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors" onClick={fetchNotifications}>Refresh</span>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div
                                                        key={n._id}
                                                        className={`p-3 border-b border-white/5 hover:bg-white/5 transition ${n.isRead ? 'opacity-50' : 'bg-cyan-500/10'}`}
                                                    >
                                                        <p className="text-sm text-slate-200">{n.message}</p>
                                                        {!n.isRead && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); markRead(n._id); }}
                                                                className="text-xs text-cyan-400 mt-2 hover:underline"
                                                            >
                                                                Mark as read
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-xs text-gray-400 uppercase">{user.role}</span>
                            </div>

                            <button
                                onClick={logout}
                                className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1 rounded transition text-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="hover:text-cyan-400 transition">Login</Link>
                            <Link to="/register" className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded transition font-medium">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
