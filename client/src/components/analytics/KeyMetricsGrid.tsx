import React from "react";
import { Clock, Flame, Trophy, Target } from "lucide-react";

interface AnalyticsData {
  totalStudyTime: number;
  currentStreak: number;
  masteryRate: number;
  battleDrillsCompleted: number;
}

interface KeyMetricsGridProps {
  analytics: AnalyticsData;
  formatDuration: (seconds: number) => string;
}

const KeyMetricsGrid: React.FC<KeyMetricsGridProps> = ({
  analytics,
  formatDuration,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 border border-blue-500">
        <div className="flex items-center justify-between mb-2">
          <Clock className="w-8 h-8 text-blue-200" />
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {formatDuration(analytics.totalStudyTime)}
            </div>
            <div className="text-sm text-blue-200">Study Time</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 border border-orange-500">
        <div className="flex items-center justify-between mb-2">
          <Flame className="w-8 h-8 text-orange-200" />
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {analytics.currentStreak}
            </div>
            <div className="text-sm text-orange-200">Day Streak</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 border border-green-500">
        <div className="flex items-center justify-between mb-2">
          <Trophy className="w-8 h-8 text-green-200" />
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {Math.round(analytics.masteryRate * 100)}%
            </div>
            <div className="text-sm text-green-200">Mastery Rate</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 border border-purple-500">
        <div className="flex items-center justify-between mb-2">
          <Target className="w-8 h-8 text-purple-200" />
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {analytics.battleDrillsCompleted}
            </div>
            <div className="text-sm text-purple-200">Drills Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyMetricsGrid;
