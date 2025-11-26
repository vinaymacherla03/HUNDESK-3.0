import React from 'react';
import { ResumeData, ResumeSectionKey, Customization, Experience, Project, Education, Certification, Award, SkillCategory, Skill } from '../../types';
import ContactIcon from '../ContactIcon';
import EditableField from '../EditableField';
import { EditableList } from '../EditableList';

interface TemplateProps {
  data: ResumeData;
  sectionOrder: ResumeSectionKey[];
  customization: Customization;
  sectionVisibility: Record<ResumeSectionKey, boolean>;
  onDataChange: (path: string, value: any) => void;
}

const marginMap: Record<Customization['margin'], string> = {
  compact: '0.5in',
  normal: '0.7in',
  spacious: '0.9in',
};

const newExperienceEntry: Experience = { id: '', role: 'New Role', company: 'New Company', location: 'City, State', dates: 'Mmm YYYY - Mmm YYYY', description: ['New achievement.'] };
const newProjectEntry: Project = { id: '', name: 'New Project', role: 'Lead', description: ['Description of project.'], technologies: [] };
const newEducationEntry: Education = { id: '', degree: 'Degree or Certificate', institution: 'Institution Name', location: 'City, State', graduationDate: 'Mmm YYYY' };
const newSkillCategory: SkillCategory = { id: '', name: 'New Category', skills: [{id: '', name: 'New Skill', proficiency: 'Intermediate'}] };


const PinnacleTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = marginMap[customization.margin] || marginMap.normal;
  
  const { 
    sectionTitleSize, 
    sectionTitleColor, 
    sectionTitleBorderStyle, 
    sectionTitleBorderColor, 
    sectionTitleUppercase 
  } = customization;

  const mainSectionTitleStyles: React.CSSProperties = {
    fontSize: `${sectionTitleSize}pt`,
    color: sectionTitleColor,
    textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
    letterSpacing: '0.05em',
    paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `1px solid ${sectionTitleBorderColor}` : 'none',
  };
  
  const sidebarSectionTitleStyles: React.CSSProperties = {
      fontSize: `${sectionTitleSize * 0.9}pt`,
      color: 'var(--text-on-primary)',
      opacity: 0.9,
      textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
      letterSpacing: '0.05em',
      paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
      borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `1px solid var(--text-on-primary)` : 'none',
  };

  const mainSections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-5">
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black" />
      </section>
    ),
    experience: (
      <section key="experience" className="mb-5">
        <h3 style={mainSectionTitleStyles} className="font-semibold mb-3">Experience</h3>
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-4 break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} style={{ fontSize: '0.9em' }} className="text-slate-600 text-right shrink-0 ml-4 font-medium" />
              </div>
              <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium text-slate-800 mb-1" />
              <EditableList items={exp.description || []} path={`experience[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-black space-y-1 mt-1 pl-5">
                {(desc, descIndex) => (
                  <EditableField as="div" path={`experience[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                )}
              </EditableList>
            </div>
          )}
        </EditableList>
      </section>
    ),
    projects: (
      <section key="projects" className="mb-5">
        <h3 style={mainSectionTitleStyles} className="font-semibold mb-3">Projects</h3>
        <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry}>
          {(proj, index) => (
            <div key={proj.id || index} className="mb-4 break-inside-avoid">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt`}} className="font-semibold text-black" path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} />
              <EditableList items={proj.description || []} path={`projects[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-black space-y-1 mt-1 pl-5">
                 {(desc, descIndex) => (
                    <EditableField as="div" path={`projects[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                 )}
              </EditableList>
            </div>
          )}
        </EditableList>
      </section>
    ),
    education: null, skills: null, certifications: null, awards: null
  };
  
  const sidebarSections: Record<ResumeSectionKey, React.ReactNode> = {
    education: (
      <section key="education" className="mb-5">
        <h3 style={sidebarSectionTitleStyles} className="font-semibold mb-2">Education</h3>
        <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
          {(edu, index) => (
            <div key={edu.id || index} className="mb-3 break-inside-avoid">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold" />
              <EditableField as="p" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} />
              <EditableField as="p" path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} style={{ fontSize: '0.9em' }} className="font-medium opacity-80" />
            </div>
          )}
        </EditableList>
      </section>
    ),
    skills: (
        <section key="skills" className="mb-5">
          <h3 style={sidebarSectionTitleStyles} className="font-semibold mb-2">Skills</h3>
          <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory} className="space-y-2">
              {(category, catIndex) => (
                <div key={category.id || catIndex}>
                  <EditableField as="p" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold" />
                  <p style={{fontSize: '0.9em'}} className="opacity-90">
                    {category.skills.map((s, i) => (
                        <React.Fragment key={s.id || i}>
                        <EditableField as="span" path={`skills[${catIndex}].skills[${i}].name`} value={s.name} onChange={onDataChange} />
                        {i < category.skills.length - 1 ? ', ' : ''}
                        </React.Fragment>
                    ))}
                  </p>
                </div>
              )}
            </EditableList>
        </section>
    ),
    summary: null, experience: null, projects: null, certifications: null, awards: null
  }
  
  const sidebarSectionKeys: ResumeSectionKey[] = ['education', 'skills'];
  const contactItemClass = "flex items-start gap-2 text-sm";
  const contactLinkClass = "hover:opacity-80 break-all";

  return (
    <div id="resume-content" className="flex">
      <main className="w-[65%] pl-0" style={{ padding: marginValue, paddingRight: '1.5rem', paddingLeft: marginValue }}>
         <header className="mb-6">
            <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize}pt` }} className="font-bold text-black" />
            <EditableField as="h2" path="title" value={data.title} onChange={onDataChange} style={{ fontSize: `${customization.titleSize}pt` }} className="font-medium text-[var(--primary-color)] mt-1" />
        </header>
        {sectionOrder.filter(key => !sidebarSectionKeys.includes(key) && sectionVisibility[key]).map(key => mainSections[key])}
      </main>
      <aside className="w-[35%] bg-[var(--primary-color)] text-[var(--text-on-primary)]" style={{ padding: marginValue }}>
         <section className="space-y-3">
            <h3 style={sidebarSectionTitleStyles} className="font-semibold mb-2">Contact</h3>
            <div className={contactItemClass}><ContactIcon type="location" className="h-4 w-4 mt-0.5 shrink-0"/> <EditableField as="p" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} /></div>
            <div className={contactItemClass}><ContactIcon type="email" className="h-4 w-4 mt-0.5 shrink-0"/> <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email"/></div>
            <div className={contactItemClass}><ContactIcon type="phone" className="h-4 w-4 mt-0.5 shrink-0"/> <EditableField as="p" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} /></div>
            <div className={contactItemClass}><ContactIcon type="linkedin" className="h-4 w-4 mt-0.5 shrink-0"/> <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url"/></div>
            {data.contactInfo.github && (<div className={contactItemClass}><ContactIcon type="github" className="h-4 w-4 mt-0.5 shrink-0"/><EditableField as="a" href={data.contactInfo.github} target="_blank" rel="noopener noreferrer" path="contactInfo.github" value={data.contactInfo.github} onChange={onDataChange} className={contactLinkClass} validation="url"/></div>)}
        </section>
         <div className="mt-5 space-y-4">
            {sectionOrder.filter(key => sidebarSectionKeys.includes(key) && sectionVisibility[key]).map(key => sidebarSections[key])}
        </div>
      </aside>
    </div>
  );
};

export default PinnacleTemplate;