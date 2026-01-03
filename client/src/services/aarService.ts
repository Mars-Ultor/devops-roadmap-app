/**
 * After Action Review (AAR) Service
 * Handles AAR creation, storage, analysis, and pattern recognition
 */

import axios from 'axios';
import type {
  AfterActionReview,
  AARFormData,
  AARValidationResult,
  AARStats,
  AARPattern
} from '../types/aar';
import { AAR_REQUIREMENTS } from '../types/aar';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    if (formData.whatWorkedWell.length < AAR_REQUIREMENTS.MIN_ITEMS_WORKED_WELL) {
      errors.whatWorkedWell = `Minimum ${AAR_REQUIREMENTS.MIN_ITEMS_WORKED_WELL} items required (currently ${formData.whatWorkedWell.length})`;
    }

    if (formData.whatDidNotWork.length < AAR_REQUIREMENTS.MIN_ITEMS_DID_NOT_WORK) {
      errors.whatDidNotWork = `Minimum ${AAR_REQUIREMENTS.MIN_ITEMS_DID_NOT_WORK} items required (currently ${formData.whatDidNotWork.length})`;
    }

    // Check for empty items
    if (formData.whatWorkedWell.some(item => !item.trim())) {
      errors.whatWorkedWell = 'All items must have content';
    }

    if (formData.whatDidNotWork.some(item => !item.trim())) {
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
  async createAAR(
    userId: string,
    lessonId: string,
    level: 'crawl' | 'walk' | 'run-guided' | 'run-independent',
    labId: string,
    formData: AARFormData
  ): Promise<AfterActionReview> {
    const validation = this.validateAARForm(formData);
    if (!validation.isValid) {
      throw new Error('AAR form validation failed: ' + Object.values(validation.errors).join(', '));
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/aar`, {
        lessonId,
        level,
        labId,
        ...formData
      }, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error creating AAR:', error);
      throw new Error(error.response?.data?.message || 'Failed to create AAR');
    }
  }

  /**
   * Get AARs for a specific user
   */
  async getUserAARs(userId: string, limitCount?: number): Promise<AfterActionReview[]> {
    try {
      const params = limitCount ? { limit: limitCount } : {};
      const response = await axios.get(`${API_BASE_URL}/aar`, {
        params,
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      return response.data.data.map((aar: any) => ({
        ...aar,
        createdAt: new Date(aar.createdAt),
        updatedAt: new Date(aar.updatedAt),
        completedAt: new Date(aar.completedAt)
      }));
    } catch (error: any) {
      console.error('Error fetching user AARs:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch AARs');
    }
  }

  /**
   * Get AARs for a specific lesson
   */
  async getLessonAARs(userId: string, lessonId: string): Promise<AfterActionReview[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/aar`, {
        params: { lessonId },
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      return response.data.data.map((aar: any) => ({
        ...aar,
        createdAt: new Date(aar.createdAt),
        updatedAt: new Date(aar.updatedAt),
        completedAt: new Date(aar.completedAt)
      }));
    } catch (error: any) {
      console.error('Error fetching lesson AARs:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch lesson AARs');
    }
  }

  /**
   * Get AAR statistics for a user
   */
  async getUserAARStats(): Promise<AARStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/aar/stats/overview`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching AAR stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch AAR statistics');
    }
  }

  /**
   * Validate AAR form data without saving
   */
  async validateAARFormRemote(formData: AARFormData): Promise<AARValidationResult> {
    try {
      const response = await axios.post(`${API_BASE_URL}/aar/validate`, formData, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error validating AAR form:', error);
      throw new Error(error.response?.data?.message || 'Failed to validate AAR form');
    }
  }

  /**
   * Get common patterns across user's AARs
   */
  async getCommonPatterns(minFrequency: number = 2): Promise<AARPattern[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/aar/patterns/common`, {
        params: { minFrequency },
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching common patterns:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch common patterns');
    }
  }

  /**
   * Get a specific AAR by ID
   */
  async getAARById(aarId: string): Promise<AfterActionReview | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/aar/${aarId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      const aar = response.data.data;
      return {
        ...aar,
        createdAt: new Date(aar.createdAt),
        updatedAt: new Date(aar.updatedAt),
        completedAt: new Date(aar.completedAt)
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching AAR:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch AAR');
    }
  }

  /**
   * Update an existing AAR
   */
  async updateAAR(aarId: string, updateData: Partial<AARFormData>): Promise<AfterActionReview | null> {
    try {
      const response = await axios.put(`${API_BASE_URL}/aar/${aarId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      const aar = response.data.data;
      return {
        ...aar,
        createdAt: new Date(aar.createdAt),
        updatedAt: new Date(aar.updatedAt),
        completedAt: new Date(aar.completedAt)
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error updating AAR:', error);
      throw new Error(error.response?.data?.message || 'Failed to update AAR');
    }
  }

  /**
   * Delete an AAR
   */
  async deleteAAR(aarId: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/aar/${aarId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      console.error('Error deleting AAR:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete AAR');
    }
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
}

export const aarService = AARService.getInstance();