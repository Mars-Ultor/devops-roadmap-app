/**
 * StruggleLogFormUtils - Utility functions and helpers for StruggleLogForm
 */

import { STRUGGLE_SESSION_CONFIG } from '../../../types/struggle';
import type { StruggleLog } from '../../../types/struggle';

// ============================================================================
// Form Data Interface and Initial State
// ============================================================================

export interface StruggleLogFormData {
  problemDescription: string;
  approachesTried: string[];
  currentStuckPoint: string;
  timeSpentMinutes: number;
  confidenceLevel: 1 | 2 | 3 | 4 | 5;
  learningPoints: string;
}

export const INITIAL_FORM_DATA: StruggleLogFormData = {
  problemDescription: '',
  approachesTried: [''],
  currentStuckPoint: '',
  timeSpentMinutes: STRUGGLE_SESSION_CONFIG.MIN_STRUGGLE_TIME_MINUTES,
  confidenceLevel: 1,
  learningPoints: ''
};

// ============================================================================
// Validation Functions
// ============================================================================

export function validateStruggleLogForm(formData: StruggleLogFormData): string[] {
  const errors: string[] = [];
  const { MIN_APPROACHES_REQUIRED, MIN_STRUGGLE_TIME_MINUTES } = STRUGGLE_SESSION_CONFIG;

  if (!formData.problemDescription.trim()) {
    errors.push('Problem description is required');
  }
  const validApproaches = formData.approachesTried.filter(a => a.trim());
  if (validApproaches.length < MIN_APPROACHES_REQUIRED) {
    errors.push(`At least ${MIN_APPROACHES_REQUIRED} different approaches must be documented`);
  }
  if (!formData.currentStuckPoint.trim()) {
    errors.push('Current stuck point must be described');
  }
  if (formData.timeSpentMinutes < MIN_STRUGGLE_TIME_MINUTES) {
    errors.push(`Minimum ${MIN_STRUGGLE_TIME_MINUTES} minutes of struggle required`);
  }

  return errors;
}

export function isStruggleLogFormValid(formData: StruggleLogFormData): boolean {
  const { MIN_APPROACHES_REQUIRED, MIN_STRUGGLE_TIME_MINUTES } = STRUGGLE_SESSION_CONFIG;
  return (
    !!formData.problemDescription.trim() &&
    formData.approachesTried.filter(a => a.trim()).length >= MIN_APPROACHES_REQUIRED &&
    !!formData.currentStuckPoint.trim() &&
    formData.timeSpentMinutes >= MIN_STRUGGLE_TIME_MINUTES
  );
}

// ============================================================================
// Submission Helper
// ============================================================================

export function prepareSubmissionData(formData: StruggleLogFormData): Omit<StruggleLog, 'id' | 'timestamp'> {
  const validApproaches = formData.approachesTried.filter(a => a.trim());
  return {
    problemDescription: formData.problemDescription.trim(),
    approachesTried: validApproaches,
    currentStuckPoint: formData.currentStuckPoint.trim(),
    timeSpentMinutes: formData.timeSpentMinutes,
    confidenceLevel: formData.confidenceLevel,
    learningPoints: formData.learningPoints.trim() || undefined
  };
}
