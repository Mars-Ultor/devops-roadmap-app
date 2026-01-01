/**
 * Reset Confirmation Modal
 * Warns user about token usage before resetting
 */

import { useState } from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import type { TokenType } from '../../types/tokens';

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

  const getTypeLabel = () => {
    switch (type) {
      case 'quiz-reset': return 'Quiz';
      case 'lab-reset': return 'Lab';
      case 'battle-drill-reset': return 'Battle Drill';
    }
  };

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason('');
    setAcknowledged(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Confirm Reset</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {cooldownActive ? (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-red-400 mb-1">Cooldown Active</div>
                  <p className="text-sm text-red-300">
                    You must wait <span className="font-semibold">{cooldownMinutes} more minutes</span> before using another reset token.
                    This prevents rapid consecutive resets and encourages learning from mistakes.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <p className="text-gray-300">
                  You are about to reset <span className="font-semibold text-white">{itemTitle}</span>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Type: <span className="text-white">{getTypeLabel()}</span>
                </p>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-yellow-400 mb-1">Token Usage</div>
                    <p className="text-sm text-yellow-300">
                      {remainingTokens === 1 ? (
                        <>This is your <span className="font-semibold">last reset</span> for this week. Resets refresh every Monday.</>
                      ) : (
                        <>You have <span className="font-semibold">{remainingTokens - 1} resets</span> remaining after this.</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-red-400 mb-2">Military Training Philosophy</div>
                    <ul className="text-sm text-red-300 space-y-1">
                      <li>• Resets are limited to simulate real-world consequences</li>
                      <li>• Failures are learning opportunities</li>
                      <li>• Review your After Action Report before resetting</li>
                      <li>• Consider waiting 30 minutes to reflect on mistakes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Why are you resetting? (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., I misunderstood the question, I need to try a different approach..."
                  className="w-full h-20 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recording your reason helps track learning patterns
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acknowledge"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="acknowledge" className="text-sm text-gray-300 cursor-pointer">
                  I understand this will use one of my limited reset tokens and I have reviewed my failure analysis
                </label>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          {!cooldownActive && (
            <button
              onClick={handleConfirm}
              disabled={!acknowledged}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
            >
              Use Reset Token
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
