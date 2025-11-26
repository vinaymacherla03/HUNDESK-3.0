import React from 'react';
import { motion } from 'framer-motion';

interface StepNavigatorProps {
  steps: { key: string; name: string }[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const StepNavigator: React.FC<StepNavigatorProps> = ({ steps, currentStep, setCurrentStep }) => {
  return (
    <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200" />
        <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-primary"
            style={{ originX: 0 }}
            animate={{ scaleX: currentStep / (steps.length - 1) }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        <div className="relative flex justify-between items-center">
        {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
                <button 
                    key={step.key} 
                    onClick={() => setCurrentStep(index)}
                    className="flex flex-col items-center gap-2 focus:outline-none"
                >
                    <motion.div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 bg-white"
                        animate={{
                            borderColor: isActive ? 'var(--primary-color)' : isCompleted ? 'var(--primary-color)' : '#e2e8f0',
                            backgroundColor: isCompleted ? 'var(--primary-color)' : '#fff',
                        }}
                    >
                       {isCompleted && (
                           <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                       )}
                       {isActive && (
                           <motion.div 
                            className="w-2 h-2 rounded-full bg-primary" 
                            layoutId="active-step-indicator"
                            transition={{ duration: 0.3 }}
                           />
                       )}
                    </motion.div>
                    <span className={`text-xs font-medium transition-colors ${isActive ? 'text-primary' : isCompleted ? 'text-primary-600' : 'text-slate-500'}`}>
                        {step.name}
                    </span>
                </button>
            )
        })}
        </div>
    </div>
  );
};

export default StepNavigator;