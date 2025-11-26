import React from 'react';

interface AccordionItemProps {
    id: string;
    title: string;
    isOpen: boolean;
    toggleAccordion: (id: string) => void;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ id, title, isOpen, toggleAccordion, children }) => {
    return (
        <div className="border border-slate-200 rounded-lg bg-white">
            <h2>
                <button
                    type="button"
                    onClick={() => toggleAccordion(id)}
                    className={`w-full flex items-center justify-between p-4 text-left transition-colors duration-150 ${isOpen ? 'bg-primary-50/70 rounded-t-md' : 'hover:bg-slate-50 rounded-md'}`}
                    aria-expanded={isOpen}
                    aria-controls={`accordion-content-${id}`}
                >
                    <span className={`text-sm font-semibold ${isOpen ? 'text-primary' : 'text-slate-800'}`}>{title}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-slate-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </h2>
            {isOpen && (
                <div id={`accordion-content-${id}`} className="p-4 border-t border-slate-200 rounded-b-lg">
                    {children}
                </div>
            )}
        </div>
    );
};

export default AccordionItem;