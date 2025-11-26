import React from 'react';
import { ResumeData, ResumeSectionKey, Customization, Experience, Project, Education, Certification, Award, SkillCategory } from '../../types';
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


const CascadeTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = marginMap[customization.margin] || marginMap.normal;
  
  const { 
    sectionTitleSize, 
    sectionTitleColor, 
    sectionTitleBorderStyle, 
    sectionTitleBorderColor, 
    sectionTitleUppercase 
  } = customization;

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: `${sectionTitleSize}pt`,
    color: sectionTitleColor,
    textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
    letterSpacing: '0.05em',
  };

  const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <section className="mb-5 break-inside-avoid">
        <h3 style={sectionTitleStyles} className="font-semibold">{title}</h3>
        <hr className="my-2" style={{ borderColor: sectionTitleBorderColor }} />
        {children}
    </section>
  );

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
        <Section key="summary" title="Summary">
            <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black" />
        </Section>
    ),
    experience: (
      <Section key="experience" title="Experience">
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-4">
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
        <Section key="education" title="Education">
          <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
            {(edu, index) => (
              <div key={edu.id || index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-black" />
                  <EditableField as="p" path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} style={{ fontSize: '0.9em' }} className="text-slate-600 shrink-0 ml-4 font-medium" />
                </div>
                <p className="text-slate-800"><EditableField as="span" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} /></p>
              </div>
            )}
          </EditableList>
        </Section>
      ),
    skills: (
        <Section key="skills" title="Skills">
          <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory} className="columns-2">
              {(category, catIndex) => (
                <div key={category.id || catIndex} className="text-black mb-2 break-inside-avoid">
                  <EditableField as="p" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold" />
                  <p style={{fontSize: '0.9em'}} className="text-slate-700">
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
        </Section>
    ),
    projects: null, certifications: null, awards: null,
  };
  
  const contactLinkClass = "text-slate-800 hover:text-[var(--primary-color)]";

  return (
    <div id="resume-content" style={{ padding: marginValue }}>
      <header className="mb-4">
        <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize}pt` }} className="font-bold text-black" />
        <EditableField as="h2" path="title" value={data.title} onChange={onDataChange} style={{ fontSize: `${customization.titleSize}pt`, color: 'var(--primary-color)' }} className="font-medium mt-1" />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mt-2">
          <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email" />
          <span className="text-slate-400">&bull;</span>
          <EditableField as="span" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} className="text-slate-800" />
          <span className="text-slate-400">&bull;</span>
          <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url" />
        </div>
      </header>
      <main className="mt-4">
        {sectionOrder.filter(key => sectionVisibility[key]).map(sectionKey => sections[sectionKey])}
      </main>
    </div>
  );
};

export default CascadeTemplate;