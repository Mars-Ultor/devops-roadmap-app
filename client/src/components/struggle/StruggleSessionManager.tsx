/**
 * StruggleSessionManager Component
 * Orchestrates the complete struggle session experience with timer, hints, and logging
 */

import StruggleTimer from "./StruggleTimer";
import StruggleLogForm from "./StruggleLogForm";
import type { StruggleSession } from "../../types/struggle";

// Import extracted components and hook
import {
  SessionLoadingState,
  SessionCompleteDisplay,
  PhaseIndicator,
  CurrentHintDisplay,
  MilitaryTrainingContext,
} from "./struggle-session/StruggleSessionComponents";
import { useStruggleSession } from "./struggle-session/useStruggleSession";

interface StruggleSessionManagerProps {
  labId: string;
  userId: string;
  availableHints: string[];
  onSessionComplete: (session: StruggleSession) => void;
  onHintUsed: (hint: string) => void;
}

export default function StruggleSessionManager(
  props: StruggleSessionManagerProps,
) {
  const {
    session,
    currentPhase,
    showStruggleLogForm,
    currentHint,
    isSubmittingLog,
    handleHintRequest,
    handleStruggleLogSubmit,
    handleStruggleLogCancel,
    setShowStruggleLogForm,
  } = useStruggleSession(props);

  if (!session) return <SessionLoadingState />;
  if (currentPhase === "completed")
    return <SessionCompleteDisplay session={session} />;

  return (
    <div className="space-y-6">
      <PhaseIndicator currentPhase={currentPhase} session={session} />
      {showStruggleLogForm && (
        <StruggleLogForm
          onSubmit={handleStruggleLogSubmit}
          onCancel={handleStruggleLogCancel}
          isSubmitting={isSubmittingLog}
        />
      )}
      {currentHint && (
        <CurrentHintDisplay
          hint={currentHint}
          hintNumber={session.timerState.hintsUsed}
        />
      )}
      <StruggleTimer
        session={session.timerState}
        onHintRequested={handleHintRequest}
        onStruggleLogSubmitted={() => setShowStruggleLogForm(true)}
        showStruggleLogPrompt={
          currentPhase === "hint_available" && session.struggleLogs.length === 0
        }
      />
      <MilitaryTrainingContext />
    </div>
  );
}
