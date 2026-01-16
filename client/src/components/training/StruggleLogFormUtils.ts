/**
 * StruggleLogForm - Utility functions and constants
 */

export const MIN_ATTEMPT_LENGTH = 10;
export const MIN_ATTEMPTS_COUNT = 3;
export const MAX_ATTEMPTS = 5;
export const MIN_STUCK_LOCATION_LENGTH = 20;
export const MIN_HYPOTHESIS_LENGTH = 30;

export interface FormValidation {
  validAttempts: boolean;
  validLocation: boolean;
  validHypothesis: boolean;
  isValid: boolean;
}

export const validateStruggleLogForm = (
  attemptedSolutions: string[],
  stuckLocation: string,
  hypothesis: string
): FormValidation => {
  const validAttempts = attemptedSolutions.filter(a => a.trim().length >= MIN_ATTEMPT_LENGTH).length >= MIN_ATTEMPTS_COUNT;
  const validLocation = stuckLocation.trim().length >= MIN_STUCK_LOCATION_LENGTH;
  const validHypothesis = hypothesis.trim().length >= MIN_HYPOTHESIS_LENGTH;
  
  return {
    validAttempts,
    validLocation,
    validHypothesis,
    isValid: validAttempts && validLocation && validHypothesis
  };
};
