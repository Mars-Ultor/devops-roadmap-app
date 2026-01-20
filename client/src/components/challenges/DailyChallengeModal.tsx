/**
 * DailyChallengeModal - 5-minute randomized scenario every 24 hours
 * Refactored to use extracted components and custom hook
 */

import { getTimerColor } from "./DailyChallengeUtils";
import {
  ChallengeHeader,
  TimerDisplay,
  ScenarioSection,
  TaskSection,
  CriteriaSection,
  HintsSection,
  ChallengeFooter,
} from "./DailyChallengeComponents";
import { useDailyChallenge } from "./useDailyChallenge";

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean, timeUsed: number) => void;
}

export const DailyChallengeModal = ({
  isOpen,
  onClose,
  onComplete,
}: DailyChallengeModalProps) => {
  const {
    challenge,
    timeRemaining,
    isActive,
    showHints,
    completedCriteria,
    completedCount,
    handleStart,
    handleSubmit,
    toggleCriterion,
    toggleHints,
  } = useDailyChallenge({ isOpen, onComplete, onClose });

  if (!isOpen || !challenge) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <ChallengeHeader
          challenge={challenge}
          onClose={onClose}
          isActive={isActive}
        />
        <TimerDisplay
          timeLimit={challenge.timeLimit}
          timeRemaining={timeRemaining}
          timerColor={getTimerColor(timeRemaining, challenge.timeLimit)}
        />
        <div className="p-6 space-y-6">
          <ScenarioSection scenario={challenge.scenario} />
          <TaskSection task={challenge.task} />
          <CriteriaSection
            criteria={challenge.successCriteria}
            completedCriteria={completedCriteria}
            isActive={isActive}
            timeRemaining={timeRemaining}
            onToggle={toggleCriterion}
          />
          <HintsSection
            hints={challenge.hints}
            showHints={showHints}
            onToggle={toggleHints}
          />
        </div>
        <ChallengeFooter
          isActive={isActive}
          timeLimit={challenge.timeLimit}
          completedCount={completedCount}
          totalCount={challenge.successCriteria.length}
          onStart={handleStart}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default DailyChallengeModal;
