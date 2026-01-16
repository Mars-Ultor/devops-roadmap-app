/**
 * Lesson Mastery Display Component
 * Shows mastery progression across all levels
 */

import type { LeveledLessonContent } from '../types/lessonContent';
import { LevelRow } from './LessonMasteryComponents';
import { DEFAULT_MASTERY } from './lesson-mastery/lessonMasteryUtils';

export interface LessonMasteryLevel {
  name: string;
  requiredPerfect: number;
  perfectCount: number;
  status: 'locked' | 'in_progress' | 'completed';
}

export interface LessonMastery {
  levels: {
    crawl: LessonMasteryLevel;
    walk: LessonMasteryLevel;
    runGuided: LessonMasteryLevel;
    runIndependent: LessonMasteryLevel;
  };
}

interface LessonMasteryDisplayProps {
  lesson: LeveledLessonContent | { id: string; title: string; mastery?: LessonMastery };
  isLocked?: boolean;
  onLevelClick?: (level: keyof LessonMastery['levels']) => void;
}

export default function LessonMasteryDisplay({ lesson, isLocked = false, onLevelClick }: LessonMasteryDisplayProps) {
  const mastery = lesson.mastery || DEFAULT_MASTERY;

  return (
    <div className="space-y-2">
      {(Object.entries(mastery.levels) as [keyof LessonMastery['levels'], LessonMasteryLevel][]).map(([levelKey, level]) => (
        <LevelRow key={levelKey} levelKey={levelKey} level={level} mastery={mastery} isLocked={isLocked} onClick={onLevelClick} />
      ))}
    </div>
  );
}
