
import React from 'react'; // Removed useState, now a prop
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeData, TemplateKey, Customization, ResumeSectionKey } from '../types';
import CustomizationPanel from './CustomizationPanel';
import SectionReorder from './SectionReorder';
import PremiumButton from './builder/PremiumButton';
import AccordionItem from './AccordionItem';
import AICompactor from './builder/AICompactor';
import JobMatchAnalyzer from './builder/JobMatchAnalyzer';
import SparkleIcon from './icons/SparkleIcon';
import DownloadDropdown from './DownloadDropdown';
import TemplateSelector from './TemplateSelector';
import { AiOrbIcon, TargetIcon, TemplatesIcon, StyleIcon, SectionsIcon } from './icons/ThreeDIcons';

type SaveStatus = 'idle' | 'saving' | 'saved';

interface ControlPanelProps {
    template: TemplateKey;
    setTemplate: (template: TemplateKey) => void;
    customization: Customization;
    setCustomization: (customization: Customization) => void;
    sectionOrder: ResumeSectionKey[];
    setSectionOrder: (order: ResumeSectionKey[]) => void;
    sectionVisibility: Record<ResumeSectionKey, boolean>;
    onSectionVisibilityChange: (section: ResumeSectionKey, isVisible: boolean) => void;
    resumeData: ResumeData;
    isLoading: boolean;
    onStartOver: () => void;
    saveStatus: SaveStatus;
    onCompactResume: () => Promise<void>;
    onRunAudit: () => void;
    isAuditLoading: boolean;
    onGenerateCoverLetter: () => void;
    isCoverLetterLoading: boolean;
    jobDescription: string;
    onJobDescriptionChange: (jd: string) => void;
    openAccordion: string | null; // Now a prop
    setOpenAccordion: (id: string | null) => void; // Now a prop
    onGenerateInterviewPrep: () => void;
    isInterviewPrepLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    template,
    setTemplate,
    customization,
    setCustomization,
    sectionOrder,
    setSectionOrder,
    sectionVisibility,
    onSectionVisibilityChange,
    isLoading,
    onStartOver,
    saveStatus,
    resumeData,
    onCompactResume,
    onRunAudit,
    isAuditLoading,
    onGenerateCoverLetter,
    isCoverLetterLoading,
    jobDescription,
    onJobDescriptionChange,
    openAccordion, // Destructure from props
    setOpenAccordion, // Destructure from props
    onGenerateInterviewPrep,
    isInterviewPrepLoading,
}) => {
    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <aside className="w-full md:w-[360px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 h-full print-hide">
            <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Resume Editor</h2>
                <AnimatePresence>
                    {saveStatus === 'saving' && (
                        <motion.span
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="text-xs text-slate-500 flex items-center gap-1"
                        >
                            <svg className="animate-spin h-3 w-3 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Saving...
                        </motion.span>
                    )}
                    {saveStatus === 'saved' && (
                        <motion.span
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="text-xs text-emerald-600 flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Saved
                        </motion.span>
                    )}
                </AnimatePresence>
            </header>
            
            <fieldset disabled={isLoading} className="group flex flex-col flex-grow overflow-hidden">
                <div className="flex-grow p-4 space-y-2 overflow-y-auto transition-opacity group-disabled:opacity-50 group-disabled:cursor-not-allowed custom-scrollbar bg-slate-50">
                    
                    <AccordionItem
                        id="template"
                        title="Templates"
                        isOpen={openAccordion === 'template'}
                        toggleAccordion={toggleAccordion}
                        icon={<TemplatesIcon />}
                        badge={null}
                    >
                        <TemplateSelector currentTemplate={template} onTemplateChange={setTemplate} resumeData={resumeData} />
                    </AccordionItem>

                    <AccordionItem
                        id="style"
                        title="Style & Formatting"
                        isOpen={openAccordion === 'style'}
                        toggleAccordion={toggleAccordion}
                        icon={<StyleIcon />}
                    >
                        <CustomizationPanel customization={customization} setCustomization={setCustomization} />
                    </AccordionItem>

                    <AccordionItem
                        id="layout"
                        title="Manage Sections"
                        isOpen={openAccordion === 'layout'}
                        toggleAccordion={toggleAccordion}
                        icon={<SectionsIcon />}
                    >
                        <p className="text-xs text-slate-500 mb-3">Drag to reorder, or use the toggle to hide/show a section.</p>
                        <SectionReorder 
                            order={sectionOrder} 
                            onOrderChange={setSectionOrder} 
                            visibility={sectionVisibility}
                            onVisibilityChange={onSectionVisibilityChange}
                            isLoading={isLoading}
                        />
                    </AccordionItem>

                    <AccordionItem
                        id="ai-tools"
                        title="AI Tools"
                        isOpen={openAccordion === 'ai-tools'}
                        toggleAccordion={toggleAccordion}
                        icon={<AiOrbIcon />}
                        badge={<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">Premium</span>}
                    >
                       <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-slate-600 mb-2">AI Content Compactor</h4>
                                <AICompactor onCompact={onCompactResume} />
                            </div>
                            <div className="border-t border-slate-200 pt-6">
                                <h4 className="text-sm font-semibold text-slate-600 mb-2">AI Resume Audit</h4>
                                <p className="text-xs text-slate-500 mb-3">Get a full analysis of your resume, including a score and actionable feedback.</p>
                                <PremiumButton onClick={onRunAudit} disabled={isAuditLoading}>
                                    {isAuditLoading ? 'Auditing...' : 'Run AI Audit'}
                                </PremiumButton>
                            </div>
                            <div className="border-t border-slate-200 pt-6">
                                <h4 className="text-sm font-semibold text-slate-600 mb-2">AI Cover Letter Generator</h4>
                                 <textarea
                                    rows={4}
                                    value={jobDescription}
                                    onChange={(e) => onJobDescriptionChange(e.target.value)}
                                    className="block w-full text-xs p-2 border border-slate-300 rounded-md shadow-sm mb-3"
                                    placeholder="Paste job description here to generate a tailored cover letter..."
                                />
                                <PremiumButton onClick={onGenerateCoverLetter} disabled={isCoverLetterLoading || !jobDescription.trim()}>
                                    {isCoverLetterLoading ? 'Generating...' : 'Generate Cover Letter'}
                                </PremiumButton>
                            </div>
                            <div className="border-t border-slate-200 pt-6">
                                <h4 className="text-sm font-semibold text-slate-600 mb-2">AI Interview Prep</h4>
                                <p className="text-xs text-slate-500 mb-3">Generate targeted interview questions and get AI feedback on your answers.</p>
                                <PremiumButton onClick={onGenerateInterviewPrep} disabled={isInterviewPrepLoading || !jobDescription.trim()}>
                                    {isInterviewPrepLoading ? 'Generating Questions...' : 'Start Interview Prep'}
                                </PremiumButton>
                            </div>
                        </div>
                    </AccordionItem>
                    
                    <AccordionItem
                        id="job-match"
                        title="Job Match Analyzer"
                        isOpen={openAccordion === 'job-match'}
                        toggleAccordion={toggleAccordion}
                        icon={<TargetIcon />}
                    >
                        <JobMatchAnalyzer resumeData={resumeData} jobDescription={jobDescription} onJobDescriptionChange={onJobDescriptionChange} />
                    </AccordionItem>
                    
                </div>
                
                <div className="p-4 border-t border-slate-200 bg-white/70 backdrop-blur-sm flex flex-col gap-3 shrink-0">
                    <DownloadDropdown resumeData={resumeData} />
                     <motion.button 
                        onClick={onStartOver} 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        Start Over
                    </motion.button>
                </div>
            </fieldset>
        </aside>
    );
};

export default ControlPanel;
