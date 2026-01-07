/**
 * Automated Step Validation Utilities
 * Real-time validation for battle drill steps
 */

import type { BattleDrillStep } from '../types/training';
import { validateCriterionWithHelpers } from './validationHelpers';

export interface ValidationResult {
  passed: boolean;
  passedCriteria: string[];
  failedCriteria: string[];
  specificErrors: string[];
  suggestions: string[];
}

/**
 * Validate a step based on user input and criteria
 */
export async function validateStep(
  step: BattleDrillStep,
  userInput: string
): Promise<ValidationResult> {
  const result: ValidationResult = {
    passed: false,
    passedCriteria: [],
    failedCriteria: [],
    specificErrors: [],
    suggestions: []
  };

  // Run validators for each criterion
  for (const criterion of step.validationCriteria) {
    const validation = validateCriterionWithHelpers(criterion, userInput);
    
    if (validation.passed) {
      result.passedCriteria.push(criterion);
    } else {
      result.failedCriteria.push(criterion);
      if (validation.error) {
        result.specificErrors.push(validation.error);
      }
      if (validation.suggestion) {
        result.suggestions.push(validation.suggestion);
      }
    }
  }

  // Step passes only if ALL criteria pass
  result.passed = result.failedCriteria.length === 0;

  return result;
}

/**
 * Validate multiple steps in sequence
 */
export async function validateSteps(
  steps: BattleDrillStep[],
  userInputs: Record<string, string>,
  context?: Record<string, unknown>
): Promise<Record<string, ValidationResult>> {
  const results: Record<string, ValidationResult> = {};

  for (const step of steps) {
    const input = userInputs[step.id] || '';
    results[step.id] = await validateStep(step, input, context);
  }

  return results;
}

/**
 * Check if all steps have passed
 */
export function allStepsPassed(results: Record<string, ValidationResult>): boolean {
  return Object.values(results).every(r => r.passed);
}

/**
 * Get overall completion percentage
 */
export function getCompletionPercentage(results: Record<string, ValidationResult>): number {
  const values = Object.values(results);
  if (values.length === 0) return 0;
  
  const passed = values.filter(r => r.passed).length;
  return Math.round((passed / values.length) * 100);
}

/**
 * Get next failed step (for progressive disclosure)
 */
export function getNextFailedStep(
  steps: BattleDrillStep[],
  results: Record<string, ValidationResult>
): BattleDrillStep | null {
  for (const step of steps) {
    const result = results[step.id];
    if (!result || !result.passed) {
      return step;
    }
  }
  return null;
}
