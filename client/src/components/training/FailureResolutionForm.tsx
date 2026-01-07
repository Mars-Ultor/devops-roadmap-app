/**
 * FailureResolutionForm - Document how a failure was resolved
 * Captures root cause analysis and prevention strategies
 */

import { useState } from 'react';
import type { FailureLog } from '../../types/training';
import { MIN_LESSONS } from './FailureResolutionFormUtils';
import {
  FormHeader,
  OriginalFailure,
  RootCauseInput,
  ResolutionInput,
  PreventionInput,
  LessonsLearnedSection,
  InfoBox,
  ActionButtons
} from './FailureResolutionFormComponents';

interface FailureResolutionFormProps {
  failure: FailureLog;
  onSubmit: (updates: {
    rootCause?: string;
    resolution?: string;
    preventionStrategy?: string;
    lessonsLearned: string[];
    resolvedAt: Date;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function FailureResolutionForm({
  failure,
  onSubmit,
  onCancel
}: FailureResolutionFormProps) {
  const [rootCause, setRootCause] = useState(failure.rootCause || '');
  const [resolution, setResolution] = useState(failure.resolution || '');
  const [preventionStrategy, setPreventionStrategy] = useState(failure.preventionStrategy || '');
  const [lessons, setLessons] = useState<string[]>(failure.lessonsLearned.length > 0 ? failure.lessonsLearned : ['', '']);
  const [submitting, setSubmitting] = useState(false);

  const updateLesson = (index: number, value: string) => {
    const updated = [...lessons];
    updated[index] = value;
    setLessons(updated);
  };

  const addLesson = () => {
    setLessons([...lessons, '']);
  };

  const removeLesson = (index: number) => {
    if (lessons.length > MIN_LESSONS) {
      setLessons(lessons.filter((_, i) => i !== index));
    }
  };

  const validLessons = lessons.filter(l => l.trim().length > 0);
  const canSubmit = rootCause.trim() && resolution.trim() && validLessons.length >= MIN_LESSONS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) {
      alert('Please fill in root cause, resolution, and at least 2 lessons learned');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        rootCause: rootCause.trim(),
        resolution: resolution.trim(),
        preventionStrategy: preventionStrategy.trim() || undefined,
        lessonsLearned: validLessons,
        resolvedAt: new Date()
      });
    } catch (error) {
      console.error('Error submitting resolution:', error);
      alert('Failed to submit resolution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border-2 border-green-500/50 max-w-3xl w-full my-8">
        <FormHeader onCancel={onCancel} />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <OriginalFailure failure={failure} />
          <RootCauseInput value={rootCause} onChange={setRootCause} />
          <ResolutionInput value={resolution} onChange={setResolution} />
          <PreventionInput value={preventionStrategy} onChange={setPreventionStrategy} />
          <LessonsLearnedSection
            lessons={lessons}
            onUpdate={updateLesson}
            onAdd={addLesson}
            onRemove={removeLesson}
          />
          <InfoBox />
          <ActionButtons
            onCancel={onCancel}
            submitting={submitting}
            canSubmit={canSubmit}
          />
        </form>
      </div>
    </div>
  );
}
