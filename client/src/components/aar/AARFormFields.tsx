import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import type { AARValidationResult } from '../../types/aar';

/** Counts non-empty words in a string */
const getWordCount = (text: string): number =>
  text.trim().split(/\s+/).filter(word => word.length > 0).length;

/** Determines border color class based on validation state */
const getBorderClass = (hasError: boolean, isValid: boolean): string => {
  if (hasError) return 'border-red-500';
  if (isValid) return 'border-green-500';
  return 'border-slate-600';
};

interface TextFieldProps {
  readonly field: string;
  readonly label: string;
  readonly placeholder: string;
  readonly minWords: number;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly showValidation: boolean;
  readonly validation: AARValidationResult | null;
  readonly required?: boolean;
  readonly rows?: number;
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
  const hasError = Boolean(showValidation && validation?.errors[field]);
  const isValid = wordCount >= minWords;
  const borderClass = getBorderClass(hasError, isValid);

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
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field}-error` : undefined}
        className={`w-full px-3 py-2 bg-slate-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${borderClass}`}
      />
      {hasError && (
        <p id={`${field}-error`} className="text-sm text-red-400 flex items-center" role="alert">
          <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
          {validation?.errors[field]}
        </p>
      )}
      {isValid && (
        <p className="text-sm text-green-400 flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" aria-hidden="true" />
          Meets minimum requirements
        </p>
      )}
    </div>
  );
};

interface ListFieldProps {
  readonly field: string;
  readonly label: string;
  readonly placeholder: string;
  readonly minItems: number;
  readonly items: readonly string[];
  readonly onItemChange: (index: number, value: string) => void;
  readonly onAddItem: () => void;
  readonly onRemoveItem: (index: number) => void;
  readonly showValidation: boolean;
  readonly validation: AARValidationResult | null;
}

/** Generates a stable key for list items using field name and index */
const getItemKey = (field: string, index: number): string => `${field}-item-${index}`;

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
  const hasError = Boolean(showValidation && validation?.errors[field]);
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
        <div key={getItemKey(field, index)} className="flex items-center space-x-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onItemChange(index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            aria-label={`${label} item ${index + 1}`}
            className={`flex-1 px-3 py-2 bg-slate-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              hasError && !item.trim() ? 'border-red-500' : 'border-slate-600'
            }`}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveItem(index)}
              className="p-2 text-red-400 hover:text-red-300"
              aria-label={`Remove item ${index + 1}`}
            >
              <X className="w-4 h-4" aria-hidden="true" />
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
        <p id={`${field}-error`} className="text-sm text-red-400 flex items-center" role="alert">
          <AlertCircle className="w-4 h-4 mr-1" aria-hidden="true" />
          {validation?.errors[field]}
        </p>
      )}
      {isValid && (
        <p className="text-sm text-green-400 flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" aria-hidden="true" />
          Meets minimum requirements
        </p>
      )}
    </div>
  );
};
