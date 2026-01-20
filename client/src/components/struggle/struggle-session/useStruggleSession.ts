/**
 * useStruggleSession - Custom hook for managing struggle session state and effects
 */

import { useState, useEffect, useCallback } from "react";
import { HintService } from "../../../services/HintService";
import type { StruggleSession, StruggleLog } from "../../../types/struggle";
import type { SessionPhase } from "./StruggleSessionComponents";

interface UseStruggleSessionProps {
  labId: string;
  userId: string;
  availableHints: string[];
  onSessionComplete: (session: StruggleSession) => void;
  onHintUsed: (hint: string) => void;
}

interface UseStruggleSessionReturn {
  session: StruggleSession | null;
  currentPhase: SessionPhase;
  showStruggleLogForm: boolean;
  currentHint: string | null;
  isSubmittingLog: boolean;
  handleHintRequest: () => void;
  handleStruggleLogSubmit: (
    logData: Omit<StruggleLog, "id" | "timestamp">,
  ) => Promise<void>;
  handleStruggleLogCancel: () => void;
  setShowStruggleLogForm: (show: boolean) => void;
}

export function useStruggleSession({
  labId,
  userId,
  availableHints,
  onSessionComplete,
  onHintUsed,
}: UseStruggleSessionProps): UseStruggleSessionReturn {
  const [session, setSession] = useState<StruggleSession | null>(null);
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>("struggling");
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
      setSession((prev) => {
        if (!prev) return prev;
        const updatedTimerState = hintService.updateTimer(prev);
        return { ...prev, timerState: updatedTimerState };
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
      setCurrentPhase("completed");
      onSessionComplete(session);
    } else if (canRequestHint && !showStruggleLogForm) {
      setCurrentPhase("hint_available");
    } else if (session.timerState.isLocked) {
      setCurrentPhase("struggling");
    }
  }, [session, showStruggleLogForm, hintService, onSessionComplete]);

  const handleHintRequest = useCallback(() => {
    if (!session) return;
    if (session.struggleLogs.length === 0) {
      setShowStruggleLogForm(true);
      setCurrentPhase("logging");
      return;
    }
    const { session: updatedSession, hint } = hintService.requestHint(session);
    setSession(updatedSession);
    if (hint) {
      setCurrentHint(hint);
      onHintUsed(hint);
    }
  }, [session, hintService, onHintUsed]);

  const handleStruggleLogSubmit = useCallback(
    async (logData: Omit<StruggleLog, "id" | "timestamp">) => {
      if (!session) return;
      setIsSubmittingLog(true);
      try {
        const updatedSession = hintService.submitStruggleLog(session, logData);
        setSession(updatedSession);
        setShowStruggleLogForm(false);
        setCurrentPhase("hint_available");
      } catch (error) {
        console.error("Failed to submit struggle log:", error);
      } finally {
        setIsSubmittingLog(false);
      }
    },
    [session, hintService],
  );

  const handleStruggleLogCancel = useCallback(() => {
    setShowStruggleLogForm(false);
    setCurrentPhase(
      session?.timerState.canRequestHints ? "hint_available" : "struggling",
    );
  }, [session]);

  return {
    session,
    currentPhase,
    showStruggleLogForm,
    currentHint,
    isSubmittingLog,
    handleHintRequest,
    handleStruggleLogSubmit,
    handleStruggleLogCancel,
    setShowStruggleLogForm,
  };
}
