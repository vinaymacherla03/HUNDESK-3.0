
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobApplication, ResumeData } from '../../types';
import SparkleIcon from '../icons/SparkleIcon';

interface JobTrackerProps {
    resumeData: ResumeData;
    initialTab?: 'board' | 'discover';
}

const initialJobs: JobApplication[] = [
    { id: '1', company: 'Google', role: 'Senior Engineer', status: 'Interviewing', dateAdded: '2 days ago', location: 'Mountain View, CA', salary: '$180k - $240k' },
    { id: '2', company: 'Spotify', role: 'Product Manager', status: 'Applied', dateAdded: '1 week ago', location: 'Remote', salary: 'Competitive' },
    { id: '3', company: 'Netflix', role: 'UX Designer', status: 'Saved', dateAdded: '2 weeks ago', location: 'Los Gatos, CA' },
    { id: '4', company: 'Airbnb', role: 'Staff Engineer', status: 'Saved', dateAdded: '3 days ago', location: 'San Francisco, CA', salary: '$220k+' },
];

const JobCard: React.FC<{ 
    job: JobApplication; 
    onMove?: (id: string, status: JobApplication['status']) => void;
    onDelete?: (id: string) => void; 
}> = ({ job, onMove, onDelete }) => {
    
    const getActionConfig = () => {
        switch(job.status) {
            case 'Saved':
                return { label: 'Apply Now', nextStatus: 'Applied' as const, icon: '🚀' };
            case 'Applied':
                return { label: 'Interview', nextStatus: 'Interviewing' as const, icon: '📅' };
            case 'Interviewing':
                return { label: 'Offer', nextStatus: 'Offer' as const, icon: '🎉' };
            default:
                return null;
        }
    };

    const action = getActionConfig();

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
        >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                        job.company === 'Google' ? 'bg-blue-500' :
                        job.company === 'Spotify' ? 'bg-emerald-500' :
                        job.company === 'Netflix' ? 'bg-red-600' :
                        'bg-slate-800'
                    }`}>
                        {job.company.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{job.role}</h4>
                        <p className="text-xs text-slate-500 font-medium">{job.company}</p>
                    </div>
                </div>
                <button 
                    onClick={() => onDelete?.(job.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-opacity p-1"
                    title="Remove"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Metadata */}
            <div className="space-y-1.5 mb-4">
                {job.location && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {job.location}
                    </div>
                )}
                {job.salary && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {job.salary}
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                <span className="text-[10px] text-slate-400 font-medium">{job.dateAdded}</span>
                
                {action && onMove && (
                    <button 
                        onClick={() => onMove(job.id, action.nextStatus)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-violet-600 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
                    >
                        <span>{action.label}</span>
                        <span>{action.icon}</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
};

const KanbanColumn: React.FC<{ 
    title: string; 
    jobs: JobApplication[]; 
    status: JobApplication['status'];
    color: string;
    icon: React.ReactNode;
    onMove: (id: string, status: JobApplication['status']) => void;
    onDelete: (id: string) => void;
}> = ({ title, jobs, status, color, icon, onMove, onDelete }) => {
    return (
        <div className="flex flex-col w-80 min-w-[320px] h-full">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                        {icon}
                    </div>
                    <h3 className="font-bold text-slate-700 text-sm">{title}</h3>
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{jobs.length}</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                </button>
            </div>
            
            <div className="flex-1 bg-slate-100/50 border border-slate-200/60 rounded-2xl p-3 overflow-y-auto custom-scrollbar space-y-3">
                <AnimatePresence mode="popLayout">
                    {jobs.map(job => (
                        <JobCard key={job.id} job={job} onMove={onMove} onDelete={onDelete} />
                    ))}
                </AnimatePresence>
                
                {jobs.length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-xs font-medium">No jobs yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const JobTracker: React.FC<JobTrackerProps> = ({ resumeData, initialTab = 'board' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [jobs, setJobs] = useState<JobApplication[]>(initialJobs);

    const handleMoveJob = (id: string, newStatus: JobApplication['status']) => {
        setJobs(prev => prev.map(job => job.id === id ? { ...job, status: newStatus } : job));
    };

    const handleDeleteJob = (id: string) => {
        setJobs(prev => prev.filter(job => job.id !== id));
    };

    return (
        <div className="h-full flex flex-col font-sans bg-slate-50">
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('board')} 
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'board' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Pipeline
                    </button>
                    <button 
                        onClick={() => setActiveTab('discover')} 
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'discover' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Discover
                    </button>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                    Add Job manually
                </button>
            </div>

            <div className="flex-1 p-6 overflow-x-auto overflow-y-hidden">
                {activeTab === 'board' ? (
                    <div className="flex gap-6 h-full">
                        <KanbanColumn 
                            title="Wishlist" 
                            status="Saved"
                            color="bg-slate-500"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>}
                            jobs={jobs.filter(j => j.status === 'Saved')}
                            onMove={handleMoveJob}
                            onDelete={handleDeleteJob}
                        />
                        <KanbanColumn 
                            title="Applied" 
                            status="Applied"
                            color="bg-blue-500"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            jobs={jobs.filter(j => j.status === 'Applied')}
                            onMove={handleMoveJob}
                            onDelete={handleDeleteJob}
                        />
                        <KanbanColumn 
                            title="Interviewing" 
                            status="Interviewing"
                            color="bg-violet-500"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                            jobs={jobs.filter(j => j.status === 'Interviewing')}
                            onMove={handleMoveJob}
                            onDelete={handleDeleteJob}
                        />
                         <KanbanColumn 
                            title="Offer" 
                            status="Offer"
                            color="bg-emerald-500"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            jobs={jobs.filter(j => j.status === 'Offer')}
                            onMove={handleMoveJob}
                            onDelete={handleDeleteJob}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                            <SparkleIcon className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">AI Job Search</h3>
                        <p className="text-slate-500 text-sm mt-2 max-w-xs">Enter your role to find tailored opportunities from across the web.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobTracker;
