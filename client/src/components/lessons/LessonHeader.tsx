/**
 * Component for rendering the lesson header with navigation and level info
 */

import { ArrowLeft, Clock, Award } from "lucide-react";
import type { LevelConfig } from "../utils/masteryLevelConfig";

interface LessonHeaderProps {
  lessonTitle: string;
  lessonDuration: string;
  lessonXp: number;
  levelConfig: LevelConfig;
  weekNumber: number | null;
  onNavigateBack: () => void;
}

export function LessonHeader({
  lessonTitle,
  lessonDuration,
  lessonXp,
  levelConfig,
  weekNumber,
  onNavigateBack,
}: LessonHeaderProps) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onNavigateBack}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              Back to {weekNumber ? `Week ${weekNumber}` : "Curriculum"}
            </span>
          </button>

          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full ${levelConfig.bgColor}`}
          >
            {levelConfig.icon()}
            <span className={`text-sm font-medium ${levelConfig.color}`}>
              {levelConfig.name}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{lessonTitle}</h1>
            <p className="text-slate-400 mb-4">{levelConfig.description}</p>

            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{lessonDuration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>{lessonXp} XP</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-400">{lessonXp}</div>
            <div className="text-sm text-slate-500">Experience Points</div>
          </div>
        </div>
      </div>
    </div>
  );
}
