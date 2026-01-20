/**
 * FailureResolutionForm - UI Components
 */

import { CheckCircle, X, Search, Shield, BookOpen } from "lucide-react";
import type { FailureLog } from "../../types/training";
import { countWords, MIN_LESSONS } from "./FailureResolutionFormUtils";

// Header Component
interface FormHeaderProps {
  readonly onCancel: () => void;
}

export function FormHeader({ onCancel }: FormHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-6 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Document Resolution</h2>
        </div>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <p className="text-slate-300 mt-2">
        Capture how you fixed the issue and what you learned
      </p>
    </div>
  );
}

// Original Failure Display
interface OriginalFailureProps {
  readonly failure: FailureLog;
}

export function OriginalFailure({ failure }: OriginalFailureProps) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
      <h3 className="font-semibold text-white mb-2">Original Failure:</h3>
      <p className="text-slate-300 mb-1">{failure.title}</p>
      <p className="text-sm text-slate-400">{failure.description}</p>
      {failure.errorMessage && (
        <pre className="mt-2 text-xs text-red-400 bg-slate-900 p-2 rounded overflow-x-auto">
          {failure.errorMessage}
        </pre>
      )}
    </div>
  );
}

// Root Cause Input
interface RootCauseInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function RootCauseInput({ value, onChange }: RootCauseInputProps) {
  return (
    <div>
      <label
        htmlFor="root-cause-textarea"
        className="block text-sm font-semibold text-slate-300 mb-2"
      >
        <Search className="w-4 h-4 inline mr-1" />
        Root Cause Analysis *{" "}
        <span className="text-slate-500">(Why did this happen?)</span>
      </label>
      <textarea
        id="root-cause-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Dig deep - what was the underlying cause? Not just the symptom..."
        rows={3}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 resize-none"
      />
      <p className="text-xs text-slate-500 mt-1">
        {countWords(value)} words (min 20 recommended)
      </p>
    </div>
  );
}

// Resolution Input
interface ResolutionInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function ResolutionInput({ value, onChange }: ResolutionInputProps) {
  return (
    <div>
      <label
        htmlFor="resolution-textarea"
        className="block text-sm font-semibold text-slate-300 mb-2"
      >
        <CheckCircle className="w-4 h-4 inline mr-1" />
        Resolution *{" "}
        <span className="text-slate-500">(How did you fix it?)</span>
      </label>
      <textarea
        id="resolution-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Step-by-step: what actions did you take to resolve this?"
        rows={4}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 resize-none"
      />
      <p className="text-xs text-slate-500 mt-1">{countWords(value)} words</p>
    </div>
  );
}

// Prevention Strategy Input
interface PreventionInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function PreventionInput({ value, onChange }: PreventionInputProps) {
  return (
    <div>
      <label
        htmlFor="prevention-textarea"
        className="block text-sm font-semibold text-slate-300 mb-2"
      >
        <Shield className="w-4 h-4 inline mr-1" />
        Prevention Strategy{" "}
        <span className="text-slate-500">(How to avoid this in future?)</span>
      </label>
      <textarea
        id="prevention-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What process, checklist, or practice will prevent this from happening again?"
        rows={3}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 resize-none"
      />
    </div>
  );
}

// Lessons Learned Section
interface LessonsLearnedSectionProps {
  readonly lessons: string[];
  readonly onUpdate: (index: number, value: string) => void;
  readonly onAdd: () => void;
  readonly onRemove: (index: number) => void;
}

export function LessonsLearnedSection({
  lessons,
  onUpdate,
  onAdd,
  onRemove,
}: LessonsLearnedSectionProps) {
  return (
    <div>
      <div className="block text-sm font-semibold text-slate-300 mb-2">
        <BookOpen className="w-4 h-4 inline mr-1" />
        Lessons Learned *{" "}
        <span className="text-slate-500">(At least {MIN_LESSONS})</span>
      </div>
      <div className="space-y-2">
        {lessons.map((lesson, index) => (
          <div key={lesson || `lesson-${index}`} className="flex gap-2">
            <input
              type="text"
              value={lesson}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={`Lesson ${index + 1}: What did you learn?`}
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
            />
            {lessons.length > MIN_LESSONS && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-400 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 text-sm text-green-400 hover:text-green-300 transition-colors"
      >
        + Add Another Lesson
      </button>
    </div>
  );
}

// Info Box
export function InfoBox() {
  return (
    <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
      <p className="text-sm text-green-200">
        <strong>Remember:</strong> The goal isn&apos;t just to fix the problem,
        but to learn from it. Future you will thank you for documenting this
        well!
      </p>
    </div>
  );
}

// Action Buttons
interface ActionButtonsProps {
  readonly onCancel: () => void;
  readonly submitting: boolean;
  readonly canSubmit: boolean;
}

export function ActionButtons({
  onCancel,
  submitting,
  canSubmit,
}: ActionButtonsProps) {
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
        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-colors"
      >
        {submitting ? "Saving..." : "Mark Resolved"}
      </button>
    </div>
  );
}
