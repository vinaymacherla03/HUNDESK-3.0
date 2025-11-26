
import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        id: 1,
        title: 'Import & Analyze',
        description: 'Paste your existing resume or LinkedIn data. Our AI instantly analyzes your profile against industry standards.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
        ),
        color: 'bg-blue-500'
    },
    {
        id: 2,
        title: 'Optimize with AI',
        description: 'Use the "Make Impactful" and "Rewrite" tools to transform generic bullet points into achievement-driven statements.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        color: 'bg-amber-500'
    },
    {
        id: 3,
        title: 'Target & Track',
        description: 'Save jobs to your board, customize your resume for each role, and track your application status in one place.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
        ),
        color: 'bg-emerald-500'
    }
];

const HowItWorks: React.FC = () => {
    return (
        <section className="py-20 bg-[#f2f1ed] border-t border-slate-200/60" id="how-it-works">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Workflow</h2>
                    <h3 className="text-3xl font-display font-bold text-slate-900 sm:text-4xl">
                        From Draft to Offer in 3 Steps
                    </h3>
                    <p className="mt-4 text-lg text-slate-600">
                        We've simplified the complex job search process into a streamlined workflow that puts you in control.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connector Line */}
                    <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-slate-200/50 z-0 transform translate-y-1/2"></div>

                    {steps.map((step, index) => (
                        <motion.div 
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${step.color} shadow-lg shadow-slate-200 flex items-center justify-center mb-6 transform rotate-3 transition-transform hover:rotate-0`}>
                                {step.icon}
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                            <p className="text-slate-600 leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
