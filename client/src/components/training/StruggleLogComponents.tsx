/**
 * StruggleLog - UI Components
 */

import { FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { ATTEMPT_PLACEHOLDERS, MIN_WHERE_STUCK_LENGTH, MIN_SUSPECTED_PROBLEM_LENGTH } from './StruggleLogUtils';

// Header Component
export function StruggleLogHeader() {
  return (
    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-t-xl sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Struggle Log</h2>
          <p className="text-indigo-200 text-sm mt-1">
            Document your troubleshooting before accessing hints
          </p>
        </div>
      </div>
    </div>
  );
}

// Why This Matters Section
export function WhyThisMatters() {
  return (
    <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-blue-300 font-semibold mb-1">Why log your struggle?</p>
          <ul className="text-blue-200/80 space-y-1 ml-4 list-disc">
            <li>Forces systematic troubleshooting instead of random guessing</li>
            <li>Builds your personal debugging methodology</li>
            <li>Creates a reference for similar future problems</li>
            <li>Prevents hint dependency - you&apos;ve earned the help</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Errors Display
interface ErrorsDisplayProps {
  readonly errors: string[];
}

export function ErrorsDisplay({ errors }: ErrorsDisplayProps) {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-900/20 rounded-lg p-4 border border-red-700">
      <div className="flex items-start gap-2">
        <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-300 font-semibold mb-2">Please complete all fields:</p>
          <ul className="text-sm text-red-200/80 space-y-1">
            {errors.map((error) => (
              <li key={error}>• {error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// What Tried Section
interface WhatTriedSectionProps {
  readonly whatTried: string[];
  readonly onUpdate: (index: number, value: string) => void;
  readonly onAddMore: () => void;
}

export function WhatTriedSection({ whatTried, onUpdate, onAddMore }: WhatTriedSectionProps) {
  return (
    <div>
      <div className="block text-sm font-semibold text-slate-300 mb-2">
        What have you tried? <span className="text-red-400">*</span>
        <span className="text-slate-500 text-xs ml-2">(minimum 3 things)</span>
      </div>
      <div className="space-y-2">
        {whatTried.map((tried, idx) => (
          <div key={tried || `attempt-${idx}`} className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 mt-2 flex-shrink-0">
              {idx + 1}
            </div>
            <textarea
              value={tried}
              onChange={(e) => onUpdate(idx, e.target.value)}
              placeholder={`e.g., ${ATTEMPT_PLACEHOLDERS[idx] || 'Describe what you tried...'}`}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none h-20"
            />
            {tried.trim().length > 0 && (
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-2 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={onAddMore}
        className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        + Add another attempt
      </button>
    </div>
  );
}

// Where Stuck Section
interface WhereStuckSectionProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function WhereStuckSection({ value, onChange }: WhereStuckSectionProps) {
  return (
    <div>
      <label htmlFor="where-stuck-textarea" className="block text-sm font-semibold text-slate-300 mb-2">
        Where specifically are you stuck? <span className="text-red-400">*</span>
      </label>
      <textarea
        id="where-stuck-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., I can deploy the pod but the service isn't routing traffic to it. When I curl the service ClusterIP, I get connection refused. The pod is running and healthy according to kubectl get pods."
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none h-32"
      />
      <div className="text-xs text-slate-500 mt-1">
        {value.length}/{MIN_WHERE_STUCK_LENGTH} characters minimum
      </div>
    </div>
  );
}

// Suspected Problem Section
interface SuspectedProblemSectionProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function SuspectedProblemSection({ value, onChange }: SuspectedProblemSectionProps) {
  return (
    <div>
      <label htmlFor="suspected-problem-textarea" className="block text-sm font-semibold text-slate-300 mb-2">
        What do you think the problem might be? <span className="text-red-400">*</span>
      </label>
      <textarea
        id="suspected-problem-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., I suspect the service selector might not match the pod labels, or maybe the target port is wrong in the service definition. Could also be a network policy blocking traffic."
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none h-24"
      />
      <div className="text-xs text-slate-500 mt-1">
        {value.length}/{MIN_SUSPECTED_PROBLEM_LENGTH} characters minimum
      </div>
    </div>
  );
}

// Action Buttons
interface ActionButtonsProps {
  readonly onCancel?: () => void;
  readonly onSubmit: () => void;
}

export function ActionButtons({ onCancel, onSubmit }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
      {onCancel && (
        <button
          onClick={onCancel}
          className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      )}
      <button
        onClick={onSubmit}
        className="ml-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
      >
        <FileText className="w-5 h-5" />
        Submit &amp; Unlock Hints
      </button>
    </div>
  );
}
