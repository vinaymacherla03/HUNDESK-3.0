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

const AtsCompactTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = '0.7in'; // ATS templates have fixed margin for simplicity
  
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
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide">Profile</h3>
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange}/>
      </section>
    ),
    skills: (
      <section key="skills" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide">Skills</h3>
         <div className="space-y-0.5">
          {(data.skills || []).map((category, catIndex) => (
            <div key={category.id || catIndex}>
              <p>
                • <EditableField as="span" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold" />: {category.skills.map(s => s.name).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
    experience: (
      <section key="experience" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide">Experience</h3>
        <div className="space-y-2">
          {(data.experience || []).map((exp, index) => (
            <div key={exp.id || index}>
              <p style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} className="font-semibold text-black">
                <EditableField as="span" path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} /> | {exp.company} | {exp.dates}
              </p>
              <div className="pl-2">
                {(exp.description || []).map((desc, descIndex) => (
                  <div key={descIndex}>
                     <p>• {desc}</p>
                  </div>
                ))}
               </div>
            </div>
          ))}
        </div>
      </section>
    ),
    education: (
      <section key="education" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide">Education</h3>
        <div>
          {(data.education || []).map((edu, index) => (
            <div key={edu.id || index}>
              <p>
                • {edu.degree}, {edu.institution}, {edu.graduationDate}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
    projects: (
      <section key="projects" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide">Projects</h3>
        <div>
          {(data.projects || []).map((proj, index) => (
            <p key={proj.id || index}>• {proj.name}</p>
          ))}
        </div>
      </section>
    ),
    certifications: (
      <section key="certifications" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide">Certifications</h3>
        <div>
          {(data.certifications || []).map((cert, index) => (
            <p key={cert.id || index}>• {cert.name} - {cert.issuer}</p>
          ))}
        </div>
      </section>
    ),
    awards: (
      <section key="awards" className="mb-3">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide">Awards</h3>
        <div>
          {(data.awards || []).map((award, index) => (
            <p key={award.id || index}>• {award.name} - {award.issuer}</p>
          ))}
        </div>
      </section>
    ),
  };
  
  return (
    <div id="resume-content" style={{ padding: marginValue, fontFamily: 'Arial, sans-serif' }} className="text-black">
      <header className="text-left mb-3">
        <EditableField as="h1" style={{ fontSize: `${customization.nameSize * 0.8}pt` }} path="fullName" value={data.fullName} onChange={onDataChange} className="font-bold" />
        <p className="flex flex-wrap gap-x-2">
            <EditableField as="span" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} />
            <span>|</span>
            <EditableField as="span" path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} validation="email" />
            <span>|</span>
            <EditableField as="span" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} validation="url" />
        </p>
      </header>
      <main className="space-y-2">
        {sectionOrder
            .filter(key => sectionVisibility[key] && sections[key])
            .map(sectionKey => sections[sectionKey])
        }
      </main>
    </div>
  );
};

export default AtsCompactTemplate;