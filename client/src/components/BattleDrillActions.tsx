import React from 'react';

interface BattleDrillActionsProps {
  sessionStarted: boolean;
  sessionComplete: boolean;
  onComplete: () => void;
  onLogFailure: () => void;
  onCancel: () => void;
}

export const BattleDrillActions: React.FC<BattleDrillActionsProps> = ({
  sessionStarted,
  sessionComplete,
  onComplete,
  onLogFailure,
  onCancel
}) => {
  if (!sessionStarted || sessionComplete) return null;

  return (
    <div className="mt-8 flex gap-4">
      <button
        onClick={onComplete}
        className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
      >
        Complete Drill
      </button>
      <button
        onClick={onLogFailure}
        className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
      >
        Log Failure
      </button>
      <button
        onClick={onCancel}
        className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
      >
        Cancel
      </button>
    </div>
  );
};