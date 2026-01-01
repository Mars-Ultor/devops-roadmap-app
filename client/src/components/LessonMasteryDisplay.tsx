import { CheckCircle, Circle, Lock } from 'lucide-react';
import type { LeveledLessonContent } from '../types/lessonContent';

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
  lesson: LeveledLessonContent | {
    id: string;
    title: string;
    mastery?: LessonMastery;
  };
  isLocked?: boolean;
  onLevelClick?: (level: keyof LessonMastery['levels']) => void;
}

export default function LessonMasteryDisplay({ lesson, isLocked = false, onLevelClick }: LessonMasteryDisplayProps) {
  // Default mastery structure if not provided
  const defaultMastery: LessonMastery = {
    levels: {
      crawl: {
        name: "Crawl - Guided",
        requiredPerfect: 3,
        perfectCount: 0,
        status: "in_progress"
      },
      walk: {
        name: "Walk - Fill-in-Blanks",
        requiredPerfect: 3,
        perfectCount: 0,
        status: "locked"
      },
      runGuided: {
        name: "Run - Conceptual",
        requiredPerfect: 2,
        perfectCount: 0,
        status: "locked"
      },
      runIndependent: {
        name: "Run - Independent",
        requiredPerfect: 1,
        perfectCount: 0,
        status: "locked"
      }
    }
  };

  const mastery = lesson.mastery || defaultMastery;

  const getLevelIcon = (level: LessonMasteryLevel) => {
    if (level.status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    if (level.status === 'in_progress') {
      return <Circle className="w-4 h-4 text-yellow-400 fill-current" />;
    }
    return <Lock className="w-4 h-4 text-gray-500" />;
  };

  const getProgressDots = (level: LessonMasteryLevel) => {
    const dots = [];
    for (let i = 0; i < level.requiredPerfect; i++) {
      dots.push(
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < level.perfectCount ? 'bg-green-400' : 'bg-gray-600'
          }`}
        />
      );
    }
    return dots;
  };

  const canClickLevel = (levelKey: keyof LessonMastery['levels'], level: LessonMasteryLevel) => {
    if (isLocked) return false;
    if (level.status === 'completed') return true;
    if (level.status === 'in_progress') return true;

    // Check if previous level is completed
    const levelOrder: (keyof LessonMastery['levels'])[] = ['crawl', 'walk', 'runGuided', 'runIndependent'];
    const currentIndex = levelOrder.indexOf(levelKey);
    if (currentIndex === 0) return true;

    const previousLevel = mastery.levels[levelOrder[currentIndex - 1]];
    return previousLevel.status === 'completed';
  };

  return (
    <div className="space-y-2">
      {Object.entries(mastery.levels).map(([levelKey, level]) => {
        const isClickable = canClickLevel(levelKey as keyof LessonMastery['levels'], level);
        const isCurrent = level.status === 'in_progress';

        return (
          <div
            key={levelKey}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
              isCurrent
                ? 'bg-yellow-900/20 border-yellow-500/50'
                : level.status === 'completed'
                ? 'bg-green-900/20 border-green-500/50'
                : 'bg-slate-800/50 border-slate-700'
            } ${isClickable ? 'cursor-pointer hover:bg-slate-700/50' : 'cursor-not-allowed opacity-60'}`}
            onClick={() => isClickable && onLevelClick?.(levelKey as keyof LessonMastery['levels'])}
          >
            <div className="flex items-center space-x-3">
              {getLevelIcon(level)}
              <div className="flex-1">
                <div className={`font-medium ${isCurrent ? 'text-yellow-400' : level.status === 'completed' ? 'text-green-400' : 'text-gray-400'}`}>
                  {level.name}
                </div>
                <div className="text-xs text-gray-500">
                  {level.perfectCount}/{level.requiredPerfect} perfect attempts
                </div>
              </div>
              {canClickLevel(levelKey as keyof LessonMastery['levels'], level) && (
                <button
                  onClick={() => onLevelClick?.(levelKey as keyof LessonMastery['levels'])}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition-colors"
                >
                  Start Level
                </button>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {getProgressDots(level)}
            </div>
          </div>
        );
      })}
    </div>
  );
}