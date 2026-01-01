/**
 * AI AAR Enhancement Hook
 * Detects vague responses and requires meaningful reflection
 */

import { useState } from 'react';

interface VaguenessDetection {
  isVague: boolean;
  reason: string;
  followUpQuestions: string[];
  suggestedImprovement: string;
}

export function useAIAAREnhancement() {
  const [detectedVagueness, setDetectedVagueness] = useState<VaguenessDetection | null>(null);

  /**
   * Analyze AAR response for vagueness and lack of specificity
   */
  const analyzeResponse = (response: string, context: 'what-happened' | 'what-learned' | 'what-change'): VaguenessDetection | null => {
    const normalized = response.trim().toLowerCase();
    const wordCount = response.trim().split(/\s+/).length;

    // Too short
    if (wordCount < 10) {
      return {
        isVague: true,
        reason: 'Response is too brief',
        followUpQuestions: getFollowUpQuestions(context, 'too-short'),
        suggestedImprovement: 'Provide at least 10 words with specific details about what happened, what you learned, or what you\'ll change.'
      };
    }

    // Generic/vague phrases
    const vaguePatterns = [
      /it (didn't|did not|doesnt|does not) work/i,
      /something (went )?wrong/i,
      /had (an|some)? error/i,
      /it broke/i,
      /not sure/i,
      /i (don't|dont) know/i,
      /confused/i,
      /didn't understand/i
    ];

    const hasVaguePattern = vaguePatterns.some(pattern => pattern.test(normalized));

    if (hasVaguePattern && !hasSpecificDetails(response)) {
      return {
        isVague: true,
        reason: 'Response lacks specific details',
        followUpQuestions: getFollowUpQuestions(context, 'generic'),
        suggestedImprovement: getImprovementSuggestion(context)
      };
    }

    // No technical details for "what happened"
    if (context === 'what-happened') {
      const hasTechnicalDetails = /error|exception|status|code|message|line|file|command|output|log/i.test(response);
      const hasErrorCode = /\d{3,4}/.test(response); // HTTP codes, exit codes, etc.
      
      if (!hasTechnicalDetails && !hasErrorCode) {
        return {
          isVague: true,
          reason: 'Missing technical details (error messages, codes, logs)',
          followUpQuestions: [
            'What was the exact error message you saw?',
            'What command did you run that caused the issue?',
            'What was the exit code or status code?',
            'What did the logs show?'
          ],
          suggestedImprovement: 'Include: exact error message, command you ran, error codes, and relevant log output.'
        };
      }
    }

    // No actionable insights for "what learned"
    if (context === 'what-learned') {
      const hasInsight = /because|caused by|due to|reason|root cause|understand|learned|realize/i.test(response);
      
      if (!hasInsight) {
        return {
          isVague: true,
          reason: 'No clear learning or insight explained',
          followUpQuestions: [
            'Why did this problem occur?',
            'What was the root cause?',
            'What concept did you misunderstand?',
            'What did you learn from debugging this?'
          ],
          suggestedImprovement: 'Explain WHY the problem happened and what concept you now understand better.'
        };
      }
    }

    // No concrete action plan for "what change"
    if (context === 'what-change') {
      const hasActionPlan = /will|should|need to|going to|plan to|next time|in future/i.test(response);
      const hasVerb = /check|verify|test|review|read|practice|document|remember/i.test(response);
      
      if (!hasActionPlan || !hasVerb) {
        return {
          isVague: true,
          reason: 'No specific action plan for improvement',
          followUpQuestions: [
            'What specific action will you take next time?',
            'What will you do differently?',
            'How will you prevent this mistake?',
            'What habit or process will you change?'
          ],
          suggestedImprovement: 'Describe a specific, actionable change you\'ll make to prevent this issue in the future.'
        };
      }
    }

    return null; // Response is adequately detailed
  };

  const hasSpecificDetails = (response: string): boolean => {
    // Check for specific technical terms, numbers, names
    const specificPatterns = [
      /\d+/, // Numbers
      /[A-Z]{2,}/, // Acronyms/constants
      /error|exception|warning|failed|refused|denied|timeout/i,
      /port|address|connection|network|disk|memory|cpu/i,
      /docker|kubernetes|nginx|redis|postgres|mysql/i,
      /\.js|\.py|\.sh|\.yml|\.json|\.conf/i, // File extensions
      /http|https|ssh|tcp|udp/i
    ];

    return specificPatterns.some(pattern => pattern.test(response));
  };

  const getFollowUpQuestions = (context: string, issue: string): string[] => {
    const questions: Record<string, string[]> = {
      'what-happened-too-short': [
        'What command or action did you perform?',
        'What error message appeared?',
        'At what step did the failure occur?',
        'What was the system\'s response?'
      ],
      'what-happened-generic': [
        'What was the EXACT error message?',
        'Which command produced the error?',
        'What was the exit code or status?',
        'What did the logs show?'
      ],
      'what-learned-too-short': [
        'Why did this happen?',
        'What was the root cause?',
        'What concept did you misunderstand?',
        'What will you remember from this?'
      ],
      'what-learned-generic': [
        'What was the underlying cause?',
        'What technical concept did you learn?',
        'How does this technology actually work?',
        'What did debugging teach you?'
      ],
      'what-change-too-short': [
        'What will you do differently next time?',
        'What specific action will you take?',
        'How will you prevent this?',
        'What process will you change?'
      ],
      'what-change-generic': [
        'What is your specific action plan?',
        'What habit will you build?',
        'What documentation will you create?',
        'What verification step will you add?'
      ]
    };

    return questions[`${context}-${issue}`] || [];
  };

  const getImprovementSuggestion = (context: string): string => {
    const suggestions: Record<string, string> = {
      'what-happened': 'Be specific: include the exact command, error message, exit code, and relevant log output.',
      'what-learned': 'Explain the ROOT CAUSE: Why did it happen? What concept do you now understand?',
      'what-change': 'Define a CONCRETE action: What specific step will you take to prevent this next time?'
    };

    return suggestions[context] || 'Provide more specific, actionable details.';
  };

  return {
    analyzeResponse,
    detectedVagueness,
    setDetectedVagueness
  };
}
