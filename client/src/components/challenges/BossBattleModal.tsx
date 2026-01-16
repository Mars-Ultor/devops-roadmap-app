/**
 * BossBattleModal - Main component for Boss Battle challenges
 * Refactored to use extracted components and custom hook
 */

import { X } from 'lucide-react';
import { formatTime, getTimerColor, isPhaseComplete } from './BossBattleUtils';
import {
  BattleHeader,
  WarningBanner,
  ScenarioSection,
  PhaseSection,
  BattleFooter
} from './BossBattleComponents';
import { useBossBattle } from './useBossBattle';

interface BossBattleModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly week: number;
  readonly onComplete: (success: boolean) => void;
}

export default function BossBattleModal({
  isOpen, onClose, week, onComplete
}: BossBattleModalProps) {
  const {
    battle, timeRemaining, isActive, phaseCompletion,
    hasStarted, currentScore, handleStart, handleSubmit, toggleTask
  } = useBossBattle({ isOpen, week, onComplete });

  if (!isOpen || !battle) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-red-500">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <BattleHeader
              title={battle.title}
              timeRemaining={formatTime(timeRemaining)}
              timerColor={getTimerColor(timeRemaining, battle.timeLimit)}
              currentScore={currentScore}
              minimumPassScore={battle.minimumPassScore}
              isActive={isActive}
            />
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <WarningBanner />
          <ScenarioSection scenario={battle.scenario} />

          <div className="space-y-6">
            {battle.phases.map((phase, phaseIndex) => (
              <PhaseSection
                key={phase.name}
                phase={phase}
                phaseIndex={phaseIndex}
                phaseCompletion={phaseCompletion[phaseIndex] || []}
                isComplete={isPhaseComplete(phaseIndex, phaseCompletion)}
                isActive={isActive}
                onToggleTask={(taskIndex) => toggleTask(phaseIndex, taskIndex)}
              />
            ))}
          </div>

          <BattleFooter
            hasStarted={hasStarted}
            isActive={isActive}
            timeRemaining={timeRemaining}
            onStart={handleStart}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export { BossBattleModal };
