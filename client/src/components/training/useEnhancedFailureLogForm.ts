/**
 * Enhanced Failure Log Form Hooks
 * Extracted useEffect logic from EnhancedFailureLogForm
 * For ESLint compliance (max-lines-per-function)
 */

import { useState, useEffect } from "react";
import type { FailureCategory, FailureSeverity } from "../../types/training";
import { MOCK_PATTERNS, type PatternDetection, type ValidationState } from "./EnhancedFailureLogFormUtils";
import {
  validateForm,
  detectPattern,
  generateRunbookIfValid,
} from "./EnhancedFailureLogFormLogic";

interface FormData {
  category: FailureCategory;
  severity: FailureSeverity;
  title: string;
  description: string;
  errorMessage: string;
  whatTried: string[];
  rootCause: string;
}

export function useEnhancedFailureLogFormLogic(
  initialErrorMessage: string = ""
) {
  const [category, setCategory] = useState<FailureCategory>("other");
  const [severity, setSeverity] = useState<FailureSeverity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);
  const [whatTried, setWhatTried] = useState<string[]>(["", "", ""]);
  const [rootCause, setRootCause] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    whatTried: false,
    rootCause: false,
    isValid: false,
  });
  const [patternDetection, setPatternDetection] =
    useState<PatternDetection | null>(null);
  const [generatedRunbook, setGeneratedRunbook] = useState<string>("");
  const [runbookCopied, setRunbookCopied] = useState(false);

  // Phase 9: Validate mandatory fields
  useEffect(() => {
    const newValidation = validateForm(whatTried, rootCause, title);
    setValidation(newValidation);
  }, [whatTried, rootCause, title]);

  // Phase 9: Pattern detection
  useEffect(() => {
    const pattern = detectPattern(category, errorMessage, MOCK_PATTERNS);
    setPatternDetection(pattern);
  }, [category, errorMessage]);

  // Phase 9: Auto-generate runbook
  useEffect(() => {
    const runbook = generateRunbookIfValid(validation, category, {
      category,
      severity,
      title,
      description,
      errorMessage,
      whatTried,
      rootCause,
    });
    setGeneratedRunbook(runbook);
  }, [
    validation,
    category,
    whatTried,
    rootCause,
    title,
    description,
    errorMessage,
    severity,
  ]);

  const formData: FormData = {
    category,
    severity,
    title,
    description,
    errorMessage,
    whatTried,
    rootCause,
  };

  return {
    // State
    category,
    severity,
    title,
    description,
    errorMessage,
    whatTried,
    rootCause,
    submitting,
    validation,
    patternDetection,
    generatedRunbook,
    runbookCopied,
    formData,

    // Setters
    setCategory,
    setSeverity,
    setTitle,
    setDescription,
    setErrorMessage,
    setWhatTried,
    setRootCause,
    setSubmitting,
    setRunbookCopied,
  };
}