import React from 'react';
import PathCard from './PathCard';

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

interface PathSelectionProps {
  learningPaths: LearningPath[];
  onPathSelect: (path: LearningPath) => void;
}

const PathSelection: React.FC<PathSelectionProps> = ({ learningPaths, onPathSelect }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Choose Your Learning Path</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Select a personalized learning path based on your career goals. Our AI will adapt scenarios
          to your skill level and learning pace for optimal development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningPaths.map((path) => (
          <PathCard
            key={path.id}
            path={path}
            onPathSelect={onPathSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default PathSelection;