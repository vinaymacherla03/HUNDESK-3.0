
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InterviewQuestion, InterviewFeedback } from '../../types';
import { evaluateInterviewAnswer } from '../../services/geminiService';
import PremiumButton from './PremiumButton';
import SparkleIcon from '../icons/SparkleIcon';

interface InterviewPrepModalProps {
    questions: InterviewQuestion[];
    role: string;
    onClose: () => void;
}

const InterviewPrepModal: React.FC<InterviewPrepModalProps> = ({ questions, role, onClose }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isEvaluated, setIsEvaluated] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
    const [showTip, setShowTip] = useState(false);

    const currentQuestion = questions[activeIndex];

    const handleAnalyze = async () => {
        if (!userAnswer.trim()) return;
        setIsAnalyzing(true);
        try {
            const result = await evaluateInterviewAnswer(currentQuestion.question, userAnswer, role);
            setFeedback(result);
            setIsEvaluated(true);
        } catch (e) {
            console.error(e);
            alert("Failed to analyze answer. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleNext = () => {
        if (activeIndex < questions.length - 1) {
            setActiveIndex(activeIndex + 1);
            resetState();
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
            resetState();
        }
    };

    const resetState = () => {
        setUserAnswer('');
        setIsEvaluated(false);
        setFeedback(null);
        setShowTip(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex"
            >
                {/* Sidebar: Question List */}
                <aside className="w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <div className="p-1.5 bg-violet-600 rounded-lg text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            </div>
                            Interview Prep
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Generated for {role}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                        {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => { setActiveIndex(idx); resetState(); }}
                                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                                    activeIndex === idx 
                                    ? 'bg-white border-violet-500 ring-1 ring-violet-500 shadow-md' 
                                    : 'bg-white border-slate-200 hover:border-violet-300 hover:shadow-sm text-slate-600'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                        q.type === 'Behavioral' ? 'bg-blue-50 text-blue-600' :
                                        q.type === 'Technical' ? 'bg-amber-50 text-amber-600' :
                                        'bg-emerald-50 text-emerald-600'
                                    }`}>
                                        {q.type}
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-400">#{idx + 1}</span>
                                </div>
                                <p className={`text-xs font-medium line-clamp-2 ${activeIndex === idx ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {q.question}
                                </p>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content: Practice Area */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pb-32">
                        {/* Question Card */}
                        <div className="mb-8">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Current Question</span>
                            <h1 className="text-2xl font-display font-bold text-slate-900 leading-tight">
                                {currentQuestion.question}
                            </h1>
                        </div>

                        {/* Tip Accordion */}
                        <div className="mb-8">
                            <button 
                                onClick={() => setShowTip(!showTip)}
                                className="flex items-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors mb-2"
                            >
                                <SparkleIcon className="w-4 h-4" />
                                {showTip ? 'Hide Interviewer Tip' : 'Reveal Interviewer Tip'}
                            </button>
                            <AnimatePresence>
                                {showTip && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }} 
                                        animate={{ height: 'auto', opacity: 1 }} 
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl text-sm text-violet-900 leading-relaxed">
                                            {currentQuestion.tip}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Answer Input */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Your Answer</label>
                            <textarea 
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                disabled={isEvaluated || isAnalyzing}
                                className="w-full h-48 p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-slate-700 text-sm leading-relaxed disabled:bg-slate-50 disabled:text-slate-500 transition-all shadow-sm"
                                placeholder="Draft your response here (STAR method recommended)..."
                            />
                            {!isEvaluated && (
                                <div className="mt-4 flex justify-end">
                                    <div className="w-40">
                                        <PremiumButton 
                                            onClick={handleAnalyze} 
                                            disabled={!userAnswer.trim()} 
                                            isLoading={isAnalyzing} 
                                            loadingText="Analyzing..."
                                        >
                                            Get Feedback
                                        </PremiumButton>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AI Feedback Result */}
                        <AnimatePresence>
                            {feedback && isEvaluated && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden mb-8"
                                >
                                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                                        <h3 className="font-bold text-sm">AI Analysis Result</h3>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            feedback.score >= 8 ? 'bg-emerald-500 text-white' : 
                                            feedback.score >= 5 ? 'bg-amber-500 text-white' : 
                                            'bg-red-500 text-white'
                                        }`}>
                                            Score: {feedback.score}/10
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Strengths</h4>
                                                <ul className="space-y-1">
                                                    {feedback.strengths.map((s, i) => (
                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Improvements</h4>
                                                <ul className="space-y-1">
                                                    {feedback.improvements.map((s, i) => (
                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="bg-violet-50 p-4 rounded-xl border border-violet-100">
                                            <h4 className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-2">Refined Answer Example</h4>
                                            <p className="text-sm text-violet-900 leading-relaxed italic">"{feedback.refinedAnswer}"</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <button 
                                                onClick={resetState} 
                                                className="text-sm font-bold text-slate-500 hover:text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 transition-all"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex justify-between items-center z-20">
                        <button 
                            onClick={handlePrev} 
                            disabled={activeIndex === 0}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {activeIndex + 1} of {questions.length}</span>
                        <button 
                            onClick={handleNext} 
                            disabled={activeIndex === questions.length - 1}
                            className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-slate-900/20"
                        >
                            Next Question
                        </button>
                    </div>
                </main>

                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 rounded-full backdrop-blur-sm transition-colors z-30"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </motion.div>
        </div>
    );
};

export default InterviewPrepModal;
