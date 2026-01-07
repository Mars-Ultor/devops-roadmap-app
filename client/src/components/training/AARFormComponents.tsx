/**
 * AARFormComponents - Extracted UI components for AAR Form
 */

import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { countWords, MIN_OBJECTIVE_WORDS, MIN_ITEMS, MIN_ROOT_CAUSES, MIN_IMPROVEMENTS, MIN_KNOWLEDGE_WORDS } from './AARFormUtils';

// ============================================================================
// Form Header
// ============================================================================

interface AARHeaderProps {
  contentTitle: string;
}

export function AARHeader({ contentTitle }: AARHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-t-xl">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">After Action Review</h2>
          <p className="text-indigo-200 mt-1">Required for: {contentTitle}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Info Banner
// ============================================================================

export function AARInfoBanner() {
  return (
    <div className="p-6 bg-indigo-900/30 border-b border-indigo-700">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-indigo-100">
          <p className="font-semibold mb-1">Why AAR is Mandatory</p>
          <p>
            After Action Reviews are critical for deep learning. This structured reflection helps you 
            internalize lessons, identify patterns, and build transferable expertise. Complete all 6 questions 
            to proceed.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Text Field with Word Count
// ============================================================================

interface TextFieldWithCountProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minWords: number;
  rows?: number;
}

export function TextFieldWithCount({ label, value, onChange, placeholder, minWords, rows = 3 }: TextFieldWithCountProps) {
  const words = countWords(value);
  const isValid = words >= minWords;
  
  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={rows}
      />
      <div className={`text-xs mt-1 ${isValid ? 'text-green-400' : 'text-slate-500'}`}>
        {words}/{minWords} words {isValid && '✓'}
      </div>
    </div>
  );
}

// ============================================================================
// Array Input Field
// ============================================================================

interface ArrayInputFieldProps {
  label: string;
  items: string[];
  minItems: number;
  onItemChange: (index: number, value: string) => void;
  onAddItem: () => void;
  maxItems?: number;
  placeholder: (index: number) => string;
  addLabel: string;
  isTextarea?: boolean;
}

export function ArrayInputField({ 
  label, items, minItems, onItemChange, onAddItem, maxItems = 10, placeholder, addLabel, isTextarea = false 
}: ArrayInputFieldProps) {
  const validCount = items.filter(w => w.trim()).length;
  const isValid = validCount >= minItems;
  
  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => isTextarea ? (
          <textarea
            key={index}
            value={item}
            onChange={(e) => onItemChange(index, e.target.value)}
            placeholder={placeholder(index)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={2}
          />
        ) : (
          <input
            key={index}
            type="text"
            value={item}
            onChange={(e) => onItemChange(index, e.target.value)}
            placeholder={placeholder(index)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}
      </div>
      {items.length < maxItems && (
        <button type="button" onClick={onAddItem} className="mt-2 text-sm text-indigo-400 hover:text-indigo-300">
          + {addLabel}
        </button>
      )}
      <div className={`text-xs mt-1 ${isValid ? 'text-green-400' : 'text-slate-500'}`}>
        {validCount}/{minItems} items {isValid && '✓'}
      </div>
    </div>
  );
}

// ============================================================================
// Validation Messages
// ============================================================================

interface ValidationMessagesProps {
  showValidation: boolean;
  isValid: boolean;
  objective: string;
  whatWorked: string[];
  whatDidntWork: string[];
  rootCauses: string[];
  improvements: string[];
  transferableKnowledge: string;
}

export function ValidationMessages({ 
  showValidation, isValid, objective, whatWorked, whatDidntWork, rootCauses, improvements, transferableKnowledge 
}: ValidationMessagesProps) {
  if (isValid) {
    return (
      <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">All requirements met! Ready to submit.</span>
        </div>
      </div>
    );
  }
  
  if (!showValidation) return null;
  
  const objWords = countWords(objective);
  const validWorks = whatWorked.filter(w => w.trim()).length;
  const validNotWorks = whatDidntWork.filter(w => w.trim()).length;
  const validRoots = rootCauses.filter(r => r.trim()).length;
  const validImprovs = improvements.filter(i => i.trim()).length;
  const knowledgeWords = countWords(transferableKnowledge);
  
  return (
    <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-red-200">
          <p className="font-semibold mb-1">Please complete all required fields:</p>
          <ul className="list-disc ml-4 space-y-1">
            {objWords < MIN_OBJECTIVE_WORDS && <li>Objective needs {MIN_OBJECTIVE_WORDS - objWords} more words</li>}
            {validWorks < MIN_ITEMS && <li>Add {MIN_ITEMS - validWorks} more success items</li>}
            {validNotWorks < MIN_ROOT_CAUSES && <li>Add {MIN_ROOT_CAUSES - validNotWorks} more challenge items</li>}
            {validRoots < MIN_ROOT_CAUSES && <li>Add {MIN_ROOT_CAUSES - validRoots} more root causes</li>}
            {validImprovs < MIN_IMPROVEMENTS && <li>Add {MIN_IMPROVEMENTS - validImprovs} more improvements</li>}
            {knowledgeWords < MIN_KNOWLEDGE_WORDS && <li>Transferable knowledge needs {MIN_KNOWLEDGE_WORDS - knowledgeWords} more words</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Form Actions
// ============================================================================

interface AARFormActionsProps {
  isValid: boolean;
  submitting: boolean;
  onSubmit: () => void;
  onCancel?: () => void;
}

export function AARFormActions({ isValid, submitting, onSubmit, onCancel }: AARFormActionsProps) {
  return (
    <div className="p-6 border-t border-slate-700 flex gap-3">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
        >
          Cancel
        </button>
      )}
      <button
        onClick={onSubmit}
        disabled={!isValid || submitting}
        className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit AAR'}
      </button>
    </div>
  );
}
