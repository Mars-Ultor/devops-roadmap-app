/**
 * Specialized Operations - Advanced Lessons
 * Domain-specific training for DevSecOps, Performance, Platform Engineering, and Multi-Cloud
 */

import type { LeveledLessonContent } from '../types/lessonContent';

// ============================================
// LESSON 1: DevSecOps - Security Incident Response
// ============================================

export const specializedLesson1SecurityIncident: LeveledLessonContent = {
  lessonId: 'specialized-lesson1-security-incident',
  
  baseLesson: {
    title: 'Zero-Day Vulnerability Response',
    description: 'Master responding to critical security vulnerabilities affecting production systems.',
    learningObjectives: [
      'Rapidly assess security vulnerability impact',
      'Implement emergency security containment measures',
      'Coordinate security response with multiple teams',
      'Balance security needs with business continuity',
      'Document security incidents for compliance'
    ],
    prerequisites: [
      'Completed Week 9: DevSecOps fundamentals',
      'Understanding of container security',
      'Experience with Kubernetes',
      'Knowledge of incident response procedures'
    ],
    estimatedTimePerLevel: {
      crawl: 50,
      walk: 40,
      runGuided: 35,
      runIndependent: 30
    }
  },

  crawl: {
    introduction: 'Learn security incident response fundamentals through guided vulnerability scenario.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Assess vulnerability scope and impact',
        command: 'Review CVE details, affected systems inventory, and potential data exposure',
        explanation: 'First step in security incident is understanding what you are dealing with. Review CVE severity, CVSS score, attack vectors, and map to your infrastructure.',
        expectedOutput: 'Complete vulnerability impact assessment including affected systems, data at risk, and exploitation difficulty',
        validationCriteria: [
          'All affected systems identified',
          'Data exposure risk assessed',
          'Exploitation difficulty rated',
          'Compliance implications noted'
        ],
        commonMistakes: [
          'Underestimating scope due to time pressure',
          'Not checking for lateral movement paths',
          'Forgetting to assess compliance impact'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Implement immediate containment measures',
        command: 'Isolate affected systems, block exploit vectors, enable enhanced monitoring',
        explanation: 'Containment must balance security with availability. Use network policies, WAF rules, and monitoring to limit damage while maintaining critical services.',
        validationCriteria: [
          'Attack vectors blocked or heavily monitored',
          'Affected systems isolated from sensitive data',
          'Critical services still operational',
          'Enhanced logging enabled'
        ],
        commonMistakes: [
          'Shutting down systems without business approval',
          'Not coordinating with application teams',
          'Failing to enable additional monitoring'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Coordinate with Security and Compliance teams',
        command: 'Brief Security team, notify Compliance, engage external security consultants if needed',
        explanation: 'Security incidents require coordination across specialized teams. Provide technical details to Security, compliance impact to Legal, and business risk to executives.',
        validationCriteria: [
          'Security team fully briefed on technical details',
          'Compliance team assessing reporting requirements',
          'Legal reviewing customer notification obligations',
          'Executive team informed of business risk'
        ],
        commonMistakes: [
          'Delaying notification to avoid escalation',
          'Providing too little information to specialists',
          'Not documenting communication timeline'
        ]
      }
    ],
    exercises: [
      {
        id: 'security-crawl-ex1',
        title: 'Container Runtime Vulnerability Assessment',
        description: 'Assess impact of critical container runtime vulnerability affecting production Kubernetes clusters',
        difficulty: 'intermediate',
        estimatedTime: 20,
        objectives: [
          'Map vulnerability to infrastructure',
          'Identify all affected workloads',
          'Assess data exposure risk',
          'Document compliance implications'
        ],
        startingCondition: 'CVE published for Docker runtime, affects all versions in use, remote code execution possible',
        successCriteria: [
          'Complete inventory of affected containers',
          'Data exposure risk documented by sensitivity level',
          'Compliance reporting requirements identified',
          'Stakeholder notification plan created'
        ]
      }
    ]
  },

  walk: {
    introduction: 'Apply security incident response skills with decision-making responsibility.',
    exercises: [
      {
        id: 'security-walk-ex1',
        title: 'Multi-Service Security Incident',
        description: 'Respond to vulnerability affecting 15 microservices with varying criticality levels',
        difficulty: 'advanced',
        estimatedTime: 30,
        objectives: [
          'Prioritize remediation based on risk',
          'Implement staged rollout of patches',
          'Balance security with availability',
          'Coordinate with multiple development teams'
        ],
        startingCondition: '15 services affected, 3 critical, 7 high-priority, 5 low-priority; patches available but require testing',
        successCriteria: [
          'Critical services patched within 4 hours',
          'High-priority services scheduled appropriately',
          'No service disruptions due to rushed patches',
          'All stakeholders aligned on timeline'
        ]
      }
    ]
  },

  runGuided: {
    introduction: 'Lead complex security incidents with guidance on best practices.',
    exercises: [
      {
        id: 'security-run-guided-ex1',
        title: 'Active Breach Response',
        description: 'Respond to confirmed security breach with active attacker in environment',
        difficulty: 'expert',
        estimatedTime: 45,
        objectives: [
          'Contain active threat without alerting attacker',
          'Preserve evidence for forensics',
          'Coordinate with external security firm',
          'Maintain business operations during response',
          'Plan and execute attacker eviction'
        ],
        startingCondition: 'Confirmed unauthorized access, attacker has persistence, lateral movement detected, customer data potentially accessed',
        successCriteria: [
          'Attacker contained without detection',
          'Forensic evidence preserved',
          'Customer data secured',
          'Coordinated eviction executed successfully',
          'All compliance requirements met'
        ],
        hints: [
          'Avoid tipping off attacker to response activities',
          'Coordinate eviction timing across all systems',
          'Preserve logs before attacker can delete them',
          'Plan customer communication strategy early'
        ]
      }
    ]
  },

  runIndependent: {
    introduction: 'Demonstrate security incident response mastery independently.',
    exercises: [
      {
        id: 'security-run-independent-ex1',
        title: 'Complete Security Incident Lifecycle',
        description: 'Lead full security incident from detection through remediation, recovery, and post-incident review',
        difficulty: 'expert',
        estimatedTime: 60,
        objectives: [
          'Detect and assess security incident independently',
          'Coordinate cross-functional response',
          'Execute containment and remediation',
          'Manage customer and regulatory communications',
          'Conduct comprehensive post-incident analysis'
        ],
        startingCondition: 'Unusual activity detected in production, potential security incident, scope unknown',
        successCriteria: [
          'Incident fully contained and remediated',
          'No data loss or unauthorized access confirmed',
          'All compliance obligations met',
          'Customer trust maintained',
          'Preventive measures implemented'
        ]
      }
    ]
  }
};

// ============================================
// LESSON 2: Performance Engineering
// ============================================

export const specializedLesson2Performance: LeveledLessonContent = {
  lessonId: 'specialized-lesson2-performance',
  
  baseLesson: {
    title: 'Advanced Performance Troubleshooting',
    description: 'Master diagnosing and resolving complex performance issues in distributed systems.',
    learningObjectives: [
      'Diagnose performance degradation in microservices',
      'Use distributed tracing to identify bottlenecks',
      'Optimize database query performance',
      'Implement caching strategies effectively',
      'Design scalable architecture patterns'
    ],
    prerequisites: [
      'Completed Week 8: Observability',
      'Understanding of distributed systems',
      'Experience with monitoring tools',
      'Knowledge of database fundamentals'
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 35,
      runGuided: 30,
      runIndependent: 25
    }
  },

  crawl: {
    introduction: 'Learn performance troubleshooting methodology through guided scenarios.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Establish performance baseline and identify anomalies',
        command: 'Review metrics: response time, throughput, error rate, resource utilization',
        explanation: 'Performance troubleshooting starts with data. Compare current metrics against baseline to identify what changed and when.',
        validationCriteria: [
          'Baseline metrics documented',
          'Anomalies clearly identified',
          'Timeline of degradation established',
          'Affected components isolated'
        ],
        commonMistakes: [
          'Jumping to solutions before understanding problem',
          'Not establishing clear baseline',
          'Ignoring correlation with deployments or traffic changes'
        ]
      }
    ],
    exercises: [
      {
        id: 'performance-crawl-ex1',
        title: 'API Performance Degradation Analysis',
        description: 'Diagnose 3x response time increase in core API endpoints',
        difficulty: 'intermediate',
        estimatedTime: 20,
        objectives: [
          'Analyze performance metrics',
          'Identify degradation pattern',
          'Correlate with system changes',
          'Propose initial hypotheses'
        ],
        startingCondition: 'API response times increased from 100ms to 300ms, error rate normal, CPU and memory usage unchanged',
        successCriteria: [
          'Degradation timeline documented',
          'Pattern identified (gradual vs sudden)',
          'Correlation with deployments checked',
          'Top 3 hypotheses documented'
        ]
      }
    ]
  },

  walk: {
    introduction: 'Apply performance troubleshooting to realistic scenarios.',
    exercises: [
      {
        id: 'performance-walk-ex1',
        title: 'Database Query Optimization',
        description: 'Resolve performance issues caused by inefficient database queries',
        difficulty: 'advanced',
        estimatedTime: 30,
        objectives: [
          'Identify slow queries using query analysis',
          'Analyze query execution plans',
          'Implement optimizations (indexes, query rewrites)',
          'Validate improvements in production'
        ],
        startingCondition: 'Database CPU at 90%, slow query log showing problematic queries, application experiencing timeouts',
        successCriteria: [
          'Slow queries identified and prioritized',
          'Execution plans analyzed',
          'Optimizations implemented safely',
          'Performance improved by 50%+'
        ]
      }
    ]
  },

  runGuided: {
    introduction: 'Solve complex performance issues with strategic guidance.',
    exercises: [
      {
        id: 'performance-run-guided-ex1',
        title: 'Distributed System Performance Crisis',
        description: 'Resolve cascading performance failure across microservices architecture',
        difficulty: 'expert',
        estimatedTime: 40,
        objectives: [
          'Use distributed tracing to identify root cause',
          'Implement circuit breakers to prevent cascading failures',
          'Optimize critical path services',
          'Design scaling strategy for traffic spikes'
        ],
        startingCondition: 'Performance degradation spreading across services, distributed tracing shows complex dependency chains, traffic growing',
        successCriteria: [
          'Root cause identified via distributed tracing',
          'Cascading failures prevented',
          'Critical services optimized',
          'Scaling plan implemented'
        ],
        hints: [
          'Look for services causing retry storms',
          'Check for resource exhaustion in shared dependencies',
          'Implement bulkhead pattern for isolation'
        ]
      }
    ]
  },

  runIndependent: {
    introduction: 'Demonstrate performance engineering mastery.',
    exercises: [
      {
        id: 'performance-run-independent-ex1',
        title: 'Complete Performance Optimization',
        description: 'Lead end-to-end performance optimization for high-traffic system',
        difficulty: 'expert',
        estimatedTime: 50,
        objectives: [
          'Conduct comprehensive performance audit',
          'Identify and prioritize optimization opportunities',
          'Implement multi-layer optimization strategy',
          'Validate improvements under load',
          'Document performance playbook'
        ],
        startingCondition: 'System struggling with 2x traffic increase, multiple performance issues across stack',
        successCriteria: [
          'System handles 3x traffic reliably',
          'Response times within SLA',
          'Resource utilization optimized',
          'Performance playbook created for team'
        ]
      }
    ]
  }
};

// ============================================
// LESSON 3: Platform Engineering
// ============================================

export const specializedLesson3Platform: LeveledLessonContent = {
  lessonId: 'specialized-lesson3-platform',
  
  baseLesson: {
    title: 'Platform Engineering & Developer Experience',
    description: 'Build internal developer platforms that enable teams to ship faster with reliability.',
    learningObjectives: [
      'Design self-service developer platforms',
      'Implement golden paths and paved roads',
      'Build platform APIs and abstractions',
      'Measure and improve developer experience',
      'Balance flexibility with standardization'
    ],
    prerequisites: [
      'Completed Week 11: Platform Engineering basics',
      'Experience with Kubernetes',
      'Understanding of CI/CD',
      'Knowledge of infrastructure as code'
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 35,
      runGuided: 30,
      runIndependent: 25
    }
  },

  crawl: {
    introduction: 'Learn platform engineering fundamentals through building developer tools.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Design self-service deployment platform',
        command: 'Create platform specification for enabling developers to deploy services independently',
        explanation: 'Platform engineering is about empowering developers with self-service tools while maintaining standards. Design must balance ease-of-use with safety.',
        validationCriteria: [
          'Clear deployment workflow defined',
          'Safety guardrails in place',
          'Developer experience optimized',
          'Platform standards documented'
        ],
        commonMistakes: [
          'Making platform too restrictive',
          'Not providing escape hatches for special cases',
          'Forgetting developer experience testing'
        ]
      }
    ],
    exercises: [
      {
        id: 'platform-crawl-ex1',
        title: 'Developer Platform Design',
        description: 'Design self-service platform for deploying containerized applications',
        difficulty: 'intermediate',
        estimatedTime: 25,
        objectives: [
          'Define platform capabilities',
          'Design user interface (CLI/UI)',
          'Establish guardrails and standards',
          'Plan rollout strategy'
        ],
        startingCondition: 'Company has 20 development teams manually deploying to Kubernetes, inconsistent practices, security gaps',
        successCriteria: [
          'Platform reduces deployment time by 80%',
          'Security standards enforced automatically',
          'Developer satisfaction improved',
          'Platform adoption plan defined'
        ]
      }
    ]
  },

  walk: {
    introduction: 'Build and operate platform engineering solutions.',
    exercises: [
      {
        id: 'platform-walk-ex1',
        title: 'Golden Path Implementation',
        description: 'Implement golden path for microservice deployment with automatic best practices',
        difficulty: 'advanced',
        estimatedTime: 35,
        objectives: [
          'Build opinionated deployment templates',
          'Implement automatic security scanning',
          'Create progressive delivery capabilities',
          'Measure developer experience metrics'
        ],
        startingCondition: 'Platform team tasked with creating standardized deployment path for 50+ microservices',
        successCriteria: [
          'Golden path covers 80% of use cases',
          'Deployment includes security, monitoring, and scaling automatically',
          'Developer feedback is positive',
          'Adoption growing organically'
        ]
      }
    ]
  },

  runGuided: {
    introduction: 'Design and build enterprise-scale platform solutions.',
    exercises: [
      {
        id: 'platform-run-guided-ex1',
        title: 'Multi-Tenant Platform Architecture',
        description: 'Design and implement multi-tenant developer platform supporting multiple teams and environments',
        difficulty: 'expert',
        estimatedTime: 45,
        objectives: [
          'Design tenant isolation strategy',
          'Implement cost allocation and chargeback',
          'Build self-service environment provisioning',
          'Create platform observability and SLAs'
        ],
        startingCondition: 'Enterprise needs platform supporting 100+ teams across dev, staging, prod environments with cost controls',
        successCriteria: [
          'Complete tenant isolation achieved',
          'Cost attribution working accurately',
          'Environment provisioning under 5 minutes',
          'Platform SLAs defined and monitored'
        ],
        hints: [
          'Use namespaces and resource quotas for isolation',
          'Implement tagging strategy for cost allocation',
          'Provide templates for common environment types'
        ]
      }
    ]
  },

  runIndependent: {
    introduction: 'Demonstrate platform engineering mastery.',
    exercises: [
      {
        id: 'platform-run-independent-ex1',
        title: 'Complete Developer Platform',
        description: 'Build production-ready internal developer platform from requirements through operation',
        difficulty: 'expert',
        estimatedTime: 60,
        objectives: [
          'Gather developer requirements and pain points',
          'Design platform architecture and APIs',
          'Implement core platform capabilities',
          'Establish platform team operating model',
          'Measure and optimize developer experience'
        ],
        startingCondition: 'Company needs internal developer platform to accelerate development and improve reliability',
        successCriteria: [
          'Platform adopted by majority of teams',
          'Developer productivity measurably improved',
          'Incident rate decreased',
          'Platform team sustainable and effective'
        ]
      }
    ]
  }
};

// Export all specialized lessons
export const SPECIALIZED_LESSONS = [
  specializedLesson1SecurityIncident,
  specializedLesson2Performance,
  specializedLesson3Platform
];
