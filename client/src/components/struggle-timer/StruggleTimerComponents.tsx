/**
 * Struggle Timer Sub-Components
 * Extracted from StruggleTimer.tsx for ESLint compliance
 */

import { Lock, Unlock, AlertCircle, CheckCircle, FileText } from "lucide-react";

export interface StruggleLog {
  attemptedSolutions: string[];
  stuckPoint: string;
  hypothesis: string;
  submittedAt: Date;
}

// Hints Unlocked Banner
export function HintsUnlockedBanner() {
  return (
    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <Unlock className="w-6 h-6 text-green-400 mr-3" />
        <div>
          <h3 className="text-lg font-semibold text-white">Hints Available</h3>
          <p className="text-green-300 text-sm">
            You've earned access to hints after struggling independently.
            Remember: each hint comes with a 5-minute cooldown.
          </p>
        </div>
      </div>
    </div>
  );
}

// Timer Header Component
interface TimerHeaderProps {
  readonly timeRemaining: number;
  readonly strugglesLogged: boolean;
  readonly formatTime: (ms: number) => string;
}

export function TimerHeader({
  timeRemaining,
  strugglesLogged,
  formatTime,
}: TimerHeaderProps) {
  return (
    <div className="p-4 border-b border-yellow-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Lock className="w-6 h-6 text-yellow-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-white">
              Struggle Session Active
            </h3>
            <p className="text-yellow-300 text-sm">
              Hints unlock in:{" "}
              <span className="font-mono font-bold text-yellow-400">
                {formatTime(timeRemaining)}
              </span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-yellow-400">
            {strugglesLogged ? (
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Struggles logged
              </span>
            ) : (
              <span className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Documentation required
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Why Wait Info Section
export function WhyWaitInfo() {
  return (
    <div className="p-4 bg-slate-800/50 border-b border-yellow-700">
      <h4 className="text-white font-semibold mb-2">Why the wait?</h4>
      <ul className="space-y-2 text-sm text-slate-300">
        <li className="flex items-start">
          <span className="text-yellow-400 mr-2">•</span>
          <span>
            <strong className="text-white">Independent Problem-Solving:</strong>{" "}
            Real DevOps requires working without immediate help
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-yellow-400 mr-2">•</span>
          <span>
            <strong className="text-white">Deeper Learning:</strong> Struggling
            builds neural pathways that hints bypass
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-yellow-400 mr-2">•</span>
          <span>
            <strong className="text-white">Document Your Process:</strong>{" "}
            Writing down attempts clarifies thinking
          </span>
        </li>
      </ul>
    </div>
  );
}

// Document Struggle Button
interface DocumentButtonProps {
  readonly onClick: () => void;
}

export function DocumentStruggleButton({ onClick }: DocumentButtonProps) {
  return (
    <div className="p-4">
      <button
        onClick={onClick}
        className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all flex items-center justify-center"
      >
        <FileText className="w-5 h-5 mr-2" />
        Document Your Struggle (Required)
      </button>
      <p className="text-center text-slate-400 text-xs mt-2">
        Must document attempts before hints unlock
      </p>
    </div>
  );
}

// Struggle Form Component
interface StruggleFormProps {
  readonly struggles: Partial<StruggleLog>;
  readonly onUpdateAttempt: (index: number, value: string) => void;
  readonly onUpdateStuckPoint: (value: string) => void;
  readonly onUpdateHypothesis: (value: string) => void;
  readonly onSubmit: () => void;
  readonly onCancel: () => void;
}

export function StruggleForm({
  struggles,
  onUpdateAttempt,
  onUpdateStuckPoint,
  onUpdateHypothesis,
  onSubmit,
  onCancel,
}: StruggleFormProps) {
  return (
    <div className="p-6 bg-slate-800/50 space-y-4">
      <h4 className="text-white font-semibold mb-3">Document Your Struggle</h4>
      <div>
        <label
          htmlFor="attempt-0"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          What have you tried? (Minimum 3 things)
        </label>
        {[0, 1, 2].map((i) => (
          <input
            key={i}
            id={i === 0 ? "attempt-0" : undefined}
            type="text"
            value={struggles.attemptedSolutions?.[i] || ""}
            onChange={(e) => onUpdateAttempt(i, e.target.value)}
            placeholder={`Attempt ${i + 1}: e.g., "Checked logs", "Restarted service", "Verified config"`}
            className="w-full px-4 py-2 mb-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        ))}
      </div>
      <div>
        <label
          htmlFor="stuck-point"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Where are you stuck? (Be specific)
        </label>
        <textarea
          id="stuck-point"
          value={struggles.stuckPoint || ""}
          onChange={(e) => onUpdateStuckPoint(e.target.value)}
          placeholder="Describe the exact error, behavior, or roadblock you're facing..."
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[80px]"
          required
        />
        <p className="text-xs text-slate-400 mt-1">
          {struggles.stuckPoint?.length || 0}/20 characters minimum
        </p>
      </div>
      <div>
        <label
          htmlFor="hypothesis"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          What might be the problem?
        </label>
        <textarea
          id="hypothesis"
          value={struggles.hypothesis || ""}
          onChange={(e) => onUpdateHypothesis(e.target.value)}
          placeholder="Your best guess about what's causing the issue and why..."
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[80px]"
          required
        />
        <p className="text-xs text-slate-400 mt-1">
          {struggles.hypothesis?.length || 0}/20 characters minimum
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all"
        >
          Submit Documentation
        </button>
      </div>
    </div>
  );
}

// Struggles Logged Banner
export function StrugglesLoggedBanner() {
  return (
    <div className="p-4 bg-green-900/20">
      <div className="flex items-center text-green-400">
        <CheckCircle className="w-5 h-5 mr-2" />
        <span className="font-medium">
          Struggles documented. Hints will unlock when timer reaches 0:00
        </span>
      </div>
    </div>
  );
}
