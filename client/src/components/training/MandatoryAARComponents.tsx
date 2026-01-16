/**
 * MandatoryAARComponents - Extracted UI components for MandatoryAARModal
 */

import { AlertTriangle, CheckCircle, X, Brain } from 'lucide-react';
import { countWords } from './MandatoryAARUtils';

interface AARHeaderProps {
  readonly labTitle: string;
}

export function AARHeader({ labTitle }: AARHeaderProps) {
  return (
    <>
      <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Mandatory After Action Review</h2>
            </div>
            <p className="text-red-100 text-sm">You must complete this AAR before proceeding</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6 mx-6 mt-6">
        <p className="text-gray-300"><strong className="text-white">Lab:</strong> {labTitle}</p>
        <p className="text-gray-400 text-sm mt-2">
          Reflection is critical for learning. Answer each question thoroughly - minimum word counts are enforced.
        </p>
      </div>
    </>
  );
}

interface ErrorsDisplayProps {
  readonly errors: string[];
}

export function ErrorsDisplay({ errors }: ErrorsDisplayProps) {
  if (errors.length === 0) return null;
  return (
    <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-red-400 font-semibold mb-2">Please fix the following:</h4>
          <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
            {errors.map((error) => (<li key={error}>{error}</li>))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface AIFeedbackDisplayProps {
  readonly aiErrors: Record<string, string>;
  readonly showAIFeedback: boolean;
}

export function AIFeedbackDisplay({ aiErrors, showAIFeedback }: AIFeedbackDisplayProps) {
  if (!showAIFeedback || Object.keys(aiErrors).length === 0) return null;
  return (
    <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <Brain className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-amber-400 font-semibold mb-2">AI Detected Vague Responses:</h4>
          <ul className="list-disc list-inside text-amber-300 text-sm space-y-1">
            {Object.entries(aiErrors).map(([field, error]) => (
              <li key={field}><strong>{field}:</strong> {error}</li>
            ))}
          </ul>
          <p className="text-amber-200 text-xs mt-2">
            Be specific! Include technical details like error messages, commands, root causes, and actionable steps.
          </p>
        </div>
      </div>
    </div>
  );
}

interface TextAreaFieldProps {
  readonly label: string;
  readonly minWords: number;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder: string;
  readonly hasAIError?: boolean;
  readonly rows?: number;
}

export function TextAreaField({ label, minWords, value, onChange, placeholder, hasAIError, rows = 3 }: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-white font-semibold mb-2">
        {label} <span className="text-red-400">*</span>
        <span className="text-gray-400 text-sm font-normal ml-2">(min {minWords} words)</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-slate-900 border rounded-lg p-3 text-gray-300 focus:outline-none ${
          hasAIError ? 'border-amber-500 focus:border-amber-400' : 'border-slate-700 focus:border-indigo-500'
        }`}
        style={{ minHeight: rows === 3 ? '80px' : '100px' }}
        placeholder={placeholder}
      />
      <p className="text-xs text-gray-500 mt-1">{countWords(value)} words</p>
    </div>
  );
}

interface ArrayFieldProps {
  readonly label: string;
  readonly minItems: number;
  readonly minWords: number;
  readonly items: string[];
  readonly onChange: (items: string[]) => void;
  readonly onAdd: () => void;
  readonly addLabel: string;
  readonly placeholderBase: string;
  readonly icon: 'success' | 'failure';
}

export function ArrayField({ label, minItems, minWords, items, onChange, onAdd, addLabel, placeholderBase, icon }: ArrayFieldProps) {
  const Icon = icon === 'success' ? CheckCircle : X;
  const iconColor = icon === 'success' ? 'text-green-400' : 'text-red-400';
  const buttonColor = icon === 'success' ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300';

  return (
    <div>
      <label className="block text-white font-semibold mb-2">
        {label} <span className="text-red-400">*</span>
        <span className="text-gray-400 text-sm font-normal ml-2">(min {minItems} items, {minWords}+ words each)</span>
      </label>
      {items.map((item, idx) => (
        <div key={item || `item-${idx}`} className="mb-3">
          <div className="flex items-start space-x-2">
            <Icon className={`w-5 h-5 ${iconColor} mt-3 flex-shrink-0`} />
            <div className="flex-1">
              <textarea
                value={item}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[idx] = e.target.value;
                  onChange(newItems);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-gray-300 min-h-[60px] focus:border-indigo-500 focus:outline-none"
                placeholder={`${placeholderBase} #${idx + 1}...`}
              />
              <p className="text-xs text-gray-500 mt-1">{countWords(item)} words</p>
            </div>
          </div>
        </div>
      ))}
      <button onClick={onAdd} className={`${buttonColor} text-sm font-medium`}>
        + {addLabel}
      </button>
    </div>
  );
}

interface AARFooterProps {
  readonly submitting: boolean;
  readonly onSubmit: () => void;
}

export function AARFooter({ submitting, onSubmit }: AARFooterProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
      <p className="text-gray-400 text-sm">
        <span className="text-red-400">*</span> You must complete this AAR to proceed
      </p>
      <button
        onClick={onSubmit}
        disabled={submitting}
        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-bold transition-all"
      >
        {submitting ? 'Submitting...' : 'Submit AAR & Continue'}
      </button>
    </div>
  );
}
