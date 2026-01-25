/**
 * MLModelUtils - Utility functions for ML Model Management
 * Extracted helper functions for sample data generation
 */

import type { MLModel, MLInput } from "../../../services/mlModelService";

/**
 * Generate sample input data for model inference based on model type
 */
export function generateSampleInput(model: MLModel): MLInput {
  const features: number[] = [];

  switch (model.id) {
    case "learning-path-predictor":
      features.push(5, 0.75, 120, 2, 0.8, 0.7); // week, score, time, hints, accuracy, velocity
      break;
    case "performance-predictor":
      features.push(7, 0.8, 0.9, 0.6); // streak, score, completion, persistence
      break;
    case "learning-style-detector":
      features.push(0.8, 0.6, 0.4, 0.2); // visual, kinesthetic, reading, auditory preferences
      break;
    case "skill-gap-analyzer":
      // Generate 50 random skill scores
      for (let i = 0; i < 50; i++) {
        features.push(Math.random() * 0.6 + 0.2); // Scores between 0.2 and 0.8
      }
      break;
    default:
      features.push(
        ...new Array(model.inputShape[0]).fill(0).map(() => Math.random()),
      );
  }

  return {
    features,
    metadata: {
      modelId: model.id,
      timestamp: new Date().toISOString(),
      sample: true,
    },
  };
}

/**
 * Generate sample training data for model training based on model ID
 */
export function generateSampleTrainingData(modelId: string) {
  const inputs: number[][] = [];
  const outputs: number[][] = [];

  switch (modelId) {
    case "learning-path-predictor":
      for (let i = 0; i < 10; i++) {
        inputs.push([
          Math.floor(Math.random() * 12) + 1, // current_week
          Math.random(), // performance_score
          Math.random() * 10, // time_spent_hours
          Math.floor(Math.random() * 5), // hints_used
          Math.random(), // error_rate
          Math.random(), // git_score
          Math.random(), // linux_score
          Math.random(), // docker_score
          Math.random(), // k8s_score
          Math.random(), // aws_score
          Math.random(), // terraform_score
          Math.random(), // jenkins_score
          Math.random(), // monitoring_score
          Math.floor(Math.random() * 10), // git_attempts
          Math.floor(Math.random() * 10), // linux_attempts
          Math.floor(Math.random() * 10), // docker_attempts
          Math.floor(Math.random() * 10), // k8s_attempts
          Math.floor(Math.random() * 10), // aws_attempts
          Math.floor(Math.random() * 10), // terraform_attempts
          Math.floor(Math.random() * 10), // jenkins_attempts
          Math.floor(Math.random() * 10), // monitoring_attempts
        ]);
        // One-hot encoded output for 15 topics
        const topicIndex = Math.floor(Math.random() * 15);
        const output = new Array(15).fill(0);
        output[topicIndex] = 1;
        outputs.push(output);
      }
      break;
    case "performance-predictor":
      for (let i = 0; i < 10; i++) {
        inputs.push([
          Math.floor(Math.random() * 30), // study_streak
          Math.random(), // avg_score
          Math.random(), // completion_rate
          Math.random() * 5, // struggle_time_hours
          Math.random(), // learning_style_visual
          Math.random(), // learning_style_kinesthetic
          Math.random(), // learning_style_reading
          Math.random(), // learning_style_auditory
        ]);
        outputs.push([Math.random()]); // completion probability 0-1
      }
      break;
    case "learning-style-detector":
      for (let i = 0; i < 10; i++) {
        inputs.push([
          Math.random(), // performance_score
          Math.random() * 10, // time_spent_hours
          Math.floor(Math.random() * 5), // hints_used
          Math.random(), // error_rate
          Math.floor(Math.random() * 30), // study_streak
        ]);
        // One-hot encoded output for 4 learning styles
        const styleIndex = Math.floor(Math.random() * 4);
        const output = [0, 0, 0, 0];
        output[styleIndex] = 1;
        outputs.push(output);
      }
      break;
    case "skill-gap-analyzer":
      for (let i = 0; i < 10; i++) {
        const input: number[] = [];
        // 8 topics × 4 features each = 32 features
        for (let j = 0; j < 8; j++) {
          input.push(Math.random()); // score
          input.push(Math.floor(Math.random() * 10)); // attempts
          input.push(Math.random() * 5); // time_spent
          input.push(Math.floor(Math.random() * 5)); // errors
        }
        inputs.push(input);
        // Output: gap indicators for each topic (0 or 1)
        const output: number[] = [];
        for (let j = 0; j < 8; j++) {
          output.push(Math.random() < 0.3 ? 1 : 0);
        }
        outputs.push(output);
      }
      break;
    case "motivational-analyzer":
      for (let i = 0; i < 10; i++) {
        inputs.push([
          Math.floor(Math.random() * 30), // study_streak
          Math.random(), // avg_score
          Math.random(), // completion_rate
          Math.random() * 5, // struggle_time_hours
          Math.random(), // performance_score
          Math.random() * 10, // time_spent_hours
          Math.floor(Math.random() * 5), // hints_used
          Math.random(), // error_rate
        ]);
        // One-hot encoded output for 4 motivation types
        const motivationIndex = Math.floor(Math.random() * 4);
        const output = [0, 0, 0, 0];
        output[motivationIndex] = 1;
        outputs.push(output);
      }
      break;
  }

  return {
    inputs,
    outputs,
    metadata: {
      generated: new Date().toISOString(),
      sampleSize: inputs.length,
      modelId,
    },
  };
}

/**
 * Model IDs for loading
 */
export const MODEL_IDS = [
  "learning-path-predictor",
  "performance-predictor",
  "learning-style-detector",
  "skill-gap-analyzer",
  "motivational-analyzer",
] as const;
