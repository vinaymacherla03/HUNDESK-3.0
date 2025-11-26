

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
  normal: '0.75in',
  spacious: '1in',
};

const newExperienceEntry: Experience = { id: '', role: 'Position', company: 'Company Name', location: 'City, State', dates: 'Month YYYY – Month YYYY', description: ['Key achievement or responsibility.'] };
const newProjectEntry: Project = { id: '', name: 'Project Name', role: 'Your Role', description: ['Project details and impact.'], technologies: [] };
const newEducationEntry: Education = { id: '', degree: 'Degree/Certification', institution: 'Institution Name', location: 'City, State', graduationDate: 'Month YYYY' };
const newCertificationEntry: Certification = { id: '', name: 'Certification Name', issuer: 'Issuing Body', date: 'Month YYYY' };
const newAwardEntry: Award = { id: '', name: 'Award Name', issuer: 'Awarding Body', date: 'Month YYYY' };
const newSkillCategory: SkillCategory = { id: '', name: 'Category Name', skills: [{id: '', name: 'Skill', proficiency: 'Intermediate'}] };


// Changes export from named to default to resolve import errors
const FlowSimpleTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
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
    paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.15rem' : undefined,
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `1px solid ${sectionTitleBorderColor}` : 'none',
  };

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold mb-3">Summary</h3>
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-slate-700 leading-relaxed" />
      </section>
    ),
    experience: (
      <section key="experience" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold mb-4">Experience</h3>
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-5 break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-bold text-slate-800" />
                <EditableField as="p" path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-sm text-slate-600 text-right shrink-0 ml-4 font-medium" />
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium text-slate-700" />
                <EditableField as="p" path={`experience[${index}].location`} value={exp.location} onChange={onDataChange} className="text-sm text-slate-600 shrink-0 ml-4" />
              </div>
              <EditableList items={exp.description || []} path={`experience[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-slate-700 space-y-1 mt-2 pl-5">
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
      <section key="projects" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold mb-4">Projects</h3>
        <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry}>
          {(proj, index) => (
            <div key={proj.id || index} className="mb-5 break-inside-avoid">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} className="font-bold text-slate-800" />
              <EditableField as="p" path={`projects[${index}].role`} value={proj.role} onChange={onDataChange} className="font-medium text-slate-700 mb-1" />
              <EditableList items={proj.description || []} path={`projects[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-slate-700 space-y-1 mt-2 pl-5">
                 {(desc, descIndex) => (
                    <EditableField as="div" path={`projects[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                 )}
              </EditableList>
            </div>
          )}
        </EditableList>
      </section>
    ),
    education: (
      <section key="education" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold mb-4">Education</h3>
        <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
          {(edu, index) => (
            <div key={edu.id || index} className="mb-4 break-inside-avoid">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-bold text-slate-800" />
              <div className="flex justify-between items-baseline mb-1">
                <EditableField as="p" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} className="font-medium text-slate-700" />
                <EditableField as="p" path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} className="text-sm text-slate-600 shrink-0 ml-4 font-medium" />
              </div>
            </div>
          )}
        </EditableList>
      </section>
    ),
    skills: (
        <section key="skills" className="mb-6">
          <h3 style={sectionTitleStyles} className="font-bold mb-4">Skills</h3>
          <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory} className="space-y-2">
              {(category, catIndex) => (
                <div key={category.id || catIndex} className="text-slate-700">
                  <EditableField as="p" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold" />
                  <p className="text-sm">
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
    certifications: (
        <section key="certifications" className="mb-6">
          <h3 style={sectionTitleStyles} className="font-bold mb-4">Certifications</h3>
          <EditableList items={data.certifications || []} path="certifications" onChange={onDataChange} newItem={newCertificationEntry}>
            {(cert, index) => (
              <div key={cert.id || index} className="mb-3 break-inside-avoid">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`certifications[${index}].name`} value={cert.name} onChange={onDataChange} className="font-bold text-slate-800" />
                <EditableField as="p" path={`certifications[${index}].issuer`} value={cert.issuer} onChange={onDataChange} className="font-medium text-slate-700" />
                <EditableField as="p" path={`certifications[${index}].date`} value={cert.date} onChange={onDataChange} className="text-sm text-slate-600" />
              </div>
            )}
          </EditableList>
        </section>
    ),
    awards: (
      <section key="awards" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold mb-4">Awards</h3>
        <EditableList items={data.awards || []} path="awards" onChange={onDataChange} newItem={newAwardEntry}>
          {(award, index) => (
            <div key={award.id || index} className="mb-3 break-inside-avoid">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`awards[${index}].name`} value={award.name} onChange={onDataChange} className="font-bold text-slate-800" />
              <EditableField as="p" path={`awards[${index}].issuer`} value={award.issuer} onChange={onDataChange} className="font-medium text-slate-700" />
              <EditableField as="p" path={`awards[${index}].date`} value={award.date} onChange={onDataChange} className="text-sm text-slate-600" />
            </div>
          )}
        </EditableList>
      </section>
    ),
  };
  
  const contactItemClass = "flex items-center gap-2 text-slate-700";
  const contactLinkClass = "hover:text-[var(--primary-color)]";

  return (
    <div id="resume-content" style={{ padding: marginValue }}>
      <header className="text-center mb-8 pb-4 border-b border-slate-200">
        <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize}pt` }} className="font-bold text-slate-900" />
        <EditableField as="h2" path="title" value={data.title} onChange={onDataChange} style={{ fontSize: `${customization.titleSize}pt` }} className="font-medium text-[var(--primary-color)] mt-1" />
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm mt-3">
          <span className={contactItemClass}>
             <ContactIcon type="location" className="h-4 w-4 text-slate-500"/> <EditableField as="span" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} placeholder="City, State" />
          </span>
          <span className={contactItemClass}>
             <ContactIcon type="email" className="h-4 w-4 text-slate-500"/> <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} placeholder="your.email@provider.com" validation="email" className={contactLinkClass} />
          </span>
          <span className={contactItemClass}>
            <ContactIcon type="phone" className="h-4 w-4 text-slate-500"/> <EditableField as="span" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} placeholder="(555) 123-4567" />
          </span>
          <span className={contactItemClass}>
            <ContactIcon type="linkedin" className="h-4 w-4 text-slate-500"/> <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} placeholder="linkedin.com/in/yourname" validation="url" className={contactLinkClass} />
          </span>
           {data.contactInfo.github && (
               <span className={contactItemClass}>
                   <ContactIcon type="github" className="h-4 w-4 text-slate-500"/> <EditableField as="a" href={data.contactInfo.github} target="_blank" rel="noopener noreferrer" path="contactInfo.github" value={data.contactInfo.github} onChange={onDataChange} className={contactLinkClass} validation="url" />
               </span>
           )}
           {data.contactInfo.portfolio && (
               <span className={contactItemClass}>
                   <ContactIcon type="portfolio" className="h-4 w-4 text-slate-500"/> <EditableField as="a" href={data.contactInfo.portfolio} target="_blank" rel="noopener noreferrer" path="contactInfo.portfolio" value={data.contactInfo.portfolio} onChange={onDataChange} className={contactLinkClass} validation="url" />
               </span>
           )}
        </div>
      </header>
      <main className="mt-4 space-y-6">
        {sectionOrder.filter(key => sectionVisibility[key]).map(sectionKey => sections[sectionKey])}
      </main>
    </div>
  );
};

export default FlowSimpleTemplate;
