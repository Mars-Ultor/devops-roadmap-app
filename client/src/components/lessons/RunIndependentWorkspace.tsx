/**
 * RunIndependentWorkspace - Workspace for completing run-independent level tasks
 * Provides a text editor and submission mechanism for open-ended mastery challenges
 */

import { useState, useEffect } from 'react';
import {
  TimerBar,
  SelfAssessmentChecklist,
  ResponseEditor,
  SubmissionGuidelines,
  SubmitButton
} from './RunIndependentComponents';

interface RunIndependentWorkspaceProps {
  readonly objective: string;
  readonly successCriteria: string[];
  readonly timeTarget?: number;
  readonly onSubmit: (submission: string) => void;
  readonly onSaveDraft: (draft: string) => void;
  readonly savedDraft?: string;
}

export default function RunIndependentWorkspace({
  objective,
  successCriteria,
  timeTarget,
  onSubmit,
  onSaveDraft,
  savedDraft = ''
}: RunIndependentWorkspaceProps) {
  const [submission, setSubmission] = useState(savedDraft);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showChecklist, setShowChecklist] = useState(true);
  const [checkedCriteria, setCheckedCriteria] = useState<Set<number>>(new Set());

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!submission) return;
    const timeout = setTimeout(() => {
      onSaveDraft(submission);
    }, 30000);
    return () => clearTimeout(timeout);
  }, [submission, onSaveDraft]);

  const handleCriteriaToggle = (index: number) => {
    const newChecked = new Set(checkedCriteria);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedCriteria(newChecked);
  };

  const allCriteriaChecked = successCriteria.length > 0 && checkedCriteria.size === successCriteria.length;
  const wordCount = submission.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = submission.trim().length >= 100;

  const handleSubmit = () => {
    if (!canSubmit) {
      alert('Please provide a more detailed response (at least 100 characters).');
      return;
    }
    setIsTimerRunning(false);
    onSubmit(submission);
  };

  return (
    <div className="space-y-6">
      <TimerBar
        elapsedTime={elapsedTime}
        timeTarget={timeTarget}
        wordCount={wordCount}
        checkedCount={checkedCriteria.size}
        totalCriteria={successCriteria.length}
        allChecked={allCriteriaChecked}
        onSaveDraft={() => onSaveDraft(submission)}
        onToggleChecklist={() => setShowChecklist(!showChecklist)}
      />

      {showChecklist && (
        <SelfAssessmentChecklist
          successCriteria={successCriteria}
          checkedCriteria={checkedCriteria}
          onToggle={handleCriteriaToggle}
        />
      )}

      <ResponseEditor
        submission={submission}
        objective={objective}
        onChange={setSubmission}
      />

      <SubmissionGuidelines />

      <SubmitButton
        allCriteriaChecked={allCriteriaChecked}
        uncheckedCount={successCriteria.length - checkedCriteria.size}
        canSubmit={canSubmit}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
