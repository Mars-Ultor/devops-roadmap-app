import React from 'react';
import { Target, Activity, TrendingUp } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  careerFocus: 'generalist' | 'specialist' | 'leadership' | 'technical';
  currentLevel: number;
  totalLevels: number;
  progress: number;
  estimatedCompletion: string;
  completedScenarios: string[];
  strengths: string[];
  areasForImprovement: string[];
  recommendedPace: 'accelerated' | 'standard' | 'intensive';
}

interface ProgressOverviewProps {
  selectedPath: LearningPath;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({ selectedPath }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-slate-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Current Progress</h3>
          <Target className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="text-3xl font-bold text-indigo-400 mb-2">{selectedPath.progress}%</div>
        <div className="text-sm text-slate-400">Level {selectedPath.currentLevel} of {selectedPath.totalLevels}</div>
        <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${selectedPath.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Estimated Completion</h3>
          <Activity className="w-6 h-6 text-green-400" />
        </div>
        <div className="text-2xl font-bold text-green-400 mb-2">{selectedPath.estimatedCompletion}</div>
        <div className="text-sm text-slate-400">At current pace</div>
      </div>

      <div className="bg-slate-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recommended Pace</h3>
          <TrendingUp className="w-6 h-6 text-blue-400" />
        </div>
        <div className="text-xl font-bold text-blue-400 mb-2 capitalize">{selectedPath.recommendedPace}</div>
        <div className="text-sm text-slate-400">AI-optimized for you</div>
      </div>
    </div>
  );
};

export default ProgressOverview;