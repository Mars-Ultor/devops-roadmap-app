/**
 * Sub-components for ConstraintDisplay
 */

import { Shield, AlertTriangle, Lightbulb, RotateCcw, Copy } from 'lucide-react';
import { 
  getHintsStyle, 
  getResetsStyle, 
  formatResourceValue,
  PHASE_PROGRESSION 
} from './ConstraintDisplayUtils';

interface HeaderProps {
  readonly badgeColor: string;
  readonly badgeIcon: string;
  readonly badgeLabel: string;
}

export function ConstraintHeader({ badgeColor, badgeIcon, badgeLabel }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Shield className="w-5 h-5 text-indigo-400" />
        Training Constraints
      </h3>
      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor}`}>
        {badgeIcon} {badgeLabel}
      </div>
    </div>
  );
}

interface WarningBannerProps {
  readonly message: string;
}

export function WarningBanner({ message }: WarningBannerProps) {
  return (
    <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-3 mb-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-yellow-300 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

interface HintsCounterProps {
  readonly hintsRemaining: number;
  readonly maxHints: number;
  readonly hintsUsed: number;
}

export function HintsCounter({ hintsRemaining, maxHints, hintsUsed }: HintsCounterProps) {
  const style = getHintsStyle(hintsRemaining);
  
  return (
    <div className={`rounded-lg p-4 border-2 ${style.container}`}>
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className={`w-5 h-5 ${style.icon}`} />
        <span className="text-white font-semibold">Hints</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${style.value}`}>
          {formatResourceValue(hintsRemaining)}
        </span>
        {maxHints !== Infinity && (
          <span className="text-gray-400">/ {maxHints}</span>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {hintsUsed} used
      </div>
    </div>
  );
}

interface ResetsCounterProps {
  readonly resetsRemaining: number;
  readonly maxResets: number;
  readonly resetsUsed: number;
}

export function ResetsCounter({ resetsRemaining, maxResets, resetsUsed }: ResetsCounterProps) {
  const style = getResetsStyle(resetsRemaining);
  
  return (
    <div className={`rounded-lg p-4 border-2 ${style.container}`}>
      <div className="flex items-center gap-2 mb-2">
        <RotateCcw className={`w-5 h-5 ${style.icon}`} />
        <span className="text-white font-semibold">Resets</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${style.value}`}>
          {formatResourceValue(resetsRemaining)}
        </span>
        {maxResets !== Infinity && (
          <span className="text-gray-400">/ {maxResets}</span>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {resetsUsed} used
      </div>
    </div>
  );
}

export function CopyPasteBlockedNotice() {
  return (
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
  );
}

export function PhaseProgressionInfo() {
  return (
    <div className="mt-4 pt-4 border-t border-slate-700">
      <div className="text-xs text-gray-400 space-y-1">
        {PHASE_PROGRESSION.map((phase) => (
          <div key={phase.label} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${phase.color}`}></span>
            <span>{phase.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
