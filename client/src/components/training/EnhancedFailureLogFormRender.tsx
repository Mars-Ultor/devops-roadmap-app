/**
 * Enhanced Failure Log Form Render Component
 * Extracted render logic from EnhancedFailureLogForm
 * For ESLint compliance (max-lines-per-function)
 */

import { wordCount } from "./EnhancedFailureLogFormUtils";
import type { FailureCategory, FailureSeverity } from "../../types/training";
import {
  FormHeader,
  PatternAlert,
  ContextInfo,
  CategorySeveritySelector,
  WhatTriedSection,
  RootCauseSection,
  RunbookDisplay,
  FormActions,
  TitleField,
  DescriptionField,
  ErrorMessageField,
} from "./EnhancedFailureLogFormComponents";

interface FormRenderProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  contentType: string;
  contentTitle: string;
  category: string;
  severity: string;
  title: string;
  description: string;
  errorMessage: string;
  whatTried: string[];
  rootCause: string;
  patternDetection: PatternDetection | null;
  validation: ValidationState;
  generatedRunbook: string;
  runbookCopied: boolean;
  submitting: boolean;
  onCategoryChange: (category: FailureCategory) => void;
  onSeverityChange: (severity: FailureSeverity) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onErrorMessageChange: (errorMessage: string) => void;
  onWhatTriedChange: (index: number, value: string) => void;
  onWhatTriedAdd: () => void;
  onRootCauseChange: (rootCause: string) => void;
  onCopyRunbook: () => void;
}

export function EnhancedFailureLogFormRender({
  onSubmit,
  onCancel,
  contentType,
  contentTitle,
  category,
  severity,
  title,
  description,
  errorMessage,
  whatTried,
  rootCause,
  patternDetection,
  validation,
  generatedRunbook,
  runbookCopied,
  submitting,
  onCategoryChange,
  onSeverityChange,
  onTitleChange,
  onDescriptionChange,
  onErrorMessageChange,
  onWhatTriedChange,
  onWhatTriedAdd,
  onRootCauseChange,
  onCopyRunbook,
}: FormRenderProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border-2 border-red-500/50 max-w-4xl w-full my-8">
        <FormHeader onCancel={onCancel} />
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {patternDetection && <PatternAlert pattern={patternDetection} />}
          <ContextInfo contentType={contentType} contentTitle={contentTitle} />
          <CategorySeveritySelector
            category={category}
            severity={severity}
            onCategoryChange={onCategoryChange}
            onSeverityChange={onSeverityChange}
          />
          <TitleField value={title} onChange={onTitleChange} />
          <DescriptionField value={description} onChange={onDescriptionChange} />
          <ErrorMessageField value={errorMessage} onChange={onErrorMessageChange} />
          <WhatTriedSection
            whatTried={whatTried}
            validation={validation}
            onChange={onWhatTriedChange}
            onAdd={onWhatTriedAdd}
          />
          <RootCauseSection
            rootCause={rootCause}
            wordCount={wordCount(rootCause)}
            validation={validation}
            onChange={onRootCauseChange}
          />
          <RunbookDisplay
            runbook={generatedRunbook}
            copied={runbookCopied}
            onCopy={onCopyRunbook}
          />
          <FormActions
            validation={validation}
            submitting={submitting}
            onCancel={onCancel}
          />
        </form>
      </div>
    </div>
  );
}