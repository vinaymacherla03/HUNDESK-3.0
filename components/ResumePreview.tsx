
import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, TemplateKey, Customization, ResumeSectionKey, ColorTheme, FontTheme } from '../types';
import JsonResumeFlatTemplate from './templates/JsonResumeFlatTemplate';
import FlowSimpleTemplate from './templates/FlowSimpleTemplate';
import FlowModernTemplate from './templates/FlowModernTemplate';
import FlowProfessionalTemplate from './templates/FlowProfessionalTemplate';


interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateKey;
  customization: Customization;
  sectionOrder: ResumeSectionKey[];
  sectionVisibility: Record<ResumeSectionKey, boolean>;
  onDataChange: (path: string, value: any) => void;
}

const fontClassMap: Record<FontTheme, string> = {
  inter: 'font-sans',
  roboto: 'font-roboto',
  lato: 'font-lato',
  montserrat: 'font-montserrat',
  'source-sans': 'font-source-sans',
  lora: 'font-lora',
  'roboto-mono': 'font-roboto-mono',
};

const colorVarMap: Record<ColorTheme, React.CSSProperties> = {
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
  emerald: {
    '--primary-color': '#059669',
    '--primary-color-light': '#d1fae5',
    '--primary-color-dark': '#047857',
    '--text-on-primary': '#ffffff',
  } as React.CSSProperties,
  rose: {
    '--primary-color': '#e11d48',
    '--primary-color-light': '#ffe4e6',
    '--primary-color-dark': '#be123c',
    '--text-on-primary': '#ffffff',
  } as React.CSSProperties,
  slate: {
    '--primary-color': '#475569',
    '--primary-color-light': '#f1f5f9',
    '--primary-color-dark': '#334155',
    '--text-on-primary': '#ffffff',
  } as React.CSSProperties,
  blue: { 
    '--primary-color': '#2563eb', 
    '--primary-color-light': '#dbeafe', 
    '--primary-color-dark': '#1d4ed8', 
    '--text-on-primary': '#ffffff' 
  } as React.CSSProperties,
  indigo: { 
    '--primary-color': '#4f46e5', 
    '--primary-color-light': '#e0e7ff', 
    '--primary-color-dark': '#3730a3', 
    '--text-on-primary': '#ffffff' 
  } as React.CSSProperties,
};

const TemplateComponentMap: Record<TemplateKey, React.FC<any>> = {
  'json-flat': JsonResumeFlatTemplate,
  'flow-simple': FlowSimpleTemplate,
  'flow-modern': FlowModernTemplate,
  'flow-professional': FlowProfessionalTemplate,
};

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, customization, sectionOrder, sectionVisibility, onDataChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  if (!data) return null;

  const PAGE_HEIGHT_PX = 1056; // 11 inches at 96 DPI (A4/Letter Approx)
  const pageBreaks = [];
  if (containerHeight > PAGE_HEIGHT_PX) {
      const totalPages = Math.floor(containerHeight / PAGE_HEIGHT_PX);
      for (let i = 1; i <= totalPages; i++) {
          if (containerHeight > i * PAGE_HEIGHT_PX) {
               pageBreaks.push(i * PAGE_HEIGHT_PX);
          }
      }
  }

  const TemplateComponent = TemplateComponentMap[template] || JsonResumeFlatTemplate;
  
  const fontClass = fontClassMap[customization.font] || 'font-sans';
  const colorVars = colorVarMap[customization.color] || colorVarMap.slate; // Default to slate
  
  const dynamicStyles: React.CSSProperties = {
    ...colorVars,
    fontSize: `${customization.bodySize}pt`,
    lineHeight: customization.lineHeight,
  };

  return (
    <div 
      id="resume-container-for-download"
      ref={containerRef}
      className={`relative w-[8.5in] min-h-[11in] mx-auto bg-white shadow-lg rounded-sm ${fontClass}`}
      style={dynamicStyles}
    >
      <TemplateComponent data={data} sectionOrder={sectionOrder} customization={customization} sectionVisibility={sectionVisibility} onDataChange={onDataChange} />
      
      {/* Visual Page Separation Lines */}
      {pageBreaks.map((top, index) => (
          <div 
            key={top} 
            className="resume-page-break absolute left-0 w-full pointer-events-none z-50 flex items-center print:hidden"
            style={{ top: `${top}px`, height: '0px' }}
          >
             {/* Dashed Line Marker */}
             <div className="w-full border-b-2 border-dashed border-slate-300/70 relative">
                 <div className="absolute right-0 -top-3 transform translate-x-full pl-2 flex items-center">
                     <span className="bg-slate-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm shadow-sm whitespace-nowrap">
                        Page {index + 2} Start
                     </span>
                 </div>
             </div>
          </div>
      ))}
    </div>
  );
};

export default ResumePreview;
