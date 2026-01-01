/**
 * Enhanced AI Coach Service - Military Training Methodology
 * Advanced coaching with real-time analysis, discipline enforcement, and adaptive learning
 */

import type {
  CoachFeedback,
  CoachContext,
  CoachMode,
  CodeAnalysis,
  CodeIssue,
  CodeSuggestion,
  PerformanceAnalytics
} from '../types/aiCoach';
import { COACH_CONFIG } from '../types/aiCoach';

export class AICoachService {
  private static instance: AICoachService;
  private performanceCache = new Map<string, PerformanceAnalytics>();

  public static getInstance(): AICoachService {
    if (!AICoachService.instance) {
      AICoachService.instance = new AICoachService();
    }
    return AICoachService.instance;
  }

  /**
   * Get enhanced coach feedback with military discipline
   */
  async getEnhancedCoachFeedback(context: CoachContext): Promise<CoachFeedback> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const mode = this.getCoachMode(context.currentWeek || 1);
    const disciplineCheck = this.checkDiscipline(context);
    const performanceMetrics = await this.analyzePerformance(context);

    // Critical discipline issues override everything
    if (disciplineCheck.critical) {
      return {
        type: 'discipline',
        message: disciplineCheck.message,
        confidence: 0.95,
        priority: 'critical',
        actionRequired: true,
        mode
      };
    }

    // Code analysis for labs and drills
    if (context.codeSnippet && (context.contentType === 'lab' || context.contentType === 'drill')) {
      const codeAnalysis = await this.analyzeCode(context.codeSnippet);
      if (codeAnalysis.issues.some(issue => issue.severity === 'critical')) {
        return {
          type: 'warning',
          message: `Critical code issue detected: ${codeAnalysis.issues.find(i => i.severity === 'critical')?.message}`,
          confidence: 0.9,
          priority: 'high',
          mode
        };
      }
    }

    // Struggle session specific coaching
    if (context.contentType === 'struggle_session' && context.struggleSession) {
      return this.getStruggleSessionFeedback(context);
    }

    // Performance-based feedback
    if (performanceMetrics.trends.declining.length > 0) {
      return {
        type: 'tactical_advice',
        message: `Performance analysis shows declining trends in: ${performanceMetrics.trends.declining.join(', ')}. Execute corrective actions immediately.`,
        confidence: 0.85,
        priority: 'high',
        mode
      };
    }

    // Mode-specific feedback
    return this.getModeSpecificFeedback(context, mode, performanceMetrics);
  }

  /**
   * Analyze code in real-time for immediate feedback
   */
  async analyzeCode(code: string): Promise<CodeAnalysis> {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 200));

    const issues: CodeIssue[] = [];
    const suggestions: CodeSuggestion[] = [];

    // Basic syntax checks
    if (code.includes('sudo') && !code.includes('sudo -i')) {
      issues.push({
        type: 'security',
        severity: 'high',
        message: 'Using sudo without proper context validation',
        suggestion: 'Always validate the need for elevated privileges and use sudo -i for interactive sessions'
      });
    }

    if (code.includes('rm -rf') && !code.includes('--preserve-root')) {
      issues.push({
        type: 'security',
        severity: 'critical',
        message: 'Dangerous rm -rf command without safeguards',
        suggestion: 'Never use rm -rf / or similar destructive commands in production'
      });
    }

    // Best practices
    if (code.includes('password') && !code.includes('encrypted') && !code.includes('hash')) {
      suggestions.push({
        type: 'security',
        description: 'Consider using encrypted passwords or environment variables',
        impact: 'high'
      });
    }

    return {
      issues,
      suggestions,
      complexity: this.calculateComplexity(code),
      bestPractices: [
        'Use environment variables for sensitive data',
        'Implement proper error handling',
        'Add comments for complex operations'
      ],
      securityConcerns: issues.filter(i => i.type === 'security').map(i => i.message)
    };
  }

  /**
   * Check for discipline violations
   */
  private checkDiscipline(context: CoachContext): { critical: boolean; message: string } {
    const { userProgress } = context;

    // Hint abuse
    if (userProgress.hintsUsed > COACH_CONFIG.DISCIPLINE_THRESHOLDS.HINT_ABUSE) {
      return {
        critical: true,
        message: `HINT ABUSE DETECTED: ${userProgress.hintsUsed} hints used. This violates training discipline. Solve independently or face consequences.`
      };
    }

    // Time wasting
    if (userProgress.timeSpent > COACH_CONFIG.DISCIPLINE_THRESHOLDS.TIME_WASTING && userProgress.attempts < 2) {
      return {
        critical: true,
        message: `TIME WASTING: ${Math.floor(userProgress.timeSpent / 60)} minutes spent with minimal attempts. Execute with purpose or stand down.`
      };
    }

    // Struggle avoidance
    if (context.struggleSession && context.struggleSession.timeRemaining > COACH_CONFIG.DISCIPLINE_THRESHOLDS.STRUGGLE_AVOIDANCE && context.struggleSession.logsSubmitted === 0) {
      return {
        critical: false,
        message: 'Struggle avoidance detected. Document your attempts before requesting assistance.'
      };
    }

    return { critical: false, message: '' };
  }

  /**
   * Get struggle session specific feedback
   */
  private getStruggleSessionFeedback(context: CoachContext): CoachFeedback {
    const session = context.struggleSession!;
    const timeSpent = context.userProgress.timeSpent;

    if (timeSpent > 1800) { // 30+ minutes
      return {
        type: 'encouragement',
        message: 'Outstanding endurance! You\'ve demonstrated the mental toughness required of elite operators. This struggle builds unbreakable problem-solving skills.',
        confidence: 0.95,
        priority: 'high'
      };
    }

    if (session.logsSubmitted === 0 && session.timeRemaining < 600) { // 10 minutes left
      return {
        type: 'discipline',
        message: 'STRUGGLE LOG REQUIRED: Document your problem-solving attempts immediately. No struggle log = no assistance.',
        confidence: 0.9,
        priority: 'critical',
        actionRequired: true
      };
    }

    if (session.hintsAvailable === 0) {
      return {
        type: 'tactical_advice',
        message: 'All hints exhausted. This is where champions are made. Break down the problem systematically. What\'s the simplest test case?',
        confidence: 0.85,
        priority: 'medium'
      };
    }

    return {
      type: 'insight',
      message: 'Struggle is the forge of mastery. Each failed attempt brings you closer to understanding. Stay disciplined.',
      confidence: 0.8
    };
  }

  /**
   * Analyze user performance patterns
   */
  private async analyzePerformance(context: CoachContext): Promise<PerformanceAnalytics> {
    const userId = context.contentId; // Using contentId as proxy for user session
    const cached = this.performanceCache.get(userId);

    if (cached && Date.now() - cached.metrics.averageTime < 3600000) { // 1 hour cache
      return cached;
    }

    // Simulate performance analysis
    await new Promise(resolve => setTimeout(resolve, 150));

    const analytics: PerformanceAnalytics = {
      userId,
      period: 'week',
      metrics: {
        averageAttempts: context.userProgress.attempts,
        averageTime: context.userProgress.timeSpent,
        hintDependency: context.userProgress.hintsUsed / Math.max(context.userProgress.attempts, 1),
        errorRate: context.recentErrors?.length || 0,
        learningVelocity: this.calculateLearningVelocity(context),
        persistenceScore: this.calculatePersistenceScore(context)
      },
      trends: {
        improving: [],
        declining: [],
        plateaued: []
      },
      recommendations: []
    };

    // Analyze trends
    if (analytics.metrics.hintDependency > 0.5) {
      analytics.trends.declining.push('hint dependency');
      analytics.recommendations.push('Reduce hint usage through independent problem-solving');
    }

    if (analytics.metrics.persistenceScore < 0.3) {
      analytics.trends.declining.push('persistence');
      analytics.recommendations.push('Increase struggle time before seeking help');
    }

    this.performanceCache.set(userId, analytics);
    return analytics;
  }

  /**
   * Get mode-specific feedback
   */
  private getModeSpecificFeedback(
    context: CoachContext,
    mode: CoachMode,
    performance: PerformanceAnalytics
  ): CoachFeedback {

    switch (mode) {
      case 'instructor':
        return this.getInstructorFeedback(context, performance);

      case 'peer':
        return this.getPeerFeedback();

      case 'independent':
        return this.getIndependentFeedback(performance);

      case 'drill_sergeant':
        return this.getDrillSergeantFeedback(context, performance);

      default:
        return {
          type: 'encouragement',
          message: 'Continue your training. Standards don\'t lower.',
          confidence: 0.7
        };
    }
  }

  private getInstructorFeedback(context: CoachContext, performance: PerformanceAnalytics): CoachFeedback {
    if (performance.metrics.hintDependency > 0.7) {
      return {
        type: 'discipline',
        message: 'HINT DEPENDENCY CRITICAL: You\'re relying on external assistance instead of building internal capability. This must stop immediately.',
        confidence: 0.95,
        priority: 'critical',
        actionRequired: true
      };
    }

    if (context.recentErrors && context.recentErrors.length > 0) {
      return {
        type: 'hint',
        message: `Error pattern detected: "${context.recentErrors[0]}". Here's how to debug this systematically...`,
        confidence: 0.9,
        followUpQuestions: [
          'What does this error message tell you?',
          'Which component is failing?',
          'Have you verified the prerequisites?'
        ]
      };
    }

    return {
      type: 'tactical_advice',
      message: 'Execute each step deliberately. Verify. Adapt. Overcome.',
      confidence: 0.8
    };
  }

  private getPeerFeedback(): CoachFeedback {
    return {
      type: 'question',
      message: 'What\'s your hypothesis about why this isn\'t working? Walk me through your debugging process.',
      confidence: 0.8,
      followUpQuestions: [
        'What have you ruled out?',
        'What\'s the simplest test case?',
        'How does this compare to working examples?'
      ]
    };
  }

  private getIndependentFeedback(performance: PerformanceAnalytics): CoachFeedback {
    if (performance.metrics.persistenceScore > 0.8) {
      return {
        type: 'encouragement',
        message: 'Elite performance detected. You\'re operating at expert level. Maintain standards.',
        confidence: 0.9,
        priority: 'high'
      };
    }

    return {
      type: 'insight',
      message: 'Trust your training. You have the capability. Execute.',
      confidence: 0.7
    };
  }

  private getDrillSergeantFeedback(context: CoachContext, performance: PerformanceAnalytics): CoachFeedback {
    if (performance.metrics.hintDependency > 0) {
      return {
        type: 'discipline',
        message: 'HINT USAGE FORBIDDEN: This is advanced training. Solve it or fail trying. No excuses.',
        confidence: 0.98,
        priority: 'critical',
        actionRequired: true
      };
    }

    if (context.userProgress.timeSpent > 7200) { // 2 hours
      return {
        type: 'discipline',
        message: 'TIME LIMIT EXCEEDED: 2 hours spent. This demonstrates poor planning and execution. Learn from this failure.',
        confidence: 0.95,
        priority: 'high'
      };
    }

    return {
      type: 'tactical_advice',
      message: 'Execute with precision. Every second counts. Standards are absolute.',
      confidence: 0.85
    };
  }

  // Utility methods
  private getCoachMode(week: number): CoachMode {
    if (week <= 4) return 'instructor';
    if (week <= 8) return 'peer';
    if (week <= 12) return 'independent';
    return 'drill_sergeant';
  }

  private calculateComplexity(code: string): number {
    let complexity = 1;
    if (code.includes('&&') || code.includes('||')) complexity += 2;
    if (code.includes('for ') || code.includes('while ')) complexity += 3;
    if (code.includes('sudo') || code.includes('chmod')) complexity += 2;
    return Math.min(complexity, 10);
  }

  private calculateLearningVelocity(context: CoachContext): number {
    const { attempts, timeSpent } = context.userProgress;
    if (timeSpent === 0) return 0;
    return attempts / (timeSpent / 3600); // attempts per hour
  }

  private calculatePersistenceScore(context: CoachContext): number {
    const { attempts, timeSpent, hintsUsed } = context.userProgress;
    if (attempts === 0) return 0;

    const persistence = (attempts / (hintsUsed + 1)) * (timeSpent / 1800); // normalized
    return Math.min(persistence / 10, 1); // 0-1 scale
  }
}

// Export singleton instance
export const aiCoachService = AICoachService.getInstance();

// Legacy compatibility functions
export async function getCoachFeedback(context: CoachContext): Promise<CoachFeedback> {
  return aiCoachService.getEnhancedCoachFeedback(context);
}

export function getCoachMode(week: number): CoachMode {
  return aiCoachService['getCoachMode'](week);
}

export function buildCoachContext(
  contentType: 'lesson' | 'lab' | 'drill',
  contentId: string,
  activity: {
    attempts?: number;
    timeSpent?: number;
    hintsUsed?: number;
    currentIssue?: string;
    recentErrors?: string[];
  }
): CoachContext {
  return {
    contentType,
    contentId,
    userProgress: {
      attempts: activity.attempts || 0,
      timeSpent: activity.timeSpent || 0,
      hintsUsed: activity.hintsUsed || 0
    },
    currentIssue: activity.currentIssue,
    recentErrors: activity.recentErrors
  };
}