



import React from 'react';
import { ResumeData, ResumeSectionKey, Customization } from '../../types';
import EditableField from '../EditableField';

interface TemplateProps {
  data: ResumeData;
  sectionOrder: ResumeSectionKey[];
  customization: Customization;
  sectionVisibility: Record<ResumeSectionKey, boolean>;
  onDataChange: (path: string, value: any) => void;
}

const AtsModernTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = '0.6in'; // ATS templates have fixed margin for simplicity
  
  const { 
    sectionTitleSize, 
    sectionTitleColor, 
    sectionTitleBorderStyle, 
    sectionTitleBorderColor, 
    sectionTitleUppercase 
  } = customization;

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: `${sectionTitleSize * 0.8}pt`,
    color: sectionTitleColor,
    textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
    paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
    paddingTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `1px solid ${sectionTitleBorderColor}` : 'none',
    borderTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? `1px solid ${sectionTitleBorderColor}` : 'none',
  };

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: data.summary && (
      <section key="summary" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-1 pb-1">PROFESSIONAL SUMMARY</h3>
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="mt-1.5 text-sm" />
      </section>
    ),
    skills: data.skills && data.skills.length > 0 && (
      <section key="skills" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-1 pb-1">KEY SKILLS</h3>
        <div className="mt-1.5 space-y-1 text-sm">
          {(data.skills || []).map((category, catIndex) => (
            <div key={category.id || catIndex}>
              <p>
                <EditableField as="span" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold" />: {category.skills.map(s => s.name).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
    experience: data.experience && data.experience.length > 0 && (
      <section key="experience" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-1.5 pb-1">PROFESSIONAL EXPERIENCE</h3>
        <div className="space-y-2">
          {(data.experience || []).map((exp, index) => (
            <div key={exp.id || index} className="text-sm">
              <EditableField as="p" style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
              <p className="text-gray-800 text-xs">{exp.company} | {exp.location} | {exp.dates}</p>
              <ul className="list-disc list-outside pl-5 space-y-0.5 mt-0.5">
                {(exp.description || []).map((desc, descIndex) => (
                  <li key={descIndex}>{desc}</li>
                ))}
               </ul>
            </div>
          ))}
        </div>
      </section>
    ),
    projects: data.projects && data.projects.length > 0 && (
      <section key="projects" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-1.5 pb-1">PROJECTS</h3>
        <div className="space-y-2">
          {(data.projects || []).map((proj, index) => (
            <div key={proj.id || index} className="text-sm">
              <p style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} className="font-semibold text-black">{proj.name} - <span className="font-normal">{proj.role}</span></p>
              <ul className="list-disc list-outside pl-5 space-y-0.5 mt-0.5">
                {(proj.description || []).map((desc, descIndex) => (
                  <li key={descIndex}>{desc}</li>
                ))}
               </ul>
            </div>
          ))}
        </div>
      </section>
    ),
    education: data.education && data.education.length > 0 && (
      <section key="education" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-1.5 pb-1">EDUCATION</h3>
        <div className="space-y-1.5 text-sm">
          {(data.education || []).map((edu, index) => (
            <div key={edu.id || index}>
              <EditableField as="p" path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold" />
              <p className="text-gray-800">{edu.institution} | {edu.graduationDate}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    certifications: data.certifications && data.certifications.length > 0 && (
      <section key="certifications" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-1.5 pb-1">CERTIFICATIONS</h3>
        <div className="space-y-1 text-sm">
          {(data.certifications || []).map((cert, index) => (
            <p key={cert.id || index}>
              {cert.name} - {cert.issuer} ({cert.date})
            </p>
          ))}
        </div>
      </section>
    ),
    awards: data.awards && data.awards.length > 0 && (
      <section key="awards" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-1.5 pb-1">AWARDS</h3>
        <div className="space-y-1 text-sm">
          {(data.awards || []).map((award, index) => (
            <p key={award.id || index}>
              {award.name} - {award.issuer} ({award.date})
            </p>
          ))}
        </div>
      </section>
    ),
  };
  
  const contactInfoString = [
    data.contactInfo.location,
    data.contactInfo.phone,
    data.contactInfo.email,
    data.contactInfo.linkedin,
    data.contactInfo.github,
    data.contactInfo.portfolio,
  ].filter(Boolean).join(' | ');

  return (
    <div id="resume-content" style={{ padding: marginValue, fontFamily: 'Arial, sans-serif' }} className="text-black text-xs">
      <header className="text-center mb-3">
        <EditableField as="h1" style={{ fontSize: `${customization.nameSize * 0.8}pt` }} path="fullName" value={data.fullName} onChange={onDataChange} className="font-bold" />
        <EditableField as="h2" style={{ fontSize: `${customization.titleSize * 0.8}pt` }} path="title" value={data.title} onChange={onDataChange} className="font-semibold text-gray-800" />
        <p className="text-xs mt-1">{contactInfoString}</p>
      </header>
      <main className="space-y-2">
        {sectionOrder.filter(key => sectionVisibility[key]).map((sectionKey) => sections[sectionKey])}
      </main>
    </div>
  );
};

export default AtsModernTemplate;