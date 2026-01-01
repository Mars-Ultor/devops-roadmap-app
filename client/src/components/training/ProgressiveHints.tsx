/**
 * ProgressiveHints - Gradual hint disclosure system
 */

import { useState } from 'react';
import { Lightbulb, ChevronRight, Lock } from 'lucide-react';

interface ProgressiveHintsProps {
  hints: string[];
  hintsUnlocked: boolean;
  struggleLogSubmitted: boolean;
  onRequestHint: (level: number, hint: string) => Promise<void>;
  requestedHints: number[];
}

export default function ProgressiveHints({
  hints,
  hintsUnlocked,
  struggleLogSubmitted,
  onRequestHint,
  requestedHints
}: ProgressiveHintsProps) {
  const [requesting, setRequesting] = useState<number | null>(null);

  const handleRequestHint = async (level: number) => {
    if (!hintsUnlocked || !struggleLogSubmitted || requesting !== null) return;
    
    const hint = hints[level - 1];
    if (!hint) return;

    setRequesting(level);
    try {
      await onRequestHint(level, hint);
    } finally {
      setRequesting(null);
    }
  };

  const canRequestLevel = (level: number) => {
    // Must have requested all previous levels first
    if (level > 1) {
      for (let i = 1; i < level; i++) {
        if (!requestedHints.includes(i)) {
          return false;
        }
      }
    }
    return !requestedHints.includes(level);
  };

  if (!hintsUnlocked) {
    return (
      <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6">
        <div className="flex items-center gap-3 text-slate-400">
          <Lock className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-bold">Progressive Hints</h3>
            <p className="text-sm mt-1">
              Hints will appear here after the 30-minute struggle period
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!struggleLogSubmitted) {
    return (
      <div className="bg-amber-900/30 border-2 border-amber-600/30 rounded-lg p-6">
        <div className="flex items-center gap-3 text-amber-400">
          <Lightbulb className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-bold">Hints Available</h3>
            <p className="text-sm text-amber-300 mt-1">
              Submit your struggle log above to unlock progressive hints
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border-2 border-indigo-500/30 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <div>
          <h3 className="text-lg font-bold text-white">Progressive Hints</h3>
          <p className="text-sm text-slate-300">
            Hints are released one at a time. Start with Hint 1 before requesting more.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {hints.map((hint, index) => {
          const level = index + 1;
          const isRequested = requestedHints.includes(level);
          const canRequest = canRequestLevel(level);
          const isRequesting = requesting === level;

          return (
            <div
              key={level}
              className={`rounded-lg border-2 overflow-hidden transition-all ${
                isRequested
                  ? 'border-yellow-500/50 bg-yellow-900/20'
                  : canRequest
                  ? 'border-slate-700 bg-slate-900'
                  : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              {/* Hint Header */}
              <div className={`flex items-center justify-between p-4 ${
                isRequested ? 'bg-yellow-900/30' : 'bg-slate-900/50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isRequested
                      ? 'bg-yellow-500'
                      : canRequest
                      ? 'bg-indigo-600'
                      : 'bg-slate-700'
                  }`}>
                    {isRequested ? (
                      <Lightbulb className="w-4 h-4 text-white" />
                    ) : canRequest ? (
                      <span className="text-white font-semibold">{level}</span>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${
                      isRequested ? 'text-yellow-400' : 'text-white'
                    }`}>
                      Hint {level}
                    </h4>
                    {!isRequested && !canRequest && (
                      <p className="text-xs text-slate-500">
                        Request Hint {level - 1} first
                      </p>
                    )}
                  </div>
                </div>

                {canRequest && !isRequested && (
                  <button
                    onClick={() => handleRequestHint(level)}
                    disabled={isRequesting}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isRequesting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Requesting...
                      </>
                    ) : (
                      <>
                        Request Hint
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Hint Content */}
              {isRequested && (
                <div className="p-4 bg-yellow-900/10">
                  <p className="text-slate-200">{hint}</p>
                </div>
              )}
            </div>
          );
        })}

        {requestedHints.length === hints.length && (
          <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-4">
            <p className="text-sm text-green-300 text-center">
              ✓ All hints revealed. If you're still stuck, consider reviewing documentation
              or discussing with peers before requesting the solution.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
