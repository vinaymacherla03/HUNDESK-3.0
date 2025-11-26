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
const newCertificationEntry: Certification = { id: '', name: 'Certification Name', issuer: 'Issuing Body', date: 'Mmm YYYY' };
const newAwardEntry: Award = { id: '', name: 'Award Name', issuer: 'Issuer', date: 'Mmm YYYY' };
const newSkillCategory: SkillCategory = { id: '', name: 'New Category', skills: [{id: '', name: 'New Skill', proficiency: 'Intermediate'}] };

const AcademicTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
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
    paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
    paddingTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `1px solid ${sectionTitleBorderColor}` : 'none',
    borderTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? `1px solid ${sectionTitleBorderColor}` : 'none',
  };

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-semibold tracking-widest mb-3">Summary</h3>
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black" />
      </section>
    ),
    education: (
      <section key="education" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-semibold tracking-widest mb-3">Education</h3>
        <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
          {(edu, index) => (
            <div key={edu.id || index} className="mb-4 break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" style={{ fontSize: '0.9em' }} path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} className="text-gray-700 shrink-0 ml-4 font-medium" />
              </div>
              <EditableField as="p" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} className="text-gray-800" />
              {(edu.relevantCoursework && edu.relevantCoursework.length > 0) && (
                  <p style={{ fontSize: '0.9em' }} className="text-gray-700 mt-1">
                  <strong>Relevant Coursework:</strong> <EditableField as="span" path={`education[${index}].relevantCoursework`} value={(edu.relevantCoursework || []).join(', ')} onChange={(p,v)=>onDataChange(p, v.split(',').map(s=>s.trim()))} />
                  </p>
              )}
            </div>
          )}
        </EditableList>
      </section>
    ),
    experience: (
      <section key="experience" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-semibold tracking-widest mb-3">Research & Teaching</h3>
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-6 break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" style={{ fontSize: '0.9em' }} path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-gray-700 text-right shrink-0 ml-4 font-medium" />
              </div>
              <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium text-gray-800" />
              <EditableList items={exp.description || []} path={`experience[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-black space-y-1 mt-2 pl-5">
                  {(desc, descIndex) => (
                      <EditableField as="span" path={`experience[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                  )}
              </EditableList>
            </div>
          )}
        </EditableList>
      </section>
    ),
    projects: data.projects && data.projects.length > 0 && (
      <section key="projects" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-semibold tracking-widest mb-3">Publications & Projects</h3>
        <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry}>
          {(proj, index) => (
            <div key={proj.id || index} className="mb-4 break-inside-avoid">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} className="font-semibold text-black" />
              <div className="text-gray-800">
                  <EditableField as="span" path={`projects[${index}].role`} value={proj.role} onChange={onDataChange} />
                  {(proj.endDate) && (<span>, <EditableField as="span" path={`projects[${index}].endDate`} value={proj.endDate} onChange={onDataChange}/></span>)}
              </div>
              <EditableList items={proj.description || []} path={`projects[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="text-black mt-1 pl-5">
                  {(desc, descIndex) => (
                      <EditableField as="p" key={descIndex} path={`projects[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                  )}
              </EditableList>
            </div>
          )}
        </EditableList>
      </section>
    ),
    skills: (
      <section key="skills" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-semibold tracking-widest mb-3">Skills</h3>
        <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory}>
            {(category, catIndex) => (
                <div key={category.id || catIndex} className="mb-2 break-inside-avoid text-black">
                    <EditableField as="span" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold" />: {' '}
                    {category.skills.map((skill, skillIndex) => (
                        <React.Fragment key={skill.id || skillIndex}>
                            <EditableField as="span" path={`skills[${catIndex}].skills[${skillIndex}].name`} value={skill.name} onChange={onDataChange} />
                            {skillIndex < category.skills.length - 1 ? ', ' : ''}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </EditableList>
      </section>
    ),
    certifications: data.certifications && data.certifications.length > 0 && (
      <section key="certifications" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-semibold tracking-widest mb-3">Certifications</h3>
        <EditableList items={data.certifications || []} path="certifications" onChange={onDataChange} newItem={newCertificationEntry} className="space-y-3">
          {(cert, index) => (
            <div key={cert.id || index} className="break-inside-avoid">
              <EditableField as="h4" path={`certifications[${index}].name`} value={cert.name} onChange={onDataChange} className="font-semibold text-black" />
              <EditableField as="span" path={`certifications[${index}].issuer`} value={cert.issuer} onChange={onDataChange} className="text-gray-800" />, <EditableField as="span" path={`certifications[${index}].date`} value={cert.date} onChange={onDataChange} className="text-gray-700" />
            </div>
          )}
        </EditableList>
      </section>
    ),
    awards: data.awards && data.awards.length > 0 && (
      <section key="awards" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-semibold tracking-widest mb-3">Awards &amp; Grants</h3>
        <EditableList items={data.awards || []} path="awards" onChange={onDataChange} newItem={newAwardEntry} className="space-y-3">
          {(award, index) => (
            <div key={award.id || index} className="break-inside-avoid">
                <EditableField as="h4" path={`awards[${index}].name`} value={award.name} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="span" path={`awards[${index}].issuer`} value={award.issuer} onChange={onDataChange} className="text-gray-800" />, <EditableField as="span" path={`awards[${index}].date`} value={award.date} onChange={onDataChange} className="text-gray-700" />
            </div>
          )}
        </EditableList>
      </section>
    ),
  };

  const contactItemClass = "text-gray-800";
  const contactLinkClass = "hover:text-[var(--primary-color)]";

  return (
    <div id="resume-content" style={{ padding: marginValue }}>
      <header className="text-center mb-4">
        <EditableField 
          as="h1"
          path="fullName"
          value={data.fullName}
          onChange={onDataChange}
          style={{ fontSize: `${customization.nameSize}pt` }}
          className="font-bold text-black"
        />
        <EditableField 
          as="h2"
          path="title"
          value={data.title}
          onChange={onDataChange}
          style={{ fontSize: `${customization.titleSize}pt` }}
          className="font-medium text-[var(--primary-color)] mt-1"
        />
        <div style={{ fontSize: '0.9em' }} className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-4">
          <EditableField as="p" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} className={contactItemClass}/>
          <span className="text-gray-500">&bull;</span>
          <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={`${contactItemClass} ${contactLinkClass}`} validation="email" />
          <span className="text-gray-500">&bull;</span>
          <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={`${contactItemClass} ${contactLinkClass}`} validation="url" />
          <span className="text-gray-500">&bull;</span>
          <EditableField as="a" href={data.contactInfo.portfolio} target="_blank" rel="noopener noreferrer" path="contactInfo.portfolio" value={data.contactInfo.portfolio} onChange={onDataChange} className={`${contactItemClass} ${contactLinkClass}`} validation="url" />
        </div>
      </header>

      <hr style={{borderColor: 'var(--primary-color)'}} className="border-t-2 mb-6 opacity-60" />

      <main>
        {sectionOrder.filter(key => sectionVisibility[key]).map((sectionKey) => sections[sectionKey])}
      </main>
    </div>
  );
};

export default AcademicTemplate;