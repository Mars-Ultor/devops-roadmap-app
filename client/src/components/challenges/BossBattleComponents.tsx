/**
 * BossBattleComponents - Extracted UI components for Boss Battle Modal
 */

import { X, Swords, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { BossBattle, BattlePhase } from './BossBattleUtils';
import { formatTime, getTimerColor, isPhaseComplete } from './BossBattleUtils';

// ============================================================================
// Header Section
// ============================================================================

interface BattleHeaderProps {
  week: number;
  battle: BossBattle;
  timeRemaining: number;
  currentScore: number;
  isActive: boolean;
  onClose: () => void;
}

export function BattleHeader({ week, battle, timeRemaining, currentScore, isActive, onClose }: BattleHeaderProps) {
  const timerColor = getTimerColor(timeRemaining, battle.timeLimit);
  
  return (
    <div className="sticky top-0 bg-gradient-to-r from-red-900/50 to-slate-800 border-b border-red-500/50 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Swords className="w-8 h-8 text-red-400" />
            <div>
              <h2 className="text-3xl font-bold text-white">Week {week} Boss Battle</h2>
              <p className="text-slate-300 text-sm mt-1">{battle.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-slate-900/50 rounded-lg px-4 py-2">
              <div className="text-xs text-slate-400">Time Remaining</div>
              <div className={`text-2xl font-mono font-bold ${timerColor}`}>{formatTime(timeRemaining)}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg px-4 py-2">
              <div className="text-xs text-slate-400">Current Score</div>
              <div className={`text-2xl font-bold ${currentScore >= battle.minimumPassScore ? 'text-emerald-400' : 'text-amber-400'}`}>{currentScore}%</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg px-4 py-2">
              <div className="text-xs text-slate-400">Pass Threshold</div>
              <div className="text-2xl font-bold text-slate-300">{battle.minimumPassScore}%</div>
            </div>
          </div>
        </div>
        {!isActive && (
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Warning Banner
// ============================================================================

interface WarningBannerProps {
  battle: BossBattle;
  week: number;
}

export function WarningBanner({ battle, week }: WarningBannerProps) {
  return (
    <div className="bg-red-900/20 border-y border-red-500/50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
        <div>
          <h3 className="text-red-300 font-semibold mb-1">WARNING: This is a Boss Battle</h3>
          <ul className="text-sm text-red-200 space-y-1">
            <li>• You have {battle.timeLimit / 3600} hours to complete this challenge</li>
            <li>• You must score at least {battle.minimumPassScore}% to pass</li>
            <li>• You CANNOT advance to Week {week + 1} until you pass this battle</li>
            <li>• Once started, the timer cannot be paused</li>
            <li>• This tests everything you've learned this week</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Scenario Section
// ============================================================================

interface ScenarioSectionProps {
  battle: BossBattle;
}

export function ScenarioSection({ battle }: ScenarioSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-3">Mission Scenario</h3>
      <div className="bg-slate-900 rounded-lg p-4">
        <p className="text-slate-300 whitespace-pre-line mb-4">{battle.scenario}</p>
        <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-3">
          <p className="text-blue-200 font-semibold">Objective: {battle.objective}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Phase Section
// ============================================================================

interface PhaseSectionProps {
  phase: BattlePhase;
  phaseIndex: number;
  phaseCompletion: boolean[][];
  isActive: boolean;
  timeRemaining: number;
  onToggleTask: (phaseIndex: number, taskIndex: number) => void;
}

export function PhaseSection({ phase, phaseIndex, phaseCompletion, isActive, timeRemaining, onToggleTask }: PhaseSectionProps) {
  const phaseComplete = isPhaseComplete(phaseCompletion, phaseIndex);
  
  return (
    <div className="bg-slate-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          Phase {phaseIndex + 1}: {phase.name}
          {phaseComplete && <CheckCircle className="w-5 h-5 text-emerald-400" />}
        </h3>
        <span className="text-sm text-slate-400">{phase.points} points</span>
      </div>
      <p className="text-slate-300 text-sm mb-4">{phase.description}</p>
      <div className="space-y-2">
        {phase.tasks.map((task, taskIndex) => (
          <label
            key={taskIndex}
            className="flex items-start gap-3 bg-slate-800 rounded-lg p-3 cursor-pointer hover:bg-slate-700 transition-colors"
          >
            <input
              type="checkbox"
              checked={phaseCompletion[phaseIndex]?.[taskIndex] || false}
              onChange={() => onToggleTask(phaseIndex, taskIndex)}
              disabled={!isActive || timeRemaining === 0}
              className="mt-1 w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
            />
            <span className={`text-sm ${phaseCompletion[phaseIndex]?.[taskIndex] ? 'text-emerald-300 line-through' : 'text-slate-300'}`}>
              {task}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Footer Section
// ============================================================================

interface BattleFooterProps {
  battle: BossBattle;
  isActive: boolean;
  currentScore: number;
  phaseCompletion: boolean[][];
  onStart: () => void;
  onSubmit: () => void;
}

export function BattleFooter({ battle, isActive, currentScore, phaseCompletion, onStart, onSubmit }: BattleFooterProps) {
  const tasksComplete = phaseCompletion.flat().filter(t => t).length;
  const totalTasks = battle.phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const isPassing = currentScore >= battle.minimumPassScore;
  
  return (
    <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6">
      {!isActive ? (
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-400">
            Ready to begin? Make sure you have {battle.timeLimit / 3600} hours available.
          </p>
          <button
            onClick={onStart}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-lg flex items-center gap-2"
          >
            <Swords className="w-5 h-5" />Start Boss Battle
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-slate-400">{tasksComplete} / {totalTasks} tasks complete</div>
            <div className="text-xs text-slate-500 mt-1">
              {isPassing ? (
                <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Currently passing</span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1"><XCircle className="w-4 h-4" /> Need {battle.minimumPassScore - currentScore}% more to pass</span>
              )}
            </div>
          </div>
          <button
            onClick={onSubmit}
            className={`px-8 py-3 rounded-lg font-bold text-lg ${isPassing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
          >
            Submit Battle {isPassing && '✓'}
          </button>
        </div>
      )}
    </div>
  );
}
