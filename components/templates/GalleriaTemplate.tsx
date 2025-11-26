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


const GalleriaTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = marginMap[customization.margin] || marginMap.normal;
  
  const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <section className="mb-6 break-inside-avoid">
        <h3 style={{fontSize: `${customization.sectionTitleSize}pt`}} className="font-bold mb-3 uppercase tracking-wider text-[var(--primary-color)]">{title}</h3>
        {children}
    </section>
  );

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-6">
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black text-lg" />
      </section>
    ),
    projects: (
        <Section key="projects" title="Portfolio">
            <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry} className="grid grid-cols-2 gap-4">
              {(proj, index) => (
                <div key={proj.id || index} className="break-inside-avoid">
                  {proj.image && (
                      <img src={proj.image} alt={`${proj.name} placeholder`} className="w-full h-32 object-cover rounded-md mb-2 border border-gray-200 shadow-sm" />
                  )}
                  <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt`}} className="font-semibold text-black" path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} />
                  <EditableField as="p" path={`projects[${index}].technologies`} value={(proj.technologies || []).join(', ')} onChange={(p, v) => onDataChange(p, v.split(',').map(s=>s.trim()))} className="text-sm text-slate-600"/>
                </div>
              )}
            </EditableList>
        </Section>
    ),
    experience: (
      <Section key="experience" title="Experience">
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
                <EditableField as="p" path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} style={{ fontSize: '0.9em' }} className="text-slate-600 text-right shrink-0 ml-4 font-medium" />
              </div>
              <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium text-slate-800 mb-1" />
            </div>
          )}
        </EditableList>
      </Section>
    ),
    education: null, skills: null, certifications: null, awards: null,
  };
  
  const contactItemClass = "flex items-center gap-2 text-slate-800";
  const contactLinkClass = "hover:text-[var(--primary-color)]";

  return (
    <div id="resume-content" className="flex gap-8" style={{ padding: marginValue }}>
        <aside className="w-[30%] flex-shrink-0">
            <header className="mb-8">
                <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize}pt` }} className="font-bold text-black" />
                <EditableField as="h2" path="title" value={data.title} onChange={onDataChange} style={{ fontSize: `${customization.titleSize}pt` }} className="font-medium text-slate-700 mt-1" />
            </header>
             <section className="space-y-3">
                <h3 style={{fontSize: `${customization.sectionTitleSize}pt`}} className="font-bold mb-3 uppercase tracking-wider text-[var(--primary-color)]">Contact</h3>
                <div className={contactItemClass}><ContactIcon type="email" className="h-4 w-4 shrink-0"/> <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email"/></div>
                <div className={contactItemClass}><ContactIcon type="phone" className="h-4 w-4 shrink-0"/> <EditableField as="p" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} /></div>
                <div className={contactItemClass}><ContactIcon type="linkedin" className="h-4 w-4 shrink-0"/> <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url"/></div>
                <div className={contactItemClass}><ContactIcon type="portfolio" className="h-4 w-4 shrink-0"/> <EditableField as="a" href={data.contactInfo.portfolio} target="_blank" rel="noopener noreferrer" path="contactInfo.portfolio" value={data.contactInfo.portfolio} onChange={onDataChange} className={contactLinkClass} validation="url"/></div>
            </section>
             <section className="mt-8">
                <h3 style={{fontSize: `${customization.sectionTitleSize}pt`}} className="font-bold mb-3 uppercase tracking-wider text-[var(--primary-color)]">Skills</h3>
                <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory}>
                    {(category, catIndex) => (
                        <ul key={category.id || catIndex} className="list-disc list-outside pl-5 text-black">
                            {category.skills.map((s, i) => (
                                <EditableField as="li" key={s.id || i} path={`skills[${catIndex}].skills[${i}].name`} value={s.name} onChange={onDataChange} />
                            ))}
                        </ul>
                    )}
                </EditableList>
            </section>
            <section className="mt-8">
                 <h3 style={{fontSize: `${customization.sectionTitleSize}pt`}} className="font-bold mb-3 uppercase tracking-wider text-[var(--primary-color)]">Education</h3>
                 {(data.education || []).map(edu => (
                     <div key={edu.id} className="mb-2">
                         <p className="font-semibold">{edu.degree}</p>
                         <p className="text-sm text-slate-700">{edu.institution}</p>
                     </div>
                 ))}
            </section>
             <section className="mt-8">
                 <h3 style={{fontSize: `${customization.sectionTitleSize}pt`}} className="font-bold mb-3 uppercase tracking-wider text-[var(--primary-color)]">Awards</h3>
                 {(data.awards || []).map(award => (
                     <div key={award.id} className="mb-2">
                         <p className="font-semibold">{award.name}</p>
                     </div>
                 ))}
            </section>
        </aside>
        <main className="w-[70%]">
            {sectionOrder.filter(key => sectionVisibility[key]).map(sectionKey => sections[sectionKey])}
        </main>
    </div>
  );
};

export default GalleriaTemplate;