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


const VibrantTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = marginMap[customization.margin] || marginMap.normal;
  
  const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <section className="mb-6 break-inside-avoid">
        <h3 style={{fontSize: `${customization.sectionTitleSize}pt`}} className="font-bold mb-3 uppercase tracking-wider text-black">{title}</h3>
        {children}
    </section>
  );

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <Section key="summary" title="About Me">
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-slate-700" />
      </Section>
    ),
    experience: (
      <Section key="experience" title="Experience">
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-5">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
                 <div className="flex justify-between items-baseline text-slate-600" style={{fontSize: '0.9em'}}>
                    <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium" />
                    <EditableField as="p" path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-right shrink-0 ml-4 font-medium" />
                </div>
              <EditableList items={exp.description || []} path={`experience[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-slate-700 space-y-1 mt-2 pl-5">
                {(desc, descIndex) => ( <EditableField as="div" path={`experience[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} /> )}
               </EditableList>
            </div>
        )}
        </EditableList>
      </Section>
    ),
    education: (
      <Section key="education" title="Education">
        <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
            {(edu, index) => (
            <div key={edu.id || index} className="mb-3">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-black" />
                <p className="text-slate-700">
                    <EditableField as="span" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} />{' | '}
                    <EditableField as="span" path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} />
                </p>
            </div>
            )}
        </EditableList>
      </Section>
    ),
    skills: (
      <Section key="skills" title="Skills">
        <div className="flex flex-wrap gap-2">
          {(data.skills || []).flatMap((category, catIndex) =>
            category.skills.map((skill, skillIndex) => (
              <div key={skill.id || `${catIndex}-${skillIndex}`} className="border-2 border-[var(--primary-color)] text-[var(--primary-color)] font-semibold px-3 py-1 rounded-full">
                <EditableField as="span" style={{ fontSize: '0.9em' }} path={`skills[${catIndex}].skills[${skillIndex}].name`} value={skill.name} onChange={onDataChange} />
              </div>
            ))
          )}
        </div>
      </Section>
    ),
    projects: (
      <Section key="projects" title="Projects">
        <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry}>
          {(proj, index) => (
            <div key={proj.id || index} className="mb-3">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} className="font-semibold text-black" />
            </div>
          )}
        </EditableList>
      </Section>
    ),
    certifications: (
      <Section key="certifications" title="Certifications">
        <EditableList items={data.certifications || []} path="certifications" onChange={onDataChange} newItem={newCertificationEntry}>
          {(cert, index) => (
            <div key={cert.id || index} className="mb-3">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`certifications[${index}].name`} value={cert.name} onChange={onDataChange} className="font-semibold text-black" />
            </div>
          )}
        </EditableList>
      </Section>
    ),
    awards: (
      <Section key="awards" title="Awards">
        <EditableList items={data.awards || []} path="awards" onChange={onDataChange} newItem={newAwardEntry}>
          {(award, index) => (
            <div key={award.id || index} className="mb-3">
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`awards[${index}].name`} value={award.name} onChange={onDataChange} className="font-semibold text-black" />
            </div>
          )}
        </EditableList>
      </Section>
    ),
  };
  
  const contactItemClass = "flex items-center gap-2 text-slate-100";
  const contactLinkClass = "hover:opacity-80";
  
  return (
    <div id="resume-content" className="flex">
      <aside className="w-[35%] bg-[var(--primary-color)] text-[var(--text-on-primary)] flex flex-col justify-center items-center text-center" style={{ padding: marginValue }}>
            <header className="mb-8">
                <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize * 1.2}pt` }} className="font-bold" />
                <EditableField as="h2" path="title" value={data.title} onChange={onDataChange} style={{ fontSize: `${customization.titleSize * 1.1}pt` }} className="font-medium opacity-90 mt-1" />
            </header>
             <section className="space-y-3">
                <div className={contactItemClass}><ContactIcon type="email" className="h-4 w-4 shrink-0"/> <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email"/></div>
                <div className={contactItemClass}><ContactIcon type="phone" className="h-4 w-4 shrink-0"/> <EditableField as="p" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} /></div>
                <div className={contactItemClass}><ContactIcon type="linkedin" className="h-4 w-4 shrink-0"/> <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url"/></div>
            </section>
        </aside>

        <main className="w-[65%]" style={{ padding: marginValue }}>
            {sectionOrder.filter(key => sectionVisibility[key]).map(sectionKey => sections[sectionKey])}
        </main>
    </div>
  );
};

export default VibrantTemplate;