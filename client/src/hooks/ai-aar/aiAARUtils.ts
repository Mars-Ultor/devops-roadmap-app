/**
 * AI AAR Enhancement Utilities
 * Helper functions for detecting vague AAR responses
 */

interface VaguenessDetection {
  isVague: boolean;
  reason: string;
  followUpQuestions: string[];
  suggestedImprovement: string;
}

type ResponseContext = "what-happened" | "what-learned" | "what-change";

/** Vague phrase patterns */
const VAGUE_PATTERNS = [
  /it (didn't|did not|doesnt|does not) work/i,
  /something (went )?wrong/i,
  /had (an|some)? error/i,
  /it broke/i,
  /not sure/i,
  /i (don't|dont) know/i,
  /confused/i,
  /didn't understand/i,
];

/** Specific technical patterns */
const SPECIFIC_PATTERNS = [
  /\d+/,
  /[A-Z]{2,}/,
  /error|exception|warning|failed|refused|denied|timeout/i,
  /port|address|connection|network|disk|memory|cpu/i,
  /docker|kubernetes|nginx|redis|postgres|mysql/i,
  /\.js|\.py|\.sh|\.yml|\.json|\.conf/i,
  /http|https|ssh|tcp|udp/i,
];

/** Check for specific technical details */
export function hasSpecificDetails(response: string): boolean {
  return SPECIFIC_PATTERNS.some((pattern) => pattern.test(response));
}

/** Follow-up question library */
const FOLLOW_UP_QUESTIONS: Record<string, string[]> = {
  "what-happened-too-short": [
    "What command or action did you perform?",
    "What error message appeared?",
    "At what step did the failure occur?",
    "What was the system's response?",
  ],
  "what-happened-generic": [
    "What was the EXACT error message?",
    "Which command produced the error?",
    "What was the exit code or status?",
    "What did the logs show?",
  ],
  "what-learned-too-short": [
    "Why did this happen?",
    "What was the root cause?",
    "What concept did you misunderstand?",
    "What will you remember from this?",
  ],
  "what-learned-generic": [
    "What was the underlying cause?",
    "What technical concept did you learn?",
    "How does this technology actually work?",
    "What did debugging teach you?",
  ],
  "what-change-too-short": [
    "What will you do differently next time?",
    "What specific action will you take?",
    "How will you prevent this?",
    "What process will you change?",
  ],
  "what-change-generic": [
    "What is your specific action plan?",
    "What habit will you build?",
    "What documentation will you create?",
    "What verification step will you add?",
  ],
};

export function getFollowUpQuestions(context: string, issue: string): string[] {
  return FOLLOW_UP_QUESTIONS[`${context}-${issue}`] || [];
}

/** Improvement suggestions */
const IMPROVEMENT_SUGGESTIONS: Record<string, string> = {
  "what-happened":
    "Be specific: include the exact command, error message, exit code, and relevant log output.",
  "what-learned":
    "Explain the ROOT CAUSE: Why did it happen? What concept do you now understand?",
  "what-change":
    "Define a CONCRETE action: What specific step will you take to prevent this next time?",
};

export function getImprovementSuggestion(context: string): string {
  return (
    IMPROVEMENT_SUGGESTIONS[context] ||
    "Provide more specific, actionable details."
  );
}

/** Check if response is too short */
export function checkTooShort(response: string): VaguenessDetection | null {
  const wordCount = response.trim().split(/\s+/).length;
  if (wordCount < 10) {
    return {
      isVague: true,
      reason: "Response is too brief",
      followUpQuestions: [],
      suggestedImprovement: "Provide at least 10 words with specific details.",
    };
  }
  return null;
}

/** Check for vague patterns */
export function checkVaguePatterns(
  response: string,
  context: ResponseContext,
): VaguenessDetection | null {
  const normalized = response.trim().toLowerCase();
  const hasVague = VAGUE_PATTERNS.some((p) => p.test(normalized));
  if (hasVague && !hasSpecificDetails(response)) {
    return {
      isVague: true,
      reason: "Response lacks specific details",
      followUpQuestions: getFollowUpQuestions(context, "generic"),
      suggestedImprovement: getImprovementSuggestion(context),
    };
  }
  return null;
}

/** Check what-happened for technical details */
export function checkWhatHappenedTechnical(
  response: string,
): VaguenessDetection | null {
  const hasTech =
    /error|exception|status|code|message|line|file|command|output|log/i.test(
      response,
    );
  const hasCode = /\d{3,4}/.test(response);
  if (!hasTech && !hasCode) {
    return {
      isVague: true,
      reason: "Missing technical details",
      followUpQuestions: [
        "What was the exact error message?",
        "What command did you run?",
        "What was the exit/status code?",
        "What did the logs show?",
      ],
      suggestedImprovement:
        "Include: exact error message, command you ran, error codes, and relevant log output.",
    };
  }
  return null;
}

/** Check what-learned for insights */
export function checkWhatLearnedInsight(
  response: string,
): VaguenessDetection | null {
  const hasInsight =
    /because|caused by|due to|reason|root cause|understand|learned|realize/i.test(
      response,
    );
  if (!hasInsight) {
    return {
      isVague: true,
      reason: "No clear learning or insight explained",
      followUpQuestions: [
        "Why did this problem occur?",
        "What was the root cause?",
        "What concept did you misunderstand?",
        "What did you learn from debugging?",
      ],
      suggestedImprovement:
        "Explain WHY the problem happened and what concept you now understand better.",
    };
  }
  return null;
}

/** Check what-change for action plan */
export function checkWhatChangeAction(
  response: string,
): VaguenessDetection | null {
  const hasPlan =
    /will|should|need to|going to|plan to|next time|in future/i.test(response);
  const hasVerb =
    /check|verify|test|review|read|practice|document|remember/i.test(response);
  if (!hasPlan || !hasVerb) {
    return {
      isVague: true,
      reason: "No specific action plan",
      followUpQuestions: [
        "What specific action will you take next time?",
        "What will you do differently?",
        "How will you prevent this mistake?",
        "What habit or process will you change?",
      ],
      suggestedImprovement:
        "Describe a specific, actionable change you'll make to prevent this issue.",
    };
  }
  return null;
}
