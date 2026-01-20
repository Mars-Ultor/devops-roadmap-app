/**
 * Step Validation Item Component
 * Extracted from StepValidation for ESLint compliance
 */

import {
  StepStatusIcon,
  RunValidationButton,
  StepProgressBar,
  ValidationRuleItem,
  type LabStep,
} from "./StepValidationComponents";
import {
  getStepStatusColor,
  getValidationStatus,
} from "./StepValidationUtils";
import type { ValidationResult } from "./StepValidation";

interface StepValidationItemProps {
  step: LabStep;
  runningValidations: Set<string>;
  validationResults: Map<string, ValidationResult>;
  onRunAllValidations: (step: LabStep) => void;
}

export function StepValidationItem({
  step,
  runningValidations,
  validationResults,
  onRunAllValidations,
}: StepValidationItemProps) {
  const isLocked = step.status === "locked";
  const canRun = step.status !== "locked";

  return (
    <div
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
            onClick={() => onRunAllValidations(step)}
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
}