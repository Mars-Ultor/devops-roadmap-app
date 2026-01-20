/**
 * ML-Enhanced AI Coach Service
 * Integrates machine learning models for intelligent coaching and personalization
 */

import { MLModelService } from "./mlModelService";
import type { MLInput } from "./mlModelService";
import type {
  CoachFeedback,
  CoachContext,
  CoachMode,
  MotivationalProfile,
} from "../types/aiCoach";

export interface MLCoachInsights {
  learningStyle: {
    primary: "visual" | "kinesthetic" | "reading" | "auditory";
    confidence: number;
    recommendations: string[];
  };
  skillGaps: Array<{
    topic: string;
    gapSize: number;
    priority: "high" | "medium" | "low";
    recommendedActions: string[];
  }>;
  optimalPath: {
    nextTopics: string[];
    estimatedTime: number;
    confidence: number;
    reasoning: string;
  };
  performancePrediction: {
    completionProbability: number;
    estimatedCompletionDate: Date;
    riskFactors: string[];
    interventions: string[];
  };
  motivationalProfile: MotivationalProfile;
}

export class MLEnhancedAICoach {
  private static instance: MLEnhancedAICoach;
  private mlService = MLModelService.getInstance();
  private insightsCache = new Map<
    string,
    { insights: MLCoachInsights; timestamp: Date }
  >();

  public static getInstance(): MLEnhancedAICoach {
    if (!MLEnhancedAICoach.instance) {
      MLEnhancedAICoach.instance = new MLEnhancedAICoach();
    }
    return MLEnhancedAICoach.instance;
  }

  /**
   * Get comprehensive ML-enhanced coaching insights
   */
  async getMLCoachInsights(
    userId: string,
    context: CoachContext,
  ): Promise<MLCoachInsights> {
    // Check cache first (valid for 1 hour)
    const cacheKey = `${userId}_${context.contentId}`;
    const cached = this.insightsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp.getTime() < 3600000) {
      return cached.insights;
    }

    try {
      // Run multiple ML models in parallel
      const [
        learningStylePrediction,
        skillGapPrediction,
        pathPrediction,
        performancePrediction,
      ] = await Promise.all([
        this.predictLearningStyle(userId, context),
        this.analyzeSkillGaps(userId, context),
        this.predictOptimalPath(userId, context),
        this.predictPerformance(userId, context),
      ]);

      // Analyze motivational profile
      const motivationalProfile = await this.analyzeMotivationalProfile(
        userId,
        context,
      );

      const insights: MLCoachInsights = {
        learningStyle: learningStylePrediction,
        skillGaps: skillGapPrediction,
        optimalPath: pathPrediction,
        performancePrediction: performancePrediction,
        motivationalProfile,
      };

      // Cache the results
      this.insightsCache.set(cacheKey, { insights, timestamp: new Date() });

      return insights;
    } catch (error) {
      console.error("ML coaching insights generation failed:", error);
      // Return fallback insights
      return this.getFallbackInsights(context);
    }
  }

  /**
   * Get personalized coach feedback using ML insights
   */
  async getPersonalizedCoachFeedback(
    userId: string,
    context: CoachContext,
  ): Promise<CoachFeedback> {
    const insights = await this.getMLCoachInsights(userId, context);

    // Generate feedback based on ML insights
    const feedback = this.generateMLBasedFeedback(context, insights);

    return {
      ...feedback,
      mode: this.getCoachMode(context.currentWeek || 1),
      confidence: this.calculateFeedbackConfidence(insights),
    };
  }

  /**
   * Get adaptive learning recommendations
   */
  async getAdaptiveRecommendations(
    userId: string,
    context: CoachContext,
  ): Promise<string[]> {
    const insights = await this.getMLCoachInsights(userId, context);

    const recommendations: string[] = [];

    // Learning style recommendations
    recommendations.push(...insights.learningStyle.recommendations);

    // Skill gap interventions
    insights.skillGaps
      .filter((gap) => gap.priority === "high")
      .slice(0, 2)
      .forEach((gap) => {
        recommendations.push(...gap.recommendedActions.slice(0, 1));
      });

    // Performance interventions
    recommendations.push(
      ...insights.performancePrediction.interventions.slice(0, 2),
    );

    // Optimal path suggestions
    if (insights.optimalPath.nextTopics.length > 0) {
      recommendations.push(`Focus on: ${insights.optimalPath.nextTopics[0]}`);
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private async predictLearningStyle(
    userId: string,
    context: CoachContext,
  ): Promise<MLCoachInsights["learningStyle"]> {
    try {
      // Prepare input features for learning style detection
      const features = this.extractLearningStyleFeatures(context);

      const input: MLInput = {
        features,
        metadata: { userId, contentType: context.contentType },
      };

      const prediction = await this.mlService.predict(
        "learning-style-detector",
        input,
      );

      const styles = ["visual", "kinesthetic", "reading", "auditory"] as const;
      const maxIndex = prediction.prediction.indexOf(
        Math.max(...prediction.prediction),
      );
      const primaryStyle = styles[maxIndex];

      return {
        primary: primaryStyle,
        confidence: prediction.confidence,
        recommendations: this.getLearningStyleRecommendations(primaryStyle),
      };
    } catch {
      return {
        primary: "kinesthetic",
        confidence: 0.5,
        recommendations: [
          "Try hands-on exercises",
          "Practice with real scenarios",
        ],
      };
    }
  }

  private async analyzeSkillGaps(
    userId: string,
    context: CoachContext,
  ): Promise<MLCoachInsights["skillGaps"]> {
    try {
      const features = this.extractSkillGapFeatures(context);

      const input: MLInput = {
        features,
        metadata: { userId, contentId: context.contentId },
      };

      const prediction = await this.mlService.predict(
        "skill-gap-analyzer",
        input,
      );

      // Convert prediction to skill gaps
      const skillGaps: MLCoachInsights["skillGaps"] = [];
      const topicNames = this.getTopicNames();

      prediction.prediction.forEach((gapSize, index) => {
        if (gapSize > 0.3 && topicNames[index]) {
          skillGaps.push({
            topic: topicNames[index],
            gapSize,
            priority: gapSize > 0.7 ? "high" : gapSize > 0.5 ? "medium" : "low",
            recommendedActions: this.getSkillGapActions(
              topicNames[index],
              gapSize,
            ),
          });
        }
      });

      return skillGaps.sort((a, b) => b.gapSize - a.gapSize);
    } catch {
      return [];
    }
  }

  private async predictOptimalPath(
    userId: string,
    context: CoachContext,
  ): Promise<MLCoachInsights["optimalPath"]> {
    try {
      const features = this.extractPathPredictionFeatures(context);

      const input: MLInput = {
        features,
        metadata: { userId, currentWeek: context.currentWeek },
      };

      const prediction = await this.mlService.predict(
        "learning-path-predictor",
        input,
      );

      const topicNames = this.getTopicNames();
      const nextTopics: string[] = [];

      // Get top 3 recommended topics
      const sortedIndices = prediction.prediction
        .map((score, index) => ({ score, index }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      sortedIndices.forEach(({ index }) => {
        if (topicNames[index]) {
          nextTopics.push(topicNames[index]);
        }
      });

      return {
        nextTopics,
        estimatedTime: Math.ceil(nextTopics.length * 2.5), // Rough estimate: 2.5 hours per topic
        confidence: prediction.confidence,
        reasoning:
          prediction.explanation ||
          "Based on your current progress and performance patterns",
      };
    } catch {
      return {
        nextTopics: ["Continue with current topic", "Review fundamentals"],
        estimatedTime: 5,
        confidence: 0.5,
        reasoning: "Fallback recommendation due to analysis unavailability",
      };
    }
  }

  private async predictPerformance(
    userId: string,
    context: CoachContext,
  ): Promise<MLCoachInsights["performancePrediction"]> {
    try {
      const features = this.extractPerformanceFeatures(context);

      const input: MLInput = {
        features,
        metadata: { userId },
      };

      const prediction = await this.mlService.predict(
        "performance-predictor",
        input,
      );

      const completionProbability = prediction.prediction[0];
      const estimatedWeeks = Math.max(
        1,
        Math.ceil((1 - completionProbability) * 12),
      );
      const estimatedCompletionDate = new Date();
      estimatedCompletionDate.setDate(
        estimatedCompletionDate.getDate() + estimatedWeeks * 7,
      );

      return {
        completionProbability,
        estimatedCompletionDate,
        riskFactors: this.identifyRiskFactors(completionProbability, context),
        interventions: this.getPerformanceInterventions(
          completionProbability,
          context,
        ),
      };
    } catch {
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 3);

      return {
        completionProbability: 0.7,
        estimatedCompletionDate: defaultDate,
        riskFactors: [],
        interventions: ["Continue regular practice", "Seek help when stuck"],
      };
    }
  }

  private async analyzeMotivationalProfile(
    userId: string,
    context: CoachContext,
  ): Promise<MotivationalProfile> {
    // Analyze based on context and performance patterns
    const successRate = context.userProgress.successRate || 0.5;
    const persistence = context.performanceMetrics?.persistence || 0.5;
    const hintsUsed = context.userProgress.hintsUsed;

    let primaryDriver: MotivationalProfile["primaryDriver"] = "achievement";
    if (persistence > 0.8) primaryDriver = "mastery";
    else if (hintsUsed < 2) primaryDriver = "autonomy";
    else if (successRate > 0.8) primaryDriver = "purpose";

    return {
      primaryDriver,
      motivationalTriggers: this.getMotivationalTriggers(primaryDriver),
      demotivators: this.getDemotivators(primaryDriver),
      communicationStyle: this.getCommunicationStyle(primaryDriver),
      responsePatterns: {
        toSuccess: ["Great job!", "Keep it up!", "Excellent work!"],
        toFailure: ["Try again", "You can do this", "Learn from this"],
        toStruggle: [
          "Take your time",
          "Break it down",
          "Ask for help if needed",
        ],
      },
    };
  }

  private extractLearningStyleFeatures(context: CoachContext): number[] {
    return [
      context.userProgress.timeSpent > 1800 ? 1 : 0, // Long sessions might indicate deep reading
      context.contentType === "lab" ? 1 : 0, // Hands-on preference
      context.userProgress.hintsUsed > 5 ? 0 : 1, // Low hints might indicate visual learners
      context.performanceMetrics?.speed || 0.5, // Speed might indicate auditory preference
    ];
  }

  private extractSkillGapFeatures(): number[] {
    // Mock features representing topic performance
    return new Array(50).fill(0).map(() => Math.random());
  }

  private extractPathPredictionFeatures(context: CoachContext): number[] {
    return [
      context.currentWeek || 1,
      context.userProgress.successRate || 0.5,
      context.userProgress.timeSpent / 3600, // Convert to hours
      context.userProgress.hintsUsed,
      context.performanceMetrics?.accuracy || 0.5,
      context.performanceMetrics?.learningVelocity || 0.5,
    ];
  }

  private extractPerformanceFeatures(context: CoachContext): number[] {
    return [
      context.userProgress.streakCount || 0,
      context.userProgress.successRate || 0.5,
      context.userProgress.attempts > 0 ? 1 : 0,
      context.performanceMetrics?.persistence || 0.5,
    ];
  }

  private getLearningStyleRecommendations(style: string): string[] {
    const recommendations: Record<string, string[]> = {
      visual: [
        "Use diagrams and flowcharts",
        "Watch video tutorials",
        "Create mind maps",
      ],
      kinesthetic: [
        "Practice with hands-on labs",
        "Build projects",
        "Use interactive simulations",
      ],
      reading: [
        "Read documentation thoroughly",
        "Take detailed notes",
        "Study theory first",
      ],
      auditory: [
        "Listen to podcasts",
        "Explain concepts out loud",
        "Participate in discussions",
      ],
    };

    return recommendations[style] || ["Mix different learning approaches"];
  }

  private getSkillGapActions(topic: string, gapSize: number): string[] {
    const actions = [
      `Review ${topic} fundamentals`,
      `Complete additional ${topic} exercises`,
      `Study ${topic} documentation`,
      `Practice ${topic} in labs`,
    ];

    return gapSize > 0.7 ? actions : actions.slice(0, 2);
  }

  private getTopicNames(): string[] {
    return [
      "Git Basics",
      "Linux Commands",
      "Bash Scripting",
      "Version Control",
      "Container Basics",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Cloud Services",
      "AWS",
      "Azure",
      "GCP",
      "Infrastructure as Code",
      "Terraform",
      "Monitoring",
      "Logging",
      "Security",
      "DevOps Culture",
      "Agile",
      "Scrum",
      "Kanban",
      "Microservices",
      "API Design",
      "Database Design",
      "Networking",
      "Load Balancing",
      "Scaling",
      "Disaster Recovery",
      "Performance Optimization",
      "Testing Strategies",
      "Code Quality",
      "Documentation",
      "Team Collaboration",
      "Project Management",
      "Career Development",
      "Interview Preparation",
      "Certifications",
      "Open Source",
      "Community Involvement",
      "Continuous Learning",
    ];
  }

  private identifyRiskFactors(
    probability: number,
    context: CoachContext,
  ): string[] {
    const risks: string[] = [];

    if (probability < 0.5) {
      risks.push("Low completion probability indicates need for intervention");
    }

    if (context.userProgress.hintsUsed > 10) {
      risks.push("High hint usage suggests knowledge gaps");
    }

    if (
      context.performanceMetrics?.persistence &&
      context.performanceMetrics.persistence < 0.3
    ) {
      risks.push("Low persistence may lead to early dropout");
    }

    return risks;
  }

  private getPerformanceInterventions(
    probability: number,
    context: CoachContext,
  ): string[] {
    const interventions: string[] = [];

    if (probability < 0.6) {
      interventions.push("Schedule daily study sessions");
      interventions.push("Focus on weak foundational topics");
    }

    if (
      context.userProgress.successRate &&
      context.userProgress.successRate < 0.7
    ) {
      interventions.push("Review after-action reports for improvement areas");
      interventions.push("Practice with simpler exercises first");
    }

    interventions.push("Track progress weekly");
    interventions.push("Celebrate small wins");

    return interventions;
  }

  private getMotivationalTriggers(driver: string): string[] {
    const triggers: Record<string, string[]> = {
      achievement: [
        "Progress tracking",
        "Badges and certificates",
        "Leaderboards",
      ],
      mastery: [
        "Skill improvement",
        "Deep understanding",
        "Expert recognition",
      ],
      autonomy: [
        "Self-paced learning",
        "Choice of projects",
        "Independent problem-solving",
      ],
      purpose: [
        "Real-world application",
        "Team contribution",
        "Career advancement",
      ],
    };

    return triggers[driver] || [];
  }

  private getDemotivators(driver: string): string[] {
    const demotivators: Record<string, string[]> = {
      achievement: [
        "Unclear goals",
        "No recognition",
        "Comparison without context",
      ],
      mastery: ["Superficial learning", "Rushed pace", "Lack of depth"],
      autonomy: ["Strict schedules", "Mandatory activities", "Limited choices"],
      purpose: [
        "Theoretical focus",
        "No practical application",
        "Unclear impact",
      ],
    };

    return demotivators[driver] || [];
  }

  private getCommunicationStyle(
    driver: string,
  ): MotivationalProfile["communicationStyle"] {
    const styles: Record<string, MotivationalProfile["communicationStyle"]> = {
      achievement: "direct",
      mastery: "analytical",
      autonomy: "direct",
      purpose: "tactical",
    };

    return styles[driver] || "encouraging";
  }

  private generateMLBasedFeedback(
    context: CoachContext,
    insights: MLCoachInsights,
  ): Omit<CoachFeedback, "mode" | "confidence"> {
    // Generate feedback based on ML insights
    const { learningStyle, skillGaps, optimalPath, performancePrediction } =
      insights;

    if (performancePrediction.completionProbability < 0.4) {
      return {
        type: "warning",
        message: `Based on your current trajectory, completion probability is ${(performancePrediction.completionProbability * 100).toFixed(0)}%. Consider the recommended interventions to improve your chances.`,
        priority: "high",
        actionRequired: true,
        followUpQuestions: [
          "What specific challenges are you facing?",
          "How can I help you overcome these obstacles?",
        ],
      };
    }

    if (skillGaps.length > 0 && skillGaps[0].gapSize > 0.7) {
      return {
        type: "insight",
        message: `ML analysis shows a significant gap in ${skillGaps[0].topic}. ${skillGaps[0].recommendedActions[0]}`,
        priority: "medium",
        context: `Skill gap analysis: ${skillGaps.length} areas identified`,
      };
    }

    if (optimalPath.nextTopics.length > 0) {
      return {
        type: "tactical_advice",
        message: `Your optimal next topic is ${optimalPath.nextTopics[0]}. This aligns with your ${learningStyle.primary} learning style.`,
        priority: "medium",
        context: optimalPath.reasoning,
      };
    }

    // Default encouragement
    return {
      type: "encouragement",
      message: `You're making good progress! Keep leveraging your ${learningStyle.primary} learning style.`,
      priority: "low",
    };
  }

  private calculateFeedbackConfidence(insights: MLCoachInsights): number {
    // Calculate overall confidence based on ML model confidences
    const confidences = [
      insights.learningStyle.confidence,
      insights.optimalPath.confidence,
      insights.performancePrediction.completionProbability > 0.5 ? 0.8 : 0.6,
    ];

    return (
      confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length
    );
  }

  private getCoachMode(week: number): CoachMode {
    if (week <= 4) return "instructor";
    if (week <= 8) return "peer";
    return "independent";
  }

  private getFallbackInsights(): MLCoachInsights {
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 3);

    return {
      learningStyle: {
        primary: "kinesthetic",
        confidence: 0.5,
        recommendations: [
          "Try hands-on exercises",
          "Practice with real scenarios",
        ],
      },
      skillGaps: [],
      optimalPath: {
        nextTopics: ["Continue current learning path"],
        estimatedTime: 10,
        confidence: 0.5,
        reasoning: "Standard progression recommended",
      },
      performancePrediction: {
        completionProbability: 0.7,
        estimatedCompletionDate: defaultDate,
        riskFactors: [],
        interventions: ["Maintain regular study schedule"],
      },
      motivationalProfile: {
        primaryDriver: "achievement",
        motivationalTriggers: ["Progress tracking", "Goal achievement"],
        demotivators: ["Unclear objectives", "Lack of feedback"],
        communicationStyle: "encouraging",
        responsePatterns: {
          toSuccess: ["Well done!", "Great progress!"],
          toFailure: ["Try again", "You can do this"],
          toStruggle: ["Take your time", "Break it down"],
        },
      },
    };
  }
}
