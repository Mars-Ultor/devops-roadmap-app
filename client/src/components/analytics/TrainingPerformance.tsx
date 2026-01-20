import React from "react";
import { Zap, Shield } from "lucide-react";

interface AnalyticsData {
  battleDrillsCompleted: number;
  battleDrillAvgTime: number;
  battleDrillSuccessRate: number;
  stressSessionsCompleted: number;
  productionScenariosCompleted: number;
  totalSessions: number;
}

interface TrainingPerformanceProps {
  analytics: AnalyticsData;
  formatTime: (seconds: number) => string;
}

const TrainingPerformance: React.FC<TrainingPerformanceProps> = ({
  analytics,
  formatTime,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Battle Drills */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-semibold">Battle Drill Performance</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Completed</span>
            <span className="text-white font-semibold">
              {analytics.battleDrillsCompleted}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Avg Time</span>
            <span className="text-white font-semibold">
              {formatTime(Math.round(analytics.battleDrillAvgTime))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Success Rate</span>
            <span className="text-green-400 font-semibold">
              {Math.round(analytics.battleDrillSuccessRate * 100)}%
            </span>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-500 to-green-500 h-3 rounded-full transition-all"
                style={{ width: `${analytics.battleDrillSuccessRate * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Training */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-red-400" />
          <h2 className="text-xl font-semibold">Advanced Training</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Stress Sessions</span>
            <span className="text-white font-semibold">
              {analytics.stressSessionsCompleted}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Production Scenarios</span>
            <span className="text-white font-semibold">
              {analytics.productionScenariosCompleted}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Total Sessions</span>
            <span className="text-white font-semibold">
              {analytics.totalSessions}
            </span>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              {analytics.stressSessionsCompleted +
                analytics.productionScenariosCompleted}{" "}
              advanced training scenarios completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPerformance;
