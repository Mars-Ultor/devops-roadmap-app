/**
 * Mandatory AAR Modal - CANNOT BE CLOSED
 * Blocks navigation until AAR is submitted after lab completion
 * Phase 4: Mandatory AAR
 */

import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  AAR_QUESTIONS, 
  countWords, 
  validateResponse, 
  checkAllComplete, 
  countCompletedQuestions 
} from './aar/aarData';
import { 
  AARModalHeader, 
  AARWarningBanner, 
  AARQuestionField, 
  AARModalFooter 
} from './aar/AARComponents';

interface MandatoryAARModalProps {
  labId: string;
  userId: string;
  labTitle: string;
  passed: boolean;
  onComplete: () => void;
}

export default function MandatoryAARModal({
  labId,
  userId,
  labTitle,
  passed,
  onComplete
}: MandatoryAARModalProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [aiValidation, setAiValidation] = useState<Record<string, string>>({});

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
    if (aiValidation[questionId]) {
      setAiValidation(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    AAR_QUESTIONS.forEach(q => {
      const answer = responses[q.id] || '';
      const error = validateResponse(answer, q.minWords);
      if (error) {
        newErrors[q.id] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, 'aars'), {
        userId,
        labId,
        labTitle,
        passed,
        responses,
        submittedAt: new Date(),
        wordCounts: AAR_QUESTIONS.reduce((acc, q) => {
          acc[q.id] = countWords(responses[q.id] || '');
          return acc;
        }, {} as Record<string, number>)
      });

      onComplete();
    } catch (error) {
      console.error('Error submitting AAR:', error);
      alert('Error submitting AAR. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isComplete = checkAllComplete(responses);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-800 border-2 border-indigo-500 rounded-lg shadow-2xl my-8">
        <AARModalHeader labTitle={labTitle} passed={passed} />
        <AARWarningBanner />

        <div className="px-6 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {AAR_QUESTIONS.map((q, index) => (
            <AARQuestionField
              key={q.id}
              question={q}
              index={index}
              answer={responses[q.id] || ''}
              error={errors[q.id]}
              aiValidation={aiValidation[q.id]}
              onChange={handleResponseChange}
            />
          ))}
        </div>

        <AARModalFooter
          isComplete={isComplete}
          completedCount={countCompletedQuestions(responses)}
          totalCount={AAR_QUESTIONS.length}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
