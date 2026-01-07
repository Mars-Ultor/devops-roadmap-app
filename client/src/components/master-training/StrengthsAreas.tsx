import React from 'react';
import { CheckCircle, TrendingUp } from 'lucide-react';

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

interface StrengthsAreasProps {
  selectedPath: LearningPath;
}

const StrengthsAreas: React.FC<StrengthsAreasProps> = ({ selectedPath }) => {
  if (selectedPath.strengths.length === 0 && selectedPath.areasForImprovement.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {selectedPath.strengths.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
            Your Strengths
          </h4>
          <div className="space-y-2">
            {selectedPath.strengths.map((strength, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-900 rounded p-3">
                <span className="text-slate-300">{strength}</span>
                <div className="flex items-center">
                  <div className="w-16 bg-slate-700 rounded-full h-2 mr-2">
                    <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-xs text-green-400">75%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPath.areasForImprovement.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
            Areas for Growth
          </h4>
          <div className="space-y-2">
            {selectedPath.areasForImprovement.map((area, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-900 rounded p-3">
                <span className="text-slate-300">{area}</span>
                <div className="flex items-center">
                  <div className="w-16 bg-slate-700 rounded-full h-2 mr-2">
                    <div className="bg-blue-500 h-2 rounded-full w-1/2"></div>
                  </div>
                  <span className="text-xs text-blue-400">50%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StrengthsAreas;