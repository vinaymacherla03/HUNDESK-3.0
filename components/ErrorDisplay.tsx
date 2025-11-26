

import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
  onStartOver?: () => void;
  retryText?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry, onStartOver, retryText = 'Try Again' }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center bg-white p-8 rounded-xl border border-slate-200 shadow-xl max-w-lg mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">An Error Occurred</h3>
      <p className="text-sm text-slate-600 max-w-md">{message}</p>
       <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12A8 8 0 1013.4 5.37" />
              </svg>
              {retryText}
            </button>
            {onStartOver && (
                 <button
                    onClick={onStartOver}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
                    </svg>
                    Back to Home
                </button>
            )}
       </div>
    </div>
  );
};

export default ErrorDisplay;