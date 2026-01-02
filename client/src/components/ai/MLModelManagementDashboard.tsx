/**
 * ML Model Management Dashboard
 * Interface for managing and monitoring ML models
 */

import { useState, useEffect } from 'react';
import { MLModelService } from '../../services/mlModelService';
import type { MLModel, MLInput, MLPrediction } from '../../services/mlModelService';
import {
  Brain,
  BarChart3,
  RefreshCw,
  Play,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ModelCardProps {
  model: MLModel;
  onRunInference?: (modelId: string) => void;
  onTrain?: (modelId: string) => void;
  loading?: boolean;
}

function ModelCard({ model, onRunInference, onTrain, loading }: ModelCardProps) {
  const getModelIcon = (type: string) => {
    switch (type) {
      case 'tensorflow': return <Brain className="w-5 h-5 text-orange-500" />;
      case 'onnx': return <BarChart3 className="w-5 h-5 text-blue-500" />;
      default: return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.9) return 'text-green-600';
    if (accuracy >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getModelIcon(model.type)}
            <span className="text-lg font-semibold">{model.name}</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {model.version}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Type</p>
              <p className="font-medium capitalize">{model.type}</p>
            </div>
            <div>
              <p className="text-gray-600">Accuracy</p>
              <p className={`font-medium ${getAccuracyColor(model.metadata.accuracy)}`}>
                {Math.round(model.metadata.accuracy * 100)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600">Training Data</p>
              <p className="font-medium">{model.metadata.trainingDataSize.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Last Trained</p>
              <p className="font-medium">{model.metadata.lastTrained.toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Features ({model.metadata.features.length})</p>
            <div className="flex flex-wrap gap-1">
              {model.metadata.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  {feature}
                </span>
              ))}
              {model.metadata.features.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  +{model.metadata.features.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {onRunInference && (
              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onRunInference(model.id)}
                disabled={loading}
              >
                <Play className="w-4 h-4 mr-1" />
                Test
              </button>
            )}
            {onTrain && (
              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onTrain(model.id)}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Train
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MLModelManagementDashboard() {
  const [models, setModels] = useState<MLModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [inferenceResult, setInferenceResult] = useState<MLPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mlService = MLModelService.getInstance();

  useEffect(() => {
    const loadModelData = async () => {
      setLoading(true);
      try {
        const modelIds = [
          'learning-path-predictor',
          'performance-predictor',
          'learning-style-detector',
          'skill-gap-analyzer'
        ];

        const loadedModels: MLModel[] = [];
        for (const modelId of modelIds) {
          try {
            const model = await mlService.loadModel(modelId);
            loadedModels.push(model);
          } catch (err) {
            console.error(`Failed to load model ${modelId}:`, err);
          }
        }

        setModels(loadedModels);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load models');
      } finally {
        setLoading(false);
      }
    };

    loadModelData();
  }, [mlService]);

  const runInference = async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return;

    setLoading(true);
    setSelectedModel(model);
    setInferenceResult(null);
    setError(null);

    try {
      // Generate sample input based on model type
      const sampleInput = generateSampleInput(model);

      const result = await mlService.predict(modelId, sampleInput);
      setInferenceResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inference failed');
    } finally {
      setLoading(false);
    }
  };

  const trainModel = async (modelId: string) => {
    setTraining(modelId);
    setError(null);

    try {
      // Generate sample training data
      const trainingData = generateSampleTrainingData(modelId);

      await mlService.trainModel(modelId, trainingData);

      // Reload models to get updated metadata
      await loadModels();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Training failed');
    } finally {
      setTraining(null);
    }
  };

  const generateSampleInput = (model: MLModel): MLInput => {
    const features: number[] = [];

    switch (model.id) {
      case 'learning-path-predictor':
        features.push(5, 0.75, 120, 2, 0.8, 0.7); // week, score, time, hints, accuracy, velocity
        break;
      case 'performance-predictor':
        features.push(7, 0.8, 0.9, 0.6); // streak, score, completion, persistence
        break;
      case 'learning-style-detector':
        features.push(0.8, 0.6, 0.4, 0.2); // visual, kinesthetic, reading, auditory preferences
        break;
      case 'skill-gap-analyzer':
        // Generate 50 random skill scores
        for (let i = 0; i < 50; i++) {
          features.push(Math.random() * 0.6 + 0.2); // Scores between 0.2 and 0.8
        }
        break;
      default:
        features.push(...new Array(model.inputShape[0]).fill(0).map(() => Math.random()));
    }

    return {
      features,
      metadata: {
        modelId: model.id,
        timestamp: new Date().toISOString(),
        sample: true
      }
    };
  };

  const generateSampleTrainingData = (modelId: string) => {
    const inputs: number[][] = [];
    const outputs: number[][] = [];

    switch (modelId) {
      case 'learning-path-predictor':
        for (let i = 0; i < 10; i++) {
          inputs.push([
            Math.floor(Math.random() * 12) + 1, // week 1-12
            Math.random(), // score 0-1
            Math.random() * 300, // time 0-300 min
            Math.floor(Math.random() * 5), // hints 0-4
            Math.random(), // accuracy 0-1
            Math.random() // velocity 0-1
          ]);
          outputs.push([Math.floor(Math.random() * 10)]); // next topic index 0-9
        }
        break;
      case 'performance-predictor':
        for (let i = 0; i < 10; i++) {
          inputs.push([
            Math.floor(Math.random() * 30), // streak 0-29
            Math.random(), // score 0-1
            Math.random(), // completion 0-1
            Math.random() // persistence 0-1
          ]);
          outputs.push([Math.random()]); // completion probability 0-1
        }
        break;
      case 'learning-style-detector':
        for (let i = 0; i < 10; i++) {
          inputs.push([
            Math.random(), // visual
            Math.random(), // kinesthetic
            Math.random(), // reading
            Math.random() // auditory
          ]);
          // One-hot encoded output for 4 learning styles
          const styleIndex = Math.floor(Math.random() * 4);
          const output = [0, 0, 0, 0];
          output[styleIndex] = 1;
          outputs.push(output);
        }
        break;
      case 'skill-gap-analyzer':
        for (let i = 0; i < 10; i++) {
          const input = [];
          const output = [];
          for (let j = 0; j < 50; j++) {
            input.push(Math.random()); // skill score
            output.push(Math.random() < 0.3 ? 1 : 0); // gap indicator
          }
          inputs.push(input);
          outputs.push(output);
        }
        break;
    }

    return {
      inputs,
      outputs,
      metadata: [{
        generated: new Date().toISOString(),
        sampleSize: inputs.length,
        modelId
      }]
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold">ML Model Management</h2>
            <p className="text-gray-600">Monitor and manage machine learning models</p>
          </div>
        </div>
        <button
          onClick={loadModels}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Models
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="border border-red-200 bg-red-50 rounded-lg">
          <div className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

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

      {/* Inference Results */}
      {selectedModel && inferenceResult && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold">Inference Results - {selectedModel.name}</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.round(inferenceResult.confidence * 100)}%
                  </div>
                  <p className="text-sm text-gray-600">Confidence</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {inferenceResult.prediction.length}
                  </div>
                  <p className="text-sm text-gray-600">Outputs</p>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Real-time</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Prediction Values:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {inferenceResult.prediction.map((value, index) => (
                    <div key={index} className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-sm font-mono">{value.toFixed(3)}</p>
                      <p className="text-xs text-gray-500">Output {index}</p>
                    </div>
                  ))}
                </div>
              </div>

              {inferenceResult.probabilities && (
                <div>
                  <p className="text-sm font-medium mb-2">Probabilities:</p>
                  <div className="space-y-2">
                    {inferenceResult.probabilities.map((prob, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm w-16">Class {index}:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${prob * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-mono w-12">{Math.round(prob * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inferenceResult.explanation && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">{inferenceResult.explanation}</p>
                </div>
              )}

              {inferenceResult.featureImportance && (
                <div>
                  <p className="text-sm font-medium mb-2">Feature Importance:</p>
                  <div className="space-y-2">
                    {Object.entries(inferenceResult.featureImportance)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([feature, importance]) => (
                        <div key={feature} className="flex items-center gap-2">
                          <span className="text-sm w-32 truncate">{feature}:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${importance * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-mono w-12">{Math.round(importance * 100)}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Model Information */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            <h3 className="text-lg font-semibold">ML Model Information</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Available Models:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><strong>Learning Path Predictor:</strong> Recommends optimal next topics based on current progress</li>
                <li><strong>Performance Predictor:</strong> Estimates completion probability and timeline</li>
                <li><strong>Learning Style Detector:</strong> Identifies preferred learning approaches</li>
                <li><strong>Skill Gap Analyzer:</strong> Detects knowledge deficiencies and areas needing attention</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">How It Works:</h4>
              <p className="text-sm text-gray-600">
                These ML models analyze your learning patterns, performance data, and interaction history
                to provide personalized coaching and recommendations. Models are continuously trained
                with anonymized user data to improve accuracy over time.
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Note:</p>
                  <p className="text-sm text-yellow-700">
                    This is a demonstration of ML-powered coaching. In a production environment,
                    models would be trained on real user data and hosted on dedicated ML infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}