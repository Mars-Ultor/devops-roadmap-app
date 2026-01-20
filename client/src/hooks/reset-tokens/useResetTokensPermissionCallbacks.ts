/**
 * Reset Tokens Permission Callbacks Hook
 * Handles permission checking operations
 */

import { useCallback } from "react";
import type { TokenAllocation, ResetToken, TokenType, TokenConfig } from "../../types/tokens";
import { checkCanReset } from "./resetTokensUtils";

interface ResetTokensPermissionCallbacksParams {
  currentAllocation: TokenAllocation | null;
  recentResets: ResetToken[];
  config: TokenConfig;
}

export function useResetTokensPermissionCallbacks({
  currentAllocation,
  recentResets,
  config,
}: ResetTokensPermissionCallbacksParams) {
  const canReset = useCallback(
    (type: TokenType) =>
      checkCanReset(
        currentAllocation,
        recentResets,
        type,
        config.resetCooldownMinutes,
      ),
    [currentAllocation, recentResets, config.resetCooldownMinutes],
  );

  return { canReset };
}