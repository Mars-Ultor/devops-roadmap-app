/**
 * AARFormUtils - Constants and utility functions for AAR Form
 */

export const MIN_OBJECTIVE_WORDS = 20;
export const MIN_ITEMS = 3;
export const MIN_ROOT_CAUSES = 2;
export const MIN_IMPROVEMENTS = 2;
export const MIN_KNOWLEDGE_WORDS = 30;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

export function updateArrayField(
  array: string[],
  setter: (arr: string[]) => void,
  index: number,
  value: string
): void {
  const updated = [...array];
  updated[index] = value;
  setter(updated);
}

export function addArrayField(array: string[], setter: (arr: string[]) => void): void {
  setter([...array, '']);
}

export function validateAARForm(
  objective: string,
  whatWorked: string[],
  whatDidntWork: string[],
  rootCauses: string[],
  improvements: string[],
  transferableKnowledge: string
): boolean {
  const objectiveWords = countWords(objective);
  const validWhatWorked = whatWorked.filter(w => w.trim().length > 0).length;
  const validWhatDidntWork = whatDidntWork.filter(w => w.trim().length > 0).length;
  const validRootCauses = rootCauses.filter(r => r.trim().length > 0).length;
  const validImprovements = improvements.filter(i => i.trim().length > 0).length;
  const knowledgeWords = countWords(transferableKnowledge);

  return (
    objectiveWords >= MIN_OBJECTIVE_WORDS &&
    validWhatWorked >= MIN_ITEMS &&
    validWhatDidntWork >= MIN_ROOT_CAUSES &&
    validRootCauses >= MIN_ROOT_CAUSES &&
    validImprovements >= MIN_IMPROVEMENTS &&
    knowledgeWords >= MIN_KNOWLEDGE_WORDS
  );
}
