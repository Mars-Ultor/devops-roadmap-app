/**
 * Step Validation Utility Functions
 */

import type { ValidationResult, LabStep } from "../../types";

// Utility functions
export function getStepStatusColor(status: LabStep["status"]): string {
  switch (status) {
    case "completed":
      return "border-green-500 bg-green-900/20";
    case "in_progress":
      return "border-yellow-500 bg-yellow-900/20";
    case "locked":
      return "border-gray-600 bg-gray-900/20";
    default:
      return "border-slate-600 bg-slate-800/50";
  }
}

export function getValidationStatus(
  result?: ValidationResult,
  isLocked?: boolean,
): string {
  if (isLocked) return "Locked";
  if (!result) return "Pending";
  return result.success ? "Passed" : "Failed";
}
