/**
 * ProgressiveHints - Utility functions
 */

export const canRequestLevel = (level: number, requestedHints: number[]): boolean => {
  // Must have requested all previous levels first
  if (level > 1) {
    for (let i = 1; i < level; i++) {
      if (!requestedHints.includes(i)) {
        return false;
      }
    }
  }
  return !requestedHints.includes(level);
};
