import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import * as api from '../services/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.getUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.deleteUser(id);
                setUsers(users.filter((user) => user._id !== id));
            } catch (err) {
                setError('Failed to delete user');
            }
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            const { data } = await api.updateUserRole(id, newRole);
            setUsers(users.map((user) => (user._id === id ? data : user)));
        } catch (err) {
            setError('Failed to update role');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-cyan-400">Admin Dashboard</h1>

                {error && <p className="bg-red-500/20 text-red-500 p-3 rounded mb-4">{error}</p>}

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-xl mb-4 font-semibold">User Management Module</h2>
                    <p className="text-gray-400 mb-4">View, Update Role, or Remove users from the system.</p>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="bg-gray-700 text-gray-300">
                                    <th className="p-3 rounded-tl-lg">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3 rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                                        <td className="p-3 font-medium">{user.name}</td>
                                        <td className="p-3 text-gray-400">{user.email}</td>
                                        <td className="p-3">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2"
                                            >
                                                <option value="learner">Learner</option>
                                                <option value="faculty">Faculty</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {users.length === 0 && !loading && <p className="text-gray-400 text-center mt-4">No users found.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
