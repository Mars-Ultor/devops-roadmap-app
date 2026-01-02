/**
 * StruggleSessionManager Component
 * Orchestrates the complete struggle session experience with timer, hints, and logging
 */

import { useState, useEffect } from 'react';
import { Target, Trophy, AlertTriangle } from 'lucide-react';
import StruggleTimer from './StruggleTimer';
import StruggleLogForm from './StruggleLogForm';
import { HintService } from '../../services/HintService';
import type { StruggleSession, StruggleLog } from '../../types/struggle';
import { STRUGGLE_SESSION_CONFIG } from '../../types/struggle';

interface StruggleSessionManagerProps {
  labId: string;
  userId: string;
  availableHints: string[];
  onSessionComplete: (session: StruggleSession) => void;
  onHintUsed: (hint: string) => void;
}

type SessionPhase = 'struggling' | 'logging' | 'hint_available' | 'completed';

export default function StruggleSessionManager({
  labId,
  userId,
  availableHints,
  onSessionComplete,
  onHintUsed
}: StruggleSessionManagerProps) {
  const [session, setSession] = useState<StruggleSession | null>(null);
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>('struggling');
  const [showStruggleLogForm, setShowStruggleLogForm] = useState(false);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  const hintService = HintService.getInstance();

  // Initialize session on mount
  useEffect(() => {
    const newSession = hintService.initializeStruggleSession(labId, userId);
    newSession.hintSystem.availableHints = availableHints;
    setSession(newSession);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labId, userId, availableHints]);

  // Update timer every second
  useEffect(() => {
    if (!session) return;

    const timer = setInterval(() => {
      setSession(prev => {
        if (!prev) return prev;
        const updatedTimerState = hintService.updateTimer(prev);
        return {
          ...prev,
          timerState: updatedTimerState
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session, hintService]);

  // Check for phase transitions
  useEffect(() => {
    if (!session) return;

    const canRequestHint = hintService.canRequestHint(session);
    const shouldEnd = hintService.shouldEndSession(session);

    if (shouldEnd) {
      setCurrentPhase('completed');
      onSessionComplete(session);
    } else if (canRequestHint && !showStruggleLogForm) {
      setCurrentPhase('hint_available');
    } else if (session.timerState.isLocked) {
      setCurrentPhase('struggling');
    }
  }, [session, showStruggleLogForm, hintService, onSessionComplete]);

  const handleHintRequest = () => {
    if (!session) return;

    // Must submit struggle log first
    if (session.struggleLogs.length === 0) {
      setShowStruggleLogForm(true);
      setCurrentPhase('logging');
      return;
    }

    // Request hint
    const { session: updatedSession, hint } = hintService.requestHint(session);
    setSession(updatedSession);

    if (hint) {
      setCurrentHint(hint);
      onHintUsed(hint);
    }
  };

  const handleStruggleLogSubmit = async (logData: Omit<StruggleLog, 'id' | 'timestamp'>) => {
    if (!session) return;

    setIsSubmittingLog(true);

    try {
      const updatedSession = hintService.submitStruggleLog(session, logData);
      setSession(updatedSession);
      setShowStruggleLogForm(false);
      setCurrentPhase('hint_available');
    } catch (error) {
      console.error('Failed to submit struggle log:', error);
    } finally {
      setIsSubmittingLog(false);
    }
  };

  const handleStruggleLogCancel = () => {
    setShowStruggleLogForm(false);
    setCurrentPhase(session?.timerState.canRequestHints ? 'hint_available' : 'struggling');
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (currentPhase === 'completed') {
    return (
      <div className="bg-green-900/50 border border-green-700 rounded-lg p-6 text-center">
        <Trophy className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-400 mb-2">Struggle Session Complete!</h3>
        <p className="text-green-200 mb-4">
          You've successfully completed this struggle session. Your persistence builds real problem-solving skills.
        </p>
        <div className="text-sm text-green-300">
          <p>Time struggled: {session.metadata.totalStruggleTime} minutes</p>
          <p>Hints used: {session.metadata.hintsRequested}</p>
          <p>Struggle logs submitted: {session.struggleLogs.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Phase Indicator */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Military Training: Struggle Session</h3>
              <p className="text-sm text-gray-400">
                Phase: {currentPhase === 'struggling' && 'Initial Struggle Period'}
                {currentPhase === 'logging' && 'Documenting Struggle'}
                {currentPhase === 'hint_available' && 'Hint Access Available'}
              </p>
            </div>
          </div>

          <div className="text-right text-sm text-gray-400">
            <p>Struggle Logs: {session.struggleLogs.length}</p>
            <p>Hints Used: {session.timerState.hintsUsed}/{STRUGGLE_SESSION_CONFIG.MAX_HINTS_PER_SESSION}</p>
          </div>
        </div>
      </div>

      {/* Struggle Log Form */}
      {showStruggleLogForm && (
        <StruggleLogForm
          onSubmit={handleStruggleLogSubmit}
          onCancel={handleStruggleLogCancel}
          isSubmitting={isSubmittingLog}
        />
      )}

      {/* Current Hint Display */}
      {currentHint && (
        <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-400 mb-1">Hint #{session.timerState.hintsUsed}</h4>
              <p className="text-blue-200">{currentHint}</p>
            </div>
          </div>
        </div>
      )}

      {/* Struggle Timer */}
      <StruggleTimer
        session={session.timerState}
        onHintRequested={handleHintRequest}
        onStruggleLogSubmitted={() => setShowStruggleLogForm(true)}
        showStruggleLogPrompt={currentPhase === 'hint_available' && session.struggleLogs.length === 0}
      />

      {/* Military Training Context */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="text-sm text-gray-300">
            <h4 className="font-medium text-yellow-400 mb-1">Why Struggle Sessions?</h4>
            <p className="mb-2">
              In military training, soldiers are forced to struggle with problems before receiving help.
              This builds genuine problem-solving skills and prevents dependency on external assistance.
            </p>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>• Forces deep understanding through struggle</li>
              <li>• Builds confidence in independent problem-solving</li>
              <li>• Prevents "hint addiction" and shallow learning</li>
              <li>• Mirrors real-world development challenges</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}