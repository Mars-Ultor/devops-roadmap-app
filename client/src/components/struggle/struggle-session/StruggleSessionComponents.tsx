/**
 * StruggleSessionComponents - Extracted UI components for StruggleSessionManager
 */

import { Target, Trophy, AlertTriangle } from "lucide-react";
import { STRUGGLE_SESSION_CONFIG } from "../../../types/struggle";
import type { StruggleSession } from "../../../types/struggle";

// ============================================================================
// Session Phase Type
// ============================================================================

export type SessionPhase =
  | "struggling"
  | "logging"
  | "hint_available"
  | "completed";

// ============================================================================
// Loading State Component
// ============================================================================

export function SessionLoadingState() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}

// ============================================================================
// Session Complete Display
// ============================================================================

interface SessionCompleteDisplayProps {
  session: StruggleSession;
}

export function SessionCompleteDisplay({
  session,
}: SessionCompleteDisplayProps) {
  return (
    <div className="bg-green-900/50 border border-green-700 rounded-lg p-6 text-center">
      <Trophy className="w-12 h-12 text-green-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-green-400 mb-2">
        Struggle Session Complete!
      </h3>
      <p className="text-green-200 mb-4">
        You've successfully completed this struggle session. Your persistence
        builds real problem-solving skills.
      </p>
      <div className="text-sm text-green-300">
        <p>Time struggled: {session.metadata.totalStruggleTime} minutes</p>
        <p>Hints used: {session.metadata.hintsRequested}</p>
        <p>Struggle logs submitted: {session.struggleLogs.length}</p>
      </div>
    </div>
  );
}

// ============================================================================
// Phase Indicator Component
// ============================================================================

interface PhaseIndicatorProps {
  currentPhase: SessionPhase;
  session: StruggleSession;
}

export function PhaseIndicator({ currentPhase, session }: PhaseIndicatorProps) {
  const getPhaseLabel = () => {
    switch (currentPhase) {
      case "struggling":
        return "Initial Struggle Period";
      case "logging":
        return "Documenting Struggle";
      case "hint_available":
        return "Hint Access Available";
      default:
        return "";
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">
              Military Training: Struggle Session
            </h3>
            <p className="text-sm text-gray-400">Phase: {getPhaseLabel()}</p>
          </div>
        </div>

        <div className="text-right text-sm text-gray-400">
          <p>Struggle Logs: {session.struggleLogs.length}</p>
          <p>
            Hints Used: {session.timerState.hintsUsed}/
            {STRUGGLE_SESSION_CONFIG.MAX_HINTS_PER_SESSION}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Current Hint Display Component
// ============================================================================

interface CurrentHintDisplayProps {
  hint: string;
  hintNumber: number;
}

export function CurrentHintDisplay({
  hint,
  hintNumber,
}: CurrentHintDisplayProps) {
  return (
    <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-400 mb-1">
            Hint #{hintNumber}
          </h4>
          <p className="text-blue-200">{hint}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Military Training Context Component
// ============================================================================

export function MilitaryTrainingContext() {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
        <div className="text-sm text-gray-300">
          <h4 className="font-medium text-yellow-400 mb-1">
            Why Struggle Sessions?
          </h4>
          <p className="mb-2">
            In military training, soldiers are forced to struggle with problems
            before receiving help. This builds genuine problem-solving skills
            and prevents dependency on external assistance.
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
  );
}
