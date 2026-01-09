/**
 * Custom hook for AAR Form state management
 * Extracts form logic from AARForm component for better testability and reduced complexity
 */

import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { aarService } from '../../services/aarService';
import type { AARFormData, AARValidationResult } from '../../types/aar';
import type { AARLevel } from './AARForm';

/** List field names that support multiple items */
export type ListFieldName = 'whatWorkedWell' | 'whatDidNotWork';

const INITIAL_FORM_DATA: Readonly<AARFormData> = {
  whatWasAccomplished: '',
  whatWorkedWell: [''],
  whatDidNotWork: [''],
  whyDidNotWork: '',
  whatWouldIDoDifferently: '',
  whatDidILearn: ''
} as const;

/** Minimum number of items required for list fields before allowing removal */
const MIN_LIST_ITEMS = 1;

/** Error message shown when AAR submission fails */
const SUBMISSION_ERROR_MESSAGE = 'Failed to save AAR. Please try again.';

interface UseAARFormStateProps {
  readonly userId: string;
  readonly lessonId: string;
  readonly level: AARLevel;
  readonly labId: string;
  readonly onComplete: (aarId: string) => void;
  readonly onError?: (error: Error) => void;
}

export function useAARFormState({
  userId,
  lessonId,
  level,
  labId,
  onComplete,
  onError
}: UseAARFormStateProps) {
  const [formData, setFormData] = useState<AARFormData>({ ...INITIAL_FORM_DATA });
  const [validation, setValidation] = useState<AARValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setValidation(aarService.validateAARForm(formData));
  }, [formData]);

  const handleTextChange = useCallback((field: keyof AARFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitError(null);
  }, []);

  const handleListItemChange = useCallback((field: ListFieldName, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
    setSubmitError(null);
  }, []);

  const addListItem = useCallback((field: ListFieldName) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  }, []);

  const removeListItem = useCallback((field: ListFieldName, index: number) => {
    setFormData(prev => {
      if (prev[field].length <= MIN_LIST_ITEMS) return prev;
      return { ...prev, [field]: prev[field].filter((_, i) => i !== index) };
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);
    setSubmitError(null);

    if (!validation?.isValid) return;

    setIsSubmitting(true);
    try {
      // Save directly to Firebase Firestore
      const aarData = {
        userId,
        lessonId,
        level,
        labId,
        completedAt: serverTimestamp(),
        ...formData,
        // Filter out empty items from arrays
        whatWorkedWell: formData.whatWorkedWell.filter(item => item.trim()),
        whatDidNotWork: formData.whatDidNotWork.filter(item => item.trim()),
        wordCounts: validation.wordCounts,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'afterActionReviews'), aarData);
      onComplete(docRef.id);
    } catch (error) {
      console.error('Error saving AAR to Firestore:', error);
      const errorInstance = error instanceof Error ? error : new Error(String(error));
      setSubmitError(SUBMISSION_ERROR_MESSAGE);
      onError?.(errorInstance);
    } finally {
      setIsSubmitting(false);
    }
  }, [validation, userId, lessonId, level, labId, formData, onComplete, onError]);

  return {
    formData,
    validation,
    isSubmitting,
    showValidation,
    submitError,
    handleTextChange,
    handleListItemChange,
    addListItem,
    removeListItem,
    handleSubmit
  };
}