/**
 * FailureLogListUtils - Utilities for FailureLogList
 */

import type { FailureLog } from '../../types/training';

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    low: 'text-green-400 bg-green-900/30',
    medium: 'text-yellow-400 bg-yellow-900/30',
    high: 'text-orange-400 bg-orange-900/30',
    critical: 'text-red-400 bg-red-900/30'
  };
  return colors[severity] || 'text-slate-400 bg-slate-700';
}

export interface FailureStats {
  total: number;
  resolved: number;
  unresolved: number;
  avgResolutionTime: number;
}

export function calculateStats(failures: FailureLog[]): FailureStats {
  const resolved = failures.filter(f => f.resolvedAt).length;
  const withResolutionTime = failures.filter(f => f.timeToResolveMinutes);
  const avgTime = withResolutionTime.length > 0
    ? withResolutionTime.reduce((acc, f) => acc + (f.timeToResolveMinutes || 0), 0) / withResolutionTime.length
    : 0;

  return {
    total: failures.length,
    resolved,
    unresolved: failures.length - resolved,
    avgResolutionTime: avgTime
  };
}

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
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

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'unresolved', label: 'Unresolved Only' },
  { value: 'resolved', label: 'Resolved Only' }
];
