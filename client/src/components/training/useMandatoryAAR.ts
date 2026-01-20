/**
 * useMandatoryAAR - Custom hook for MandatoryAARModal state management
 */

import { useState, useEffect } from "react";
import { useAIAAREnhancement } from "../../hooks/useAIAAREnhancement";
import {
  type AARData,
  INITIAL_FORM_DATA,
  validateAARForm,
} from "./MandatoryAARUtils";

interface UseMandatoryAARProps {
  onSubmit: (aar: AARData) => Promise<void>;
  onClose: () => void;
}

export function useMandatoryAAR({ onSubmit, onClose }: UseMandatoryAARProps) {
  const [formData, setFormData] = useState<AARData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const { analyzeResponse } = useAIAAREnhancement();

  // AI validation on relevant field changes
  useEffect(() => {
    const validateWithAI = () => {
      const newAiErrors: Record<string, string> = {};
      const rootCauseAnalysis = analyzeResponse(
        formData.rootCause,
        "what-happened",
      );
      if (rootCauseAnalysis?.isVague) {
        newAiErrors.rootCause =
          rootCauseAnalysis.reason +
          ": " +
          rootCauseAnalysis.suggestedImprovement;
      }
      const learnedAnalysis = analyzeResponse(
        formData.transferableKnowledge,
        "what-learned",
      );
      if (learnedAnalysis?.isVague) {
        newAiErrors.transferableKnowledge =
          learnedAnalysis.reason + ": " + learnedAnalysis.suggestedImprovement;
      }
      const nextTimeAnalysis = analyzeResponse(
        formData.nextTime,
        "what-change",
      );
      if (nextTimeAnalysis?.isVague) {
        newAiErrors.nextTime =
          nextTimeAnalysis.reason +
          ": " +
          nextTimeAnalysis.suggestedImprovement;
      }
      setAiErrors(newAiErrors);
      setShowAIFeedback(Object.keys(newAiErrors).length > 0);
    };
    if (
      formData.rootCause ||
      formData.transferableKnowledge ||
      formData.nextTime
    ) {
      validateWithAI();
    }
  }, [
    formData.rootCause,
    formData.transferableKnowledge,
    formData.nextTime,
    analyzeResponse,
  ]);

  const updateField = (field: keyof AARData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addWorkItem = () =>
    updateField("whatWorked", [...formData.whatWorked, ""]);
  const addDidntWorkItem = () =>
    updateField("whatDidntWork", [...formData.whatDidntWork, ""]);

  const handleSubmit = async () => {
    const validationErrors = validateAARForm(formData, aiErrors);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to submit AAR:", error);
      setErrors(["Failed to submit AAR. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    submitting,
    aiErrors,
    showAIFeedback,
    updateField,
    addWorkItem,
    addDidntWorkItem,
    handleSubmit,
  };
}
