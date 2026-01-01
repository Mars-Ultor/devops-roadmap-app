/**
 * Constraint Display Component
 * Shows current week's constraints and remaining resources
 * Phase 8: Progressive Constraints
 */

import { Shield, AlertTriangle, Lightbulb, RotateCcw, Copy } from 'lucide-react';
import { ProgressiveConstraintsManager } from '../../services/progressiveConstraints';

interface ConstraintDisplayProps {
  weekNumber: number;
  hintsUsed: number;
  resetsUsed: number;
}

export default function ConstraintDisplay({ weekNumber, hintsUsed, resetsUsed }: ConstraintDisplayProps) {
  const status = ProgressiveConstraintsManager.getConstraintStatus(weekNumber, hintsUsed, resetsUsed);
  const badge = ProgressiveConstraintsManager.getConstraintBadge(weekNumber);
  const warning = ProgressiveConstraintsManager.getWarningMessage(weekNumber, hintsUsed, resetsUsed);

  return (
    <div className="bg-slate-800 rounded-lg border-2 border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          Training Constraints
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
          {badge.icon} {badge.label}
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4">{status.level.description}</p>

      {/* Warning Banner */}
      {warning && (
        <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-300 text-sm font-medium">{warning}</p>
          </div>
        </div>
      )}

      {/* Resource Counters */}
      <div className="grid grid-cols-2 gap-4">
        {/* Hints */}
        <div className={`rounded-lg p-4 border-2 ${
          status.hintsRemaining === 0
            ? 'bg-red-900/20 border-red-600'
            : status.hintsRemaining === 1
            ? 'bg-yellow-900/20 border-yellow-600'
            : 'bg-slate-900/50 border-slate-600'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className={`w-5 h-5 ${
              status.hintsRemaining === 0 ? 'text-red-400' :
              status.hintsRemaining === 1 ? 'text-yellow-400' :
              'text-blue-400'
            }`} />
            <span className="text-white font-semibold">Hints</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${
              status.hintsRemaining === 0 ? 'text-red-400' :
              status.hintsRemaining === 1 ? 'text-yellow-400' :
              'text-white'
            }`}>
              {status.hintsRemaining === Infinity ? '∞' : status.hintsRemaining}
            </span>
            {status.level.maxHints !== Infinity && (
              <span className="text-gray-400">/ {status.level.maxHints}</span>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {status.hintsUsed} used
          </div>
        </div>

        {/* Resets */}
        <div className={`rounded-lg p-4 border-2 ${
          status.resetsRemaining === 0
            ? 'bg-red-900/20 border-red-600'
            : status.resetsRemaining <= 2
            ? 'bg-yellow-900/20 border-yellow-600'
            : 'bg-slate-900/50 border-slate-600'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className={`w-5 h-5 ${
              status.resetsRemaining === 0 ? 'text-red-400' :
              status.resetsRemaining <= 2 ? 'text-yellow-400' :
              'text-green-400'
            }`} />
            <span className="text-white font-semibold">Resets</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${
              status.resetsRemaining === 0 ? 'text-red-400' :
              status.resetsRemaining <= 2 ? 'text-yellow-400' :
              'text-white'
            }`}>
              {status.resetsRemaining === Infinity ? '∞' : status.resetsRemaining}
            </span>
            {status.level.maxResets !== Infinity && (
              <span className="text-gray-400">/ {status.level.maxResets}</span>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {status.resetsUsed} used
          </div>
        </div>
      </div>

      {/* Copy-Paste Blocking Notice */}
      {status.level.copyPasteBlocked && (
        <div className="mt-4 bg-red-900/20 border border-red-600 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Copy className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-300 text-sm font-medium mb-1">
                Copy-Paste Blocked
              </p>
              <p className="text-red-200 text-xs">
                You must type all commands and code manually. This builds muscle memory and prevents dependency on copy-paste.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Phase Progression Info */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Weeks 1-4: Unlimited support</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span>Weeks 5-8: 3 hints, 5 resets</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Weeks 9-12: 1 hint, 2 resets, no copy-paste</span>
          </div>
        </div>
      </div>
    </div>
  );
}
