/**
 * Scenario Challenge Service - Military Training Methodology
 * Manages scenario execution, progress tracking, and performance analytics
 */

import type {
  ChallengeScenario,
  ChallengeAttempt,
  ChallengeProgress,
  ChallengeCommand,
  ChallengeError
} from '../types/scenarios';
import { SCENARIO_CHALLENGES, getScenarioById, getRecommendedScenarios } from '../data/scenarios';

export class ScenarioChallengeService {
  private static instance: ScenarioChallengeService;
  private activeAttempts = new Map<string, ChallengeAttempt>();
  private userProgress = new Map<string, ChallengeProgress>();

  private constructor() {}

  static getInstance(): ScenarioChallengeService {
    if (!ScenarioChallengeService.instance) {
      ScenarioChallengeService.instance = new ScenarioChallengeService();
    }
    return ScenarioChallengeService.instance;
  }

  /**
   * Start a scenario challenge attempt
   */
  startScenarioAttempt(
    userId: string,
    scenarioId: string
  ): ChallengeAttempt | null {
    const scenario = getScenarioById(scenarioId);
    if (!scenario) return null;

    const attempt: ChallengeAttempt = {
      attemptId: `${userId}_${scenarioId}_${Date.now()}`,
      userId,
      scenarioId,
      startedAt: new Date(),
      timeSpentSeconds: 0,
      completed: false,
      passed: false,
      objectivesCompleted: [],
      hintsUsed: [],
      commandsExecuted: [],
      errors: [],
      score: 0,
      feedback: ''
    };

    this.activeAttempts.set(attempt.attemptId, attempt);
    return attempt;
  }

  /**
   * Complete a scenario attempt
   */
  completeScenarioAttempt(
    attemptId: string,
    objectivesCompleted: string[],
    passed: boolean
  ): ChallengeAttempt | null {
    const attempt = this.activeAttempts.get(attemptId);
    if (!attempt) return null;

    attempt.completedAt = new Date();
    attempt.timeSpentSeconds = Math.round(
      (attempt.completedAt.getTime() - attempt.startedAt.getTime()) / 1000
    );
    attempt.objectivesCompleted = objectivesCompleted;
    attempt.completed = true;
    attempt.passed = passed;

    // Calculate score
    attempt.score = this.calculateScore(attempt);

    // Generate feedback
    attempt.feedback = this.generateFeedback(attempt);

    // Update user progress
    this.updateUserProgress(attempt);

    // Clean up active attempt
    this.activeAttempts.delete(attemptId);

    return attempt;
  }

  /**
   * Record a command execution during scenario
   */
  recordCommand(
    attemptId: string,
    command: string,
    success: boolean,
    output?: string,
    error?: string,
    context: 'terminal' | 'editor' | 'browser' = 'terminal'
  ): void {
    const attempt = this.activeAttempts.get(attemptId);
    if (!attempt) return;

    const commandRecord: ChallengeCommand = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      command,
      executedAt: new Date(),
      success,
      output,
      error,
      context
    };

    attempt.commandsExecuted.push(commandRecord);

    // Record error if command failed
    if (!success && error) {
      this.recordError(attemptId, error, context);
    }
  }

  /**
   * Record an error during scenario
   */
  recordError(
    attemptId: string,
    error: string,
    context: string,
    resolved: boolean = false,
    resolution?: string
  ): void {
    const attempt = this.activeAttempts.get(attemptId);
    if (!attempt) return;

    const errorRecord: ChallengeError = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error,
      occurredAt: new Date(),
      context,
      resolved,
      resolution
    };

    attempt.errors.push(errorRecord);
  }

  /**
   * Use a hint during scenario
   */
  useHint(attemptId: string, hintId: string): number {
    const attempt = this.activeAttempts.get(attemptId);
    if (!attempt) return 0;

    const scenario = getScenarioById(attempt.scenarioId);
    if (!scenario) return 0;

    const hint = scenario.hints.find(h => h.id === hintId);
    if (!hint) return 0;

    attempt.hintsUsed.push(hintId);
    return hint.penalty;
  }

  /**
   * Get available hints for current scenario state
   */
  getAvailableHints(attemptId: string): string[] {
    const attempt = this.activeAttempts.get(attemptId);
    if (!attempt) return [];

    const scenario = getScenarioById(attempt.scenarioId);
    if (!scenario) return [];

    const elapsedSeconds = Math.round(
      (Date.now() - attempt.startedAt.getTime()) / 1000
    );

    return scenario.hints
      .filter(hint => {
        if (attempt.hintsUsed.includes(hint.id)) return false;

        switch (hint.trigger) {
          case 'time':
            return elapsedSeconds >= (hint.triggerValue || 0);
          case 'stuck':
            // Consider stuck if no commands executed in last 5 minutes
            const lastCommand = attempt.commandsExecuted[attempt.commandsExecuted.length - 1];
            if (!lastCommand) return elapsedSeconds >= (hint.triggerValue || 300);
            const timeSinceLastCommand = Math.round(
              (Date.now() - lastCommand.executedAt.getTime()) / 1000
            );
            return timeSinceLastCommand >= (hint.triggerValue || 300);
          case 'request':
            return true; // Always available on request
          default:
            return false;
        }
      })
      .map(hint => hint.id);
  }

  /**
   * Get user progress
   */
  getUserProgress(userId: string, week: number): ChallengeProgress {
    const key = `${userId}_${week}`;
    let progress = this.userProgress.get(key);

    if (!progress) {
      progress = {
        userId,
        week,
        dailyChallengesCompleted: 0,
        weeklyBossBattlesCompleted: 0,
        capstoneSimulationsCompleted: 0,
        totalScore: 0,
        averageTime: 0,
        strengths: [],
        weaknesses: [],
        recommendedScenarios: []
      };
      this.userProgress.set(key, progress);
    }

    return progress;
  }

  /**
   * Get daily challenge for user based on their unlocked week
   * Only shows challenges from weeks the user has access to
   */
  getDailyChallenge(userId: string, userCurrentWeek: number): ChallengeScenario | null {
    const progress = this.getUserProgress(userId, userCurrentWeek);
    const completedScenarios = new Set(progress.recommendedScenarios);

    // Determine which difficulty levels the user has access to based on their current week
    const accessibleDifficulties: ChallengeScenario['difficulty'][] = [];
    if (userCurrentWeek >= 1) accessibleDifficulties.push('week1-4');
    if (userCurrentWeek >= 5) accessibleDifficulties.push('week5-8');
    if (userCurrentWeek >= 9) accessibleDifficulties.push('week9-12');
    if (userCurrentWeek >= 13) accessibleDifficulties.push('week13-16');

    // Get the user's current difficulty range
    const currentDifficulty = 
      userCurrentWeek >= 13 ? 'week13-16' :
      userCurrentWeek >= 9 ? 'week9-12' :
      userCurrentWeek >= 5 ? 'week5-8' : 'week1-4';

    // Get available daily challenges for current difficulty level (not completed)
    const availableChallenges = SCENARIO_CHALLENGES.filter(
      s => s.type === 'daily' && 
           s.difficulty === currentDifficulty && 
           !completedScenarios.has(s.id)
    );

    if (availableChallenges.length === 0) {
      // All challenges in current difficulty completed, return random one for practice
      const practiceChallenge = SCENARIO_CHALLENGES.find(
        s => s.type === 'daily' && s.difficulty === currentDifficulty
      );
      return practiceChallenge || null;
    }

    // Return first available challenge
    return availableChallenges[0];
  }

  /**
   * Private methods
   */
  private calculateScore(attempt: ChallengeAttempt): number {
    const scenario = getScenarioById(attempt.scenarioId);
    if (!attempt.passed || !scenario) return 0;

    let score = 50; // Base score for completion

    // Time bonus (faster = higher score)
    const timeRatio = attempt.timeSpentSeconds / scenario.timeLimitSeconds;
    if (timeRatio < 0.5) score += 30;
    else if (timeRatio < 0.75) score += 20;
    else if (timeRatio < 1.0) score += 10;

    // Objective completion bonus
    const objectiveRatio = attempt.objectivesCompleted.length / scenario.objectives.length;
    score += Math.round(objectiveRatio * 20);

    // Hint penalty
    const hintPenalty = attempt.hintsUsed.length * 5;
    score = Math.max(0, score - hintPenalty);

    // Error penalty
    const errorPenalty = attempt.errors.filter(e => !e.resolved).length * 10;
    score = Math.max(0, score - errorPenalty);

    return Math.min(100, score);
  }

  private generateFeedback(attempt: ChallengeAttempt): string {
    const scenario = getScenarioById(attempt.scenarioId);
    if (!scenario) return 'Scenario completed.';

    const feedback: string[] = [];

    if (attempt.passed) {
      feedback.push('✅ Scenario completed successfully!');

      if (attempt.score >= 90) {
        feedback.push('🏆 Outstanding performance! You handled this scenario like a seasoned professional.');
      } else if (attempt.score >= 75) {
        feedback.push('💪 Solid work! You demonstrated good problem-solving skills.');
      } else {
        feedback.push('👍 Good job completing the scenario. There\'s room for improvement in efficiency.');
      }
    } else {
      feedback.push('❌ Scenario not completed. Don\'t worry - this is how we learn.');
      feedback.push('💡 Review the objectives and try again. Each attempt builds your skills.');
    }

    // Specific feedback based on performance
    if (attempt.hintsUsed.length > 2) {
      feedback.push('💭 Consider relying less on hints in future attempts to build independent problem-solving.');
    }

    if (attempt.errors.length > 3) {
      feedback.push('🔧 Focus on careful execution to minimize errors during troubleshooting.');
    }

    if (attempt.timeSpentSeconds > scenario.timeLimitSeconds * 1.2) {
      feedback.push('⏱️ Work on improving speed while maintaining accuracy.');
    }

    return feedback.join(' ');
  }

  private updateUserProgress(attempt: ChallengeAttempt): void {
    const scenario = getScenarioById(attempt.scenarioId);
    if (!scenario) return;

    const progress = this.getUserProgress(attempt.userId, Math.ceil(Date.now() / (7 * 24 * 60 * 60 * 1000))); // Current week

    // Update completion counts
    switch (scenario.type) {
      case 'daily':
        progress.dailyChallengesCompleted++;
        break;
      case 'weekly':
        progress.weeklyBossBattlesCompleted++;
        break;
      case 'capstone':
        progress.capstoneSimulationsCompleted++;
        break;
    }

    // Update scores and timing
    const totalAttempts = progress.dailyChallengesCompleted + progress.weeklyBossBattlesCompleted + progress.capstoneSimulationsCompleted;
    progress.totalScore = Math.round((progress.totalScore * (totalAttempts - 1) + attempt.score) / totalAttempts);
    progress.averageTime = Math.round((progress.averageTime * (totalAttempts - 1) + attempt.timeSpentSeconds) / totalAttempts);

    // Update strengths and weaknesses based on performance
    if (attempt.score >= 80) {
      scenario.tags.forEach(tag => {
        if (!progress.strengths.includes(tag)) {
          progress.strengths.push(tag);
        }
      });
    } else if (attempt.score < 60) {
      scenario.tags.forEach(tag => {
        if (!progress.weaknesses.includes(tag)) {
          progress.weaknesses.push(tag);
        }
      });
    }

    // Update recommendations
    progress.recommendedScenarios = getRecommendedScenarios(progress).map(s => s.id);
  }
}