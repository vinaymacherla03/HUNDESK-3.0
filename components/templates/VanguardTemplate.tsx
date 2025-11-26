import React from 'react';
import { ResumeData, ResumeSectionKey, Customization } from '../../types';
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

const newExperienceEntry = { id: '', role: 'New Role', company: 'New Company', location: 'City, State', dates: 'Mmm YYYY - Mmm YYYY', description: ['New achievement.'] };
const newProjectEntry = { id: '', name: 'New Project', role: 'Lead', description: ['Description of project.'], technologies: [] };
const newEducationEntry = { id: '', degree: 'Degree or Certificate', institution: 'Institution Name', location: 'City, State', graduationDate: 'Mmm YYYY' };
const newCertificationEntry = { id: '', name: 'Certification Name', issuer: 'Issuing Body', date: 'Mmm YYYY' };
const newAwardEntry = { id: '', name: 'Award Name', issuer: 'Issuer', date: 'Mmm YYYY' };
const newSkillCategory = { id: '', name: 'New Category', skills: [{id: '', name: 'New Skill', proficiency: 'Intermediate'}] };


const VanguardTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = marginMap[customization.margin] || marginMap.normal;
  
  const { 
    sectionTitleSize, 
    sectionTitleUppercase 
  } = customization;
  
  const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <section className="mb-6 break-inside-avoid">
        <h3 
            style={{
                fontSize: `${sectionTitleSize}pt`,
                textTransform: sectionTitleUppercase ? 'uppercase' : 'none',
                color: 'var(--text-on-primary)',
                backgroundColor: 'var(--primary-color)',
            }} 
            className="font-bold tracking-wider py-1 px-3 rounded-sm inline-block mb-4"
        >
            {title}
        </h3>
        {children}
    </section>
  );

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
        <Section key="summary" title="Summary">
            <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black" />
        </Section>
    ),
    experience: (
        <Section key="experience" title="Experience">
            <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
              {(exp, index) => (
                <div key={exp.id || index} className="mb-5">
                    <div className="flex justify-between items-baseline">
                        <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
                        <EditableField as="p" style={{ fontSize: '0.9em' }} path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-gray-700 text-right shrink-0 ml-4" />
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
        </Section>
    ),
    projects: (
        <Section key="projects" title="Projects">
            <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry}>
              {(proj, index) => (
                <div key={proj.id || index} className="mb-5">
                    <h4 style={{ fontSize: `${customization.itemTitleSize}pt` }} className="font-semibold text-black">
                        <EditableField as="span" path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} />
                        <span className="font-normal text-gray-800"> - <EditableField as="span" path={`projects[${index}].role`} value={proj.role} onChange={onDataChange}/></span>
                    </h4>
                    <EditableList items={proj.description || []} path={`projects[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-black space-y-1 mt-2 pl-5">
                        {(desc, descIndex) => (
                             <EditableField as="div" path={`projects[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                        )}
                    </EditableList>
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
                    <EditableField as="h4" path={`certifications[${index}].name`} value={cert.name} onChange={onDataChange} className="font-semibold text-black" />
                    <EditableField as="p" path={`certifications[${index}].issuer`} value={cert.issuer} onChange={onDataChange} className="text-gray-800" />
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
              <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize * 0.95}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-black" />
              <EditableField as="p" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} className="text-black" />
              <EditableField as="p" style={{ fontSize: '0.9em' }} path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} className="text-black" />
            </div>
          )}
        </EditableList>
      </Section>
    ),
    skills: (
      <Section key="skills" title="Skills">
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
      </Section>
    ),
    awards: (
      <Section key="awards" title="Awards">
        <EditableList items={data.awards || []} path="awards" onChange={onDataChange} newItem={newAwardEntry}>
          {(award, index) => (
            <div key={award.id || index} className="mb-3">
              <EditableField as="h4" path={`awards[${index}].name`} value={award.name} onChange={onDataChange} className="font-semibold text-black" />
              <EditableField as="p" path={`awards[${index}].issuer`} value={award.issuer} onChange={onDataChange} className="text-black" />
            </div>
          )}
        </EditableList>
      </Section>
    ),
  };

  const contactItemClass = "flex items-center gap-2 text-sm text-slate-700";
  const contactLinkClass = "hover:text-[var(--primary-color)] break-all";


  return (
    <div id="resume-content" style={{ padding: marginValue }}>
        <header className="mb-6 pb-4 border-b-2 border-slate-200">
            <EditableField as="h1" style={{ fontSize: `${customization.nameSize}pt` }} path="fullName" value={data.fullName} onChange={onDataChange} className="font-bold text-black" />
            <EditableField as="h2" style={{ fontSize: `${customization.titleSize}pt` }} path="title" value={data.title} onChange={onDataChange} className="font-medium text-[var(--primary-color)] mt-1" />
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                <div className={contactItemClass}>
                    <ContactIcon type="location" className="h-4 w-4 shrink-0 text-slate-500"/>
                    <EditableField as="p" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} />
                </div>
                <div className={contactItemClass}>
                    <ContactIcon type="email" className="h-4 w-4 shrink-0 text-slate-500"/>
                    <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email" />
                </div>
                <div className={contactItemClass}>
                    <ContactIcon type="phone" className="h-4 w-4 shrink-0 text-slate-500"/>
                    <EditableField as="p" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} />
                </div>
                <div className={contactItemClass}>
                    <ContactIcon type="linkedin" className="h-4 w-4 shrink-0 text-slate-500"/>
                    <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url" />
                </div>
                 {data.contactInfo.github && (
                    <div className={contactItemClass}>
                        <ContactIcon type="github" className="h-4 w-4 shrink-0 text-slate-500"/>
                         <EditableField as="a" href={data.contactInfo.github} target="_blank" rel="noopener noreferrer" path="contactInfo.github" value={data.contactInfo.github} onChange={onDataChange} className={contactLinkClass} validation="url" />
                    </div>
                )}
            </div>
        </header>

        <main>
          {sectionOrder.filter(key => sectionVisibility[key] && sections[key]).map(key => sections[key])}
        </main>
    </div>
  );
};

export default VanguardTemplate;