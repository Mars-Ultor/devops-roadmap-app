import React from "react";
import { Target } from "lucide-react";
import type { Drill } from "../types";

interface BattleDrillHeaderProps {
  drill: Drill;
  sessionStarted: boolean;
  elapsedSeconds: number;
  formatTime: (seconds: number) => string;
  getTimeColor: () => string;
  performance?: {
    attempts: number;
    bestTime: number;
    successRate: number;
    masteryLevel: string;
  } | null;
}

export const BattleDrillHeader: React.FC<BattleDrillHeaderProps> = ({
  drill,
  sessionStarted,
  elapsedSeconds,
  formatTime,
  getTimeColor,
  performance,
}) => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-2">{drill.title}</h1>
          <p className="text-slate-300 mb-3">{drill.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span
              className={`px-3 py-1 rounded ${
                drill.difficulty === "basic"
                  ? "bg-green-900/30 text-green-400"
                  : drill.difficulty === "intermediate"
                    ? "bg-yellow-900/30 text-yellow-400"
                    : "bg-red-900/30 text-red-400"
              }`}
            >
              {drill.difficulty}
            </span>
            <span className="text-slate-400 capitalize">{drill.category}</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Target className="w-4 h-4" />
              Target: {Math.round(drill.targetTimeSeconds / 60)} min
            </span>
          </div>
        </div>

        {/* Timer */}
        {sessionStarted && (
          <div className="text-right">
            <div className="text-slate-400 text-sm mb-1">Elapsed Time</div>
            <div className={`text-4xl font-bold font-mono ${getTimeColor()}`}>
              {formatTime(elapsedSeconds)}
            </div>
            {elapsedSeconds > drill.targetTimeSeconds && (
              <div className="text-xs text-red-400 mt-1">
                +{formatTime(elapsedSeconds - drill.targetTimeSeconds)} over
                target
              </div>
            )}
          </div>
        )}
      </div>

      {/* Performance Stats */}
      {performance && performance.attempts > 0 && (
        <div className="border-t border-slate-700 pt-4 mt-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-slate-500">Attempts</div>
              <div className="text-white font-semibold">
                {performance.attempts}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Best Time</div>
              <div className="text-green-400 font-semibold">
                {formatTime(performance.bestTime)}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Success Rate</div>
              <div className="text-blue-400 font-semibold">
                {Math.round(performance.successRate * 100)}%
              </div>
            </div>
            <div>
              <div className="text-slate-500">Mastery</div>
              <div className="text-purple-400 font-semibold capitalize">
                {performance.masteryLevel}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
