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

const newExperienceEntry: Experience = { id: '', role: 'New Role', company: 'New Company', location: 'City, State', dates: 'Mmm YYYY - Mmm YYYY', description: ['New achievement.'] };
const newProjectEntry: Project = { id: '', name: 'New Project', role: 'Lead', description: ['Description of project.'], technologies: [] };
const newEducationEntry: Education = { id: '', degree: 'Degree or Certificate', institution: 'Institution Name', location: 'City, State', graduationDate: 'Mmm YYYY' };
const newSkillCategory: SkillCategory = { id: '', name: 'New Category', skills: [{id: '', name: 'New Skill', proficiency: 'Intermediate'}] };


const JournalTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = '0.5in'; // Fixed compact margin
  
  const { 
    sectionTitleSize, 
    sectionTitleColor, 
    sectionTitleBorderStyle, 
    sectionTitleBorderColor, 
    sectionTitleUppercase 
  } = customization;

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: `${sectionTitleSize * 0.9}pt`,
    color: sectionTitleColor,
    textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
    letterSpacing: '0.05em',
    paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `1px solid ${sectionTitleBorderColor}` : 'none',
  };

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-4">
        <h3 style={sectionTitleStyles} className="font-semibold mb-2">Summary</h3>
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black" />
      </section>
    ),
    experience: (
      <section key="experience" className="mb-4">
        <h3 style={sectionTitleStyles} className="font-semibold mb-3">Experience</h3>
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-3 break-inside-avoid">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
              <div className="flex justify-between items-baseline text-slate-600" style={{fontSize: '0.9em'}}>
                <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium" />
                <EditableField as="p" path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-right shrink-0 ml-4 font-medium" />
              </div>
              <EditableList items={exp.description || []} path={`experience[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-black space-y-0.5 mt-1 pl-4">
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
        <section key="education" className="mb-4">
          <h3 style={sectionTitleStyles} className="font-semibold mb-2">Education</h3>
          <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
            {(edu, index) => (
              <div key={edu.id || index} className="mb-2 break-inside-avoid">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-black" />
                <p className="text-slate-700">
                  <EditableField as="span" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} />, {' '}
                  <EditableField as="span" path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} />
                </p>
              </div>
            )}
          </EditableList>
        </section>
      ),
    skills: (
        <section key="skills" className="mb-4">
          <h3 style={sectionTitleStyles} className="font-semibold mb-2">Skills</h3>
          <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory}>
              {(category, catIndex) => (
                <p key={category.id || catIndex} className="mb-0.5 text-black">
                  <EditableField as="span" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold" />: {category.skills.map((s, i) => (
                    <React.Fragment key={s.id || i}>
                      <EditableField as="span" path={`skills[${catIndex}].skills[${i}].name`} value={s.name} onChange={onDataChange} />
                      {i < category.skills.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </p>
              )}
            </EditableList>
        </section>
    ),
    projects: null, certifications: null, awards: null,
  };
  
  const contactLinkClass = "text-slate-800 hover:text-[var(--primary-color)]";

  return (
    <div id="resume-content" style={{ padding: marginValue, fontSize: '9pt', lineHeight: 1.3 }}>
      <header className="text-center mb-2">
        <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize * 0.8}pt` }} className="font-bold text-black" />
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0 text-xs mt-1">
          <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email" />
          <span className="text-slate-400">&bull;</span>
          <EditableField as="span" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} className="text-slate-800" />
          <span className="text-slate-400">&bull;</span>
          <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url" />
        </div>
      </header>
      <main className="mt-2 grid grid-cols-2 gap-x-4">
        <div className="col-span-1 space-y-3">
            {sectionOrder.filter(k => ['summary', 'experience'].includes(k) && sectionVisibility[k]).map(key => sections[key])}
        </div>
        <div className="col-span-1 space-y-3">
            {sectionOrder.filter(k => ['education', 'skills', 'projects', 'certifications', 'awards'].includes(k) && sectionVisibility[k]).map(key => sections[key])}
        </div>
      </main>
    </div>
  );
};

export default JournalTemplate;