import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const processingSteps = [
  { id: 1, text: 'Parsing resume structure...' },
  { id: 2, text: 'Analyzing job description for keywords...' },
  { id: 3, text: 'Writing impactful, achievement-oriented bullet points...' },
  { id: 4, text: 'Crafting a compelling professional summary...' },
  { id: 5, text: 'Categorizing and formatting your skills...' },
  { id: 6, text: 'Applying professional, ATS-friendly layout...' },
];

const CheckIcon: React.FC = () => (
    <motion.svg
        key="check"
        initial={{ scale: 0, opacity: 0, rotate: -90 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </motion.svg>
);

const SpinnerIcon: React.FC = () => (
    <motion.div key="spinner" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
        <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </motion.div>
);

const PendingIcon: React.FC = () => (
    <motion.div key="pending" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
        <div className="h-6 w-6 rounded-full border-2 border-slate-300"></div>
    </motion.div>
);


const LoadingSpinner: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < processingSteps.length - 1) {
                    return prev + 1;
                }
                clearInterval(timer); // Stop timer at the last step
                return prev;
            });
        }, 2200); // Change step every 2.2 seconds

        return () => clearInterval(timer);
    }, []);


    return (
        <div className="flex flex-col items-center justify-center text-center p-4">
            <motion.div 
                className="w-full max-w-lg bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl p-8 shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Crafting Your Resume...</h2>
                <p className="text-slate-500 mb-10">Our AI is working its magic. This should only take a moment.</p>

                <div className="space-y-5 text-left">
                    {processingSteps.map((step, index) => {
                        const status = index < currentStep ? 'completed' : index === currentStep ? 'in-progress' : 'pending';
                        
                        return (
                            <motion.div
                                key={step.id}
                                className="flex items-center gap-4"
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: status === 'pending' ? 0.5 : 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        {status === 'completed' && <CheckIcon />}
                                        {status === 'in-progress' && <SpinnerIcon />}
                                        {status === 'pending' && <PendingIcon />}
                                    </AnimatePresence>
                                </div>
                                <span className={`font-medium transition-colors duration-300 ${
                                    status === 'completed' ? 'text-emerald-600 line-through' :
                                    status === 'in-progress' ? 'text-primary' :
                                    'text-slate-400'
                                }`}>
                                    {step.text}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;