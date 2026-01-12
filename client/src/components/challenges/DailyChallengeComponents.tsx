/**
 * DailyChallengeComponents - Extracted UI components for DailyChallengeModal
 */

import { X, Clock, Target, AlertCircle } from 'lucide-react';
import { type Challenge, getDifficultyStyle, formatTime } from './DailyChallengeUtils';

interface ChallengeHeaderProps {
  readonly challenge: Challenge;
  readonly onClose: () => void;
  readonly isActive: boolean;
}

export function ChallengeHeader({ challenge, onClose, isActive }: ChallengeHeaderProps) {
  return (
    <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-white">Daily Challenge</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyStyle(challenge.difficulty)}`}>
            {challenge.difficulty.toUpperCase()}
          </span>
        </div>
        <p className="text-slate-400 text-sm">{challenge.title}</p>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-white" disabled={isActive}>
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}

interface TimerDisplayProps {
  readonly timeLimit: number;
  readonly timeRemaining: number;
  readonly timerColor: string;
}

export function TimerDisplay({ timeLimit, timeRemaining, timerColor }: TimerDisplayProps) {
  return (
    <div className="bg-slate-900 p-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-300">
        <Clock className="w-5 h-5" />
        <span className="text-sm">Time Limit: {timeLimit / 60} minutes</span>
      </div>
      <div className={`text-3xl font-mono font-bold ${timerColor}`}>
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
}

interface ScenarioSectionProps {
  readonly scenario: string;
}

export function ScenarioSection({ scenario }: ScenarioSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-amber-400" />
        Scenario
      </h3>
      <div className="bg-slate-900 rounded-lg p-4">
        <p className="text-slate-300 whitespace-pre-line">{scenario}</p>
      </div>
    </div>
  );
}

interface TaskSectionProps {
  readonly task: string;
}

export function TaskSection({ task }: TaskSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">Your Task</h3>
      <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
        <p className="text-blue-200 font-medium">{task}</p>
      </div>
    </div>
  );
}

interface CriteriaSectionProps {
  readonly criteria: string[];
  readonly completedCriteria: boolean[];
  readonly isActive: boolean;
  readonly timeRemaining: number;
  readonly onToggle: (index: number) => void;
}

export function CriteriaSection({ criteria, completedCriteria, isActive, timeRemaining, onToggle }: CriteriaSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">Success Criteria</h3>
      <div className="space-y-2">
        {criteria.map((criterion, index) => (
          <label key={criterion} className="flex items-start gap-3 bg-slate-900 rounded-lg p-3 cursor-pointer hover:bg-slate-800 transition-colors">
            <input type="checkbox" checked={completedCriteria[index]} onChange={() => onToggle(index)}
              disabled={!isActive || timeRemaining === 0}
              className="mt-1 w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900" />
            <span className={`text-sm ${completedCriteria[index] ? 'text-emerald-300 line-through' : 'text-slate-300'}`}>
              {criterion}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface HintsSectionProps {
  readonly hints: string[];
  readonly showHints: boolean;
  readonly onToggle: () => void;
}

export function HintsSection({ hints, showHints, onToggle }: HintsSectionProps) {
  if (hints.length === 0) return null;
  return (
    <div>
      <button onClick={onToggle} className="text-amber-400 hover:text-amber-300 text-sm font-medium">
        {showHints ? 'Hide' : 'Show'} Hints ({hints.length})
      </button>
      {showHints && (
        <div className="mt-2 space-y-2">
          {hints.map((hint) => (
            <div key={hint} className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
              <p className="text-sm text-amber-200">💡 {hint}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ChallengeFooterProps {
  readonly isActive: boolean;
  readonly timeLimit: number;
  readonly completedCount: number;
  readonly totalCount: number;
  readonly onStart: () => void;
  readonly onSubmit: () => void;
}

export function ChallengeFooter({ isActive, timeLimit, completedCount, totalCount, onStart, onSubmit }: ChallengeFooterProps) {
  return (
    <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6 flex justify-between items-center">
      {isActive ? (
        <>
          <div className="text-sm text-slate-400">
            {completedCount} / {totalCount} criteria complete
          </div>
          <button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
            Submit Challenge
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-slate-400">
            This is a timed challenge. You have {timeLimit / 60} {timeLimit / 60 === 1 ? 'minute' : 'minutes'} to complete all criteria.
          </p>
          <button onClick={onStart} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold">
            Start Challenge
          </button>
        </>
      )}
    </div>
  );
}
