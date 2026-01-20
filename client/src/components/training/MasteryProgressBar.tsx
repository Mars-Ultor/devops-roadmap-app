/**
 * MasteryProgressBar - Horizontal progress indicator for all 4 levels
 * Shows overall mastery journey at a glance
 */

import type { LessonMastery } from "../../types/training";
import {
  MASTERY_LEVELS,
  getLevelStatus,
  calculateOverallProgress,
} from "./MasteryProgressBarUtils";
import {
  CompactLevelItem,
  FullLevelCard,
  OverallProgress,
  MasteredBadge,
} from "./MasteryProgressBarComponents";

interface MasteryProgressBarProps {
  mastery: LessonMastery;
  compact?: boolean;
}

export default function MasteryProgressBar({
  mastery,
  compact = false,
}: MasteryProgressBarProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {MASTERY_LEVELS.map(({ key, icon }) => {
          const { isMastered, isUnlocked } = getLevelStatus(key, mastery);
          return (
            <CompactLevelItem
              key={key}
              levelKey={key}
              icon={icon}
              isMastered={isMastered}
              isUnlocked={isUnlocked}
            />
          );
        })}
        {mastery.fullyMastered && <MasteredBadge />}
      </div>
    );
  }

  const progress = calculateOverallProgress(mastery);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-300">Mastery Progress</h3>

      <div className="grid grid-cols-4 gap-3">
        {MASTERY_LEVELS.map(({ key, label, icon }) => {
          const { isMastered, isUnlocked, data } = getLevelStatus(key, mastery);
          return (
            <FullLevelCard
              key={key}
              label={label}
              icon={icon}
              isMastered={isMastered}
              isUnlocked={isUnlocked}
              perfectCompletions={data.perfectCompletions}
              requiredCompletions={data.requiredPerfectCompletions}
            />
          );
        })}
      </div>

      <OverallProgress progress={progress} />
    </div>
  );
}
