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
const newCertificationEntry: Certification = { id: '', name: 'Certification Name', issuer: 'Issuing Body', date: 'Mmm YYYY' };
const newAwardEntry: Award = { id: '', name: 'Award Name', issuer: 'Issuer', date: 'Mmm YYYY' };
const newSkillCategory: SkillCategory = { id: '', name: 'New Category', skills: [{id: '', name: 'New Skill', proficiency: 'Intermediate'}] };


const CorporateTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
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
    paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
    paddingTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `1px solid ${sectionTitleBorderColor}` : 'none',
    borderTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? `1px solid ${sectionTitleBorderColor}` : 'none',
  };
  
  const sidebarSectionTitleStyles: React.CSSProperties = {
      fontSize: `${sectionTitleSize * 0.9}pt`,
      color: 'var(--primary-color)',
      textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
  };


  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-6">
        <h3 style={mainSectionTitleStyles} className="font-bold tracking-wider mb-2">Summary</h3>
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black" />
      </section>
    ),
    experience: (
      <section key="experience" className="mb-6">
        <h3 style={mainSectionTitleStyles} className="font-bold tracking-wider mb-3">Experience</h3>
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-5 break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" style={{ fontSize: '0.9em' }} path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-gray-700 text-right shrink-0 ml-4 font-medium" />
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium text-gray-800" />
                <EditableField as="p" style={{ fontSize: '0.9em' }} path={`experience[${index}].location`} value={exp.location} onChange={onDataChange} className="text-gray-700 shrink-0 ml-4" />
              </div>
              <EditableList items={exp.description || []} path={`experience[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-black space-y-1 mt-2 pl-5">
                {(desc, descIndex) => (
                    <EditableField as="div" path={`experience[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                )}
              </EditableList>
            </div>
          )}
        </EditableList>
      </section>
    ),
    projects: data.projects && data.projects.length > 0 && (
      <section key="projects" className="mb-6">
        <h3 style={mainSectionTitleStyles} className="font-bold tracking-wider mb-3">Projects</h3>
        <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry}>
            {(proj, index) => (
                <div key={proj.id || index} className="mb-5 break-inside-avoid">
                {proj.image && (
                    <img src={proj.image} alt={`${proj.name} placeholder`} className="w-full h-32 object-cover rounded-md mb-3 border border-gray-200 shadow-sm" />
                )}
                <div className="flex justify-between items-baseline">
                    <h4 style={{ fontSize: `${customization.itemTitleSize}pt` }} className="font-semibold text-black">
                    <EditableField as="span" path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} />
                    <span className="font-normal text-gray-800"> - <EditableField as="span" path={`projects[${index}].role`} value={proj.role} onChange={onDataChange} /></span>
                    </h4>
                </div>
                <EditableList items={proj.description || []} path={`projects[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-black space-y-1 mt-2 pl-5">
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
        <h3 style={sidebarSectionTitleStyles} className="font-bold tracking-wider mb-2">Education</h3>
        <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
          {(edu, index) => (
          <div key={edu.id || index} className="mb-3 break-inside-avoid">
            <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-black" />
            <EditableField as="p" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} className="text-gray-800" />
            <EditableField as="p" style={{ fontSize: '0.9em' }} path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} className="text-gray-700" />
          </div>
          )}
        </EditableList>
      </section>
    ),
    skills: (
      <section key="skills" className="mb-5">
        <h3 style={sidebarSectionTitleStyles} className="font-bold tracking-wider mb-2">Skills</h3>
         <div className="text-sm">
            <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory}>
                {(category, catIndex) => (
                    <div key={category.id || catIndex} className="mb-3 break-inside-avoid">
                        <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize * 0.95}pt` }} path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold text-gray-900" />
                        <div>
                            {(category.skills || []).map((skill, skillIndex) => (
                                <EditableField as="p" key={skill.id || skillIndex} path={`skills[${catIndex}].skills[${skillIndex}].name`} value={skill.name} onChange={onDataChange} className="text-gray-800 py-0.5" />
                            ))}
                        </div>
                    </div>
                )}
            </EditableList>
        </div>
      </section>
    ),
    certifications: data.certifications && data.certifications.length > 0 && (
      <section key="certifications" className="mb-6">
        <h3 style={mainSectionTitleStyles} className="font-bold tracking-wider mb-3">Certifications</h3>
        <EditableList items={data.certifications || []} path="certifications" onChange={onDataChange} newItem={newCertificationEntry}>
          {(cert, index) => (
          <div key={cert.id || index} className="mb-3 break-inside-avoid">
            <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`certifications[${index}].name`} value={cert.name} onChange={onDataChange} className="font-semibold text-black" />
            <EditableField as="p" path={`certifications[${index}].issuer`} value={cert.issuer} onChange={onDataChange} className="text-gray-800" />
          </div>
          )}
        </EditableList>
      </section>
    ),
    awards: data.awards && data.awards.length > 0 && (
      <section key="awards" className="mb-6">
        <h3 style={mainSectionTitleStyles} className="font-bold tracking-wider mb-3">Awards</h3>
        <EditableList items={data.awards || []} path="awards" onChange={onDataChange} newItem={newAwardEntry}>
            {(award, index) => (
            <div key={award.id || index} className="mb-3 break-inside-avoid">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`awards[${index}].name`} value={award.name} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" path={`awards[${index}].issuer`} value={award.issuer} onChange={onDataChange} className="text-gray-800" />
            </div>
            )}
        </EditableList>
      </section>
    ),
  };

  const sidebarSectionKeys: ResumeSectionKey[] = ['education', 'skills'];
  const contactItemClass = "flex items-start gap-2 text-gray-800";
  const contactLinkClass = "hover:text-[var(--primary-color)] break-all";

  return (
    <div id="resume-content" style={{ padding: marginValue }} className="flex gap-8">
      <aside className="w-[33%] flex-shrink-0">
        <div className="text-left mb-8">
          <EditableField as="h1" style={{ fontSize: `${customization.nameSize}pt` }} path="fullName" value={data.fullName} onChange={onDataChange} className="font-bold text-black" />
          <EditableField as="h2" style={{ fontSize: `${customization.titleSize}pt` }} path="title" value={data.title} onChange={onDataChange} className="font-medium text-[var(--primary-color)] mt-1" />
        </div>
        
        <section className="mb-6 space-y-2" style={{fontSize: '0.9em'}}>
            <h3 style={sidebarSectionTitleStyles} className="font-bold tracking-wider mb-2">Contact</h3>
            <div className={contactItemClass}>
                <ContactIcon type="location" className="h-4 w-4 mt-0.5 shrink-0"/>
                <EditableField as="p" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} />
            </div>
            <div className={contactItemClass}>
                <ContactIcon type="email" className="h-4 w-4 mt-0.5 shrink-0"/>
                <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email" />
            </div>
            <div className={contactItemClass}>
                <ContactIcon type="phone" className="h-4 w-4 mt-0.5 shrink-0"/>
                <EditableField as="p" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} />
            </div>
            <div className={contactItemClass}>
                <ContactIcon type="linkedin" className="h-4 w-4 mt-0.5 shrink-0"/>
                <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url" />
            </div>
            {data.contactInfo.github && (
                <div className={contactItemClass}>
                    <ContactIcon type="github" className="h-4 w-4 mt-0.5 shrink-0"/>
                    <EditableField as="a" href={data.contactInfo.github} target="_blank" rel="noopener noreferrer" path="contactInfo.github" value={data.contactInfo.github} onChange={onDataChange} className={contactLinkClass} validation="url" />
                </div>
            )}
        </section>

        {sectionOrder.filter(key => sidebarSectionKeys.includes(key) && sectionVisibility[key]).map(key => sections[key])}
      </aside>

      <main className="w-[67%] border-l-2 border-gray-200 pl-8">
        {sectionOrder.filter(key => !sidebarSectionKeys.includes(key) && sectionVisibility[key]).map(key => sections[key])}
      </main>
    </div>
  );
};

export default CorporateTemplate;