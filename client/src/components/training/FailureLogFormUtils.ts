/**
 * FailureLogForm - Utility functions and constants
 */

import type { FailureCategory, FailureSeverity } from '../../types/training';

export interface CategoryOption {
  value: FailureCategory;
  label: string;
}

export interface SeverityOption {
  value: FailureSeverity;
  label: string;
  color: string;
}

export const CATEGORIES: CategoryOption[] = [
  { value: 'docker', label: 'Docker' },
  { value: 'deployment', label: 'Deployment' },
  { value: 'security', label: 'Security' },
  { value: 'networking', label: 'Networking' },
  { value: 'database', label: 'Database' },
  { value: 'cicd', label: 'CI/CD' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'testing', label: 'Testing' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'configuration', label: 'Configuration' },
  { value: 'other', label: 'Other' }
];

export const SEVERITIES: SeverityOption[] = [
  { value: 'low', label: 'Low', color: 'text-green-400 bg-green-900/30' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400 bg-yellow-900/30' },
  { value: 'high', label: 'High', color: 'text-orange-400 bg-orange-900/30' },
  { value: 'critical', label: 'Critical', color: 'text-red-400 bg-red-900/30' }
];

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};
