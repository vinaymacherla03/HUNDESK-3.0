
import React, { useState } from 'react';
import { useGrammarCheck } from '../../hooks/useGrammarCheck';
import GrammarIndicator from './GrammarIndicator';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  as?: 'input' | 'textarea';
  rows?: number;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  as = 'input',
  rows = 3,
  required = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  // Only enable grammar check for text inputs/textareas that are likely to have sentences
  const shouldCheckGrammar = (as === 'textarea' || type === 'text') && !name.includes('name') && !name.includes('email') && !name.includes('link') && !name.includes('date');
  
  const { isChecking, result, clearParams } = useGrammarCheck(value, shouldCheckGrammar && isFocused);

  const handleApplyCorrection = (corrected: string) => {
    // Create a synthetic event to update the parent state
    const event = {
      target: { value: corrected }
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    onChange(event);
    clearParams();
  };

  const commonProps = {
    id: name,
    name,
    value,
    onChange,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    placeholder,
    required,
    spellCheck: true, // Browser spellcheck still useful
    className: `block w-full text-sm p-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-white focus:ring-primary focus:border-primary transition bg-white text-slate-900 placeholder:text-slate-400 ${result ? 'pr-8 ring-1 ring-amber-200 border-amber-300' : ''}`,
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1.5 flex justify-between">
        <span>{label}</span>
      </label>
      <div className="relative">
          {as === 'textarea' ? (
            <textarea {...commonProps} rows={rows} />
          ) : (
            <input {...commonProps} type={type} />
          )}
          {shouldCheckGrammar && (
             <GrammarIndicator 
                isChecking={isChecking} 
                result={result} 
                onApply={handleApplyCorrection} 
                onDismiss={clearParams} 
             />
          )}
      </div>
    </div>
  );
};

export default FormField;
