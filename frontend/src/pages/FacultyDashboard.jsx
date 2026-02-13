import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import * as api from '../services/api';

export default function FacultyDashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // In a real app, use a dedicated endpoint like /api/faculty/students
                const { data } = await api.getUsers();
                const learners = data.filter(u => u.role === 'learner');
                setStudents(learners);
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
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-purple-400">Faculty Dashboard</h1>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl mb-6 font-semibold border-b border-gray-700 pb-2">My Students</h2>

                    {students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {students.map(student => (
                                <div key={student._id} className="bg-gray-700 p-5 rounded-lg hover:bg-gray-600 transition shadow-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-xl font-bold">
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Active</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{student.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{student.email}</p>

                                    <div className="flex justify-between items-center border-t border-gray-600 pt-4">
                                        <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">View Analytics</button>
                                        <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">Assign Task</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <p className="text-lg">No students assigned yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
