/**
 * FailureResolutionForm - Utility functions
 */

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};

export const MIN_LESSONS = 2;
