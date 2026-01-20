/**
 * ML-Powered Coaching Dashboard
 * Comprehensive AI coaching with machine learning insights
 */

import { useState, useEffect } from "react";
import {
  useMLEnhancedAICoach,
  useMLLearningPath,
  useMLSkillGapAnalysis,
  useMLPerformancePrediction,
  useMLLearningStyle,
} from "../../hooks/useMLEnhancedAICoach";
import { Brain, Target, TrendingUp, BookOpen, Users } from "lucide-react";
import type { CoachContext } from "../../types/aiCoach";

// Import extracted components
import {
  LearningStyleCard,
  PerformancePredictionCard,
  SkillGapsCard,
  RecommendationsCard,
  LearningPathTab,
  SkillGapsTab,
  PerformanceTab,
  LearningStyleTab,
  NoContextDisplay,
  ErrorDisplay,
} from "./ml-coaching/MLCoachingComponents";
import {
  CoachFeedbackDisplay,
  DashboardHeader,
} from "./ml-coaching/MLCoachingFeedback";

interface MLCoachingDashboardProps {
  context?: CoachContext;
}

type TabId =
  | "overview"
  | "learning-path"
  | "skill-gaps"
  | "performance"
  | "style";

const TAB_CONFIG = [
  { id: "overview" as const, label: "Overview", icon: Brain },
  { id: "learning-path" as const, label: "Learning Path", icon: BookOpen },
  { id: "skill-gaps" as const, label: "Skill Gaps", icon: Target },
  { id: "performance" as const, label: "Performance", icon: TrendingUp },
  { id: "style" as const, label: "Learning Style", icon: Users },
];

export function MLCoachingDashboard({ context }: MLCoachingDashboardProps) {
  const [currentContext, setCurrentContext] = useState<
    CoachContext | undefined
  >(context);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // ML-powered hooks
  const {
    feedback,
    recommendations,
    loading: coachLoading,
    error: coachError,
    refreshInsights,
  } = useMLEnhancedAICoach(currentContext);
  const {
    optimizedPath,
    loading: pathLoading,
    optimizePath,
  } = useMLLearningPath();
  const {
    skillGaps,
    loading: gapLoading,
    analyzeGaps,
  } = useMLSkillGapAnalysis();
  const {
    prediction,
    loading: predictionLoading,
    predictPerformance,
  } = useMLPerformancePrediction();
  const {
    learningStyle,
    loading: styleLoading,
    detectStyle,
  } = useMLLearningStyle();

  const isLoading =
    coachLoading ||
    pathLoading ||
    gapLoading ||
    predictionLoading ||
    styleLoading;

  useEffect(() => {
    if (context) setCurrentContext(context);
  }, [context]);

  const handleRefreshAll = async () => {
    if (!currentContext) return;
    await Promise.all([
      refreshInsights(),
      optimizePath(currentContext),
      analyzeGaps(currentContext),
      predictPerformance(currentContext),
      detectStyle(currentContext),
    ]);
  };

  if (!currentContext) {
    return <NoContextDisplay />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader onRefresh={handleRefreshAll} isLoading={isLoading} />

      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <div className="flex gap-1">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-400 text-indigo-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Coach Feedback */}
      {feedback && <CoachFeedbackDisplay feedback={feedback} />}

      {/* Tab Content */}
      <div className="space-y-6 min-h-[400px]">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LearningStyleCard learningStyle={learningStyle} />
            <PerformancePredictionCard prediction={prediction} />
            <SkillGapsCard skillGaps={skillGaps} />
            <RecommendationsCard recommendations={recommendations} />
          </div>
        )}

        {activeTab === "learning-path" && (
          <LearningPathTab optimizedPath={optimizedPath} />
        )}
        {activeTab === "skill-gaps" && <SkillGapsTab skillGaps={skillGaps} />}
        {activeTab === "performance" && (
          <PerformanceTab prediction={prediction} />
        )}
        {activeTab === "style" && (
          <LearningStyleTab learningStyle={learningStyle} />
        )}
      </div>

      {/* Error Display */}
      {coachError && <ErrorDisplay error={coachError} />}
    </div>
  );
}
