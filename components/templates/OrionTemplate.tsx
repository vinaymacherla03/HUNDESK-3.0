import React from 'react';
import { ResumeData, ResumeSectionKey, Customization, Experience, Project, Education, Certification, Award, SkillCategory } from '../../types';
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
  compact: '0.6in',
  normal: '0.8in',
  spacious: '1.0in',
};

const newExperienceEntry: Experience = { id: '', role: 'New Role', company: 'New Company', location: 'City, State', dates: 'Mmm YYYY - Mmm YYYY', description: ['New achievement.'] };
const newProjectEntry: Project = { id: '', name: 'New Project', role: 'Lead', description: ['Description of project.'], technologies: [] };
const newEducationEntry: Education = { id: '', degree: 'Degree or Certificate', institution: 'Institution Name', location: 'City, State', graduationDate: 'Mmm YYYY' };
const newSkillCategory: SkillCategory = { id: '', name: 'New Category', skills: [{id: '', name: 'New Skill', proficiency: 'Intermediate'}] };


const OrionTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = marginMap[customization.margin] || marginMap.normal;
  
  const Section: React.FC<{title: string; icon: React.ReactNode; children: React.ReactNode}> = ({ title, icon, children }) => (
    <section className="mb-6 break-inside-avoid">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--primary-color-light)] text-[var(--primary-color-dark)]">
                {icon}
            </div>
            <h3 
                style={{ fontSize: `${customization.sectionTitleSize}pt`, color: 'var(--primary-color-dark)', textTransform: customization.sectionTitleUppercase ? 'uppercase' : 'none' }} 
                className="font-bold tracking-wider"
            >
                {title}
            </h3>
        </div>
        {children}
    </section>
  );

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-6">
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black" />
      </section>
    ),
    experience: (
      <Section key="experience" title="Experience" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}>
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-5 break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} style={{ fontSize: '0.9em' }} className="text-slate-600 text-right shrink-0 ml-4 font-medium" />
              </div>
              <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium text-slate-800 mb-1" />
              <EditableList items={exp.description || []} path={`experience[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-black space-y-1 mt-1 pl-5">
                {(desc, descIndex) => ( <EditableField as="div" path={`experience[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} /> )}
              </EditableList>
            </div>
          )}
        </EditableList>
      </Section>
    ),
    education: (
      <Section key="education" title="Education" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20" /></svg>}>
        <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
          {(edu, index) => (
            <div key={edu.id || index} className="mb-3 break-inside-avoid">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-black" />
              <p className="text-slate-800">
                <EditableField as="span" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} />{' | '}
                <EditableField as="span" path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} />
              </p>
            </div>
          )}
        </EditableList>
      </Section>
    ),
    skills: (
      <Section key="skills" title="Skills" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}>
        <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory} className="grid grid-cols-2 gap-x-6 gap-y-3">
              {(category, catIndex) => (
                <div key={category.id || catIndex} className="text-black break-inside-avoid">
                  <EditableField as="p" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold mb-1" />
                  <ul className="list-disc list-outside pl-5 text-slate-700">
                    {category.skills.map((s, i) => (
                        <EditableField as="li" key={s.id || i} path={`skills[${catIndex}].skills[${i}].name`} value={s.name} onChange={onDataChange} />
                    ))}
                  </ul>
                </div>
              )}
            </EditableList>
      </Section>
    ),
    projects: null, certifications: null, awards: null,
  };
  
  const contactItemClass = "flex items-center gap-2 text-slate-800";
  const contactLinkClass = "hover:text-[var(--primary-color)]";

  return (
    <div id="resume-content" style={{ padding: marginValue }}>
      <header className="text-center mb-6">
        <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize}pt` }} className="font-bold text-black" />
        <EditableField as="h2" path="title" value={data.title} onChange={onDataChange} style={{ fontSize: `${customization.titleSize}pt` }} className="font-medium text-[var(--primary-color)] mt-1" />
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm mt-4">
            <span className={contactItemClass}> <ContactIcon type="location" className="h-4 w-4"/> <EditableField as="span" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} /> </span>
            <span className={contactItemClass}> <ContactIcon type="email" className="h-4 w-4"/> <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email"/> </span>
            <span className={contactItemClass}> <ContactIcon type="linkedin" className="h-4 w-4"/> <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url" /> </span>
        </div>
      </header>
       <hr className="border-t-2 border-slate-200 mb-6"/>
      <main className="mt-4">
        {sectionOrder.filter(key => sectionVisibility[key]).map(sectionKey => sections[sectionKey])}
      </main>
    </div>
  );
};

export default OrionTemplate;