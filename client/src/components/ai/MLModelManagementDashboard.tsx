/**
 * ML Model Management Dashboard
 * Interface for managing and monitoring ML models
 */

import { useState, useEffect, useCallback } from "react";
import { MLModelService } from "../../services/mlModelService";
import type { MLModel, MLPrediction } from "../../services/mlModelService";

// Import extracted components
import {
  ModelCard,
  ModelDashboardHeader,
  InferenceResults,
  ModelInformationPanel,
  ErrorDisplay,
} from "./ml-model/MLModelComponents";

// Import utility functions
import {
  generateSampleInput,
  generateRealTrainingData,
  MODEL_IDS,
} from "./ml-model/MLModelUtils";

// Import analytics hook
import { useAnalyticsData } from "../../hooks/useAnalyticsData";

export function MLModelManagementDashboard() {
  const [models, setModels] = useState<MLModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [inferenceResult, setInferenceResult] = useState<MLPrediction | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mlService = MLModelService.getInstance();
  const { analytics, loading: analyticsLoading } = useAnalyticsData("all");

  const loadModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedModels: MLModel[] = [];
      for (const modelId of MODEL_IDS) {
        try {
          const model = await mlService.loadModel(modelId);
          loadedModels.push(model);
        } catch (err) {
          console.error(`Failed to load model ${modelId}:`, err);
        }
      }
      setModels(loadedModels);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load models");
    } finally {
      setLoading(false);
    }
  }, [mlService]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const runInference = async (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    if (!model) return;

    setLoading(true);
    setSelectedModel(model);
    setInferenceResult(null);
    setError(null);

    try {
      const sampleInput = generateSampleInput(model);
      const result = await mlService.predict(modelId, sampleInput);
      setInferenceResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inference failed");
    } finally {
      setLoading(false);
    }
  };

  const trainModel = async (modelId: string) => {
    if (!analytics || analyticsLoading) {
      setError("Analytics data not available for training");
      return;
    }

    setTraining(modelId);
    setError(null);

    try {
      // Use real analytics data for training instead of sample data
      const trainingData = generateRealTrainingData(modelId, analytics);
      await mlService.trainModel(modelId, trainingData);
      await loadModels();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Training failed");
    } finally {
      setTraining(null);
    }
  };

  return (
    <div className="space-y-6">
      <ModelDashboardHeader onRefresh={loadModels} loading={loading} />

      {error && <ErrorDisplay error={error} />}

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onRunInference={runInference}
            onTrain={trainModel}
            loading={training === model.id}
          />
        ))}
      </div>

      {selectedModel && inferenceResult && (
        <InferenceResults
          selectedModel={selectedModel}
          inferenceResult={inferenceResult}
        />
      )}

      <ModelInformationPanel />
    </div>
  );
}
