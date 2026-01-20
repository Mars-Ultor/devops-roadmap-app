/**
 * Hint System with 5-Minute Delays
 * Forces spaced practice and prevents hint dependency
 * Phase 3: Time-Boxed Struggle
 */

import { useHintSystem } from "../hooks/useHintSystem";
import {
  HintsLockedBanner,
  HintProgress,
  NextHintCard,
  ViewedHintsList,
  AllHintsUsedWarning,
  SolutionAvailableBanner,
} from "./hint-system/HintSystemComponents";

interface Hint {
  id: number;
  text: string;
  difficulty: "easy" | "medium" | "hard";
}

interface HintSystemProps {
  hints: Hint[];
  hintsUnlocked: boolean;
  labStartTime: number;
  onHintViewed: (hintId: number, timestamp: Date) => void;
  currentTime?: number;
}

export default function HintSystem({
  hints,
  hintsUnlocked,
  labStartTime,
  onHintViewed,
  currentTime,
}: HintSystemProps) {
  const {
    viewedHints,
    nextHintAvailableIn,
    solutionAvailable,
    handleViewHint,
    canViewNextHint,
    getNextUnviewedHint,
    formatTime,
    getTimeUntilSolution,
  } = useHintSystem({
    hints,
    hintsUnlocked,
    labStartTime,
    onHintViewed,
    currentTime,
  });

  if (!hintsUnlocked) return <HintsLockedBanner />;

  const nextHint = getNextUnviewedHint();

  return (
    <div className="space-y-4">
      <HintProgress
        viewedHints={viewedHints}
        hints={hints}
        solutionAvailable={solutionAvailable}
      />

      {nextHint && (
        <NextHintCard
          hint={nextHint}
          totalHints={hints.length}
          nextHintAvailableIn={nextHintAvailableIn}
          canViewNextHint={canViewNextHint()}
          onViewHint={handleViewHint}
          formatTime={formatTime}
        />
      )}

      <ViewedHintsList hints={hints} viewedHints={viewedHints} />

      {viewedHints.length === hints.length && !solutionAvailable && (
        <AllHintsUsedWarning
          formatTime={formatTime}
          getTimeUntilSolution={getTimeUntilSolution}
        />
      )}

      {solutionAvailable && <SolutionAvailableBanner />}
    </div>
  );
}
