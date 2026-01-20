/**
 * Hint System Sub-Components
 * Extracted from HintSystem.tsx for ESLint compliance
 */

import { Lightbulb, Lock, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Hint {
  id: number;
  text: string;
  difficulty: "easy" | "medium" | "hard";
}

// Hints Locked Banner
export function HintsLockedBanner() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-center text-slate-400">
        <Lock className="w-6 h-6 mr-3" />
        <span className="font-medium">
          Hints locked. Complete the struggle timer first.
        </span>
      </div>
    </div>
  );
}

// Hint Progress Section
interface HintProgressProps {
  readonly viewedHints: number[];
  readonly hints: Hint[];
  readonly solutionAvailable: boolean;
}

export function HintProgress({
  viewedHints,
  hints,
  solutionAvailable,
}: HintProgressProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
          Hints ({viewedHints.length}/{hints.length})
        </h3>
        {solutionAvailable && (
          <span className="text-green-400 text-sm font-medium flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Solution Available
          </span>
        )}
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
        <div
          data-testid="hint-progress-bar"
          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(viewedHints.length / hints.length) * 100}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {hints.map((hint) => (
          <div
            key={hint.id}
            className={`text-center py-2 rounded text-sm ${
              viewedHints.includes(hint.id)
                ? "bg-green-900/30 text-green-400 border border-green-700"
                : "bg-slate-700 text-slate-500 border border-slate-600"
            }`}
          >
            {viewedHints.includes(hint.id) ? (
              <CheckCircle2 className="w-4 h-4 mx-auto" />
            ) : (
              <Lock className="w-4 h-4 mx-auto" />
            )}
            <span className="text-xs block mt-1">Hint {hint.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Next Hint Card
interface NextHintCardProps {
  readonly hint: Hint;
  readonly totalHints: number;
  readonly nextHintAvailableIn: number;
  readonly canViewNextHint: boolean;
  readonly onViewHint: (id: number) => void;
  readonly formatTime: (ms: number) => string;
}

export function NextHintCard({
  hint,
  totalHints,
  nextHintAvailableIn,
  canViewNextHint,
  onViewHint,
  formatTime,
}: NextHintCardProps) {
  let difficultyClass: string;
  if (hint.difficulty === "easy") {
    difficultyClass = "text-green-400";
  } else if (hint.difficulty === "medium") {
    difficultyClass = "text-yellow-400";
  } else {
    difficultyClass = "text-red-400";
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-white font-semibold mb-1">
            Hint {hint.id} of {totalHints}
          </h4>
          <p className="text-sm text-slate-400">
            Difficulty:{" "}
            <span className={`font-medium ${difficultyClass}`}>
              {hint.difficulty}
            </span>
          </p>
        </div>
        {nextHintAvailableIn > 0 && (
          <div className="text-right">
            <p className="text-xs text-slate-400">Available in</p>
            <p className="text-yellow-400 font-mono font-bold">
              {formatTime(nextHintAvailableIn)}
            </p>
          </div>
        )}
      </div>
      {canViewNextHint ? (
        <div>
          <button
            onClick={() => onViewHint(hint.id)}
            className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all flex items-center justify-center"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            View Hint {hint.id}
          </button>
          <p className="text-center text-slate-400 text-xs mt-2">
            Next hint will be available in 5 minutes
          </p>
        </div>
      ) : (
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-center">
          <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-400 text-sm font-medium">
            {nextHintAvailableIn > 0
              ? `Next hint available in ${formatTime(nextHintAvailableIn)}`
              : "Hint locked"}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Use this time to try different approaches
          </p>
        </div>
      )}
    </div>
  );
}

// Viewed Hints List
interface ViewedHintsListProps {
  readonly hints: Hint[];
  readonly viewedHints: number[];
}

export function ViewedHintsList({ hints, viewedHints }: ViewedHintsListProps) {
  if (viewedHints.length === 0) return null;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h4 className="text-white font-semibold mb-4 flex items-center">
        <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
        Previously Viewed Hints
      </h4>
      <div className="space-y-3">
        {hints
          .filter((h) => viewedHints.includes(h.id))
          .map((hint) => {
            let bgClass: string;
            if (hint.difficulty === "easy") {
              bgClass = "bg-green-900/30 text-green-400";
            } else if (hint.difficulty === "medium") {
              bgClass = "bg-yellow-900/30 text-yellow-400";
            } else {
              bgClass = "bg-red-900/30 text-red-400";
            }
            return (
              <div
                key={hint.id}
                className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">
                    Hint {hint.id}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${bgClass}`}>
                    {hint.difficulty}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {hint.text}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

// All Hints Used Warning
interface AllHintsUsedProps {
  readonly formatTime: (ms: number) => string;
  readonly getTimeUntilSolution: () => number;
}

export function AllHintsUsedWarning({
  formatTime,
  getTimeUntilSolution,
}: AllHintsUsedProps) {
  return (
    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
      <div className="flex items-start">
        <XCircle className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" />
        <div>
          <h4 className="text-white font-semibold mb-2">All Hints Used</h4>
          <p className="text-yellow-300 text-sm mb-3">
            You've viewed all available hints. The full solution will unlock
            after 90 minutes total lab time.
          </p>
          <p className="text-yellow-400 text-sm font-medium">
            Time remaining: {formatTime(getTimeUntilSolution())}
          </p>
        </div>
      </div>
    </div>
  );
}

// Solution Available Banner
export function SolutionAvailableBanner() {
  return (
    <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <CheckCircle2 className="w-6 h-6 text-green-400 mr-3" />
        <h4 className="text-white font-semibold">Full Solution Unlocked</h4>
      </div>
      <p className="text-green-300 text-sm mb-4">
        You've struggled for 90 minutes. The complete solution is now available.
      </p>
      <button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all">
        View Full Solution
      </button>
    </div>
  );
}
