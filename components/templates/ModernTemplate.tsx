import React from 'react';
import { ResumeData, ResumeSectionKey, Customization, Experience, Project, Education, Certification, Award } from '../../types';
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

const ModernTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
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
    paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.5rem' : undefined,
    paddingTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? '0.5rem' : undefined,
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `2px solid ${sectionTitleBorderColor}` : 'none',
    borderTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? `2px solid ${sectionTitleBorderColor}` : 'none',
  };

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-6">
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black" />
      </section>
    ),
    experience: (
      <section key="experience" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-4">Professional Experience</h3>
         <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-6 break-inside-avoid relative group">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" style={{ fontSize: '0.9em' }} path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-slate-600 text-right shrink-0 ml-4 font-medium" />
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium text-slate-800" />
                <EditableField as="p" style={{ fontSize: '0.9em' }} path={`experience[${index}].location`} value={exp.location} onChange={onDataChange} className="text-slate-600 shrink-0 ml-4" />
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
    projects: (
      <section key="projects" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-4">Projects</h3>
        <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry}>
          {(proj, index) => (
            <div key={proj.id || index} className="mb-6 break-inside-avoid relative group">
              {proj.image && (
                  <img src={proj.image} alt={`${proj.name} placeholder`} className="w-full h-32 object-cover rounded-md mb-3 border border-slate-200 shadow-sm" />
              )}
              <div className="flex justify-between items-baseline">
                <h4 style={{ fontSize: `${customization.itemTitleSize}pt` }} className="font-semibold text-black">
                  <EditableField as="span" path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} />
                  <span className="font-normal text-slate-800"> - <EditableField as="span" path={`projects[${index}].role`} value={proj.role} onChange={onDataChange} /></span>
                </h4>
                {(proj.startDate || proj.endDate) && (
                    <p style={{ fontSize: '0.9em' }} className="text-slate-600 text-right shrink-0 ml-4 font-medium">
                        <EditableField as="span" path={`projects[${index}].startDate`} value={proj.startDate} onChange={onDataChange} />
                        {proj.endDate ? ` - ` : ''}
                        <EditableField as="span" path={`projects[${index}].endDate`} value={proj.endDate} onChange={onDataChange} />
                    </p>
                )}
              </div>
               <div className="flex justify-between items-baseline mb-2">
                  <p style={{ fontSize: '0.9em' }} className="text-slate-800 font-medium">
                      Technologies: <EditableField as="span" path={`projects[${index}].technologies`} value={(proj.technologies || []).join(', ')} onChange={(path, value) => onDataChange(path, value.split(',').map(s => s.trim()))} />
                  </p>
                  <EditableField as="a" href={proj.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9em' }} path={`projects[${index}].link`} value={proj.link} onChange={onDataChange} className="text-slate-600 hover:text-[var(--primary-color)] shrink-0 ml-4" />
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
       <section key="education" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-4">Education</h3>
        <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
          {(edu, index) => (
            <div key={edu.id || index} className="mb-4 break-inside-avoid relative group">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" style={{ fontSize: '0.9em' }} path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} className="text-slate-600 shrink-0 ml-4 font-medium" />
              </div>
              <EditableField as="p" path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="text-slate-800" />
            </div>
          )}
        </EditableList>
      </section>
    ),
    skills: (
      <section key="skills" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-4">Skills</h3>
        {/* Note: Inline editing for skills is complex due to the tag-like structure. Editing is best handled in the form. */}
        {(data.skills || []).map((category, catIndex) => (
          <div key={category.id || catIndex} className="mb-4 break-inside-avoid">
            <EditableField as="h4" style={{ fontSize: '1.0em' }} path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold text-slate-800 mb-2" />
            <div className="flex flex-wrap gap-2">
              {(category.skills || []).map((skill, skillIndex) => (
                <div key={skill.id || skillIndex} className="bg-slate-100 text-slate-900 font-medium px-3 py-1 rounded-md">
                  <EditableField as="span" style={{ fontSize: '0.9em' }} path={`skills[${catIndex}].skills[${skillIndex}].name`} value={skill.name} onChange={onDataChange} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    ),
    certifications: (
      <section key="certifications" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-4">Certifications</h3>
        <EditableList items={data.certifications || []} path="certifications" onChange={onDataChange} newItem={newCertificationEntry}>
          {(cert, index) => (
            <div key={cert.id || index} className="mb-4 break-inside-avoid relative group">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`certifications[${index}].name`} value={cert.name} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" style={{ fontSize: '0.9em' }} path={`certifications[${index}].date`} value={cert.date} onChange={onDataChange} className="text-slate-600 shrink-0 ml-4 font-medium" />
              </div>
              <EditableField as="p" path={`certifications[${index}].issuer`} value={cert.issuer} onChange={onDataChange} className="text-slate-800" />
            </div>
          )}
        </EditableList>
      </section>
    ),
    awards: (
      <section key="awards" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wider mb-4">Awards &amp; Honors</h3>
         <EditableList items={data.awards || []} path="awards" onChange={onDataChange} newItem={newAwardEntry}>
          {(award, index) => (
            <div key={award.id || index} className="mb-4 break-inside-avoid relative group">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`awards[${index}].name`} value={award.name} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" style={{ fontSize: '0.9em' }} path={`awards[${index}].date`} value={award.date} onChange={onDataChange} className="text-slate-600 shrink-0 ml-4 font-medium" />
              </div>
              <EditableField as="p" path={`awards[${index}].issuer`} value={award.issuer} onChange={onDataChange} className="text-slate-800" />
            </div>
          )}
        </EditableList>
      </section>
    ),
  };

  const contactItemClass = "flex items-center gap-2";
  const contactLinkClass = "hover:opacity-100 transition-opacity";

  return (
    <div id="resume-content">
        {/* Header */}
        <header 
          className="bg-[var(--primary-color)] text-[var(--text-on-primary)] mb-6"
          style={{ padding: `${marginValue}` }}
        >
             <EditableField
              as="h1"
              path="fullName"
              value={data.fullName}
              onChange={onDataChange}
              style={{ fontSize: `${customization.nameSize}pt` }}
              className="font-bold"
            />
            <EditableField
              as="h2"
              path="title"
              value={data.title}
              onChange={onDataChange}
              style={{ fontSize: `${customization.titleSize}pt` }}
              className="font-medium opacity-90 mt-1"
            />
            <div style={{ fontSize: '0.9em' }} className="flex flex-wrap gap-x-5 gap-y-2 opacity-80 mt-4 border-t border-white/20 pt-4">
              <div className={contactItemClass}>
                <ContactIcon type="location" className="h-4 w-4"/>
                <EditableField as="p" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} />
              </div>
              <div className={contactItemClass}>
                <ContactIcon type="email" className="h-4 w-4"/>
                <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email"/>
              </div>
              <div className={contactItemClass}>
                <ContactIcon type="phone" className="h-4 w-4"/>
                <EditableField as="p" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} />
              </div>
              <div className={contactItemClass}>
                <ContactIcon type="linkedin" className="h-4 w-4"/>
                <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url"/>
              </div>
               {data.contactInfo.github && (
                    <div className={contactItemClass}>
                        <ContactIcon type="github" className="h-4 w-4"/>
                        <EditableField as="a" href={data.contactInfo.github} target="_blank" rel="noopener noreferrer" path="contactInfo.github" value={data.contactInfo.github} onChange={onDataChange} className={contactLinkClass} validation="url"/>
                    </div>
               )}
               {data.contactInfo.portfolio && (
                    <div className={contactItemClass}>
                        <ContactIcon type="portfolio" className="h-4 w-4"/>
                        <EditableField as="a" href={data.contactInfo.portfolio} target="_blank" rel="noopener noreferrer" path="contactInfo.portfolio" value={data.contactInfo.portfolio} onChange={onDataChange} className={contactLinkClass} validation="url"/>
                    </div>
               )}
            </div>
        </header>

      <main style={{ padding: `0 ${marginValue} ${marginValue}` }}>
        {sectionOrder.filter(key => sectionVisibility[key]).map((sectionKey) => sections[sectionKey])}
      </main>
    </div>
  );
};

export default ModernTemplate;