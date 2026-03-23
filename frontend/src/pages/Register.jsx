import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { UserPlus, Mail, Lock, User, Shield, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('learner');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(name, email, password, role);
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration error:', err);
            const errorMessage = err.response?.data?.message
                ? err.response.data.message
                : err.message || 'Registration failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] relative overflow-hidden font-sans py-12">
            {/* Dynamic Background Effects */}
            <div className="absolute top-[0%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/30 rounded-full blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full max-w-md relative z-10 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_50px_rgba(0,0,0,0.7)] group">
                <div className="text-center mb-8 relative">
                    <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight">Create Account</h2>
                    <p className="text-gray-400 mt-3 font-medium">Join us and start your journey today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center mb-8 flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"></div>
                        <p className="text-red-400 text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-gray-300 text-xs font-bold uppercase tracking-wider ml-1" htmlFor="name">Full Name</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <User className="w-5 h-5 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors duration-300" />
                            </div>
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-900/60 border border-gray-700/50 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-gray-300 text-xs font-bold uppercase tracking-wider ml-1" htmlFor="email">Email Address</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Mail className="w-5 h-5 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors duration-300" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-900/60 border border-gray-700/50 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-gray-300 text-xs font-bold uppercase tracking-wider ml-1" htmlFor="password">Password</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors duration-300" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-900/60 border border-gray-700/50 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner"
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-gray-300 text-xs font-bold uppercase tracking-wider ml-1" htmlFor="role">Select Role</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                                <Shield className="w-5 h-5 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors duration-300" />
                            </div>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-gray-900/60 border border-gray-700/50 text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 shadow-inner"
                            >
                                <option value="learner">Learner</option>
                                <option value="faculty">Faculty</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-1 flex items-center justify-center space-x-2 mt-6 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Creating account...</span>
                            </>
                        ) : (
                            <>
                                <span>Register</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                    
                    <div className="text-center mt-6">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-all">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
