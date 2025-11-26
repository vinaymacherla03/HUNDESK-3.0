
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SparkleIcon from './icons/SparkleIcon';

interface ResumeInputProps {
  onEnhance: (resumeText: string, jobDescription: string, jobTitle: string) => void;
  onTryDemo: () => void;
  draftExists: boolean;
  onLoadDraft: () => void;
}

type ActiveTab = 'resume' | 'job';

const sampleResume = `Sarah Chen
Product Manager
sarah.chen.pm@example.com | 555-123-4567 | linkedin.com/in/sarahchenpm

SUMMARY
Product manager with over 5 years of experience in fast-paced tech environments. I am passionate about building user-centric products and leading cross-functional teams to deliver value. Experience in both B2B SaaS and B2C mobile applications.

EXPERIENCE

Innovate Inc. - San Francisco, CA
Product Manager (June 2020 - Present)
- Owned the product roadmap for the company's flagship mobile application (iOS and Android).
- Wrote PRDs, user stories, and acceptance criteria for new features.
- Worked with engineering, design, and marketing to launch features.
- Launched a new user onboarding flow which improved user retention.
- Analyzed user data to find insights for new feature development.

Data Corp - Palo Alto, CA
Associate Product Manager (July 2018 - June 2020)
- Assisted senior PMs on a B2B analytics dashboard product.
- Conducted market research and competitive analysis.
- Managed the bug backlog and feature request triage process.

EDUCATION
University of California, Berkeley - Berkeley, CA
Bachelor of Arts in Economics (May 2018)

SKILLS
- Product Roadmapping, Agile Methodologies, JIRA, Figma, Mixpanel, SQL, A/B Testing, User Research
`;

// --- Sub Components for cleaner architecture ---

const BackgroundMesh = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-violet-400/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-fuchsia-400/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] bg-cyan-400/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
    </div>
);

const FeatureItem: React.FC<{ text: string; icon: React.ReactNode; colorClass: string }> = ({ text, icon, colorClass }) => (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-default">
        <div className={`p-1.5 rounded-md ${colorClass} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{text}</span>
    </div>
);

const SegmentedControl: React.FC<{ activeTab: ActiveTab; onChange: (tab: ActiveTab) => void }> = ({ activeTab, onChange }) => (
    <div className="bg-slate-100/80 p-1 rounded-xl flex items-center w-full sm:w-auto shadow-inner border border-slate-200/50">
        {(['resume', 'job'] as ActiveTab[]).map((tab) => (
            <button
                key={tab}
                type="button"
                onClick={() => onChange(tab)}
                className={`relative flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 overflow-hidden outline-none focus-visible:ring-2 ring-violet-500 ${
                    activeTab === tab ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                {activeTab === tab && (
                    <motion.div
                        layoutId="active-tab-pill"
                        className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {tab === 'resume' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    )}
                    {tab === 'resume' ? 'Paste Resume' : 'Job Description'}
                </span>
            </button>
        ))}
    </div>
);

// --- Main Component ---

const ResumeInput: React.FC<ResumeInputProps> = ({ onEnhance, onTryDemo, draftExists, onLoadDraft }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('resume');
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError("Please paste your resume text first.");
      return;
    }
    onEnhance(resumeText, jobDescription, jobTitle);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans text-slate-900 relative overflow-x-hidden selection:bg-violet-200 selection:text-violet-900">
      <BackgroundMesh />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative z-10">
        
        {/* Page Header */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 max-w-3xl"
        >
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">AI Architect V2.0</span>
           </div>
           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight leading-[1.1] mb-4">
               Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">career story</span>.
           </h1>
           <p className="text-lg text-slate-500 font-medium max-w-xl">
               Transform raw text into a powerful, ATS-optimized resume in seconds. No formatting headaches, just results.
           </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT PANEL: The Workspace (8 Columns) */}
            <motion.div 
                className="lg:col-span-8 flex flex-col gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                {/* Job Title Field */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-2xl opacity-50 group-focus-within:opacity-100 transition duration-500 blur"></div>
                    <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm p-1 flex items-center">
                        <div className="pl-4 pr-2 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="block w-full py-3 px-2 text-lg font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none bg-transparent"
                            placeholder="Target Job Title (e.g. Senior Product Designer)"
                        />
                    </div>
                </div>

                {/* Main Editor Card */}
                <div className={`relative bg-white/80 backdrop-blur-xl rounded-3xl border transition-all duration-500 flex flex-col min-h-[600px] shadow-2xl shadow-slate-200/50 ${isFocused ? 'border-violet-400/50 ring-4 ring-violet-500/5' : 'border-white/60'}`}>
                    
                    {/* Editor Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-b border-slate-100/80">
                        <SegmentedControl activeTab={activeTab} onChange={setActiveTab} />
                        
                        {activeTab === 'resume' && (
                             <button
                                type="button"
                                onClick={() => setResumeText(sampleResume)}
                                className="text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-100 px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 group"
                            >
                                <SparkleIcon className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                                Load Sample Data
                            </button>
                        )}
                    </div>

                    {/* Text Area Container */}
                    <div className="flex-grow relative group">
                         <AnimatePresence mode="wait">
                            {activeTab === 'resume' ? (
                                <motion.div
                                    key="resume"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 flex flex-col"
                                >
                                    <textarea
                                        value={resumeText}
                                        onChange={(e) => { setResumeText(e.target.value); if(error) setError(null); }}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        className="flex-grow w-full p-6 sm:p-8 bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-300 font-mono text-sm leading-relaxed resize-none"
                                        placeholder={`// PASTE YOUR RESUME HERE\n\nExperience\n- Managed a team of 5...\n- Increased revenue by 20%...\n\nEducation\n...`}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="job"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 flex flex-col"
                                >
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        className="flex-grow w-full p-6 sm:p-8 bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-300 font-mono text-sm leading-relaxed resize-none"
                                        placeholder={`// PASTE JOB DESCRIPTION HERE\n\nWe are looking for a candidate who...\n- Has experience with React\n- Can lead teams...`}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Toast */}
                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    className="absolute bottom-6 left-6 right-6 bg-rose-500 text-white px-4 py-3 rounded-xl shadow-lg shadow-rose-500/20 flex items-center gap-3 z-20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    <span className="text-sm font-bold">{error}</span>
                                    <button onClick={() => setError(null)} className="ml-auto hover:bg-rose-600 p-1 rounded-lg transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Status */}
                    <div className="px-6 py-3 border-t border-slate-100/80 bg-slate-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isFocused ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isFocused ? 'Writing...' : 'Idle'}</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 font-mono">
                            {activeTab === 'resume' ? resumeText.length : jobDescription.length} CHARS
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* RIGHT PANEL: Command Center (4 Columns) */}
            <motion.div 
                className="lg:col-span-4 lg:sticky lg:top-8 space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {/* Action Card */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="mb-6">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-900/20">
                                <SparkleIcon className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to launch?</h2>
                            <p className="text-sm text-slate-500 leading-relaxed">Our AI agent is ready to restructure your data. We'll fix grammar, optimize for ATS, and apply professional formatting.</p>
                        </div>

                        <motion.button
                            type="submit"
                            className="w-full relative overflow-hidden rounded-xl bg-slate-900 text-white font-bold py-4 px-6 shadow-xl shadow-slate-900/20 group/btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                            <span className="relative flex items-center justify-center gap-2">
                                Enhance My Resume
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </span>
                        </motion.button>
                    </div>
                    
                    {/* Card Background Decoration */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full opacity-50 blur-2xl pointer-events-none" />
                </div>

                {/* Features Checklist */}
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-slate-200/60">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Processing Steps</h3>
                    <div className="space-y-1">
                        <FeatureItem 
                            text="ATS Keyword Optimization" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>} 
                            colorClass="text-blue-600 bg-blue-500" 
                        />
                        <FeatureItem 
                            text="Grammar & Spell Check" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M2 15h10"></path><path d="M9 18l3-3-3-3"></path></svg>} 
                            colorClass="text-emerald-600 bg-emerald-500" 
                        />
                        <FeatureItem 
                            text="Impact Scoring" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>} 
                            colorClass="text-fuchsia-600 bg-fuchsia-500" 
                        />
                    </div>
                </div>

                {/* Drafts & Demo */}
                <div className="grid grid-cols-2 gap-3">
                     {draftExists && (
                        <motion.button
                            type="button"
                            onClick={onLoadDraft}
                            whileHover={{ y: -2 }}
                            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all text-left"
                        >
                            <div className="w-8 h-8 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                            </div>
                            <div className="font-bold text-slate-900 text-sm">Load Draft</div>
                            <div className="text-[10px] text-slate-500 font-medium">Continue where you left</div>
                        </motion.button>
                     )}
                     <motion.button
                        type="button"
                        onClick={onTryDemo}
                        whileHover={{ y: -2 }}
                        className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all text-left"
                    >
                        <div className="w-8 h-8 bg-cyan-50 text-cyan-600 rounded-lg flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                        <div className="font-bold text-slate-900 text-sm">Try Demo</div>
                        <div className="text-[10px] text-slate-500 font-medium">See it in action</div>
                    </motion.button>
                </div>

            </motion.div>

        </form>
      </div>
    </div>
  );
};

export default ResumeInput;
