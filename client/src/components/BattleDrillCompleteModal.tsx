import React from "react";
import { AARReviewPanel } from "./AARReviewPanel";
import type { AAR } from "../types";
import {
  ResultHeader,
  AARRequiredWarning,
  StatsGrid,
  AchievementBadges,
  ActionButtons,
} from "./battle-drill/BattleDrillCompleteComponents";

interface BattleDrillCompleteModalProps {
  sessionResult: {
    passed: boolean;
    beatTarget: boolean;
    personalBest: boolean;
    durationSeconds: number;
    targetTimeSeconds: number;
    completedSteps: number;
    totalSteps: number;
    hintsUsed: number;
  } | null;
  aarSubmitted: boolean;
  submittedAAR: AAR | null;
  formatTime: (seconds: number) => string;
  onTryAgain: () => void;
  onBackToDrills: () => void;
  onCompleteAAR: () => void;
}

export const BattleDrillCompleteModal: React.FC<
  BattleDrillCompleteModalProps
> = ({
  sessionResult,
  aarSubmitted,
  submittedAAR,
  formatTime,
  onTryAgain,
  onBackToDrills,
  onCompleteAAR,
}) => {
  if (!sessionResult) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border-2 border-indigo-500 max-w-2xl w-full p-8">
        <div className="text-center">
          <ResultHeader passed={sessionResult.passed} />
          {!aarSubmitted && <AARRequiredWarning />}
          {aarSubmitted && submittedAAR && (
            <div className="mt-6">
              <AARReviewPanel aar={submittedAAR} />
            </div>
          )}
          <StatsGrid
            durationSeconds={sessionResult.durationSeconds}
            targetTimeSeconds={sessionResult.targetTimeSeconds}
            completedSteps={sessionResult.completedSteps}
            totalSteps={sessionResult.totalSteps}
            hintsUsed={sessionResult.hintsUsed}
            beatTarget={sessionResult.beatTarget}
            formatTime={formatTime}
          />
          <AchievementBadges
            beatTarget={sessionResult.beatTarget}
            personalBest={sessionResult.personalBest}
          />
          <ActionButtons
            aarSubmitted={aarSubmitted}
            onTryAgain={onTryAgain}
            onBackToDrills={onBackToDrills}
            onCompleteAAR={onCompleteAAR}
          />
        </div>
      </div>
    </div>
  );
};
