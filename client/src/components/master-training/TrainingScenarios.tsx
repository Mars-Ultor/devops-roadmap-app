import React from 'react';
import { Activity, CheckCircle } from 'lucide-react';

interface AdaptiveScenario {
  id: string;
  title: string;
  baseDifficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  currentDifficulty: number;
  category: 'stress' | 'leadership' | 'specialized' | 'integration' | 'technical';
  estimatedTime: number;
  skills: string[];
  prerequisites: string[];
  description: string;
  scenario: string;
  challenges: AdaptiveChallenge[];
  adaptiveFactors: {
    timePressure: number;
    complexity: number;
    stakeholderCount: number;
    technicalDepth: number;
    communicationLoad: number;
  };
  performanceMetrics: {
    accuracy: number;
    speed: number;
    communication: number;
    leadership: number;
    technical: number;
  };
  nextRecommendedLevel: number;
}

interface AdaptiveChallenge {
  id: string;
  phase: string;
  situation: string;
  options: AdaptiveOption[];
  correctOptionId: string;
  adaptiveHint?: string;
  learningObjective: string;
}

interface AdaptiveOption {
  id: string;
  text: string;
  outcome: 'optimal' | 'suboptimal' | 'poor';
  explanation: string;
  skillsAssessed: string[];
}

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

interface TrainingScenariosProps {
  selectedPath: LearningPath;
  adaptiveScenarios: AdaptiveScenario[];
  pathScenarioMap: Record<string, string[]>;
}

const getDifficultyColor = (level: number) => {
  if (level <= 3) return 'text-green-400';
  if (level <= 6) return 'text-yellow-400';
  if (level <= 8) return 'text-orange-400';
  return 'text-red-400';
};

const TrainingScenarios: React.FC<TrainingScenariosProps> = ({
  selectedPath,
  adaptiveScenarios,
  pathScenarioMap
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20 p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-indigo-400" />
        Available Training Scenarios
      </h3>
      <div className="space-y-3">
        {(pathScenarioMap[selectedPath.id] || []).map((scenarioId) => {
          const scenario = adaptiveScenarios.find(s => s.id === scenarioId);
          if (!scenario) return null;

          const isCompleted = selectedPath.completedScenarios.includes(scenarioId);

          return (
            <div key={scenario.id} className={`bg-slate-900 rounded-lg p-4 ${isCompleted ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium flex items-center">
                  {isCompleted && <CheckCircle className="w-4 h-4 mr-2 text-green-400" />}
                  {scenario.title}
                  {isCompleted && <span className="ml-2 text-xs text-green-400">(Completed)</span>}
                </h4>
                <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(scenario.currentDifficulty)}`}>
                  Level {scenario.currentDifficulty}/10
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {scenario.skills.map((skill, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-xs text-slate-400">
                <span className="w-3 h-3 mr-1 rounded-full bg-slate-600"></span>
                {scenario.estimatedTime} minutes
                <span className="mx-2">•</span>
                <span className="capitalize">{scenario.category}</span>
                <span className="mx-2">•</span>
                <span>{scenario.challenges.length} challenges</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainingScenarios;