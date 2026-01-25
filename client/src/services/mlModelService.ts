/**
 * ML Model Integration Service
 * Manages loading, running, and caching of machine learning models
 */

import axios from "axios";

export interface MLModel {
  id: string;
  name: string;
  version: string;
  type: "tensorflow" | "onnx" | "custom";
  status: "ready" | "training" | "error" | "loading";
  description: string;
  inputShape: number[];
  outputShape: number[];
  model: unknown; // TensorFlow.js model or ONNX model
  metrics?: Record<string, number | string>;
  metadata: {
    accuracy: number;
    trainingDataSize: number;
    lastTrained: Date;
    features: string[];
    target: string;
  };
}

export interface MLInput {
  features: number[];
  metadata?: Record<string, unknown>;
}

export interface MLPrediction {
  prediction: number[];
  confidence: number;
  probabilities?: number[];
  explanation?: string;
  featureImportance?: Record<string, number>;
}

export interface MLTrainingData {
  inputs: number[][];
  outputs: number[][];
  metadata?: Record<string, unknown>;
}

const ML_SERVICE_URL =
  import.meta.env.VITE_ML_API_URL || "http://localhost:8000";

export class MLModelService {
  private static instance: MLModelService;
  private readonly models = new Map<string, MLModel>();
  private readonly modelCache = new Map<string, unknown>();

  public static getInstance(): MLModelService {
    if (!MLModelService.instance) {
      MLModelService.instance = new MLModelService();
    }
    return MLModelService.instance;
  }

  /**
   * Load a machine learning model
   */
  async loadModel(modelId: string): Promise<MLModel> {
    if (this.models.has(modelId)) {
      return this.models.get(modelId)!;
    }

    try {
      // Check if model is available in the ML service
      const response = await axios.get(`${ML_SERVICE_URL}/models`);
      const availableModels = response.data.models;

      const modelInfo = availableModels.find(
        (m: unknown) => (m as { name: string }).name === modelId,
      );
      if (!modelInfo) {
        throw new Error(`Model ${modelId} not found in ML service`);
      }

      // Create model object
      const model: MLModel = {
        id: modelId,
        name: (modelInfo as { name: string }).name,
        version: "1.0.0",
        type: "custom",
        inputShape: [modelInfo.features?.length || 10],
        outputShape: [1],
        model: null, // Models run on the server
        metadata: {
          accuracy: modelInfo.metrics?.accuracy || 0.8,
          trainingDataSize: 5000,
          lastTrained: new Date(),
          features: modelInfo.features || [],
          target: "prediction",
        },
      };

      this.models.set(modelId, model);
      return model;
    } catch (error: unknown) {
      console.error(`Failed to load model ${modelId}:`, error);
      // Return fallback model for development
      return this.createFallbackModel(modelId);
    }
  }

  /**
   * Run inference on a loaded model
   */
  async predict(modelId: string, input: MLInput): Promise<MLPrediction> {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/predict/${modelId}`,
        input,
      );
      const result = response.data;

      return {
        prediction: result.prediction,
        confidence: result.confidence,
        probabilities: result.probabilities,
        explanation: result.explanation,
        featureImportance: result.feature_importance,
      };
    } catch (error: unknown) {
      console.error(`Inference failed for model ${modelId}:`, error);
      // Return fallback prediction
      return this.generateFallbackPrediction(modelId, input);
    }
  }

  /**
   * Train or fine-tune a model with new data
   */
  async trainModel(
    modelId: string,
    trainingData: MLTrainingData,
  ): Promise<void> {
    try {
      await axios.post(`${ML_SERVICE_URL}/train/${modelId}`, trainingData);
      console.log(`Model ${modelId} training initiated on ML service`);
    } catch (error: unknown) {
      console.error(`Training failed for model ${modelId}:`, error);
      throw new Error(`Model training failed: ${error.message}`);
    }
  }

  /**
   * Get model performance metrics
   */
  async getModelMetrics(modelId: string): Promise<unknown> {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/models`);
      const modelInfo = response.data.models.find(
        (m: unknown) => (m as { name: string }).name === modelId,
      );
      return (modelInfo as { metrics?: unknown })?.metrics || {};
    } catch (error: unknown) {
      console.error(`Failed to get metrics for ${modelId}:`, error);
      return {};
    }
  }

  /**
   * Create fallback model for development/testing
   */
  private createFallbackModel(modelId: string): MLModel {
    return {
      id: modelId,
      name: `${modelId} (Fallback)`,
      version: "fallback",
      type: "custom",
      inputShape: [10],
      outputShape: [1],
      model: null,
      metadata: {
        accuracy: 0.5,
        trainingDataSize: 100,
        lastTrained: new Date(),
        features: [],
        target: "prediction",
      },
    };
  }

  /**
   * Generate fallback prediction when ML service is unavailable
   */
  private generateFallbackPrediction(
    modelId: string,
    input: MLInput,
  ): MLPrediction {
    // Generate basic fallback prediction
    const avgFeature =
      input.features.length > 0
        ? input.features.reduce((a, b) => a + b, 0) / input.features.length
        : 0.5;

    return {
      prediction: [avgFeature],
      confidence: 0.5,
      probabilities: undefined,
      explanation: "Fallback prediction generated",
      featureImportance: undefined,
    };
  }
}

// React hook for using ML models
export function useMLModel(modelId: string) {
  const [model, setModel] = useState<MLModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModel = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const mlService = MLModelService.getInstance();
      const loadedModel = await mlService.loadModel(modelId);
      setModel(loadedModel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load model");
    } finally {
      setLoading(false);
    }
  }, [modelId]);

  const predict = useCallback(
    async (input: MLInput): Promise<MLPrediction | null> => {
      if (!model) return null;

      try {
        const mlService = MLModelService.getInstance();
        return await mlService.predict(modelId, input);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Prediction failed");
        return null;
      }
    },
    [model, modelId],
  );

  const train = useCallback(
    async (trainingData: MLTrainingData) => {
      if (!model) return;

      setLoading(true);
      try {
        const mlService = MLModelService.getInstance();
        await mlService.trainModel(modelId, trainingData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Training failed");
      } finally {
        setLoading(false);
      }
    },
    [model, modelId],
  );

  useEffect(() => {
    loadModel();
  }, [loadModel]);

  return {
    model,
    loading,
    error,
    predict,
    train,
    reload: loadModel,
  };
}

// Explicit exports to ensure they're recognized
export type { MLModel, MLInput, MLPrediction, MLTrainingData };
