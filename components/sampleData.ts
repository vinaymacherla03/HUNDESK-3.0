import { ResumeData } from '../types';

export const sampleResumeData: ResumeData = {
    fullName: 'Alex Johnson',
    title: 'Salesforce Developer',
    contactInfo: {
        email: 'alexjohnson@example.com',
        phone: '(555) 123-4567',
        linkedin: 'https://www.linkedin.com/in/alexjohnsonsfdev',
        location: 'San Francisco, CA',
        github: 'https://github.com/alexjohnsonsf'
    },
    summary: "As a dedicated Salesforce Developer with 6 years of experience, I specialize in crafting robust and scalable solutions that drive business efficiency and enhance user experience. I am adept at leveraging Apex, Lightning Web Components (LWC), and extensive platform customizations to optimize CRM functionalities and integrate complex systems. I thrive on translating intricate business requirements into high-impact Salesforce applications, consistently delivering projects that exceed expectations and foster tangible growth.",
    experience: [
        {
            id: 'exp1',
            role: 'Senior Salesforce Developer',
            company: 'Tech Solutions Inc.',
            location: 'San Francisco, CA',
            dates: 'May 2021 - Present',
            description: [
                'Engineered and deployed over 25 complex Apex triggers and classes for Sales Cloud, reducing manual data entry by 30% and improving sales team productivity by 15%.',
                'Spearheaded the design and implementation of 8 Lightning Web Components (LWC) for a client-facing portal, increasing user engagement by 20% and achieving a 95% user satisfaction rate.',
                'Orchestrated the integration of Salesforce with external ERP systems using REST API, streamlining data processing by 25% and ensuring data consistency across platforms.',
                'Led a team of 3 junior developers in daily stand-ups and code reviews, enhancing code quality by 20% and accelerating project delivery timeline by 10%.',
                'Developed and optimized SOQL queries for large datasets, decreasing report generation time by 40% and improving data analysis capabilities for executives.'
            ]
        },
        {
            id: 'exp2',
            role: 'Salesforce Developer',
            company: 'InnovateCorp',
            location: 'San Jose, CA',
            dates: 'Jun 2018 - Apr 2021',
            description: [
                'Developed custom Visualforce pages and Apex controllers to support critical business processes, resulting in a 10% reduction in operational costs and improved data accuracy.',
                'Implemented Salesforce Flow and Process Builder automation for lead assignment and case escalation, cutting response time by 20% and enhancing customer service efficiency.',
                'Participated in data migration efforts from legacy systems to Salesforce, ensuring 100% data integrity for over 500,000 records within tight deadlines.',
                'Collaborated with business analysts to gather and refine requirements, leading to a 15% improvement in feature alignment with user needs across major projects.',
                'Maintained and debugged existing Salesforce applications, resolving 98% of reported bugs within service level agreements (SLAs) and ensuring system stability.'
            ]
        }
    ],
    projects: [
        {
            id: 'proj1',
            name: 'Salesforce Lead Management Automatic System',
            role: 'Lead Developer',
            description: [
                'Designed and implemented a comprehensive lead scoring and assignment system using Apex and Flow, decreasing lead qualification time by 35% and improving sales conversion rates by 12%.',
                'Developed custom dashboards and reports to provide real-time visibility into lead pipeline performance, empowering sales managers with actionable insights to optimize strategies.'
            ],
        }
    ],
    education: [
        {
            id: 'edu1',
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of California, Berkeley',
            location: 'Berkeley, CA',
            graduationDate: 'May 2018',
        }
    ],
    skills: [
        {
            id: 'skill_cat_1',
            name: 'Programming Languages',
            skills: [
                { id: 's1', name: 'Apex', proficiency: 'Expert' },
                { id: 's2', name: 'JavaScript', proficiency: 'Advanced' },
                { id: 's3', name: 'SOQL/SOSL', proficiency: 'Expert' },
                { id: 's4', name: 'SQL', proficiency: 'Advanced' },
                { id: 's5', name: 'HTML', proficiency: 'Advanced' },
                { id: 's6', name: 'CSS', proficiency: 'Intermediate' },
            ]
        },
        {
            id: 'skill_cat_2',
            name: 'Salesforce Platform & Tools',
            skills: [
                { id: 's7', name: 'Salesforce Admin', proficiency: 'Expert' },
                { id: 's8', name: 'Lightning Web Components (LWC)', proficiency: 'Expert' },
                { id: 's9', name: 'Visualforce', proficiency: 'Advanced' },
                { id: 's10', name: 'Sales Cloud', proficiency: 'Expert' },
                { id: 's11', name: 'Service Cloud', proficiency: 'Advanced' },
                { id: 's12', name: 'Experience Cloud (Community)', proficiency: 'Advanced' },
                { id: 's13', name: 'Pardot', proficiency: 'Intermediate' },
                { id: 's14', name: 'CPQ', proficiency: 'Intermediate' },
                { id: 's15', name: 'Salesforce Flow', proficiency: 'Expert' },
                { id: 's16', name: 'Process Builder', proficiency: 'Expert' },
                { id: 's17', name: 'Custom Object & Fields', proficiency: 'Expert' },
                { id: 's18', name: 'Security Model', proficiency: 'Expert' },
                { id: 's19', name: 'Deployment Tools (Gearset, Copado)', proficiency: 'Advanced' },
            ]
        },
        {
            id: 'skill_cat_3',
            name: 'Databases',
            skills: [
                { id: 's20', name: 'Salesforce Database', proficiency: 'Expert' },
                { id: 's21', name: 'MySQL', proficiency: 'Intermediate' },
            ]
        },
        {
            id: 'skill_cat_4',
            name: 'Cloud & DevOps',
            skills: [
                { id: 's22', name: 'Git', proficiency: 'Advanced' },
                { id: 's23', name: 'CI/CD (Jira, Confluence)', proficiency: 'Advanced' },
                { id: 's24', name: 'Salesforce DX', proficiency: 'Advanced' },
            ]
        },
        {
            id: 'skill_cat_5',
            name: 'Development Methodologies',
            skills: [
                { id: 's25', name: 'Agile', proficiency: 'Expert' },
                { id: 's26', name: 'Scrum', proficiency: 'Expert' },
                { id: 's27', name: 'Waterfall', proficiency: 'Intermediate' },
            ]
        },
        {
             id: 'skill_cat_6',
            name: 'Soft Skills',
            skills: [
                { id: 's28', name: 'Problem-solving', proficiency: 'Expert' },
                { id: 's29', name: 'Communication', proficiency: 'Expert' },
                { id: 's30', name: 'Team Leadership', proficiency: 'Advanced' },
                { id: 's31', name: 'Stakeholder Management', proficiency: 'Advanced' },
                { id: 's32', name: 'Analytical thinking', proficiency: 'Expert' },
            ]
        }
    ],
    certifications: [
        { id: 'cert1', name: 'Salesforce Certified Platform Developer II', issuer: 'Salesforce', date: '2022' },
        { id: 'cert2', name: 'Salesforce Certified Platform Developer I', issuer: 'Salesforce', date: '2020' },
        { id: 'cert3', name: 'Salesforce Certified Administrator', issuer: 'Salesforce', date: '2018' },
    ],
    awards: [
        { id: 'award1', name: "Dean's List", issuer: 'University of California, Berkeley', date: '2018' },
    ]
};