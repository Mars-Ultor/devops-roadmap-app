/**
 * FailureLogForm - Capture failure details with context
 * Military-style incident reporting for learning
 */

import { useState } from "react";
import type {
  FailureLog,
  FailureCategory,
  FailureSeverity,
} from "../../types/training";
import {
  FormHeader,
  ContextInfo,
  CategorySeveritySection,
  TitleInput,
  DescriptionInput,
  ErrorMessageInput,
  ProTipBox,
  ActionButtons,
} from "./FailureLogFormComponents";

interface FailureLogFormProps {
  contentId: string;
  contentType: "lesson" | "lab" | "drill" | "project";
  contentTitle: string;
  onSubmit: (
    failureData: Omit<
      FailureLog,
      "id" | "userId" | "timestamp" | "isRecurring" | "previousOccurrences"
    >,
  ) => Promise<void>;
  onCancel: () => void;
  prefilledError?: string; // Auto-fill from validation errors
}

export default function FailureLogForm({
  contentId,
  contentType,
  contentTitle,
  onSubmit,
  onCancel,
  prefilledError,
}: FailureLogFormProps) {
  const [category, setCategory] = useState<FailureCategory>("other");
  const [severity, setSeverity] = useState<FailureSeverity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState(prefilledError || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill in title and description");
      return;
    }

    setSubmitting(true);
    try {
      const failureData: Omit<
        FailureLog,
        "id" | "userId" | "timestamp" | "isRecurring" | "previousOccurrences"
      > = {
        contentType,
        contentId,
        contentTitle,
        category,
        severity,
        title: title.trim(),
        description: description.trim(),
        errorMessage: errorMessage.trim() || undefined,
        lessonsLearned: [],
        relatedConcepts: [],
      };

      await onSubmit(failureData);
    } catch (error) {
      console.error("Error submitting failure log:", error);
      alert("Failed to log failure. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border-2 border-red-500/50 max-w-2xl w-full my-8">
        <FormHeader onCancel={onCancel} />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <ContextInfo contentType={contentType} contentTitle={contentTitle} />

          <CategorySeveritySection
            category={category}
            severity={severity}
            onCategoryChange={setCategory}
            onSeverityChange={setSeverity}
          />

          <TitleInput value={title} onChange={setTitle} />
          <DescriptionInput value={description} onChange={setDescription} />
          <ErrorMessageInput value={errorMessage} onChange={setErrorMessage} />

          <ProTipBox />

          <ActionButtons
            onCancel={onCancel}
            submitting={submitting}
            canSubmit={!!title.trim() && !!description.trim()}
          />
        </form>
      </div>
    </div>
  );
}
