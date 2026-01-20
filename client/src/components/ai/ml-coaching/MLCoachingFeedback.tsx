/**
 * MLCoachingFeedback - AI Coach feedback display and header components
 */

import {
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import type { CoachFeedback } from "../../../types/aiCoach";

// ============================================================================
// Feedback Display Component
// ============================================================================

interface CoachFeedbackDisplayProps {
  readonly feedback: CoachFeedback;
}

export function CoachFeedbackDisplay({ feedback }: CoachFeedbackDisplayProps) {
  const getFeedbackColor = (type: string) => {
    switch (type) {
      case "encouragement":
        return "text-green-400 bg-green-900/20 border-green-700";
      case "warning":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-700";
      case "insight":
        return "text-blue-400 bg-blue-900/20 border-blue-700";
      case "tactical_advice":
        return "text-purple-400 bg-purple-900/20 border-purple-700";
      case "discipline":
        return "text-red-400 bg-red-900/20 border-red-700";
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-700";
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "medium":
        return <Target className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className={`border-2 rounded-lg ${getFeedbackColor(feedback.type)}`}>
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          {getPriorityIcon(feedback.priority)}
          <h3 className="text-lg font-semibold">AI Coach Feedback</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-gray-300 ml-auto">
            {feedback.confidence
              ? `${Math.round(feedback.confidence * 100)}%`
              : "High"}{" "}
            confidence
          </span>
        </div>
      </div>
      <div className="p-6">
        <p className="text-lg mb-3">{feedback.message}</p>
        {feedback.context && (
          <p className="text-sm text-gray-400 mb-3">{feedback.context}</p>
        )}
        {feedback.followUpQuestions &&
          feedback.followUpQuestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Follow-up questions:</p>
              <ul className="space-y-1">
                {feedback.followUpQuestions.map((question) => (
                  <li key={question} className="text-sm flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">•</span>
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}

// ============================================================================
// Dashboard Header Component
// ============================================================================

interface DashboardHeaderProps {
  readonly onRefresh: () => void;
  readonly isLoading: boolean;
}

export function DashboardHeader({
  onRefresh,
  isLoading,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-indigo-400" />
        <div>
          <h2 className="text-2xl font-bold">ML-Powered AI Coach</h2>
          <p className="text-gray-300">
            Intelligent coaching with machine learning insights
          </p>
        </div>
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw
          className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
        />
        Refresh Insights
      </button>
    </div>
  );
}
