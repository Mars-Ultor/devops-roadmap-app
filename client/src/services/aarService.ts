/**
 * After Action Review (AAR) Service
 * Handles AAR validation, AI analysis, and fetching from Firebase Firestore
 */

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type {
  AARFormData,
  AARValidationResult,
  AfterActionReview,
  AARReview,
} from "../types/aar";
import { AAR_REQUIREMENTS } from "../types/aar";

export class AARService {
  private static instance: AARService;

  static getInstance(): AARService {
    if (!AARService.instance) {
      AARService.instance = new AARService();
    }
    return AARService.instance;
  }

  /**
   * Validate AAR form data against requirements
   */
  validateAARForm(formData: AARFormData): AARValidationResult {
    const errors: Record<string, string> = {};
    const wordCounts = {
      whatWasAccomplished: this.countWords(formData.whatWasAccomplished),
      whyDidNotWork: this.countWords(formData.whyDidNotWork),
      whatWouldIDoDifferently: this.countWords(
        formData.whatWouldIDoDifferently,
      ),
      whatDidILearn: this.countWords(formData.whatDidILearn),
    };

    // Validate minimum word counts
    if (
      wordCounts.whatWasAccomplished <
      AAR_REQUIREMENTS.MIN_WORDS_WHAT_ACCOMPLISHED
    ) {
      errors.whatWasAccomplished = `Minimum ${AAR_REQUIREMENTS.MIN_WORDS_WHAT_ACCOMPLISHED} words required (currently ${wordCounts.whatWasAccomplished})`;
    }

    if (wordCounts.whyDidNotWork < AAR_REQUIREMENTS.MIN_WORDS_WHY_NOT_WORK) {
      errors.whyDidNotWork = `Minimum ${AAR_REQUIREMENTS.MIN_WORDS_WHY_NOT_WORK} words required (currently ${wordCounts.whyDidNotWork})`;
    }

    if (
      wordCounts.whatWouldIDoDifferently <
      AAR_REQUIREMENTS.MIN_WORDS_DO_DIFFERENTLY
    ) {
      errors.whatWouldIDoDifferently = `Minimum ${AAR_REQUIREMENTS.MIN_WORDS_DO_DIFFERENTLY} words required (currently ${wordCounts.whatWouldIDoDifferently})`;
    }

    if (wordCounts.whatDidILearn < AAR_REQUIREMENTS.MIN_WORDS_LEARNED) {
      errors.whatDidILearn = `Minimum ${AAR_REQUIREMENTS.MIN_WORDS_LEARNED} words required (currently ${wordCounts.whatDidILearn})`;
    }

    // Validate minimum item counts
    const nonEmptyWorkedWell = formData.whatWorkedWell.filter((item) =>
      item.trim(),
    );
    const nonEmptyDidNotWork = formData.whatDidNotWork.filter((item) =>
      item.trim(),
    );

    if (nonEmptyWorkedWell.length < AAR_REQUIREMENTS.MIN_ITEMS_WORKED_WELL) {
      errors.whatWorkedWell = `Minimum ${AAR_REQUIREMENTS.MIN_ITEMS_WORKED_WELL} items required (currently ${nonEmptyWorkedWell.length})`;
    }

    if (nonEmptyDidNotWork.length < AAR_REQUIREMENTS.MIN_ITEMS_DID_NOT_WORK) {
      errors.whatDidNotWork = `Minimum ${AAR_REQUIREMENTS.MIN_ITEMS_DID_NOT_WORK} items required (currently ${nonEmptyDidNotWork.length})`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      wordCounts,
    };
  }

  /**
   * Generate AI review/insights for an AAR
   */
  generateAIReview(
    formData: AARFormData,
    wordCounts: Record<string, number>,
  ): AARReview {
    const qualityScore = this.calculateQualityScore(formData, wordCounts);
    const feedback = this.generateFeedback(qualityScore);
    const suggestions = this.generateSuggestions(formData, qualityScore);
    const followUpQuestions = this.generateFollowUpQuestions(
      formData,
      qualityScore,
    );

    return {
      reviewedAt: new Date(),
      reviewer: "ai",
      score: qualityScore,
      feedback,
      suggestions,
      followUpQuestions,
    };
  }

  /**
   * Calculate quality score (1-10) based on AAR content
   */
  private calculateQualityScore(
    formData: AARFormData,
    wordCounts: Record<string, number>,
  ): number {
    let score = 5; // Base score

    // Word count quality (up to 2 points)
    const totalWords =
      wordCounts.whatWasAccomplished +
      wordCounts.whyDidNotWork +
      wordCounts.whatWouldIDoDifferently +
      wordCounts.whatDidILearn;

    if (totalWords > 200) score += 2;
    else if (totalWords > 100) score += 1;
    else if (totalWords > 50) score += 0.5;

    // Content depth analysis (up to 2 points)
    const allText =
      `${formData.whatWasAccomplished} ${formData.whyDidNotWork} ${formData.whatWouldIDoDifferently} ${formData.whatDidILearn}`.toLowerCase();

    // Check for specific examples
    const specificIndicators = [
      "command",
      "error",
      "config",
      "file",
      "docker",
      "kubernetes",
      "aws",
      "linux",
      "bash",
      "git",
    ];
    if (specificIndicators.some((ind) => allText.includes(ind))) score += 0.5;

    // Check for root cause analysis
    const rootCauseIndicators = [
      "because",
      "due to",
      "caused by",
      "reason",
      "root cause",
      "misconfigured",
      "missing",
    ];
    if (rootCauseIndicators.some((ind) => allText.includes(ind))) score += 0.8;

    // Check for actionable improvements
    const actionableIndicators = [
      "check",
      "verify",
      "test",
      "validate",
      "use",
      "create",
      "add",
      "review",
      "practice",
    ];
    if (
      actionableIndicators.some((ind) =>
        formData.whatWouldIDoDifferently.toLowerCase().includes(ind),
      )
    )
      score += 0.7;

    // Self-reflection quality (up to 1 point)
    const reflectionIndicators = [
      "learned",
      "understand",
      "realized",
      "important",
      "need to",
      "better",
      "improve",
    ];
    if (
      reflectionIndicators.some((ind) =>
        formData.whatDidILearn.toLowerCase().includes(ind),
      )
    )
      score += 1;

    // List items quality (up to 0.5 points)
    const workedWellItems = formData.whatWorkedWell.filter(
      (item) => item.trim().length > 10,
    ).length;
    const didNotWorkItems = formData.whatDidNotWork.filter(
      (item) => item.trim().length > 10,
    ).length;
    if (workedWellItems >= 3 && didNotWorkItems >= 2) score += 0.5;

    return Math.min(Math.max(Math.round(score * 10) / 10, 1), 10);
  }

  /**
   * Generate feedback based on AAR quality
   */
  private generateFeedback(score: number): string {
    if (score >= 8) {
      return "Excellent reflection! Your AAR demonstrates deep analysis with specific examples and actionable improvements. This level of self-reflection will accelerate your DevOps mastery.";
    } else if (score >= 6) {
      return "Good AAR with solid reflection. Consider adding more specific technical details and concrete action items for even better learning outcomes.";
    } else if (score >= 4) {
      return "Decent start on your reflection. Try to dig deeper into root causes and be more specific about what you'll do differently next time.";
    } else {
      return "Your AAR could benefit from more detail. Focus on specific examples, clear root cause analysis, and actionable next steps.";
    }
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(formData: AARFormData, score: number): string[] {
    const suggestions: string[] = [];

    const wordCounts = {
      whatWasAccomplished: this.countWords(formData.whatWasAccomplished),
      whyDidNotWork: this.countWords(formData.whyDidNotWork),
      whatWouldIDoDifferently: this.countWords(
        formData.whatWouldIDoDifferently,
      ),
      whatDidILearn: this.countWords(formData.whatDidILearn),
    };

    if (wordCounts.whatWasAccomplished < 30) {
      suggestions.push(
        "Add more detail about what you were trying to accomplish and why it matters.",
      );
    }

    if (wordCounts.whyDidNotWork < 20) {
      suggestions.push(
        "Expand on root causes - ask 'why' multiple times to get to the real issue.",
      );
    }

    if (
      !formData.whatWouldIDoDifferently.toLowerCase().includes("will") &&
      !formData.whatWouldIDoDifferently.toLowerCase().includes("next time")
    ) {
      suggestions.push(
        "Frame improvements as concrete future actions: 'Next time I will...'",
      );
    }

    if (wordCounts.whatDidILearn < 20) {
      suggestions.push(
        "Reflect more on transferable knowledge - what principles apply beyond this specific task?",
      );
    }

    if (suggestions.length === 0 && score < 9) {
      suggestions.push(
        "Great work! Consider adding even more technical specifics to maximize learning.",
      );
    }

    return suggestions;
  }

  /**
   * Generate follow-up questions to deepen reflection
   */
  private generateFollowUpQuestions(
    formData: AARFormData,
    score: number,
  ): string[] {
    const allText =
      `${formData.whatWasAccomplished} ${formData.whyDidNotWork}`.toLowerCase();

    // Build questions array based on conditions
    const potentialQuestions = [
      ...(score < 7
        ? [
            "What specific error messages or behaviors did you observe?",
            "How does this lesson connect to your overall DevOps learning goals?",
          ]
        : []),
      ...(allText.includes("docker") || allText.includes("container")
        ? [
            "Have you considered how this Docker knowledge applies to orchestration tools like Kubernetes?",
          ]
        : []),
      ...(allText.includes("error") || allText.includes("fail")
        ? [
            "What monitoring or alerting could help catch similar issues earlier?",
          ]
        : []),
      ...(formData.whatDidILearn.length < 50
        ? [
            "What would you teach someone else about this topic based on your experience?",
          ]
        : []),
    ];

    // Return up to 3 questions
    return potentialQuestions.slice(0, 3);
  }

  /**
   * Count words in a text string (public for use by AdaptiveAARForm)
   */
  countWords(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  /**
   * Get all AARs for a user from Firebase Firestore
   */
  async getUserAARs(userId: string): Promise<AfterActionReview[]> {
    try {
      const aarsRef = collection(db, "afterActionReviews");
      const q = query(
        aarsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          lessonId: data.lessonId,
          level: data.level,
          labId: data.labId,
          completedAt:
            data.completedAt instanceof Timestamp
              ? data.completedAt.toDate()
              : new Date(data.completedAt),
          whatWasAccomplished: data.whatWasAccomplished,
          whatWorkedWell: data.whatWorkedWell || [],
          whatDidNotWork: data.whatDidNotWork || [],
          whyDidNotWork: data.whyDidNotWork,
          whatWouldIDoDifferently: data.whatWouldIDoDifferently,
          whatDidILearn: data.whatDidILearn,
          wordCounts: data.wordCounts,
          qualityScore: data.qualityScore,
          aiReview: data.aiReview,
          patterns: data.patterns,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(data.createdAt),
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate()
              : new Date(data.updatedAt),
        } as AfterActionReview;
      });
    } catch (error) {
      console.error("Error fetching AARs from Firestore:", error);
      return [];
    }
  }
}

export const aarService = AARService.getInstance();
