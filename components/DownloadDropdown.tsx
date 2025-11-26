

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ResumeData } from '../types';

// Let TypeScript know about the global variable that will be available from the importmap
declare global {
    interface Window {
        html2pdf: any;
    }
}

interface DownloadDropdownProps {
  resumeData: ResumeData;
}

const DownloadDropdown: React.FC<DownloadDropdownProps> = ({ resumeData }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filename, setFilename] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const generateDefaultFileName = useCallback(() => {
    const name = resumeData.fullName.replace(/\s+/g, '_');
    const title = resumeData.title.replace(/\s+/g, '_');
    return `${name}_${title}_Resume`;
  }, [resumeData.fullName, resumeData.title]);

  useEffect(() => {
    if (resumeData) {
      setFilename(generateDefaultFileName());
    }
  }, [resumeData, generateDefaultFileName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownloadJson = () => {
      const jsonResume = {
          basics: {
              name: resumeData.fullName,
              label: resumeData.title,
              email: resumeData.contactInfo.email,
              phone: resumeData.contactInfo.phone,
              url: resumeData.contactInfo.portfolio,
              summary: resumeData.summary,
              location: {
                  address: resumeData.contactInfo.location,
              },
              profiles: [
                  resumeData.contactInfo.linkedin && {
                      network: "LinkedIn",
                      url: resumeData.contactInfo.linkedin
                  },
                  resumeData.contactInfo.github && {
                      network: "GitHub",
                      url: resumeData.contactInfo.github
                  }
              ].filter(Boolean)
          },
          work: resumeData.experience.map(exp => ({
              name: exp.company,
              position: exp.role,
              startDate: exp.dates,
              location: exp.location,
              highlights: exp.description
          })),
          education: resumeData.education.map(edu => ({
              institution: edu.institution,
              area: edu.degree,
              endDate: edu.graduationDate,
              location: edu.location,
              courses: edu.relevantCoursework
          })),
          skills: resumeData.skills.map(cat => ({
              name: cat.name,
              keywords: cat.skills.map(s => s.name)
          })),
          projects: resumeData.projects?.map(proj => ({
              name: proj.name,
              description: proj.description.join('. '),
              highlights: proj.description,
              url: proj.link,
              roles: [proj.role]
          })),
          awards: resumeData.awards?.map(award => ({
              title: award.name,
              date: award.date,
              awarder: award.issuer
          })),
          certificates: resumeData.certifications?.map(cert => ({
              name: cert.name,
              date: cert.date,
              issuer: cert.issuer
          }))
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonResume, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${filename.trim() || 'resume'}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setIsOpen(false);
  };

  const handleDownloadPdf = async () => {
    if (!filename.trim()) return;

    setIsDownloading(true);
    setIsOpen(false);
    
    // Check if the library is loaded on the window object
    if (typeof window.html2pdf === 'undefined') {
        console.error("html2pdf.js library is not loaded.");
        alert("Could not start PDF generation. The required library is missing. Please check your internet connection and reload the page.");
        setIsDownloading(false);
        return;
    }
    
    const resumeElement = document.getElementById('resume-container-for-download');
    if (!resumeElement) {
        console.error("Resume element not found for PDF generation.");
        setIsDownloading(false);
        return;
    }
    
    // Temporarily remove box-shadow for cleaner PDF output
    const originalShadow = resumeElement.style.boxShadow;
    resumeElement.style.boxShadow = 'none';

    const finalFilename = filename.trim().endsWith('.pdf') ? filename.trim() : `${filename.trim()}.pdf`;
    
    const opt = {
      margin: 0,
      filename: finalFilename,
      image: { type: 'png', quality: 1.0 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        onclone: (clonedDoc: Document) => {
            // This promise-based approach ensures fonts are loaded before html2canvas renders.
            return new Promise<void>((resolve) => {
                document.fonts.ready.then(() => {
                    const editableElements = clonedDoc.querySelectorAll('[contenteditable="true"]');
                    editableElements.forEach(el => {
                        el.removeAttribute('contenteditable');
                    });
                    // Inject Google Fonts stylesheet to ensure fonts are loaded in the canvas
                    const fontLink = document.querySelector<HTMLLinkElement>('link[href*="fonts.googleapis.com"]');
                    if (fontLink) {
                        clonedDoc.head.appendChild(fontLink.cloneNode(true));
                    }
                    // Remove page break visual elements that are only for editor view
                    const pageBreaks = clonedDoc.querySelectorAll('.resume-page-break');
                    pageBreaks.forEach(el => el.remove());

                    resolve();
                });
            });
        }
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await window.html2pdf().from(resumeElement).set(opt).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Sorry, there was an unexpected error generating the PDF. Please try again.");
    } finally {
      // Restore box-shadow
      resumeElement.style.boxShadow = originalShadow;
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex rounded-lg shadow-sm">
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="flex-1 inline-flex justify-center items-center gap-2 rounded-l-lg border border-transparent px-4 py-2.5 bg-primary text-sm font-semibold text-white hover:bg-primary-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating PDF...
            </>
          ) : (
             <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
             </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="-ml-px relative inline-flex items-center px-3 py-2 rounded-r-lg bg-primary-700 hover:bg-primary-800 text-white/80 hover:text-white focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="Download options"
          disabled={isDownloading}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute bottom-full right-0 mb-2 w-full rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-3 space-y-3" role="none">
              <div>
                  <label htmlFor="filename-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                      Filename
                  </label>
                  <input
                      type="text"
                      id="filename-input"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="w-full text-sm p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter filename"
                  />
              </div>
              <div className="border-t border-slate-100 pt-2">
                  <button 
                    onClick={handleDownloadJson}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                  >
                      <div className="p-1 bg-slate-100 rounded text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </div>
                      <div className="text-left">
                          <div className="font-semibold">Export JSON</div>
                          <div className="text-[10px] text-slate-400">JSON Resume Standard</div>
                      </div>
                  </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadDropdown;