/**
 * Enhanced Failure Log Form
 * Phase 9: Mandatory fields, pattern recognition, runbook generation
 * Refactored to use extracted components for ESLint compliance
 */

import type {
  FailureLog,
} from "../../types/training";
import {
  copyRunbookToClipboard,
  handleWhatTriedChange as updateWhatTried,
  submitFailureLog,
} from "./EnhancedFailureLogFormLogic";
import { useEnhancedFailureLogFormLogic } from "./useEnhancedFailureLogForm";
import { EnhancedFailureLogFormRender } from "./EnhancedFailureLogFormRender";

interface EnhancedFailureLogFormProps {
  contentId: string;
  contentType: "lesson" | "lab" | "drill" | "project";
  contentTitle: string;
  onSubmit: (
    failureData: Omit<
      FailureLog,
      "id" | "userId" | "timestamp" | "isRecurring" | "previousOccurrences"
    >,
  ) => Promise<void>;
  onCancel?: () => void;
  prefilledError?: string;
}

export default function EnhancedFailureLogForm({
  contentId,
  contentType,
  contentTitle,
  onSubmit,
  onCancel,
  prefilledError,
}: EnhancedFailureLogFormProps) {
  const {
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
    setCategory,
    setSeverity,
    setTitle,
    setDescription,
    setErrorMessage,
    setWhatTried,
    setRootCause,
    setSubmitting,
    setRunbookCopied,
  } = useEnhancedFailureLogFormLogic(prefilledError);

  const copyRunbook = () => {
    copyRunbookToClipboard(generatedRunbook, setRunbookCopied);
  };

  const handleWhatTriedChange = (index: number, value: string) => {
    updateWhatTried(index, value, whatTried, setWhatTried);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFailureLog(
      validation,
      formData,
      { contentType, contentId, contentTitle },
      onSubmit,
      setSubmitting
    );
  };

  const handleWhatTriedAdd = () => setWhatTried([...whatTried, ""]);

  return (
    <EnhancedFailureLogFormRender
      onSubmit={handleSubmit}
      onCancel={onCancel}
      contentType={contentType}
      contentTitle={contentTitle}
      category={category}
      severity={severity}
      title={title}
      description={description}
      errorMessage={errorMessage}
      whatTried={whatTried}
      rootCause={rootCause}
      patternDetection={patternDetection}
      validation={validation}
      generatedRunbook={generatedRunbook}
      runbookCopied={runbookCopied}
      submitting={submitting}
      onCategoryChange={setCategory}
      onSeverityChange={setSeverity}
      onTitleChange={setTitle}
      onDescriptionChange={setDescription}
      onErrorMessageChange={setErrorMessage}
      onWhatTriedChange={handleWhatTriedChange}
      onWhatTriedAdd={handleWhatTriedAdd}
      onRootCauseChange={setRootCause}
      onCopyRunbook={copyRunbook}
    />
  );
}
