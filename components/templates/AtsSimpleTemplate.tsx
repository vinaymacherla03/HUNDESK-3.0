import React from 'react';
import { ResumeData, ResumeSectionKey, Customization, Project, Certification, Award } from '../../types';
import EditableField from '../EditableField';

interface TemplateProps {
  data: ResumeData;
  sectionOrder: ResumeSectionKey[];
  customization: Customization;
  sectionVisibility: Record<ResumeSectionKey, boolean>;
  onDataChange: (path: string, value: any) => void;
}

const AtsSimpleTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
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
    summary: (
      <section key="summary" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-1">SUMMARY</h3>
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-sm" />
      </section>
    ),
    skills: (
        <section key="skills" className="mb-3">
            <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-1">SKILLS</h3>
            <div className="space-y-1 text-sm">
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
    experience: (
      <section key="experience" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-1.5">EXPERIENCE</h3>
        <div className="space-y-2">
          {(data.experience || []).map((exp, index) => (
            <div key={exp.id || index} className="text-sm">
              <p style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} className="font-semibold text-black">
                <EditableField as="span" path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} />, <EditableField as="span" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} />
              </p>
              <p className="text-gray-800 text-xs">
                {exp.location} | {exp.dates}
              </p>
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
    education: (
      <section key="education" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-1.5">EDUCATION</h3>
        <div className="text-sm">
          {(data.education || []).map((edu, index) => (
            <div key={edu.id || index}>
              <p>
                <EditableField as="span" path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold" />, {edu.institution} – {edu.graduationDate}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
    projects: (
        <section key="projects" className="mb-3">
            <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-1.5">PROJECTS</h3>
            <div className="space-y-1.5 text-sm">
                {(data.projects || []).map((proj, index) => (
                    <p key={proj.id || index}>
                        <EditableField as="span" path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} className="font-semibold" />: {proj.description.join(' ')}
                    </p>
                ))}
            </div>
        </section>
    ),
    certifications: (
        <section key="certifications" className="mb-3">
            <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-1.5">CERTIFICATIONS</h3>
            <div className="space-y-1 text-sm">
                {(data.certifications || []).map((cert, index) => (
                    <p key={cert.id || index}>
                        <EditableField as="span" path={`certifications[${index}].name`} value={cert.name} onChange={onDataChange} />, {' '}
                        <EditableField as="span" path={`certifications[${index}].issuer`} value={cert.issuer} onChange={onDataChange} /> ({cert.date})
                    </p>
                ))}
            </div>
        </section>
    ),
    awards: (
        <section key="awards" className="mb-3">
            <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-1.5">AWARDS</h3>
            <div className="space-y-1 text-sm">
                {(data.awards || []).map((award, index) => (
                    <p key={award.id || index}>
                        <EditableField as="span" path={`awards[${index}].name`} value={award.name} onChange={onDataChange} />, {' '}
                        <EditableField as="span" path={`awards[${index}].issuer`} value={award.issuer} onChange={onDataChange} /> ({award.date})
                    </p>
                ))}
            </div>
        </section>
    ),
  };
  
  const contactInfoString = [data.contactInfo.phone, data.contactInfo.email, data.contactInfo.linkedin, data.contactInfo.location].filter(Boolean).join(' | ');

  return (
    <div id="resume-content" style={{ padding: marginValue, fontFamily: 'Arial, sans-serif' }} className="text-black">
      <header className="text-center mb-3">
        <EditableField as="h1" style={{ fontSize: `${customization.nameSize * 0.7}pt` }} path="fullName" value={data.fullName} onChange={onDataChange} className="font-bold" />
        <p className="text-sm">{contactInfoString}</p>
      </header>
      <main className="space-y-2">
        {sectionOrder.filter(key => sectionVisibility[key] && sections[key]).map((sectionKey) => sections[sectionKey])}
      </main>
    </div>
  );
};

export default AtsSimpleTemplate;