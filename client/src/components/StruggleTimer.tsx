/**
 * Struggle Timer System - 30-Minute Hint Lockout
 * Forces independent problem-solving before providing hints
 * Phase 3: Time-Boxed Struggle
 */

import { useState, useEffect } from "react";
import {
  HintsUnlockedBanner,
  TimerHeader,
  WhyWaitInfo,
  DocumentStruggleButton,
  StruggleForm,
  StrugglesLoggedBanner,
  type StruggleLog,
} from "./struggle-timer/StruggleTimerComponents";

export type { StruggleLog };

interface StruggleTimerProps {
  startTime: number;
  onHintUnlocked: () => void;
  onStruggleLogged: (struggles: StruggleLog) => void;
  currentTime?: number;
}

const HINT_UNLOCK_TIME = 30 * 60 * 1000;

export default function StruggleTimer({
  startTime,
  onHintUnlocked,
  onStruggleLogged,
  currentTime,
}: StruggleTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hintsUnlocked, setHintsUnlocked] = useState(false);
  const [strugglesLogged, setStrugglesLogged] = useState(false);
  const [showStruggleForm, setShowStruggleForm] = useState(false);
  const [struggles, setStruggles] = useState<Partial<StruggleLog>>({
    attemptedSolutions: ["", "", ""],
    stuckPoint: "",
    hypothesis: "",
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = currentTime || Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, HINT_UNLOCK_TIME - elapsed);
      setTimeRemaining(remaining);
      if (remaining === 0 && !hintsUnlocked && strugglesLogged) {
        setHintsUnlocked(true);
        onHintUnlocked();
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime, hintsUnlocked, strugglesLogged, onHintUnlocked, currentTime]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStruggleSubmit = () => {
    const allSolutionsFilled = struggles.attemptedSolutions?.every(
      (s) => s && s.trim().length > 0,
    );
    if (!allSolutionsFilled) {
      alert("Please list at least 3 things you tried");
      return;
    }
    if (!struggles.stuckPoint || struggles.stuckPoint.trim().length < 20) {
      alert("Please describe where you're stuck (minimum 20 characters)");
      return;
    }
    if (!struggles.hypothesis || struggles.hypothesis.trim().length < 20) {
      alert(
        "Please provide your hypothesis about the problem (minimum 20 characters)",
      );
      return;
    }
    const log: StruggleLog = {
      attemptedSolutions: struggles.attemptedSolutions!,
      stuckPoint: struggles.stuckPoint!,
      hypothesis: struggles.hypothesis!,
      submittedAt: new Date(),
    };
    setStrugglesLogged(true);
    setShowStruggleForm(false);
    onStruggleLogged(log);
  };

  const updateAttempt = (index: number, value: string) => {
    const newAttempts = [...(struggles.attemptedSolutions || ["", "", ""])];
    newAttempts[index] = value;
    setStruggles({ ...struggles, attemptedSolutions: newAttempts });
  };

  if (hintsUnlocked) return <HintsUnlockedBanner />;

  return (
    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg mb-6">
      <TimerHeader
        timeRemaining={timeRemaining}
        strugglesLogged={strugglesLogged}
        formatTime={formatTime}
      />
      <WhyWaitInfo />
      {!strugglesLogged && !showStruggleForm && (
        <DocumentStruggleButton onClick={() => setShowStruggleForm(true)} />
      )}
      {showStruggleForm && !strugglesLogged && (
        <StruggleForm
          struggles={struggles}
          onUpdateAttempt={updateAttempt}
          onUpdateStuckPoint={(v) =>
            setStruggles({ ...struggles, stuckPoint: v })
          }
          onUpdateHypothesis={(v) =>
            setStruggles({ ...struggles, hypothesis: v })
          }
          onSubmit={handleStruggleSubmit}
          onCancel={() => setShowStruggleForm(false)}
        />
      )}
      {strugglesLogged && <StrugglesLoggedBanner />}
    </div>
  );
}
