/**
 * EnhancedFailureLogFormComponents - Extracted UI components
 */

import {
  AlertTriangle,
  X,
  BookOpen,
  TrendingUp,
  Copy,
  Check,
  FileText,
} from "lucide-react";
import type { FailureCategory, FailureSeverity } from "../../types/training";
import type {
  PatternDetection,
  ValidationState,
} from "./EnhancedFailureLogFormUtils";
import { CATEGORIES, SEVERITIES } from "./EnhancedFailureLogFormUtils";

// ============================================================================
// Form Header
// ============================================================================

interface FormHeaderProps {
  readonly onCancel?: () => void;
}

export function FormHeader({ onCancel }: FormHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-bold text-white">
            Enhanced Failure Log
          </h2>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      <p className="text-slate-300 mt-2">
        Document failures systematically to build your personal runbook
      </p>
    </div>
  );
}

// ============================================================================
// Pattern Detection Alert
// ============================================================================

interface PatternAlertProps {
  readonly pattern: PatternDetection;
}

export function PatternAlert({ pattern }: PatternAlertProps) {
  if (!pattern.detected) return null;

  return (
    <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <TrendingUp className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-yellow-300 font-semibold mb-1">
            ⚠️ Recurring Pattern Detected
          </h3>
          <p className="text-yellow-200 text-sm mb-2">
            <strong>{pattern.category}</strong> - Occurred {pattern.occurrences}{" "}
            times (last: {pattern.lastSeen})
          </p>
          <div className="bg-yellow-900/40 rounded p-3 text-yellow-100 text-sm">
            <strong>Suggested Fix:</strong> {pattern.suggestedRunbook}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Context Info
// ============================================================================

interface ContextInfoProps {
  readonly contentType: string;
  readonly contentTitle: string;
}

export function ContextInfo({ contentType, contentTitle }: ContextInfoProps) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
      <p className="text-sm text-slate-400">
        <span className="font-semibold text-white">Context:</span> {contentType}{" "}
        - {contentTitle}
      </p>
    </div>
  );
}

// ============================================================================
// Category and Severity Selectors
// ============================================================================

interface CategorySeverityProps {
  readonly category: FailureCategory;
  readonly severity: FailureSeverity;
  readonly onCategoryChange: (cat: FailureCategory) => void;
  readonly onSeverityChange: (sev: FailureSeverity) => void;
}

export function CategorySeveritySelector({
  category,
  severity,
  onCategoryChange,
  onSeverityChange,
}: CategorySeverityProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="category-select"
          className="block text-sm font-semibold text-slate-300 mb-2"
        >
          Category *
        </label>
        <select
          id="category-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as FailureCategory)}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className="block text-sm font-semibold text-slate-300 mb-2">
          Severity *
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SEVERITIES.map((sev) => (
            <button
              key={sev.value}
              type="button"
              onClick={() => onSeverityChange(sev.value)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                severity === sev.value
                  ? sev.color + " border-2 border-current"
                  : "bg-slate-700 text-slate-400 border-2 border-transparent hover:bg-slate-600"
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

// ============================================================================
// What I Tried Section
// ============================================================================

interface WhatTriedSectionProps {
  readonly whatTried: string[];
  readonly validation: ValidationState;
  readonly onChange: (index: number, value: string) => void;
  readonly onAdd: () => void;
}

export function WhatTriedSection({
  whatTried,
  validation,
  onChange,
  onAdd,
}: WhatTriedSectionProps) {
  return (
    <div>
      <div className="block text-sm font-semibold text-slate-300 mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2">
          What I Tried *{" "}
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              validation.whatTried
                ? "bg-green-900/30 text-green-400"
                : "bg-red-900/30 text-red-400"
            }`}
          >
            {whatTried.filter((item) => item.trim().length > 0).length} / 3
            minimum
          </span>
        </span>
      </div>
      <div className="space-y-2">
        {whatTried.map((item, idx) => (
          <input
            key={item || `approach-${idx}`}
            type="text"
            value={item}
            onChange={(e) => onChange(idx, e.target.value)}
            placeholder={`Approach ${idx + 1}: What did you try?`}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          + Add another approach
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Root Cause Section
// ============================================================================

interface RootCauseSectionProps {
  readonly rootCause: string;
  readonly wordCount: number;
  readonly validation: ValidationState;
  readonly onChange: (value: string) => void;
}

export function RootCauseSection({
  rootCause,
  wordCount,
  validation,
  onChange,
}: RootCauseSectionProps) {
  return (
    <div>
      <label
        htmlFor="root-cause-textarea"
        className="block text-sm font-semibold text-slate-300 mb-2 flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          Root Cause Analysis *{" "}
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              validation.rootCause
                ? "bg-green-900/30 text-green-400"
                : "bg-red-900/30 text-red-400"
            }`}
          >
            {wordCount} / 30 words minimum
          </span>
        </span>
      </label>
      <textarea
        id="root-cause-textarea"
        value={rootCause}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Analyze the root cause, not just symptoms. What was the underlying reason for the failure? What misunderstanding or gap in knowledge led to this?"
        rows={4}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
      />
      <p className="text-xs text-slate-400 mt-1">
        Dig deeper than surface symptoms. Understanding root causes prevents
        recurring failures.
      </p>
    </div>
  );
}

// ============================================================================
// Generated Runbook Display
// ============================================================================

interface RunbookDisplayProps {
  readonly runbook: string;
  readonly copied: boolean;
  readonly onCopy: () => void;
}

export function RunbookDisplay({
  runbook,
  copied,
  onCopy,
}: RunbookDisplayProps) {
  if (!runbook) return null;

  return (
    <div className="bg-indigo-900/20 border-2 border-indigo-600 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-indigo-300 font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Auto-Generated Runbook
        </h3>
        <button
          type="button"
          onClick={onCopy}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded flex items-center gap-2"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? "Copied!" : "Copy Runbook"}
        </button>
      </div>
      <pre className="bg-slate-900 rounded p-4 text-xs text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
        {runbook}
      </pre>
      <p className="text-xs text-indigo-300 mt-2">
        💡 Save this runbook for future reference. It will be added to your
        personal knowledge base.
      </p>
    </div>
  );
}

// ============================================================================
// Form Actions
// ============================================================================

interface FormActionsProps {
  readonly validation: ValidationState;
  readonly submitting: boolean;
  readonly onCancel?: () => void;
}

export function FormActions({
  validation,
  submitting,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-700">
      <div className="text-sm text-slate-400">
        {validation.isValid ? (
          <span className="text-green-400 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Ready to submit
          </span>
        ) : (
          <span className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Complete mandatory fields
          </span>
        )}
      </div>
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white border border-slate-600 rounded-md hover:border-slate-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!validation.isValid || submitting}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Logging...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Log Failure
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Title and Description Fields
// ============================================================================

interface TitleFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function TitleField({ value, onChange }: TitleFieldProps) {
  return (
    <div>
      <label
        htmlFor="failure-title"
        className="block text-sm font-semibold text-slate-300 mb-2"
      >
        Failure Title *
      </label>
      <input
        id="failure-title"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Docker container failed to start due to port conflict"
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
}

interface DescriptionFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function DescriptionField({ value, onChange }: DescriptionFieldProps) {
  return (
    <div>
      <label
        htmlFor="description-textarea"
        className="block text-sm font-semibold text-slate-300 mb-2"
      >
        Description
      </label>
      <textarea
        id="description-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Detailed description of what happened..."
        rows={3}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
}

interface ErrorMessageFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function ErrorMessageField({ value, onChange }: ErrorMessageFieldProps) {
  if (!value) return null;

  return (
    <div>
      <label
        htmlFor="error-message-textarea"
        className="block text-sm font-semibold text-slate-300 mb-2"
      >
        Error Message
      </label>
      <textarea
        id="error-message-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full bg-slate-900 border border-red-600/50 rounded-lg px-4 py-2 text-red-300 font-mono text-sm focus:outline-none focus:border-red-500"
      />
    </div>
  );
}
