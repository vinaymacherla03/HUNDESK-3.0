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

const marginMap: Record<Customization['margin'], string> = {
  compact: '0.6in',
  normal: '0.8in',
  spacious: '1.0in',
};

const QuantumTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = marginMap[customization.margin] || marginMap.normal;
  
  const { 
    sectionTitleSize, 
    sectionTitleBorderStyle, 
    sectionTitleBorderColor, 
    sectionTitleUppercase 
  } = customization;

  const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => {
    const titleStyles: React.CSSProperties = {
        fontFamily: 'var(--mono-font)', 
        fontSize: `${sectionTitleSize}pt`,
        textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
        color: 'var(--primary-color)',
        paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.3rem' : undefined,
        paddingTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? '0.3rem' : undefined,
        borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `1px dashed ${sectionTitleBorderColor}` : 'none',
        borderTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? `1px dashed ${sectionTitleBorderColor}` : 'none',
    };
    
    return (
        <section className="mb-6 break-inside-avoid">
            <h3 style={titleStyles} className="font-bold mb-3">
               <span className="text-gray-500">//</span> {title}
            </h3>
            {children}
        </section>
    );
  };

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <Section key="summary" title="Objective">
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} />
      </Section>
    ),
    experience: (
      <Section key="experience" title="Work History">
        {(data.experience || []).map((exp, index) => (
            <div key={exp.id || index} className="mb-5">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-gray-100" />
                <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-mono text-gray-400" />
              </div>
              <div className="flex justify-between items-baseline mb-2 text-gray-400" style={{fontSize: '0.9em'}}>
                <EditableField as="p" path={`experience[${index}].location`} value={exp.location} onChange={onDataChange} />
                <EditableField as="p" path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-right shrink-0 ml-4" />
              </div>
              <div className="space-y-1 mt-2 pl-4">
                {(exp.description || []).map((desc, descIndex) => (
                    <div key={descIndex} className="relative pl-4">
                        <span className="absolute left-0 top-1 text-[var(--primary-color)] font-mono">&gt;</span>
                        <EditableField as="p" path={`experience[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                    </div>
                ))}
               </div>
            </div>
        ))}
      </Section>
    ),
    projects: data.projects && data.projects.length > 0 && (
      <Section key="projects" title="Projects">
        {(data.projects || []).map((proj, index) => (
          <div key={proj.id || index} className="mb-5">
            <h4 style={{ fontSize: `${customization.itemTitleSize}pt` }} className="font-semibold text-gray-100">
                <EditableField as="span" path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} />
                <span className="font-mono text-gray-400 text-sm"> / <EditableField as="span" path={`projects[${index}].role`} value={proj.role} onChange={onDataChange} /></span>
            </h4>
            <div className="space-y-1 mt-2 pl-4">
                {(proj.description || []).map((desc, descIndex) => (
                    <div key={descIndex} className="relative pl-4">
                        <span className="absolute left-0 top-1 text-[var(--primary-color)] font-mono">&gt;</span>
                        <EditableField as="p" path={`projects[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                    </div>
                ))}
            </div>
          </div>
        ))}
      </Section>
    ),
    education: (
      <Section key="education" title="Education">
        {(data.education || []).map((edu, index) => (
          <div key={edu.id || index} className="mb-3">
            <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-gray-100" />
                <EditableField as="p" style={{ fontSize: '0.9em' }} path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} className="text-gray-400 shrink-0 ml-4" />
            </div>
            <EditableField as="p" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} className="text-gray-300" />
          </div>
        ))}
      </Section>
    ),
    skills: (
      <Section key="skills" title="Skills">
        {(data.skills || []).map((category, catIndex) => (
          <div key={category.id || catIndex} className="mb-3">
            <EditableField as="h4" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold text-gray-300 mb-2" />
            <div className="flex flex-wrap gap-2">
              {(category.skills || []).map((skill, skillIndex) => (
                <div key={skill.id || skillIndex} className="border border-[var(--primary-color)]/50 text-[var(--primary-color)] font-medium px-3 py-1 rounded-sm bg-[var(--primary-color)]/10">
                   <EditableField as="span" style={{ fontSize: '0.9em' }} path={`skills[${catIndex}].skills[${skillIndex}].name`} value={skill.name} onChange={onDataChange} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>
    ),
    certifications: data.certifications && data.certifications.length > 0 && (<div key="certifications" />),
    awards: data.awards && data.awards.length > 0 && (<div key="awards" />),
  };
  
  const contactLinkClass = "hover:text-[var(--primary-color)]";
  
  return (
    <div id="resume-content" className="bg-[#1a1a1a] text-[#e0e0e0]" style={{ padding: marginValue }}>
      <style>{`
        #resume-container-for-download {
          --mono-font: 'Courier New', Courier, monospace;
        }
      `}</style>
      
      <header className="text-center mb-8">
        <EditableField 
          as="h1"
          path="fullName"
          value={data.fullName}
          onChange={onDataChange}
          style={{ fontFamily: 'var(--mono-font)', fontSize: `${customization.nameSize}pt`, textTransform: 'uppercase' }}
          className="font-bold text-gray-100"
        />
        <EditableField 
          as="h2"
          path="title"
          value={data.title}
          onChange={onDataChange}
          style={{ fontSize: `${customization.titleSize}pt` }}
          className="font-medium text-[var(--primary-color)] mt-1"
        />
        <div style={{ fontSize: '0.9em' }} className="flex flex-wrap font-mono justify-center items-center gap-x-4 gap-y-1 mt-4 text-gray-400">
            <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email"/>
            <span className="text-gray-600">/</span>
            <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url"/>
            {data.contactInfo.github && (<>
                <span className="text-gray-600">/</span>
                <EditableField as="a" href={data.contactInfo.github} target="_blank" rel="noopener noreferrer" path="contactInfo.github" value={data.contactInfo.github} onChange={onDataChange} className={contactLinkClass} validation="url"/>
            </>)}
            {data.contactInfo.portfolio && (<>
                <span className="text-gray-600">/</span>
                <EditableField as="a" href={data.contactInfo.portfolio} target="_blank" rel="noopener noreferrer" path="contactInfo.portfolio" value={data.contactInfo.portfolio} onChange={onDataChange} className={contactLinkClass} validation="url"/>
            </>)}
        </div>
      </header>
      
      <main className="space-y-4">
        {sectionOrder.filter(key => sectionVisibility[key]).map(sectionKey => sections[sectionKey])}
      </main>
    </div>
  );
};

export default QuantumTemplate;