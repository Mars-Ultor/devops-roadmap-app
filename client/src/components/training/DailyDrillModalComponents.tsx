/**
 * DailyDrillModalComponents - Extracted UI components for DailyDrillModal
 */

import { X, Target, Clock, Zap, TrendingUp } from 'lucide-react';
import type { DailyDrillCandidate } from '../../services/spacedRepetition';
import type { BattleDrill } from '../../types/training';

export function LoadingState() {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-slate-400">Selecting your daily drill...</p>
      </div>
    </div>
  );
}

interface DrillHeaderProps {
  readonly canDismiss: boolean;
  readonly onDismiss: () => void;
}

export function DrillHeader({ canDismiss, onDismiss }: DrillHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-t-xl relative">
      {canDismiss && (
        <button onClick={onDismiss} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      )}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center">
          <Target className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Daily Battle Drill</h2>
          <p className="text-indigo-200 mt-1">Complete before accessing new content</p>
        </div>
      </div>
    </div>
  );
}

interface SelectionInfoProps {
  readonly candidate: DailyDrillCandidate;
}

export function SelectionInfo({ candidate }: SelectionInfoProps) {
  return (
    <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-700 text-sm">
      <div className="flex items-center gap-2 text-blue-300">
        <TrendingUp className="w-4 h-4" />
        <span className="font-semibold">Smart Selection:</span>
        <span>Content from {candidate.daysSinceCompletion} days ago (spaced repetition)</span>
      </div>
    </div>
  );
}

export function WhyDailyDrills() {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
      <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-500" />
        Why Daily Drills?
      </h3>
      <ul className="text-sm text-slate-400 space-y-1 ml-6 list-disc">
        <li>Build muscle memory through spaced repetition</li>
        <li>40% recent content, 30% from 1-week ago, 20% from 1-month ago</li>
        <li>Maintain sharp skills with weighted practice</li>
        <li>Identify degrading competencies early</li>
        <li>Prove readiness before advancing to new material</li>
      </ul>
    </div>
  );
}

interface DrillDisplayProps {
  readonly drill: BattleDrill;
}

export function DrillDisplay({ drill }: DrillDisplayProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Today's Drill</h3>
      <div className="bg-slate-900 rounded-lg p-5 border-2 border-slate-700">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-lg font-bold text-white">{drill.title}</h4>
            <p className="text-sm text-slate-400 mt-1">{drill.id}</p>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{Math.round(drill.targetTimeSeconds / 60)} min</span>
          </div>
        </div>
        <p className="text-slate-300 mb-4">{drill.description}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-800 rounded p-3">
            <div className="text-slate-500 mb-1">Difficulty</div>
            <div className="text-white font-semibold capitalize">{drill.difficulty}</div>
          </div>
          <div className="bg-slate-800 rounded p-3">
            <div className="text-slate-500 mb-1">Category</div>
            <div className="text-white font-semibold capitalize">{drill.category}</div>
          </div>
        </div>
        <StepsPreview steps={drill.steps} />
      </div>
    </div>
  );
}

function StepsPreview({ steps }: { readonly steps: BattleDrill['steps'] }) {
  return (
    <div className="mt-4">
      <div className="text-xs text-slate-500 mb-2">{steps.length} Steps Total</div>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {steps.slice(0, 5).map((step, idx) => (
          <div key={step.description} className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300">{idx + 1}</div>
            <span className="truncate">{step.description}</span>
          </div>
        ))}
        {steps.length > 5 && <div className="text-xs text-slate-500 text-center">+ {steps.length - 5} more steps</div>}
      </div>
    </div>
  );
}

interface DrillFooterProps {
  readonly canDismiss: boolean;
  readonly onDismiss: () => void;
  readonly onStart: () => void;
}

export function DrillFooter({ canDismiss, onDismiss, onStart }: DrillFooterProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      {!canDismiss && <p className="text-sm text-amber-400 flex items-center gap-2"><span className="text-lg">⚠️</span>Must complete to continue</p>}
      {canDismiss && <button onClick={onDismiss} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Skip for now</button>}
      <button onClick={onStart} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
        <Target className="w-5 h-5" />Start Drill
      </button>
    </div>
  );
}
