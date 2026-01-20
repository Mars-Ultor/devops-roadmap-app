/**
 * ProgressiveHints - Gradual hint disclosure system
 */

import { useState } from "react";
import { canRequestLevel } from "./ProgressiveHintsUtils";
import {
  LockedState,
  WaitingForLogState,
  HintsHeader,
  HintCard,
  AllHintsComplete,
} from "./ProgressiveHintsComponents";

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
  requestedHints,
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

  if (!hintsUnlocked) {
    return <LockedState />;
  }

  if (!struggleLogSubmitted) {
    return <WaitingForLogState />;
  }

  return (
    <div className="bg-slate-800 border-2 border-indigo-500/30 rounded-lg p-6">
      <HintsHeader />

      <div className="space-y-4">
        {hints.map((hint, index) => {
          const level = index + 1;
          return (
            <HintCard
              key={level}
              level={level}
              hint={hint}
              isRequested={requestedHints.includes(level)}
              canRequest={canRequestLevel(level, requestedHints)}
              isRequesting={requesting === level}
              onRequest={() => handleRequestHint(level)}
            />
          );
        })}

        {requestedHints.length === hints.length && <AllHintsComplete />}
      </div>
    </div>
  );
}
