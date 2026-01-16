// AAR Question definitions
export interface AARQuestion {
  id: string;
  question: string;
  minWords: number;
  placeholder: string;
}

export const AAR_QUESTIONS: AARQuestion[] = [
  {
    id: 'objective',
    question: 'What was I trying to accomplish?',
    minWords: 20,
    placeholder: 'Describe the lab objective and your goal...'
  },
  {
    id: 'worked',
    question: 'What worked well? (List at least 3 things)',
    minWords: 30,
    placeholder: 'List successful approaches, commands that worked, good decisions...'
  },
  {
    id: 'didntWork',
    question: "What didn't work?",
    minWords: 20,
    placeholder: 'What failed, what errors occurred, what took longer than expected...'
  },
  {
    id: 'why',
    question: "Why didn't it work?",
    minWords: 30,
    placeholder: 'Root cause analysis - be specific about WHY things failed...'
  },
  {
    id: 'differently',
    question: 'What would I do differently next time?',
    minWords: 20,
    placeholder: 'Specific changes to approach, workflow, or preparation...'
  },
  {
    id: 'learned',
    question: 'What did I learn that I can use later?',
    minWords: 20,
    placeholder: 'Key takeaways, commands to remember, concepts understood...'
  }
];

// Helper utilities
export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Validate a single AAR response against requirements
 */
export const validateResponse = (answer: string, minWords: number): string | null => {
  if (!answer || answer.trim().length === 0) {
    return 'This question is required';
  }

  const wordCount = countWords(answer);
  if (wordCount < minWords) {
    return `Too brief. Need at least ${minWords} words (currently ${wordCount})`;
  }

  // Check for low-effort responses
  const lowEffortPatterns = [
    /^(it didn't work|nothing|n\/a|idk|i don't know)\.?$/i,
    /^.{1,15}$/,
    /^(yes|no|maybe|ok|okay)\.?$/i
  ];

  for (const pattern of lowEffortPatterns) {
    if (pattern.test(answer.trim())) {
      return 'Please provide a meaningful, detailed response';
    }
  }

  return null;
};

/**
 * Check if all questions are complete
 */
export const checkAllComplete = (responses: Record<string, string>): boolean => {
  return AAR_QUESTIONS.every(q => {
    const answer = responses[q.id] || '';
    return countWords(answer) >= q.minWords;
  });
};

/**
 * Count completed questions
 */
export const countCompletedQuestions = (responses: Record<string, string>): number => {
  return AAR_QUESTIONS.filter(q => countWords(responses[q.id] || '') >= q.minWords).length;
};
