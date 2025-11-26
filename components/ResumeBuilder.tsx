
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeData, TemplateKey, Customization, ResumeSectionKey, AuditResult, InterviewQuestion } from '../types';
import { compactResumeContent, runResumeAudit, generateCoverLetter, generateAgentSuggestion, generateInterviewQuestions } from '../services/geminiService';
import { templates as allTemplates } from './templates/templateData';
import { ResumeContext } from './builder/ResumeContext';

import ResumePreview from './ResumePreview';
import ControlPanel from './ControlPanel';
import JobTracker from './builder/JobTracker';
// import TemplateToolbar from './builder/TemplateToolbar'; // Removed, template selection is now in ControlPanel
import AiAuditModal from './builder/AiAuditModal';
import CoverLetterModal from './builder/CoverLetterModal';
import RewriteSuggestionModal from './builder/RewriteSuggestionModal';
import InterviewPrepModal from './builder/InterviewPrepModal';
import VoiceAgent from './builder/VoiceAgent';
import AiAgentBubble from './builder/AiAgentBubble';

const DRAFT_STORAGE_KEY = 'aiResumeBuilderDraft';
const PREFERENCES_STORAGE_KEY = 'aiResumeBuilderPreferences';
const ALL_SECTIONS: ResumeSectionKey[] = ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'awards'];

interface ResumeBuilderProps {
  initialData: ResumeData;
  initialDraft?: any | null;
  onStartOver: () => void;
  initialJobDescription?: string;
}

const defaultCustomization: Customization = {
    color: 'slate', font: 'inter', margin: 'normal', nameSize: 28, titleSize: 16, sectionTitleSize: 14,
    itemTitleSize: 11.5, bodySize: 10.5, lineHeight: 1.5, sectionTitleColor: '#374151',
    sectionTitleBorderStyle: 'underline', sectionTitleBorderColor: '#d1d5db', sectionTitleUppercase: true,
};

type ViewMode = 'editor' | 'search' | 'board';

const loadPreferences = () => {
    try { return JSON.parse(localStorage.getItem(PREFERENCES_STORAGE_KEY) || 'null'); } catch { return null; }
};

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ initialData, initialDraft, onStartOver, initialJobDescription }) => {
    const [resumeData, setResumeData] = useState<ResumeData>(initialDraft?.resumeData || initialData);
    const [jobDescription, setJobDescription] = useState<string>(initialDraft?.jobDescription || initialJobDescription || '');
    const [activeMode, setActiveMode] = useState<ViewMode>('editor');
    const [zoom, setZoom] = useState(0.85);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [openAccordion, setOpenAccordion] = useState<string | null>('template'); // Default to templates open
    const [template, setTemplate] = useState<TemplateKey>(() => initialDraft?.template || loadPreferences()?.template || 'json-flat'); // Default to json-flat
    const [customization, setCustomization] = useState<Customization>(() => {
        const prefs = loadPreferences();
        const defaultTemplateCustomization = allTemplates.find(t => t.key === template)?.customization || {};
        return { ...defaultCustomization, ...defaultTemplateCustomization, ...(prefs?.customization || {}) };
    });
    const [sectionOrder, setSectionOrder] = useState<ResumeSectionKey[]>(initialDraft?.sectionOrder || ALL_SECTIONS);
    const [sectionVisibility, setSectionVisibility] = useState<Record<ResumeSectionKey, boolean>>(initialDraft?.sectionVisibility || { summary: true, experience: true, education: true, skills: true, projects: true, certifications: true, awards: true });
    
    const [isCompacting, setIsCompacting] = useState(false);
    const [isAuditLoading, setIsAuditLoading] = useState(false);
    const [isCoverLetterLoading, setIsCoverLetterLoading] = useState(false);
    const [isInterviewPrepLoading, setIsInterviewPrepLoading] = useState(false);
    
    const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
    const [coverLetterContent, setCoverLetterContent] = useState<string | null>(null);
    const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[] | null>(null);
    
    const [rewriteModalState, setRewriteModalState] = useState<any | null>(null);
    const [isThinkingPath, setIsThinkingPath] = useState<string | null>(null);

    // AI Agent Bubble State
    const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);

    useEffect(() => {
        setSaveStatus('saving');
        const timer = setTimeout(() => {
            localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ resumeData, template, customization, sectionOrder, sectionVisibility, jobDescription }));
            localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify({ template, customization })); // Save preferences separately
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
        return () => clearTimeout(timer);
    }, [resumeData, template, customization, sectionOrder, sectionVisibility, jobDescription]);

    const handleDataChange = (path: string, value: any) => {
        setResumeData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
            let current: any = newData;
            for (let i = 0; i < keys.length - 1; i++) { current = current[keys[i]]; }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const handleCompactResume = async () => {
        setIsCompacting(true);
        try { setResumeData(await compactResumeContent(resumeData)); } catch (e) { console.error(e); } finally { setIsCompacting(false); }
    };
    
    const handleRunAudit = async () => {
        setIsAuditLoading(true);
        try { setAuditResult(await runResumeAudit(resumeData)); } catch (e) { console.error(e); } finally { setIsAuditLoading(false); }
    };

    const handleGenerateCoverLetter = async () => {
        setIsCoverLetterLoading(true);
        try { setCoverLetterContent(await generateCoverLetter(resumeData, jobDescription)); } catch (e) { console.error(e); } finally { setIsCoverLetterLoading(false); }
    };

    const handleGenerateInterviewPrep = async () => {
        setIsInterviewPrepLoading(true);
        try { setInterviewQuestions(await generateInterviewQuestions(resumeData, jobDescription)); } catch (e) { console.error(e); } finally { setIsInterviewPrepLoading(false); }
    };

    const handleRewrite = async (path: string, originalText: string, type: 'summary' | 'bullet', mode: 'IMPACT' | 'CONCISE' = 'IMPACT') => {
        if (!originalText.trim()) return;
        setIsThinkingPath(path);
        try {
            let result;
            if (type === 'summary') {
                 result = await generateAgentSuggestion('WRITE_SUMMARY', { resume: resumeData, jobDescription, currentSummary: originalText });
            } else {
                const promptType = mode === 'IMPACT' ? 'REWRITE_EXPERIENCE_BULLET_WITH_REASON' : 'COMPACT_EXPERIENCE_BULLET_WITH_REASON';
                result = await generateAgentSuggestion(promptType, { bulletPoint: originalText, jobDescription });
            }
            if (typeof result === 'object' && 'rewritten' in result) {
                setRewriteModalState({ isOpen: true, originalText, suggestion: result.rewritten, reason: result.reason, path });
            }
        } catch (error) { console.error(error); } finally { setIsThinkingPath(null); }
    };

    // Callback for VoiceAgent function calls
    const handleVoiceAgentFunctionCall = async (name: string, args: any): Promise<string> => {
        try {
            console.log(`VoiceAgent called function: ${name} with args:`, args);
            switch (name) {
                case 'changeStyle':
                    const parsedValue = args.property.includes('Size') || args.property.includes('lineHeight') ? parseFloat(args.value) : args.value;
                    setCustomization(prev => ({ ...prev, [args.property]: parsedValue }));
                    return `Changed ${args.property} to ${args.value}.`;
                case 'getSkillSuggestions':
                    if (!args.jobDescription) {
                        return "Please tell me the job description so I can suggest skills.";
                    }
                    const suggestions = await generateAgentSuggestion('GET_SKILL_SUGGESTIONS', { jobDescription: args.jobDescription });
                    return `Here are some skill suggestions: ${suggestions}`;
                case 'navigate':
                    // This assumes a simple navigation by section name.
                    // In a more complex UI, this might involve scrolling or showing specific forms.
                    setOpenAccordion(args.section); // If accordions are used for nav
                    return `Navigated to ${args.section} section.`;
                case 'setSectionVisibility':
                    // Fix: Directly update sectionVisibility state.
                    setSectionVisibility(prev => ({ ...prev, [args.section]: args.visible }));
                    return `Set ${args.section} section to ${args.visible ? 'visible' : 'hidden'}.`;
                default:
                    return `Unknown function: ${name}`;
            }
        } catch (error) {
            console.error('Error executing function from VoiceAgent:', error);
            return `Failed to execute ${name}. Error: ${error instanceof Error ? error.message : String(error)}`;
        }
    };


    return (
        <ResumeContext.Provider value={{ resumeData, jobDescription, onRewrite: handleRewrite, isThinkingPath }}>
            <div className="flex flex-col h-screen w-screen bg-[#F8FAFC] overflow-hidden pt-16"> {/* Added pt-16 for navbar */}
                {/* Top Navigation Bar / View Switcher */}
                <div className="absolute top-4 right-6 z-50 flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-sm">
                    <button onClick={() => setActiveMode('editor')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${activeMode === 'editor' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Editor</button>
                    <button onClick={() => setActiveMode('search')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${activeMode === 'search' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Jobs</button>
                </div>

                <div className="flex-1 relative h-full w-full overflow-hidden flex flex-col md:flex-row">
                    <AnimatePresence mode="wait">
                        {activeMode === 'editor' ? (
                            <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex">
                                {/* Control Panel (Left) */}
                                <div className="relative z-40 shrink-0 h-full w-full md:w-[360px]">
                                    <ControlPanel
                                        customization={customization} setCustomization={setCustomization}
                                        sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} sectionVisibility={sectionVisibility} onSectionVisibilityChange={(s, v) => setSectionVisibility(p => ({...p, [s]: v}))}
                                        resumeData={resumeData} isLoading={isCompacting} onStartOver={onStartOver} saveStatus={saveStatus}
                                        onCompactResume={handleCompactResume} onRunAudit={handleRunAudit} isAuditLoading={isAuditLoading}
                                        onGenerateCoverLetter={handleGenerateCoverLetter} isCoverLetterLoading={isCoverLetterLoading}
                                        onGenerateInterviewPrep={handleGenerateInterviewPrep} isInterviewPrepLoading={isInterviewPrepLoading}
                                        jobDescription={jobDescription} onJobDescriptionChange={setJobDescription} openAccordion={openAccordion} setOpenAccordion={setOpenAccordion}
                                        template={template} setTemplate={setTemplate}
                                    />
                                </div>

                                {/* Main Content Area (Center: Resume Preview) */}
                                <div className="flex-1 h-full flex flex-col relative bg-slate-100/50 overflow-hidden">
                                    <div className="relative w-full flex-1 overflow-y-auto custom-scrollbar flex justify-center pt-8 pb-32 px-4">
                                        <motion.div layout style={{ scale: zoom, transformOrigin: 'top center' }} className="shadow-2xl bg-white mb-20 origin-top h-max min-h-[11in] rounded-sm">
                                            <ResumePreview data={resumeData} template={template} customization={customization} sectionOrder={sectionOrder} sectionVisibility={sectionVisibility} onDataChange={handleDataChange} />
                                        </motion.div>
                                    </div>
                                    {/* Zoom Controls */}
                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-slate-200 flex items-center gap-2 z-30">
                                        <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 font-bold" aria-label="Zoom out">-</button>
                                        <span className="text-xs font-bold text-slate-700 w-10 text-center">{Math.round(zoom * 100)}%</span>
                                        <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 font-bold" aria-label="Zoom in">+</button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="jobs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full h-full pt-20 px-2 md:px-6 pb-6 bg-slate-50 relative">
                                <div className="max-w-7xl mx-auto h-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mt-4">
                                    <JobTracker resumeData={resumeData} initialTab={activeMode === 'search' ? 'discover' : 'board'} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {auditResult && <AiAuditModal result={auditResult} onClose={() => setAuditResult(null)} onRewrite={(path, text) => handleRewrite(path, text, 'bullet')} />}
                {coverLetterContent && <CoverLetterModal content={coverLetterContent} onClose={() => setCoverLetterContent(null)} />}
                {interviewQuestions && <InterviewPrepModal questions={interviewQuestions} role={resumeData.title || "Professional"} onClose={() => setInterviewQuestions(null)} />}
                {rewriteModalState?.isOpen && <RewriteSuggestionModal originalText={rewriteModalState.originalText} suggestion={rewriteModalState.suggestion} reason={rewriteModalState.reason} onClose={() => setRewriteModalState(null)} onApply={() => { handleDataChange(rewriteModalState.path, rewriteModalState.suggestion); setRewriteModalState(null); }} />}
                
                {/* AI Agent Bubble and Modal */}
                {!isAiAgentOpen && <AiAgentBubble onClick={() => setIsAiAgentOpen(true)} />}
                {/* FIX: Corrected setIsAiAgent to setIsAiAgentOpen */}
                <VoiceAgent isOpen={isAiAgentOpen} onClose={() => setIsAiAgentOpen(false)} currentStepKey={openAccordion || 'summary'} onApplySuggestion={handleDataChange} onFunctionCall={handleVoiceAgentFunctionCall} />
            </div>
        </ResumeContext.Provider>
    );
};

export default ResumeBuilder;