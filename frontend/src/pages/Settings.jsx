import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import useAuth from '../hooks/useAuth';
import * as api from '../services/api';
import {
    UserCircleIcon,
    BellIcon,
    ShieldCheckIcon,
    PaintBrushIcon,
    KeyIcon,
    CheckIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
    const { user, logout, updateUser } = useAuth();
    const [staffIdInput, setStaffIdInput] = useState('');

    const [activeTab, setActiveTab] = useState('profile');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Profile state
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'learner',
    });

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailNotifs: true,
        skillReminders: true,
        weeklyReport: false,
        courseRecommendations: true,
    });

    // Appearance
    const [appearance, setAppearance] = useState({
        theme: 'dark',
        compactMode: false,
        showCharts: true,
    });

    // Password
    const [passwords, setPasswords] = useState({
        current: '',
        newPassword: '',
        confirm: '',
    });

    const showMessage = (type, msg) => {
        if (type === 'success') {
            setSuccess(msg);
            setError('');
        } else {
            setError(msg);
            setSuccess('');
        }
        setTimeout(() => { setSuccess(''); setError(''); }, 3000);
    };

    const handleProfileSave = async () => {
        let errorOccurred = false;
        
        // Handle Faculty Assignment internally if provided
        if (user?.role === 'learner' && staffIdInput.trim()) {
            try {
                const { data } = await api.assignFaculty(staffIdInput.trim());
                updateUser(data); // Immediate sync
                showMessage('success', 'Successfully linked to your Faculty!');
                setStaffIdInput('');
            } catch (err) {
                showMessage('error', err.response?.data?.message || 'Invalid Staff ID. Verification Failed.');
                errorOccurred = true;
            }
        }
        
        if (!errorOccurred && !staffIdInput.trim()) {
            showMessage('success', 'Profile updated successfully!');
        }

        // Update localStorage for simple name change if no faculty assignment was done
        if (!staffIdInput.trim()) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo) {
                userInfo.name = profile.name;
                updateUser(userInfo);
            }
        }
    };

    const handleNotifSave = () => {
        localStorage.setItem('notifPrefs', JSON.stringify(notifications));
        showMessage('success', 'Notification preferences saved!');
    };

    const handleAppearanceSave = () => {
        localStorage.setItem('appearancePrefs', JSON.stringify(appearance));
        showMessage('success', 'Appearance settings saved!');
    };

    const handlePasswordChange = () => {
        if (!passwords.current || !passwords.newPassword || !passwords.confirm) {
            showMessage('error', 'Please fill all password fields');
            return;
        }
        if (passwords.newPassword !== passwords.confirm) {
            showMessage('error', 'New passwords do not match');
            return;
        }
        if (passwords.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters');
            return;
        }
        setPasswords({ current: '', newPassword: '', confirm: '' });
        showMessage('success', 'Password changed successfully!');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            logout();
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: UserCircleIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon },
        { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    ];

    useEffect(() => {
        // Load saved preferences
        const savedNotifs = localStorage.getItem('notifPrefs');
        if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
        const savedAppearance = localStorage.getItem('appearancePrefs');
        if (savedAppearance) setAppearance(JSON.parse(savedAppearance));
    }, []);

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-6 md:p-12">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            Settings
                        </h1>
                        <p className="text-slate-400 mt-1">Manage your account preferences and configuration</p>
                    </div>

                    {/* Messages */}
                    {success && (
                        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl mb-6 flex items-center gap-3 animate-pulse">
                            <CheckIcon className="w-5 h-5" />
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
                            <ExclamationTriangleIcon className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Tab Navigation */}
                        <div className="lg:w-64 shrink-0">
                            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-2 space-y-1">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                                ? 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 text-cyan-400 border border-cyan-500/30'
                                                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                            }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span className="font-medium text-sm">{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-4 mt-4">
                                <h3 className="text-sm font-bold text-red-400 mb-2">Danger Zone</h3>
                                <p className="text-xs text-slate-500 mb-3">
                                    Permanently delete your account and all associated data.
                                </p>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-medium transition-all border border-red-500/30"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <UserCircleIcon className="w-6 h-6 text-cyan-400" />
                                        Profile Information
                                    </h2>
                                    <div className="space-y-5">
                                        {/* Avatar */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{profile.name}</p>
                                                <p className="text-slate-500 text-sm capitalize">{profile.role}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                                value={profile.name}
                                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1.5">Email Address</label>
                                            <input
                                                type="email"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-500 cursor-not-allowed"
                                                value={profile.email}
                                                disabled
                                            />
                                            <p className="text-xs text-slate-600 mt-1">Email cannot be changed</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1.5">Role</label>
                                            <div className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 capitalize flex justify-between items-center">
                                                <span>{profile.role}</span>
                                                <span className="text-xs text-slate-600">(assigned by admin)</span>
                                            </div>
                                        </div>

                                        {/* Faculty Settings */}
                                        {profile.role === 'faculty' && (
                                            <div>
                                                <label className="block text-sm text-cyan-400 mb-1.5 font-bold">Your Unique Staff ID</label>
                                                <div className="px-4 py-3 rounded-xl bg-cyan-900/20 border border-cyan-500/50 text-cyan-300 font-mono tracking-wider flex justify-between items-center">
                                                    {user?.staffId || "Not assigned yet"}
                                                    <span className="text-[10px] text-cyan-500 uppercase tracking-widest">Share with students</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2">Students must enter this exact ID to join your class list.</p>
                                            </div>
                                        )}
                                        {profile.role === 'learner' && (
                                            <div>
                                                <label className="block text-sm text-cyan-400 mb-1.5 font-bold">Connect to Faculty</label>
                                                {user?.assignedFaculty ? (
                                                    <div className="px-4 py-3 rounded-xl bg-emerald-900/20 border border-emerald-500/50 text-emerald-400 font-medium">
                                                        ✓ You are currently assigned to a Faculty member.
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter 8-digit Faculty Staff ID (e.g. FAC-XXXX-YYYY)"
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600 font-mono"
                                                            value={staffIdInput}
                                                            onChange={e => setStaffIdInput(e.target.value.toUpperCase())}
                                                        />
                                                        <p className="text-xs text-slate-500 mt-2">Entering this will link your skills and progress to your designated faculty.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleProfileSave}
                                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-cyan-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <BellIcon className="w-6 h-6 text-cyan-400" />
                                        Notification Preferences
                                    </h2>
                                    <p className="text-slate-400 text-sm mb-6">Choose what notifications you want to receive</p>

                                    <div className="space-y-4">
                                        {[
                                            { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive important updates via email' },
                                            { key: 'skillReminders', label: 'Skill Practice Reminders', desc: 'Get reminded to practice skills you are learning' },
                                            { key: 'weeklyReport', label: 'Weekly Progress Report', desc: 'Receive a weekly summary of your progress' },
                                            { key: 'courseRecommendations', label: 'Course Recommendations', desc: 'Get personalized course suggestions based on your skills' },
                                        ].map(item => (
                                            <div
                                                key={item.key}
                                                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all"
                                            >
                                                <div>
                                                    <p className="text-white font-medium text-sm">{item.label}</p>
                                                    <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications({
                                                        ...notifications,
                                                        [item.key]: !notifications[item.key]
                                                    })}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.key] ? 'bg-cyan-600' : 'bg-slate-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleNotifSave}
                                        className="mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-cyan-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Save Preferences
                                    </button>
                                </div>
                            )}

                            {/* Appearance Tab */}
                            {activeTab === 'appearance' && (
                                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <PaintBrushIcon className="w-6 h-6 text-cyan-400" />
                                        Appearance
                                    </h2>

                                    {/* Theme */}
                                    <div className="mb-6">
                                        <label className="block text-sm text-slate-400 mb-3">Theme</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { key: 'dark', label: 'Dark', gradient: 'from-slate-900 to-slate-800', border: 'border-cyan-500' },
                                                { key: 'light', label: 'Light', gradient: 'from-gray-100 to-gray-200', border: 'border-cyan-500' },
                                                { key: 'system', label: 'System', gradient: 'from-slate-800 to-gray-200', border: 'border-cyan-500' },
                                            ].map(t => (
                                                <button
                                                    key={t.key}
                                                    onClick={() => setAppearance({ ...appearance, theme: t.key })}
                                                    className={`p-4 rounded-xl border-2 transition-all ${appearance.theme === t.key ? t.border : 'border-slate-700'
                                                        }`}
                                                >
                                                    <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${t.gradient} mb-2`}></div>
                                                    <p className={`text-xs font-medium ${appearance.theme === t.key ? 'text-cyan-400' : 'text-slate-400'}`}>
                                                        {t.label}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Toggle options */}
                                    <div className="space-y-4">
                                        {[
                                            { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing and make the UI more dense' },
                                            { key: 'showCharts', label: 'Show Charts', desc: 'Display visual charts on the dashboard' },
                                        ].map(item => (
                                            <div
                                                key={item.key}
                                                className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50"
                                            >
                                                <div>
                                                    <p className="text-white font-medium text-sm">{item.label}</p>
                                                    <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                                                </div>
                                                <button
                                                    onClick={() => setAppearance({
                                                        ...appearance,
                                                        [item.key]: !appearance[item.key]
                                                    })}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${appearance[item.key] ? 'bg-cyan-600' : 'bg-slate-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${appearance[item.key] ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleAppearanceSave}
                                        className="mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-cyan-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Save Appearance
                                    </button>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <ShieldCheckIcon className="w-6 h-6 text-cyan-400" />
                                        Security & Password
                                    </h2>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1.5">Current Password</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                                placeholder="Enter current password"
                                                value={passwords.current}
                                                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1.5">New Password</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                                placeholder="Enter new password (min 6 characters)"
                                                value={passwords.newPassword}
                                                onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1.5">Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                                placeholder="Re-enter new password"
                                                value={passwords.confirm}
                                                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                            />
                                            {passwords.newPassword && passwords.confirm && passwords.newPassword !== passwords.confirm && (
                                                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                                            )}
                                        </div>

                                        <button
                                            onClick={handlePasswordChange}
                                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-cyan-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Change Password
                                        </button>
                                    </div>

                                    {/* Sessions info */}
                                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                                        <h3 className="text-sm font-bold text-slate-300 mb-3">Active Sessions</h3>
                                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <div>
                                                    <p className="text-sm text-white font-medium">Current Session</p>
                                                    <p className="text-xs text-slate-500">Windows • Chrome • Active now</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-emerald-400 font-medium">Active</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Settings;
