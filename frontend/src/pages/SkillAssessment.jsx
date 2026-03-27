import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as api from '../services/api';
import useAuth from '../hooks/useAuth';
import { ArrowLeftIcon, CheckCircleIcon, CodeBracketSquareIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const SkillAssessment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Step tracking: 1 = Define Skill, 2 = Manual Entry, 3 = Result
    const [step, setStep] = useState(1);
    
    // Inputs
    const [skillName, setSkillName] = useState(searchParams.get('skill') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'Technical');
    
    const [scoreReceived, setScoreReceived] = useState('');
    const [scoreTotal, setScoreTotal] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [testWebsiteName, setTestWebsiteName] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const handleFindAssessment = () => {
        if (!skillName.trim()) return;
        // Redirect user to an online search for assessments
        const searchQuery = encodeURIComponent(`${skillName} free online assessment certificate test`);
        window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
        setStep(2);
    };

    const evaluateTest = async () => {
        if (!scoreReceived || !scoreTotal || Number(scoreTotal) <= 0 || yearsOfExperience === '' || !testWebsiteName.trim()) {
            alert("Please enter valid scores, your years of experience, and the test website name.");
            return;
        }

        setIsSubmitting(true);
        
        const rawScore = Math.min(Math.round((Number(scoreReceived) / Number(scoreTotal)) * 100), 100);
        const yoe = Number(yearsOfExperience);
        
        // Dynamically deduce Title
        let title = "Beginner";
        
        if (rawScore >= 90) title = "Expert";
        else if (rawScore >= 75) title = "Advanced";
        else if (rawScore >= 50) title = "Intermediate";
        else title = "Beginner";
        
        const finalResult = { score: rawScore, yoe, title };

        try {
            await api.createSkill({
                name: skillName,
                category,
                score: rawScore,
                yearsOfExperience: yoe,
                testWebsite: testWebsiteName
            });
            setResult(finalResult);
            setStep(3);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to submit skill. Maybe it already exists?');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ----------------------------------------
    // RENDER: Step 3 (Result)
    // ----------------------------------------
    if (step === 3 && result) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-slate-100">
                <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl text-center">
                    <CheckCircleIcon className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-white mb-2">Evaluation Saved!</h1>
                    <p className="text-slate-400 mb-8">Your verified results for <strong className="text-cyan-400">{skillName}</strong></p>
                    
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 mb-8">
                        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-2">
                            {result.score}%
                        </div>
                        <div className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">Final Accuracy</div>
                        
                        <div className="border-t border-slate-700 pt-4 mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Evaluated Level</div>
                                <div className="text-lg font-bold text-white">{result.title}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Equivalent YOE</div>
                                <div className="text-lg font-bold text-cyan-400">{result.yoe} Years</div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold py-3.5 rounded-xl hover:from-emerald-400 hover:to-cyan-500 transition-all shadow-lg"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // ----------------------------------------
    // RENDER: Step 1 & Step 2 Layout
    // ----------------------------------------
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative text-slate-100 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]"></div>
            
            <div className="max-w-lg w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl relative z-10 transition-all">
                <button 
                    onClick={() => {
                        if (step === 2) setStep(1);
                        else navigate(-1);
                    }} 
                    className="flex items-center gap-2 text-slate-400 mb-6 hover:text-white transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5" /> Back
                </button>
                
                <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
                    <CodeBracketSquareIcon className="w-8 h-8 text-white" />
                </div>
                
                <h1 className="text-3xl font-extrabold text-white mb-3">External Skill Evaluation</h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    Take an authentic external assessment online for your chosen framework or language, then log the final results here to accurately track your level.
                </p>

                {/* Step 1: Defined Skill */}
                {step === 1 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider ml-1 mb-2 block">Skill to Evaluate</label>
                            <input 
                                type="text"
                                value={skillName}
                                onChange={(e) => setSkillName(e.target.value)}
                                placeholder="e.g. React, Python, AWS"
                                className="w-full px-5 py-4 rounded-xl bg-slate-900/60 border border-slate-700/50 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider ml-1 mb-2 block">Category</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-slate-900/60 border border-slate-700/50 text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none"
                            >
                                <option value="Technical">Technical</option>
                                <option value="Soft Skill">Soft Skill</option>
                                <option value="Language">Language</option>
                                <option value="Tool">Tool</option>
                            </select>
                        </div>
                        
                        <button 
                            onClick={handleFindAssessment}
                            disabled={!skillName.trim()}
                            className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                        >
                            Find External Quiz Online <ArrowTopRightOnSquareIcon className="w-6 h-6" />
                        </button>
                    </div>
                )}

                {/* Step 2: Form Input for Score */}
                {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
                            <p className="text-sm text-cyan-300">
                                <strong>Assessment Started:</strong> We opened a new tab to find an assessment for <span className="text-white font-bold">{skillName}</span>. 
                                Once complete, simply return here and input your results!
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider ml-1 mb-2 block">Achieved Score</label>
                                <input 
                                    type="number"
                                    min="0"
                                    value={scoreReceived}
                                    onChange={(e) => setScoreReceived(e.target.value)}
                                    placeholder="e.g. 15"
                                    className="w-full px-5 py-4 rounded-xl bg-slate-900/60 border border-slate-700/50 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-center text-xl font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider ml-1 mb-2 block">Total Maximum</label>
                                <input 
                                    type="number"
                                    min="1"
                                    value={scoreTotal}
                                    onChange={(e) => setScoreTotal(e.target.value)}
                                    placeholder="e.g. 20"
                                    className="w-full px-5 py-4 rounded-xl bg-slate-900/60 border border-slate-700/50 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-center text-xl font-bold"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider ml-1 mb-2 block">Years of Experience</label>
                            <input 
                                type="number"
                                min="0"
                                value={yearsOfExperience}
                                onChange={(e) => setYearsOfExperience(e.target.value)}
                                placeholder="e.g. 2"
                                className="w-full px-5 py-4 rounded-xl bg-slate-900/60 border border-slate-700/50 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-center text-xl font-bold"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider ml-1 mb-2 block">Test Website Name</label>
                            <input 
                                type="text"
                                value={testWebsiteName}
                                onChange={(e) => setTestWebsiteName(e.target.value)}
                                placeholder="e.g. Coursera, Udemy, HackerRank"
                                className="w-full px-5 py-4 rounded-xl bg-slate-900/60 border border-slate-700/50 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-center text-xl font-bold"
                            />
                        </div>
                        
                        <button 
                            onClick={evaluateTest}
                            disabled={!scoreReceived || !scoreTotal || yearsOfExperience === '' || !testWebsiteName.trim() || isSubmitting}
                            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                        >
                            {isSubmitting ? 'Saving Assessment...' : 'Evaluate & Save Skill'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillAssessment;
