import React, { useRef, useEffect, useState, ComponentProps } from 'react';

type ElementType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div' | 'li' | 'a';

interface EditableFieldProps<T extends ElementType> {
  as?: T;
  path: string;
  value: any;
  onChange: (path: string, value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  validation?: 'url' | 'email';
}

const EditableField = <T extends ElementType = 'span'>({
  as,
  path,
  value,
  onChange,
  className = '',
  placeholder,
  required,
  validation,
  ...rest
}: EditableFieldProps<T> & Omit<ComponentProps<T>, keyof EditableFieldProps<T>>) => {
  const Component: any = as || 'span';
  const elementRef = useRef<HTMLElement>(null);
  const [currentValue, setCurrentValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  
  const handleFocus = () => {
    setError(null);
  };

  const handleBlur = () => {
    if (!elementRef.current) return;

    const newValue = elementRef.current.innerText.trim();
    let validationError: string | null = null;
    let finalValue = newValue;

    if (required && !newValue) {
        validationError = "This field cannot be empty.";
    } else if (newValue) {
        if (validation === 'email') {
            const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailPattern.test(newValue)) {
                validationError = "Please enter a valid email address.";
            }
        } else if (validation === 'url') {
            if (!/^(https?:\/\/|mailto:)/i.test(newValue)) {
                // If it doesn't have a protocol, but looks like a domain, prepend https://
                if (newValue.includes('.') && !newValue.includes(' ')) {
                    finalValue = `https://${newValue}`;
                } else {
                    validationError = "Please enter a valid URL (e.g., example.com).";
                }
            }
        }
    }

    setError(validationError);

    if (!validationError && finalValue !== value) {
        onChange(path, finalValue);
    }
};


  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    setCurrentValue(e.currentTarget.innerText);
  }

  return (
    <Component
      ref={elementRef as any}
      contentEditable={true}
      suppressContentEditableWarning={true}
      spellCheck={true}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onInput={handleInput}
      className={`${className} focus:outline-none rounded-sm transition-all p-0.5 -m-0.5 ${
        error
          ? 'bg-red-100/50 ring-1 ring-red-500'
          : 'focus:bg-blue-50 focus:ring-1 focus:ring-blue-300'
      }`}
      {...rest}
      title={error || undefined}
      data-placeholder={placeholder}
    >
      {value || ''}
    </Component>
  );
};

export default EditableField;