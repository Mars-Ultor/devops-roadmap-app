/**
 * ContentGate - Blocks access to lessons/labs until daily drill is completed
 * Shows blocking modal if drill is required
 */

import { type ReactNode } from "react";
import { useDailyDrill } from "../../hooks/useDailyDrill";
import { Lock, Target } from "lucide-react";

interface ContentGateProps {
  children: ReactNode;
  contentType?: "lesson" | "lab" | "quiz" | "general";
}

export default function ContentGate({
  children,
  contentType = "general",
}: ContentGateProps) {
  const { dailyDrillRequired, dailyDrillCompleted, loading } = useDailyDrill();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Checking training requirements...</p>
        </div>
      </div>
    );
  }

  // If daily drill is required and not completed, show blocking message
  if (dailyDrillRequired && !dailyDrillCompleted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-800 rounded-lg border-2 border-red-500/50 p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-6">
              <Lock className="w-8 h-8 text-red-400" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">
              Daily Drill Required
            </h1>

            <p className="text-lg text-slate-300 mb-6">
              You must complete your daily drill before accessing new{" "}
              {contentType} content.
            </p>

            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700 mb-6">
              <div className="flex items-start gap-3 text-left">
                <Target className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    Why Daily Drills?
                  </h3>
                  <p className="text-sm text-slate-400">
                    Daily drills use spaced repetition to prevent skill decay.
                    Completing quick 5-10 minute reviews of past content ensures
                    you retain what you've learned and build muscle memory for
                    critical DevOps tasks.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Target className="w-5 h-5" />
              Return to Dashboard to Complete Drill
            </a>

            <p className="text-sm text-slate-500 mt-4">
              This takes less than 10 minutes and keeps your skills sharp.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Drill completed or not required - show content
  return <>{children}</>;
}
