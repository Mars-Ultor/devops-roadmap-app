import React from "react";
import { Target, Crown, Settings, Star } from "lucide-react";
import ProgressOverview from "./ProgressOverview";
import StrengthsAreas from "./StrengthsAreas";
import TrainingScenarios from "./TrainingScenarios";
import AIInsights from "./AIInsights";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  careerFocus: "generalist" | "specialist" | "leadership" | "technical";
  currentLevel: number;
  totalLevels: number;
  progress: number;
  estimatedCompletion: string;
  completedScenarios: string[];
  strengths: string[];
  areasForImprovement: string[];
  recommendedPace: "accelerated" | "standard" | "intensive";
}

interface AdaptiveScenario {
  id: string;
  title: string;
  baseDifficulty: "beginner" | "intermediate" | "advanced" | "expert";
  currentDifficulty: number;
  category:
    | "stress"
    | "leadership"
    | "specialized"
    | "integration"
    | "technical";
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
  outcome: "optimal" | "suboptimal" | "poor";
  explanation: string;
  skillsAssessed: string[];
}

interface PathOverviewProps {
  selectedPath: LearningPath;
  adaptiveScenarios: AdaptiveScenario[];
  pathScenarioMap: Record<string, string[]>;
  onBack: () => void;
  onBeginTraining: () => void;
}

const PathOverview: React.FC<PathOverviewProps> = ({
  selectedPath,
  adaptiveScenarios,
  pathScenarioMap,
  onBack,
  onBeginTraining,
}) => {
  const getCareerFocusIcon = (focus: string) => {
    switch (focus) {
      case "generalist":
        return <Target className="w-5 h-5" />;
      case "leadership":
        return <Crown className="w-5 h-5" />;
      case "technical":
        return <Settings className="w-5 h-5" />;
      case "specialist":
        return <Star className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getCareerFocusColor = (focus: string) => {
    switch (focus) {
      case "generalist":
        return "text-blue-400 border-blue-400";
      case "leadership":
        return "text-purple-400 border-purple-400";
      case "technical":
        return "text-green-400 border-green-400";
      case "specialist":
        return "text-orange-400 border-orange-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {selectedPath.title}
            </h2>
            <p className="text-slate-400">{selectedPath.description}</p>
          </div>
          <div
            className={`flex items-center px-4 py-2 rounded-full border ${getCareerFocusColor(selectedPath.careerFocus)}`}
          >
            {getCareerFocusIcon(selectedPath.careerFocus)}
            <span className="ml-2 text-sm font-medium capitalize">
              {selectedPath.careerFocus}
            </span>
          </div>
        </div>

        <ProgressOverview selectedPath={selectedPath} />

        <StrengthsAreas selectedPath={selectedPath} />

        {selectedPath.progress === 0 ? (
          <TrainingScenarios
            selectedPath={selectedPath}
            adaptiveScenarios={adaptiveScenarios}
            pathScenarioMap={pathScenarioMap}
          />
        ) : (
          <AIInsights />
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Back to Paths
          </button>
          <button
            onClick={onBeginTraining}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Begin Master Training
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathOverview;
