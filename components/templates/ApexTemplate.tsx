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
const newCertificationEntry: Certification = { id: '', name: 'Certification Name', issuer: 'Issuing Body', date: 'Mmm YYYY' };
const newAwardEntry: Award = { id: '', name: 'Award Name', issuer: 'Issuer', date: 'Mmm YYYY' };
const newSkillCategory: SkillCategory = { id: '', name: 'New Category', skills: [{id: '', name: 'New Skill', proficiency: 'Intermediate'}] };

const ApexTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
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
    color: 'var(--primary-color)',
    textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
    letterSpacing: '0.05em',
    paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
    paddingTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `2px solid ${sectionTitleBorderColor}` : 'none',
    borderTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? `2px solid ${sectionTitleBorderColor}` : 'none',
  };

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-6">
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black text-center" />
      </section>
    ),
    experience: (
      <section key="experience" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold mb-4 text-center">Experience</h3>
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-5 break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} style={{ fontSize: '0.9em' }} className="text-slate-600 text-right shrink-0 ml-4 font-medium" />
              </div>
              <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium text-slate-800" />
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
        <section key="education" className="mb-6">
          <h3 style={sectionTitleStyles} className="font-bold mb-4 text-center">Education</h3>
          <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
            {(edu, index) => (
              <div key={edu.id || index} className="mb-3 break-inside-avoid text-center">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-black" />
                <p className="text-slate-800">
                  <EditableField as="span" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} />, {' '}
                  <EditableField as="span" path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} />
                </p>
              </div>
            )}
          </EditableList>
        </section>
      ),
      skills: (
        <section key="skills" className="mb-6">
          <h3 style={sectionTitleStyles} className="font-bold mb-4 text-center">Skills</h3>
          <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory}>
            {(category, catIndex) => (
              <p key={category.id || catIndex} className="mb-1 text-black text-center">
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
    projects: (
      <section key="projects" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold mb-4 text-center">Projects</h3>
        <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry}>
          {(proj, index) => (
            <div key={proj.id || index} className="mb-5 break-inside-avoid text-center">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" path={`projects[${index}].role`} value={proj.role} onChange={onDataChange} className="text-slate-700 italic" />
            </div>
          )}
        </EditableList>
      </section>
    ),
    certifications: (
        <section key="certifications" className="mb-6">
          <h3 style={sectionTitleStyles} className="font-bold mb-4 text-center">Certifications</h3>
          <EditableList items={data.certifications || []} path="certifications" onChange={onDataChange} newItem={newCertificationEntry}>
            {(cert, index) => (
              <p key={cert.id || index} className="text-black text-center">
                <EditableField as="span" path={`certifications[${index}].name`} value={cert.name} onChange={onDataChange} className="font-semibold" />, {' '}
                <EditableField as="span" path={`certifications[${index}].issuer`} value={cert.issuer} onChange={onDataChange} />
              </p>
            )}
          </EditableList>
        </section>
    ),
    awards: (
        <section key="awards" className="mb-6">
          <h3 style={sectionTitleStyles} className="font-bold mb-4 text-center">Awards</h3>
          <EditableList items={data.awards || []} path="awards" onChange={onDataChange} newItem={newAwardEntry}>
            {(award, index) => (
              <p key={award.id || index} className="text-black text-center">
                <EditableField as="span" path={`awards[${index}].name`} value={award.name} onChange={onDataChange} className="font-semibold" />, {' '}
                <EditableField as="span" path={`awards[${index}].issuer`} value={award.issuer} onChange={onDataChange} />
              </p>
            )}
          </EditableList>
        </section>
    ),
  };
  
  const contactItemClass = "flex items-center gap-2 text-slate-100";
  const contactLinkClass = "hover:opacity-80";

  return (
    <div id="resume-content" style={{ padding: `0 ${marginValue} ${marginValue}` }}>
      <header className="bg-[var(--primary-color)] text-[var(--text-on-primary)] text-center py-6 px-4" style={{ margin: `0 -${marginValue}` }}>
        <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize}pt` }} className="font-bold" />
        <EditableField as="h2" path="title" value={data.title} onChange={onDataChange} style={{ fontSize: `${customization.titleSize}pt` }} className="font-medium opacity-90 mt-1" />
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm mt-4 border-t border-white/20 pt-4">
          <span className={contactItemClass}> <ContactIcon type="location" className="h-4 w-4"/> <EditableField as="span" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} /> </span>
          <span className={contactItemClass}> <ContactIcon type="email" className="h-4 w-4"/> <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email"/> </span>
          <span className={contactItemClass}> <ContactIcon type="linkedin" className="h-4 w-4"/> <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url" /> </span>
        </div>
      </header>
      <main className="mt-6">
        {sectionOrder.filter(key => sectionVisibility[key]).map(sectionKey => sections[sectionKey])}
      </main>
    </div>
  );
};

export default ApexTemplate;