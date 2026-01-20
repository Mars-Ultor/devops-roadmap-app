import { useState } from "react";
import {
  ValidationService,
  type ValidationRule,
} from "../services/validationService";
import {
  StepStatusIcon,
  RunValidationButton,
  StepProgressBar,
  ValidationRuleItem,
  type LabStep,
} from "./step-validation/StepValidationComponents";
import {
  getStepStatusColor,
  getValidationStatus,
} from "./step-validation/StepValidationUtils";

export type { ValidationRule } from "../services/validationService";
export type { LabStep } from "./step-validation/StepValidationComponents";

interface ValidationResult {
  success: boolean;
  message: string;
  timestamp: Date;
}

interface StepValidationProps {
  readonly steps: LabStep[];
  readonly onStepComplete: (stepNumber: number) => void;
  readonly onValidationRun?: (
    stepNumber: number,
    rule: ValidationRule,
  ) => Promise<boolean>;
}

export default function StepValidation({
  steps,
  onStepComplete,
  onValidationRun,
}: StepValidationProps) {
  const [runningValidations, setRunningValidations] = useState<Set<string>>(
    new Set(),
  );
  const [validationResults, setValidationResults] = useState<
    Map<string, ValidationResult>
  >(new Map());

  const runValidation = async (
    stepNumber: number,
    rule: ValidationRule,
    ruleIndex: number,
  ) => {
    const validationKey = `${stepNumber}-${ruleIndex}`;
    setRunningValidations((prev) => new Set(prev).add(validationKey));
    try {
      let success: boolean, message: string;
      if (onValidationRun) {
        success = await onValidationRun(stepNumber, rule);
        message = success ? "Validation passed" : "Validation failed";
      } else {
        const result = await ValidationService.runValidation(rule);
        success = result.success;
        message = result.message;
      }
      setValidationResults((prev) =>
        new Map(prev).set(validationKey, {
          success,
          message,
          timestamp: new Date(),
        }),
      );
      return success;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setValidationResults((prev) =>
        new Map(prev).set(validationKey, {
          success: false,
          message: `❌ Error: ${errorMessage}`,
          timestamp: new Date(),
        }),
      );
      return false;
    } finally {
      setRunningValidations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(validationKey);
        return newSet;
      });
    }
  };

  const runAllValidationsForStep = async (step: LabStep) => {
    let passedCount = 0;
    for (let i = 0; i < step.validations.length; i++) {
      if (await runValidation(step.number, step.validations[i], i))
        passedCount++;
    }
    if (passedCount === step.validations.length) onStepComplete(step.number);
  };

  return (
    <div className="space-y-6">
      {steps.map((step) => {
        const isLocked = step.status === "locked";
        const canRun = step.status !== "locked";
        return (
          <div
            key={step.number}
            className={`border-2 rounded-lg p-6 transition-all duration-300 ${getStepStatusColor(step.status)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <StepStatusIcon status={step.status} />
                <div>
                  <h3
                    className={`text-lg font-semibold ${isLocked ? "text-gray-500" : "text-white"}`}
                  >
                    Step {step.number}: {step.title}
                  </h3>
                  {step.description && (
                    <p
                      className={`text-sm ${isLocked ? "text-gray-600" : "text-gray-400"}`}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {canRun && (
                <RunValidationButton
                  isRunning={runningValidations.size > 0}
                  isCompleted={step.status === "completed"}
                  onClick={() => runAllValidationsForStep(step)}
                />
              )}
            </div>
            <div className="space-y-3">
              <h4
                className={`text-sm font-medium uppercase tracking-wide ${isLocked ? "text-gray-600" : "text-indigo-300"}`}
              >
                Validation Checks ({step.completedValidations}/
                {step.validations.length})
              </h4>
              {step.validations.map((rule, index) => {
                const validationKey = `${step.number}-${index}`;
                const isRunning = runningValidations.has(validationKey);
                const result = validationResults.get(validationKey);
                return (
                  <ValidationRuleItem
                    key={validationKey}
                    rule={rule}
                    isLocked={isLocked}
                    isRunning={isRunning}
                    result={result}
                    statusText={getValidationStatus(result, isLocked)}
                  />
                );
              })}
            </div>
            {step.validations.length > 0 && (
              <StepProgressBar
                completed={step.completedValidations}
                total={step.validations.length}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
