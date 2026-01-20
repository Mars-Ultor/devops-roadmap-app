/**
 * Phase 3.0: Master Training
 * AI-powered adaptive difficulty and personalized learning paths
 */

import { useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";
import { useMasterTraining } from "../hooks/useMasterTraining";
import PathSelection from "../components/master-training/PathSelection";
import PathOverview from "../components/master-training/PathOverview";
import TrainingPhase from "../components/master-training/TrainingPhase";
import ProgressPhase from "../components/master-training/ProgressPhase";
import { ADAPTIVE_SCENARIOS } from "../data/masterTrainingScenarios";
import { PATH_SCENARIO_MAP } from "../data/masterTrainingScenarioMap";

interface AdaptiveScenario {
  id: string;
  title: string;
  baseDifficulty: "beginner" | "intermediate" | "advanced" | "expert";
  currentDifficulty: number; // 1-10 scale
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

interface LearningPath {
  id: string;
  title: string;
  description: string;
  careerFocus: "generalist" | "specialist" | "leadership" | "technical";
  currentLevel: number;
  totalLevels: number;
  progress: number;
  estimatedCompletion: string;
  currentScenario?: AdaptiveScenario;
  completedScenarios: string[];
  strengths: string[];
  areasForImprovement: string[];
  recommendedPace: "accelerated" | "standard" | "intensive";
}

interface MasterTrainingSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  learningPath: LearningPath;
  currentScenario: AdaptiveScenario;
  performanceData: {
    decisions: unknown[];
    communications: unknown[];
    timeSpent: number;
    score: number;
    difficultyAdjustment: number;
  };
  aiRecommendations: {
    nextDifficulty: number;
    focusAreas: string[];
    suggestedScenarios: string[];
    learningInsights: string[];
  };
}

// Removed old MasterTraining component - using refactored version below
export default function MasterTraining() {
  const navigate = useNavigate();
  const { state, actions } = useMasterTraining(
    ADAPTIVE_SCENARIOS,
    PATH_SCENARIO_MAP,
  );

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your training progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Brain className="w-8 h-8 mr-3 text-indigo-400" />
                Master Training
              </h1>
              <p className="text-slate-400 mt-2">
                Phase 3.0: AI-powered adaptive difficulty and personalized
                learning paths
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {state.phase === "selection" && (
          <PathSelection
            learningPaths={state.learningPaths}
            onPathSelect={actions.startLearningPath}
          />
        )}

        {state.phase === "path-overview" && state.selectedPath && (
          <PathOverview
            selectedPath={state.selectedPath}
            adaptiveScenarios={ADAPTIVE_SCENARIOS}
            pathScenarioMap={PATH_SCENARIO_MAP}
            onBack={() => actions.goToPhase("selection")}
            onBeginTraining={actions.beginTrainingSession}
          />
        )}

        {state.phase === "training" && state.currentSession && (
          <TrainingPhase state={state} actions={actions} />
        )}

        {(state.phase === "insights" || state.phase === "progress") && (
          <ProgressPhase state={state} actions={actions} />
        )}
      </div>
    </div>
  );
}

// Export types for sub-components
export type {
  AdaptiveScenario,
  AdaptiveChallenge,
  AdaptiveOption,
  LearningPath,
  MasterTrainingSession,
};
