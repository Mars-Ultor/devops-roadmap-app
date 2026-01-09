/**
 * RunIndependentWorkspace - Workspace for completing run-independent level tasks
 * Provides a text editor and submission mechanism for open-ended mastery challenges
 */

import { useState, useEffect, useCallback } from 'react';
import {
  TimerBar,
  SelfAssessmentChecklist,
  ResponseEditor,
  SubmissionGuidelines,
  SubmitButton
} from './RunIndependentComponents';
import StrategyGuide from './StrategyGuide';

interface EvaluationCriterion {
  criterion: string;
  weight: number;
  passingThreshold: string;
}

interface RunIndependentWorkspaceProps {
  readonly objective: string;
  readonly successCriteria: string[];
  readonly timeTarget?: number;
  readonly minimumRequirements?: string[];
  readonly evaluationRubric?: EvaluationCriterion[];
  readonly onSubmit: (submission: string) => void;
  readonly onSaveDraft: (draft: string) => void;
  readonly savedDraft?: string;
}

/** Custom hook for timer and auto-save logic */
function useWorkspaceState(savedDraft: string, onSaveDraft: (draft: string) => void) {
  const [submission, setSubmission] = useState(savedDraft);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showChecklist, setShowChecklist] = useState(true);
  const [checkedCriteria, setCheckedCriteria] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (!submission) return;
    const timeout = setTimeout(() => onSaveDraft(submission), 30000);
    return () => clearTimeout(timeout);
  }, [submission, onSaveDraft]);

  const handleCriteriaToggle = useCallback((index: number) => {
    setCheckedCriteria(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  }, []);

  const stopTimer = useCallback(() => setIsTimerRunning(false), []);
  const toggleChecklist = useCallback(() => setShowChecklist(prev => !prev), []);

  return {
    submission, setSubmission, elapsedTime, showChecklist, checkedCriteria,
    handleCriteriaToggle, stopTimer, toggleChecklist
  };
}

export default function RunIndependentWorkspace({
  objective, successCriteria, timeTarget, minimumRequirements, evaluationRubric,
  onSubmit, onSaveDraft, savedDraft = ''
}: RunIndependentWorkspaceProps) {
  const {
    submission, setSubmission, elapsedTime, showChecklist, checkedCriteria,
    handleCriteriaToggle, stopTimer, toggleChecklist
  } = useWorkspaceState(savedDraft, onSaveDraft);

  const allCriteriaChecked = successCriteria.length > 0 && checkedCriteria.size === successCriteria.length;
  const wordCount = submission.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = submission.trim().length >= 100;

  const handleSubmit = () => {
    if (!canSubmit) { alert('Please provide a more detailed response (at least 100 characters).'); return; }
    stopTimer();
    onSubmit(submission);
  };

  return (
    <div className="space-y-6">
      <TimerBar elapsedTime={elapsedTime} timeTarget={timeTarget} wordCount={wordCount}
        checkedCount={checkedCriteria.size} totalCriteria={successCriteria.length}
        allChecked={allCriteriaChecked} onSaveDraft={() => onSaveDraft(submission)} onToggleChecklist={toggleChecklist} />
      {showChecklist && <SelfAssessmentChecklist successCriteria={successCriteria}
        checkedCriteria={checkedCriteria} onToggle={handleCriteriaToggle} />}
      <StrategyGuide minimumRequirements={minimumRequirements} evaluationRubric={evaluationRubric} />
      <ResponseEditor submission={submission} objective={objective} onChange={setSubmission} />
      <SubmissionGuidelines />
      <SubmitButton allCriteriaChecked={allCriteriaChecked}
        uncheckedCount={successCriteria.length - checkedCriteria.size} canSubmit={canSubmit} onSubmit={handleSubmit} />
    </div>
  );
}
