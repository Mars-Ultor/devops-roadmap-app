/**
 * StruggleTimer Component
 * Displays 30-minute hint lockout with progressive hint unlocking
 */

import { useState, useEffect } from 'react';
import { Clock, Lock, Unlock, Lightbulb, AlertTriangle } from 'lucide-react';
import type { StruggleTimerState, TimerDisplay } from '../../types/struggle';
import { STRUGGLE_SESSION_CONFIG } from '../../types/struggle';

interface StruggleTimerProps {
  session: StruggleTimerState;
  onHintRequested: () => void;
  onStruggleLogSubmitted: () => void;
  showStruggleLogPrompt: boolean;
}

export default function StruggleTimer({
  session,
  onHintRequested,
  onStruggleLogSubmitted,
  showStruggleLogPrompt
}: StruggleTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(session.timeRemaining);

  useEffect(() => {
    if (session.isLocked && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev: number) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [session.isLocked, timeRemaining]);

  const formatTime = (seconds: number): TimerDisplay => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const isLocked = seconds > 0;

    let statusText = '';
    let progressPercent = 0;

    if (isLocked) {
      const totalSeconds = STRUGGLE_SESSION_CONFIG.HINT_LOCK_DURATION_MINUTES * 60;
      progressPercent = ((totalSeconds - seconds) / totalSeconds) * 100;
      statusText = `Hints unlock in ${minutes}:${secs.toString().padStart(2, '0')}`;
    } else {
      statusText = 'Hints available - struggle first!';
      progressPercent = 100;
    }

    return { minutes, seconds: secs, isLocked, statusText, progressPercent };
  };

  const display = formatTime(timeRemaining);

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {display.isLocked ? (
            <Lock className="w-5 h-5 text-red-400" />
          ) : (
            <Unlock className="w-5 h-5 text-green-400" />
          )}
          <h3 className="text-lg font-semibold text-white">Struggle Session</h3>
        </div>
        <div className="text-sm text-gray-400">
          Hints used: {session.hintsUsed}/{STRUGGLE_SESSION_CONFIG.MAX_HINTS_PER_SESSION}
        </div>
      </div>

      {/* Timer Display */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-2">
          <Clock className={`w-6 h-6 ${display.isLocked ? 'text-red-400' : 'text-green-400'}`} />
          <span className={`text-xl font-mono font-bold ${display.isLocked ? 'text-red-400' : 'text-green-400'}`}>
            {display.isLocked ? `${display.minutes}:${display.seconds.toString().padStart(2, '0')}` : 'UNLOCKED'}
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

      {/* Struggle Log Prompt */}
      {showStruggleLogPrompt && (
        <div className="bg-yellow-900/50 border border-yellow-700 rounded-md p-3 mb-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-400 mb-1">
                Document Your Struggle First
              </h4>
              <p className="text-xs text-yellow-200 mb-2">
                Before accessing hints, you must document at least 3 different approaches you've tried and where you're currently stuck.
              </p>
              <button
                onClick={onStruggleLogSubmitted}
                className="px-3 py-1 bg-yellow-600 text-yellow-100 rounded text-xs hover:bg-yellow-500 transition-colors"
              >
                Submit Struggle Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hint Request Button */}
      {!display.isLocked && !showStruggleLogPrompt && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">
              {session.canRequestHints
                ? `Hint ${session.hintsUsed + 1} available`
                : 'All hints used - solve independently'}
            </span>
          </div>

          {session.canRequestHints && (
            <button
              onClick={onHintRequested}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              Request Hint
            </button>
          )}
        </div>
      )}

      {/* Hint Unlocking Info */}
      {display.isLocked && (
        <div className="text-xs text-gray-500 mt-2">
          • Hints unlock progressively: 1 hint every {STRUGGLE_SESSION_CONFIG.HINT_UNLOCK_INTERVAL_MINUTES} minutes
          • Full solution available after 90 minutes or 3 failed attempts
          • Struggle builds problem-solving skills
        </div>
      )}
    </div>
  );
}