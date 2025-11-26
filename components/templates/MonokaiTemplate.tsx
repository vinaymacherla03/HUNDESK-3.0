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
const newSkillCategory: SkillCategory = { id: '', name: 'New Category', skills: [{id: '', name: 'New Skill', proficiency: 'Intermediate'}] };


const MonokaiTemplate: React.FC<TemplateProps> = ({ data, sectionOrder, customization, sectionVisibility, onDataChange }) => {
  const marginValue = marginMap[customization.margin] || marginMap.normal;
  
  const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <section className="mb-6 break-inside-avoid">
        <h3 style={{ fontSize: `${customization.sectionTitleSize}pt` }} className="font-bold mb-3 text-[#e6db74]">
            {title}
        </h3>
        {children}
    </section>
  );

  const sections: Record<ResumeSectionKey, React.ReactNode> = {
    summary: (
      <Section key="summary" title="[summary]">
        <EditableField as="p" path="summary" value={data.summary} onChange={onDataChange} />
      </Section>
    ),
    experience: (
      <Section key="experience" title="[work_history]">
        <EditableList items={data.experience || []} path="experience" onChange={onDataChange} newItem={newExperienceEntry}>
          {(exp, index) => (
            <div key={exp.id || index} className="mb-5">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`experience[${index}].role`} value={exp.role} onChange={onDataChange} className="font-semibold text-[#a6e22e]" />
                <div className="flex justify-between items-baseline text-[#75715e]" style={{fontSize: '0.9em'}}>
                    <EditableField as="p" path={`experience[${index}].company`} value={exp.company} onChange={onDataChange} />
                    <EditableField as="p" path={`experience[${index}].dates`} value={exp.dates} onChange={onDataChange} className="text-right shrink-0 ml-4" />
                </div>
              <EditableList items={exp.description || []} path={`experience[${index}].description`} onChange={onDataChange} newItem="New bullet point." className="space-y-1 mt-2 pl-4">
                {(desc, descIndex) => (
                    <div key={descIndex} className="relative pl-4">
                        <span className="absolute left-0 top-1 text-[#f92672]">&gt;</span>
                        <EditableField as="p" path={`experience[${index}].description[${descIndex}]`} value={desc} onChange={onDataChange} />
                    </div>
                )}
               </EditableList>
            </div>
        )}
        </EditableList>
      </Section>
    ),
    education: (
      <Section key="education" title="[education]">
        <EditableList items={data.education || []} path="education" onChange={onDataChange} newItem={newEducationEntry}>
            {(edu, index) => (
            <div key={edu.id || index} className="mb-3">
                <EditableField as="h4" style={{ fontSize: `${customization.itemTitleSize}pt` }} path={`education[${index}].degree`} value={edu.degree} onChange={onDataChange} className="font-semibold text-[#a6e22e]" />
                <div className="flex justify-between items-baseline text-[#75715e]" style={{fontSize: '0.9em'}}>
                    <EditableField as="p" path={`education[${index}].institution`} value={edu.institution} onChange={onDataChange} />
                    <EditableField as="p" path={`education[${index}].graduationDate`} value={edu.graduationDate} onChange={onDataChange} className="shrink-0 ml-4" />
                </div>
            </div>
            )}
        </EditableList>
      </Section>
    ),
    skills: (
      <Section key="skills" title="[skills]">
        <EditableList items={data.skills || []} path="skills" onChange={onDataChange} newItem={newSkillCategory} className="flex flex-wrap gap-4">
          {(category, catIndex) => (
            <div key={category.id || catIndex} className="mb-3">
              <EditableField as="h4" path={`skills[${catIndex}].name`} value={category.name} onChange={onDataChange} className="font-semibold text-[#66d9ef] mb-2" />
              <div className="flex flex-wrap gap-2">
                {(category.skills || []).map((skill, skillIndex) => (
                  <div key={skill.id || skillIndex} className="text-[#f8f8f2] font-medium">
                     <span className="text-[#f92672]">"</span><EditableField as="span" style={{ fontSize: '0.9em' }} path={`skills[${catIndex}].skills[${skillIndex}].name`} value={skill.name} onChange={onDataChange} /><span className="text-[#f92672]">"</span>,
                  </div>
                ))}
              </div>
            </div>
          )}
        </EditableList>
      </Section>
    ),
    projects: null, certifications: null, awards: null,
  };
  
  const contactLinkClass = "hover:text-[#a6e22e]";
  
  return (
    <div id="resume-content" className="bg-[#272822] text-[#f8f8f2]" style={{ padding: marginValue }}>
      <header className="mb-8">
        <EditableField as="h1" path="fullName" value={data.fullName} onChange={onDataChange} style={{ fontSize: `${customization.nameSize}pt` }} className="font-bold text-[#f8f8f2]" />
        <EditableField as="h2" path="title" value={data.title} onChange={onDataChange} style={{ fontSize: `${customization.titleSize}pt` }} className="font-medium text-[#66d9ef] mt-1" />
        <div style={{ fontSize: '0.9em' }} className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-[#75715e]">
            <EditableField as="a" href={`mailto:${data.contactInfo.email}`} path="contactInfo.email" value={data.contactInfo.email} onChange={onDataChange} className={contactLinkClass} validation="email"/>
            <span className="text-gray-600">|</span>
            <EditableField as="a" href={data.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" path="contactInfo.linkedin" value={data.contactInfo.linkedin} onChange={onDataChange} className={contactLinkClass} validation="url"/>
            {data.contactInfo.github && (<>
                <span className="text-gray-600">|</span>
                <EditableField as="a" href={data.contactInfo.github} target="_blank" rel="noopener noreferrer" path="contactInfo.github" value={data.contactInfo.github} onChange={onDataChange} className={contactLinkClass} validation="url"/>
            </>)}
        </div>
      </header>
      
      <main className="space-y-4">
        {sectionOrder.filter(key => sectionVisibility[key]).map(sectionKey => sections[sectionKey])}
      </main>
    </div>
  );
};

export default MonokaiTemplate;