/**
 * Battle Drill Step Sub-Components
 * Extracted for ESLint compliance
 */

import { CheckCircle, XCircle, AlertCircle, Lightbulb, Target } from 'lucide-react';
import type { ValidationResult } from '../../utils/validation';

// Step Header with Number
interface StepNumberProps {
  readonly index: number;
  readonly isCompleted: boolean;
}

export function StepNumber({ index, isCompleted }: StepNumberProps) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500' : 'bg-slate-700'}`}>
      {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : <span className="text-white font-semibold">{index + 1}</span>}
    </div>
  );
}

// Validation Criteria List
interface ValidationCriteriaProps {
  readonly criteria: string[];
  readonly validationResult?: ValidationResult;
}

export function ValidationCriteria({ criteria, validationResult }: ValidationCriteriaProps) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-slate-400 mb-1">Validation Criteria:</div>
      {criteria.map((c: string) => {
        const isPassed = validationResult?.passedCriteria.includes(c);
        const isFailed = validationResult?.failedCriteria.includes(c);
        let textColorClass: string;
        if (isPassed) {
          textColorClass = 'text-green-400';
        } else if (isFailed) {
          textColorClass = 'text-red-400';
        } else {
          textColorClass = 'text-slate-300';
        }
        return (
          <div key={c} className={`flex items-center gap-2 text-sm ${textColorClass}`}>
            {isPassed && <CheckCircle className="w-4 h-4" />}
            {isFailed && <XCircle className="w-4 h-4" />}
            {!isPassed && !isFailed && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
            {c}
          </div>
        );
      })}
    </div>
  );
}

// Hint Button
interface HintButtonProps {
  readonly onClick: () => void;
}

export function HintButton({ onClick }: HintButtonProps) {
  return (
    <button onClick={onClick} className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1">
      <Lightbulb className="w-4 h-4" />Hint
    </button>
  );
}

// Step Input Area
interface StepInputProps {
  readonly input: string;
  readonly validating: boolean;
  readonly onInputChange: (value: string) => void;
  readonly onValidate: () => void;
  readonly onComplete: () => void;
}

export function StepInput({ input, validating, onInputChange, onValidate, onComplete }: StepInputProps) {
  return (
    <div className="mt-4 space-y-3">
      <div>
        <label htmlFor="step-input" className="block text-sm text-slate-400 mb-2">Describe what you did or paste relevant output:</label>
        <textarea id="step-input" value={input} onChange={(e) => onInputChange(e.target.value)}
          placeholder='Example: Created Dockerfile with FROM node:18-alpine, COPY . ., RUN npm install, EXPOSE 3000, CMD npm start'
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]" />
      </div>
      <div className="flex gap-3">
        <button onClick={onValidate} disabled={validating || !input.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
          {validating ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Validating...</>) : (<><Target className="w-4 h-4" />Validate Step</>)}
        </button>
        <button onClick={onComplete} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">Skip Validation</button>
      </div>
    </div>
  );
}

// Validation Feedback
interface ValidationFeedbackProps {
  readonly result: ValidationResult;
}

export function ValidationFeedback({ result }: ValidationFeedbackProps) {
  return (
    <div className={`rounded-lg p-4 border-2 ${result.passed ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
      <div className={`flex items-center gap-2 mb-2 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
        {result.passed ? (<><CheckCircle className="w-5 h-5" /><span className="font-semibold">Step Validated!</span></>) : (<><AlertCircle className="w-5 h-5" /><span className="font-semibold">Validation Failed</span></>)}
      </div>
      {result.specificErrors.length > 0 && (
        <div className="mt-3 space-y-1">
          <div className="text-sm text-red-300 font-semibold">Issues Found:</div>
          {result.specificErrors.map((error: string) => (<div key={error} className="text-sm text-red-200 flex items-start gap-2"><XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{error}</div>))}
        </div>
      )}
      {result.suggestions.length > 0 && (
        <div className="mt-3 space-y-1">
          <div className="text-sm text-yellow-300 font-semibold">Suggestions:</div>
          {result.suggestions.map((s: string) => (<div key={s} className="text-sm text-yellow-200 flex items-start gap-2"><Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />{s}</div>))}
        </div>
      )}
      {result.passed && <div className="mt-3 text-sm text-green-300">All criteria met! This step is now complete.</div>}
    </div>
  );
}

// Hints Panel
interface HintsPanelProps {
  readonly hints: string[];
}

export function HintsPanel({ hints }: HintsPanelProps) {
  return (
    <div className="mt-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
      <div className="flex items-center gap-2 text-yellow-400 mb-2"><Lightbulb className="w-4 h-4" /><span className="font-semibold text-sm">Hints</span></div>
      <div className="space-y-2">{hints.map((hint: string, idx: number) => (<div key={hint} className="text-sm text-slate-300">{idx + 1}. {hint}</div>))}</div>
    </div>
  );
}
