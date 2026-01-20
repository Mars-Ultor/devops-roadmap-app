import { useState } from "react";
import {
  ValidationService,
  type ValidationRule,
} from "../services/validationService";
import { StepValidationItem } from "./step-validation/StepValidationItem";
import type { LabStep } from "./step-validation/StepValidationComponents";

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
      {steps.map((step) => (
        <StepValidationItem
          key={step.number}
          step={step}
          runningValidations={runningValidations}
          validationResults={validationResults}
          onRunAllValidations={runAllValidationsForStep}
        />
      ))}
    </div>
  );
}
