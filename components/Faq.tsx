
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "How does the AI resume enhancement work?",
        answer: "Our AI analyzes your raw resume text and the provided job description. It identifies key skills and keywords, rewrites your experience bullet points to be more impactful using the X-Y-Z formula (Accomplished X as measured by Y, by doing Z), and structures everything into a clean, professional format."
    },
    {
        question: "Are the resume templates ATS-friendly?",
        answer: "Yes! All of our templates are designed with modern Applicant Tracking Systems in mind. We prioritize clean, parsable structures to ensure your resume gets past the initial screening and into the hands of a recruiter."
    },
    {
        question: "Can I edit my resume after it's been generated?",
        answer: "Absolutely. Our builder features a full what-you-see-is-what-you-get (WYSIWYG) editor. You can click directly on any text in the live preview to edit it, add or remove sections, reorder bullet points, and customize the template's colors and fonts until it's perfect."
    },
    {
        question: "Is my data safe and private?",
        answer: "We take your privacy seriously. Your resume data is processed securely and is never shared with third parties. For convenience, your latest draft is saved in your browser's local storage, but you can clear this at any time by clicking 'Start Over'."
    },
];

const FaqItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void }> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="mb-4">
            <button
                onClick={onClick}
                className={`w-full flex justify-between items-center text-left p-6 rounded-2xl transition-all duration-300 border ${isOpen ? 'bg-white border-blue-200 shadow-lg' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                aria-expanded={isOpen}
            >
                <span className={`text-lg font-medium font-display transition-colors ${isOpen ? 'text-blue-700' : 'text-slate-800'}`}>
                    {question}
                </span>
                <span className={`ml-6 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-all ${isOpen ? 'bg-blue-100 border-blue-200 text-blue-600 rotate-45' : 'border-slate-200 text-slate-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden px-6"
                    >
                        <p className="text-slate-600 leading-relaxed pb-4">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Faq: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 sm:py-32 bg-[#f2f1ed] relative overflow-hidden" id="faq">
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Everything you need to know about building your career with HuntDesk.
                    </p>
                </div>

                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <FaqItem 
                            key={index} 
                            question={faq.question} 
                            answer={faq.answer} 
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faq;
