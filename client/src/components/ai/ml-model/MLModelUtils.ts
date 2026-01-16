/**
 * MLModelUtils - Utility functions for ML Model Management
 * Extracted helper functions for sample data generation
 */

import type { MLModel, MLInput } from '../../../services/mlModelService';

/**
 * Generate sample input data for model inference based on model type
 */
export function generateSampleInput(model: MLModel): MLInput {
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
}

/**
 * Generate sample training data for model training based on model ID
 */
export function generateSampleTrainingData(modelId: string) {
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
        const input: number[] = [];
        const output: number[] = [];
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
}

/**
 * Model IDs for loading
 */
export const MODEL_IDS = [
  'learning-path-predictor',
  'performance-predictor',
  'learning-style-detector',
  'skill-gap-analyzer',
  'motivational-analyzer'
] as const;
