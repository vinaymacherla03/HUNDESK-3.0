import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateKey, Customization, ResumeSectionKey, ColorTheme, FontTheme, ResumeData } from '../types';
import { templates as allTemplates, TemplateInfo } from './templates/templateData';
import { sampleResumeData } from './sampleData';
import TemplatePreviewModal from './TemplatePreviewModal';

interface TemplateSelectorProps {
  currentTemplate: TemplateKey;
  onTemplateChange: (template: TemplateKey) => void;
  resumeData: ResumeData;
}

// Helper constants and maps for rendering previews
const fontClassMap: Record<FontTheme, string> = {
  inter: 'font-sans', roboto: 'font-roboto', lato: 'font-lato', montserrat: 'font-montserrat', 'source-sans': 'font-source-sans', lora: 'font-lora', 'roboto-mono': 'font-roboto-mono'
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

const TemplatePreview: React.FC<{ template: TemplateInfo }> = ({ template }) => {
    const TemplateComponent = template.component;
    const sectionVisibility = ALL_SECTIONS.reduce((acc, section) => ({...acc, [section]: true }), {} as Record<ResumeSectionKey, boolean>);
    
    const customization = { ...defaultCustomization, ...template.customization };
    const colorVars = colorVarMap[customization.color] || colorVarMap.slate;
    const fontClass = fontClassMap[customization.font] || 'font-sans';
    
    // The preview container is small, so we need a significant scale down.
    // A `w-[8.5in]` is ~816px. The container will be ~120px. Scale factor is ~120/816 = 0.147.
    // We'll use a slightly smaller value to ensure it fits.
    const scale = 0.14; 
    
    const dynamicStyles: React.CSSProperties = {
        ...colorVars,
        fontSize: `${customization.bodySize}pt`,
        lineHeight: customization.lineHeight,
        width: '8.5in',
        height: '11in',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        pointerEvents: 'none', // prevent interaction with the scaled-down component
    };

    return (
        <div className={`w-full h-full bg-white ${fontClass}`}>
             <div style={dynamicStyles}>
                <TemplateComponent 
                    data={sampleResumeData} 
                    customization={customization} 
                    sectionOrder={ALL_SECTIONS} 
                    sectionVisibility={sectionVisibility} 
                    onDataChange={() => {}} // No-op for thumbnails
                />
            </div>
        </div>
    );
};


const TemplateSelector: React.FC<TemplateSelectorProps> = ({ currentTemplate, onTemplateChange, resumeData }) => {
  const [previewingTemplate, setPreviewingTemplate] = useState<TemplateInfo | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allTemplates.map((template) => {
          const isSelected = currentTemplate === template.key;
          return (
            <motion.button
              key={template.key}
              onClick={() => setPreviewingTemplate(template)}
              className={`block w-full text-left p-1.5 rounded-lg border-2 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary ${
                isSelected ? 'border-primary bg-primary-50' : 'border-transparent hover:bg-slate-100'
              }`}
              whileHover={{ y: -4 }}
              whileTap={{ y: 0, scale: 0.98 }}
            >
              <div className="w-full aspect-[8.5/11] bg-slate-50 rounded-md border border-slate-200 overflow-hidden">
                <TemplatePreview template={template} />
              </div>
              <div className="mt-2 px-1 flex items-center justify-between">
                <p className={`text-sm font-semibold ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>{template.name}</p>
                {template.categories.includes('Simple') && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800" title="Optimized for Applicant Tracking Systems">
                    ATS
                  </span>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
       <AnimatePresence>
        {previewingTemplate && (
            <TemplatePreviewModal
                template={previewingTemplate}
                resumeData={resumeData}
                onClose={() => setPreviewingTemplate(null)}
                onSelect={() => {
                    onTemplateChange(previewingTemplate.key);
                    setPreviewingTemplate(null);
                }}
            />
        )}
      </AnimatePresence>
    </>
  );
};

export default TemplateSelector;