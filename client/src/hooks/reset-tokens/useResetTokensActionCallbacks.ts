/**
 * Reset Tokens Action Callbacks Hook
 * Orchestrates action operations using smaller focused hooks
 */

import { useResetTokensPermissionCallbacks } from "./useResetTokensPermissionCallbacks";
import { useResetTokensUsageCallbacks } from "./useResetTokensUsageCallbacks";
import type { TokenAllocation, ResetToken, TokenConfig } from "../../types/tokens";

interface ResetTokensActionCallbacksParams {
  userId: string | undefined;
  currentAllocation: TokenAllocation | null;
  recentResets: ResetToken[];
  config: TokenConfig;
  setCurrentAllocation: (allocation: TokenAllocation | null) => void;
  loadRecentResets: () => Promise<void>;
}

export function useResetTokensActionCallbacks({
  userId,
  currentAllocation,
  recentResets,
  config,
  setCurrentAllocation,
  loadRecentResets,
}: ResetTokensActionCallbacksParams) {
  const { canReset } = useResetTokensPermissionCallbacks({
    currentAllocation,
    recentResets,
    config,
  });

  const { useResetToken, getRemainingTokens, getUsageStats } =
    useResetTokensUsageCallbacks({
      userId,
      currentAllocation,
      setCurrentAllocation,
      loadRecentResets,
      canReset,
    });

  return {
    canReset,
    useResetToken,
    getRemainingTokens,
    getUsageStats,
  };
}