/**
 * Content Gate Sub-Components
 * Extracted from ContentGate.tsx for ESLint compliance
 */

import { AlertTriangle, Target, Calendar, Clock } from "lucide-react";

// Loading Screen
export function GateLoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Checking daily drill status...</div>
    </div>
  );
}

// Gate Header
export function GateHeader() {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-16 h-16 rounded-full bg-yellow-900/50 flex items-center justify-center">
        <Target className="w-8 h-8 text-yellow-400" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white">
          🔒 Daily Drill Required
        </h2>
        <p className="text-yellow-300 text-lg">
          Complete your daily drill to unlock training content
        </p>
      </div>
    </div>
  );
}

// Why Drills Matter Section
export function WhyDrillsMatterSection() {
  return (
    <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />
        </div>
        <div className="flex-1">
          <p className="text-yellow-100 text-lg font-medium mb-3">
            <strong>Why Daily Drills Matter:</strong>
          </p>
          <ul className="text-yellow-200 space-y-2 list-disc list-inside">
            <li>
              <strong>Prevent skill decay:</strong> Use it or lose it. Daily
              practice keeps knowledge fresh.
            </li>
            <li>
              <strong>Build automaticity:</strong> Repetition creates reflexive
              responses under pressure.
            </li>
            <li>
              <strong>Spaced repetition:</strong> Reviews content at optimal
              intervals for long-term retention.
            </li>
            <li>
              <strong>Combat progressive training:</strong> You can't skip
              fundamentals and expect to master advanced topics.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Drill Details Section
export function DrillDetailsSection() {
  return (
    <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-400" />
        Daily Drill Details
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-slate-700/50 p-3 rounded">
          <div className="text-gray-400 mb-1">Time Limit</div>
          <div className="text-white font-semibold">10 minutes</div>
        </div>
        <div className="bg-slate-700/50 p-3 rounded">
          <div className="text-gray-400 mb-1">Difficulty</div>
          <div className="text-white font-semibold">Run-Independent Only</div>
        </div>
        <div className="bg-slate-700/50 p-3 rounded">
          <div className="text-gray-400 mb-1">Questions</div>
          <div className="text-white font-semibold">Spaced Repetition Mix</div>
        </div>
        <div className="bg-slate-700/50 p-3 rounded">
          <div className="text-gray-400 mb-1">Passing Score</div>
          <div className="text-white font-semibold">70% or higher</div>
        </div>
      </div>
    </div>
  );
}

// Spaced Repetition Algorithm Info
export function SpacedRepetitionInfo() {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-purple-400" />
        Spaced Repetition Algorithm
      </h4>
      <div className="text-gray-300 text-sm space-y-1">
        <div>
          • <strong>40%</strong> from yesterday's material
        </div>
        <div>
          • <strong>30%</strong> from last week
        </div>
        <div>
          • <strong>20%</strong> from last month
        </div>
        <div>
          • <strong>10%</strong> from older content
        </div>
      </div>
    </div>
  );
}

// Gate Footer with Start Button
interface GateFooterProps {
  readonly onStart: () => void;
}

export function GateFooter({ onStart }: GateFooterProps) {
  return (
    <div className="flex justify-between items-center pt-6 border-t border-slate-700">
      <div className="text-sm text-gray-400">
        ⚠️ Training content is locked until drill completion
      </div>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-yellow-600 text-white rounded-lg font-bold text-lg hover:bg-yellow-700 flex items-center gap-3 shadow-lg hover:shadow-yellow-600/50 transition-all"
      >
        <Target className="w-6 h-6" />
        Start Daily Drill
      </button>
    </div>
  );
}
