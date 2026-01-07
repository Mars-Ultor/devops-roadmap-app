/**
 * StruggleLogFormComponents - Extracted UI components for StruggleLogForm
 */

import { Plus, X, AlertCircle, CheckCircle, BookOpen } from 'lucide-react';
import { STRUGGLE_SESSION_CONFIG } from '../../../types/struggle';

// ============================================================================
// Form Header Component
// ============================================================================

export function StruggleLogFormHeader() {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <BookOpen className="w-6 h-6 text-blue-400" />
      <div>
        <h2 className="text-xl font-bold text-white">Document Your Struggle</h2>
        <p className="text-sm text-gray-400">
          Before accessing hints, you must document your genuine problem-solving attempts
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Form Field Components
// ============================================================================

interface ProblemDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProblemDescriptionField({ value, onChange }: ProblemDescriptionFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        What Problem Are You Trying to Solve? *
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the specific problem or concept you're struggling with..."
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={3}
        required
      />
    </div>
  );
}

interface ApproachesTriedFieldProps {
  approaches: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
}

export function ApproachesTriedField({ approaches, onAdd, onRemove, onUpdate }: ApproachesTriedFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-300">
          What Approaches Have You Tried? *
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Approach
        </button>
      </div>
      <div className="space-y-2">
        {approaches.map((approach, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={approach}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={`Approach ${index + 1}...`}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {approaches.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface StuckPointFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function StuckPointField({ value, onChange }: StuckPointFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Where Are You Currently Stuck? *
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe exactly where you're stuck and what you don't understand..."
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={3}
        required
      />
    </div>
  );
}

interface TimeSpentFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export function TimeSpentField({ value, onChange }: TimeSpentFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Time Spent Struggling (minutes) *
      </label>
      <input
        type="number"
        min={STRUGGLE_SESSION_CONFIG.MIN_STRUGGLE_TIME_MINUTES}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <p className="text-xs text-gray-500 mt-1">
        Minimum {STRUGGLE_SESSION_CONFIG.MIN_STRUGGLE_TIME_MINUTES} minutes required
      </p>
    </div>
  );
}

interface ConfidenceLevelFieldProps {
  value: 1 | 2 | 3 | 4 | 5;
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void;
}

export function ConfidenceLevelField({ value, onChange }: ConfidenceLevelFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Confidence Level (1-5)
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
          className="flex-1"
        />
        <span className="text-white font-mono w-8 text-center">
          {value}
        </span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Completely Lost</span>
        <span>Confident</span>
      </div>
    </div>
  );
}

interface LearningPointsFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function LearningPointsField({ value, onChange }: LearningPointsFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        What Have You Learned So Far? (Optional)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Any insights or concepts you've discovered..."
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={2}
      />
    </div>
  );
}

// ============================================================================
// Form Feedback Components
// ============================================================================

interface FormErrorsDisplayProps {
  errors: string[];
}

export function FormErrorsDisplay({ errors }: FormErrorsDisplayProps) {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-900/50 border border-red-700 rounded-md p-3">
      <div className="flex items-start space-x-2">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-red-400 mb-1">
            Please Complete Required Fields:
          </h4>
          <ul className="text-xs text-red-200 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Form Actions Component
// ============================================================================

interface FormActionsProps {
  onCancel: () => void;
  isValid: boolean;
  isSubmitting: boolean;
}

export function FormActions({ onCancel, isValid, isSubmitting }: FormActionsProps) {
  return (
    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 bg-slate-700 text-gray-300 rounded-md hover:bg-slate-600 transition-colors"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Submit Struggle Log</span>
          </>
        )}
      </button>
    </div>
  );
}

// ============================================================================
// Form Header Component
// ============================================================================

interface FormHeaderProps {
  title?: string;
  description?: string;
}

export function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <div className="border-b border-slate-700 pb-4 mb-4">
      <h3 className="text-xl font-bold text-white">
        {title || '📝 Struggle Documentation'}
      </h3>
      <p className="text-sm text-gray-400 mt-1">
        {description || 'Document your struggle before requesting a hint. This forces reflection and builds genuine problem-solving skills.'}
      </p>
    </div>
  );
}
