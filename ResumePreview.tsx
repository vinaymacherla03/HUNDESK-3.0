import React from 'react';
import { ResumeData, TemplateKey, Customization, ResumeSectionKey, ColorTheme } from '../types';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import CorporateTemplate from './templates/CorporateTemplate';
import AcademicTemplate from './templates/AcademicTemplate';
import AtsModernTemplate from './templates/AtsModernTemplate';
import AtsSimpleTemplate from './templates/AtsSimpleTemplate';
import AtsCompactTemplate from './templates/AtsCompactTemplate';
import VanguardTemplate from './templates/VanguardTemplate';
import QuantumTemplate from './templates/QuantumTemplate';
import ApexTemplate from './templates/ApexTemplate';
import ChronosTemplate from './templates/ChronosTemplate';
import GeistTemplate from './templates/GeistTemplate';
import OrionTemplate from './templates/OrionTemplate';
import PinnacleTemplate from './templates/PinnacleTemplate';
import SerifTemplate from './templates/SerifTemplate';
import CascadeTemplate from './templates/CascadeTemplate';
import MonokaiTemplate from './templates/MonokaiTemplate';
import GalleriaTemplate from './templates/GalleriaTemplate';
import DirectorTemplate from './templates/DirectorTemplate';
import KyotoTemplate from './templates/KyotoTemplate';
import JournalTemplate from './templates/JournalTemplate';
import VibrantTemplate from './templates/VibrantTemplate';
import DatavizTemplate from './templates/DatavizTemplate';
import MonarchTemplate from './templates/MonarchTemplate';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateKey;
  customization: Customization;
  sectionOrder: ResumeSectionKey[];
  sectionVisibility: Record<ResumeSectionKey, boolean>;
  onDataChange: (path: string, value: any) => void;
}

const fontClassMap: Record<Customization['font'], string> = {
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

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, customization, sectionOrder, sectionVisibility, onDataChange }) => {
  const TemplateComponent = ({
    classic: ClassicTemplate,
    modern: ModernTemplate,
    elegant: ElegantTemplate,
    minimalist: MinimalistTemplate,
    creative: CreativeTemplate,
    corporate: CorporateTemplate,
    academic: AcademicTemplate,
    'ats-modern': AtsModernTemplate,
    'ats-simple': AtsSimpleTemplate,
    'ats-compact': AtsCompactTemplate,
    vanguard: VanguardTemplate,
    quantum: QuantumTemplate,
    apex: ApexTemplate,
    chronos: ChronosTemplate,
    geist: GeistTemplate,
    orion: OrionTemplate,
    pinnacle: PinnacleTemplate,
    serif: SerifTemplate,
    cascade: CascadeTemplate,
    monokai: MonokaiTemplate,
    galleria: GalleriaTemplate,
    director: DirectorTemplate,
    kyoto: KyotoTemplate,
    journal: JournalTemplate,
    vibrant: VibrantTemplate,
    dataviz: DatavizTemplate,
    monarch: MonarchTemplate,
  }[template] || ClassicTemplate) as React.FC<any>;
  
  const fontClass = fontClassMap[customization.font] || 'font-sans';
  const colorVars = colorVarMap[customization.color] || colorVarMap.orange;
  
  const dynamicStyles: React.CSSProperties = {
    ...colorVars,
    fontSize: `${customization.bodySize}pt`,
    lineHeight: customization.lineHeight,
  };

  return (
    <div 
      id="resume-container-for-download"
      className={`w-[8.5in] min-h-[11in] mx-auto bg-white shadow-lg rounded-sm ${fontClass}`}
      style={dynamicStyles}
    >
      <TemplateComponent data={data} sectionOrder={sectionOrder} customization={customization} sectionVisibility={sectionVisibility} onDataChange={onDataChange} />
    </div>
  );
};

export default ResumePreview;