/**
 * Recertification Callbacks Hook
 * Orchestrates all recertification callback operations
 */

import { useRecertificationAnalysisCallbacks } from "./useRecertificationAnalysisCallbacks";
import { useRecertificationStatusCallbacks } from "./useRecertificationStatusCallbacks";
import type { RecertificationStatus } from "./recertificationUtils";

interface RecertificationCallbacksParams {
  userId: string | undefined;
  setStatus: (status: RecertificationStatus | null) => void;
  setLoading: (loading: boolean) => void;
}

export function useRecertificationCallbacks({
  userId,
  setStatus,
  setLoading,
}: RecertificationCallbacksParams) {
  const { analyzeSkillDecay } = useRecertificationAnalysisCallbacks({ userId });

  const { checkRecertificationStatus, completeRecertification } =
    useRecertificationStatusCallbacks({
      userId,
      setStatus,
      setLoading,
      analyzeSkillDecay,
    });

  return {
    checkRecertificationStatus,
    completeRecertification,
  };
}