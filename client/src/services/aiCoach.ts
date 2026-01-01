

export interface CoachFeedback {
  type: 'encouragement' | 'hint' | 'warning' | 'insight' | 'question';
  message: string;
  confidence: number; // 0-1
  context?: string;
  mode?: 'instructor' | 'peer' | 'independent';
}

export interface CoachContext {
  contentType: 'lesson' | 'lab' | 'drill' | 'struggle_session';
  contentId: string;
  userProgress: {
    attempts: number;
    timeSpent: number;
    hintsUsed: number;
    struggledFor?: number;
    successRate?: number;
    streakCount?: number;
  };
  currentIssue?: string;
  recentErrors?: string[];
  masteryLevel?: 'novice' | 'intermediate' | 'advanced' | 'expert';
  currentWeek?: number;
  commandExecuted?: string;
  errorEncountered?: string;
  codeSnippet?: string;
  struggleSession?: {
    timeRemaining: number;
    logsSubmitted: number;
    hintsAvailable: number;
  };
  performanceMetrics?: {
    accuracy: number;
    speed: number;
    persistence: number;
    learningVelocity: number;
  };
}

export type CoachMode = 'instructor' | 'peer' | 'independent';


export function getCoachMode(week: number): CoachMode {
  if (week <= 4) return 'instructor';
  if (week <= 8) return 'peer';
  return 'independent';
}


export async function getCoachFeedback(context: CoachContext): Promise<CoachFeedback> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mode = getCoachMode(context.currentWeek || 1);
  const { userProgress, recentErrors } = context;

  // Detect patterns and generate appropriate feedback based on mode
  
  // INSTRUCTOR MODE (Weeks 1-4): Detailed guidance, step-by-step help
  if (mode === 'instructor') {
    if (userProgress.timeSpent > 1800 && userProgress.hintsUsed === 0) {
      return {
        type: 'hint',
        message: "You've been working on this for 30 minutes without hints. Let me guide you through this step-by-step. What specifically are you trying to accomplish right now?",
        confidence: 0.9,
        context: 'prolonged_struggle',
        mode
      };
    }

    if (userProgress.attempts > 3) {
      return {
        type: 'insight',
        message: "I see you've tried this several times. Let's break it down: First, check your syntax. Second, verify the file paths. Third, make sure services are running. Which step would you like help with?",
        confidence: 0.85,
        context: 'multiple_failures',
        mode
      };
    }

    if (recentErrors && recentErrors.length > 0) {
      return {
        type: 'hint',
        message: `I noticed this error: "${recentErrors[0]}". This usually means there's a problem with your configuration. Let me show you how to debug this...`,
        confidence: 0.95,
        context: 'error_guidance',
        mode
      };
    }

    return {
      type: 'encouragement',
      message: "You're doing great! Take your time to understand each step. I'm here to help if you need detailed explanations.",
      confidence: 0.8,
      mode
    };
  }

  // PEER MODE (Weeks 5-8): Asks clarifying questions, minimal direct help
  if (mode === 'peer') {
    if (userProgress.timeSpent > 1800 && userProgress.hintsUsed === 0) {
      return {
        type: 'question',
        message: "You've been stuck for a while. Have you checked the error logs? What does the output tell you? Talk me through what you've tried so far.",
        confidence: 0.85,
        context: 'socratic_questioning',
        mode
      };
    }

    if (userProgress.attempts > 3) {
      return {
        type: 'question',
        message: "I see this isn't working. What's different between your approach and what the documentation shows? Have you verified each step executes successfully?",
        confidence: 0.8,
        context: 'peer_reflection',
        mode
      };
    }

    if (recentErrors && recentErrors.length > 0) {
      return {
        type: 'question',
        message: `Interesting error. What do you think caused it? If you were explaining this to someone else, how would you describe the problem?`,
        confidence: 0.85,
        context: 'error_reflection',
        mode
      };
    }

    return {
      type: 'encouragement',
      message: "Keep pushing through! You're building problem-solving skills. Think about what you've learned from previous labs.",
      confidence: 0.75,
      mode
    };
  }

  // INDEPENDENT MODE (Weeks 9-12): Only responds when explicitly asked, user must solve independently
  if (mode === 'independent') {
    if (userProgress.timeSpent > 3600) { // Only help after 1 hour
      return {
        type: 'insight',
        message: "You've been working independently for an hour. That's the right mindset. If you're truly stuck, try writing down exactly what you're trying to do, what's happening, and what you expected. Often that reveals the issue.",
        confidence: 0.7,
        context: 'minimal_guidance',
        mode
      };
    }

    if (userProgress.hintsUsed > 0) {
      return {
        type: 'question',
        message: "At this stage, you should be solving this independently. What resources haven't you checked yet? What debugging steps remain?",
        confidence: 0.75,
        context: 'independence_reminder',
        mode
      };
    }

    // Minimal encouragement only
    return {
      type: 'encouragement',
      message: "You're in independent mode. Trust your training. You have the skills to solve this.",
      confidence: 0.6,
      mode
    };
  }

  // Default fallback
  return {
    type: 'encouragement',
    message: "Keep going! You're making progress.",
    confidence: 0.5,
    mode
  };
}
  

export async function reviewAAR(aar: {
  objective: string;
  whatWorked: string[];
  whatDidntWork: string[];
  rootCauses: string[];
  improvements: string[];
  transferableKnowledge: string;
}): Promise<{ questions: string[]; insights: string[] }> {
  // Simulate AI review
  await new Promise(resolve => setTimeout(resolve, 800));

  const questions = generateAARQuestions(aar);
  const insights = generateAARInsights(aar);

  return { questions, insights };
}


export async function analyzeStruggleSession(session: {
  timeSpent: number;
  attemptedSolutions: string[];
  stuckLocation: string;
  hypothesis: string;
}): Promise<CoachFeedback> {
  await new Promise(resolve => setTimeout(resolve, 600));

  if (session.timeSpent > 1800) { // 30+ minutes
    return {
      type: 'encouragement',
      message: 'Outstanding endurance! You\'ve shown great persistence through this struggle. That mental toughness is what separates good engineers from great ones.',
      confidence: 0.9
    };
  }

  if (session.attemptedSolutions.length >= 5) {
    return {
      type: 'insight',
      message: 'You\'ve tried many approaches - this shows good problem-solving initiative. Consider stepping back and reviewing the fundamentals. Sometimes the solution is simpler than we think.',
      confidence: 0.8
    };
  }

  return {
    type: 'hint',
    message: 'Your hypothesis shows good analytical thinking. Try breaking the problem into smaller, testable pieces.',
    confidence: 0.7
  };
}

// Helper functions for AAR analysis
function generateAARQuestions(aar: {
  objective: string;
  whatWorked: string[];
  whatDidntWork: string[];
  rootCauses: string[];
  improvements: string[];
  transferableKnowledge: string;
}): string[] {
  const questions: string[] = [];
  
  if (aar.rootCauses.length === 0) {
    questions.push("You haven't identified root causes. Dig deeper - what systemic issues led to the problems?");
  }
  
  if (aar.transferableKnowledge.length < 50) {
    questions.push("How can you apply what you learned to other scenarios? What patterns emerged?");
  }
  
  if (aar.improvements.length === 0) {
    questions.push("What specific actions will you take differently next time?");
  }
  
  return questions;
}

function generateAARInsights(aar: {
  objective: string;
  whatWorked: string[];
  whatDidntWork: string[];
  rootCauses: string[];
  improvements: string[];
  transferableKnowledge: string;
}): string[] {
  const insights: string[] = [];
  
  if (aar.whatWorked.length > aar.whatDidntWork.length) {
    insights.push("Your approach was mostly solid. Focus on refining the areas that didn't work.");
  }
  
  if (aar.rootCauses.some(rc => rc.toLowerCase().includes('documentation'))) {
    insights.push("Documentation issues are common. Always verify official docs match your environment.");
  }
  
  return insights;
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

