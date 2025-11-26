

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItemProps {
    id: string;
    title: string;
    isOpen: boolean;
    toggleAccordion: (id: string) => void;
    children: React.ReactNode;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ id, title, isOpen, toggleAccordion, children, icon, badge }) => {
    return (
        <div className={`bg-white rounded-2xl transition-all duration-300 border ${isOpen ? 'border-slate-200 shadow-sm' : 'border-transparent hover:bg-white hover:shadow-sm'}`}>
            <button
                type="button"
                onClick={() => toggleAccordion(id)}
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${id}`}
            >
                <div className="flex items-center gap-3">
                    {icon && <div className="text-slate-400 group-hover:text-slate-600 transition-colors">{icon}</div>}
                    <span className="text-sm font-bold text-slate-700">{title}</span>
                    {badge}
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div id={`accordion-content-${id}`} className="px-4 pb-4 pt-0">
                            <div className="pt-4 border-t border-dashed border-slate-100">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AccordionItem;