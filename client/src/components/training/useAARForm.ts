/**
 * useAARForm - Custom hook for AAR form state management
 */

import { useState } from 'react';
import type { AAR } from '../../types/training';
import { validateAARForm, updateArrayField, addArrayField } from './AARFormUtils';

interface UseAARFormProps {
  contentId: string;
  contentType: 'lesson' | 'lab' | 'drill';
  onSubmit: (aarData: Omit<AAR, 'id' | 'userId' | 'createdAt' | 'aiReviewed'>) => Promise<void>;
}

export function useAARForm({ contentId, contentType, onSubmit }: UseAARFormProps) {
  const [objective, setObjective] = useState('');
  const [whatWorked, setWhatWorked] = useState<string[]>(['', '', '']);
  const [whatDidntWork, setWhatDidntWork] = useState<string[]>(['', '']);
  const [rootCauses, setRootCauses] = useState<string[]>(['', '']);
  const [improvements, setImprovements] = useState<string[]>(['', '']);
  const [transferableKnowledge, setTransferableKnowledge] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const isValid = validateAARForm(objective, whatWorked, whatDidntWork, rootCauses, improvements, transferableKnowledge);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isValid) { setShowValidation(true); return; }

    setSubmitting(true);
    try {
      await onSubmit({
        [contentType === 'lesson' ? 'lessonId' : contentType === 'lab' ? 'labId' : 'drillId']: contentId,
        objective: objective.trim(),
        whatWorked: whatWorked.filter(w => w.trim().length > 0),
        whatDidntWork: whatDidntWork.filter(w => w.trim().length > 0),
        rootCauses: rootCauses.filter(r => r.trim().length > 0),
        improvements: improvements.filter(i => i.trim().length > 0),
        transferableKnowledge: transferableKnowledge.trim()
      });
    } catch (error) {
      console.error('Error submitting AAR:', error);
      alert('Failed to submit AAR. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // State values
    objective, setObjective,
    whatWorked, whatDidntWork, rootCauses, improvements,
    transferableKnowledge, setTransferableKnowledge,
    submitting, showValidation, isValid,
    // Handlers
    handleSubmit,
    updateWhatWorked: (i: number, v: string) => updateArrayField(whatWorked, setWhatWorked, i, v),
    addWhatWorked: () => addArrayField(whatWorked, setWhatWorked),
    updateWhatDidntWork: (i: number, v: string) => updateArrayField(whatDidntWork, setWhatDidntWork, i, v),
    addWhatDidntWork: () => addArrayField(whatDidntWork, setWhatDidntWork),
    updateRootCauses: (i: number, v: string) => updateArrayField(rootCauses, setRootCauses, i, v),
    addRootCauses: () => addArrayField(rootCauses, setRootCauses),
    updateImprovements: (i: number, v: string) => updateArrayField(improvements, setImprovements, i, v),
    addImprovements: () => addArrayField(improvements, setImprovements)
  };
}
