/**
 * MandatoryAARUtils - Types, constants, and utilities for MandatoryAARModal
 */

export interface AARData {
  objective: string;
  whatWorked: string[];
  whatDidntWork: string[];
  rootCause: string;
  nextTime: string;
  transferableKnowledge: string;
}

export const MIN_WORD_COUNTS = {
  objective: 20,
  whatWorked: 15,
  whatDidntWork: 15,
  rootCause: 30,
  nextTime: 20,
  transferableKnowledge: 25,
};

export const INITIAL_FORM_DATA: AARData = {
  objective: "",
  whatWorked: ["", "", ""],
  whatDidntWork: ["", ""],
  rootCause: "",
  nextTime: "",
  transferableKnowledge: "",
};

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

function validateArrayItems(
  items: string[],
  minItems: number,
  minWords: number,
  label: string,
): string[] {
  const errors: string[] = [];
  const filledItems = items.filter((item) => item.trim().length > 0);

  if (filledItems.length < minItems) {
    errors.push(`List at least ${minItems} ${label}`);
  } else {
    filledItems.forEach((item, idx) => {
      if (countWords(item) < minWords) {
        errors.push(
          `"${label}" item ${idx + 1} needs at least ${minWords} words (currently ${countWords(item)})`,
        );
      }
    });
  }
  return errors;
}

function validateTextField(
  text: string,
  minWords: number,
  fieldName: string,
): string | null {
  if (countWords(text) < minWords) {
    return `${fieldName} must be at least ${minWords} words (currently ${countWords(text)})`;
  }
  return null;
}

export function validateAARForm(
  formData: AARData,
  aiErrors: Record<string, string>,
): string[] {
  const errors: string[] = [];

  if (Object.keys(aiErrors).length > 0) {
    errors.push(
      "Fix AI-detected issues before submitting (see highlighted fields)",
    );
  }

  const objectiveError = validateTextField(
    formData.objective,
    MIN_WORD_COUNTS.objective,
    "Objective",
  );
  if (objectiveError) errors.push(objectiveError);

  errors.push(
    ...validateArrayItems(
      formData.whatWorked,
      3,
      MIN_WORD_COUNTS.whatWorked,
      "things that worked well",
    ),
  );
  errors.push(
    ...validateArrayItems(
      formData.whatDidntWork,
      2,
      MIN_WORD_COUNTS.whatDidntWork,
      "failures or struggles",
    ),
  );

  const rootCauseError = validateTextField(
    formData.rootCause,
    MIN_WORD_COUNTS.rootCause,
    "Root cause analysis",
  );
  if (rootCauseError) errors.push(rootCauseError);

  const nextTimeError = validateTextField(
    formData.nextTime,
    MIN_WORD_COUNTS.nextTime,
    '"What would I do differently"',
  );
  if (nextTimeError) errors.push(nextTimeError);

  const transferableError = validateTextField(
    formData.transferableKnowledge,
    MIN_WORD_COUNTS.transferableKnowledge,
    "Transferable knowledge",
  );
  if (transferableError) errors.push(transferableError);

  return errors;
}
