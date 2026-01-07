/**
 * After Action Review (AAR) Form Component
 * Mandatory structured reflection after every lab completion
 */

import { useState, useEffect } from 'react';
import { aarService } from '../../services/aarService';
import type { AARFormData, AARValidationResult } from '../../types/aar';
import { AARTextField, AARListField } from './AARFormFields';
import { AARFormHeader, AARValidationSummary, AARFormActions } from './AARFormComponents';

interface AARFormProps {
  userId: string;
  lessonId: string;
  level: 'crawl' | 'walk' | 'run-guided' | 'run-independent';
  labId: string;
  onComplete: (aarId: string) => void;
  onCancel?: () => void;
}

const initialFormData: AARFormData = {
  whatWasAccomplished: '',
  whatWorkedWell: [''],
  whatDidNotWork: [''],
  whyDidNotWork: '',
  whatWouldIDoDifferently: '',
  whatDidILearn: ''
};

export default function AARForm({ userId, lessonId, level, labId, onComplete, onCancel }: AARFormProps) {
  const [formData, setFormData] = useState<AARFormData>(initialFormData);
  const [validation, setValidation] = useState<AARValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    setValidation(aarService.validateAARForm(formData));
  }, [formData]);

  const handleTextChange = (field: keyof AARFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleListItemChange = (field: 'whatWorkedWell' | 'whatDidNotWork', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addListItem = (field: 'whatWorkedWell' | 'whatDidNotWork') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (field: 'whatWorkedWell' | 'whatDidNotWork', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);
    if (!validation?.isValid) return;
    setIsSubmitting(true);
    try {
      const aar = await aarService.createAAR(userId, lessonId, level, labId, formData);
      onComplete(aar.id);
    } catch (error) {
      console.error('Failed to create AAR:', error);
      alert('Failed to save AAR. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg shadow-xl">
        <AARFormHeader lessonId={lessonId} level={level} />
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <AARTextField field="whatWasAccomplished" label="1. What was I trying to accomplish?"
            placeholder="Describe the objective of this lab in 2-3 sentences. What was the expected outcome?"
            minWords={20} value={formData.whatWasAccomplished} onChange={(v) => handleTextChange('whatWasAccomplished', v)}
            showValidation={showValidation} validation={validation} rows={4} />
          <AARListField field="whatWorkedWell" label="2. What worked well?" placeholder="Specific thing that went well"
            minItems={3} items={formData.whatWorkedWell} onItemChange={(i, v) => handleListItemChange('whatWorkedWell', i, v)}
            onAddItem={() => addListItem('whatWorkedWell')} onRemoveItem={(i) => removeListItem('whatWorkedWell', i)}
            showValidation={showValidation} validation={validation} />
          <AARListField field="whatDidNotWork" label="3. What didn't work?" placeholder="Specific problem or struggle encountered"
            minItems={2} items={formData.whatDidNotWork} onItemChange={(i, v) => handleListItemChange('whatDidNotWork', i, v)}
            onAddItem={() => addListItem('whatDidNotWork')} onRemoveItem={(i) => removeListItem('whatDidNotWork', i)}
            showValidation={showValidation} validation={validation} />
          <AARTextField field="whyDidNotWork" label="4. Why didn't it work?"
            placeholder="Analyze the root causes, not just symptoms. What was the underlying reason for the failures?"
            minWords={15} value={formData.whyDidNotWork} onChange={(v) => handleTextChange('whyDidNotWork', v)}
            showValidation={showValidation} validation={validation} rows={4} />
          <AARTextField field="whatWouldIDoDifferently" label="5. What would I do differently next time?"
            placeholder="Specific changes to your approach, process, or preparation that would improve outcomes."
            minWords={15} value={formData.whatWouldIDoDifferently} onChange={(v) => handleTextChange('whatWouldIDoDifferently', v)}
            showValidation={showValidation} validation={validation} rows={4} />
          <AARTextField field="whatDidILearn" label="6. What did I learn that I can use in future tasks?"
            placeholder="Transferable knowledge or skills that apply beyond this specific lab."
            minWords={15} value={formData.whatDidILearn} onChange={(v) => handleTextChange('whatDidILearn', v)}
            showValidation={showValidation} validation={validation} rows={4} />
          {validation && <AARValidationSummary validation={validation} show={showValidation} />}
          <AARFormActions onCancel={onCancel} isSubmitting={isSubmitting} isValid={validation?.isValid ?? false} />
        </form>
      </div>
    </div>
  );
}