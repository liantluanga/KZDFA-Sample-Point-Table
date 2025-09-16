import React, { useState, useEffect, useRef } from 'react';

interface EditableFieldProps {
  value: string | number;
  onChange: (newValue: string | number) => void;
  className?: string;
  inputType?: 'text' | 'number';
  isTextarea?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onChange, className, inputType = 'text', isTextarea = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      if (isTextarea && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      } else if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, isTextarea]);

  const handleBlur = () => {
    setIsEditing(false);
    if (inputType === 'number') {
      onChange(Number(currentValue));
    } else {
      onChange(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTextarea) {
      handleBlur();
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  const commonInputClasses = `bg-transparent border border-teal-400 rounded-md p-1 -m-1 w-full text-center ${className}`;

  if (isEditing) {
    if (isTextarea) {
        return (
            <textarea
                ref={textareaRef}
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`resize-none ${commonInputClasses}`}
                rows={2}
            />
        )
    }
    return (
      <input
        ref={inputRef}
        type={inputType}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={commonInputClasses}
      />
    );
  }

  return (
    <span onClick={() => setIsEditing(true)} className={`cursor-pointer min-h-[1em] ${className}`}>
      {value}
    </span>
  );
};

export default EditableField;
