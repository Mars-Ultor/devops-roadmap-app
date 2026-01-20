/**
 * Enhanced Failure Log Form Utilities
 * Extracted utility functions from EnhancedFailureLogForm component
 * For ESLint compliance (max-lines-per-function)
 */

import type {
  FailureCategory,
  FailureSeverity,
} from "../../types/training";
import {
  generateRunbook,
  wordCount,
  type ValidationState,
  type PatternDetection,
} from "./EnhancedFailureLogFormUtils";

export interface FormData {
  category: FailureCategory;
  severity: FailureSeverity;
  title: string;
  description: string;
  errorMessage: string;
  whatTried: string[];
  rootCause: string;
}

import type { PatternDetection } from "./EnhancedFailureLogFormUtils";

export interface FormState extends FormData {
  submitting: boolean;
  validation: ValidationState;
  patternDetection: PatternDetection | null;
  generatedRunbook: string;
  runbookCopied: boolean;
}

export const validateForm = (
  whatTried: string[],
  rootCause: string,
  title: string
): ValidationState => {
  const validWhatTried =
    whatTried.filter((item) => item.trim().length > 0).length >= 3;
  const validRootCause = wordCount(rootCause) >= 30;
  return {
    whatTried: validWhatTried,
    rootCause: validRootCause,
    isValid: validWhatTried && validRootCause && title.trim().length > 0,
  };
};

export const detectPattern = (
  category: FailureCategory,
  errorMessage: string,
  MOCK_PATTERNS: Record<string, PatternDetection>
) => {
  if (category !== "other" && errorMessage.length > 10) {
    return MOCK_PATTERNS[category] || null;
  }
  return null;
};

export const generateRunbookIfValid = (
  validation: ValidationState,
  category: FailureCategory,
  formData: FormData
): string => {
  if (validation.isValid && category !== "other") {
    return generateRunbook({
      title: formData.title,
      description: formData.description,
      errorMessage: formData.errorMessage,
      rootCause: formData.rootCause,
      whatTried: formData.whatTried,
      category: formData.category,
      severity: formData.severity,
    });
  }
  return "";
};

export const copyRunbookToClipboard = async (
  runbook: string,
  setRunbookCopied: (copied: boolean) => void
) => {
  await navigator.clipboard.writeText(runbook);
  setRunbookCopied(true);
  setTimeout(() => setRunbookCopied(false), 2000);
};

export const handleWhatTriedChange = (
  index: number,
  value: string,
  whatTried: string[],
  setWhatTried: (whatTried: string[]) => void
) => {
  const newWhatTried = [...whatTried];
  newWhatTried[index] = value;
  setWhatTried(newWhatTried);
};

export const submitFailureLog = async (
  validation: ValidationState,
  formData: FormData,
  contentData: {
    contentType: string;
    contentId: string;
    contentTitle: string;
  },
  onSubmit: (data: FormData) => Promise<void>,
  setSubmitting: (submitting: boolean) => void
) => {
  if (!validation.isValid) {
    alert(
      '❌ Please complete all mandatory fields:\n• Title\n• At least 3 "What I Tried" items\n• Root Cause (minimum 30 words)',
    );
    return;
  }

  setSubmitting(true);
  try {
    await onSubmit({
      contentType,
      contentId,
      contentTitle,
      category: formData.category,
      severity: formData.severity,
      title: formData.title.trim(),
      description: formData.description.trim(),
      errorMessage: formData.errorMessage.trim() || undefined,
      lessonsLearned: formData.whatTried.filter((item) => item.trim().length > 0),
      relatedConcepts: [formData.rootCause.trim()],
    });
  } catch (error) {
    console.error("Error submitting failure log:", error);
    alert("Failed to log failure. Please try again.");
  } finally {
    setSubmitting(false);
  }
};