/**
 * Step Validation Sub-Components
 * Extracted from StepValidation.tsx for ESLint compliance
 */

import { CheckCircle, XCircle, Play, AlertCircle, Loader, Lock } from 'lucide-react';
import type { ValidationRule } from '../../services/validationService';

export interface LabStep {
  number: number;
  title: string;
  description?: string;
  validations: ValidationRule[];
  status: 'locked' | 'in_progress' | 'completed';
  completedValidations: number;
}

interface ValidationResult {
  success: boolean;
  message: string;
  timestamp: Date;
}

// Step Status Icon
interface StepStatusIconProps {
  readonly status: LabStep['status'];
}

export function StepStatusIcon({ status }: StepStatusIconProps) {
  if (status === 'completed') return <CheckCircle className="w-6 h-6 text-green-400" />;
  if (status === 'locked') return <Lock className="w-6 h-6 text-gray-500" />;
  return <Play className="w-6 h-6 text-yellow-400" />;
}

// Validation Icon
interface ValidationIconProps {
  readonly isRunning: boolean;
  readonly result?: ValidationResult;
}

export function ValidationIcon({ isRunning, result }: ValidationIconProps) {
  if (isRunning) return <Loader className="w-4 h-4 text-blue-400 animate-spin" />;
  if (!result) return <AlertCircle className="w-4 h-4 text-gray-400" />;
  return result.success ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />;
}

// Run Validation Button
interface RunValidationButtonProps {
  readonly isRunning: boolean;
  readonly isCompleted: boolean;
  readonly onClick: () => void;
}

export function RunValidationButton({ isRunning, isCompleted, onClick }: RunValidationButtonProps) {
  let buttonText: string;
  if (isRunning) {
    buttonText = 'Running...';
  } else if (isCompleted) {
    buttonText = 'Completed ✅';
  } else {
    buttonText = 'Run Validation';
  }
  return (
    <button onClick={onClick} disabled={isRunning || isCompleted}
      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200">
      {buttonText}
    </button>
  );
}

// Progress Bar
interface ProgressBarProps {
  readonly completed: number;
  readonly total: number;
}

export function StepProgressBar({ completed, total }: ProgressBarProps) {
  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Progress</span>
        <span>{completed}/{total} checks passed</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(completed / total) * 100}%` }} />
      </div>
    </div>
  );
}

// Validation Rule Item
interface ValidationRuleItemProps {
  readonly rule: ValidationRule;
  readonly isLocked: boolean;
  readonly isRunning: boolean;
  readonly result?: ValidationResult;
  readonly statusText: string;
}

export function ValidationRuleItem({ rule, isLocked, isRunning, result, statusText }: ValidationRuleItemProps) {
  let borderClass: string;
  if (isLocked) {
    borderClass = 'border-gray-700 bg-gray-900/50';
  } else if (result?.success) {
    borderClass = 'border-green-600 bg-green-900/20';
  } else if (result?.success === false) {
    borderClass = 'border-red-600 bg-red-900/20';
  } else {
    borderClass = 'border-slate-600 bg-slate-900/50';
  }

  let statusClass: string;
  if (isLocked) {
    statusClass = 'text-gray-500';
  } else if (result?.success) {
    statusClass = 'text-green-400';
  } else if (result?.success === false) {
    statusClass = 'text-red-400';
  } else {
    statusClass = 'text-gray-400';
  }

  return (
    <div className={`flex items-start justify-between p-3 rounded-lg border ${borderClass}`}>
      <div className="flex items-start space-x-3 flex-1">
        <ValidationIcon isRunning={isRunning} result={result} />
        <div className="flex-1">
          <div className={`font-medium ${isLocked ? 'text-gray-500' : 'text-white'}`}>{rule.type.replaceAll('_', ' ').toUpperCase()}</div>
          <div className={`text-sm ${isLocked ? 'text-gray-600' : 'text-gray-400'}`}>{rule.target || rule.cmd || rule.pattern || 'Check condition'}</div>
          {result?.message && !isLocked && <div className={`text-xs mt-1 ${result.success ? 'text-green-400' : 'text-red-400'}`}>{result.message}</div>}
        </div>
      </div>
      <div className={`text-sm font-medium ml-3 ${statusClass}`}>{statusText}</div>
    </div>
  );
}

// NOTE: getStepStatusColor and getValidationStatus moved to StepValidationUtils.ts for fast-refresh compliance
