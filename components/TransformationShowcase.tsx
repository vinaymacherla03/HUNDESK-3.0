import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AiRewriterShowcase from './AiRewriterShowcase';
import JobMatchGraphic from './JobMatchGraphic';
import SparkleIcon from './icons/SparkleIcon';

type FeatureTab = 'writer' | 'matcher' | 'tracker'; // Removed 'templates'

const features: { id: FeatureTab; title: string; description: string; icon: any }[] = [
    { 
        id: 'writer', 
        title: 'AI Resume Writer', 
        description: 'Turn basic notes into executive-level achievements automatically.',
        icon: (active: boolean) => <SparkleIcon className={`w-5 h-5 ${active ? 'text-white' : 'text-blue-600'}`} />
    },
    { 
        id: 'matcher', 
        title: 'Match Analyzer', 
        description: 'See exactly what keywords you\'re missing for any job description.',
        icon: (active: boolean) => (
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${active ? 'text-white' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    { 
        id: 'tracker', 
        title: 'Pipeline Tracker', 
        description: 'A Kanban board to manage your applications, interviews, and offers.',
        icon: (active: boolean) => (
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${active ? 'text-white' : 'text-violet-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
        )
    },
];

const JobCard = ({ title, company, color, initials, daysAgo, stage, tags }: { title: string, company: string, color: string, initials: string, daysAgo: string, stage?: string, tags?: string[] }) => (
    <motion.div 
        initial={{ y: 10, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="bg-white p-3 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col gap-3 group hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all cursor-default relative"
    >
        <div className="flex justify-between items-start">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-sm ${color}`}>
                {initials}
            </div>
            <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded">{daysAgo}</span>
        </div>
        <div>
            <div className="text-xs font-bold text-slate-800 leading-tight">{title}</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">{company}</div>
        </div>
        {(stage || tags) && (
            <div className="flex flex-wrap gap-1.5">
                {stage && <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{stage}</span>}
                {tags?.map(tag => (
                    <span key={tag} className="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">{tag}</span>
                ))}
            </div>
        )}
    </motion.div>
);

// Realistic Career Hub Visual
const CareerHubVisual = () => (
    <div className="w-full h-full bg-[#F7F9FC] flex flex-col font-sans">
        {/* Inner Header */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-slate-800">My Board</h3>
                <div className="h-4 w-px bg-slate-200 mx-1"></div>
                <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-500">AJ</div>
                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-blue-600">+</div>
                </div>
            </div>
            <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="h-8 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-slate-900/10 transition-colors cursor-pointer">
                    New Application
                </div>
            </div>
        </div>

        {/* Kanban Columns */}
        <div className="flex-1 p-6 grid grid-cols-3 gap-5 overflow-hidden">
            {/* Wishlist Column */}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center mb-1 px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Wishlist</span>
                    </div>
                    <span className="text-slate-400 text-[10px] font-bold">3</span>
                </div>
                <div className="space-y-3 overflow-hidden">
                    <JobCard title="Product Lead" company="Spotify" color="bg-[#1ED760]" initials="Sp" daysAgo="2d" tags={['Remote']} />
                    <JobCard title="Senior UX Designer" company="Google" color="bg-[#4285F4]" initials="G" daysAgo="5d" tags={['$180k+']} />
                </div>
            </div>

            {/* Applied Column */}
            <div className="flex flex-col gap-3">
                 <div className="flex justify-between items-center mb-1 px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Applied</span>
                    </div>
                    <span className="text-slate-400 text-[10px] font-bold">8</span>
                </div>
                <div className="space-y-3 overflow-hidden">
                    <JobCard title="Frontend Engineer" company="Notion" color="bg-slate-800" initials="N" daysAgo="1d" />
                    <JobCard title="Full Stack Dev" company="Stripe" color="bg-[#635BFF]" initials="S" daysAgo="3d" />
                    <div className="bg-slate-100/50 border border-dashed border-slate-300 rounded-xl h-24 flex items-center justify-center text-slate-400 text-xs font-medium">
                        + 6 more
                    </div>
                </div>
            </div>

             {/* Interview Column */}
            <div className="flex flex-col gap-3">
                 <div className="flex justify-between items-center mb-1 px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Interview</span>
                    </div>
                    <span className="text-slate-400 text-[10px] font-bold">2</span>
                </div>
                <motion.div 
                    initial={{ y: 10, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.4 }}
                    className="bg-white p-4 rounded-xl border-l-4 border-l-violet-500 shadow-[0_4px_20px_rgba(124,58,237,0.15)] flex flex-col gap-3 relative"
                >
                    <div className="flex justify-between items-start">
                        <div className="w-9 h-9 rounded-lg bg-[#FF5A5F] flex items-center justify-center text-white font-bold text-sm shadow-sm">A</div>
                        <span className="text-[9px] text-violet-700 font-bold bg-violet-50 px-2 py-1 rounded-md border border-violet-100">Final Round</span>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-800 leading-tight">Staff Engineer</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">Airbnb</div>
                    </div>
                    <div className="mt-1 bg-slate-50 rounded-lg p-2 flex items-center gap-2 border border-slate-100">
                        <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-[10px]">📅</div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-700">Tomorrow, 2:00 PM</div>
                            <div className="text-[8px] text-slate-400">System Design Interview</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </div>
);

const TransformationShowcase: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FeatureTab>('writer');
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setActiveTab(current => {
                const currentIndex = features.findIndex(f => f.id === current);
                const nextIndex = (currentIndex + 1) % features.length;
                return features[nextIndex].id;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    return (
        <section className="py-24 bg-[#F2F1ED] overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Your Career Toolkit</h2>
                    <h3 className="text-4xl font-display font-bold text-slate-900 sm:text-5xl tracking-tight">
                        Everything You Need to Get Hired
                    </h3>
                    <p className="mt-4 text-lg text-slate-600">
                        HuntDesk replaces your scattered documents, spreadsheets, and notes with one cohesive, intelligent system.
                    </p>
                </div>

                {/* Main Showcase Layout */}
                <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl shadow-slate-300/40 border border-slate-200/60 overflow-hidden flex flex-col md:flex-row h-[700px] md:h-[600px]">
                    
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-1/3 bg-white border-b md:border-b-0 md:border-r border-slate-100 p-8 flex flex-col justify-center gap-2">
                        {features.map((feature) => {
                            const isActive = activeTab === feature.id;
                            return (
                                <button
                                    key={feature.id}
                                    onClick={() => {
                                        setActiveTab(feature.id);
                                        setIsAutoPlaying(false);
                                    }}
                                    className={`text-left p-5 rounded-2xl transition-all duration-300 group ${
                                        isActive 
                                            ? 'bg-[#F7F9FC] ring-1 ring-slate-200' 
                                            : 'bg-transparent hover:bg-slate-50 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <div className={`flex items-center gap-3 mb-2`}>
                                        <div className={`p-2.5 rounded-xl transition-colors ${isActive ? 'bg-white shadow-sm border border-slate-100' : 'bg-slate-100 group-hover:bg-white group-hover:shadow-sm'}`}>
                                            {feature.icon(isActive ? false : false)} 
                                        </div>
                                        <span className={`font-bold text-base ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                                            {feature.title}
                                        </span>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${isActive ? 'text-slate-600' : 'text-slate-400 hidden md:block'}`}>
                                        {feature.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Visual Stage */}
                    <div className="flex-1 bg-[#F7F9FC] relative overflow-hidden flex items-center justify-center p-8">
                        {/* App Window Frame */}
                        <motion.div 
                            layout
                            className="w-full h-full bg-white rounded-2xl shadow-2xl shadow-slate-300/50 border border-slate-200 overflow-hidden flex flex-col"
                        >
                            {/* Window Title Bar */}
                            <div className="h-9 bg-white border-b border-slate-100 flex items-center px-4 gap-2 shrink-0">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] border border-black/10" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] border border-black/10" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] border border-black/10" />
                                </div>
                                <div className="flex-1 text-center">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-slate-50 rounded-md border border-slate-100">
                                        <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                                        <span className="text-[10px] font-medium text-slate-500">huntdesk.app</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Content */}
                            <div className="flex-1 relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full h-full"
                                    >
                                        {activeTab === 'writer' && <AiRewriterShowcase />}
                                        {activeTab === 'matcher' && <div className="h-full flex items-center justify-center bg-slate-50/30 p-6"><JobMatchGraphic /></div>}
                                        {activeTab === 'tracker' && <CareerHubVisual />}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TransformationShowcase;