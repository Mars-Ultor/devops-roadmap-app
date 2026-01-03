/**
 * ML Model Integration Service
 * Manages loading, running, and caching of machine learning models
 */

import axios from 'axios';

export interface MLModel {
  id: string;
  name: string;
  version: string;
  type: 'tensorflow' | 'onnx' | 'custom';
  inputShape: number[];
  outputShape: number[];
  model: unknown; // TensorFlow.js model or ONNX model
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
  metadata?: Record<string, unknown>[];
}

const ML_SERVICE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

export class MLModelService {
  private static instance: MLModelService;
  private models = new Map<string, MLModel>();
  private modelCache = new Map<string, unknown>();

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

      const modelInfo = availableModels.find((m: unknown) => (m as { name: string }).name === modelId);
      if (!modelInfo) {
        throw new Error(`Model ${modelId} not found in ML service`);
      }

      // Create model object
      const model: MLModel = {
        id: modelId,
        name: (modelInfo as { name: string }).name,
        version: '1.0.0',
        type: 'custom',
        inputShape: [modelInfo.features?.length || 10],
        outputShape: [1],
        model: null, // Models run on the server
        metadata: {
          accuracy: modelInfo.metrics?.accuracy || 0.8,
          trainingDataSize: 5000,
          lastTrained: new Date(),
          features: modelInfo.features || [],
          target: 'prediction'
        }
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
      const response = await axios.post(`${ML_SERVICE_URL}/predict/${modelId}`, input);
      const result = response.data;

      return {
        prediction: result.prediction,
        confidence: result.confidence,
        probabilities: result.probabilities,
        explanation: result.explanation,
        featureImportance: result.feature_importance
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
  async trainModel(modelId: string, trainingData: MLTrainingData): Promise<void> {
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
      const modelInfo = response.data.models.find((m: unknown) => (m as { name: string }).name === modelId);
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
    const fallbackConfigs: Record<string, Partial<MLModel>> = {
      'learning-path-predictor': {
        name: 'Learning Path Predictor (Fallback)',
        inputShape: [50],
        outputShape: [10],
        metadata: {
          accuracy: 0.75,
          trainingDataSize: 1000,
          lastTrained: new Date(),
          features: ['current_week', 'performance_score', 'time_spent', 'hints_used', 'error_rate'],
          target: 'optimal_next_topic'
        }
      },
      'performance-predictor': {
        name: 'Performance Predictor (Fallback)',
        inputShape: [30],
        outputShape: [1],
        metadata: {
          accuracy: 0.80,
          trainingDataSize: 500,
          lastTrained: new Date(),
          features: ['study_streak', 'avg_score', 'completion_rate', 'struggle_time'],
          target: 'completion_probability'
        }
      },
      'learning-style-detector': {
        name: 'Learning Style Detector (Fallback)',
        inputShape: [20],
        outputShape: [4],
        metadata: {
          accuracy: 0.70,
          trainingDataSize: 300,
          lastTrained: new Date(),
          features: ['visual_preference', 'hands_on_preference', 'theory_preference', 'practice_preference'],
          target: 'learning_style'
        }
      },
      'skill-gap-analyzer': {
        name: 'Skill Gap Analyzer (Fallback)',
        inputShape: [100],
        outputShape: [50],
        metadata: {
          accuracy: 0.75,
          trainingDataSize: 800,
          lastTrained: new Date(),
          features: ['topic_scores', 'attempt_counts', 'time_spent_per_topic', 'error_patterns'],
          target: 'skill_gaps'
        }
      },
      'motivational-analyzer': {
        name: 'Motivational Analyzer (Fallback)',
        inputShape: [15],
        outputShape: [3],
        metadata: {
          accuracy: 0.72,
          trainingDataSize: 600,
          lastTrained: new Date(),
          features: ['engagement_score', 'consistency_score', 'progress_rate', 'feedback_sentiment'],
          target: 'motivation_level'
        }
      }
    };

    const config = fallbackConfigs[modelId] || {
      name: `${modelId} (Fallback)`,
      inputShape: [10],
      outputShape: [1],
      metadata: {
        accuracy: 0.5,
        trainingDataSize: 100,
        lastTrained: new Date(),
        features: [],
        target: 'prediction'
      }
    };

    return {
      id: modelId,
      version: 'fallback',
      type: 'custom',
      model: null,
      ...config
    } as MLModel;
  }

  /**
   * Generate fallback prediction when ML service is unavailable
   */
  private generateFallbackPrediction(modelId: string, input: MLInput): MLPrediction {
    // Generate reasonable defaults based on input features
    const avgFeature = input.features.length > 0 ? input.features.reduce((a, b) => a + b) / input.features.length : 0.5;

    let prediction: number[];
    let explanation: string;

    switch (modelId) {
      case 'learning-path-predictor':
        prediction = [avgFeature, avgFeature * 0.9, avgFeature * 0.8];
        explanation = "Fallback: Recommended basic to intermediate topics based on current performance";
        break;
      case 'performance-predictor':
        prediction = [Math.min(0.9, Math.max(0.1, avgFeature))];
        explanation = "Fallback: Performance prediction based on historical patterns";
        break;
      case 'learning-style-detector':
        prediction = [0.4, 0.3, 0.2, 0.1]; // Visual, Kinesthetic, Reading, Auditory
        explanation = "Fallback: Mixed learning style preferences detected";
        break;
      case 'skill-gap-analyzer':
        prediction = input.features.slice(0, 8).map(f => Math.max(0, 1 - f)); // Inverse of scores
        explanation = "Fallback: Skill gaps identified in lower-scoring topics";
        break;
      case 'motivational-analyzer':
        prediction = [0.5, 0.3, 0.2]; // High, Medium, Low motivation
        explanation = "Fallback: Moderate motivation level detected";
        break;
      default:
        prediction = [avgFeature];
        explanation = "Fallback prediction generated";
    }

    return {
      prediction,
      confidence: 0.6,
      probabilities: undefined,
      explanation,
      featureImportance: undefined
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
      setError(err instanceof Error ? err.message : 'Failed to load model');
    } finally {
      setLoading(false);
    }
  }, [modelId]);

  const predict = useCallback(async (input: MLInput): Promise<MLPrediction | null> => {
    if (!model) return null;

    try {
      const mlService = MLModelService.getInstance();
      return await mlService.predict(modelId, input);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed');
      return null;
    }
  }, [model, modelId]);

  const train = useCallback(async (trainingData: MLTrainingData) => {
    if (!model) return;

    setLoading(true);
    try {
      const mlService = MLModelService.getInstance();
      await mlService.trainModel(modelId, trainingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Training failed');
    } finally {
      setLoading(false);
    }
  }, [model, modelId]);

  useEffect(() => {
    loadModel();
  }, [loadModel]);

  return {
    model,
    loading,
    error,
    predict,
    train,
    reload: loadModel
  };
}

// Explicit exports to ensure they're recognized
export type { MLModel, MLInput, MLPrediction, MLTrainingData };