import { PrismaClient, Prisma } from '@prisma/client';
import type {
  AfterActionReview,
  AARFormData,
  AARValidationResult,
  AARStats,
  AARPattern
} from '../types/aar';
import { AAR_REQUIREMENTS } from '../types/aar';

const prisma = new PrismaClient();

export class AARService {
  /**
   * Validate AAR form data against requirements
   */
  async validateAARForm(formData: AARFormData): Promise<AARValidationResult> {
    const errors: Record<string, string> = {};
    const wordCounts = {
      whatWasAccomplished: this.countWords(formData.whatWasAccomplished),
      whyDidNotWork: this.countWords(formData.whyDidNotWork),
      whatWouldIDoDifferently: this.countWords(formData.whatWouldIDoDifferently),
      whatDidILearn: this.countWords(formData.whatDidILearn)
    };

    // Validate minimum word counts
    if (wordCounts.whatWasAccomplished < AAR_REQUIREMENTS.MIN_WORDS_WHAT_ACCOMPLISHED) {
      errors.whatWasAccomplished = `Minimum ${AAR_REQUIREMENTS.MIN_WORDS_WHAT_ACCOMPLISHED} words required (currently ${wordCounts.whatWasAccomplished})`;
    }

    if (wordCounts.whyDidNotWork < AAR_REQUIREMENTS.MIN_WORDS_WHY_NOT_WORK) {
      errors.whyDidNotWork = `Minimum ${AAR_REQUIREMENTS.MIN_WORDS_WHY_NOT_WORK} words required (currently ${wordCounts.whyDidNotWork})`;
    }

    if (wordCounts.whatWouldIDoDifferently < AAR_REQUIREMENTS.MIN_WORDS_DO_DIFFERENTLY) {
      errors.whatWouldIDoDifferently = `Minimum ${AAR_REQUIREMENTS.MIN_WORDS_DO_DIFFERENTLY} words required (currently ${wordCounts.whatWouldIDoDifferently})`;
    }

    if (wordCounts.whatDidILearn < AAR_REQUIREMENTS.MIN_WORDS_LEARNED) {
      errors.whatDidILearn = `Minimum ${AAR_REQUIREMENTS.MIN_WORDS_LEARNED} words required (currently ${wordCounts.whatDidILearn})`;
    }

    // Validate minimum item counts
    if (formData.whatWorkedWell.length < AAR_REQUIREMENTS.MIN_ITEMS_WORKED_WELL) {
      errors.whatWorkedWell = `Minimum ${AAR_REQUIREMENTS.MIN_ITEMS_WORKED_WELL} items required (currently ${formData.whatWorkedWell.length})`;
    }

    if (formData.whatDidNotWork.length < AAR_REQUIREMENTS.MIN_ITEMS_DID_NOT_WORK) {
      errors.whatDidNotWork = `Minimum ${AAR_REQUIREMENTS.MIN_ITEMS_DID_NOT_WORK} items required (currently ${formData.whatDidNotWork.length})`;
    }

    // Check for empty items
    if (formData.whatWorkedWell.some((item: string) => !item.trim())) {
      errors.whatWorkedWell = 'All items must have content';
    }

    if (formData.whatDidNotWork.some((item: string) => !item.trim())) {
      errors.whatDidNotWork = 'All items must have content';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      wordCounts
    };
  }

  /**
   * Create and save a new AAR
   */
  async createAAR(aarData: {
    userId: string;
    lessonId: string;
    level: 'crawl' | 'walk' | 'run-guided' | 'run-independent';
    labId: string;
    whatWasAccomplished: string;
    whatWorkedWell: string[];
    whatDidNotWork: string[];
    whyDidNotWork: string;
    whatWouldIDoDifferently: string;
    whatDidILearn: string;
  }): Promise<AfterActionReview> {
    const validation = await this.validateAARForm({
      whatWasAccomplished: aarData.whatWasAccomplished,
      whatWorkedWell: aarData.whatWorkedWell,
      whatDidNotWork: aarData.whatDidNotWork,
      whyDidNotWork: aarData.whyDidNotWork,
      whatWouldIDoDifferently: aarData.whatWouldIDoDifferently,
      whatDidILearn: aarData.whatDidILearn
    });

    if (!validation.isValid) {
      throw new Error('AAR form validation failed: ' + Object.values(validation.errors).join(', '));
    }

    const now = new Date();

    const aar = await prisma.afterActionReview.create({
      data: {
        userId: aarData.userId,
        lessonId: aarData.lessonId,
        level: aarData.level,
        labId: aarData.labId,
        completedAt: now,
        whatWasAccomplished: aarData.whatWasAccomplished,
        whatWorkedWell: aarData.whatWorkedWell,
        whatDidNotWork: aarData.whatDidNotWork,
        whyDidNotWork: aarData.whyDidNotWork,
        whatWouldIDoDifferently: aarData.whatWouldIDoDifferently,
        whatDidILearn: aarData.whatDidILearn,
        wordCounts: validation.wordCounts,
        createdAt: now,
        updatedAt: now
      }
    });

    // Trigger AI analysis (async)
    this.analyzeAAR(aar.id, aar).catch(console.error);

    return this.transformPrismaAAR(aar);
  }

  /**
   * Get AARs for a specific user
   */
  async getUserAARs(userId: string, limit?: number): Promise<AfterActionReview[]> {
    const aars = await prisma.afterActionReview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return aars.map(this.transformPrismaAAR);
  }

  /**
   * Get AARs for a specific lesson
   */
  async getLessonAARs(userId: string, lessonId: string): Promise<AfterActionReview[]> {
    const aars = await prisma.afterActionReview.findMany({
      where: {
        userId,
        lessonId
      },
      orderBy: { createdAt: 'desc' }
    });

    return aars.map(this.transformPrismaAAR);
  }

  /**
   * Get a specific AAR by ID
   */
  async getAARById(aarId: string, userId: string): Promise<AfterActionReview | null> {
    const aar = await prisma.afterActionReview.findFirst({
      where: {
        id: aarId,
        userId
      }
    });

    return aar ? this.transformPrismaAAR(aar) : null;
  }

  /**
   * Update an existing AAR
   */
  async updateAAR(aarId: string, userId: string, updateData: Partial<AARFormData>): Promise<AfterActionReview | null> {
    try {
      const existingAAR = await prisma.afterActionReview.findFirst({
        where: {
          id: aarId,
          userId
        }
      });

      if (!existingAAR) {
        return null;
      }

      const updatedData: any = {
        ...updateData,
        updatedAt: new Date()
      };

      // Recalculate word counts if content changed
      if (updateData.whatWasAccomplished || updateData.whyDidNotWork ||
          updateData.whatWouldIDoDifferently || updateData.whatDidILearn) {
        const formData = {
          whatWasAccomplished: updateData.whatWasAccomplished || existingAAR.whatWasAccomplished,
          whatWorkedWell: updateData.whatWorkedWell || (existingAAR.whatWorkedWell as string[]),
          whatDidNotWork: updateData.whatDidNotWork || (existingAAR.whatDidNotWork as string[]),
          whyDidNotWork: updateData.whyDidNotWork || existingAAR.whyDidNotWork,
          whatWouldIDoDifferently: updateData.whatWouldIDoDifferently || existingAAR.whatWouldIDoDifferently,
          whatDidILearn: updateData.whatDidILearn || existingAAR.whatDidILearn
        };

        const validation = await this.validateAARForm(formData);
        updatedData.wordCounts = validation.wordCounts;
      }

      const aar = await prisma.afterActionReview.update({
        where: { id: aarId },
        data: updatedData
      });

      // Re-analyze if content changed
      if (Object.keys(updateData).length > 0) {
        this.analyzeAAR(aar.id, aar).catch(console.error);
      }

      return this.transformPrismaAAR(aar);
    } catch (error) {
      console.error('Error updating AAR:', error);
      return null;
    }
  }

  /**
   * Delete an AAR
   */
  async deleteAAR(aarId: string, userId: string): Promise<boolean> {
    try {
      const result = await prisma.afterActionReview.deleteMany({
        where: {
          id: aarId,
          userId
        }
      });

      return result.count > 0;
    } catch (error) {
      console.error('Error deleting AAR:', error);
      return false;
    }
  }

  /**
   * Get AAR statistics for a user
   */
  async getUserAARStats(userId: string): Promise<AARStats> {
    const aars = await this.getUserAARs(userId);

    if (aars.length === 0) {
      return {
        totalAARs: 0,
        averageQualityScore: 0,
        commonPatterns: [],
        improvementTrends: [],
        strengths: [],
        areasForImprovement: []
      };
    }

    // Analyze patterns
    const patterns = this.analyzePatterns(aars);

    return {
      totalAARs: aars.length,
      averageQualityScore: aars
        .filter(aar => aar.aiReview?.score)
        .reduce((sum, aar) => sum + (aar.aiReview?.score || 0), 0) / aars.length,
      commonPatterns: patterns,
      improvementTrends: this.calculateImprovementTrends(aars),
      strengths: this.extractStrengths(aars),
      areasForImprovement: this.extractAreasForImprovement(aars)
    };
  }

  /**
   * Get common patterns across user's AARs
   */
  async getCommonPatterns(userId: string, minFrequency: number = 2): Promise<AARPattern[]> {
    const aars = await this.getUserAARs(userId);
    const patterns = this.analyzePatterns(aars);
    return patterns.filter(pattern => pattern.frequency >= minFrequency);
  }

  /**
   * AI-powered AAR analysis (enhanced implementation)
   */
  private async analyzeAAR(aarId: string, aar: any): Promise<void> {
    // Enhanced quality assessment
    const qualityScore = this.calculateAARQuality(aar);
    const patterns: AARPattern[] = [];

    // Advanced pattern detection
    patterns.push(...this.detectAdvancedPatterns(aar));

    // Generate detailed feedback based on quality
    const aiReview = {
      reviewedAt: new Date(),
      reviewer: 'ai' as const,
      score: qualityScore,
      feedback: this.generateDetailedFeedback(aar, qualityScore),
      suggestions: this.generatePersonalizedSuggestions(aar, qualityScore),
      followUpQuestions: this.generateFollowUpQuestions(aar, qualityScore)
    };

    // Update the AAR with enhanced analysis
    await prisma.afterActionReview.update({
      where: { id: aarId },
      data: {
        aiReview,
        patterns: patterns as unknown as Prisma.InputJsonValue,
        qualityScore,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Calculate comprehensive AAR quality score (1-10)
   */
  private calculateAARQuality(aar: any): number {
    let score = 5; // Base score

    // Word count quality (up to 2 points)
    const totalWords = aar.wordCounts.whatWasAccomplished +
                      aar.wordCounts.whyDidNotWork +
                      aar.wordCounts.whatWouldIDoDifferently +
                      aar.wordCounts.whatDidILearn;

    if (totalWords > 200) score += 2;
    else if (totalWords > 100) score += 1;

    // Content depth analysis (up to 2 points)
    const hasSpecificExamples = this.hasSpecificExamples(aar);
    const hasRootCauseAnalysis = this.hasRootCauseAnalysis(aar);
    const hasActionableImprovements = this.hasActionableImprovements(aar);

    if (hasSpecificExamples) score += 0.5;
    if (hasRootCauseAnalysis) score += 0.8;
    if (hasActionableImprovements) score += 0.7;

    // Self-reflection quality (up to 1 point)
    if (this.hasSelfReflection(aar)) score += 1;

    // Balance check (up to 0.5 points)
    const balanceRatio = this.calculateBalanceRatio(aar);
    if (balanceRatio > 0.7) score += 0.5;

    return Math.min(Math.max(score, 1), 10);
  }

  private hasSpecificExamples(aar: any): boolean {
    const text = `${aar.whatWasAccomplished} ${aar.whyDidNotWork} ${aar.whatWouldIDoDifferently}`;
    const specificIndicators = [
      'command', 'error', 'config', 'file', 'port', 'version',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp',
      '--', 'sudo', 'chmod', 'chown'
    ];
    return specificIndicators.some(indicator =>
      text.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  private hasRootCauseAnalysis(aar: any): boolean {
    const text = aar.whyDidNotWork.toLowerCase();
    const rootCauseIndicators = [
      'because', 'due to', 'caused by', 'reason', 'root cause',
      'misconfigured', 'missing', 'incorrect', 'wrong',
      'should have', 'forgot to', 'didn\'t'
    ];
    return rootCauseIndicators.some(indicator => text.includes(indicator));
  }

  private hasActionableImprovements(aar: any): boolean {
    const text = aar.whatWouldIDoDifferently.toLowerCase();
    const actionableIndicators = [
      'check', 'verify', 'test', 'validate', 'use',
      'create', 'add', 'remove', 'update', 'configure',
      'read', 'review', 'practice', 'learn'
    ];
    return actionableIndicators.some(indicator => text.includes(indicator));
  }

  private hasSelfReflection(aar: any): boolean {
    const text = aar.whatDidILearn.toLowerCase();
    const reflectionIndicators = [
      'learned', 'understand', 'realized', 'important',
      'need to', 'should', 'better', 'improve',
      'next time', 'going forward'
    ];
    return reflectionIndicators.some(indicator => text.includes(indicator));
  }

  private calculateBalanceRatio(aar: any): number {
    const positiveWords = aar.whatWorkedWell.length;
    const negativeWords = aar.whatDidNotWork.length;
    const total = positiveWords + negativeWords;
    if (total === 0) return 0;

    // Ideal balance is roughly 40% positive, 60% negative
    const positiveRatio = positiveWords / total;
    return 1 - Math.abs(positiveRatio - 0.4);
  }

  private detectAdvancedPatterns(aar: any): AARPattern[] {
    const patterns: AARPattern[] = [];
    const fullText = `${aar.whatWasAccomplished} ${aar.whatWorkedWell.join(' ')} ${aar.whatDidNotWork.join(' ')} ${aar.whyDidNotWork} ${aar.whatWouldIDoDifferently} ${aar.whatDidILearn}`.toLowerCase();

    // Technical skill gaps
    if (fullText.includes('docker') && (fullText.includes('volume') || fullText.includes('network'))) {
      patterns.push({
        patternId: 'docker-advanced-concepts',
        type: 'skill_gap',
        description: 'Struggling with advanced Docker concepts (volumes/networking)',
        frequency: 1,
        relatedLessons: [aar.lessonId],
        recommendation: 'Focus on Docker networking and persistent storage patterns',
        confidence: 0.85
      });
    }

    // Process issues
    if (fullText.includes('time') && fullText.includes('ran out')) {
      patterns.push({
        patternId: 'time-management',
        type: 'process_issue',
        description: 'Time management challenges during exercises',
        frequency: 1,
        relatedLessons: [aar.lessonId],
        recommendation: 'Break complex tasks into smaller, time-boxed steps',
        confidence: 0.9
      });
    }

    // Documentation habits
    if (fullText.includes('documentation') || fullText.includes('docs')) {
      patterns.push({
        patternId: 'documentation-awareness',
        type: 'strength',
        description: 'Growing awareness of documentation importance',
        frequency: 1,
        relatedLessons: [aar.lessonId],
        recommendation: 'Continue building documentation-first habits',
        confidence: 0.8
      });
    }

    return patterns;
  }

  private generateDetailedFeedback(aar: any, score: number): string {
    if (score >= 9) {
      return 'Excellent AAR! Your analysis shows deep understanding and actionable insights. This level of reflection will accelerate your learning significantly.';
    } else if (score >= 7) {
      return 'Good AAR with solid analysis. You\'ve identified key issues and potential improvements. Consider adding more specific examples next time.';
    } else if (score >= 5) {
      return 'Decent AAR that covers the basics. Try to be more specific about what went wrong and why, and focus on actionable improvements.';
    } else {
      return 'This AAR needs more depth. Focus on specific problems encountered, their root causes, and concrete steps for improvement.';
    }
  }

  private generatePersonalizedSuggestions(aar: any, score: number): string[] {
    const suggestions: string[] = [];

    if (!this.hasSpecificExamples(aar)) {
      suggestions.push('Include specific commands, error messages, or configurations that caused issues');
    }

    if (!this.hasRootCauseAnalysis(aar)) {
      suggestions.push('Analyze why problems occurred - go beyond "it didn\'t work" to identify root causes');
    }

    if (!this.hasActionableImprovements(aar)) {
      suggestions.push('Suggest specific, actionable changes you can implement next time');
    }

    if (score < 7) {
      suggestions.push('Take more time to reflect deeply on each question before submitting');
    }

    if (this.calculateBalanceRatio(aar) < 0.5) {
      suggestions.push('Balance your analysis between what worked and what didn\'t work');
    }

    return suggestions.length > 0 ? suggestions : ['Keep up the good work! Your AAR shows thoughtful analysis.'];
  }

  private generateFollowUpQuestions(aar: any, score: number): string[] {
    const questions: string[] = [];

    if (score < 8) {
      questions.push('What specific error messages or symptoms did you encounter?');
      questions.push('How might you test your solution before implementing it in production?');
    }

    questions.push('How does this experience change how you\'ll approach similar tasks in the future?');
    questions.push('What resources (documentation, tools, people) could help you avoid this issue next time?');

    return questions;
  }

  /**
   * Analyze patterns across multiple AARs
   */
  private analyzePatterns(aars: AfterActionReview[]): AARPattern[] {
    const patternCounts: Record<string, number> = {};

    aars.forEach(aar => {
      // Simple keyword-based pattern detection
      const text = `${aar.whyDidNotWork} ${aar.whatDidILearn}`.toLowerCase();

      if (text.includes('docker') && text.includes('error')) {
        patternCounts['docker-issues'] = (patternCounts['docker-issues'] || 0) + 1;
      }
      if (text.includes('kubernetes') || text.includes('k8s')) {
        patternCounts['k8s-complexity'] = (patternCounts['k8s-complexity'] || 0) + 1;
      }
      if (text.includes('network') || text.includes('connection')) {
        patternCounts['networking-problems'] = (patternCounts['networking-problems'] || 0) + 1;
      }
    });

    return Object.entries(patternCounts)
      .filter(([, count]) => count >= 2)
      .map(([patternId, frequency]) => ({
        patternId,
        type: 'recurring_issue' as const,
        description: this.getPatternDescription(patternId),
        frequency,
        relatedLessons: aars.map(a => a.lessonId),
        recommendation: this.getPatternRecommendation(patternId),
        confidence: Math.min(frequency / aars.length, 0.9)
      }));
  }

  private calculateImprovementTrends(aars: AfterActionReview[]): AARStats['improvementTrends'] {
    // Simplified trend analysis - in real implementation, use time-series analysis
    return [
      {
        category: 'Problem Solving',
        trend: 'improving' as const,
        dataPoints: [3, 4, 5, 6, 7] // Mock data
      }
    ];
  }

  private extractStrengths(aars: AfterActionReview[]): string[] {
    const strengths: string[] = [];
    aars.forEach(aar => {
      if (aar.whatWorkedWell.some((item: string) => item.toLowerCase().includes('planning'))) {
        strengths.push('Strategic Planning');
      }
      if (aar.whatWorkedWell.some((item: string) => item.toLowerCase().includes('documentation'))) {
        strengths.push('Documentation');
      }
    });
    return [...new Set(strengths)];
  }

  private extractAreasForImprovement(aars: AfterActionReview[]): string[] {
    const improvements: string[] = [];
    aars.forEach(aar => {
      if (aar.whatDidNotWork.some((item: string) => item.toLowerCase().includes('time'))) {
        improvements.push('Time Management');
      }
      if (aar.whyDidNotWork.toLowerCase().includes('understanding')) {
        improvements.push('Requirements Analysis');
      }
    });
    return [...new Set(improvements)];
  }

  private getPatternDescription(patternId: string): string {
    const descriptions: Record<string, string> = {
      'docker-issues': 'Recurring Docker configuration and runtime issues',
      'k8s-complexity': 'Challenges with Kubernetes complexity',
      'networking-problems': 'Frequent networking and connectivity issues'
    };
    return descriptions[patternId] || 'Unknown pattern';
  }

  private getPatternRecommendation(patternId: string): string {
    const recommendations: Record<string, string> = {
      'docker-issues': 'Create a Docker troubleshooting checklist and review container basics',
      'k8s-complexity': 'Focus on understanding Kubernetes fundamentals before advanced features',
      'networking-problems': 'Build a systematic network debugging methodology'
    };
    return recommendations[patternId] || 'Review related documentation and practice fundamentals';
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Transform Prisma AAR to client-side AAR format
   */
  private transformPrismaAAR(prismaAAR: any): AfterActionReview {
    return {
      id: prismaAAR.id,
      userId: prismaAAR.userId,
      lessonId: prismaAAR.lessonId,
      level: prismaAAR.level,
      labId: prismaAAR.labId,
      completedAt: prismaAAR.completedAt,
      whatWasAccomplished: prismaAAR.whatWasAccomplished,
      whatWorkedWell: prismaAAR.whatWorkedWell,
      whatDidNotWork: prismaAAR.whatDidNotWork,
      whyDidNotWork: prismaAAR.whyDidNotWork,
      whatWouldIDoDifferently: prismaAAR.whatWouldIDoDifferently,
      whatDidILearn: prismaAAR.whatDidILearn,
      wordCounts: prismaAAR.wordCounts,
      aiReview: prismaAAR.aiReview,
      patterns: prismaAAR.patterns,
      createdAt: prismaAAR.createdAt,
      updatedAt: prismaAAR.updatedAt
    };
  }
}