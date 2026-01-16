import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface AnalyticsData {
  totalFailures: number;
  aarCompleted: number;
  lessonsLearned: number;
  resetTokensUsed: number;
}

interface FailureAnalysisProps {
  analytics: AnalyticsData;
}

const FailureAnalysis: React.FC<FailureAnalysisProps> = ({ analytics }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-6 h-6 text-orange-400" />
        <h2 className="text-xl font-semibold">Failure Analysis & Learning</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Total Failures</div>
          <div className="text-2xl font-bold text-orange-400">{analytics.totalFailures}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">AARs Completed</div>
          <div className="text-2xl font-bold text-blue-400">{analytics.aarCompleted}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Lessons Learned</div>
          <div className="text-2xl font-bold text-green-400">{analytics.lessonsLearned}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Resets Used</div>
          <div className="text-2xl font-bold text-yellow-400">{analytics.resetTokensUsed}</div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <p className="text-sm text-blue-300">
          <span className="font-semibold">AAR Completion Rate:</span> {analytics.totalFailures > 0 ? Math.round((analytics.aarCompleted / analytics.totalFailures) * 100) : 0}%
          {analytics.aarCompleted < analytics.totalFailures && (
            <span className="ml-2 text-yellow-300">
              ({analytics.totalFailures - analytics.aarCompleted} failures without AAR review)
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default FailureAnalysis;