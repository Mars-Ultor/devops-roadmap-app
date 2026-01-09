/**
 * ResetConfirmationModalComponents - Extracted UI components for ResetConfirmationModal
 * NOTE: Utility functions moved to ResetTokenUtils.ts for fast-refresh compliance
 */

import { AlertTriangle, RefreshCw, X } from 'lucide-react';

// ============================================================================
// Modal Header
// ============================================================================

interface ModalHeaderProps {
  readonly onClose: () => void;
}

export function ConfirmationModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-700">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Confirm Reset</h2>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

// ============================================================================
// Cooldown Warning
// ============================================================================

interface CooldownWarningProps {
  readonly cooldownMinutes: number;
}

export function CooldownWarning({ cooldownMinutes }: CooldownWarningProps) {
  return (
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
  );
}

// ============================================================================
// Token Usage Warning
// ============================================================================

interface TokenUsageWarningProps {
  readonly remainingTokens: number;
}

export function TokenUsageWarning({ remainingTokens }: TokenUsageWarningProps) {
  return (
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
  );
}

// ============================================================================
// Military Philosophy Warning
// ============================================================================

export function MilitaryPhilosophyWarning() {
  return (
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
  );
}

// ============================================================================
// Reason Input
// ============================================================================

interface ReasonInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function ReasonInput({ value, onChange }: ReasonInputProps) {
  return (
    <div>
      <label htmlFor="reset-reason" className="block text-sm font-medium text-gray-300 mb-2">
        Why are you resetting? (Optional)
      </label>
      <textarea
        id="reset-reason"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., I misunderstood the question, I need to try a different approach..."
        className="w-full h-20 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 text-sm"
      />
      <p className="text-xs text-gray-500 mt-1">Recording your reason helps track learning patterns</p>
    </div>
  );
}

// ============================================================================
// Acknowledgment Checkbox
// ============================================================================

interface AcknowledgmentCheckboxProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
}

export function AcknowledgmentCheckbox({ checked, onChange }: AcknowledgmentCheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id="acknowledge"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
      />
      <label htmlFor="acknowledge" className="text-sm text-gray-300 cursor-pointer">
        I understand this will use one of my limited reset tokens and I have reviewed my failure analysis
      </label>
    </div>
  );
}

// ============================================================================
// Modal Actions
// ============================================================================

interface ModalActionsProps {
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly canConfirm: boolean;
  readonly showConfirm: boolean;
}

export function ConfirmationModalActions({ onClose, onConfirm, canConfirm, showConfirm }: ModalActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
      >
        Cancel
      </button>
      {showConfirm && (
        <button
          onClick={onConfirm}
          disabled={!canConfirm}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
        >
          Use Reset Token
        </button>
      )}
    </div>
  );
}
