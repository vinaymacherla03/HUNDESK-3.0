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
          className="origin-top-right absolute right-0 mt-2 w-full rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-4" role="none">
              <label htmlFor="filename-input" className="block text-sm font-medium text-slate-700 mb-2">
                  Filename
              </label>
              <input
                  type="text"
                  id="filename-input"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full text-sm p-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Enter filename"
                  aria-label="Custom filename"
              />
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadDropdown;