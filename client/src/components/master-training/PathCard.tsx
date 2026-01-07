import React from 'react';
import { Target, Crown, Settings, Star } from 'lucide-react';

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

interface PathCardProps {
  path: LearningPath;
  onPathSelect: (path: LearningPath) => void;
}

const getCareerFocusIcon = (focus: string) => {
  switch (focus) {
    case 'generalist': return <Target className="w-5 h-5" />;
    case 'leadership': return <Crown className="w-5 h-5" />;
    case 'technical': return <Settings className="w-5 h-5" />;
    case 'specialist': return <Star className="w-5 h-5" />;
    default: return <Target className="w-5 h-5" />;
  }
};

const getCareerFocusColor = (focus: string) => {
  switch (focus) {
    case 'generalist': return 'text-blue-400 border-blue-400';
    case 'leadership': return 'text-purple-400 border-purple-400';
    case 'technical': return 'text-green-400 border-green-400';
    case 'specialist': return 'text-orange-400 border-orange-400';
    default: return 'text-gray-400 border-gray-400';
  }
};

const PathCard: React.FC<PathCardProps> = ({ path, onPathSelect }) => {
  return (
    <div
      className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors cursor-pointer"
      onClick={() => onPathSelect(path)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center px-3 py-1 rounded-full border ${getCareerFocusColor(path.careerFocus)}`}>
          {getCareerFocusIcon(path.careerFocus)}
          <span className="ml-2 text-sm font-medium capitalize">{path.careerFocus}</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Level {path.currentLevel}/{path.totalLevels}</div>
          <div className="text-xs text-slate-500">{path.estimatedCompletion}</div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
      <p className="text-slate-400 text-sm mb-4">{path.description}</p>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-400 mb-1">
          <span>Progress</span>
          <span>{path.progress}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${path.progress}%` }}
          ></div>
        </div>
      </div>

      {path.progress > 0 ? (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-white font-medium mb-2">Strengths</h4>
            <ul className="space-y-1">
              {path.strengths.slice(0, 2).map((strength, index) => (
                <li key={index} className="flex items-center text-slate-300">
                  <span className="w-3 h-3 mr-2 rounded-full bg-green-400"></span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Focus Areas</h4>
            <ul className="space-y-1">
              {path.areasForImprovement.slice(0, 2).map((area, index) => (
                <li key={index} className="flex items-center text-slate-300">
                  <span className="w-3 h-3 mr-2 rounded-full bg-blue-400"></span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-lg p-4">
          <div className="flex items-center text-indigo-400 mb-2">
            <span className="w-4 h-4 mr-2 rounded-full bg-indigo-400"></span>
            <h4 className="font-medium">Ready to Start</h4>
          </div>
          <p className="text-sm text-slate-400">
            Begin your {path.careerFocus} training journey with AI-adaptive scenarios that match your skill level.
          </p>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            <span className="mr-2">Recommended pace:</span>
            <span className="capitalize text-indigo-400">{path.recommendedPace}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathCard;