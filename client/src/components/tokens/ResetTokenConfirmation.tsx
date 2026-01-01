/**
 * Reset Token Confirmation Modal
 * Phase 10: Prominent display, confirmation modal, weekly refresh, usage tracking
 */

import { useState } from 'react';
import { AlertTriangle, RefreshCw, Calendar, TrendingDown, X } from 'lucide-react';
import type { TokenAllocation } from '../../types/tokens';

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

  const getTokenInfo = () => {
    switch (type) {
      case 'quiz':
        return {
          total: allocation.quizResets,
          used: allocation.quizResetsUsed,
          label: 'Quiz Reset',
          color: 'blue'
        };
      case 'lab':
        return {
          total: allocation.labResets,
          used: allocation.labResetsUsed,
          label: 'Lab Reset',
          color: 'purple'
        };
      case 'battleDrill':
        return {
          total: allocation.battleDrillResets,
          used: allocation.battleDrillResetsUsed,
          label: 'Battle Drill Reset',
          color: 'green'
        };
    }
  };

  const info = getTokenInfo();
  const remaining = info.total - info.used;

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

  // Calculate days until next Monday
  const getDaysUntilRefresh = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    return daysUntilMonday;
  };

  const daysUntilRefresh = getDaysUntilRefresh();

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border-2 border-yellow-500 max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-900/50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Use Reset Token?</h2>
                <p className="text-yellow-300 text-sm">Think carefully before proceeding</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Token Status */}
          <div className="bg-yellow-900/20 border-2 border-yellow-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{info.label} Tokens</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400">{remaining}</div>
                <div className="text-xs text-yellow-300">remaining</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{info.used} / {info.total} used this week</span>
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Refreshes in {daysUntilRefresh} days
              </span>
            </div>
          </div>

          {/* Content Info */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <p className="text-sm text-slate-400 mb-1">You're about to reset:</p>
            <p className="text-white font-semibold">{contentTitle}</p>
          </div>

          {/* Warning Messages */}
          <div className="space-y-3">
            <div className="bg-red-900/30 border-2 border-red-600 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingDown className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-red-300 font-semibold mb-2">⚠️ Why Resets Are Limited</h3>
                  <ul className="text-red-200 text-sm space-y-1 list-disc list-inside">
                    <li><strong>Prevents trial-and-error learning:</strong> Random guessing doesn't build real skills</li>
                    <li><strong>Forces problem-solving:</strong> You must think through failures instead of restarting</li>
                    <li><strong>Builds resilience:</strong> Real-world production doesn't have "reset" buttons</li>
                    <li><strong>Encourages preparation:</strong> Study before attempting, not after failing</li>
                  </ul>
                </div>
              </div>
            </div>

            {remaining <= 2 && (
              <div className="bg-orange-900/30 border-2 border-orange-600 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-orange-300 font-medium mb-1">Running Low on Tokens!</p>
                    <p className="text-orange-200 text-sm">
                      You have {remaining} reset(s) left. Consider reviewing material before using your last tokens.
                      Next refresh: <strong>{daysUntilRefresh} days</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {remaining === 1 && (
              <div className="bg-red-900/30 border-2 border-red-600 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-red-300 font-bold mb-1">🚨 LAST RESET TOKEN!</p>
                    <p className="text-red-200 text-sm">
                      This is your final reset for the week. After this, you must complete content without restarting.
                      Are you absolutely sure you need to reset?
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alternatives */}
          <div className="bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
            <h3 className="text-indigo-300 font-semibold mb-2">💡 Alternatives to Consider:</h3>
            <ul className="text-indigo-200 text-sm space-y-1 list-disc list-inside">
              <li>Review lesson notes and documentation</li>
              <li>Use remaining hints (doesn't consume reset tokens)</li>
              <li>Consult the failure log for similar issues</li>
              <li>Take a break and return with fresh perspective</li>
              <li>Document current approach in AAR before resetting</li>
            </ul>
          </div>

          {/* Confirmation Checkbox */}
          <div className="bg-slate-900/50 rounded-lg p-4 border-2 border-slate-600">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={understood}
                onChange={(e) => setUnderstood(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-slate-500 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-800"
              />
              <div className="flex-1">
                <p className="text-white font-medium mb-1">
                  I understand the consequences
                </p>
                <p className="text-slate-400 text-sm">
                  I have reviewed alternatives and still need to reset. I understand this will consume
                  one of my {info.total} weekly reset tokens and cannot be undone.
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel (Recommended)
            </button>
            <button
              onClick={handleConfirm}
              disabled={!understood || confirming}
              className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {confirming ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Resetting...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Use Reset Token ({remaining - 1} left after)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
