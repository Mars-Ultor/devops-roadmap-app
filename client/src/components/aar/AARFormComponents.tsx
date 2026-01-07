/**
 * AAR Form Sub-Components
 * Extracted from AARForm.tsx for ESLint compliance
 */

import { Save, CheckCircle, AlertTriangle, BookOpen, Target } from 'lucide-react';
import type { AARValidationResult } from '../../types/aar';
import type { AARLevel } from './AARForm';

interface AARFormHeaderProps {
  readonly lessonId: string;
  readonly level: AARLevel;
}

interface AARValidationSummaryProps {
  readonly validation: AARValidationResult;
  readonly show: boolean;
}

interface AARFormActionsProps {
  readonly onCancel?: () => void;
  readonly isSubmitting: boolean;
  readonly isValid: boolean;
}

// Header Component
export function AARFormHeader({ lessonId, level }: AARFormHeaderProps) {
  return (
    <div className="p-6 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-indigo-400" />
            After Action Review (AAR)
          </h2>
          <p className="text-gray-400 mt-1">
            Complete this mandatory reflection to finish your lab and unlock the next lesson.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Lesson {lessonId}</div>
          <div className="text-sm text-indigo-400 capitalize">{level} Level</div>
        </div>
      </div>
    </div>
  );
}

// Validation Summary Component
export function AARValidationSummary({ validation, show }: AARValidationSummaryProps) {
  if (!show) return null;
  
  const bgClass = validation.isValid 
    ? 'bg-green-900/50 border border-green-700' 
    : 'bg-red-900/50 border border-red-700';
  const textClass = validation.isValid ? 'text-green-400' : 'text-red-400';
  
  return (
    <div className={`p-4 rounded-md ${bgClass}`}>
      <div className="flex items-center">
        {validation.isValid 
          ? <CheckCircle className="w-5 h-5 text-green-400 mr-2" /> 
          : <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
        }
        <span className={`font-medium ${textClass}`}>
          {validation.isValid ? 'Ready to submit!' : 'Please complete all required fields'}
        </span>
      </div>
    </div>
  );
}

// Form Actions Footer Component
export function AARFormActions({ onCancel, isSubmitting, isValid }: AARFormActionsProps) {
  return (
    <div className="flex justify-between pt-6 border-t border-slate-700">
      <div className="flex items-center text-sm text-gray-400">
        <Target className="w-4 h-4 mr-1" />
        AAR completion required to proceed
      </div>
      <div className="flex space-x-3">
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
          disabled={isSubmitting || !isValid}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Complete AAR
            </>
          )}
        </button>
      </div>
    </div>
  );
}
