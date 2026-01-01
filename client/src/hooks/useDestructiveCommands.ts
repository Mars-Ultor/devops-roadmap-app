/**
 * Destructive Command Detection Hook
 * Detects risky commands and requires safety checklist before execution
 */

import { useState } from 'react';

export interface DestructiveCommand {
  command: string;
  severity: 'high' | 'medium' | 'low';
  risks: string[];
  checklistItems: string[];
  alternatives?: string[];
}

const DESTRUCTIVE_PATTERNS: Record<string, DestructiveCommand> = {
  'rm -rf': {
    command: 'rm -rf',
    severity: 'high',
    risks: [
      'Permanently deletes files and directories',
      'No confirmation prompt - executes immediately',
      'Cannot be undone',
      'Can destroy entire systems if path is wrong'
    ],
    checklistItems: [
      'I have verified the exact path I want to delete',
      'I have checked there are no typos in the path',
      'I have a backup of critical data',
      'I understand this cannot be undone',
      'I am not in the root directory or home directory'
    ],
    alternatives: [
      'Use rm -i for interactive confirmation',
      'Use rm -r (without -f) to see errors',
      'Move to trash instead of permanent delete'
    ]
  },
  'docker system prune': {
    command: 'docker system prune',
    severity: 'high',
    risks: [
      'Removes all stopped containers',
      'Deletes all dangling images',
      'Removes all unused networks',
      'Can break dependent applications'
    ],
    checklistItems: [
      'I have listed all containers (docker ps -a)',
      'I have verified which containers will be deleted',
      'I have checked for containers I need to keep',
      'I understand this will free disk space but remove stopped containers',
      'I am not running this on a production server'
    ],
    alternatives: [
      'Use docker container prune to only remove containers',
      'Use docker image prune to only remove images',
      'Manually remove specific containers with docker rm'
    ]
  },
  'kubectl delete': {
    command: 'kubectl delete',
    severity: 'high',
    risks: [
      'Permanently removes Kubernetes resources',
      'Can cause service outages',
      'May delete multiple resources if selector is broad',
      'Difficult to recover without backups'
    ],
    checklistItems: [
      'I have verified the namespace',
      'I have checked which resources will be deleted (--dry-run)',
      'I have confirmed this is not a production cluster',
      'I have backups or can recreate the resources',
      'I understand the impact on running services'
    ],
    alternatives: [
      'Use kubectl delete --dry-run=client first',
      'Scale to 0 replicas instead of deleting',
      'Use labels carefully to avoid broad deletions'
    ]
  },
  'DROP DATABASE': {
    command: 'DROP DATABASE',
    severity: 'high',
    risks: [
      'Permanently deletes entire database',
      'All tables, data, and schemas are lost',
      'Cannot be undone',
      'Will break applications using this database'
    ],
    checklistItems: [
      'I have verified the database name',
      'I have a complete backup',
      'I have checked for dependent applications',
      'I understand all data will be permanently lost',
      'This is not a production database'
    ],
    alternatives: [
      'Create a backup first with mysqldump or pg_dump',
      'Archive the database instead of dropping',
      'Revoke access instead if trying to secure data'
    ]
  },
  'chmod 777': {
    command: 'chmod 777',
    severity: 'medium',
    risks: [
      'Gives everyone read, write, execute permissions',
      'Major security vulnerability',
      'Can allow unauthorized access',
      'Violates principle of least privilege'
    ],
    checklistItems: [
      'I have considered more restrictive permissions',
      'I understand the security implications',
      'This is temporary for debugging only',
      'I will revert to secure permissions after testing',
      'This file does not contain sensitive data'
    ],
    alternatives: [
      'Use chmod 755 for executables',
      'Use chmod 644 for regular files',
      'Set ownership with chown instead'
    ]
  },
  'sudo dd': {
    command: 'dd',
    severity: 'high',
    risks: [
      'Can overwrite entire disks',
      'One wrong parameter destroys data',
      'No confirmation or undo',
      'Known as "disk destroyer"'
    ],
    checklistItems: [
      'I have verified input and output devices',
      'I have double-checked the if= and of= parameters',
      'I am not writing to my main system disk',
      'I have verified disk identifiers with lsblk',
      'I understand this will overwrite the target completely'
    ],
    alternatives: [
      'Use rsync for file copying',
      'Use dedicated disk imaging tools',
      'Verify devices with lsblk before running'
    ]
  },
  'mkfs': {
    command: 'mkfs',
    severity: 'high',
    risks: [
      'Formats entire disk partition',
      'Destroys all existing data',
      'Cannot be recovered',
      'Wrong device destroys system'
    ],
    checklistItems: [
      'I have verified the device name',
      'I have checked this is the correct partition',
      'I have backed up any needed data',
      'I have unmounted the partition first',
      'This is not my system partition'
    ]
  },
  'git push --force': {
    command: 'git push --force',
    severity: 'medium',
    risks: [
      'Overwrites remote history',
      'Can lose team members\' commits',
      'Breaks others\' local repositories',
      'Difficult to recover'
    ],
    checklistItems: [
      'I have communicated with my team',
      'I have verified no one else is working on this branch',
      'I understand this will rewrite history',
      'I have considered using --force-with-lease instead',
      'This is not the main/master branch'
    ],
    alternatives: [
      'Use git push --force-with-lease for safety',
      'Revert commits instead of rewriting history',
      'Create a new branch instead of forcing'
    ]
  },
  'terraform destroy': {
    command: 'terraform destroy',
    severity: 'high',
    risks: [
      'Destroys all infrastructure managed by Terraform',
      'Can cause major service outages',
      'Deletes production resources',
      'May be difficult to recreate'
    ],
    checklistItems: [
      'I have verified the workspace/environment',
      'I have run terraform plan -destroy first',
      'I have confirmed this is not production',
      'I have backups of stateful resources',
      'I understand the full scope of what will be destroyed'
    ],
    alternatives: [
      'Use terraform destroy -target to remove specific resources',
      'Comment out resources instead of destroying',
      'Use separate workspaces for production'
    ]
  }
};

export function useDestructiveCommands() {
  const [detectedCommand, setDetectedCommand] = useState<DestructiveCommand | null>(null);

  const detectDestructiveCommand = (input: string): DestructiveCommand | null => {
    const normalized = input.trim().toLowerCase();

    // Check each pattern
    for (const [pattern, config] of Object.entries(DESTRUCTIVE_PATTERNS)) {
      if (normalized.includes(pattern.toLowerCase())) {
        return config;
      }
    }

    // Additional regex patterns for variations
    if (/rm\s+(-\w*r\w*f\w*|-\w*f\w*r\w*)/.test(normalized)) {
      return DESTRUCTIVE_PATTERNS['rm -rf'];
    }

    if (/chmod\s+7{3}/.test(normalized)) {
      return DESTRUCTIVE_PATTERNS['chmod 777'];
    }

    return null;
  };

  const handleCommandInput = (command: string): boolean => {
    const destructive = detectDestructiveCommand(command);
    
    if (destructive) {
      setDetectedCommand(destructive);
      return true; // Command is destructive, block execution
    }

    return false; // Safe to execute
  };

  const clearDetection = () => {
    setDetectedCommand(null);
  };

  return {
    detectedCommand,
    detectDestructiveCommand,
    handleCommandInput,
    clearDetection
  };
}
