import React from 'react';
import { ResumeData } from '../../../types';
import FormField from '../FormField';

interface Props {
  data: ResumeData;
  onDataChange: (path: string, value: any) => void;
}

const ContactForm: React.FC<Props> = ({ data, onDataChange }) => {
  const { fullName, title, contactInfo } = data;

  return (
    <div>
      <h2 className="text-2xl font-bold font-display text-slate-900 mb-6">Contact Information</h2>
      <FormField label="Full Name" name="fullName" value={fullName} onChange={e => onDataChange('fullName', e.target.value)} required />
      <FormField label="Professional Title" name="title" value={title} onChange={e => onDataChange('title', e.target.value)} placeholder="e.g., Senior Software Engineer" required />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <FormField label="Email" name="email" type="email" value={contactInfo.email} onChange={e => onDataChange('contactInfo.email', e.target.value)} required />
        <FormField label="Phone Number" name="phone" type="tel" value={contactInfo.phone} onChange={e => onDataChange('contactInfo.phone', e.target.value)} />
      </div>
      
      <FormField label="Location" name="location" value={contactInfo.location} onChange={e => onDataChange('contactInfo.location', e.target.value)} placeholder="e.g., San Francisco, CA" required />
      <FormField label="LinkedIn URL" name="linkedin" type="url" value={contactInfo.linkedin} onChange={e => onDataChange('contactInfo.linkedin', e.target.value)} />
      <FormField label="GitHub URL" name="github" type="url" value={contactInfo.github || ''} onChange={e => onDataChange('contactInfo.github', e.target.value)} />
      <FormField label="Portfolio URL" name="portfolio" type="url" value={contactInfo.portfolio || ''} onChange={e => onDataChange('contactInfo.portfolio', e.target.value)} />
    </div>
  );
};

export default ContactForm;