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
  compact: '0.7in',
  normal: '0.9in',
  spacious: '1.1in',
};

const newExperienceEntry: Experience = { id: '', role: 'New Role', company: 'New Company', location: 'City, State', dates: 'Mmm YYYY - Mmm YYYY', description: ['New achievement.'] };
const newProjectEntry: Project = { id: '', name: 'New Project', role: 'Lead', description: ['Description of project.'], technologies: [] };
const newEducationEntry: Education = { id: '', degree: 'Degree or Certificate', institution: 'Institution Name', location: 'City, State', graduationDate: 'Mmm YYYY' };
const newCertificationEntry: Certification = { id: '', name: 'Certification Name', issuer: 'Issuing Body', date: 'Mmm YYYY' };
const newAwardEntry: Award = { id: '', name: 'Award Name', issuer: 'Issuer', date: 'Mmm YYYY' };
const newSkillCategory: SkillCategory = { id: '', name: 'New Category', skills: [{id: '', name: 'New Skill', proficiency: 'Intermediate'}] };


const SerifTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
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
    letterSpacing: '0.1em',
    paddingBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? '0.2rem' : undefined,
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `1px solid ${sectionTitleBorderColor}` : 'none',
  };

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-5">
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
                <h4 style={{ fontSize: `${customization.itemTitleSize}pt` }} className="font-semibold text-black">
                  <EditableField as="span" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} />
                </h4>
                <EditableField as="p" style={{ fontSize: '0.9em' }} path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-slate-600 text-right shrink-0 ml-4 font-medium" />
              </div>
              <EditableField as="p" path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-medium text-slate-800 mb-1 italic" />
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
          <h3 style={sectionTitleStyles} className="font-semibold mb-3">Education</h3>
          <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
            {(edu, index) => (
              <div key={edu.id || index} className="mb-3 break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <h4 style={{ fontSize: `${customization.itemTitleSize}pt` }} className="font-semibold text-black">
                      <EditableField as="span" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} />
                  </h4>
                  <EditableField as="p" style={{ fontSize: '0.9em' }} path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} className="text-slate-600 shrink-0 ml-4 font-medium" />
                </div>
                <p className="text-slate-800 italic">
                  <EditableField as="span" path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} />
                </p>
              </div>
            )}
          </EditableList>
        </section>
      ),
    skills: (
        <section key="skills" className="mb-5">
          <h3 style={sectionTitleStyles} className="font-semibold mb-3">Skills</h3>
          <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory}>
              {(category, catIndex) => (
                <p key={category.id || catIndex} className="mb-1 text-black">
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
      <section key="projects" className="mb-5">
        <h3 style={sectionTitleStyles} className="font-semibold mb-3">Projects</h3>
        <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry}>
          {(proj, index) => (
            <div key={proj.id || index} className="mb-3 break-inside-avoid">
              <h4 style={{ fontSize: `${customization.itemTitleSize}pt` }} className="font-semibold text-black">
                  <EditableField as="span" path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} />
              </h4>
            </div>
          )}
        </EditableList>
      </section>
    ),
    certifications: (
      <section key="certifications" className="mb-5">
        <h3 style={sectionTitleStyles} className="font-semibold mb-3">Certifications</h3>
        <EditableList items={data.certifications || []} path="certifications" onChange={onDataChange} newItem={newCertificationEntry}>
          {(cert, index) => (
            <p key={cert.id || index} className="text-black">{cert.name}</p>
          )}
        </EditableList>
      </section>
    ),
    awards: (
      <section key="awards" className="mb-5">
        <h3 style={sectionTitleStyles} className="font-semibold mb-3">Awards</h3>
        <EditableList items={data.awards || []} path="awards" onChange={onDataChange} newItem={newAwardEntry}>
          {(award, index) => (
            <p key={award.id || index} className="text-black">{award.name}</p>
          )}
        </EditableList>
      </section>
    ),
  };
  
  const contactLinkClass = "text-slate-800 hover:text-[var(--primary-color)]";

  return (
    <div id="resume-content" style={{ padding: marginValue }}>
      <header className="text-center mb-4 pb-2 border-b-2 border-slate-700">
        <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize}pt` }} className="font-bold text-black tracking-widest" />
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm mt-2">
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

export default SerifTemplate;