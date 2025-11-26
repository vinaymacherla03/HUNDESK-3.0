import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeData, TemplateKey, Customization, ResumeSectionKey } from '../types';
import TemplateSelector from './TemplateSelector';
import CustomizationPanel from './CustomizationPanel';
import SectionReorder from './SectionReorder';
import PremiumButton from './builder/PremiumButton';
import AccordionItem from './AccordionItem';
import AICompactor from './builder/AICompactor';
import JobMatchAnalyzer from './builder/JobMatchAnalyzer';
import SparkleIcon from './icons/SparkleIcon';
import DownloadDropdown from './DownloadDropdown';

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
}) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>('ai-tools');

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <aside className="w-full md:w-96 bg-white border-l border-slate-200 flex flex-col flex-shrink-0 h-full print-hide">
            <fieldset disabled={isLoading} className="group flex flex-col flex-grow overflow-hidden">
                <header className="px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Customize Your Resume</h2>
                </header>
                
                <div className="flex-grow p-4 space-y-2 overflow-y-auto transition-opacity group-disabled:opacity-50 group-disabled:cursor-not-allowed custom-scrollbar bg-slate-50">
                    <AccordionItem
                        id="ai-tools"
                        title="AI Assistants"
                        isOpen={openAccordion === 'ai-tools'}
                        toggleAccordion={toggleAccordion}
                    >
                       <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-slate-600 mb-2">AI Content Compactor</h4>
                                <AICompactor onCompact={onCompactResume} />
                            </div>
                            <div className="border-t border-slate-200 pt-6">
                                <h4 className="text-sm font-semibold text-slate-600 mb-2">AI Review</h4>
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
                        </div>
                    </AccordionItem>
                    <AccordionItem
                        id="job-match"
                        title="Job Match Analyzer"
                        isOpen={openAccordion === 'job-match'}
                        toggleAccordion={toggleAccordion}
                    >
                        <JobMatchAnalyzer resumeData={resumeData} jobDescription={jobDescription} onJobDescriptionChange={onJobDescriptionChange} />
                    </AccordionItem>
                    <AccordionItem
                        id="template"
                        title="Template"
                        isOpen={openAccordion === 'template'}
                        toggleAccordion={toggleAccordion}
                    >
                        <TemplateSelector currentTemplate={template} onTemplateChange={setTemplate} resumeData={resumeData} />
                    </AccordionItem>
                    
                     <AccordionItem
                        id="style"
                        title="Style & Formatting"
                        isOpen={openAccordion === 'style'}
                        toggleAccordion={toggleAccordion}
                    >
                        <CustomizationPanel customization={customization} setCustomization={setCustomization} />
                    </AccordionItem>

                    <AccordionItem
                        id="layout"
                        title="Manage Sections"
                        isOpen={openAccordion === 'layout'}
                        toggleAccordion={toggleAccordion}
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