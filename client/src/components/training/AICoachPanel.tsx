/**
 * AICoachPanel - Real-time coaching feedback panel
 */

import { useState, useEffect } from "react";
import { Brain, Sparkles, MessageCircle } from "lucide-react";
import {
  getCoachFeedback,
  type CoachFeedback,
  type CoachContext,
} from "../../services/aiCoach";

interface AICoachPanelProps {
  context: CoachContext;
  autoUpdate?: boolean;
  updateInterval?: number;
}

const FEEDBACK_STYLES: Record<
  string,
  { icon: string; border: string; bg: string }
> = {
  encouragement: {
    icon: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-900/20",
  },
  hint: {
    icon: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-900/20",
  },
  warning: {
    icon: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-900/20",
  },
  insight: {
    icon: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-900/20",
  },
  question: {
    icon: "text-indigo-400",
    border: "border-indigo-500/30",
    bg: "bg-indigo-900/20",
  },
};

const DEFAULT_STYLES = {
  icon: "text-slate-400",
  border: "border-slate-700",
  bg: "bg-slate-800",
};

const LoadingState = () => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
        <Brain className="w-5 h-5 text-white animate-pulse" />
      </div>
      <div>
        <div className="text-white font-semibold">AI Coach</div>
        <div className="text-sm text-slate-400">Analyzing your progress...</div>
      </div>
    </div>
  </div>
);

export default function AICoachPanel({
  context,
  autoUpdate = false,
  updateInterval = 30000,
}: AICoachPanelProps) {
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await getCoachFeedback(context);
      setFeedback(response);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching coach feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
    if (autoUpdate) {
      const interval = setInterval(fetchFeedback, updateInterval);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.contentId, context.userProgress.attempts]);

  if (loading && !feedback) return <LoadingState />;

  const styles = feedback?.type
    ? (FEEDBACK_STYLES[feedback.type] ?? DEFAULT_STYLES)
    : DEFAULT_STYLES;
  const typeLabel = feedback
    ? feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)
    : "Coach";

  return (
    <div
      className={`border-2 rounded-lg p-4 transition-all ${styles.border} ${styles.bg}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-semibold ${styles.icon}`}>{typeLabel}</span>
            {feedback && feedback.confidence >= 0.8 && (
              <Sparkles className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          {feedback && (
            <p className="text-slate-200 leading-relaxed mb-3">
              {feedback.message}
            </p>
          )}
          {feedback?.context && (
            <div className="text-xs text-slate-400 mt-2 p-2 bg-slate-900/50 rounded">
              Context: {feedback.context}
            </div>
          )}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
            <div className="text-xs text-slate-500">
              Updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <button
              onClick={fetchFeedback}
              disabled={loading}
              className="text-xs text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              {loading ? "Updating..." : "Get New Feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
