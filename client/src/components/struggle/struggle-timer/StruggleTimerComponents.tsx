/**
 * StruggleTimerComponents - Extracted UI components for StruggleTimer
 */

import { Clock, Lock, Unlock, Lightbulb, AlertTriangle } from 'lucide-react';
import { STRUGGLE_SESSION_CONFIG } from '../../../types/struggle';
import type { TimerDisplay } from '../../../types/struggle';

// ============================================================================
// Timer Header Component
// ============================================================================

interface TimerHeaderProps {
  isLocked: boolean;
  hintsUsed: number;
}

export function TimerHeader({ isLocked, hintsUsed }: TimerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        {isLocked ? (
          <Lock className="w-5 h-5 text-red-400" />
        ) : (
          <Unlock className="w-5 h-5 text-green-400" />
        )}
        <h3 className="text-lg font-semibold text-white">Struggle Session</h3>
      </div>
      <div className="text-sm text-gray-400">
        Hints used: {hintsUsed}/{STRUGGLE_SESSION_CONFIG.MAX_HINTS_PER_SESSION}
      </div>
    </div>
  );
}

// ============================================================================
// Timer Display Component
// ============================================================================

interface TimerDisplayProps {
  display: TimerDisplay;
}

export function TimerDisplaySection({ display }: TimerDisplayProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-3 mb-2">
        <Clock className={`w-6 h-6 ${display.isLocked ? 'text-red-400' : 'text-green-400'}`} />
        <span className={`text-xl font-mono font-bold ${display.isLocked ? 'text-red-400' : 'text-green-400'}`}>
          {display.isLocked 
            ? `${display.minutes}:${display.seconds.toString().padStart(2, '0')}` 
            : 'UNLOCKED'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            display.isLocked ? 'bg-red-500' : 'bg-green-500'
          }`}
          style={{ width: `${display.progressPercent}%` }}
        />
      </div>

      <p className="text-sm text-gray-300">{display.statusText}</p>
    </div>
  );
}

// ============================================================================
// Struggle Log Prompt Component
// ============================================================================

interface StruggleLogPromptProps {
  onSubmit: () => void;
}

export function StruggleLogPrompt({ onSubmit }: StruggleLogPromptProps) {
  return (
    <div className="bg-yellow-900/50 border border-yellow-700 rounded-md p-3 mb-4">
      <div className="flex items-start space-x-2">
        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-yellow-400 mb-1">
            Document Your Struggle First
          </h4>
          <p className="text-xs text-yellow-200 mb-2">
            Before accessing hints, you must document at least 3 different approaches 
            you've tried and where you're currently stuck.
          </p>
          <button
            onClick={onSubmit}
            className="px-3 py-1 bg-yellow-600 text-yellow-100 rounded text-xs hover:bg-yellow-500 transition-colors"
          >
            Submit Struggle Log
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Hint Request Section Component
// ============================================================================

interface HintRequestSectionProps {
  canRequestHints: boolean;
  hintsUsed: number;
  onHintRequested: () => void;
}

export function HintRequestSection({ canRequestHints, hintsUsed, onHintRequested }: HintRequestSectionProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Lightbulb className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-gray-300">
          {canRequestHints
            ? `Hint ${hintsUsed + 1} available`
            : 'All hints used - solve independently'}
        </span>
      </div>

      {canRequestHints && (
        <button
          onClick={onHintRequested}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          Request Hint
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Hint Unlocking Info Component
// ============================================================================

export function HintUnlockingInfo() {
  return (
    <div className="text-xs text-gray-500 mt-2">
      • Hints unlock progressively: 1 hint every {STRUGGLE_SESSION_CONFIG.HINT_UNLOCK_INTERVAL_MINUTES} minutes
      • Full solution available after 90 minutes or 3 failed attempts
      • Struggle builds problem-solving skills
    </div>
  );
}
