
import React from 'react';
import { motion } from 'framer-motion';

interface PremiumButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  loadingText?: string;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  children,
  variant = 'primary',
  loadingText = 'Processing...',
}) => {

  const baseClasses = 'w-full flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: `text-white bg-primary hover:bg-primary-700 focus:ring-primary-400 focus:ring-offset-white`,
    secondary: `text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 focus:ring-slate-400 focus:ring-offset-white`,
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} disabled:opacity-70 disabled:cursor-not-allowed`}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.05, y: disabled || isLoading ? 0 : -2 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
    >
      {isLoading ? (
         <>
            <svg className="animate-spin -ml-1 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{loadingText}</span>
         </>
      ) : children}
    </motion.button>
  );
};

export default PremiumButton;
