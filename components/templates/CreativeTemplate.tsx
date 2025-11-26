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


const CreativeTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
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
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `2px solid ${sectionTitleBorderStyle === 'underline' ? 'var(--primary-color)' : sectionTitleBorderColor}` : 'none',
    borderTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? `2px solid ${sectionTitleBorderColor}` : 'none',
  };

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-4">Summary</h3>
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black" />
      </section>
    ),
    experience: (
      <section key="experience" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-4">Professional Experience</h3>
         <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-6 break-inside-avoid relative group">
                <div className="flex justify-between items-start">
                  <div>
                      <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
                      <p className="font-medium text-gray-800">
                        <EditableField as="span" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} /> &bull; <EditableField as="span" path={`experience[${index}].location`} value={exp.location} onChange={onDataChange} />
                      </p>
                  </div>
                 <EditableField as="p" style={{ fontSize: '0.9em' }} path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-gray-700 text-right shrink-0 ml-4 font-medium" />
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
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-4">Projects</h3>
        <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry}>
          {(proj, index) => (
            <div key={proj.id || index} className="mb-6 break-inside-avoid relative group">
                <div className="flex justify-between items-start">
                  <div>
                      <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} className="font-semibold text-black" />
                      <EditableField as="p" path={`projects[${index}].role`} value={proj.role} onChange={onDataChange} className="font-semibold text-gray-800 -mt-1 mb-1" />
                      <EditableField as="a" href={proj.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9em' }} path={`projects[${index}].link`} value={proj.link} onChange={onDataChange} className="font-medium text-[var(--primary-color)] hover:underline" />
                  </div>
                  {(proj.startDate || proj.endDate) && (
                      <p style={{ fontSize: '0.9em' }} className="text-gray-700 text-right shrink-0 ml-4 font-medium">
                          <EditableField as="span" path={`projects[${index}].startDate`} value={proj.startDate} onChange={onDataChange} />
                          {proj.endDate ? ` - ` : ''}
                          <EditableField as="span" path={`projects[${index}].endDate`} value={proj.endDate} onChange={onDataChange} />
                      </p>
                  )}
                </div>
                 <div className="flex flex-wrap gap-2 mt-2">
                     <EditableField as="p" style={{ fontSize: '0.85em' }} path={`projects[${index}].technologies`} value={(proj.technologies || []).join(', ')} onChange={(path, value) => onDataChange(path, value.split(',').map(s => s.trim()))} className="text-gray-700 italic" />
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
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-4">Education</h3>
        <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
          {(edu, index) => (
            <div key={edu.id || index} className="mb-4 break-inside-avoid relative group">
                <div className="flex justify-between items-start">
                  <div>
                      <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-black" />
                      <EditableField as="p" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} className="text-gray-800" />
                      {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                          <p style={{ fontSize: '0.9em' }} className="text-gray-700 mt-1">
                              <strong>Relevant Courses:</strong> <EditableField as="span" path={`education[${index}].relevantCoursework`} value={(edu.relevantCoursework || []).join(', ')} onChange={(path, value) => onDataChange(path, value.split(',').map(s => s.trim()))} />
                          </p>
                      )}
                  </div>
                  <EditableField as="p" style={{ fontSize: '0.9em' }} path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} className="text-gray-700 shrink-0 ml-4 font-medium" />
                </div>
            </div>
          )}
        </EditableList>
      </section>
    ),
    skills: (
      <section key="skills" className="mb-6">
        <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-4">Skills</h3>
        {(data.skills || []).map((category, catIndex) => (
          <div key={category.id || catIndex} className="mb-4 break-inside-avoid">
            <EditableField as="h4" style={{ fontSize: '1.0em' }} path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold text-gray-800 mb-2" />
            <div className="flex flex-wrap gap-2">
              {(category.skills || []).map((skill, skillIndex) => (
                <div key={skill.id || skillIndex} className="bg-gray-100 text-gray-900 font-medium px-3 py-1 rounded-full">
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
          <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-4">Certifications</h3>
           <EditableList items={data.certifications || []} path="certifications" onChange={onDataChange} newItem={newCertificationEntry}>
            {(cert, index) => (
              <div key={cert.id || index} className="mt-4 break-inside-avoid relative group">
                  <div className="flex justify-between items-start">
                      <div>
                          <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`certifications[${index}].name`} value={cert.name} onChange={onDataChange} className="font-semibold text-black" />
                          <EditableField as="p" path={`certifications[${index}].issuer`} value={cert.issuer} onChange={onDataChange} className="text-gray-800" />
                      </div>
                      <EditableField as="p" style={{ fontSize: '0.9em' }} path={`certifications[${index}].date`} value={cert.date} onChange={onDataChange} className="text-gray-700 shrink-0 ml-4 font-medium" />
                  </div>
              </div>
            )}
          </EditableList>
      </section>
    ),
    awards: (
      <section key="awards" className="mb-6">
          <h3 style={sectionTitleStyles} className="font-bold tracking-wide mb-4">Awards &amp; Honors</h3>
           <EditableList items={data.awards || []} path="awards" onChange={onDataChange} newItem={newAwardEntry}>
            {(award, index) => (
              <div key={award.id || index} className="mt-4 break-inside-avoid relative group">
                  <div className="flex justify-between items-start">
                      <div>
                          <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`awards[${index}].name`} value={award.name} onChange={onDataChange} className="font-semibold text-black" />
                          <EditableField as="p" path={`awards[${index}].issuer`} value={award.issuer} onChange={onDataChange} className="text-gray-800" />
                      </div>
                      <EditableField as="p" style={{ fontSize: '0.9em' }} path={`awards[${index}].date`} value={award.date} onChange={onDataChange} className="text-gray-700 shrink-0 ml-4 font-medium" />
                  </div>
              </div>
            )}
          </EditableList>
      </section>
    ),
  };
  
  const contactItemClass = "flex items-center gap-2 text-gray-800";
  const contactLinkClass = "hover:text-[var(--primary-color)]";

  return (
    <div id="resume-content" className="bg-white" style={{ padding: marginValue }}>
       <header className="text-center mb-8">
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
          className="font-medium text-gray-800 mt-1"
        />
        <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-gray-700 mt-4">
          <div className={contactItemClass}>
            <ContactIcon type="location" className="h-4 w-4 text-gray-700"/>
            <EditableField as="p" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} />
          </div>
          <div className={contactItemClass}>
            <ContactIcon type="email" className="h-4 w-4 text-gray-700"/>
            <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email"/>
          </div>
          <div className={contactItemClass}>
            <ContactIcon type="linkedin" className="h-4 w-4 text-gray-700"/>
            <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url"/>
          </div>
        </div>
      </header>
      
      <main className="space-y-6">
        {sectionOrder.filter(key => sectionVisibility[key]).map(sectionKey => sections[sectionKey])}
      </main>
    </div>
  );
};

export default CreativeTemplate;