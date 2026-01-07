/**
 * FailureLogForm - UI Components
 */

import { AlertTriangle, X, FileText, Lightbulb } from 'lucide-react';
import type { FailureCategory, FailureSeverity } from '../../types/training';
import { CATEGORIES, SEVERITIES, countWords } from './FailureLogFormUtils';

// Header Component
interface FormHeaderProps {
  onCancel: () => void;
}

export function FormHeader({ onCancel }: FormHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-bold text-white">Log Failure</h2>
        </div>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <p className="text-slate-300 mt-2">
        Document what went wrong to identify patterns and improve
      </p>
    </div>
  );
}

// Context Info
interface ContextInfoProps {
  contentType: string;
  contentTitle: string;
}

export function ContextInfo({ contentType, contentTitle }: ContextInfoProps) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
      <p className="text-sm text-slate-400">
        <span className="font-semibold text-white">Context:</span> {contentType} - {contentTitle}
      </p>
    </div>
  );
}

// Category & Severity Section
interface CategorySeveritySectionProps {
  category: FailureCategory;
  severity: FailureSeverity;
  onCategoryChange: (value: FailureCategory) => void;
  onSeverityChange: (value: FailureSeverity) => void;
}

export function CategorySeveritySection({
  category,
  severity,
  onCategoryChange,
  onSeverityChange
}: CategorySeveritySectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Category *
        </label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as FailureCategory)}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Severity *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SEVERITIES.map(sev => (
            <button
              key={sev.value}
              type="button"
              onClick={() => onSeverityChange(sev.value)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                severity === sev.value
                  ? sev.color + ' border-2 border-current'
                  : 'bg-slate-700 text-slate-400 border-2 border-transparent hover:bg-slate-600'
              }`}
            >
              {sev.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Title Input
interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-2">
        <FileText className="w-4 h-4 inline mr-1" />
        Brief Title * <span className="text-slate-500">(3-10 words)</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Docker container failed to start"
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        maxLength={100}
      />
    </div>
  );
}

// Description Textarea
interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-2">
        Detailed Description * <span className="text-slate-500">(What happened?)</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe what you were doing, what you expected, and what actually happened..."
        rows={4}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
      />
      <p className="text-xs text-slate-500 mt-1">
        {countWords(value)} words
      </p>
    </div>
  );
}

// Error Message Textarea
interface ErrorMessageInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ErrorMessageInput({ value, onChange }: ErrorMessageInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-2">
        Error Message <span className="text-slate-500">(Optional - exact error text)</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the exact error message if available..."
        rows={3}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-none"
      />
    </div>
  );
}

// Pro Tip Info Box
export function ProTipBox() {
  return (
    <div className="bg-indigo-900/20 border border-indigo-600/30 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <Lightbulb className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-indigo-200">
          <strong>Pro Tip:</strong> You can add root cause analysis and resolution details after you fix the issue. This initial log helps track what&apos;s going wrong.
        </p>
      </div>
    </div>
  );
}

// Action Buttons
interface ActionButtonsProps {
  onCancel: () => void;
  submitting: boolean;
  canSubmit: boolean;
}

export function ActionButtons({ onCancel, submitting, canSubmit }: ActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={submitting}
        className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={submitting || !canSubmit}
        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-colors"
      >
        {submitting ? 'Logging...' : 'Log Failure'}
      </button>
    </div>
  );
}
