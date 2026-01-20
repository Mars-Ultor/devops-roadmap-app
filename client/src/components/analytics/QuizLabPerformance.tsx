import React from "react";
import { Brain, CheckCircle } from "lucide-react";

interface AnalyticsData {
  quizSuccessRate: number;
  avgQuizScore: number;
  labSuccessRate: number;
  avgLabScore: number;
}

interface QuizLabPerformanceProps {
  analytics: AnalyticsData;
}

const QuizLabPerformance: React.FC<QuizLabPerformanceProps> = ({
  analytics,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold">Quiz Performance</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Success Rate</span>
            <span
              className={`font-semibold ${analytics.quizSuccessRate >= 0.7 ? "text-green-400" : "text-yellow-400"}`}
            >
              {Math.round(analytics.quizSuccessRate * 100)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Average Score</span>
            <span className="text-white font-semibold">
              {Math.round(analytics.avgQuizScore)}%
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${analytics.avgQuizScore}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-semibold">Lab Performance</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Completion Rate</span>
            <span
              className={`font-semibold ${analytics.labSuccessRate >= 0.7 ? "text-green-400" : "text-yellow-400"}`}
            >
              {Math.round(analytics.labSuccessRate * 100)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Average Score</span>
            <span className="text-white font-semibold">
              {Math.round(analytics.avgLabScore)}%
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${analytics.avgLabScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLabPerformance;
