/**
 * Battle Drill Effects Hook
 * Extracted useEffect logic for drill loading and timer
 */

import { useEffect } from "react";
import { getDrill } from "../../services/drillService";
import { buildCoachContext } from "../../services/aiCoach";
import type { BattleDrill } from "../../types";
import type { UserProfile } from "../../store/authStore";
import type { BattleDrillPerformance } from "../../types/training";
import type { CoachContext } from "../../services/aiCoach";

interface DrillEffectsState {
  drill: BattleDrill | null;
  sessionStarted: boolean;
  sessionComplete: boolean;
  completedSteps: Set<number>;
  showHints: Set<number>;
  elapsedSeconds: number;
}

interface DrillEffectsCallbacks {
  setDrill: (drill: BattleDrill | null) => void;
  setPerformance: (performance: BattleDrillPerformance | null) => void;
  setElapsedSeconds: React.Dispatch<React.SetStateAction<number>>;
  setCoachContext: (context: CoachContext | null) => void;
}

export function useBattleDrillEffects(
  drillId: string | undefined,
  user: UserProfile | null,
  state: DrillEffectsState,
  callbacks: DrillEffectsCallbacks,
) {
  // Load drill effect
  useEffect(() => {
    const loadDrill = async () => {
      if (!drillId) return;
      try {
        const d = await getDrill(drillId);
        callbacks.setDrill(d);
        callbacks.setPerformance(d.performance || null);
      } catch (e) {
        console.error("Error loading drill:", e);
      }
    };
    loadDrill();
  }, [drillId, callbacks]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.sessionStarted && !state.sessionComplete)
      interval = setInterval(() => callbacks.setElapsedSeconds((p) => p + 1), 1000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.sessionStarted, state.sessionComplete, callbacks]);

  // Coach context effect
  useEffect(() => {
    const buildContext = async () => {
      if (!state.drill || !user || !state.sessionStarted) return;
      try {
        const ctx = await buildCoachContext(user.uid, state.drill.id, "drill", {
          drillTitle: state.drill.title,
          currentStep: state.completedSteps.size,
          totalSteps: state.drill.steps.length,
          elapsedTime: state.elapsedSeconds,
          targetTime: state.drill.targetTimeSeconds,
          hintsUsed: state.showHints.size,
          completedSteps: Array.from(state.completedSteps),
          difficulty: state.drill.difficulty,
          category: state.drill.category,
        });
        callbacks.setCoachContext(ctx);
      } catch (e) {
        console.error("Error building coach context:", e);
      }
    };
    buildContext();
  }, [state.drill, user, state.sessionStarted, state.completedSteps, state.elapsedSeconds, state.showHints, callbacks]);
}