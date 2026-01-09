/**
 * After Action Review (AAR) Service
 * Handles AAR validation and word counting
 * Note: AAR data is stored in Firebase Firestore directly via useAARFormState hook
 */

import type {
  AARFormData,
  AARValidationResult
} from '../types/aar';
import { AAR_REQUIREMENTS } from '../types/aar';

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
    const nonEmptyWorkedWell = formData.whatWorkedWell.filter(item => item.trim());
    const nonEmptyDidNotWork = formData.whatDidNotWork.filter(item => item.trim());

    if (nonEmptyWorkedWell.length < AAR_REQUIREMENTS.MIN_ITEMS_WORKED_WELL) {
      errors.whatWorkedWell = `Minimum ${AAR_REQUIREMENTS.MIN_ITEMS_WORKED_WELL} items required (currently ${nonEmptyWorkedWell.length})`;
    }

    if (nonEmptyDidNotWork.length < AAR_REQUIREMENTS.MIN_ITEMS_DID_NOT_WORK) {
      errors.whatDidNotWork = `Minimum ${AAR_REQUIREMENTS.MIN_ITEMS_DID_NOT_WORK} items required (currently ${nonEmptyDidNotWork.length})`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      wordCounts
    };
  }

  /**
   * Count words in a text string
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
}

export const aarService = AARService.getInstance();
