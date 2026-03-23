import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import MySkills from './pages/MySkills';
import Settings from './pages/Settings';
import SkillAssessment from './pages/SkillAssessment';
import Messages from './pages/Messages';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['learner']}>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/skills"
                        element={
                            <ProtectedRoute allowedRoles={['learner', 'faculty', 'admin']}>
                                <MySkills />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute allowedRoles={['learner']}>
                                <Messages />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute allowedRoles={['learner', 'faculty', 'admin']}>
                                <Settings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/assessment"
                        element={
                            <ProtectedRoute allowedRoles={['learner', 'faculty', 'admin']}>
                                <SkillAssessment />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/faculty"
                        element={
                            <ProtectedRoute allowedRoles={['faculty']}>
                                <FacultyDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;

