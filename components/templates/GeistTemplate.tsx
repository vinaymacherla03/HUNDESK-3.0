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
  compact: '0.5in',
  normal: '0.7in',
  spacious: '0.9in',
};

const newExperienceEntry: Experience = { id: '', role: 'New Role', company: 'New Company', location: 'City, State', dates: 'Mmm YYYY - Mmm YYYY', description: ['New achievement.'] };
const newEducationEntry: Education = { id: '', degree: 'Degree or Certificate', institution: 'Institution Name', location: 'City, State', graduationDate: 'Mmm YYYY' };
const newSkillCategory: SkillCategory = { id: '', name: 'New Category', skills: [{id: '', name: 'New Skill', proficiency: 'Intermediate'}] };


const GeistTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
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
    paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.3rem' : undefined,
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `1px solid ${sectionTitleBorderColor}` : 'none',
  };
  
  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-5">
        <h3 style={sectionTitleStyles} className="font-semibold mb-2">Summary</h3>
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black" />
      </section>
    ),
    experience: (
      <section key="experience" className="mb-5">
        <h3 style={sectionTitleStyles} className="font-semibold mb-3">Experience</h3>
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
    education: (
      <section key="education" className="mb-5">
        <h3 style={sectionTitleStyles} className="font-semibold mb-2">Education</h3>
        <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
          {(edu, index) => (
            <div key={edu.id || index} className="mb-3 break-inside-avoid">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-black" />
              <EditableField as="p" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} className="text-slate-800" />
              <EditableField as="p" path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} style={{ fontSize: '0.9em' }} className="text-slate-600 font-medium" />
            </div>
          )}
        </EditableList>
      </section>
    ),
    skills: (
        <section key="skills" className="mb-5">
          <h3 style={sectionTitleStyles} className="font-semibold mb-2">Skills</h3>
          <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory} className="space-y-2">
              {(category, catIndex) => (
                <div key={category.id || catIndex} className="text-black">
                  <p>
                    <EditableField as="span" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold" />: <span style={{fontSize: '0.9em'}} className="text-slate-700">
                      {category.skills.map((s, i) => (
                          <React.Fragment key={s.id || i}>
                          <EditableField as="span" path={`skills[${catIndex}].skills[${i}].name`} value={s.name} onChange={onDataChange} />
                          {i < category.skills.length - 1 ? ', ' : ''}
                          </React.Fragment>
                      ))}
                    </span>
                  </p>
                </div>
              )}
            </EditableList>
        </section>
    ),
    projects: null, certifications: null, awards: null
  };

  const contactItemClass = "flex items-center gap-2 text-slate-800 text-sm";
  const contactLinkClass = "hover:text-[var(--primary-color)] break-all";

  return (
    <div id="resume-content" style={{ padding: marginValue }}>
      <header className="text-center mb-6">
        <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize}pt` }} className="font-bold text-black" />
        <EditableField as="h2" path="title" value={data.title} onChange={onDataChange} style={{ fontSize: `${customization.titleSize}pt`, color: 'var(--primary-color)' }} className="font-medium mt-1" />
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-3">
            <div className={contactItemClass}><ContactIcon type="location" className="h-4 w-4 shrink-0"/> <EditableField as="p" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} /></div>
            <div className={contactItemClass}><ContactIcon type="email" className="h-4 w-4 shrink-0"/> <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email"/></div>
            <div className={contactItemClass}><ContactIcon type="phone" className="h-4 w-4 shrink-0"/> <EditableField as="p" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} /></div>
            <div className={contactItemClass}><ContactIcon type="linkedin" className="h-4 w-4 shrink-0"/> <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url"/></div>
            {data.contactInfo.github && (<div className={contactItemClass}><ContactIcon type="github" className="h-4 w-4 shrink-0"/><EditableField as="a" href={data.contactInfo.github} target="_blank" rel="noopener noreferrer" path="contactInfo.github" value={data.contactInfo.github} onChange={onDataChange} className={contactLinkClass} validation="url"/></div>)}
        </div>
      </header>

      <main>
        {sectionOrder.filter(key => sectionVisibility[key] && sections[key]).map(key => sections[key])}
      </main>
    </div>
  );
};

export default GeistTemplate;