import React from 'react';
import { motion } from 'framer-motion';
import { AuditResult } from '../../types';
import SparkleIcon from '../icons/SparkleIcon';

interface AiAuditModalProps {
    result: AuditResult;
    onClose: () => void;
    onRewrite: (path: string, originalText: string) => void;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative h-28 w-28">
            <svg className="w-full h-full" viewBox="0 0 100 100" aria-label={`Resume score: ${score} out of 100`}>
                <circle className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
                <motion.circle
                    className="text-primary"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'circOut' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">{score}</span>
            </div>
        </div>
    );
};

const FeedbackItem: React.FC<{
    item: AuditResult['feedback'][0];
    onRewrite: (path: string, originalText: string) => void;
}> = ({ item, onRewrite }) => {
    const categoryColors = {
        Impact: 'bg-blue-100 text-blue-800',
        Quantification: 'bg-emerald-100 text-emerald-800',
        Conciseness: 'bg-purple-100 text-purple-800',
        Skills: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${categoryColors[item.category]}`}>{item.category}</span>
                {item.contextPath && item.suggestion && (
                    <button onClick={() => onRewrite(item.contextPath!, item.message)} className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full text-primary-700 bg-primary-100 hover:bg-primary-200">
                        <SparkleIcon className="w-3 h-3" /> Fix with AI
                    </button>
                )}
            </div>
            <p className="text-sm text-slate-700">{item.message}</p>
        </div>
    );
};

const AiAuditModal: React.FC<AiAuditModalProps> = ({ result, onClose, onRewrite }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-2xl h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl"
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-100 text-primary">
                            <SparkleIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">AI Resume Audit</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100" aria-label="Close modal">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col items-center text-center mb-6">
                        <ScoreCircle score={result.overallScore} />
                        <p className="mt-4 text-sm text-slate-600 max-w-sm">This score reflects your resume's overall impact, clarity, and use of best practices. Address the feedback below to improve it.</p>
                    </div>

                    <div className="space-y-3">
                        {result.feedback.length > 0 ? (
                            result.feedback.map((item, index) => <FeedbackItem key={index} item={item} onRewrite={onRewrite} />)
                        ) : (
                            <p className="text-center text-slate-500">Looks great! The AI couldn't find any specific improvements to suggest.</p>
                        )}
                    </div>
                </div>

                <footer className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-700">Close</button>
                </footer>
            </motion.div>
        </div>
    );
};

export default AiAuditModal;