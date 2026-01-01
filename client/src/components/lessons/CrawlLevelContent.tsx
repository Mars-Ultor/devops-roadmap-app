/**
 * CrawlLevelContent - Step-by-step guided execution
 * Shows each step with commands, explanations, and validation
 */

import { type FC, useState } from 'react';
import { CheckCircle, Circle, AlertCircle, Terminal, HelpCircle } from 'lucide-react';
import type { CrawlContent } from '../../types/lessonContent';

interface CrawlLevelContentProps {
  content: CrawlContent;
  onStepComplete: (stepNumber: number) => void;
  completedSteps: number[];
}

export const CrawlLevelContent: FC<CrawlLevelContentProps> = ({
  content,
  onStepComplete,
  completedSteps
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [showMistakes, setShowMistakes] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-300 mb-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Crawl Level: Guided Execution
        </h3>
        <p className="text-slate-300">{content.introduction}</p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {content.steps.map((step) => {
          const isCompleted = completedSteps.includes(step.stepNumber);
          const isExpanded = expandedStep === step.stepNumber;
          const canExpand = isCompleted || step.stepNumber === 1 || completedSteps.includes(step.stepNumber - 1);

          return (
            <div
              key={step.stepNumber}
              className={`border rounded-lg transition-all ${
                isCompleted
                  ? 'bg-emerald-900/20 border-emerald-500/50'
                  : canExpand
                  ? 'bg-slate-800/50 border-slate-600'
                  : 'bg-slate-900/50 border-slate-700 opacity-50'
              }`}
            >
              {/* Step Header */}
              <button
                onClick={() => canExpand && setExpandedStep(isExpanded ? null : step.stepNumber)}
                className="w-full p-4 flex items-center justify-between text-left"
                disabled={!canExpand}
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400 flex-shrink-0" />
                  )}
                  <div>
                    <span className="text-sm text-slate-400">Step {step.stepNumber}</span>
                    <h4 className="text-white font-medium">{step.instruction}</h4>
                  </div>
                </div>
              </button>

              {/* Step Details */}
              {isExpanded && canExpand && (
                <div className="px-4 pb-4 space-y-4 border-t border-slate-700 pt-4">
                  {/* Command */}
                  {step.command && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Command to execute:</label>
                      <div className="bg-slate-950 rounded p-4 font-mono text-sm text-emerald-400 flex items-start gap-2">
                        <Terminal className="w-4 h-4 mt-1 flex-shrink-0" />
                        <code className="flex-1">{step.command}</code>
                        <button
                          onClick={() => navigator.clipboard.writeText(step.command!)}
                          className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-blue-300 mb-2">Why this step?</h5>
                    <p className="text-slate-300 text-sm">{step.explanation}</p>
                  </div>

                  {/* Expected Output */}
                  {step.expectedOutput && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Expected output:</label>
                      <div className="bg-slate-900 border border-slate-700 rounded p-3 font-mono text-xs text-slate-300">
                        {step.expectedOutput}
                      </div>
                    </div>
                  )}

                  {/* Validation Criteria */}
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2">Check that:</h5>
                    <ul className="space-y-1">
                      {step.validationCriteria.map((criteria, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Common Mistakes (collapsible) */}
                  {step.commonMistakes && step.commonMistakes.length > 0 && (
                    <div className="border border-amber-500/30 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          setShowMistakes((prev) => ({
                            ...prev,
                            [step.stepNumber]: !prev[step.stepNumber]
                          }))
                        }
                        className="w-full bg-amber-900/20 px-4 py-2 flex items-center justify-between text-left"
                      >
                        <span className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Common Mistakes
                        </span>
                        <span className="text-amber-400">
                          {showMistakes[step.stepNumber] ? '−' : '+'}
                        </span>
                      </button>
                      {showMistakes[step.stepNumber] && (
                        <div className="px-4 py-3 space-y-2">
                          {step.commonMistakes.map((mistake, idx) => (
                            <p key={idx} className="text-sm text-slate-300">
                              • {mistake}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mark Complete Button */}
                  {!isCompleted && (
                    <button
                      onClick={() => onStepComplete(step.stepNumber)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      Mark Step {step.stepNumber} Complete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expected Outcome */}
      {completedSteps.length === content.steps.length && (
        <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-emerald-300 mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            All Steps Complete!
          </h3>
          <p className="text-slate-300">{content.expectedOutcome}</p>
          <p className="text-sm text-emerald-400 mt-3">
            You've mastered the Crawl level. Complete this perfectly 3 times to unlock Walk level.
          </p>
        </div>
      )}
    </div>
  );
};
