/**
 * Reset Token Confirmation Modal
 * Phase 10: Prominent display, confirmation modal, weekly refresh, usage tracking
 */

import { useState } from 'react';
import type { TokenAllocation } from '../../types/tokens';

// Import extracted components and utilities
import {
  getTokenInfo,
  getDaysUntilRefresh,
  ModalHeader,
  TokenStatusDisplay,
  ContentInfoDisplay,
  ResetLimitWarning,
  LowTokensWarning,
  LastTokenWarning,
  AlternativesSection,
  ConfirmationCheckbox,
  ActionButtons
} from './reset-token/ResetTokenComponents';

interface ResetTokenConfirmationProps {
  allocation: TokenAllocation;
  type: 'quiz' | 'lab' | 'battleDrill';
  contentTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function ResetTokenConfirmation({
  allocation,
  type,
  contentTitle,
  onConfirm,
  onCancel
}: ResetTokenConfirmationProps) {
  const [confirming, setConfirming] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const info = getTokenInfo(allocation, type);
  const remaining = info.total - info.used;
  const daysUntilRefresh = getDaysUntilRefresh();

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error using reset token:', error);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border-2 border-yellow-500 max-w-2xl w-full shadow-2xl">
        <ModalHeader onClose={onCancel} />
        <div className="p-6 space-y-6">
          <TokenStatusDisplay info={info} remaining={remaining} daysUntilRefresh={daysUntilRefresh} />
          <ContentInfoDisplay contentTitle={contentTitle} />
          <div className="space-y-3">
            <ResetLimitWarning />
            <LowTokensWarning remaining={remaining} daysUntilRefresh={daysUntilRefresh} />
            {remaining === 1 && <LastTokenWarning />}
          </div>
          <AlternativesSection />
          <ConfirmationCheckbox checked={understood} onChange={setUnderstood} totalTokens={info.total} />
          <ActionButtons
            onCancel={onCancel}
            onConfirm={handleConfirm}
            canConfirm={understood}
            confirming={confirming}
            remainingAfter={remaining - 1}
          />
        </div>
      </div>
    </div>
  );
}
