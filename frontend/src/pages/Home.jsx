import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>

            <div className="relative z-10 text-center px-4 max-w-3xl">
                <h1 className="text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                    Skill Analytics Platform
                </h1>
                <p className="text-2xl mb-10 text-gray-300 font-light leading-relaxed">
                    Track your growth, Analyze your progress, and Improve your skills intuitively.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link to="/login" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/30 transform hover:-translate-y-1">
                        Get Started
                    </Link>
                    <Link to="/register" className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all shadow-lg transform hover:-translate-y-1">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
