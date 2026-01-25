/**
 * MLModelUtils - Utility functions for ML Model Management
 * Extracted helper functions for sample data generation
 */

import type { MLModel, MLInput } from "../../../services/mlModelService";
import type { AnalyticsData } from "../../../hooks/analytics-data/analyticsDataUtils";

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
 * Generate real training data from user analytics for model training
 */
export function generateRealTrainingData(modelId: string, analytics: AnalyticsData) {
  const inputs: number[][] = [];
  const outputs: number[][] = [];

  switch (modelId) {
    case "learning-path-predictor":
      // Use real analytics data to create training examples
      // Input: [current_week, performance_score, time_spent_hours, hints_used, error_rate, git_score, linux_score, ...]
      inputs.push([
        Math.min(analytics.masteryLevel, 12), // current_week (capped at 12)
        analytics.avgQuizScore || analytics.avgLabScore || 0.5, // performance_score
        (analytics.totalStudyTime / 3600), // time_spent_hours
        0, // hints_used (not tracked in analytics)
        1 - (analytics.quizSuccessRate || analytics.labSuccessRate || 0.5), // error_rate
        analytics.skills.find(s => s.name.toLowerCase().includes('git'))?.proficiency || 0.5,
        analytics.skills.find(s => s.name.toLowerCase().includes('linux'))?.proficiency || 0.5,
        analytics.skills.find(s => s.name.toLowerCase().includes('docker'))?.proficiency || 0.5,
        analytics.skills.find(s => s.name.toLowerCase().includes('kubernetes'))?.proficiency || 0.5,
        analytics.skills.find(s => s.name.toLowerCase().includes('aws'))?.proficiency || 0.5,
        analytics.skills.find(s => s.name.toLowerCase().includes('terraform'))?.proficiency || 0.5,
        analytics.skills.find(s => s.name.toLowerCase().includes('jenkins'))?.proficiency || 0.5,
        analytics.skills.find(s => s.name.toLowerCase().includes('monitoring'))?.proficiency || 0.5,
        Math.floor(Math.random() * 10), // git_attempts (randomized)
        Math.floor(Math.random() * 10), // linux_attempts
        Math.floor(Math.random() * 10), // docker_attempts
        Math.floor(Math.random() * 10), // k8s_attempts
        Math.floor(Math.random() * 10), // aws_attempts
        Math.floor(Math.random() * 10), // terraform_attempts
        Math.floor(Math.random() * 10), // jenkins_attempts
        Math.floor(Math.random() * 10), // monitoring_attempts
      ]);

      // Output: one-hot encoded next topic recommendation
      const weakTopics = analytics.weakTopics || [];
      const recommendedTopic = weakTopics.length > 0 ?
        weakTopics[0].topic : 'git'; // Default to git if no weak topics

      const topicIndex = getTopicIndex(recommendedTopic);
      const output = new Array(15).fill(0);
      output[topicIndex] = 1;
      outputs.push(output);
      break;

    case "performance-predictor":
      inputs.push([
        analytics.longestStreak, // study_streak
        analytics.avgQuizScore || analytics.avgLabScore || 0.5, // avg_score
        (analytics.quizSuccessRate + analytics.labSuccessRate) / 2 || 0.5, // completion_rate
        (analytics.totalStudyTime / 3600) * 0.1, // struggle_time_hours (estimated)
        0.5, 0.3, 0.2, 0.1, // learning_style preferences (estimated)
      ]);
      outputs.push([analytics.masteryRate || 0.5]); // completion probability
      break;

    case "learning-style-detector":
      inputs.push([
        analytics.avgQuizScore || 0.5, // performance_score
        analytics.totalStudyTime / 3600, // time_spent_hours
        0, // hints_used
        1 - (analytics.quizSuccessRate || 0.5), // error_rate
        analytics.longestStreak, // study_streak
      ]);

      // Determine learning style based on analytics patterns
      const learningStyle = determineLearningStyle(analytics);
      const styleIndex = ['visual', 'kinesthetic', 'reading', 'auditory'].indexOf(learningStyle);
      const styleOutput = [0, 0, 0, 0];
      styleOutput[styleIndex] = 1;
      outputs.push(styleOutput);
      break;

    case "skill-gap-analyzer":
      const input: number[] = [];
      // 8 topics × 4 features each = 32 features
      const topics = ['git', 'linux', 'docker', 'kubernetes', 'aws', 'terraform', 'jenkins', 'monitoring'];
      topics.forEach(topic => {
        const skill = analytics.skills.find(s => s.name.toLowerCase().includes(topic));
        input.push(skill?.proficiency || 0.5); // score
        input.push(skill?.sessionsCompleted || 0); // attempts
        input.push((analytics.totalStudyTime / analytics.totalSessions) / 60 || 30); // time_spent (minutes)
        input.push(skill ? (1 - skill.proficiency) * 5 : 2.5); // errors (estimated)
      });
      inputs.push(input);

      // Output: gap indicators
      const gapOutput: number[] = [];
      topics.forEach(topic => {
        const skill = analytics.skills.find(s => s.name.toLowerCase().includes(topic));
        gapOutput.push(skill && skill.proficiency < 0.7 ? 1 : 0);
      });
      outputs.push(gapOutput);
      break;

    case "motivational-analyzer":
      inputs.push([
        analytics.longestStreak, // study_streak
        analytics.avgQuizScore || 0.5, // avg_score
        (analytics.quizSuccessRate + analytics.labSuccessRate) / 2 || 0.5, // completion_rate
        (analytics.totalStudyTime / 3600) * 0.1, // struggle_time_hours
        analytics.avgQuizScore || 0.5, // performance_score
        analytics.totalStudyTime / 3600, // time_spent_hours
        0, // hints_used
        1 - (analytics.quizSuccessRate || 0.5), // error_rate
      ]);

      // Determine motivation type based on analytics
      const motivationType = determineMotivationType(analytics);
      const motivationIndex = ['achievement', 'mastery', 'social', 'autonomy'].indexOf(motivationType);
      const motivationOutput = [0, 0, 0, 0];
      motivationOutput[motivationIndex] = 1;
      outputs.push(motivationOutput);
      break;
  }

  return {
    inputs,
    outputs,
    metadata: {
      generated: new Date().toISOString(),
      source: 'real_analytics',
      userId: 'anonymized',
      sampleSize: inputs.length,
      modelId,
    },
  };
}

/**
 * Helper function to get topic index for learning path predictor
 */
function getTopicIndex(topic: string): number {
  const topics = ['git', 'linux', 'docker', 'kubernetes', 'aws', 'terraform', 'jenkins', 'monitoring', 'ci-cd', 'security', 'databases', 'networking', 'containers', 'orchestration', 'cloud'];
  return topics.indexOf(topic.toLowerCase()) !== -1 ? topics.indexOf(topic.toLowerCase()) : 0;
}

/**
 * Determine learning style based on analytics patterns
 */
function determineLearningStyle(analytics: AnalyticsData): string {
  // Simple heuristic based on available data
  if (analytics.battleDrillsCompleted > analytics.quizSuccessRate * 10) {
    return 'kinesthetic'; // Hands-on learners
  } else if (analytics.totalStudyTime > analytics.totalSessions * 2) {
    return 'reading'; // Deep study patterns
  } else if (analytics.currentStreak > 7) {
    return 'auditory'; // Consistent learners (may follow audio)
  } else {
    return 'visual'; // Default
  }
}

/**
 * Determine motivation type based on analytics patterns
 */
function determineMotivationType(analytics: AnalyticsData): string {
  if (analytics.masteryRate > 0.8) {
    return 'mastery'; // High completion rate
  } else if (analytics.totalXP > 5000) {
    return 'achievement'; // High XP accumulation
  } else if (analytics.currentStreak > 10) {
    return 'autonomy'; // Self-motivated streaks
  } else {
    return 'social'; // Default
  }
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
