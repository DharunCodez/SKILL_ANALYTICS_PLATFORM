import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Skill Analytics Platform
            </h1>
            <p className="text-xl mb-8 text-gray-400">Track, Analyze, and Improve your Skills.</p>
            <div className="flex gap-4">
                <Link to="/login" className="px-6 py-3 bg-cyan-600 rounded hover:bg-cyan-500 transition">Get Started</Link>
                <Link to="/register" className="px-6 py-3 border border-gray-600 rounded hover:bg-gray-800 transition">Sign Up</Link>
            </div>
        </div>
    );
};

export default Home;
