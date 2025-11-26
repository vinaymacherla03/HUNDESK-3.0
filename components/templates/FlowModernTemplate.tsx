

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

const newExperienceEntry: Experience = { id: '', role: 'Position', company: 'Company Name', location: 'City, State', dates: 'Month YYYY – Month YYYY', description: ['Key achievement or responsibility.'] };
const newProjectEntry: Project = { id: '', name: 'Project Name', role: 'Your Role', description: ['Project details and impact.'], technologies: [] };
const newEducationEntry: Education = { id: '', degree: 'Degree/Certification', institution: 'Institution Name', location: 'City, State', graduationDate: 'Month YYYY' };
const newCertificationEntry: Certification = { id: '', name: 'Certification Name', issuer: 'Issuing Body', date: 'Month YYYY' };
const newAwardEntry: Award = { id: '', name: 'Award Name', issuer: 'Awarding Body', date: 'Month YYYY' };
const newSkillCategory: SkillCategory = { id: '', name: 'Category Name', skills: [{id: '', name: 'Skill', proficiency: 'Intermediate'}] };


// Changes export from named to default to resolve import errors
const FlowModernTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = marginMap[customization.margin] || marginMap.normal;
  
  const { 
    sectionTitleSize, 
    sectionTitleColor, 
    sectionTitleUppercase 
  } = customization;

  const mainSectionTitleStyles: React.CSSProperties = {
    fontSize: `${sectionTitleSize}pt`,
    color: sectionTitleColor,
    textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
    letterSpacing: '0.05em',
    paddingBottom: '0.2rem',
    borderBottom: `1px solid ${customization.sectionTitleBorderColor}`,
  };
  
  const sidebarSectionTitleStyles: React.CSSProperties = {
      fontSize: `${sectionTitleSize * 0.9}pt`,
      color: 'var(--primary-color)',
      textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
      letterSpacing: '0.05em',
      marginBottom: '0.8rem',
  };


  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-6">
        <h3 style={mainSectionTitleStyles} className="font-bold mb-3">Summary</h3>
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-slate-700 leading-relaxed" />
      </section>
    ),
    experience: (
      <section key="experience" className="mb-6">
        <h3 style={mainSectionTitleStyles} className="font-bold mb-4">Experience</h3>
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-5 break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-bold text-slate-800" />
                <EditableField as="p" path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-sm text-slate-600 text-right shrink-0 ml-4 font-medium" />
              </div>
              <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium text-slate-700 mb-1" />
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
        <h3 style={mainSectionTitleStyles} className="font-bold mb-4">Projects</h3>
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
      <section key="education" className="mb-5">
        <h3 style={sidebarSectionTitleStyles} className="font-bold">Education</h3>
        <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
          {(edu, index) => (
          <div key={edu.id || index} className="mb-3 break-inside-avoid">
            <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-bold text-slate-800" />
            <EditableField as="p" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} className="font-medium text-slate-700" />
            <EditableField as="p" path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} className="text-sm text-slate-600" />
          </div>
          )}
        </EditableList>
      </section>
    ),
    skills: (
      <section key="skills" className="mb-5">
        <h3 style={sidebarSectionTitleStyles} className="font-bold">Skills</h3>
         <div className="text-sm">
            <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory}>
                {(category, catIndex) => (
                    <div key={category.id || catIndex} className="mb-3 break-inside-avoid">
                        <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-bold text-slate-800 mb-1" />
                        <div className="flex flex-wrap gap-1">
                            {(category.skills || []).map((skill, skillIndex) => (
                                <div key={skill.id || skillIndex} className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md text-xs">
                                    <EditableField as="span" path={`skills[${catIndex}].skills[${skillIndex}].name`} value={skill.name} onChange={onDataChange} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </EditableList>
        </div>
      </section>
    ),
    certifications: (
      <section key="certifications" className="mb-5">
        <h3 style={sidebarSectionTitleStyles} className="font-bold">Certifications</h3>
        <EditableList items={data.certifications || []} path="certifications" onChange={onDataChange} newItem={newCertificationEntry}>
          {(cert, index) => (
          <div key={cert.id || index} className="mb-3 break-inside-avoid">
            <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} path={`certifications[${index}].name`} value={cert.name} onChange={onDataChange} className="font-bold text-slate-800" />
            <EditableField as="p" path={`certifications[${index}].issuer`} value={cert.issuer} onChange={onDataChange} className="font-medium text-slate-700" />
          </div>
          )}
        </EditableList>
      </section>
    ),
    awards: (
      <section key="awards" className="mb-5">
        <h3 style={sidebarSectionTitleStyles} className="font-bold">Awards</h3>
        <EditableList items={data.awards || []} path="awards" onChange={onDataChange} newItem={newAwardEntry}>
            {(award, index) => (
            <div key={award.id || index} className="mb-3 break-inside-avoid">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize * 0.9}pt` }} path={`awards[${index}].name`} value={award.name} onChange={onDataChange} className="font-bold text-slate-800" />
                <EditableField as="p" path={`awards[${index}].issuer`} value={award.issuer} onChange={onDataChange} className="font-medium text-slate-700" />
            </div>
            )}
        </EditableList>
      </section>
    ),
  };

  const sidebarSectionKeys: ResumeSectionKey[] = ['education', 'skills', 'certifications', 'awards'];
  const contactLinkClass = "hover:text-[var(--primary-color)] break-all";

  return (
    <div id="resume-content" className="flex" style={{ padding: marginValue }}>
      <aside className="w-1/3 flex-shrink-0 pr-6 border-r border-slate-200">
        <div className="text-center mb-8">
          <EditableField as="h1" style={{ fontSize: `${customization.nameSize}pt` }} path="fullName" value={data.fullName} onChange={onDataChange} className="font-bold text-slate-900" />
          <EditableField as="h2" style={{ fontSize: `${customization.titleSize}pt` }} path="title" value={data.title} onChange={onDataChange} className="font-medium text-slate-700 mt-1" />
        </div>
        
        <section className="mb-6 space-y-2 text-sm">
            <h3 style={sidebarSectionTitleStyles} className="font-bold">Contact</h3>
            <div className="flex items-start gap-2">
                <ContactIcon type="location" className="h-4 w-4 mt-0.5 text-slate-500 shrink-0"/>
                <EditableField as="p" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} />
            </div>
            <div className="flex items-start gap-2">
                <ContactIcon type="phone" className="h-4 w-4 mt-0.5 text-slate-500 shrink-0"/>
                <EditableField as="p" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} />
            </div>
            <div className="flex items-start gap-2">
                <ContactIcon type="email" className="h-4 w-4 mt-0.5 text-slate-500 shrink-0"/>
                <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email" />
            </div>
            <div className="flex items-start gap-2">
                <ContactIcon type="linkedin" className="h-4 w-4 mt-0.5 text-slate-500 shrink-0"/>
                <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url" />
            </div>
            {data.contactInfo.github && (
                <div className="flex items-start gap-2">
                    <ContactIcon type="github" className="h-4 w-4 mt-0.5 text-slate-500 shrink-0"/>
                    <EditableField as="a" href={data.contactInfo.github} target="_blank" rel="noopener noreferrer" path="contactInfo.github" value={data.contactInfo.github} onChange={onDataChange} className={contactLinkClass} validation="url" />
                </div>
            )}
            {data.contactInfo.portfolio && (
                <div className="flex items-start gap-2">
                    <ContactIcon type="portfolio" className="h-4 w-4 mt-0.5 text-slate-500 shrink-0"/>
                    <EditableField as="a" href={data.contactInfo.portfolio} target="_blank" rel="noopener noreferrer" path="contactInfo.portfolio" value={data.contactInfo.portfolio} onChange={onDataChange} className={contactLinkClass} validation="url" />
                </div>
            )}
        </section>

        {sectionOrder.filter(key => sidebarSectionKeys.includes(key) && sectionVisibility[key]).map(key => sections[key])}
      </aside>

      <main className="w-2/3 pl-6">
        {sectionOrder.filter(key => !sidebarSectionKeys.includes(key) && sectionVisibility[key]).map(key => sections[key])}
      </main>
    </div>
  );
};

export default FlowModernTemplate;
