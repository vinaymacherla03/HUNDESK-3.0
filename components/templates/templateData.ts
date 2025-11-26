
import React from 'react';
import { TemplateKey, Customization } from '../../types';

// Import all desired templates
import JsonResumeFlatTemplate from './JsonResumeFlatTemplate';
import FlowSimpleTemplate from './FlowSimpleTemplate';
import FlowModernTemplate from './FlowModernTemplate';
import FlowProfessionalTemplate from './FlowProfessionalTemplate';


export interface TemplateInfo {
    key: TemplateKey;
    name: string;
    description: string;
    component: React.FC<any>; // Re-added component property
    categories: string[];
    customization: Partial<Customization>;
}

export const templates: TemplateInfo[] = [
    { 
        key: 'json-flat', 
        name: 'Flat (JSON Resume)', 
        description: 'The most popular open-source JSON Resume theme. Clean, structured, and ATS-friendly.', 
        component: JsonResumeFlatTemplate,
        categories: ['Simple', 'Professional'],
        customization: { color: 'slate' } 
    },
    {
        key: 'flow-simple',
        name: 'Flow Simple',
        description: 'A clean and minimalist template, optimized for readability and ATS compatibility.',
        component: FlowSimpleTemplate,
        categories: ['Simple', 'ATS-Friendly'],
        customization: { color: 'blue', font: 'inter' }
    },
    {
        key: 'flow-modern',
        name: 'Flow Modern',
        description: 'A contemporary design with clear sections and a subtle visual hierarchy.',
        component: FlowModernTemplate,
        categories: ['Modern', 'Professional'],
        customization: { color: 'indigo', font: 'montserrat' }
    },
    {
        key: 'flow-professional',
        name: 'Flow Professional',
        description: 'A polished and traditional layout, perfect for corporate and experienced professionals.',
        component: FlowProfessionalTemplate,
        categories: ['Professional', 'ATS-Friendly'],
        customization: { color: 'emerald', font: 'lato' }
    },
];
