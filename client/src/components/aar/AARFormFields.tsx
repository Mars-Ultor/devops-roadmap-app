import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import type { AARValidationResult } from '../../types/aar';

// Word count helper - moved to component level to avoid fast refresh issues
const getWordCount = (text: string) => 
  text.trim().split(/\s+/).filter(word => word.length > 0).length;

// Text Field Component
interface TextFieldProps {
  field: string;
  label: string;
  placeholder: string;
  minWords: number;
  value: string;
  onChange: (value: string) => void;
  showValidation: boolean;
  validation: AARValidationResult | null;
  required?: boolean;
  rows?: number;
}

export const AARTextField: React.FC<TextFieldProps> = ({
  field,
  label,
  placeholder,
  minWords,
  value,
  onChange,
  showValidation,
  validation,
  required = true,
  rows = 3
}) => {
  const wordCount = getWordCount(value);
  const hasError = showValidation && validation?.errors[field];
  const isValid = wordCount >= minWords;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
        <span className="ml-2 text-xs text-gray-500">
          (Min {minWords} words - Current: {wordCount})
        </span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 bg-slate-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          hasError ? 'border-red-500' : isValid ? 'border-green-500' : 'border-slate-600'
        }`}
      />
      {hasError && (
        <p className="text-sm text-red-400 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {validation?.errors[field]}
        </p>
      )}
      {isValid && (
        <p className="text-sm text-green-400 flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" />
          Meets minimum requirements
        </p>
      )}
    </div>
  );
};

// List Field Component
interface ListFieldProps {
  field: string;
  label: string;
  placeholder: string;
  minItems: number;
  items: string[];
  onItemChange: (index: number, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  showValidation: boolean;
  validation: AARValidationResult | null;
}

export const AARListField: React.FC<ListFieldProps> = ({
  field,
  label,
  placeholder,
  minItems,
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
  showValidation,
  validation
}) => {
  const hasError = showValidation && validation?.errors[field];
  const isValid = items.length >= minItems && items.every(item => item.trim().length > 0);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} <span className="text-red-400">*</span>
        <span className="ml-2 text-xs text-gray-500">
          (Min {minItems} items - Current: {items.length})
        </span>
      </label>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onItemChange(index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className={`flex-1 px-3 py-2 bg-slate-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              hasError && !item.trim() ? 'border-red-500' : 'border-slate-600'
            }`}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveItem(index)}
              className="p-2 text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAddItem}
        className="text-indigo-400 hover:text-indigo-300 text-sm"
      >
        + Add another item
      </button>
      {hasError && (
        <p className="text-sm text-red-400 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {validation?.errors[field]}
        </p>
      )}
      {isValid && (
        <p className="text-sm text-green-400 flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" />
          Meets minimum requirements
        </p>
      )}
    </div>
  );
};
