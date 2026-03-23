import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
    HomeIcon,
    ChartBarIcon,
    UserIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'; // Start simple with Heroicons (installed via npm previously)

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: HomeIcon, path: '/dashboard', roles: ['learner'] },
        { name: 'My Skills', icon: ChartBarIcon, path: '/skills', roles: ['learner'] },
        { name: 'Messages', icon: ChatBubbleLeftRightIcon, path: '/messages', roles: ['learner'] },
        { name: 'Faculty', icon: UserIcon, path: '/faculty', roles: ['faculty'] },
        { name: 'Admin', icon: UserIcon, path: '/admin', roles: ['admin'] },
        { name: 'Settings', icon: Cog6ToothIcon, path: '/settings', roles: ['learner', 'faculty', 'admin'] },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col shadow-2xl z-20 hidden md:flex">
            <div className="p-6 flex items-center justify-center border-b border-white/10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
                    SkillVerify
                </h1>
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-2">
                {menuItems.map((item) => {
                    if (item.roles && !item.roles.includes(user?.role)) return null;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                : 'text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white'}`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-white/5 rounded-xl p-4 mb-4 backdrop-blur-md border border-white/10">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
