import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
    HomeIcon,
    ChartBarIcon,
    UserIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'; // Start simple with Heroicons (installed via npm previously)

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: HomeIcon, path: '/dashboard', roles: ['learner'] },
        { name: 'My Skills', icon: ChartBarIcon, path: '/skills', roles: ['learner'] }, // We might consolidate this into dashboard or separate page
        { name: 'Faculty', icon: UserIcon, path: '/faculty', roles: ['faculty'] },
        { name: 'Admin', icon: UserIcon, path: '/admin', roles: ['admin'] },
        { name: 'Settings', icon: Cog6ToothIcon, path: '/settings', roles: ['learner', 'faculty', 'admin'] },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-700 flex flex-col shadow-xl z-20 hidden md:flex">
            <div className="p-6 flex items-center justify-center border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
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
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 text-cyan-400 border border-cyan-500/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white'}`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-xl p-4 mb-4 backdrop-blur-sm border border-slate-700">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
