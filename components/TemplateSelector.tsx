
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateKey, Customization, ResumeSectionKey, ColorTheme, FontTheme, ResumeData } from '../types';
import { templates as allTemplates, TemplateInfo } from './templates/templateData';
import { sampleResumeData } from './sampleData';
import TemplatePreviewModal from './TemplatePreviewModal';
import JsonResumeFlatTemplate from './templates/JsonResumeFlatTemplate'; // Ensure default import for fallback

interface TemplateSelectorProps {
  currentTemplate: TemplateKey;
  onTemplateChange: (template: TemplateKey) => void;
  resumeData: ResumeData;
}

// Helper constants and maps for rendering previews
// For now, we redefine them here to keep the component self-contained for the preview logic
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

// Simplified TemplatePreview to always use JsonResumeFlatTemplate or other flow templates
const TemplatePreview: React.FC<{ template: TemplateInfo }> = ({ template }) => {
    // Dynamically import templates
    const TemplateComponent = allTemplates.find(t => t.key === template.key)?.component || JsonResumeFlatTemplate;

    const sectionVisibility = ALL_SECTIONS.reduce((acc, section) => ({...acc, [section]: true }), {} as Record<ResumeSectionKey, boolean>);
    
    const customization = { ...defaultCustomization, ...template.customization };
    const colorVars = colorVarMap[customization.color] || colorVarMap.slate;
    const fontClass = fontClassMap[customization.font] || 'font-sans';
    
    // Increased scale for better visibility in the grid
    const scale = 0.2; 
    
    const dynamicStyles: React.CSSProperties = {
        ...colorVars,
        fontSize: `${customization.bodySize}pt`,
        lineHeight: customization.lineHeight,
        width: '8.5in',
        height: '11in',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        pointerEvents: 'none',
        backgroundColor: 'white',
        boxShadow: '0 0 5px rgba(0,0,0,0.1)',
        border: '1px solid #f1f5f9',
    };

    return (
        <div className={`w-full h-full bg-white ${fontClass} overflow-hidden`}>
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
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Simple', 'Modern', 'Professional']; // Based on new templates
  
  const filteredTemplates = allTemplates.filter(t => 
    activeCategory === 'All' || t.categories.includes(activeCategory)
  );

  return (
    <div className="flex flex-col h-full">
      {/* Category Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
              activeCategory === category 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 custom-scrollbar overflow-y-auto pr-2">
        {filteredTemplates.map((template) => {
          const isSelected = currentTemplate === template.key;
          return (
            <motion.button
              key={template.key}
              onClick={() => setPreviewingTemplate(template)}
              className={`group relative w-full text-left rounded-xl border-2 transition-all duration-200 overflow-hidden shadow-sm ${
                isSelected 
                ? 'border-primary ring-2 ring-primary-200 ring-offset-1' 
                : 'border-slate-200 hover:border-slate-400 hover:shadow-md'
              }`}
              layout
            >
              {/* Selection Badge */}
              {isSelected && (
                  <div className="absolute top-2 right-2 z-10 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
              )}
              
              {/* Preview Area */}
              <div className="w-full aspect-[8.5/11] bg-slate-100 relative">
                <TemplatePreview template={template} />
                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors ${isSelected ? 'bg-slate-900/5' : ''}`} />
                
                {/* View Button on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow-sm border border-slate-200">Preview</span>
                </div>
              </div>
              
              {/* Label */}
              <div className={`p-2.5 border-t ${isSelected ? 'bg-primary-50 border-primary-200' : 'bg-white border-slate-100'}`}>
                <p className={`text-xs font-bold truncate ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>{template.name}</p>
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
    </div>
  );
};

export default TemplateSelector;
