import type { BattleDrill } from '../types/training';

// 8 Core Battle Drills - Critical DevOps tasks for muscle memory
export const BATTLE_DRILLS: BattleDrill[] = [
  {
    id: 'bd-001',
    title: 'Deploy Application from Scratch',
    description: 'Deploy a containerized web application from source code to production-ready state',
    targetTimeSeconds: 900, // 15 minutes
    difficulty: 'basic',
    category: 'deployment',
    steps: [
      {
        id: 'bd-001-step-1',
        description: 'Create Dockerfile for the application',
        validationCriteria: [
          'Dockerfile exists in root directory',
          'Uses appropriate base image',
          'COPY and RUN commands present',
          'EXPOSE command specifies port',
          'CMD or ENTRYPOINT specified'
        ],
        hints: [
          'Start with a base image like node:18-alpine or python:3.11-slim',
          'Remember to COPY your application code before running build commands',
          'Make sure to EXPOSE the port your app runs on'
        ]
      },
      {
        id: 'bd-001-step-2',
        description: 'Build Docker image',
        validationCriteria: [
          'Image builds successfully without errors',
          'Image tagged with meaningful name',
          'Image size is reasonable (not using ubuntu:latest for simple app)',
          'No secrets or credentials in image layers'
        ],
        hints: [
          'Use docker build -t <name>:<tag> .',
          'Check build output for errors or warnings',
          'Use .dockerignore to exclude unnecessary files'
        ]
      },
      {
        id: 'bd-001-step-3',
        description: 'Run container and verify',
        validationCriteria: [
          'Container starts successfully',
          'Application accessible on specified port',
          'Health check endpoint returns 200 OK',
          'Logs show no critical errors',
          'Container restarts on failure'
        ],
        hints: [
          'Use docker run -d -p <host>:<container> <image>',
          'Test with curl localhost:<port> or visit in browser',
          'Check logs with docker logs <container-id>'
        ]
      },
      {
        id: 'bd-001-step-4',
        description: 'Configure environment and expose',
        validationCriteria: [
          'Environment variables set correctly',
          'Application responds to external requests',
          'HTTPS configured (or HTTP on correct port)',
          'DNS/hostname resolves correctly'
        ],
        hints: [
          'Use -e flag to set environment variables',
          'Ensure firewall rules allow traffic',
          'Test from external network if possible'
        ]
      }
    ]
  },
  {
    id: 'bd-002',
    title: 'Troubleshoot Failed Deployment',
    description: 'Identify root cause of deployment failure and resolve',
    targetTimeSeconds: 300, // 5 minutes
    difficulty: 'intermediate',
    category: 'troubleshooting',
    steps: [
      {
        id: 'bd-002-step-1',
        description: 'Check container status and logs',
        validationCriteria: [
          'Container status identified (stopped/crashing/running)',
          'Recent logs retrieved and analyzed',
          'Error messages identified',
          'Log level appropriate (not just INFO)'
        ],
        hints: [
          'Use docker ps -a to see all containers',
          'Use docker logs <container> --tail 50',
          'Look for ERROR, FATAL, or CRITICAL messages'
        ]
      },
      {
        id: 'bd-002-step-2',
        description: 'Identify root cause',
        validationCriteria: [
          'Specific error or failure point identified',
          'Root cause determined (not just symptoms)',
          'Related services/dependencies checked',
          'Configuration files reviewed'
        ],
        hints: [
          'Common issues: port conflicts, missing env vars, wrong permissions',
          'Check if dependent services (DB, cache) are running',
          'Verify configuration matches requirements'
        ]
      },
      {
        id: 'bd-002-step-3',
        description: 'Apply fix and validate',
        validationCriteria: [
          'Fix applied to correct component',
          'Application starts successfully',
          'Health checks passing',
          'No new errors in logs',
          'Service accessible'
        ],
        hints: [
          'Rebuild image if Dockerfile changed',
          'Recreate container if config changed',
          'Test the specific functionality that was failing'
        ]
      }
    ]
  },
  {
    id: 'bd-003',
    title: 'Rollback Broken Deployment',
    description: 'Restore service to last known good state after failed update',
    targetTimeSeconds: 180, // 3 minutes
    difficulty: 'intermediate',
    category: 'recovery',
    steps: [
      {
        id: 'bd-003-step-1',
        description: 'Identify last known good version',
        validationCriteria: [
          'Previous working image/tag identified',
          'Backup configuration retrieved',
          'Rollback procedure documented',
          'Impact assessed'
        ],
        hints: [
          'Check image tags for previous versions',
          'Review deployment history',
          'Verify backup exists before proceeding'
        ]
      },
      {
        id: 'bd-003-step-2',
        description: 'Execute rollback',
        validationCriteria: [
          'Old version deployed',
          'Service restored with zero additional downtime',
          'All instances running',
          'Traffic flowing normally'
        ],
        hints: [
          'Use docker run with previous image tag',
          'Stop broken containers before starting old version',
          'Update load balancer/proxy if needed'
        ]
      },
      {
        id: 'bd-003-step-3',
        description: 'Verify restoration',
        validationCriteria: [
          'All health checks passing',
          'User traffic functioning',
          'No errors in logs',
          'Performance metrics normal',
          'Incident documented'
        ],
        hints: [
          'Test critical user paths',
          'Monitor for 2-3 minutes to ensure stability',
          'Document what went wrong for AAR'
        ]
      }
    ]
  },
  {
    id: 'bd-004',
    title: 'Secure Compromised System',
    description: 'Lock down system after detecting security breach',
    targetTimeSeconds: 600, // 10 minutes
    difficulty: 'advanced',
    category: 'security',
    steps: [
      {
        id: 'bd-004-step-1',
        description: 'Isolate affected systems',
        validationCriteria: [
          'Network access restricted',
          'Suspicious processes identified and killed',
          'User sessions terminated',
          'External connections blocked'
        ],
        hints: [
          'Use iptables or firewall to block traffic',
          'Check running processes with ps aux',
          'Review active network connections with netstat'
        ]
      },
      {
        id: 'bd-004-step-2',
        description: 'Assess damage and collect evidence',
        validationCriteria: [
          'Breach vector identified',
          'Affected files/data catalogued',
          'Logs preserved',
          'Timeline documented'
        ],
        hints: [
          'Check modification times on critical files',
          'Review auth logs for suspicious logins',
          'Copy logs before attacker can delete them'
        ]
      },
      {
        id: 'bd-004-step-3',
        description: 'Remediate and harden',
        validationCriteria: [
          'Vulnerabilities patched',
          'Compromised credentials rotated',
          'Backdoors removed',
          'Security controls strengthened',
          'Monitoring enhanced'
        ],
        hints: [
          'Update all packages and dependencies',
          'Change all passwords and API keys',
          'Enable stricter firewall rules',
          'Add alerting for similar attack patterns'
        ]
      }
    ]
  },
  {
    id: 'bd-005',
    title: 'Scale Application Under Load',
    description: 'Increase application capacity to handle 2x traffic',
    targetTimeSeconds: 300, // 5 minutes
    difficulty: 'intermediate',
    category: 'scaling',
    steps: [
      {
        id: 'bd-005-step-1',
        description: 'Identify bottleneck',
        validationCriteria: [
          'Resource constraints identified (CPU/Memory/Network)',
          'Current capacity measured',
          'Scaling strategy determined',
          'Target capacity calculated'
        ],
        hints: [
          'Check container resource usage with docker stats',
          'Monitor response times and queue depths',
          'Determine if horizontal or vertical scaling needed'
        ]
      },
      {
        id: 'bd-005-step-2',
        description: 'Scale application',
        validationCriteria: [
          'Additional instances deployed',
          'Load balancer configured',
          'Health checks passing on all instances',
          'Traffic distributed evenly'
        ],
        hints: [
          'Use docker-compose scale or docker service scale',
          'Ensure load balancer is aware of new instances',
          'Verify session handling for stateful apps'
        ]
      },
      {
        id: 'bd-005-step-3',
        description: 'Validate performance',
        validationCriteria: [
          'Capacity target met (2x baseline)',
          'Response times acceptable',
          'Error rate unchanged or improved',
          'Resource usage sustainable'
        ],
        hints: [
          'Use load testing tool or curl in loop',
          'Monitor all instances, not just one',
          'Check for memory leaks or resource exhaustion'
        ]
      }
    ]
  },
  {
    id: 'bd-006',
    title: 'Debug Production Issue from Logs',
    description: 'Find root cause of production error from log analysis',
    targetTimeSeconds: 300, // 5 minutes
    difficulty: 'intermediate',
    category: 'troubleshooting',
    steps: [
      {
        id: 'bd-006-step-1',
        description: 'Collect and filter logs',
        validationCriteria: [
          'Logs retrieved from time of incident',
          'Filtered to relevant service/component',
          'Error patterns identified',
          'Correlation ID or request ID tracked'
        ],
        hints: [
          'Use docker logs with --since and --until flags',
          'Grep for ERROR, EXCEPTION, FATAL',
          'Look for patterns, not just single errors'
        ]
      },
      {
        id: 'bd-006-step-2',
        description: 'Trace execution path',
        validationCriteria: [
          'Request flow traced across services',
          'Failure point identified',
          'Stack trace analyzed',
          'Related errors linked'
        ],
        hints: [
          'Follow timestamps chronologically',
          'Check multiple services if distributed system',
          'Look at what happened just before the error'
        ]
      },
      {
        id: 'bd-006-step-3',
        description: 'Reproduce and confirm fix',
        validationCriteria: [
          'Issue reproduced in test environment',
          'Root cause confirmed',
          'Fix applied and tested',
          'Monitoring in place to prevent recurrence'
        ],
        hints: [
          'Create test case that triggers the error',
          'Verify fix doesn\'t break other functionality',
          'Add logging if error was hard to diagnose'
        ]
      }
    ]
  },
  {
    id: 'bd-007',
    title: 'Create CI/CD Pipeline',
    description: 'Set up automated build, test, and deployment pipeline',
    targetTimeSeconds: 1200, // 20 minutes
    difficulty: 'advanced',
    category: 'cicd',
    steps: [
      {
        id: 'bd-007-step-1',
        description: 'Configure build stage',
        validationCriteria: [
          'Source code checkout configured',
          'Dependencies installed',
          'Build succeeds',
          'Artifacts generated',
          'Build triggers on commit'
        ],
        hints: [
          'Start with GitHub Actions or GitLab CI',
          'Use official language/framework actions',
          'Cache dependencies for faster builds'
        ]
      },
      {
        id: 'bd-007-step-2',
        description: 'Add automated testing',
        validationCriteria: [
          'Unit tests run automatically',
          'Integration tests configured',
          'Code coverage measured',
          'Pipeline fails on test failures',
          'Test results reported'
        ],
        hints: [
          'Run tests before build to fail fast',
          'Use test frameworks appropriate for language',
          'Set coverage thresholds'
        ]
      },
      {
        id: 'bd-007-step-3',
        description: 'Configure deployment stage',
        validationCriteria: [
          'Docker image built and pushed',
          'Deployment to staging automated',
          'Production deployment requires approval',
          'Rollback mechanism exists',
          'Notifications on success/failure'
        ],
        hints: [
          'Use environment-specific configurations',
          'Test in staging before production',
          'Implement blue-green or canary deployment'
        ]
      }
    ]
  },
  {
    id: 'bd-008',
    title: 'Recover from Data Corruption',
    description: 'Restore data from backup after detecting corruption',
    targetTimeSeconds: 600, // 10 minutes
    difficulty: 'advanced',
    category: 'recovery',
    steps: [
      {
        id: 'bd-008-step-1',
        description: 'Assess corruption and stop damage',
        validationCriteria: [
          'Corruption scope identified',
          'Write operations stopped',
          'Affected data isolated',
          'Latest good backup identified',
          'Recovery point objective (RPO) determined'
        ],
        hints: [
          'Immediately stop application from writing',
          'Check backup timestamps',
          'Estimate how much data will be lost'
        ]
      },
      {
        id: 'bd-008-step-2',
        description: 'Restore from backup',
        validationCriteria: [
          'Backup retrieved and validated',
          'Restoration completed',
          'Data integrity verified',
          'Checksums match',
          'No additional corruption'
        ],
        hints: [
          'Test backup in separate environment first',
          'Verify backup is not also corrupted',
          'Document restoration steps'
        ]
      },
      {
        id: 'bd-008-step-3',
        description: 'Validate and resume operations',
        validationCriteria: [
          'Data queries return expected results',
          'Application functionality restored',
          'Monitoring in place',
          'Root cause identified',
          'Prevention measures implemented'
        ],
        hints: [
          'Run data validation queries',
          'Test critical user workflows',
          'Set up alerts for similar corruption',
          'Schedule more frequent backups if needed'
        ]
      }
    ]
  }
];

// Get drill by ID
export function getBattleDrillById(id: string): BattleDrill | undefined {
  return BATTLE_DRILLS.find(drill => drill.id === id);
}

// Get drills by category
export function getBattleDrillsByCategory(category: BattleDrill['category']): BattleDrill[] {
  return BATTLE_DRILLS.filter(drill => drill.category === category);
}

// Get drills by difficulty
export function getBattleDrillsByDifficulty(difficulty: BattleDrill['difficulty']): BattleDrill[] {
  return BATTLE_DRILLS.filter(drill => drill.difficulty === difficulty);
}

// Get random drill for daily practice
export function getRandomBattleDrill(excludeIds: string[] = []): BattleDrill {
  const available = BATTLE_DRILLS.filter(drill => !excludeIds.includes(drill.id));
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

// Get drills appropriate for user's week
export function getDrillsForWeek(week: number): BattleDrill[] {
  if (week <= 4) {
    return BATTLE_DRILLS.filter(d => d.difficulty === 'basic');
  } else if (week <= 8) {
    return BATTLE_DRILLS.filter(d => d.difficulty === 'basic' || d.difficulty === 'intermediate');
  } else {
    return BATTLE_DRILLS; // all drills available
  }
}
