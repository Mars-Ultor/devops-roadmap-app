/**
 * Recertification System Hook - Refactored
 * Tracks skill decay and requires monthly re-testing
 */

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useRecertificationState } from "./recertification/useRecertificationState";
import { useRecertificationCallbacks } from "./recertification/useRecertificationCallbacks";

export function useRecertification() {
  const { user } = useAuthStore();

  // Use extracted state hook
  const { status, setStatus, loading, setLoading } = useRecertificationState();

  // Use extracted callbacks hook
  const { checkRecertificationStatus, completeRecertification } =
    useRecertificationCallbacks({
      userId: user?.uid,
      setStatus,
      setLoading,
    });

  useEffect(() => {
    if (user) checkRecertificationStatus();
  }, [user, checkRecertificationStatus]);

  return {
    status,
    loading,
    checkRecertificationStatus,
    completeRecertification,
  };
}
