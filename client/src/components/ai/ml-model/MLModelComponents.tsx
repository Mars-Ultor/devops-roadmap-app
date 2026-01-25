/**
 * MLModelComponents - Extracted UI components for MLModelManagementDashboard
 */

import {
  Brain,
  Play,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import type { MLModel, MLPrediction } from "../../../services/mlModelService";

// ============================================================================
// Model Card Component (extracted from inline)
// ============================================================================

interface ModelCardProps {
  readonly model: MLModel;
  readonly onRunInference: (modelId: string) => void;
  readonly onTrain: (modelId: string) => void;
  readonly loading?: boolean;
}

export function ModelCard({
  model,
  onRunInference,
  onTrain,
  loading,
}: ModelCardProps) {
  const getStatusColor = (status: MLModel["status"]) => {
    switch (status) {
      case "ready":
        return "text-green-400 bg-green-900/20 border-green-700";
      case "training":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-700";
      case "error":
        return "text-red-400 bg-red-900/20 border-red-700";
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-700";
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">{model.name}</h3>
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(model.status)}`}
          >
            {model.status}
          </span>
        </div>
        <p className="text-gray-400 text-sm mt-2">{model.description}</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Type:</span>
              <span className="text-white ml-2">{model.type}</span>
            </div>
            <div>
              <span className="text-gray-400">Version:</span>
              <span className="text-white ml-2">{model.version}</span>
            </div>
            <div>
              <span className="text-gray-400">Input Shape:</span>
              <span className="text-white ml-2">
                [{model.inputShape.join(", ")}]
              </span>
            </div>
            <div>
              <span className="text-gray-400">Output Shape:</span>
              <span className="text-white ml-2">
                [{model.outputShape.join(", ")}]
              </span>
            </div>
          </div>

          {model.metrics && (
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Performance Metrics:</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(model.metrics).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-gray-400 capitalize">{key}:</span>
                    <span className="text-indigo-400 ml-2">
                      {typeof value === "number" ? value.toFixed(3) : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => onRunInference(model.id)}
              disabled={model.status !== "ready" || loading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Inference
            </button>
            <button
              onClick={() => onTrain(model.id)}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-indigo-600 rounded-md text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Training...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Train
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Dashboard Header Component
// ============================================================================

interface ModelDashboardHeaderProps {
  readonly onRefresh: () => void;
  readonly loading: boolean;
}

export function ModelDashboardHeader({
  onRefresh,
  loading,
}: ModelDashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-indigo-400" />
        <div>
          <h2 className="text-2xl font-bold">ML Model Management</h2>
          <p className="text-gray-300">
            Monitor and manage machine learning models
          </p>
        </div>
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw
          className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
        />
        Refresh Models
      </button>
    </div>
  );
}

// ============================================================================
// Inference Results Component
// ============================================================================

interface InferenceResultsProps {
  readonly selectedModel: MLModel;
  readonly inferenceResult: MLPrediction;
}

export function InferenceResults({
  selectedModel,
  inferenceResult,
}: InferenceResultsProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">
            Inference Results - {selectedModel.name}
          </h3>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <InferenceMetrics inferenceResult={inferenceResult} />
          <PredictionValues prediction={inferenceResult.prediction} />
          {inferenceResult.probabilities && (
            <ProbabilitiesDisplay
              probabilities={inferenceResult.probabilities}
            />
          )}
          {inferenceResult.explanation && (
            <ExplanationDisplay explanation={inferenceResult.explanation} />
          )}
          {inferenceResult.featureImportance && (
            <FeatureImportanceDisplay
              featureImportance={inferenceResult.featureImportance}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function InferenceMetrics({
  inferenceResult,
}: {
  readonly inferenceResult: MLPrediction;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-indigo-400">
          {Math.round(inferenceResult.confidence * 100)}%
        </div>
        <p className="text-sm text-gray-400">Confidence</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-400">
          {inferenceResult.prediction.length}
        </div>
        <p className="text-sm text-gray-400">Outputs</p>
      </div>
      <div className="text-center">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Real-time</p>
      </div>
    </div>
  );
}

function PredictionValues({ prediction }: { readonly prediction: number[] }) {
  return (
    <div>
      <p className="text-sm font-medium text-white mb-2">Prediction Values:</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {prediction.map((value, index) => (
          <div
            key={`prediction-${value}`}
            className="text-center p-2 bg-gray-700 rounded"
          >
            <p className="text-sm font-mono text-white">{value.toFixed(3)}</p>
            <p className="text-xs text-gray-400">Output {index}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProbabilitiesDisplay({
  probabilities,
}: {
  readonly probabilities: number[];
}) {
  return (
    <div>
      <p className="text-sm font-medium text-white mb-2">Probabilities:</p>
      <div className="space-y-2">
        {probabilities.map((prob, index) => (
          <div key={`probability-${prob}`} className="flex items-center gap-2">
            <span className="text-sm text-white w-16">Class {index}:</span>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${prob * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-mono text-white w-12">
              {Math.round(prob * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExplanationDisplay({ explanation }: { readonly explanation: string }) {
  return (
    <div className="bg-blue-900/20 p-4 rounded-lg">
      <p className="text-sm text-blue-400">{explanation}</p>
    </div>
  );
}

function FeatureImportanceDisplay({
  featureImportance,
}: {
  readonly featureImportance: Record<string, number>;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-white mb-2">Feature Importance:</p>
      <div className="space-y-2">
        {Object.entries(featureImportance)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([feature, importance]) => (
            <div key={feature} className="flex items-center gap-2">
              <span className="text-sm text-white w-32 truncate">
                {feature}:
              </span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${importance * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-mono text-white w-12">
                {Math.round(importance * 100)}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

// ============================================================================
// Model Information Panel
// ============================================================================

export function ModelInformationPanel() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">
            ML Model Information
          </h3>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-white mb-2">Available Models:</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <strong className="text-white">Learning Path Predictor:</strong>{" "}
                Recommends optimal next topics based on current progress
              </li>
              <li>
                <strong className="text-white">Performance Predictor:</strong>{" "}
                Estimates completion probability and timeline
              </li>
              <li>
                <strong className="text-white">Learning Style Detector:</strong>{" "}
                Identifies preferred learning approaches
              </li>
              <li>
                <strong className="text-white">Skill Gap Analyzer:</strong>{" "}
                Detects knowledge deficiencies and areas needing attention
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-2">How It Works:</h4>
            <p className="text-sm text-gray-400">
              These ML models analyze your learning patterns, performance data,
              and interaction history to provide personalized coaching and
              recommendations. Models are continuously trained with anonymized
              user data to improve accuracy over time.
            </p>
          </div>


        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Error Display Component
// ============================================================================

interface ErrorDisplayProps {
  readonly error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="border border-red-800 bg-red-900/20 rounded-lg">
      <div className="p-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    </div>
  );
}
