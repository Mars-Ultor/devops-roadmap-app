/**
 * Extracted UI components for AdaptiveAARForm
 * Reduces main component complexity and improves maintainability
 */

import {
  CheckCircle,
  Sparkles,
  AlertTriangle,
  FileText,
  Zap,
  X,
} from "lucide-react";
import type { StruggleMetrics, AARFormType } from "../../types/aar";

interface StruggleSummaryProps {
  readonly metrics: StruggleMetrics;
}

/** Displays performance metrics summary */
export function StruggleSummary({ metrics }: StruggleSummaryProps) {
  return (
    <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-slate-300 mb-3">
        Your Performance
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div
            className={`text-2xl font-bold ${metrics.hintsUsed === 0 ? "text-green-400" : "text-yellow-400"}`}
          >
            {metrics.hintsUsed}
          </div>
          <div className="text-xs text-slate-400">Hints Used</div>
        </div>
        <div>
          <div
            className={`text-2xl font-bold ${metrics.validationErrors === 0 ? "text-green-400" : "text-yellow-400"}`}
          >
            {metrics.validationErrors}
          </div>
          <div className="text-xs text-slate-400">Errors</div>
        </div>
        <div>
          <div
            className={`text-2xl font-bold ${metrics.retryCount === 0 ? "text-green-400" : "text-yellow-400"}`}
          >
            {metrics.retryCount}
          </div>
          <div className="text-xs text-slate-400">Retries</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">
            {Math.floor(metrics.timeSpentSeconds / 60)}m
          </div>
          <div className="text-xs text-slate-400">Time Spent</div>
        </div>
      </div>
    </div>
  );
}

interface PerfectCompletionScreenProps {
  readonly metrics: StruggleMetrics;
  readonly isSubmitting: boolean;
  readonly onSkip: () => void;
  readonly onSelectType: (type: AARFormType) => void;
}

/** Screen shown when user has perfect completion */
export function PerfectCompletionScreen({
  metrics,
  isSubmitting,
  onSkip,
  onSelectType,
}: PerfectCompletionScreenProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg shadow-xl p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Perfect Completion! 🎉
          </h2>
          <p className="text-slate-300">
            You nailed it with no hints, errors, or retries.
          </p>
        </div>

        <StruggleSummary metrics={metrics} />

        <div className="space-y-3">
          <button
            onClick={onSkip}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Zap className="w-5 h-5" />
            <span>
              {isSubmitting ? "Saving..." : "Skip Reflection & Continue"}
            </span>
          </button>

          <button
            onClick={() => onSelectType("quick")}
            className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            <span>Quick Reflection (Optional)</span>
          </button>

          <button
            onClick={() => onSelectType("full")}
            className="w-full flex items-center justify-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-medium py-2 px-6 rounded-lg transition-colors text-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Full AAR (For Extra Practice)</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-4">
          Since you completed perfectly, detailed reflection isn't required.
        </p>
      </div>
    </div>
  );
}

interface QuickReflection {
  mainTakeaway: string;
  oneImprovement: string;
}

interface QuickReflectionScreenProps {
  readonly metrics: StruggleMetrics;
  readonly reflection: QuickReflection;
  readonly isSubmitting: boolean;
  readonly showBackButton: boolean;
  readonly onReflectionChange: (reflection: QuickReflection) => void;
  readonly onSubmit: () => void;
  readonly onSelectFull: () => void;
  readonly onBack: () => void;
}

/** Screen for quick 2-question reflection */
export function QuickReflectionScreen({
  metrics,
  reflection,
  isSubmitting,
  showBackButton,
  onReflectionChange,
  onSubmit,
  onSelectFull,
  onBack,
}: QuickReflectionScreenProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-900/30 rounded-lg">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quick Reflection</h2>
              <p className="text-sm text-slate-400">
                Minor struggles - abbreviated review
              </p>
            </div>
          </div>
          {showBackButton && (
            <button onClick={onBack} className="p-1 hover:bg-slate-700 rounded">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>

        <StruggleSummary metrics={metrics} />

        <div className="space-y-6">
          <div>
            <label
              htmlFor="mainTakeaway"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              What's your main takeaway from this exercise?
            </label>
            <textarea
              id="mainTakeaway"
              value={reflection.mainTakeaway}
              onChange={(e) =>
                onReflectionChange({
                  ...reflection,
                  mainTakeaway: e.target.value,
                })
              }
              placeholder="The key thing I learned or reinforced..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="oneImprovement"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              One thing you'd do differently?
            </label>
            <textarea
              id="oneImprovement"
              value={reflection.oneImprovement}
              onChange={(e) =>
                onReflectionChange({
                  ...reflection,
                  oneImprovement: e.target.value,
                })
              }
              placeholder="Next time I would..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onSubmit}
              disabled={
                isSubmitting ||
                !reflection.mainTakeaway.trim() ||
                !reflection.oneImprovement.trim()
              }
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              <span>
                {isSubmitting ? "Saving..." : "Submit Quick Reflection"}
              </span>
            </button>

            <button
              onClick={onSelectFull}
              className="flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Full AAR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FullAARRequiredScreenProps {
  readonly metrics: StruggleMetrics;
  readonly onStart: () => void;
}

/** Screen shown when full AAR is required due to significant struggles */
export function FullAARRequiredScreen({
  metrics,
  onStart,
}: FullAARRequiredScreenProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg shadow-xl p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/30 rounded-full mb-4">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Reflection Required
          </h2>
          <p className="text-slate-300">
            You encountered significant struggles. A detailed AAR will help you
            learn from this experience.
          </p>
        </div>

        <StruggleSummary metrics={metrics} />

        <button
          onClick={onStart}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span>Start Full AAR</span>
        </button>

        <p className="text-xs text-slate-500 text-center mt-4">
          Deep reflection on struggles is what accelerates mastery.
        </p>
      </div>
    </div>
  );
}
