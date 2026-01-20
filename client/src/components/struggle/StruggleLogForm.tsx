/**
 * StruggleLogForm Component
 * Forces users to document their struggle before accessing hints
 */

import { useState } from "react";
import type { StruggleLog } from "../../types/struggle";

// Import extracted components
import {
  StruggleLogFormHeader,
  ProblemDescriptionField,
  ApproachesTriedField,
  StuckPointField,
  TimeSpentField,
  ConfidenceLevelField,
  LearningPointsField,
  FormErrorsDisplay,
  FormActions,
} from "./struggle-log/StruggleLogFormComponents";

// Import utilities
import {
  type StruggleLogFormData,
  INITIAL_FORM_DATA,
  validateStruggleLogForm,
  isStruggleLogFormValid,
  prepareSubmissionData,
} from "./struggle-log/StruggleLogFormUtils";

interface StruggleLogFormProps {
  onSubmit: (log: Omit<StruggleLog, "id" | "timestamp">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function StruggleLogForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: StruggleLogFormProps) {
  const [formData, setFormData] =
    useState<StruggleLogFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<string[]>([]);

  const updateField = <K extends keyof StruggleLogFormData>(
    key: K,
    value: StruggleLogFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addApproach = () => {
    setFormData((prev) => ({
      ...prev,
      approachesTried: [...prev.approachesTried, ""],
    }));
  };

  const removeApproach = (index: number) => {
    if (formData.approachesTried.length > 1) {
      setFormData((prev) => ({
        ...prev,
        approachesTried: prev.approachesTried.filter((_, i) => i !== index),
      }));
    }
  };

  const updateApproach = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      approachesTried: prev.approachesTried.map((a, i) =>
        i === index ? value : a,
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateStruggleLogForm(formData);
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      onSubmit(prepareSubmissionData(formData));
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 max-w-2xl mx-auto">
      <StruggleLogFormHeader />
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProblemDescriptionField
          value={formData.problemDescription}
          onChange={(v) => updateField("problemDescription", v)}
        />
        <ApproachesTriedField
          approaches={formData.approachesTried}
          onAdd={addApproach}
          onRemove={removeApproach}
          onUpdate={updateApproach}
        />
        <StuckPointField
          value={formData.currentStuckPoint}
          onChange={(v) => updateField("currentStuckPoint", v)}
        />
        <TimeSpentField
          value={formData.timeSpentMinutes}
          onChange={(v) => updateField("timeSpentMinutes", v)}
        />
        <ConfidenceLevelField
          value={formData.confidenceLevel}
          onChange={(v) => updateField("confidenceLevel", v)}
        />
        <LearningPointsField
          value={formData.learningPoints}
          onChange={(v) => updateField("learningPoints", v)}
        />
        <FormErrorsDisplay errors={errors} />
        <FormActions
          onCancel={onCancel}
          isValid={isStruggleLogFormValid(formData)}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
}
