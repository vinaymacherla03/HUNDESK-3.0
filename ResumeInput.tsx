import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ResumeInputProps {
  onEnhance: (resumeText: string, jobDescription: string, jobTitle: string) => void;
  onTryDemo: () => void;
  draftExists: boolean;
  onLoadDraft: () => void;
}

type ActiveTab = 'resume' | 'job';

const sampleResume = `Sarah Chen
Product Manager
sarah.chen.pm@example.com | 555-123-4567 | linkedin.com/in/sarahchenpm

SUMMARY
Product manager with over 5 years of experience in fast-paced tech environments. I am passionate about building user-centric products and leading cross-functional teams to deliver value. Experience in both B2B SaaS and B2C mobile applications.

EXPERIENCE

Innovate Inc. - San Francisco, CA
Product Manager (June 2020 - Present)
- Owned the product roadmap for the company's flagship mobile application (iOS and Android).
- Wrote PRDs, user stories, and acceptance criteria for new features.
- Worked with engineering, design, and marketing to launch features.
- Launched a new user onboarding flow which improved user retention.
- Analyzed user data to find insights for new feature development.

Data Corp - Palo Alto, CA
Associate Product Manager (July 2018 - June 2020)
- Assisted senior PMs on a B2B analytics dashboard product.
- Conducted market research and competitive analysis.
- Managed the bug backlog and feature request triage process.

EDUCATION
University of California, Berkeley - Berkeley, CA
Bachelor of Arts in Economics (May 2018)

SKILLS
- Product Roadmapping, Agile Methodologies, JIRA, Figma, Mixpanel, SQL, A/B Testing, User Research
`;

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; icon: React.ReactNode }> = ({ active, onClick, children, icon }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-150 transform active:scale-[0.98] ${
            active
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 active:bg-slate-100'
        }`}
        aria-pressed={active}
    >
        {icon}
        {children}
    </button>
);

const ResumeInput: React.FC<ResumeInputProps> = ({ onEnhance, onTryDemo, draftExists, onLoadDraft }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('resume');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError("Please paste your resume text before enhancing.");
      return;
    }
    onEnhance(resumeText, jobDescription, jobTitle);
  };

  const handleResumeTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
    if (error) {
        setError(null);
    }
  };

  return (
    <div className="w-full h-full py-12 sm:py-16 bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-4xl px-4">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Create Your Resume
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500">
              Paste your content below. Our AI will structure, write, and optimize it for you.
          </p>
        </motion.div>

        <motion.form 
            onSubmit={handleSubmit} 
            className="bg-white p-2 rounded-xl shadow-2xl border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <label htmlFor="job-title" className="text-sm font-medium text-slate-700">
                Your Target Job Title
            </label>
            <input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="mt-1 block w-full text-sm p-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                placeholder="e.g., Senior Software Engineer"
            />
          </div>
          <div className="flex border-b border-slate-200">
              <TabButton active={activeTab === 'resume'} onClick={() => setActiveTab('resume')} icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 2v10h10V5H4zm2 2h6v2H6V7zm0 4h6v2H6v-2z" /></svg>
              }>
                  Paste Your Resume
              </TabButton>
              <TabButton active={activeTab === 'job'} onClick={() => setActiveTab('job')} icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-1.082.186l-6 5a1 1 0 00-.213 1.233l.001.002 4.243 7.35a1 1 0 001.714-.042l1.414-2.451a1 1 0 111.714.99l-1.414 2.45a1 1 0 001.714.99l6-11A1 1 0 0016.28 3.28L10.394 2.08z" /></svg>
              }>
                  Add Job Description (Optional)
              </TabButton>
          </div>
          
          <div className="p-4 sm:p-6">
              {activeTab === 'resume' && (
                  <div className="space-y-2">
                      <div className="flex justify-between items-center">
                          <label htmlFor="resume-text" className="text-sm font-medium text-slate-700">
                            Your resume content
                          </label>
                           <button
                            type="button"
                            onClick={() => setResumeText(sampleResume)}
                            className="text-xs font-semibold text-primary hover:text-primary-700"
                        >
                            Load Sample
                        </button>
                      </div>
                      <textarea
                          id="resume-text"
                          name="resume-text"
                          rows={15}
                          value={resumeText}
                          onChange={handleResumeTextChange}
                          className={`block w-full text-sm p-3 border rounded-lg shadow-sm focus:outline-none transition-shadow bg-slate-50/70 ${
                              error ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300 focus:ring-2 focus:ring-primary-300 focus:border-primary-400'
                          }`}
                          placeholder="Simply paste your entire resume here. Don't worry about formatting, our AI will organize and structure it perfectly."
                          required
                          aria-required="true"
                          aria-invalid={!!error}
                          aria-describedby={error ? 'resume-error' : undefined}
                      />
                      {error && <p id="resume-error" className="mt-1.5 text-sm text-red-600">{error}</p>}
                  </div>
              )}

              {activeTab === 'job' && (
                  <div className="space-y-2">
                      <label htmlFor="job-description" className="text-sm font-medium text-slate-700">
                          For best results, paste the job description to tailor your resume.
                      </label>
                      <textarea
                          id="job-description"
                          name="job-description"
                          rows={15}
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          className="block w-full text-sm p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-shadow bg-slate-50/70"
                          placeholder="For a resume that's 90%+ tailored to the job, paste the description here. This is the key to beating applicant tracking systems."
                      />
                  </div>
              )}
          </div>
          
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200">
            <motion.button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-8 py-3 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-primary hover:bg-primary-700 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Enhance My Resume</span>
            </motion.button>
            <div className="text-center mt-4 flex items-center justify-center gap-4">
              {draftExists && (
                <>
                    <motion.button
                        type="button"
                        onClick={onLoadDraft}
                        className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                        whileHover={{ y: -1 }}
                    >
                        Load saved draft
                    </motion.button>
                    <span className="text-slate-400">|</span>
                </>
              )}
              <motion.button
                type="button"
                onClick={onTryDemo}
                className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                whileHover={{ y: -1 }}
              >
                ...or try a demo
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ResumeInput;