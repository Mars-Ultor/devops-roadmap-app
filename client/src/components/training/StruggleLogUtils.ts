/**
 * StruggleLog - Utility functions and types
 */

export interface StruggleEntry {
  timestamp: Date;
  whatTried: string[];
  whereStuck: string;
  suspectedProblem: string;
  hintsUsed: number;
}

export interface FormState {
  whatTried: string[];
  whereStuck: string;
  suspectedProblem: string;
  errors: string[];
}

export const INITIAL_FORM_STATE: FormState = {
  whatTried: ["", "", ""],
  whereStuck: "",
  suspectedProblem: "",
  errors: [],
};

export const MIN_WHAT_TRIED = 3;
export const MIN_WHERE_STUCK_LENGTH = 20;
export const MIN_SUSPECTED_PROBLEM_LENGTH = 15;

export const validateForm = (state: FormState): string[] => {
  const newErrors: string[] = [];

  // Validate whatTried (minimum 3 non-empty entries)
  const validTries = state.whatTried.filter((t) => t.trim().length > 0);
  if (validTries.length < MIN_WHAT_TRIED) {
    newErrors.push("You must document at least 3 things you've tried");
  }

  // Validate whereStuck
  if (state.whereStuck.trim().length < MIN_WHERE_STUCK_LENGTH) {
    newErrors.push(
      "Please describe specifically where you're stuck (minimum 20 characters)",
    );
  }

  // Validate suspectedProblem
  if (state.suspectedProblem.trim().length < MIN_SUSPECTED_PROBLEM_LENGTH) {
    newErrors.push(
      "Please describe what you think the problem might be (minimum 15 characters)",
    );
  }

  return newErrors;
};

export const createEntry = (state: FormState): StruggleEntry => ({
  timestamp: new Date(),
  whatTried: state.whatTried.filter((t) => t.trim().length > 0),
  whereStuck: state.whereStuck.trim(),
  suspectedProblem: state.suspectedProblem.trim(),
  hintsUsed: 0,
});

export const ATTEMPT_PLACEHOLDERS = [
  "Checked pod logs with kubectl logs",
  "Verified service selector matches pod labels",
  "Tested connectivity with curl from another pod",
];
