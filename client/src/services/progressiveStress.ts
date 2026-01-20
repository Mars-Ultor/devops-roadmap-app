/**
 * Progressive Stress Service - Military Training Methodology
 * Manages graduated difficulty escalation and stress application
 */

import type {
  StressLevel,
  StressSession,
  StressEvent,
  StressMetrics,
} from "../types/stress";
import { STRESS_LEVELS, STRESS_CONFIG } from "../types/stress";

export class ProgressiveStressService {
  private static instance: ProgressiveStressService;
  private activeSessions = new Map<string, StressSession>();
  private stressMetrics = new Map<string, StressMetrics>();

  private constructor() {}

  static getInstance(): ProgressiveStressService {
    if (!ProgressiveStressService.instance) {
      ProgressiveStressService.instance = new ProgressiveStressService();
    }
    return ProgressiveStressService.instance;
  }

  /**
   * Get stress level configuration for current week
   */
  getStressLevelForWeek(week: number): StressLevel {
    return (
      STRESS_LEVELS.find(
        (level) => week >= level.weekRange[0] && week <= level.weekRange[1],
      ) || STRESS_LEVELS[0]
    ); // Default to first level if not found
  }

  /**
   * Start a stress session for a lesson
   */
  startStressSession(
    userId: string,
    week: number,
    lessonId: string,
    level: "crawl" | "walk" | "runGuided" | "runIndependent",
  ): StressSession {
    const stressLevel = this.getStressLevelForWeek(week);
    const sessionId = `${userId}_${lessonId}_${level}_${Date.now()}`;

    const session: StressSession = {
      sessionId,
      userId,
      week,
      lessonId,
      level,
      startedAt: new Date(),
      timeLimit: stressLevel.timeLimit,
      timeRemaining: stressLevel.timeLimit,
      documentationLevel: stressLevel.documentation,
      externalResourcesAllowed: stressLevel.externalResources,
      copyPasteAllowed: stressLevel.copyPaste,
      distractionsEnabled: stressLevel.distractions,
      simultaneousTasks: stressLevel.simultaneousTasks,
      hintsUsed: 0,
      resetsUsed: 0,
      completed: false,
      passed: false,
      stressEvents: [],
    };

    this.activeSessions.set(sessionId, session);

    // Start stress monitoring
    this.startStressMonitoring(session);

    return session;
  }

  /**
   * End a stress session
   */
  endStressSession(sessionId: string, passed: boolean): StressSession | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    session.completed = true;
    session.passed = passed;

    // Update metrics
    this.updateStressMetrics(session);

    // Clean up
    this.activeSessions.delete(sessionId);

    return session;
  }

  /**
   * Record a stress event
   */
  recordStressEvent(
    sessionId: string,
    event: Omit<StressEvent, "eventId" | "timestamp">,
  ): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const stressEvent: StressEvent = {
      eventId: `${sessionId}_event_${Date.now()}`,
      timestamp: new Date(),
      ...event,
    };

    session.stressEvents.push(stressEvent);
  }

  /**
   * Check if action is allowed under current stress
   */
  isActionAllowed(
    sessionId: string,
    action: "copy" | "paste" | "external_resource" | "documentation",
  ): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) return true; // No active stress session

    switch (action) {
      case "copy":
      case "paste":
        return session.copyPasteAllowed;
      case "external_resource":
        return session.externalResourcesAllowed;
      case "documentation":
        return session.documentationLevel !== "none";
      default:
        return true;
    }
  }

  /**
   * Get allowed documentation URLs for current stress level
   */
  getAllowedDocumentationUrls(sessionId: string): string[] {
    const session = this.activeSessions.get(sessionId);
    if (!session) return STRESS_CONFIG.documentationUrls.full;

    return (
      STRESS_CONFIG.documentationUrls[
        session.documentationLevel as keyof typeof STRESS_CONFIG.documentationUrls
      ] || []
    );
  }

  /**
   * Apply hint penalty for current stress level
   */
  applyHintPenalty(sessionId: string, baseHintCost: number): number {
    const session = this.activeSessions.get(sessionId);
    if (!session) return baseHintCost;

    const stressLevel = this.getStressLevelForWeek(session.week);
    return Math.round(baseHintCost * stressLevel.hintPenalty);
  }

  /**
   * Get current session status
   */
  getSessionStatus(sessionId: string): StressSession | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * Get stress metrics for user
   */
  getStressMetrics(userId: string, week: number): StressMetrics | null {
    const key = `${userId}_${week}`;
    return this.stressMetrics.get(key) || null;
  }

  /**
   * Private methods
   */
  private startStressMonitoring(session: StressSession): void {
    if (!session.timeLimit) return;

    // Time monitoring
    const timeInterval = setInterval(() => {
      if (!this.activeSessions.has(session.sessionId)) {
        clearInterval(timeInterval);
        return;
      }

      const elapsed = Date.now() - session.startedAt.getTime();
      const remaining = Math.max(0, session.timeLimit! * 1000 - elapsed);

      session.timeRemaining = Math.round(remaining / 1000);

      // Time warnings
      const timeRatio = remaining / (session.timeLimit! * 1000);
      STRESS_CONFIG.timeWarningThresholds.forEach((threshold) => {
        if (timeRatio <= threshold && timeRatio > threshold - 0.01) {
          this.recordStressEvent(session.sessionId, {
            type: "time_warning",
            message: `Time warning: ${Math.round(timeRatio * 100)}% remaining`,
            severity:
              threshold <= 0.25
                ? "critical"
                : threshold <= 0.5
                  ? "high"
                  : "medium",
            resolved: false,
          });
        }
      });

      // Time up
      if (remaining <= 0) {
        this.endStressSession(session.sessionId, false);
        clearInterval(timeInterval);
      }
    }, 1000);

    // Distraction simulation
    if (session.distractionsEnabled) {
      const distractionInterval = setInterval(() => {
        if (!this.activeSessions.has(session.sessionId)) {
          clearInterval(distractionInterval);
          return;
        }

        const distraction =
          STRESS_CONFIG.distractionTypes[
            Math.floor(Math.random() * STRESS_CONFIG.distractionTypes.length)
          ];

        this.recordStressEvent(session.sessionId, {
          type: "distraction",
          message: distraction,
          severity: "medium",
          resolved: false,
        });
      }, STRESS_CONFIG.distractionInterval);
    }
  }

  private updateStressMetrics(session: StressSession): void {
    const key = `${session.userId}_${session.week}`;
    const existing = this.stressMetrics.get(key);

    const completionTime = Date.now() - session.startedAt.getTime();
    const stressEventCount = session.stressEvents.length;

    if (existing) {
      // Update averages
      const totalSessions = existing.averageCompletionTime ? 2 : 1;
      existing.averageCompletionTime = Math.round(
        (existing.averageCompletionTime + completionTime) / totalSessions,
      );
      existing.stressEventCount += stressEventCount;
      existing.hintUsageUnderStress += session.hintsUsed;
      existing.resetTokenUsage += session.resetsUsed;
    } else {
      this.stressMetrics.set(key, {
        userId: session.userId,
        week: session.week,
        averageCompletionTime: completionTime,
        stressEventCount,
        hintUsageUnderStress: session.hintsUsed,
        resetTokenUsage: session.resetsUsed,
        performanceDegradation: 0, // Calculate based on baseline performance
        adaptationRate: 0, // Calculate based on improvement over time
      });
    }
  }
}
