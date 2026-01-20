/**
 * Failure Log Hook - Refactored
 * Track all failures with context, resolution, and pattern detection
 */

import { useAuthStore } from "../store/authStore";
import { useFailureLogState } from "./failure-log/useFailureLogState";
import { useFailureLogCallbacks } from "./failure-log/useFailureLogCallbacks";

interface UseFailureLogReturn {
  logFailure: (
    failureData: Omit<
      FailureLog,
      "id" | "userId" | "timestamp" | "isRecurring" | "previousOccurrences"
    >,
  ) => Promise<string>;
  updateFailure: (
    failureId: string,
    updates: Partial<
      Pick<
        FailureLog,
        | "rootCause"
        | "resolution"
        | "preventionStrategy"
        | "lessonsLearned"
        | "resolvedAt"
      >
    >,
  ) => Promise<void>;
  getFailureLogs: (
    contentId?: string,
    category?: FailureCategory,
  ) => Promise<FailureLog[]>;
  detectPatterns: () => Promise<FailurePattern[]>;
  loading: boolean;
}

export function useFailureLog(): UseFailureLogReturn {
  const { user } = useAuthStore();

  // Use extracted state hook
  const { loading, setLoading } = useFailureLogState();

  // Use extracted callbacks hook
  const { logFailure, updateFailure, getFailureLogs, detectPatterns } =
    useFailureLogCallbacks({
      userId: user?.uid,
      setLoading,
    });

  return {
    logFailure,
    updateFailure,
    getFailureLogs,
    detectPatterns,
    loading,
  };
}
