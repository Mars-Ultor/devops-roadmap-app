/**
 * Failure Log Callbacks Hook
 * Orchestrates all failure logging callback operations
 */

import { useFailureLogCreateCallbacks } from "./useFailureLogCreateCallbacks";
import { useFailureLogUpdateCallbacks } from "./useFailureLogUpdateCallbacks";
import { useFailureLogQueryCallbacks } from "./useFailureLogQueryCallbacks";

interface FailureLogCallbacksParams {
  userId: string | undefined;
  setLoading: (loading: boolean) => void;
}

export function useFailureLogCallbacks({ userId, setLoading }: FailureLogCallbacksParams) {
  const { logFailure } = useFailureLogCreateCallbacks({ userId, setLoading });
  const { updateFailure } = useFailureLogUpdateCallbacks({ userId, setLoading });
  const { getFailureLogs, detectPatterns } = useFailureLogQueryCallbacks({ userId, setLoading });

  return {
    logFailure,
    updateFailure,
    getFailureLogs,
    detectPatterns,
  };
}