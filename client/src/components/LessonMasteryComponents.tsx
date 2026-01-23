/* eslint-disable react/no-array-index-key */
/**
 * Lesson Mastery Display Sub-Components
 * Extracted from LessonMasteryDisplay.tsx for ESLint compliance
 * Note: Array index keys are used for progress dots as they are purely presentational
 */

import React from "react";
import { CheckCircle, Circle, Lock } from "lucide-react";
import type { LessonMastery, LessonMasteryLevel } from "./LessonMasteryDisplay";
import {
  canClickLevel,
  getLevelContainerClass,
  getNameTextClass,
} from "./lesson-mastery/lessonMasteryUtils";

// Level Icon Component
export function LevelIcon({ level }: { readonly level: LessonMasteryLevel }) {
  if (level.status === "completed")
    return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (level.status === "in_progress")
    return <Circle className="w-4 h-4 text-yellow-400 fill-current" />;
  return <Lock className="w-4 h-4 text-gray-500" />;
}

// Progress Dots Component
export function ProgressDots({
  level,
}: {
  readonly level: LessonMasteryLevel;
}) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: level.requiredPerfect }).map((_, i) => (
        <span
          key={`progress-dot-${i}`}
          className={`w-2 h-2 rounded-full ${i < level.perfectCount ? "bg-green-400" : "bg-gray-600"}`}
        />
      ))}
    </div>
  );
}

// Single Level Row Component
interface LevelRowProps {
  readonly levelKey: keyof LessonMastery["levels"];
  readonly level: LessonMasteryLevel;
  readonly mastery: LessonMastery;
  readonly isLocked: boolean;
  readonly onClick?: (levelKey: keyof LessonMastery["levels"]) => void;
}

export function LevelRow({
  levelKey,
  level,
  mastery,
  isLocked,
  onClick,
}: LevelRowProps) {
  const isClickable = canClickLevel(levelKey, level, mastery, isLocked);

  return (
    <button
      type="button"
      disabled={!isClickable}
      className={getLevelContainerClass(level, isClickable)}
      onClick={() => isClickable && onClick?.(levelKey)}
    >
      <div className="flex items-center space-x-3">
        <LevelIcon level={level} />
        <div className="flex-1">
          <div className={`font-medium ${getNameTextClass(level)}`}>
            {level.name}
          </div>
          <div className="text-xs text-gray-500">
            {level.perfectCount}/{level.requiredPerfect} perfect attempts
          </div>
        </div>
        {isClickable && (
          <button
            onClick={() => onClick?.(levelKey)}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition-colors"
          >
            Start Level
          </button>
        )}
      </div>
      <ProgressDots level={level} />
    </button>
  );
}
