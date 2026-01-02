/**
 * StepValidator - Automated validation with real-time feedback
 * Displays checkmarks/X marks for each validation criterion
 */

import { type FC, useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react';

export interface ValidationCriterion {
  id: string;
  description: string;
  checkFunction: () => Promise<boolean>;
  errorHint?: string;
}

interface StepValidatorProps {
  stepNumber: number;
  stepDescription: string;
  criteria: ValidationCriterion[];
  onValidationComplete: (passed: boolean, attemptNumber: number) => void;
  autoValidate?: boolean;
}

export const StepValidator: FC<StepValidatorProps> = ({
  stepNumber,
  stepDescription,
  criteria,
  onValidationComplete,
  autoValidate = false
}) => {
  const [validationState, setValidationState] = useState<Record<string, 'pending' | 'checking' | 'passed' | 'failed'>>({});
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Initialize all criteria as pending
    const initialState: Record<string, 'pending' | 'checking' | 'passed' | 'failed'> = {};
    criteria.forEach(criterion => {
      initialState[criterion.id] = 'pending';
    });
    setValidationState(initialState);
  }, [criteria]);

  useEffect(() => {
    if (autoValidate && !isValidating) {
      runValidation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoValidate]);

  const runValidation = async () => {
    setIsValidating(true);
    let allPassed = true;

    // Validate each criterion sequentially
    for (const criterion of criteria) {
      setValidationState(prev => ({ ...prev, [criterion.id]: 'checking' }));
      
      try {
        const passed = await criterion.checkFunction();
        setValidationState(prev => ({ ...prev, [criterion.id]: passed ? 'passed' : 'failed' }));
        
        if (!passed) {
          allPassed = false;
        }
        
        // Small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`Validation error for ${criterion.id}:`, error);
        setValidationState(prev => ({ ...prev, [criterion.id]: 'failed' }));
        allPassed = false;
      }
    }

    setIsValidating(false);
    onValidationComplete(allPassed, attemptNumber);
    
    if (!allPassed) {
      setAttemptNumber(prev => prev + 1);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'checking':
        return <Loader className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-slate-600" />;
    }
  };

  const allPassed = criteria.every(c => validationState[c.id] === 'passed');
  const anyFailed = criteria.some(c => validationState[c.id] === 'failed');

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            Step {stepNumber} Validation
            {allPassed && <CheckCircle className="w-5 h-5 text-emerald-400" />}
          </h3>
          <p className="text-sm text-slate-400 mt-1">{stepDescription}</p>
        </div>
        {attemptNumber > 1 && (
          <div className="text-sm text-slate-400">
            Attempt #{attemptNumber}
          </div>
        )}
      </div>

      {/* Validation Criteria */}
      <div className="space-y-3">
        {criteria.map(criterion => (
          <div
            key={criterion.id}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
              validationState[criterion.id] === 'passed'
                ? 'bg-emerald-900/20 border border-emerald-500/30'
                : validationState[criterion.id] === 'failed'
                ? 'bg-red-900/20 border border-red-500/30'
                : 'bg-slate-900/50 border border-slate-700'
            }`}
          >
            {getStatusIcon(validationState[criterion.id])}
            <div className="flex-1">
              <p className="text-sm text-white">{criterion.description}</p>
              {validationState[criterion.id] === 'failed' && criterion.errorHint && (
                <div className="mt-2 flex items-start gap-2 text-xs text-red-300">
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{criterion.errorHint}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <div className="text-sm text-slate-400">
          {allPassed && '✓ All checks passed'}
          {anyFailed && !isValidating && '✗ Some checks failed - review and retry'}
          {isValidating && 'Validating...'}
        </div>
        <button
          onClick={runValidation}
          disabled={isValidating || allPassed}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            allPassed
              ? 'bg-emerald-600 text-white cursor-not-allowed opacity-50'
              : isValidating
              ? 'bg-blue-600 text-white cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isValidating ? 'Validating...' : allPassed ? 'Validated ✓' : 'Run Validation'}
        </button>
      </div>

      {/* Next Step Blocker */}
      {!allPassed && attemptNumber > 1 && (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
          <p className="text-sm text-amber-300">
            <strong>Next step is locked.</strong> Fix the failed checks above before proceeding.
          </p>
        </div>
      )}
    </div>
  );
};
