
import React from 'react';

const SocialIcon: React.FC<{ href: string; children: React.ReactNode; 'aria-label': string }> = ({ href, children, 'aria-label': ariaLabel }) => (
  <a 
    href={href} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:scale-110 transition-all duration-300 border border-white/5 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
    target="_blank" 
    rel="noopener noreferrer" 
    aria-label={ariaLabel}
  >
    {children}
  </a>
);

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <li>
        <a href={href} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center gap-2 group">
            <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            {children}
        </a>
    </li>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
            <div className="md:col-span-4">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-blue-600 to-violet-600 ring-1 ring-white/20">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13.5 2V8.5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight font-display">HuntDesk</span>
                </div>
                <p className="text-slate-400 leading-relaxed mb-8 max-w-sm">
                    The intelligent career command center for modern professionals. Build ATS-optimized resumes, track applications, and land your dream job with AI-powered tools.
                </p>
                <div className="flex gap-4">
                    <SocialIcon href="#" aria-label="Twitter">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </SocialIcon>
                    <SocialIcon href="#" aria-label="LinkedIn">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.47 1.344h2.94v8.59H3.535v-8.59z" clipRule="evenodd" /></svg>
                    </SocialIcon>
                    <SocialIcon href="#" aria-label="GitHub">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.491.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg>
                    </SocialIcon>
                </div>
            </div>
            
            <div className="md:col-span-2">
                <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Product</h4>
                <ul className="space-y-4">
                    <FooterLink href="#features">Resume Builder</FooterLink>
                    <FooterLink href="#">Job Tracker</FooterLink>
                    <FooterLink href="#">AI Analysis</FooterLink>
                    <FooterLink href="#">Cover Letters</FooterLink>
                </ul>
            </div>

            <div className="md:col-span-2">
                <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Templates</h4>
                <ul className="space-y-4">
                    <FooterLink href="#">Modern Resumes</FooterLink>
                    <FooterLink href="#">Professional</FooterLink>
                    <FooterLink href="#">Creative & Design</FooterLink>
                    <FooterLink href="#">ATS-Friendly</FooterLink>
                    <FooterLink href="#">Simple & Clean</FooterLink>
                </ul>
            </div>

            <div className="md:col-span-2">
                <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Company</h4>
                <ul className="space-y-4">
                    <FooterLink href="#">About Us</FooterLink>
                    <FooterLink href="#">Careers</FooterLink>
                    <FooterLink href="#">Blog</FooterLink>
                    <FooterLink href="#">Contact</FooterLink>
                </ul>
            </div>

            <div className="md:col-span-2">
                <h4 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Legal</h4>
                <ul className="space-y-4">
                    <FooterLink href="#">Privacy Policy</FooterLink>
                    <FooterLink href="#">Terms of Service</FooterLink>
                    <FooterLink href="#">Cookie Policy</FooterLink>
                </ul>
            </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500">&copy; {new Date().getFullYear()} HuntDesk. All Rights Reserved.</p>
          <div className="flex gap-6 text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
