/**
 * Daily Drill Blocker Sub-Components
 * Extracted from DailyDrillBlocker.tsx for ESLint compliance
 */

import { Zap, AlertTriangle, Clock, Target } from "lucide-react";

// Loading Screen
export function DrillLoadingScreen() {
  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="text-white text-xl">Checking daily drill status...</div>
    </div>
  );
}

// Drill Blocked Header
export function DrillBlockedHeader() {
  return (
    <div className="bg-yellow-900/30 border-b-2 border-yellow-500 px-8 py-6">
      <div className="flex items-center justify-center mb-3">
        <Zap className="w-16 h-16 text-yellow-400 animate-pulse" />
      </div>
      <h2 className="text-3xl font-bold text-center text-white mb-2">
        Daily Drill Required
      </h2>
      <p className="text-center text-yellow-200">
        Complete today's 5-minute challenge before accessing training content
      </p>
    </div>
  );
}

// Training Access Blocked Warning
export function TrainingBlockedWarning() {
  return (
    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
      <div className="flex items-start">
        <AlertTriangle className="w-6 h-6 text-red-400 mr-3 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Training Access Blocked
          </h3>
          <p className="text-slate-300 text-sm">
            All training content is locked until you complete today's daily
            drill. This is not optional - daily practice prevents skill decay
            and reinforces core concepts.
          </p>
        </div>
      </div>
    </div>
  );
}

// Why Daily Drills Matter Section
export function WhyDrillsMatter() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white flex items-center">
        <Target className="w-5 h-5 text-indigo-400 mr-2" />
        Why Daily Drills Matter
      </h3>
      <ul className="space-y-2 text-slate-300">
        <li className="flex items-start">
          <span className="text-yellow-400 mr-2">•</span>
          <span>
            <strong className="text-white">Prevent Skill Decay:</strong> Regular
            practice maintains muscle memory
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-yellow-400 mr-2">•</span>
          <span>
            <strong className="text-white">Spaced Repetition:</strong> Reviews
            concepts at optimal intervals
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-yellow-400 mr-2">•</span>
          <span>
            <strong className="text-white">Real Competence:</strong> Proves you
            can perform under time pressure
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-yellow-400 mr-2">•</span>
          <span>
            <strong className="text-white">Just 5 Minutes:</strong> Quick daily
            touchpoint keeps skills sharp
          </span>
        </li>
      </ul>
    </div>
  );
}

// Status Check Info
interface StatusCheckInfoProps {
  readonly checkCount: number;
}

export function StatusCheckInfo({ checkCount }: StatusCheckInfoProps) {
  return (
    <div className="bg-slate-700/50 rounded-lg p-4">
      <div className="flex items-center text-sm text-slate-400 mb-2">
        <Clock className="w-4 h-4 mr-2" />
        Checking status every 10 seconds... (checked {checkCount} times)
      </div>
      <p className="text-xs text-slate-500">
        Complete the drill in another tab, and this blocker will automatically
        disappear
      </p>
    </div>
  );
}

// Start Drill Button
interface StartDrillButtonProps {
  readonly onClick: () => void;
}

export function StartDrillButton({ onClick }: StartDrillButtonProps) {
  return (
    <div className="border-t border-slate-700 px-8 py-6">
      <button
        onClick={onClick}
        className="w-full px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
      >
        <Zap className="w-6 h-6 mr-2" />
        Start Daily Drill Now
      </button>
      <p className="text-center text-slate-500 text-sm mt-4">
        No shortcuts. No bypassing. Complete the drill to continue.
      </p>
    </div>
  );
}

// NOTE: EXEMPT_ROUTES moved to DailyDrillBlockerConfig.ts for fast-refresh compliance
