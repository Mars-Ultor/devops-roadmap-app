/**
 * StruggleTimer Component
 * Displays 30-minute hint lockout with progressive hint unlocking
 */

import { useState, useEffect } from "react";
import type { StruggleTimerState } from "../../types/struggle";

// Import extracted components and utilities
import {
  TimerHeader,
  TimerDisplaySection,
  StruggleLogPrompt,
  HintRequestSection,
  HintUnlockingInfo,
} from "./struggle-timer/StruggleTimerComponents";
import { formatTime } from "./struggle-timer/StruggleTimerUtils";

interface StruggleTimerProps {
  session: StruggleTimerState;
  onHintRequested: () => void;
  onStruggleLogSubmitted: () => void;
  showStruggleLogPrompt: boolean;
}

export default function StruggleTimer({
  session,
  onHintRequested,
  onStruggleLogSubmitted,
  showStruggleLogPrompt,
}: StruggleTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(session.timeRemaining);

  useEffect(() => {
    if (session.isLocked && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev: number) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [session.isLocked, timeRemaining]);

  const display = formatTime(timeRemaining);

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <TimerHeader isLocked={display.isLocked} hintsUsed={session.hintsUsed} />
      <TimerDisplaySection display={display} />
      {showStruggleLogPrompt && (
        <StruggleLogPrompt onSubmit={onStruggleLogSubmitted} />
      )}
      {!display.isLocked && !showStruggleLogPrompt && (
        <HintRequestSection
          canRequestHints={session.canRequestHints}
          hintsUsed={session.hintsUsed}
          onHintRequested={onHintRequested}
        />
      )}
      {display.isLocked && <HintUnlockingInfo />}
    </div>
  );
}
