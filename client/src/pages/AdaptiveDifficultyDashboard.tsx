/* eslint-disable max-lines-per-function */
/**
 * Adaptive Difficulty Dashboard
 * View and manage difficulty settings
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Target,
  Brain,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAdaptiveDifficulty } from "../hooks/useAdaptiveDifficulty";
// Temporary local definitions to fix build issue
type DifficultyLevel = "recruit" | "soldier" | "specialist" | "elite";

const DIFFICULTY_THRESHOLDS = {
  recruit: {
    name: "Recruit",
    description: "Learning the basics with full support",
    quizPassingScore: 70,
    quizTimeMultiplier: 1.5,
    labGuidanceLevel: "full" as const,
    drillTimeTarget: 600, // 10 min
    stressIntensity: 1,
  },
  soldier: {
    name: "Soldier",
    description: "Building competence with moderate support",
    quizPassingScore: 75,
    quizTimeMultiplier: 1.2,
    labGuidanceLevel: "partial" as const,
    drillTimeTarget: 480, // 8 min
    stressIntensity: 2,
  },
  specialist: {
    name: "Specialist",
    description: "Demonstrating mastery with minimal support",
    quizPassingScore: 80,
    quizTimeMultiplier: 1.0,
    labGuidanceLevel: "minimal" as const,
    drillTimeTarget: 360, // 6 min
    stressIntensity: 3,
  },
  elite: {
    name: "Elite",
    description: "Operating at professional level under pressure",
    quizPassingScore: 85,
    quizTimeMultiplier: 0.8,
    labGuidanceLevel: "none" as const,
    drillTimeTarget: 300, // 5 min
    stressIntensity: 4,
  },
};

export default function AdaptiveDifficultyDashboard() {
  const navigate = useNavigate();
  const {
    currentLevel,
    settings,
    recommendation,
    recentAdjustments,
    loading,
    adjustDifficulty,
    evaluateRecommendation,
    checkAndAutoAdjust,
  } = useAdaptiveDifficulty();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(
    null,
  );

  useEffect(() => {
    evaluateRecommendation();
  }, [evaluateRecommendation]);

  const handleLevelChange = (level: DifficultyLevel) => {
    setSelectedLevel(level);
    setShowConfirmation(true);
  };

  const confirmLevelChange = async () => {
    if (!selectedLevel) return;

    await adjustDifficulty(
      selectedLevel,
      false,
      `Manual adjustment to ${selectedLevel} by user`,
    );

    setShowConfirmation(false);
    setSelectedLevel(null);
  };

  const handleAutoAdjust = async () => {
    await checkAndAutoAdjust();
  };

  const getLevelColor = (level: DifficultyLevel) => {
    switch (level) {
      case "recruit":
        return "bg-green-900/30 border-green-700 text-green-400";
      case "soldier":
        return "bg-blue-900/30 border-blue-700 text-blue-400";
      case "specialist":
        return "bg-purple-900/30 border-purple-700 text-purple-400";
      case "elite":
        return "bg-red-900/30 border-red-700 text-red-400";
    }
  };

  const getLevelIcon = (level: DifficultyLevel) => {
    switch (level) {
      case "recruit":
        return Shield;
      case "soldier":
        return Target;
      case "specialist":
        return Brain;
      case "elite":
        return Zap;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading difficulty settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-8 h-8 text-indigo-400" />
                <h1 className="text-3xl font-bold">Adaptive Difficulty</h1>
              </div>
              <p className="text-gray-400">
                Dynamic difficulty adjustment based on your performance
              </p>
            </div>
          </div>
        </div>

        {/* Current Level */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Current Difficulty Level
          </h2>

          <div
            className={`border rounded-lg p-6 ${getLevelColor(currentLevel)}`}
          >
            <div className="flex items-center gap-4 mb-4">
              {(() => {
                const Icon = getLevelIcon(currentLevel);
                return <Icon className="w-12 h-12" />;
              })()}
              <div>
                <h3 className="text-2xl font-bold">
                  {DIFFICULTY_THRESHOLDS[currentLevel].name}
                </h3>
                <p className="text-sm opacity-90">
                  {DIFFICULTY_THRESHOLDS[currentLevel].description}
                </p>
              </div>
            </div>

            {settings && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-900/30 rounded-lg p-3">
                  <div className="text-xs opacity-75 mb-1">Quiz Passing</div>
                  <div className="text-lg font-bold">
                    {settings.quizPassingScore}%
                  </div>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-3">
                  <div className="text-xs opacity-75 mb-1">Time Limit</div>
                  <div className="text-lg font-bold">
                    {(settings.quizTimeMultiplier * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-3">
                  <div className="text-xs opacity-75 mb-1">Drill Target</div>
                  <div className="text-lg font-bold">
                    {Math.floor(settings.drillTimeTarget / 60)}m
                  </div>
                </div>
                <div className="bg-gray-900/30 rounded-lg p-3">
                  <div className="text-xs opacity-75 mb-1">Stress Level</div>
                  <div className="text-lg font-bold">
                    {settings.stressIntensity}/5
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendation */}
        {recommendation && recommendation.type !== "maintain" && (
          <div
            className={`border rounded-lg p-6 mb-8 ${
              recommendation.type === "increase"
                ? "bg-green-900/20 border-green-700"
                : "bg-yellow-900/20 border-yellow-700"
            }`}
          >
            <div className="flex items-start gap-4">
              {recommendation.type === "increase" ? (
                <TrendingUp className="w-8 h-8 text-green-400 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-8 h-8 text-yellow-400 flex-shrink-0" />
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  {recommendation.type === "increase"
                    ? "Ready to Advance!"
                    : "Consider Adjusting Difficulty"}
                </h3>
                <p className="text-sm mb-3">
                  Based on your recent performance, we recommend moving to{" "}
                  <span className="font-bold">
                    {DIFFICULTY_THRESHOLDS[recommendation.suggestedLevel].name}
                  </span>{" "}
                  level (confidence:{" "}
                  {(recommendation.confidence * 100).toFixed(0)}%)
                </p>

                <ul className="space-y-1 mb-4">
                  {(recommendation.reasoning || []).map((reason) => (
                    <li key={reason} className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-400" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleAutoAdjust}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
                >
                  Apply Recommendation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Levels */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Difficulty Levels</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(DIFFICULTY_THRESHOLDS) as DifficultyLevel[]).map(
              (level) => {
                const Icon = getLevelIcon(level);
                const threshold = DIFFICULTY_THRESHOLDS[level];
                const isCurrent = level === currentLevel;

                return (
                  <div
                    key={level}
                    className={`border rounded-lg p-6 transition-all ${
                      isCurrent
                        ? getLevelColor(level) +
                          " ring-2 ring-offset-2 ring-offset-gray-900"
                        : "bg-gray-800 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon className="w-8 h-8" />
                        <div>
                          <h3 className="text-lg font-bold">
                            {threshold.name}
                          </h3>
                          <p className="text-xs opacity-75">
                            {threshold.description}
                          </p>
                        </div>
                      </div>
                      {isCurrent && (
                        <div className="px-2 py-1 bg-indigo-600 rounded text-xs font-semibold">
                          CURRENT
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <div className="opacity-75">Quiz Pass:</div>
                        <div className="font-semibold">
                          {threshold.quizPassingScore}%
                        </div>
                      </div>
                      <div>
                        <div className="opacity-75">Time Limit:</div>
                        <div className="font-semibold">
                          {(threshold.quizTimeMultiplier * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div className="opacity-75">Lab Support:</div>
                        <div className="font-semibold capitalize">
                          {threshold.labGuidanceLevel}
                        </div>
                      </div>
                      <div>
                        <div className="opacity-75">Drill Time:</div>
                        <div className="font-semibold">
                          {Math.floor(threshold.drillTimeTarget / 60)}m
                        </div>
                      </div>
                    </div>

                    {!isCurrent && (
                      <button
                        onClick={() => handleLevelChange(level)}
                        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                      >
                        Switch to {threshold.name}
                      </button>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* Recent Adjustments */}
        {recentAdjustments.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Adjustments</h2>

            <div className="space-y-3">
              {(recentAdjustments || []).map((adjustment) => (
                <div
                  key={adjustment.id}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {adjustment.previousLevel !== adjustment.newLevel && (
                        <>
                          {adjustment.newLevel > adjustment.previousLevel ? (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-yellow-400" />
                          )}
                        </>
                      )}
                      {adjustment.previousLevel === adjustment.newLevel && (
                        <Minus className="w-5 h-5 text-gray-400" />
                      )}

                      <div>
                        <div className="font-semibold">
                          {DIFFICULTY_THRESHOLDS[adjustment.previousLevel].name}{" "}
                          → {DIFFICULTY_THRESHOLDS[adjustment.newLevel].name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {adjustment.timestamp.toLocaleDateString()} at{" "}
                          {adjustment.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        adjustment.autoAdjusted
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-purple-900/30 text-purple-400"
                      }`}
                    >
                      {adjustment.autoAdjusted ? "AUTO" : "MANUAL"}
                    </div>
                  </div>

                  <p className="text-sm text-gray-300">{adjustment.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && selectedLevel && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
                <h3 className="text-xl font-bold">Confirm Difficulty Change</h3>
              </div>

              <p className="text-gray-300 mb-4">
                Are you sure you want to change your difficulty level to{" "}
                <span className="font-bold text-white">
                  {DIFFICULTY_THRESHOLDS[selectedLevel].name}
                </span>
                ?
              </p>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2">This will affect:</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Quiz passing scores and time limits</li>
                  <li>• Lab guidance and validation strictness</li>
                  <li>• Battle drill time targets and complexity</li>
                  <li>• Stress training intensity</li>
                  <li>• Spaced repetition review intervals</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmLevelChange}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
                >
                  Confirm Change
                </button>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedLevel(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Military Training Philosophy */}
        <div className="mt-8 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Award className="w-8 h-8 text-indigo-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-2">
                Adaptive Training Philosophy
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">→</span>
                  <span>
                    <span className="font-semibold">
                      Difficulty matches competence
                    </span>{" "}
                    - As you master skills, challenges increase to maintain
                    growth.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">→</span>
                  <span>
                    <span className="font-semibold">
                      Performance drives progression
                    </span>{" "}
                    - Consistent success earns tougher missions. Struggles
                    prompt support.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">→</span>
                  <span>
                    <span className="font-semibold">
                      Elite level mirrors real ops
                    </span>{" "}
                    - Time pressure, minimal guidance, high standards - just
                    like production.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">→</span>
                  <span>
                    <span className="font-semibold">Trust the system</span> -
                    Auto-adjustments happen when metrics clearly indicate
                    readiness or struggle.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
