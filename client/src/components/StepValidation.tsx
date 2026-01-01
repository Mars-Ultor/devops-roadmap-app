import { useState } from 'react';
import { CheckCircle, XCircle, Play, AlertCircle, Loader, Lock } from 'lucide-react';
import { ValidationService, type ValidationRule } from '../services/validationService';

export type { ValidationRule };

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

interface StepValidationProps {
  steps: LabStep[];
  onStepComplete: (stepNumber: number) => void;
  onValidationRun?: (stepNumber: number, rule: ValidationRule) => Promise<boolean>;
}

export default function StepValidation({ steps, onStepComplete, onValidationRun }: StepValidationProps) {
  const [runningValidations, setRunningValidations] = useState<Set<string>>(new Set());
  const [validationResults, setValidationResults] = useState<Map<string, ValidationResult>>(new Map());

  const runValidation = async (stepNumber: number, rule: ValidationRule, ruleIndex: number) => {
    const validationKey = `${stepNumber}-${ruleIndex}`;
    setRunningValidations(prev => new Set(prev).add(validationKey));

    try {
      // Use custom validation function if provided, otherwise use ValidationService
      let success: boolean;
      let message: string;

      if (onValidationRun) {
        success = await onValidationRun(stepNumber, rule);
        message = success ? 'Validation passed' : 'Validation failed';
      } else {
        const result = await ValidationService.runValidation(rule);
        success = result.success;
        message = result.message;
      }

      // Store validation result
      setValidationResults(prev => new Map(prev).set(validationKey, {
        success,
        message,
        timestamp: new Date()
      }));

      return success;
    } catch (error) {
      console.error('Validation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setValidationResults(prev => new Map(prev).set(validationKey, {
        success: false,
        message: `❌ Error: ${errorMessage}`,
        timestamp: new Date()
      }));
      return false;
    } finally {
      setRunningValidations(prev => {
        const newSet = new Set(prev);
        newSet.delete(validationKey);
        return newSet;
      });
    }
  };

  const runAllValidationsForStep = async (step: LabStep) => {
    let passedCount = 0;

    for (let i = 0; i < step.validations.length; i++) {
      const rule = step.validations[i];
      const success = await runValidation(step.number, rule, i);
      if (success) passedCount++;
    }

    // If all validations pass, mark step as completed
    if (passedCount === step.validations.length) {
      onStepComplete(step.number);
    }
  };

  const getValidationIcon = (stepNumber: number, ruleIndex: number, isRunning: boolean) => {
    if (isRunning) {
      return <Loader className="w-4 h-4 text-blue-400 animate-spin" />;
    }

    const validationKey = `${stepNumber}-${ruleIndex}`;
    const result = validationResults.get(validationKey);

    if (!result) {
      return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }

    return result.success 
      ? <CheckCircle className="w-4 h-4 text-green-400" />
      : <XCircle className="w-4 h-4 text-red-400" />;
  };

  const getValidationStatus = (stepNumber: number, ruleIndex: number, isLocked: boolean): string => {
    if (isLocked) return 'Locked';

    const validationKey = `${stepNumber}-${ruleIndex}`;
    const result = validationResults.get(validationKey);

    if (!result) return 'Pending';
    return result.success ? 'Passed' : 'Failed';
  };

  const getStepStatusColor = (step: LabStep) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-500 bg-green-900/20';
      case 'in_progress':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'locked':
        return 'border-gray-600 bg-gray-900/20';
      default:
        return 'border-slate-600 bg-slate-800/50';
    }
  };

  const canRunValidations = (step: LabStep) => {
    if (step.status === 'locked') return false;
    if (step.status === 'completed') return true;
    return true; // Can run validations for in_progress steps
  };

  return (
    <div className="space-y-6">
      {steps.map((step) => {
        const isLocked = step.status === 'locked';
        const canRun = canRunValidations(step);

        return (
          <div
            key={step.number}
            className={`border-2 rounded-lg p-6 transition-all duration-300 ${getStepStatusColor(step)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {step.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : step.status === 'locked' ? (
                  <Lock className="w-6 h-6 text-gray-500" />
                ) : (
                  <Play className="w-6 h-6 text-yellow-400" />
                )}
                <div>
                  <h3 className={`text-lg font-semibold ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                    Step {step.number}: {step.title}
                  </h3>
                  {step.description && (
                    <p className={`text-sm ${isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {canRun && (
                <button
                  onClick={() => runAllValidationsForStep(step)}
                  disabled={runningValidations.size > 0 || step.status === 'completed'}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
                >
                  {runningValidations.size > 0 ? 'Running...' : step.status === 'completed' ? 'Completed ✅' : 'Run Validation'}
                </button>
              )}
            </div>

            {/* Validation Rules */}
            <div className="space-y-3">
              <h4 className={`text-sm font-medium uppercase tracking-wide ${isLocked ? 'text-gray-600' : 'text-indigo-300'}`}>
                Validation Checks ({step.completedValidations}/{step.validations.length})
              </h4>

              {step.validations.map((rule, index) => {
                const validationKey = `${step.number}-${index}`;
                const isRunning = runningValidations.has(validationKey);
                const result = validationResults.get(validationKey);
                const statusText = getValidationStatus(step.number, index, isLocked);

                return (
                  <div
                    key={index}
                    className={`flex items-start justify-between p-3 rounded-lg border ${
                      isLocked
                        ? 'border-gray-700 bg-gray-900/50'
                        : result?.success
                        ? 'border-green-600 bg-green-900/20'
                        : result?.success === false
                        ? 'border-red-600 bg-red-900/20'
                        : 'border-slate-600 bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      {getValidationIcon(step.number, index, isRunning)}
                      <div className="flex-1">
                        <div className={`font-medium ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                          {rule.type.replace(/_/g, ' ').toUpperCase()}
                        </div>
                        <div className={`text-sm ${isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {rule.target || rule.cmd || rule.pattern || 'Check condition'}
                        </div>
                        {result?.message && !isLocked && (
                          <div className={`text-xs mt-1 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                            {result.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`text-sm font-medium ml-3 ${
                      isLocked ? 'text-gray-500' : 
                      result?.success ? 'text-green-400' : 
                      result?.success === false ? 'text-red-400' : 
                      'text-gray-400'
                    }`}>
                      {statusText}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Indicator */}
            {step.validations.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{step.completedValidations}/{step.validations.length} checks passed</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(step.completedValidations / step.validations.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}