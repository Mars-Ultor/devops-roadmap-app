/**
 * Reset Token Management Hook - Refactored
 * Enforces weekly reset limits and cooldowns
 */

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import type { TokenConfig } from "../types/tokens";
import { DEFAULT_TOKEN_CONFIG } from "../types/tokens";
import { useResetTokensState } from "./reset-tokens/useResetTokensState";
import { useResetTokensCallbacks } from "./reset-tokens/useResetTokensCallbacks";

export function useResetTokens(config: TokenConfig = DEFAULT_TOKEN_CONFIG) {
  const { user } = useAuthStore();

  // Use extracted state hook
  const {
    currentAllocation,
    setCurrentAllocation,
    recentResets,
    setRecentResets,
    loading,
    setLoading,
  } = useResetTokensState();

  // Use extracted callbacks hook
  const {
    loadTokenAllocation,
    loadRecentResets,
    canReset,
    useResetToken,
    getRemainingTokens,
    getUsageStats,
  } = useResetTokensCallbacks({
    userId: user?.uid,
    config,
    currentAllocation,
    recentResets,
    setCurrentAllocation,
    setRecentResets,
    setLoading,
  });

  useEffect(() => {
    if (user?.uid) {
      loadTokenAllocation();
      loadRecentResets();
    }
  }, [user?.uid, loadTokenAllocation, loadRecentResets]);

  return {
    currentAllocation,
    recentResets,
    loading,
    canReset,
    useResetToken,
    getRemainingTokens,
    getUsageStats,
    refreshAllocation: loadTokenAllocation,
  };
}
