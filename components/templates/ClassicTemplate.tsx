
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


const ClassicTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
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
    borderBottom: sectionTitleBorderStyle === 'underline' || sectionTitleBorderStyle === 'full' ? `2px solid ${sectionTitleBorderColor}` : 'none',
    borderTop: sectionTitleBorderStyle === 'overline' || sectionTitleBorderStyle === 'full' ? `2px solid ${sectionTitleBorderColor}` : 'none',
  };

  // Glassmorphism card style
  const glassCardClass = "bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm rounded-xl p-5 transition-all hover:shadow-md hover:bg-white/80";

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <section key="summary" className="mb-4">
        <div className={glassCardClass}>
            <h3 style={sectionTitleStyles} className="font-bold mb-2 tracking-wider">Summary</h3>
            <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} className="text-black" />
        </div>
      </section>
    ),
    experience: (
      <section key="experience" className="mb-4">
        <div className={glassCardClass}>
            <h3 style={sectionTitleStyles} className="font-bold mb-4 tracking-wider">Experience</h3>
            <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
            {(exp, index) => (
                <div key={exp.id || index} className="mb-4 last:mb-0 break-inside-avoid relative group">
                <div className="flex justify-between items-baseline">
                    <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-black" />
                    <EditableField as="p" path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-sm text-slate-600 text-right shrink-0 ml-4 font-medium" />
                </div>
                <div className="flex justify-between items-baseline">
                    <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} className="font-medium text-slate-800" />
                    <EditableField as="p" path={`experience[${index}].location`} value={exp.location} onChange={onDataChange} className="text-sm text-slate-600 shrink-0 ml-4" />
                </div>
                <EditableList items={exp.description || []} path={`experience[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-black space-y-1 mt-2 pl-5">
                    {(desc, descIndex) => (
                    <EditableField as="div" path={`experience[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                    )}
                </EditableList>
                </div>
            )}
            </EditableList>
        </div>
      </section>
    ),
    projects: (
      <section key="projects" className="mb-4">
         <div className={glassCardClass}>
            <h3 style={sectionTitleStyles} className="font-bold mb-4 tracking-wider">Projects</h3>
            <EditableList items={data.projects || []} path="projects" onChange={onDataChange} newItem={newProjectEntry}>
            {(proj, index) => (
                <div key={proj.id || index} className="mb-4 last:mb-0 break-inside-avoid relative group">
                <h4 style={{ fontSize: `${customization.itemTitleSize}pt` }} className="font-semibold text-black">
                    <EditableField as="span" path={`projects[${index}].name`} value={proj.name} onChange={onDataChange} />
                    <span className="font-normal text-slate-800"> - <EditableField as="span" path={`projects[${index}].role`} value={proj.role} onChange={onDataChange} /></span>
                </h4>
                <EditableList items={proj.description || []} path={`projects[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="list-disc list-outside text-black space-y-1 mt-2 pl-5">
                    {(desc, descIndex) => (
                        <EditableField as="div" path={`projects[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                    )}
                </EditableList>
                </div>
            )}
            </EditableList>
        </div>
      </section>
    ),
    education: (
      <section key="education" className="mb-4">
        <div className={glassCardClass}>
            <h3 style={sectionTitleStyles} className="font-bold mb-4 tracking-wider">Education</h3>
            <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
            {(edu, index) => (
                <div key={edu.id || index} className="mb-3 last:mb-0 break-inside-avoid relative group">
                <div className="flex justify-between items-baseline">
                    <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-black" />
                    <EditableField as="p" path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} className="text-sm text-slate-600 shrink-0 ml-4 font-medium" />
                </div>
                <p className="text-slate-800">
                    <EditableField as="span" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} />, {' '}
                    <EditableField as="span" path={`education[${index}].location`} value={edu.location} onChange={onDataChange} />
                </p>
                </div>
            )}
            </EditableList>
        </div>
      </section>
    ),
    skills: (
        <section key="skills" className="mb-4">
          <div className={glassCardClass}>
            <h3 style={sectionTitleStyles} className="font-bold mb-2 tracking-wider">Skills</h3>
            <div className="text-black">
                <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory}>
                {(category, catIndex) => (
                    <p key={category.id || catIndex} className="mb-1 relative group">
                    <EditableField as="span" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold" />: {category.skills.map((s, i) => (
                        <React.Fragment key={s.id || i}>
                        <EditableField as="span" path={`skills[${catIndex}].skills[${i}].name`} value={s.name} onChange={onDataChange} />
                        {i < category.skills.length - 1 ? ', ' : ''}
                        </React.Fragment>
                    ))}
                    </p>
                )}
                </EditableList>
            </div>
          </div>
        </section>
    ),
    certifications: (
        <section key="certifications" className="mb-4">
          <div className={glassCardClass}>
            <h3 style={sectionTitleStyles} className="font-bold mb-2 tracking-wider">Certifications</h3>
            <EditableList items={data.certifications || []} path="certifications" onChange={onDataChange} newItem={newCertificationEntry}>
                {(cert, index) => (
                <p key={cert.id || index} className="text-black relative group">
                    <EditableField as="span" path={`certifications[${index}].name`} value={cert.name} onChange={onDataChange} /> - {' '}
                    <EditableField as="span" path={`certifications[${index}].issuer`} value={cert.issuer} onChange={onDataChange} /> {'('}
                    <EditableField as="span" path={`certifications[${index}].date`} value={cert.date} onChange={onDataChange} />{')'}
                </p>
                )}
            </EditableList>
          </div>
        </section>
    ),
    awards: (
      <section key="awards" className="mb-4">
        <div className={glassCardClass}>
            <h3 style={sectionTitleStyles} className="font-bold mb-2 tracking-wider">Awards</h3>
            <EditableList items={data.awards || []} path="awards" onChange={onDataChange} newItem={newAwardEntry}>
            {(award, index) => (
                <p key={award.id || index} className="text-black relative group">
                <EditableField as="span" path={`awards[${index}].name`} value={award.name} onChange={onDataChange} /> - {' '}
                <EditableField as="span" path={`awards[${index}].issuer`} value={award.issuer} onChange={onDataChange} /> {'('}
                <EditableField as="span" path={`awards[${index}].date`} value={award.date} onChange={onDataChange} />{')'}
                </p>
            )}
            </EditableList>
        </div>
      </section>
    ),
  };
  
  const contactItemClass = "flex items-center gap-2 text-slate-800";
  const contactLinkClass = "hover:text-[var(--primary-color)]";

  return (
    <div id="resume-content" style={{ padding: marginValue }} className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <header className={`text-center mb-6 ${glassCardClass} border-t-4 border-t-slate-700`}>
        <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize}pt` }} className="font-bold text-black" placeholder="Your Name" />
        <EditableField as="h2" path="title" value={data.title} onChange={onDataChange} style={{ fontSize: `${customization.titleSize}pt` }} className="font-medium text-slate-800 mt-1" placeholder="Your Title" />
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-sm mt-2">
          <span className={contactItemClass}>
             <ContactIcon type="location" className="h-4 w-4"/> <EditableField as="span" path="contactInfo.location" value={data.contactInfo.location} onChange={onDataChange} placeholder="City, State" />
          </span>
          <span className="text-slate-400">|</span>
          <span className={`${contactItemClass} ${contactLinkClass}`}>
             <ContactIcon type="email" className="h-4 w-4"/> <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} placeholder="your.email@provider.com" validation="email" />
          </span>
          <span className="text-slate-400">|</span>
          <span className={contactItemClass}>
            <ContactIcon type="phone" className="h-4 w-4"/> <EditableField as="span" path="contactInfo.phone" value={data.contactInfo.phone} onChange={onDataChange} placeholder="(555) 123-4567" />
          </span>
          <span className="text-slate-400">|</span>
          <span className={`${contactItemClass} ${contactLinkClass}`}>
            <ContactIcon type="linkedin" className="h-4 w-4"/> <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} placeholder="linkedin.com/in/yourname" validation="url" />
          </span>
        </div>
      </header>
      <main className="mt-4 space-y-4">
        {sectionOrder.filter(key => sectionVisibility[key]).map(sectionKey => sections[sectionKey])}
      </main>
    </div>
  );
};

export default ClassicTemplate;
