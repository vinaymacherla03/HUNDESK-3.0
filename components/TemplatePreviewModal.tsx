
import React from 'react';
import { motion } from 'framer-motion';
import { ResumeData } from '../types';
import { templates as allTemplates, TemplateInfo } from './templates/templateData'; // Import allTemplates with component info
import { Customization, ResumeSectionKey, ColorTheme, FontTheme } from '../types';

// Import all template components
import JsonResumeFlatTemplate from './templates/JsonResumeFlatTemplate';
import FlowSimpleTemplate from './templates/FlowSimpleTemplate';
import FlowModernTemplate from './templates/FlowModernTemplate';
import FlowProfessionalTemplate from './templates/FlowProfessionalTemplate';


const fontClassMap: Record<FontTheme, string> = {
  inter: 'font-sans', roboto: 'font-roboto', lato: 'font-lato', montserrat: 'font-montserrat', 'source-sans': 'font-source-sans', 'lora': 'font-lora', 'roboto-mono': 'font-roboto-mono',
};

const colorVarMap: Record<ColorTheme, React.CSSProperties> = {
  blue: { '--primary-color': '#2563eb', '--primary-color-light': '#dbeafe', '--primary-color-dark': '#1d4ed8', '--text-on-primary': '#ffffff' } as React.CSSProperties,
  indigo: { '--primary-color': '#4f46e5', '--primary-color-light': '#e0e7ff', '--primary-color-dark': '#3730a3', '--text-on-primary': '#ffffff' } as React.CSSProperties,
  emerald: { '--primary-color': '#059669', '--primary-color-light': '#d1fae5', '--primary-color-dark': '#047857', '--text-on-primary': '#ffffff' } as React.CSSProperties,
  rose: { '--primary-color': '#e11d48', '--primary-color-light': '#ffe4e6', '--primary-color-dark': '#be123c', '--text-on-primary': '#ffffff' } as React.CSSProperties,
  slate: { '--primary-color': '#475569', '--primary-color-light': '#f1f5f9', '--primary-color-dark': '#334155', '--text-on-primary': '#ffffff' } as React.CSSProperties,
  orange: {
    '--primary-color': '#f97316',
    '--primary-color-light': '#ffedd5',
    '--primary-color-dark': '#ea580c',
    '--text-on-primary': '#ffffff',
  } as React.CSSProperties,
  amber: {
    '--primary-color': '#f59e0b',
    '--primary-color-light': '#fef3c7',
    '--primary-color-dark': '#d97706',
    '--text-on-primary': '#ffffff',
  } as React.CSSProperties,
};

const defaultCustomization: Customization = {
    color: 'slate', font: 'inter', margin: 'normal', nameSize: 28, titleSize: 16,
    sectionTitleSize: 14, itemTitleSize: 11.5, bodySize: 10.5, lineHeight: 1.5,
    sectionTitleColor: '#374151', sectionTitleBorderStyle: 'underline',
    sectionTitleBorderColor: '#d1d5db', sectionTitleUppercase: true,
};

const ALL_SECTIONS: ResumeSectionKey[] = ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'awards'];

interface TemplatePreviewModalProps {
    template: TemplateInfo; // Use TemplateInfo which now includes 'component'
    onClose: () => void;
    onSelect: () => void;
    resumeData: ResumeData;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ template, onClose, onSelect, resumeData }) => {
    // Dynamically select the correct template component based on the key
    const TemplateComponent = allTemplates.find(t => t.key === template.key)?.component || JsonResumeFlatTemplate;

    const sectionVisibility = ALL_SECTIONS.reduce((acc, section) => ({...acc, [section]: true }), {} as Record<ResumeSectionKey, boolean>);
    const customization = { ...defaultCustomization, ...template.customization };
    const colorVars = colorVarMap[customization.color] || colorVarMap.slate;
    const fontClass = fontClassMap[customization.font] || 'font-sans';
    const dynamicStyles: React.CSSProperties = { ...colorVars, fontSize: `${customization.bodySize}pt`, lineHeight: customization.lineHeight, backgroundColor: 'white' };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-4xl h-[90vh] flex flex-col bg-slate-100 rounded-xl shadow-2xl"
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">{template.name}</h2>
                        <p className="text-sm text-slate-500">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onSelect}
                            className="px-5 py-2 text-sm font-semibold rounded-full text-white bg-primary hover:bg-primary-700"
                        >
                            Use This Template
                        </button>
                        <button onClick={onClose} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200" aria-label="Close modal">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </header>

                <div className="flex-grow p-6 overflow-auto custom-scrollbar">
                    <div className="mx-auto" style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }}>
                        <div
                            className={`w-[8.5in] min-h-[11in] bg-white shadow-2xl rounded-lg ${fontClass}`}
                            style={dynamicStyles}
                        >
                            <TemplateComponent data={resumeData} customization={customization} sectionOrder={ALL_SECTIONS} sectionVisibility={sectionVisibility} onDataChange={() => {}} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TemplatePreviewModal;
