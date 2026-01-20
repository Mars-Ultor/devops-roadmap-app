/**
 * StruggleTimer - Visual countdown showing time until hints unlock
 */

import { Timer, Lock, Unlock } from "lucide-react";

interface StruggleTimerProps {
  timeUntilHints: number; // seconds
  hintsUnlocked: boolean;
  elapsedSeconds: number;
}

export default function StruggleTimer({
  timeUntilHints,
  hintsUnlocked,
  elapsedSeconds,
}: StruggleTimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const totalLockoutSeconds = 30 * 60; // 30 minutes
  const progress = Math.min(100, (elapsedSeconds / totalLockoutSeconds) * 100);

  return (
    <div
      className={`bg-gradient-to-r ${
        hintsUnlocked
          ? "from-green-900 to-emerald-900 border-green-500"
          : "from-amber-900 to-orange-900 border-amber-500"
      } rounded-lg p-6 border-2 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {hintsUnlocked ? (
            <Unlock className="w-8 h-8 text-green-400" />
          ) : (
            <Lock className="w-8 h-8 text-amber-400" />
          )}
          <div>
            <h3 className="text-lg font-bold text-white">
              {hintsUnlocked ? "Hints Unlocked!" : "Struggle Session Active"}
            </h3>
            <p className="text-sm text-slate-300">
              {hintsUnlocked
                ? "You can now request progressive hints"
                : "Hints unlock after 30 minutes of struggle"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-slate-300 mb-1">
            {hintsUnlocked ? "Time Struggled" : "Time Until Hints"}
          </div>
          <div
            className={`text-3xl font-bold font-mono ${
              hintsUnlocked ? "text-green-400" : "text-amber-400"
            }`}
          >
            {hintsUnlocked
              ? formatTime(elapsedSeconds)
              : formatTime(timeUntilHints)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 transition-all duration-1000 ${
            hintsUnlocked
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-amber-500 to-orange-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {!hintsUnlocked && (
        <div className="mt-4 bg-amber-900/30 border border-amber-600/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Timer className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-100">
              <p className="font-semibold mb-1">Why the wait?</p>
              <p>
                True learning happens through struggle. Take this time to deeply
                think through the problem, review documentation, and try
                multiple approaches. When hints unlock, you'll have earned them.
              </p>
            </div>
          </div>
        </div>
      )}

      {hintsUnlocked && (
        <div className="mt-4 bg-green-900/30 border border-green-600/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Unlock className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-100">
              <p className="font-semibold mb-1">Great endurance!</p>
              <p>
                You've struggled for {formatTime(elapsedSeconds)}. Hints are now
                available below. They'll be released progressively - start with
                Hint 1 before requesting more.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
