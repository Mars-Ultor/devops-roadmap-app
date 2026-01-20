/**
 * Hook for managing battle drill attempts and performance - Refactored
 */

import { useBattleDrillState } from "./battle-drill/useBattleDrillState";
import { useBattleDrillEffects } from "./battle-drill/useBattleDrillEffects";
import { useBattleDrillCallbacks } from "./battle-drill/useBattleDrillCallbacks";

export function useBattleDrill(drillId?: string) {
  // Use extracted state hook
  const state = useBattleDrillState();

  // Use extracted effects hook
  const { loadPerformance } = useBattleDrillEffects({
    drillId,
    setters: {
      setPerformance: state.setPerformance,
      setLoading: state.setLoading,
      setCurrentAttempt: state.setCurrentAttempt,
    },
  });

  // Use extracted callbacks hook
  const {
    startAttempt,
    completeAttempt,
    recordHintUsed,
    recordStepCompleted,
  } = useBattleDrillCallbacks({
    state,
    setters: {
      setPerformance: state.setPerformance,
      setCurrentAttempt: state.setCurrentAttempt,
    },
  });

  return {
    performance: state.performance,
    loading: state.loading,
    currentAttempt: state.currentAttempt,
    startAttempt,
    completeAttempt,
    recordHintUsed,
    recordStepCompleted,
    refreshPerformance: loadPerformance,
  };
}
