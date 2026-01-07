/**
 * Reset Confirmation Modal
 * Warns user about token usage before resetting
 */

import { useState } from 'react';
import type { TokenType } from '../../types/tokens';

// Import extracted components
import {
  getTypeLabel,
  ConfirmationModalHeader,
  CooldownWarning,
  TokenUsageWarning,
  MilitaryPhilosophyWarning,
  ReasonInput,
  AcknowledgmentCheckbox,
  ConfirmationModalActions
} from './reset-token/ResetConfirmationModalComponents';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  itemTitle: string;
  type: TokenType;
  remainingTokens: number;
  cooldownActive?: boolean;
  cooldownMinutes?: number;
}

export default function ResetConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  type,
  remainingTokens,
  cooldownActive = false,
  cooldownMinutes = 0
}: ResetConfirmationModalProps) {
  const [reason, setReason] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason('');
    setAcknowledged(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full">
        <ConfirmationModalHeader onClose={onClose} />
        <div className="p-6 space-y-4">
          {cooldownActive ? (
            <CooldownWarning cooldownMinutes={cooldownMinutes} />
          ) : (
            <>
              <div>
                <p className="text-gray-300">
                  You are about to reset <span className="font-semibold text-white">{itemTitle}</span>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Type: <span className="text-white">{getTypeLabel(type)}</span>
                </p>
              </div>
              <TokenUsageWarning remainingTokens={remainingTokens} />
              <MilitaryPhilosophyWarning />
              <ReasonInput value={reason} onChange={setReason} />
              <AcknowledgmentCheckbox checked={acknowledged} onChange={setAcknowledged} />
            </>
          )}
        </div>
        <ConfirmationModalActions
          onClose={onClose}
          onConfirm={handleConfirm}
          canConfirm={acknowledged}
          showConfirm={!cooldownActive}
        />
      </div>
    </div>
  );
}
