/**
 * Reset Tokens Callbacks Hook
 * Orchestrates all reset token callback operations
 */

import { useResetTokensLoadCallbacks } from "./useResetTokensLoadCallbacks";
import { useResetTokensActionCallbacks } from "./useResetTokensActionCallbacks";
import type { TokenAllocation, ResetToken, TokenConfig } from "../../types/tokens";

interface ResetTokensCallbacksParams {
  userId: string | undefined;
  config: TokenConfig;
  currentAllocation: TokenAllocation | null;
  recentResets: ResetToken[];
  setCurrentAllocation: (allocation: TokenAllocation | null) => void;
  setRecentResets: (resets: ResetToken[]) => void;
  setLoading: (loading: boolean) => void;
}

export function useResetTokensCallbacks({
  userId,
  config,
  currentAllocation,
  recentResets,
  setCurrentAllocation,
  setRecentResets,
  setLoading,
}: ResetTokensCallbacksParams) {
  const { loadTokenAllocation, loadRecentResets } = useResetTokensLoadCallbacks({
    userId,
    config,
    setCurrentAllocation,
    setRecentResets,
    setLoading,
  });

  const { canReset, useResetToken, getRemainingTokens, getUsageStats } =
    useResetTokensActionCallbacks({
      userId,
      currentAllocation,
      recentResets,
      config,
      setCurrentAllocation,
      loadRecentResets,
    });

  return {
    loadTokenAllocation,
    loadRecentResets,
    canReset,
    useResetToken,
    getRemainingTokens,
    getUsageStats,
  };
}