/**
 * AARReviewPanel - AI-powered AAR analysis and follow-up questions
 */

import { useState, useEffect } from "react";
import { Brain, HelpCircle, Lightbulb } from "lucide-react";
import { reviewAAR } from "../../services/aiCoach";

interface AARReviewPanelProps {
  readonly aar: {
    objective: string;
    whatWorked: string[];
    whatDidntWork: string[];
    rootCauses: string[];
    improvements: string[];
    transferableKnowledge: string;
  };
}

const LoadingState = () => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
    <div className="flex items-center gap-3">
      <Brain className="w-6 h-6 text-indigo-400 animate-pulse" />
      <div>
        <h3 className="text-lg font-bold text-white">AI Coach Review</h3>
        <p className="text-sm text-slate-400">Analyzing your reflection...</p>
      </div>
    </div>
  </div>
);

export default function AARReviewPanel({ aar }: AARReviewPanelProps) {
  const [review, setReview] = useState<{
    questions: string[];
    insights: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function analyze() {
      setLoading(true);
      try {
        const result = await reviewAAR(aar);
        setReview(result);
      } catch (error) {
        console.error("Error reviewing AAR:", error);
      } finally {
        setLoading(false);
      }
    }
    analyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingState />;
  if (!review) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-2 border-indigo-500/30 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">AI Coach Review</h3>
          <p className="text-sm text-indigo-200">Deepening your reflection</p>
        </div>
      </div>
      {review.insights.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h4 className="font-semibold text-white">Insights</h4>
          </div>
          <div className="space-y-2">
            {review.insights.map((insight) => (
              <div
                key={insight}
                className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3"
              >
                <p className="text-purple-100 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {review.questions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white">Follow-up Questions</h4>
          </div>
          <div className="space-y-3">
            {review.questions.map((question) => (
              <div
                key={question}
                className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-4"
              >
                <p className="text-indigo-100">{question}</p>
                <textarea
                  placeholder="Reflect on this question... (optional)"
                  className="w-full mt-3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-indigo-700/30">
        <p className="text-xs text-indigo-300 text-center">
          💡 These questions help you think deeper about your learning.
        </p>
      </div>
    </div>
  );
}
