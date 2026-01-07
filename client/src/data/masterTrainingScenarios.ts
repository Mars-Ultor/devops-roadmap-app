/* eslint-disable sonarjs/no-duplicate-string */
/**
 * Master Training Scenarios
 * Contains adaptive scenarios with intentionally repeated category/difficulty values
 */

import type { AdaptiveScenario } from '../pages/MasterTraining';

export const ADAPTIVE_SCENARIOS: AdaptiveScenario[] = [
  {
    id: 'adaptive-incident-response',
    title: 'Adaptive Incident Response',
    baseDifficulty: 'intermediate',
    currentDifficulty: 5,
    category: 'stress',
    estimatedTime: 25,
    skills: ['Incident Response', 'Time Management', 'Decision Making'],
    prerequisites: ['Basic incident handling'],
    description: 'Respond to escalating production incidents while the AI adapts complexity based on your decisions',
    scenario: 'Your e-commerce platform is experiencing intermittent 500 errors. Initial monitoring shows database connection pool exhaustion. Customer reports are flooding in, and it\'s peak shopping hours. The AI will adjust incident complexity based on how you handle each phase.',
    challenges: [
      {
        id: 'initial-assessment',
        phase: 'Initial Assessment',
        situation: 'Error rate spiked from 0.1% to 15% in the last 5 minutes. Database CPU is at 85%. What\'s your first action?',
        correctOptionId: 'opt-2',
        learningObjective: 'Prioritize data gathering before taking action',
        options: [
          {
            id: 'opt-1',
            text: 'Immediately restart database services to clear connections',
            outcome: 'poor',
            explanation: 'Restarting without understanding root cause could make things worse. Always investigate first.',
            skillsAssessed: ['Incident Response', 'Decision Making']
          },
          {
            id: 'opt-2',
            text: 'Check slow query log and active connections before taking action',
            outcome: 'optimal',
            explanation: 'Excellent! Understanding the problem before acting prevents misguided interventions.',
            skillsAssessed: ['Technical Analysis', 'Decision Making']
          },
          {
            id: 'opt-3',
            text: 'Scale up database instance immediately',
            outcome: 'suboptimal',
            explanation: 'While scaling helps, you should first identify if it\'s a code issue causing connection leaks.',
            skillsAssessed: ['Resource Management']
          }
        ]
      },
      {
        id: 'communication-phase',
        phase: 'Stakeholder Communication',
        situation: 'CEO just pinged asking for status. You have partial information. How do you respond?',
        correctOptionId: 'opt-1',
        learningObjective: 'Balance transparency with accuracy under pressure',
        options: [
          {
            id: 'opt-1',
            text: '"Investigating DB connection issue. ETA 10min for diagnosis. Will update every 15min."',
            outcome: 'optimal',
            explanation: 'Perfect balance of honesty, timeline, and commitment to updates.',
            skillsAssessed: ['Communication', 'Leadership']
          },
          {
            id: 'opt-2',
            text: '"Not sure yet, still looking into it"',
            outcome: 'poor',
            explanation: 'Too vague. Leadership needs timeframes and next steps.',
            skillsAssessed: ['Communication']
          },
          {
            id: 'opt-3',
            text: '"Database is overloaded, should be fixed in 5 minutes"',
            outcome: 'suboptimal',
            explanation: 'Overpromising without full diagnosis can backfire.',
            skillsAssessed: ['Communication', 'Time Management']
          }
        ]
      },
      {
        id: 'root-cause-analysis',
        phase: 'Root Cause Diagnosis',
        situation: 'You found a new deployment 2 hours ago added N+1 queries. How do you proceed?',
        correctOptionId: 'opt-1',
        learningObjective: 'Balance immediate mitigation with long-term fix',
        options: [
          {
            id: 'opt-1',
            text: 'Rollback deployment immediately, then optimize queries in staging',
            outcome: 'optimal',
            explanation: 'Smart! Restore service first, then fix properly with testing.',
            skillsAssessed: ['Incident Response', 'Technical Analysis']
          },
          {
            id: 'opt-2',
            text: 'Fix the queries in production right now',
            outcome: 'poor',
            explanation: 'Too risky. Hotfixing under pressure can introduce new issues.',
            skillsAssessed: ['Decision Making']
          },
          {
            id: 'opt-3',
            text: 'Add database read replicas to handle the load',
            outcome: 'suboptimal',
            explanation: 'Treating symptom not cause. Inefficient queries should be fixed.',
            skillsAssessed: ['Technical Analysis']
          }
        ]
      },
      {
        id: 'post-incident',
        phase: 'Post-Incident Actions',
        situation: 'Service restored. What\'s your next priority?',
        correctOptionId: 'opt-2',
        learningObjective: 'Establish learning culture and prevent recurrence',
        options: [
          {
            id: 'opt-1',
            text: 'Send email blast about the outage',
            outcome: 'poor',
            explanation: 'Too reactive. Need structured post-mortem and prevention.',
            skillsAssessed: ['Communication']
          },
          {
            id: 'opt-2',
            text: 'Schedule blameless postmortem, add query performance tests to CI/CD',
            outcome: 'optimal',
            explanation: 'Perfect! Learn from incidents and systematically prevent recurrence.',
            skillsAssessed: ['Process Improvement', 'Technical Analysis', 'Leadership']
          },
          {
            id: 'opt-3',
            text: 'Document the incident in wiki',
            outcome: 'suboptimal',
            explanation: 'Documentation is good, but need active prevention measures.',
            skillsAssessed: ['Process Improvement']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 5,
      complexity: 5,
      stakeholderCount: 3,
      technicalDepth: 5,
      communicationLoad: 5
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 5
  },
  {
    id: 'leadership-crisis-management',
    title: 'Leadership Crisis Management',
    baseDifficulty: 'advanced',
    currentDifficulty: 7,
    category: 'leadership',
    estimatedTime: 35,
    skills: ['Team Leadership', 'Crisis Management', 'Stakeholder Communication'],
    prerequisites: ['Basic leadership training'],
    description: 'Lead multiple teams through a cascading failure affecting critical infrastructure',
    scenario: 'A routine deployment triggered a cascading failure across three microservices. Your team is stressed, customers are impacted, and executives are demanding answers. The AI will increase pressure based on your leadership effectiveness.',
    challenges: [
      {
        id: 'team-coordination',
        phase: 'Team Coordination',
        situation: 'You have 3 teams (Platform, Security, Data) all pointing fingers. How do you unify them?',
        correctOptionId: 'team-opt-2',
        learningObjective: 'Foster collaboration over blame during crisis',
        options: [
          {
            id: 'team-opt-1',
            text: 'Identify who deployed and have them lead the fix',
            outcome: 'poor',
            explanation: 'Blame-focused approach damages team morale and slows resolution.',
            skillsAssessed: ['Leadership']
          },
          {
            id: 'team-opt-2',
            text: 'Create unified war room, assign clear roles, focus on resolution not blame',
            outcome: 'optimal',
            explanation: 'Excellent leadership! Crisis requires unity and clear structure.',
            skillsAssessed: ['Team Leadership', 'Crisis Management']
          },
          {
            id: 'team-opt-3',
            text: 'Let teams work independently and report back',
            outcome: 'suboptimal',
            explanation: 'Silos slow down crisis response. Coordination is critical.',
            skillsAssessed: ['Team Leadership']
          }
        ]
      },
      {
        id: 'pressure-handling',
        phase: 'Executive Pressure',
        situation: 'CTO demands: "Why wasn\'t this caught in testing? Someone needs to answer for this." Your response?',
        correctOptionId: 'pressure-opt-1',
        learningObjective: 'Shield team from blame while maintaining accountability',
        options: [
          {
            id: 'pressure-opt-1',
            text: '"Let\'s focus on resolution now, we\'ll do thorough postmortem after. Team is executing well."',
            outcome: 'optimal',
            explanation: 'Perfect! Deflect blame, protect team morale, commit to accountability later.',
            skillsAssessed: ['Leadership', 'Communication', 'Stakeholder Management']
          },
          {
            id: 'pressure-opt-2',
            text: '"The QA team missed this in testing"',
            outcome: 'poor',
            explanation: 'Throwing team members under the bus destroys trust and culture.',
            skillsAssessed: ['Leadership']
          },
          {
            id: 'pressure-opt-3',
            text: '"We\'re investigating root cause now"',
            outcome: 'suboptimal',
            explanation: 'Too passive. Need to redirect focus while showing leadership.',
            skillsAssessed: ['Communication']
          }
        ]
      },
      {
        id: 'delegation-under-stress',
        phase: 'Effective Delegation',
        situation: 'You\'re being pulled in 5 directions. Junior engineer asks "What should I do?"',
        correctOptionId: 'delegation-opt-1',
        learningObjective: 'Empower team members with clear direction',
        options: [
          {
            id: 'delegation-opt-1',
            text: '"Monitor error dashboards, report anomalies every 10min. Here\'s runbook."',
            outcome: 'optimal',
            explanation: 'Clear, actionable task with autonomy. Great delegation!',
            skillsAssessed: ['Leadership', 'Team Management', 'Delegation']
          },
          {
            id: 'delegation-opt-2',
            text: '"Just watch for now, I\'ll tell you when I need help"',
            outcome: 'poor',
            explanation: 'Wastes resources. Engage everyone productively.',
            skillsAssessed: ['Team Management']
          },
          {
            id: 'delegation-opt-3',
            text: '"Help debugging the main issue"',
            outcome: 'suboptimal',
            explanation: 'Too vague. Give specific, achievable tasks.',
            skillsAssessed: ['Delegation']
          }
        ]
      },
      {
        id: 'customer-communication',
        phase: 'Customer Impact',
        situation: 'Customer support reports 500+ angry tickets. How do you help them?',
        correctOptionId: 'customer-opt-2',
        learningObjective: 'Enable support teams with clear communication',
        options: [
          {
            id: 'customer-opt-1',
            text: '"Tell them we\'re working on it"',
            outcome: 'poor',
            explanation: 'Too generic. Support needs specific talking points.',
            skillsAssessed: ['Communication']
          },
          {
            id: 'customer-opt-2',
            text: 'Draft customer-facing message: "Known issue affecting X feature. Estimated resolution: Y. Updates every 30min."',
            outcome: 'optimal',
            explanation: 'Perfect! Give support team clear message template.',
            skillsAssessed: ['Communication', 'Stakeholder Management', 'Crisis Management']
          },
          {
            id: 'customer-opt-3',
            text: '"Let support handle it, we need to focus on the fix"',
            outcome: 'suboptimal',
            explanation: 'Support is on your team. Help them help customers.',
            skillsAssessed: ['Team Leadership']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 7,
      complexity: 7,
      stakeholderCount: 5,
      technicalDepth: 6,
      communicationLoad: 7
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 7
  },
  {
    id: 'security-threat-response',
    title: 'Advanced Security Threat Response',
    baseDifficulty: 'expert',
    currentDifficulty: 8,
    category: 'specialized',
    estimatedTime: 45,
    skills: ['Security Operations', 'Threat Analysis', 'Forensic Investigation'],
    prerequisites: ['Security fundamentals'],
    description: 'Respond to active security breach while preserving evidence and minimizing damage',
    scenario: 'Security alerts indicate unauthorized access to production databases. Unusual data exfiltration patterns detected. You need to contain the threat, preserve forensic evidence, and coordinate with legal/compliance. AI adapts based on your security acumen.',
    challenges: [
      {
        id: 'initial-containment',
        phase: 'Threat Containment',
        situation: 'Active data exfiltration detected. Attacker has database credentials. What\'s your priority?',
        correctOptionId: 'opt-2',
        learningObjective: 'Balance containment with evidence preservation',
        options: [
          {
            id: 'opt-1',
            text: 'Immediately revoke all database credentials',
            outcome: 'suboptimal',
            explanation: 'While stopping access is important, you need to preserve evidence of attack vectors first.',
            skillsAssessed: ['Security Operations']
          },
          {
            id: 'opt-2',
            text: 'Snapshot systems for forensics, isolate affected database, then revoke credentials',
            outcome: 'optimal',
            explanation: 'Perfect security response! Preserve evidence while containing the threat.',
            skillsAssessed: ['Security Operations', 'Forensic Investigation', 'Technical Analysis']
          },
          {
            id: 'opt-3',
            text: 'Shut down entire production environment',
            outcome: 'poor',
            explanation: 'Too extreme. Surgical containment is better than scorched earth.',
            skillsAssessed: ['Security Operations']
          }
        ]
      },
      {
        id: 'forensics-analysis',
        phase: 'Forensic Analysis',
        situation: 'Logs show attacker used compromised API key. How do you handle data loss? Wait, how deep is the breach?',
        correctOptionId: 'opt-1',
        learningObjective: 'Systematic threat assessment and blast radius analysis',
        options: [
          {
            id: 'opt-1',
            text: 'Trace API key usage across all systems, check for lateral movement, audit data access logs',
            outcome: 'optimal',
            explanation: 'Comprehensive approach! Understanding full breach scope is critical.',
            skillsAssessed: ['Forensic Investigation', 'Threat Analysis', 'Security Operations']
          },
          {
            id: 'opt-2',
            text: 'Focus only on database access since that\'s where exfiltration occurred',
            outcome: 'poor',
            explanation: 'Tunnel vision. Attackers often establish multiple footholds.',
            skillsAssessed: ['Threat Analysis']
          },
          {
            id: 'opt-3',
            text: 'Rotate all credentials as precaution',
            outcome: 'suboptimal',
            explanation: 'Premature mitigation. Need to understand breach scope first.',
            skillsAssessed: ['Security Operations']
          }
        ]
      },
      {
        id: 'compliance-reporting',
        phase: 'Compliance & Communication',
        situation: 'Legal asks: "Do we need to report this breach to customers?" You have 2 hours to decide.',
        correctOptionId: 'opt-1',
        learningObjective: 'Navigate legal/compliance requirements under pressure',
        options: [
          {
            id: 'opt-1',
            text: 'Determine if PII was accessed based on logs, check GDPR/compliance requirements, provide recommendation',
            outcome: 'optimal',
            explanation: 'Methodical compliance assessment! Data-driven decisions for legal obligations.',
            skillsAssessed: ['Threat Analysis', 'Communication', 'Decision Making']
          },
          {
            id: 'opt-2',
            text: '"Probably safe to wait until investigation is complete"',
            outcome: 'poor',
            explanation: 'Dangerous! Compliance violations have severe penalties. Need definitive answer.',
            skillsAssessed: ['Decision Making']
          },
          {
            id: 'opt-3',
            text: '"Let\'s notify everyone to be safe"',
            outcome: 'suboptimal',
            explanation: 'Over-notification causes unnecessary panic. Make evidence-based decision.',
            skillsAssessed: ['Communication', 'Decision Making']
          }
        ]
      },
      {
        id: 'security-hardening',
        phase: 'Prevention & Hardening',
        situation: 'Breach contained. What long-term security measures do you implement?',
        correctOptionId: 'opt-1',
        learningObjective: 'Systematic security improvements post-incident',
        options: [
          {
            id: 'opt-1',
            text: 'Implement MFA, rotate secrets to vault, add WAF rules, enable CloudTrail monitoring, security training',
            outcome: 'optimal',
            explanation: 'Defense in depth! Multiple layers of security improvements.',
            skillsAssessed: ['Security Operations', 'Process Improvement', 'Technical Analysis']
          },
          {
            id: 'opt-2',
            text: 'Just change all passwords',
            outcome: 'poor',
            explanation: 'Band-aid solution. Need systematic security improvements.',
            skillsAssessed: ['Security Operations']
          },
          {
            id: 'opt-3',
            text: 'Add IP whitelist ing',
            outcome: 'suboptimal',
            explanation: 'Single layer. Modern security requires multiple controls.',
            skillsAssessed: ['Security Operations']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 7,
      complexity: 8,
      stakeholderCount: 4,
      technicalDepth: 8,
      communicationLoad: 6
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 8
  },
  {
    id: 'platform-architecture',
    title: 'Platform Architecture Design',
    baseDifficulty: 'advanced',
    currentDifficulty: 7,
    category: 'technical',
    estimatedTime: 40,
    skills: ['System Design', 'Platform Engineering', 'Scalability'],
    prerequisites: ['Infrastructure fundamentals'],
    description: 'Design and implement a developer platform that scales to 500+ engineers',
    scenario: 'Your company is growing from 50 to 500 engineers. Current ad-hoc deployment process won\'t scale. You need to design a self-service platform that maintains developer velocity while ensuring reliability. AI adapts based on your platform design decisions.',
    challenges: [
      {
        id: 'platform-vision',
        phase: 'Platform Strategy',
        situation: 'Product teams want different tech stacks. How do you handle diversity vs. standardization?',
        correctOptionId: 'opt-2',
        learningObjective: 'Balance flexibility with operational sanity',
        options: [
          {
            id: 'opt-1',
            text: 'Enforce single tech stack for everyone',
            outcome: 'poor',
            explanation: 'Too rigid. Stifles innovation and ignores valid use cases.',
            skillsAssessed: ['Platform Engineering']
          },
          {
            id: 'opt-2',
            text: 'Support 2-3 "golden paths" with full tooling, allow exceptions with team ownership',
            outcome: 'optimal',
            explanation: 'Perfect balance! Provide great defaults while allowing innovation.',
            skillsAssessed: ['Platform Engineering', 'System Design', 'Decision Making']
          },
          {
            id: 'opt-3',
            text: 'Let each team choose their own stack',
            outcome: 'suboptimal',
            explanation: 'Creates operational nightmare. Need some standardization.',
            skillsAssessed: ['Platform Engineering']
          }
        ]
      },
      {
        id: 'developer-experience',
        phase: 'Developer Experience',
        situation: 'Engineers complain: "Deploying takes 45 minutes and requires 5 approvals." How do you fix this?',
        correctOptionId: 'opt-1',
        learningObjective: 'Optimize for developer productivity with safety',
        options: [
          {
            id: 'opt-1',
            text: 'Automated testing gates, self-service deployment, progressive rollout with auto-rollback',
            outcome: 'optimal',
            explanation: 'Modern CI/CD! Replace manual gates with automated safety.',
            skillsAssessed: ['Platform Engineering', 'Process Improvement', 'Technical Analysis']
          },
          {
            id: 'opt-2',
            text: 'Reduce approvals to 2',
            outcome: 'poor',
            explanation: 'Still manual bottleneck. Automate don\'t just reduce.',
            skillsAssessed: ['Process Improvement']
          },
          {
            id: 'opt-3',
            text: 'Give everyone prod access',
            outcome: 'suboptimal',
            explanation: 'Too risky. Need automated safeguards, not just access.',
            skillsAssessed: ['Decision Making']
          }
        ]
      },
      {
        id: 'observability-platform',
        phase: 'Platform Observability',
        situation: 'Teams can\'t debug issues because logs are scattered across 12 systems. Your solution?',
        correctOptionId: 'opt-2',
        learningObjective: 'Unified observability as platform feature',
        options: [
          {
            id: 'opt-1',
            text: 'Send email with links to all logging systems',
            outcome: 'poor',
            explanation: 'Doesn\'t solve fragmentation. Need unified interface.',
            skillsAssessed: ['Platform Engineering']
          },
          {
            id: 'opt-2',
            text: 'Centralized observability platform with logs, metrics, traces, auto-instrumentation',
            outcome: 'optimal',
            explanation: 'Excellent! Observability as first-class platform capability.',
            skillsAssessed: ['Platform Engineering', 'System Design', 'Technical Analysis']
          },
          {
            id: 'opt-3',
            text: 'Pick one logging tool and migrate everything',
            outcome: 'suboptimal',
            explanation: 'Logs alone aren\'t enough. Need full observability.',
            skillsAssessed: ['Platform Engineering']
          }
        ]
      },
      {
        id: 'cost-optimization',
        phase: 'Platform Economics',
        situation: 'Cloud costs hit $2M/month. Teams don\'t know their spend. How do you address this?',
        correctOptionId: 'opt-1',
        learningObjective: 'FinOps as platform capability',
        options: [
          {
            id: 'opt-1',
            text: 'Per-team cost attribution, spending dashboards, budget alerts, rightsizing recommendations',
            outcome: 'optimal',
            explanation: 'FinOps best practices! Visibility drives accountability.',
            skillsAssessed: ['Platform Engineering', 'Cost Optimization', 'Process Improvement']
          },
          {
            id: 'opt-2',
            text: 'Send monthly cost report to all teams',
            outcome: 'poor',
            explanation: 'Passive information without actionability.',
            skillsAssessed: ['Process Improvement']
          },
          {
            id: 'opt-3',
            text: 'Implement spending quotas per team',
            outcome: 'suboptimal',
            explanation: 'Quotas without visibility create conflicts. Transparency first.',
            skillsAssessed: ['Process Improvement']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 5,
      complexity: 8,
      stakeholderCount: 6,
      technicalDepth: 9,
      communicationLoad: 6
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 8
  },
  {
    id: 'performance-optimization',
    title: 'Advanced Performance Engineering',
    baseDifficulty: 'expert',
    currentDifficulty: 8,
    category: 'technical',
    estimatedTime: 35,
    skills: ['Performance Engineering', 'Profiling', 'System Optimization'],
    prerequisites: ['Performance basics'],
    description: 'Diagnose and resolve complex performance issues across distributed systems',
    scenario: 'Your API latency has degraded from p95 200ms to 2000ms over the past week. No recent deployments. Users are complaining. Find and fix the root cause. AI adapts based on your performance analysis skills.',
    challenges: [
      {
        id: 'performance-investigation',
        phase: 'Initial Diagnosis',
        situation: 'P95 latency is 10x normal. Where do you start investigating?',
        correctOptionId: 'opt-1',
        learningObjective: 'Systematic performance troubleshooting',
        options: [
          {
            id: 'opt-1',
            text: 'Check distributed traces, database slow queries, external service latency, resource utilization',
            outcome: 'optimal',
            explanation: 'Comprehensive approach! Check all potential bottlenecks systematically.',
            skillsAssessed: ['Performance Engineering', 'Technical Analysis', 'Profiling']
          },
          {
            id: 'opt-2',
            text: 'Add more application servers',
            outcome: 'poor',
            explanation: 'Scaling without diagnosis wastes resources and may not help.',
            skillsAssessed: ['Performance Engineering']
          },
          {
            id: 'opt-3',
            text: 'Restart all services',
            outcome: 'suboptimal',
            explanation: 'Might temporarily help but doesn\'t address root cause.',
            skillsAssessed: ['Decision Making']
          }
        ]
      },
      {
        id: 'bottleneck-analysis',
        phase: 'Bottleneck Identification',
        situation: 'Traces show database queries taking 1.5s (was 50ms). What\'s your hypothesis?',
        correctOptionId: 'opt-2',
        learningObjective: 'Database performance analysis',
        options: [
          {
            id: 'opt-1',
            text: 'Database server is undersized',
            outcome: 'poor',
            explanation: 'Jumping to conclusions. Need data-driven diagnosis.',
            skillsAssessed: ['Technical Analysis']
          },
          {
            id: 'opt-2',
            text: 'Check query execution plans, missing indexes, table statistics, connection pool saturation',
            outcome: 'optimal',
            explanation: 'Methodical database troubleshooting! Multiple potential causes.',
            skillsAssessed: ['Performance Engineering', 'Technical Analysis', 'Profiling']
          },
          {
            id: 'opt-3',
            text: 'Enable query caching',
            outcome: 'suboptimal',
            explanation: 'Band-aid. Fix the underlying inefficiency first.',
            skillsAssessed: ['Performance Engineering']
          }
        ]
      },
      {
        id: 'optimization-strategy',
        phase: 'Performance Optimization',
        situation: 'You found missing indexes on high-traffic tables. How do you apply the fix?',
        correctOptionId: 'opt-1',
        learningObjective: 'Safe production performance changes',
        options: [
          {
            id: 'opt-1',
            text: 'Test index in staging, add with CONCURRENTLY flag, monitor query performance before/after',
            outcome: 'optimal',
            explanation: 'Safe production changes! Test, non-blocking add, verify impact.',
            skillsAssessed: ['Performance Engineering', 'Technical Analysis', 'Decision Making']
          },
          {
            id: 'opt-2',
            text: 'Add indexes immediately to production',
            outcome: 'poor',
            explanation: 'Risky! Index creation can lock tables and cause outages.',
            skillsAssessed: ['Decision Making']
          },
          {
            id: 'opt-3',
            text: 'Schedule index creation for maintenance window next week',
            outcome: 'suboptimal',
            explanation: 'Too slow. Users are suffering now. Safe immediate fixes exist.',
            skillsAssessed: ['Performance Engineering']
          }
        ]
      },
      {
        id: 'monitoring-prevention',
        phase: 'Prevention & Monitoring',
        situation: 'Issue fixed. How do you prevent this from happening again?',
        correctOptionId: 'opt-1',
        learningObjective: 'Proactive performance monitoring',
        options: [
          {
            id: 'opt-1',
            text: 'Set up query performance monitoring, index usage tracking, automated slow query alerts',
            outcome: 'optimal',
            explanation: 'Proactive monitoring! Catch performance regressions early.',
            skillsAssessed: ['Performance Engineering', 'Process Improvement', 'Monitoring']
          },
          {
            id: 'opt-2',
            text: 'Document the incident',
            outcome: 'poor',
            explanation: 'Documentation doesn\'t prevent recurrence. Need active monitoring.',
            skillsAssessed: ['Process Improvement']
          },
          {
            id: 'opt-3',
            text: 'Review database schema monthly',
            outcome: 'suboptimal',
            explanation: 'Too slow. Want real-time alerts, not periodic reviews.',
            skillsAssessed: ['Process Improvement']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 6,
      complexity: 8,
      stakeholderCount: 3,
      technicalDepth: 9,
      communicationLoad: 4
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 9
  },
  {
    id: 'cicd-pipeline-failure',
    title: 'CI/CD Pipeline Crisis',
    baseDifficulty: 'intermediate',
    currentDifficulty: 5,
    category: 'technical',
    estimatedTime: 30,
    skills: ['CI/CD', 'Debugging', 'Process Improvement'],
    prerequisites: ['Basic pipeline knowledge'],
    description: 'Fix a critical CI/CD pipeline failure blocking all deployments',
    scenario: 'Your CI/CD pipeline has been failing for 3 hours. 15 teams are blocked from deploying. Tests are timing out, builds are inconsistent, and the infrastructure team says nothing changed. AI adapts based on your pipeline debugging skills.',
    challenges: [
      {
        id: 'pipeline-diagnosis',
        phase: 'Initial Investigation',
        situation: 'Pipeline fails at different stages randomly. Where do you start?',
        correctOptionId: 'opt-2',
        learningObjective: 'Systematic debugging of distributed systems',
        options: [
          {
            id: 'opt-1',
            text: 'Restart all pipeline runners',
            outcome: 'poor',
            explanation: 'Restarting without diagnosis may not fix intermittent issues.',
            skillsAssessed: ['Debugging']
          },
          {
            id: 'opt-2',
            text: 'Check runner resource utilization, network connectivity, and recent dependency changes',
            outcome: 'optimal',
            explanation: 'Comprehensive approach! Intermittent failures often indicate resource or network issues.',
            skillsAssessed: ['Debugging', 'Technical Analysis', 'CI/CD']
          },
          {
            id: 'opt-3',
            text: 'Roll back to last working pipeline configuration',
            outcome: 'suboptimal',
            explanation: 'May work, but you won\'t learn what broke or prevent recurrence.',
            skillsAssessed: ['CI/CD']
          }
        ]
      },
      {
        id: 'root-cause',
        phase: 'Root Cause Analysis',
        situation: 'Runners are hitting CPU limits during parallel test execution. How do you fix this?',
        correctOptionId: 'opt-1',
        learningObjective: 'Balance quick fix with sustainable solution',
        options: [
          {
            id: 'opt-1',
            text: 'Reduce test parallelism temporarily, then add more runners and optimize slow tests',
            outcome: 'optimal',
            explanation: 'Perfect! Immediate mitigation plus long-term optimization.',
            skillsAssessed: ['CI/CD', 'Process Improvement', 'Decision Making']
          },
          {
            id: 'opt-2',
            text: 'Just add more powerful runners',
            outcome: 'poor',
            explanation: 'Expensive solution that doesn\'t address inefficient tests.',
            skillsAssessed: ['CI/CD']
          },
          {
            id: 'opt-3',
            text: 'Disable parallel testing',
            outcome: 'suboptimal',
            explanation: 'Slows down everyone. Need to scale infrastructure properly.',
            skillsAssessed: ['Process Improvement']
          }
        ]
      },
      {
        id: 'communication',
        phase: 'Team Communication',
        situation: 'Teams are angry about the 3-hour outage. How do you communicate the fix?',
        correctOptionId: 'opt-2',
        learningObjective: 'Transparent communication with actionable follow-up',
        options: [
          {
            id: 'opt-1',
            text: 'Send email saying "pipeline fixed"',
            outcome: 'poor',
            explanation: 'Too brief. Teams need context and assurance it won\'t recur.',
            skillsAssessed: ['Communication']
          },
          {
            id: 'opt-2',
            text: 'Post-mortem with root cause, immediate fix, and prevention plan (monitoring, resource limits)',
            outcome: 'optimal',
            explanation: 'Excellent transparency! Builds trust and prevents recurrence.',
            skillsAssessed: ['Communication', 'Process Improvement', 'Leadership']
          },
          {
            id: 'opt-3',
            text: 'Blame the infrastructure team for resource constraints',
            outcome: 'suboptimal',
            explanation: 'Blame destroys collaboration. Focus on systemic improvements.',
            skillsAssessed: ['Communication']
          }
        ]
      },
      {
        id: 'prevention',
        phase: 'Long-term Prevention',
        situation: 'How do you prevent future pipeline resource issues?',
        correctOptionId: 'opt-1',
        learningObjective: 'Proactive monitoring and capacity planning',
        options: [
          {
            id: 'opt-1',
            text: 'Add runner resource monitoring, auto-scaling, and test performance budgets',
            outcome: 'optimal',
            explanation: 'Comprehensive prevention! Monitoring, automation, and quality gates.',
            skillsAssessed: ['CI/CD', 'Process Improvement', 'Monitoring']
          },
          {
            id: 'opt-2',
            text: 'Over-provision runners by 3x',
            outcome: 'poor',
            explanation: 'Wasteful. Better to monitor and scale dynamically.',
            skillsAssessed: ['CI/CD']
          },
          {
            id: 'opt-3',
            text: 'Weekly manual review of pipeline performance',
            outcome: 'suboptimal',
            explanation: 'Too slow. Automated monitoring catches issues faster.',
            skillsAssessed: ['Process Improvement']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 6,
      complexity: 6,
      stakeholderCount: 4,
      technicalDepth: 7,
      communicationLoad: 5
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 6
  },
  {
    id: 'infrastructure-scaling',
    title: 'Infrastructure Scaling Under Load',
    baseDifficulty: 'advanced',
    currentDifficulty: 7,
    category: 'technical',
    estimatedTime: 40,
    skills: ['Infrastructure', 'Scalability', 'Cloud Architecture'],
    prerequisites: ['Cloud basics'],
    description: 'Scale infrastructure to handle 10x traffic spike from viral marketing campaign',
    scenario: 'Marketing just announced a viral campaign starting in 2 hours. Expected traffic: 10x normal. Current infrastructure: barely handling current load. Budget approved for emergency scaling. AI adapts based on your scaling decisions.',
    challenges: [
      {
        id: 'capacity-planning',
        phase: 'Capacity Assessment',
        situation: '2 hours until traffic spike. What\'s your scaling strategy?',
        correctOptionId: 'opt-2',
        learningObjective: 'Strategic capacity planning under time pressure',
        options: [
          {
            id: 'opt-1',
            text: 'Scale everything by 10x immediately',
            outcome: 'poor',
            explanation: 'Wasteful and may hit cloud quotas. Need targeted scaling.',
            skillsAssessed: ['Infrastructure']
          },
          {
            id: 'opt-2',
            text: 'Identify bottlenecks (DB, app servers, cache), scale critical paths, enable auto-scaling',
            outcome: 'optimal',
            explanation: 'Smart! Focus on bottlenecks and use auto-scaling for efficiency.',
            skillsAssessed: ['Infrastructure', 'Scalability', 'Cloud Architecture']
          },
          {
            id: 'opt-3',
            text: 'Add CDN and hope it handles the load',
            outcome: 'suboptimal',
            explanation: 'CDN helps but won\'t solve backend capacity issues.',
            skillsAssessed: ['Cloud Architecture']
          }
        ]
      },
      {
        id: 'database-scaling',
        phase: 'Database Bottleneck',
        situation: 'Database CPU hits 95%. Read replicas at capacity. How do you scale?',
        correctOptionId: 'opt-1',
        learningObjective: 'Multi-layered database scaling approach',
        options: [
          {
            id: 'opt-1',
            text: 'Add Redis cache layer, enable query cache, add read replicas, upgrade primary instance',
            outcome: 'optimal',
            explanation: 'Defense in depth! Multiple layers reduce DB load.',
            skillsAssessed: ['Infrastructure', 'Scalability', 'Technical Analysis']
          },
          {
            id: 'opt-2',
            text: 'Just upgrade to biggest database instance',
            outcome: 'poor',
            explanation: 'Expensive and still has limits. Caching is more scalable.',
            skillsAssessed: ['Infrastructure']
          },
          {
            id: 'opt-3',
            text: 'Add more read replicas',
            outcome: 'suboptimal',
            explanation: 'Helps reads but primary still bottlenecked. Need caching.',
            skillsAssessed: ['Scalability']
          }
        ]
      },
      {
        id: 'monitoring',
        phase: 'Real-time Monitoring',
        situation: 'Traffic spike started. How do you monitor system health?',
        correctOptionId: 'opt-2',
        learningObjective: 'Comprehensive observability during traffic spike',
        options: [
          {
            id: 'opt-1',
            text: 'Watch CPU graphs',
            outcome: 'poor',
            explanation: 'Too narrow. Need comprehensive metrics and user impact.',
            skillsAssessed: ['Monitoring']
          },
          {
            id: 'opt-2',
            text: 'Monitor error rates, latency percentiles, resource utilization, business metrics (signups, purchases)',
            outcome: 'optimal',
            explanation: 'Complete picture! Technical and business metrics together.',
            skillsAssessed: ['Monitoring', 'Infrastructure', 'Decision Making']
          },
          {
            id: 'opt-3',
            text: 'Check server logs',
            outcome: 'suboptimal',
            explanation: 'Too manual. Need real-time dashboards and alerts.',
            skillsAssessed: ['Monitoring']
          }
        ]
      },
      {
        id: 'cost-optimization',
        phase: 'Post-Event Optimization',
        situation: 'Traffic spike over. Cloud bill is 8x normal. How do you optimize?',
        correctOptionId: 'opt-1',
        learningObjective: 'Balance performance with cost efficiency',
        options: [
          {
            id: 'opt-1',
            text: 'Scale down to 2x normal capacity, keep auto-scaling, use spot instances, optimize cache TTLs',
            outcome: 'optimal',
            explanation: 'Smart cost management! Prepared for spikes but not wasteful.',
            skillsAssessed: ['Cost Optimization', 'Infrastructure', 'Cloud Architecture']
          },
          {
            id: 'opt-2',
            text: 'Scale everything back to pre-spike levels',
            outcome: 'poor',
            explanation: 'Risky. Viral success may continue. Keep some buffer.',
            skillsAssessed: ['Infrastructure']
          },
          {
            id: 'opt-3',
            text: 'Keep everything at spike levels',
            outcome: 'suboptimal',
            explanation: 'Too expensive. Use auto-scaling instead of static over-provisioning.',
            skillsAssessed: ['Cost Optimization']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 8,
      complexity: 8,
      stakeholderCount: 5,
      technicalDepth: 9,
      communicationLoad: 6
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 8
  },
  {
    id: 'team-onboarding',
    title: 'Engineering Team Onboarding',
    baseDifficulty: 'intermediate',
    currentDifficulty: 5,
    category: 'leadership',
    estimatedTime: 30,
    skills: ['Team Management', 'Documentation', 'Process Design'],
    prerequisites: ['Team lead experience'],
    description: 'Design and execute onboarding for 5 new engineers joining the team',
    scenario: 'You\'re hiring 5 engineers over the next month. Current onboarding is ad-hoc: senior devs are pulled away from work for days, new hires feel lost, and time-to-productivity is 8 weeks. AI adapts based on your onboarding design skills.',
    challenges: [
      {
        id: 'onboarding-structure',
        phase: 'Program Design',
        situation: 'Design a scalable onboarding program. What\'s your approach?',
        correctOptionId: 'opt-1',
        learningObjective: 'Systematic onboarding reduces time-to-productivity',
        options: [
          {
            id: 'opt-1',
            text: 'Create onboarding docs, video tutorials, starter tasks, buddy system, 30/60/90 day checkpoints',
            outcome: 'optimal',
            explanation: 'Comprehensive onboarding! Self-service plus human support.',
            skillsAssessed: ['Team Management', 'Process Design', 'Documentation']
          },
          {
            id: 'opt-2',
            text: 'Pair each new hire with a senior dev for 2 weeks',
            outcome: 'poor',
            explanation: 'Doesn\'t scale. You\'ll burn out senior devs.',
            skillsAssessed: ['Team Management']
          },
          {
            id: 'opt-3',
            text: 'Give them the wiki and let them figure it out',
            outcome: 'suboptimal',
            explanation: 'Too sink-or-swim. Structured onboarding accelerates productivity.',
            skillsAssessed: ['Process Design']
          }
        ]
      },
      {
        id: 'first-tasks',
        phase: 'Initial Contributions',
        situation: 'What should new engineers work on in their first week?',
        correctOptionId: 'opt-2',
        learningObjective: 'Low-risk high-learning starter tasks',
        options: [
          {
            id: 'opt-1',
            text: 'Just shadow the team',
            outcome: 'poor',
            explanation: 'Too passive. Hands-on learning is more effective.',
            skillsAssessed: ['Team Management']
          },
          {
            id: 'opt-2',
            text: 'Small bugs with good documentation, documentation improvements, tool setup automation',
            outcome: 'optimal',
            explanation: 'Perfect! Low-risk tasks that teach the codebase and tools.',
            skillsAssessed: ['Team Management', 'Process Design', 'Mentorship']
          },
          {
            id: 'opt-3',
            text: 'Assign them to the current sprint',
            outcome: 'suboptimal',
            explanation: 'Too fast. They need foundation before sprint work.',
            skillsAssessed: ['Team Management']
          }
        ]
      },
      {
        id: 'knowledge-sharing',
        phase: 'Knowledge Transfer',
        situation: 'Key system knowledge is in senior devs\' heads. How do you capture it?',
        correctOptionId: 'opt-1',
        learningObjective: 'Documentation as team scaling tool',
        options: [
          {
            id: 'opt-1',
            text: 'Architecture decision records, recorded tech talks, pair programming sessions, documentation sprints',
            outcome: 'optimal',
            explanation: 'Multi-format knowledge sharing! Different learning styles.',
            skillsAssessed: ['Documentation', 'Process Design', 'Team Management']
          },
          {
            id: 'opt-2',
            text: 'Schedule 1-on-1s with each senior dev',
            outcome: 'poor',
            explanation: 'Doesn\'t scale. Documentation makes knowledge accessible to all.',
            skillsAssessed: ['Team Management']
          },
          {
            id: 'opt-3',
            text: 'Create a wiki page',
            outcome: 'suboptimal',
            explanation: 'Good start, but static docs get stale. Need active knowledge sharing.',
            skillsAssessed: ['Documentation']
          }
        ]
      },
      {
        id: 'feedback-loops',
        phase: 'Continuous Improvement',
        situation: 'How do you improve the onboarding program over time?',
        correctOptionId: 'opt-1',
        learningObjective: 'Iterate on processes with feedback',
        options: [
          {
            id: 'opt-1',
            text: 'Survey new hires at 30/60/90 days, track time-to-first-PR, update docs based on questions',
            outcome: 'optimal',
            explanation: 'Data-driven improvement! Metrics and feedback drive iteration.',
            skillsAssessed: ['Process Design', 'Team Management', 'Process Improvement']
          },
          {
            id: 'opt-2',
            text: 'Keep the program as-is once created',
            outcome: 'poor',
            explanation: 'Programs need iteration. Company and team evolve.',
            skillsAssessed: ['Process Design']
          },
          {
            id: 'opt-3',
            text: 'Ask for feedback informally',
            outcome: 'suboptimal',
            explanation: 'Informal feedback is biased. Need structured data collection.',
            skillsAssessed: ['Process Design']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 4,
      complexity: 6,
      stakeholderCount: 6,
      technicalDepth: 4,
      communicationLoad: 7
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 6
  },
  {
    id: 'disaster-recovery',
    title: 'Disaster Recovery Execution',
    baseDifficulty: 'expert',
    currentDifficulty: 9,
    category: 'specialized',
    estimatedTime: 50,
    skills: ['Disaster Recovery', 'Crisis Management', 'Infrastructure'],
    prerequisites: ['DR planning knowledge'],
    description: 'Execute disaster recovery after complete data center failure',
    scenario: 'Your primary AWS region went down (regional outage). All services offline. Customers can\'t access the product. You have backups in another region but never tested failover. Board is watching. AI adapts based on your DR execution skills.',
    challenges: [
      {
        id: 'initial-response',
        phase: 'Crisis Declaration',
        situation: 'Primary region down for 15 minutes. What\'s your first action?',
        correctOptionId: 'opt-2',
        learningObjective: 'Decisive crisis response with clear communication',
        options: [
          {
            id: 'opt-1',
            text: 'Wait for AWS to fix the region',
            outcome: 'poor',
            explanation: 'Too passive. Regional outages can last hours. Need DR plan.',
            skillsAssessed: ['Crisis Management']
          },
          {
            id: 'opt-2',
            text: 'Declare disaster, activate DR team, communicate status page, begin failover procedures',
            outcome: 'optimal',
            explanation: 'Decisive leadership! Clear process and communication.',
            skillsAssessed: ['Crisis Management', 'Disaster Recovery', 'Communication']
          },
          {
            id: 'opt-3',
            text: 'Start manually rebuilding in another region',
            outcome: 'suboptimal',
            explanation: 'Too slow. Need coordinated DR plan, not ad-hoc rebuild.',
            skillsAssessed: ['Disaster Recovery']
          }
        ]
      },
      {
        id: 'data-recovery',
        phase: 'Data Restoration',
        situation: 'Latest backup is 4 hours old. How do you handle data loss?',
        correctOptionId: 'opt-1',
        learningObjective: 'Balance recovery speed with data integrity',
        options: [
          {
            id: 'opt-1',
            text: 'Restore from backup, analyze transaction logs for point-in-time recovery, communicate data loss window',
            outcome: 'optimal',
            explanation: 'Best effort recovery! Minimize data loss while being transparent.',
            skillsAssessed: ['Disaster Recovery', 'Technical Analysis', 'Communication']
          },
          {
            id: 'opt-2',
            text: 'Restore backup and hope for the best',
            outcome: 'poor',
            explanation: 'Ignores potential data loss. Need to analyze and communicate.',
            skillsAssessed: ['Disaster Recovery']
          },
          {
            id: 'opt-3',
            text: 'Wait for primary region to recover to avoid data loss',
            outcome: 'suboptimal',
            explanation: 'Extended outage worse than 4 hours data loss. Need risk assessment.',
            skillsAssessed: ['Decision Making']
          }
        ]
      },
      {
        id: 'service-restoration',
        phase: 'Service Failover',
        situation: 'DR environment needs DNS updates, database migration, service validation. What order?',
        correctOptionId: 'opt-2',
        learningObjective: 'Systematic disaster recovery execution',
        options: [
          {
            id: 'opt-1',
            text: 'Update DNS immediately',
            outcome: 'poor',
            explanation: 'Premature. Validate services work before directing traffic.',
            skillsAssessed: ['Disaster Recovery']
          },
          {
            id: 'opt-2',
            text: 'Restore databases, validate services with test traffic, update DNS, monitor error rates',
            outcome: 'optimal',
            explanation: 'Proper DR sequence! Validate before cutover, monitor after.',
            skillsAssessed: ['Disaster Recovery', 'Infrastructure', 'Crisis Management']
          },
          {
            id: 'opt-3',
            text: 'Bring up services and DNS simultaneously',
            outcome: 'suboptimal',
            explanation: 'Risky. Staged approach with validation is safer.',
            skillsAssessed: ['Disaster Recovery']
          }
        ]
      },
      {
        id: 'post-recovery',
        phase: 'Post-Disaster Review',
        situation: 'Services restored after 2 hours. What\'s next?',
        correctOptionId: 'opt-1',
        learningObjective: 'Learn from disaster to improve resilience',
        options: [
          {
            id: 'opt-1',
            text: 'Detailed post-mortem, test DR plan monthly, implement multi-region active-active, improve RTO/RPO',
            outcome: 'optimal',
            explanation: 'Comprehensive resilience improvements! Learn and harden systems.',
            skillsAssessed: ['Process Improvement', 'Disaster Recovery', 'Infrastructure']
          },
          {
            id: 'opt-2',
            text: 'Document what happened and move on',
            outcome: 'poor',
            explanation: 'Missed learning opportunity. Need systemic improvements.',
            skillsAssessed: ['Process Improvement']
          },
          {
            id: 'opt-3',
            text: 'Test the DR plan once',
            outcome: 'suboptimal',
            explanation: 'One-time test isn\'t enough. Need regular DR drills.',
            skillsAssessed: ['Disaster Recovery']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 9,
      complexity: 9,
      stakeholderCount: 7,
      technicalDepth: 9,
      communicationLoad: 8
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 10
  },
  {
    id: 'observability-implementation',
    title: 'Observability Platform Implementation',
    baseDifficulty: 'advanced',
    currentDifficulty: 7,
    category: 'technical',
    estimatedTime: 35,
    skills: ['Observability', 'Monitoring', 'Platform Engineering'],
    prerequisites: ['Monitoring basics'],
    description: 'Build comprehensive observability across 50+ microservices',
    scenario: 'Teams can\'t debug production issues. Logs scattered across services. No distributed tracing. Metrics dashboard is a mess. You\'re tasked with implementing unified observability. AI adapts based on your observability design skills.',
    challenges: [
      {
        id: 'observability-strategy',
        phase: 'Platform Design',
        situation: 'Choose observability approach for 50+ microservices. What do you implement?',
        correctOptionId: 'opt-1',
        learningObjective: 'Three pillars of observability: logs, metrics, traces',
        options: [
          {
            id: 'opt-1',
            text: 'Centralized logging (ELK), metrics (Prometheus), distributed tracing (Jaeger), unified dashboards',
            outcome: 'optimal',
            explanation: 'Complete observability stack! All three pillars integrated.',
            skillsAssessed: ['Observability', 'Platform Engineering', 'System Design']
          },
          {
            id: 'opt-2',
            text: 'Just centralize logs',
            outcome: 'poor',
            explanation: 'Logs alone don\'t show system behavior or request flows.',
            skillsAssessed: ['Observability']
          },
          {
            id: 'opt-3',
            text: 'Buy expensive all-in-one vendor solution',
            outcome: 'suboptimal',
            explanation: 'May work but expensive and creates vendor lock-in. Open-source alternative exists.',
            skillsAssessed: ['Platform Engineering']
          }
        ]
      },
      {
        id: 'instrumentation',
        phase: 'Service Instrumentation',
        situation: 'How do you instrument 50+ services without disrupting teams?',
        correctOptionId: 'opt-2',
        learningObjective: 'Platform capabilities via shared libraries and auto-instrumentation',
        options: [
          {
            id: 'opt-1',
            text: 'Mandate each team adds instrumentation manually',
            outcome: 'poor',
            explanation: 'Too slow and inconsistent. Platform should provide easy tooling.',
            skillsAssessed: ['Platform Engineering']
          },
          {
            id: 'opt-2',
            text: 'Shared libraries with auto-instrumentation, service mesh for tracing, structured logging templates',
            outcome: 'optimal',
            explanation: 'Platform thinking! Make observability automatic and consistent.',
            skillsAssessed: ['Observability', 'Platform Engineering', 'Process Design']
          },
          {
            id: 'opt-3',
            text: 'Instrument a few critical services only',
            outcome: 'suboptimal',
            explanation: 'Partial visibility creates blind spots. Need comprehensive coverage.',
            skillsAssessed: ['Observability']
          }
        ]
      },
      {
        id: 'alerting-strategy',
        phase: 'Alerting & SLOs',
        situation: 'Teams get alert fatigue from noisy alerts. How do you fix this?',
        correctOptionId: 'opt-1',
        learningObjective: 'SLO-based alerting reduces noise',
        options: [
          {
            id: 'opt-1',
            text: 'Define SLOs (99.9% availability, p95 latency), alert on SLO burn rate, error budgets',
            outcome: 'optimal',
            explanation: 'Modern SRE practices! Alert on user impact, not infrastructure blips.',
            skillsAssessed: ['Observability', 'SRE', 'Monitoring']
          },
          {
            id: 'opt-2',
            text: 'Disable all alerts',
            outcome: 'poor',
            explanation: 'No alerts means no incident response. Need better signal, not silence.',
            skillsAssessed: ['Monitoring']
          },
          {
            id: 'opt-3',
            text: 'Reduce alert thresholds',
            outcome: 'suboptimal',
            explanation: 'Doesn\'t solve root cause. SLO-based alerting is more effective.',
            skillsAssessed: ['Monitoring']
          }
        ]
      },
      {
        id: 'adoption',
        phase: 'Team Adoption',
        situation: 'Observability platform ready. How do you drive adoption across 15 teams?',
        correctOptionId: 'opt-2',
        learningObjective: 'Internal platform adoption requires enablement',
        options: [
          {
            id: 'opt-1',
            text: 'Send announcement email',
            outcome: 'poor',
            explanation: 'Too passive. Need active enablement and demonstration of value.',
            skillsAssessed: ['Communication']
          },
          {
            id: 'opt-2',
            text: 'Create docs, video tutorials, office hours, onboard pilot teams, showcase success stories',
            outcome: 'optimal',
            explanation: 'Full enablement program! Education, support, and social proof.',
            skillsAssessed: ['Platform Engineering', 'Communication', 'Process Design']
          },
          {
            id: 'opt-3',
            text: 'Mandate usage with deadline',
            outcome: 'suboptimal',
            explanation: 'Mandates create resentment. Better to demonstrate value and support adoption.',
            skillsAssessed: ['Communication']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 5,
      complexity: 8,
      stakeholderCount: 15,
      technicalDepth: 8,
      communicationLoad: 7
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 8
  },
  {
    id: 'cloud-migration',
    title: 'Cloud Migration Strategy',
    baseDifficulty: 'advanced',
    currentDifficulty: 7,
    category: 'technical',
    estimatedTime: 45,
    skills: ['Cloud Architecture', 'Migration Planning', 'Risk Management'],
    prerequisites: ['Cloud fundamentals'],
    description: 'Migrate legacy on-premise application to cloud with zero downtime',
    scenario: 'Your company is migrating a 10-year-old monolithic application from on-premise to AWS. Constraints: zero downtime, data compliance (GDPR), $500k budget, 6-month timeline. AI adapts based on your migration strategy skills.',
    challenges: [
      {
        id: 'migration-strategy',
        phase: 'Strategy Selection',
        situation: 'Choose migration approach: lift-and-shift, replatform, or rearchitect?',
        correctOptionId: 'opt-2',
        learningObjective: 'Balance speed, cost, and modernization in migration decisions',
        options: [
          {
            id: 'opt-1',
            text: 'Full rearchitect to microservices immediately',
            outcome: 'poor',
            explanation: 'Too risky and expensive. Big rewrites often fail. Incremental approach is safer.',
            skillsAssessed: ['Migration Planning']
          },
          {
            id: 'opt-2',
            text: 'Replatform to cloud-native services (RDS, managed cache), refactor iteratively post-migration',
            outcome: 'optimal',
            explanation: 'Smart hybrid approach! Get cloud benefits quickly, modernize incrementally.',
            skillsAssessed: ['Cloud Architecture', 'Migration Planning', 'Risk Management']
          },
          {
            id: 'opt-3',
            text: 'Pure lift-and-shift with VMs',
            outcome: 'suboptimal',
            explanation: 'Misses cloud benefits. Not leveraging managed services wastes opportunity.',
            skillsAssessed: ['Cloud Architecture']
          }
        ]
      },
      {
        id: 'data-migration',
        phase: 'Data Migration',
        situation: '2TB database needs migration. How do you ensure zero downtime?',
        correctOptionId: 'opt-1',
        learningObjective: 'Database migration techniques for minimal downtime',
        options: [
          {
            id: 'opt-1',
            text: 'Database replication to cloud, sync until consistent, quick cutover during low-traffic window',
            outcome: 'optimal',
            explanation: 'Industry best practice! Continuous replication minimizes cutover downtime.',
            skillsAssessed: ['Migration Planning', 'Technical Analysis', 'Risk Management']
          },
          {
            id: 'opt-2',
            text: 'Schedule maintenance window for full export/import',
            outcome: 'poor',
            explanation: 'Violates zero-downtime requirement. 2TB takes hours to migrate.',
            skillsAssessed: ['Migration Planning']
          },
          {
            id: 'opt-3',
            text: 'Migrate in phases by table',
            outcome: 'suboptimal',
            explanation: 'Complex with foreign keys. Replication is cleaner solution.',
            skillsAssessed: ['Migration Planning']
          }
        ]
      },
      {
        id: 'rollback-plan',
        phase: 'Risk Mitigation',
        situation: 'Migration cutover started but latency is 3x expected. What do you do?',
        correctOptionId: 'opt-1',
        learningObjective: 'Have rollback plan ready for migration failures',
        options: [
          {
            id: 'opt-1',
            text: 'Execute rollback plan: flip traffic back to on-premise, investigate latency issue',
            outcome: 'optimal',
            explanation: 'Perfect! Always have tested rollback plan for migrations.',
            skillsAssessed: ['Risk Management', 'Migration Planning', 'Decision Making']
          },
          {
            id: 'opt-2',
            text: 'Keep going and debug in production',
            outcome: 'poor',
            explanation: 'Dangerous! User impact worsens. Rollback and fix properly.',
            skillsAssessed: ['Risk Management']
          },
          {
            id: 'opt-3',
            text: 'Add more resources to cloud environment',
            outcome: 'suboptimal',
            explanation: 'Might not help. Need to understand root cause first.',
            skillsAssessed: ['Migration Planning']
          }
        ]
      },
      {
        id: 'post-migration',
        phase: 'Post-Migration Optimization',
        situation: 'Migration successful. Cloud costs are 40% higher than projected. How do you optimize?',
        correctOptionId: 'opt-2',
        learningObjective: 'Post-migration cost optimization',
        options: [
          {
            id: 'opt-1',
            text: 'Move back on-premise',
            outcome: 'poor',
            explanation: 'Wasteful. Optimize cloud usage before abandoning migration.',
            skillsAssessed: ['Cost Optimization']
          },
          {
            id: 'opt-2',
            text: 'Reserved instances, auto-scaling, rightsizing, S3 lifecycle policies, cost monitoring',
            outcome: 'optimal',
            explanation: 'Comprehensive cost optimization! Multiple levers for savings.',
            skillsAssessed: ['Cost Optimization', 'Cloud Architecture', 'Process Improvement']
          },
          {
            id: 'opt-3',
            text: 'Downsize all instances by 50%',
            outcome: 'suboptimal',
            explanation: 'Too blunt. Need data-driven rightsizing per service.',
            skillsAssessed: ['Cost Optimization']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 6,
      complexity: 8,
      stakeholderCount: 6,
      technicalDepth: 9,
      communicationLoad: 7
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 8
  },
  {
    id: 'kubernetes-cluster-management',
    title: 'Kubernetes Cluster Management',
    baseDifficulty: 'expert',
    currentDifficulty: 8,
    category: 'technical',
    estimatedTime: 40,
    skills: ['Kubernetes', 'Container Orchestration', 'Platform Engineering'],
    prerequisites: ['Kubernetes basics'],
    description: 'Manage production Kubernetes cluster serving 100+ microservices',
    scenario: 'Your company runs 100+ microservices on Kubernetes. Cluster has stability issues: pods randomly evicted, nodes hitting resource limits, network policies causing connectivity issues. AI adapts based on your Kubernetes management skills.',
    challenges: [
      {
        id: 'resource-management',
        phase: 'Resource Optimization',
        situation: 'Pods getting evicted due to resource pressure. How do you fix this?',
        correctOptionId: 'opt-1',
        learningObjective: 'Proper Kubernetes resource requests and limits',
        options: [
          {
            id: 'opt-1',
            text: 'Audit resource requests/limits, set pod priority classes, add cluster nodes, enable autoscaling',
            outcome: 'optimal',
            explanation: 'Comprehensive approach! Proper resource management plus capacity.',
            skillsAssessed: ['Kubernetes', 'Platform Engineering', 'Resource Management']
          },
          {
            id: 'opt-2',
            text: 'Remove all resource limits',
            outcome: 'poor',
            explanation: 'Dangerous! One bad service can starve entire cluster.',
            skillsAssessed: ['Kubernetes']
          },
          {
            id: 'opt-3',
            text: 'Just add more nodes',
            outcome: 'suboptimal',
            explanation: 'Treats symptom. Need proper resource configuration first.',
            skillsAssessed: ['Resource Management']
          }
        ]
      },
      {
        id: 'network-policies',
        phase: 'Network Troubleshooting',
        situation: 'Services can\'t communicate after network policies enabled. Debugging strategy?',
        correctOptionId: 'opt-2',
        learningObjective: 'Systematic Kubernetes network debugging',
        options: [
          {
            id: 'opt-1',
            text: 'Remove all network policies',
            outcome: 'poor',
            explanation: 'Security regression. Need to fix policies, not remove them.',
            skillsAssessed: ['Kubernetes']
          },
          {
            id: 'opt-2',
            text: 'Test connectivity with debug pods, check policy selectors, validate DNS, trace packet flow',
            outcome: 'optimal',
            explanation: 'Systematic debugging! Network policies require careful testing.',
            skillsAssessed: ['Kubernetes', 'Technical Analysis', 'Networking']
          },
          {
            id: 'opt-3',
            text: 'Restart all pods',
            outcome: 'suboptimal',
            explanation: 'Won\'t fix policy issues. Need to correct policy configuration.',
            skillsAssessed: ['Kubernetes']
          }
        ]
      },
      {
        id: 'upgrade-strategy',
        phase: 'Cluster Upgrades',
        situation: 'Kubernetes version is 2 versions behind. How do you upgrade safely?',
        correctOptionId: 'opt-1',
        learningObjective: 'Safe Kubernetes upgrade procedures',
        options: [
          {
            id: 'opt-1',
            text: 'Test in staging, upgrade control plane, upgrade nodes with rolling updates, monitor for issues',
            outcome: 'optimal',
            explanation: 'Best practice upgrade process! Staged and monitored.',
            skillsAssessed: ['Kubernetes', 'Risk Management', 'Platform Engineering']
          },
          {
            id: 'opt-2',
            text: 'Upgrade everything at once in production',
            outcome: 'poor',
            explanation: 'Extremely risky. Always test and roll out incrementally.',
            skillsAssessed: ['Risk Management']
          },
          {
            id: 'opt-3',
            text: 'Build new cluster and migrate',
            outcome: 'suboptimal',
            explanation: 'Too complex for version upgrade. In-place upgrade is standard.',
            skillsAssessed: ['Kubernetes']
          }
        ]
      },
      {
        id: 'monitoring',
        phase: 'Observability Setup',
        situation: 'How do you monitor 100+ microservices in Kubernetes?',
        correctOptionId: 'opt-1',
        learningObjective: 'Comprehensive Kubernetes observability',
        options: [
          {
            id: 'opt-1',
            text: 'Prometheus for metrics, Loki for logs, Jaeger for tracing, Grafana dashboards, alerting on SLOs',
            outcome: 'optimal',
            explanation: 'Complete cloud-native observability stack! Industry standard.',
            skillsAssessed: ['Kubernetes', 'Observability', 'Platform Engineering']
          },
          {
            id: 'opt-2',
            text: 'Check logs manually',
            outcome: 'poor',
            explanation: 'Doesn\'t scale. Need automated monitoring at this scale.',
            skillsAssessed: ['Observability']
          },
          {
            id: 'opt-3',
            text: 'Just use kubectl commands',
            outcome: 'suboptimal',
            explanation: 'Manual and reactive. Need proactive monitoring and alerting.',
            skillsAssessed: ['Kubernetes']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 6,
      complexity: 9,
      stakeholderCount: 4,
      technicalDepth: 10,
      communicationLoad: 5
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 9
  },
  {
    id: 'compliance-automation',
    title: 'Compliance & Security Automation',
    baseDifficulty: 'advanced',
    currentDifficulty: 7,
    category: 'specialized',
    estimatedTime: 35,
    skills: ['Compliance', 'Security Automation', 'Policy as Code'],
    prerequisites: ['Security fundamentals'],
    description: 'Implement automated compliance controls for SOC 2 certification',
    scenario: 'Company pursuing SOC 2 Type 2 certification. Manual compliance checks are error-prone and slow. Auditors need evidence of continuous compliance, not point-in-time checks. AI adapts based on your compliance automation skills.',
    challenges: [
      {
        id: 'policy-as-code',
        phase: 'Automated Controls',
        situation: 'How do you automate compliance checks across infrastructure?',
        correctOptionId: 'opt-1',
        learningObjective: 'Policy-as-code for automated compliance',
        options: [
          {
            id: 'opt-1',
            text: 'OPA/Gatekeeper for Kubernetes, AWS Config rules, automated security scanning in CI/CD, IaC validation',
            outcome: 'optimal',
            explanation: 'Comprehensive automation! Policy-as-code at every layer.',
            skillsAssessed: ['Compliance', 'Security Automation', 'Policy as Code']
          },
          {
            id: 'opt-2',
            text: 'Manual quarterly compliance reviews',
            outcome: 'poor',
            explanation: 'Too infrequent. SOC 2 requires continuous controls.',
            skillsAssessed: ['Compliance']
          },
          {
            id: 'opt-3',
            text: 'Security team reviews all changes',
            outcome: 'suboptimal',
            explanation: 'Bottleneck and doesn\'t scale. Automation enables speed with safety.',
            skillsAssessed: ['Security Automation']
          }
        ]
      },
      {
        id: 'audit-evidence',
        phase: 'Evidence Collection',
        situation: 'Auditors need proof of access controls, encryption, and monitoring. How do you provide this?',
        correctOptionId: 'opt-2',
        learningObjective: 'Automated audit evidence collection',
        options: [
          {
            id: 'opt-1',
            text: 'Manually screenshot configurations',
            outcome: 'poor',
            explanation: 'Not scalable or reliable. Need automated evidence collection.',
            skillsAssessed: ['Compliance']
          },
          {
            id: 'opt-2',
            text: 'Compliance dashboard with automated reporting, audit logs, policy enforcement logs, exception tracking',
            outcome: 'optimal',
            explanation: 'Modern compliance! Automated evidence generation for auditors.',
            skillsAssessed: ['Compliance', 'Automation', 'Process Design']
          },
          {
            id: 'opt-3',
            text: 'Export CloudTrail logs manually',
            outcome: 'suboptimal',
            explanation: 'Partial solution. Need unified compliance reporting.',
            skillsAssessed: ['Compliance']
          }
        ]
      },
      {
        id: 'remediation',
        phase: 'Automated Remediation',
        situation: 'Compliance scan found 50 S3 buckets without encryption. How do you fix this?',
        correctOptionId: 'opt-1',
        learningObjective: 'Automated remediation with safety checks',
        options: [
          {
            id: 'opt-1',
            text: 'Automated remediation script with approval workflow, test in staging, rollout with monitoring',
            outcome: 'optimal',
            explanation: 'Safe automation! Automated with human approval for safety.',
            skillsAssessed: ['Security Automation', 'Risk Management', 'Process Design']
          },
          {
            id: 'opt-2',
            text: 'Manually enable encryption on each bucket',
            outcome: 'poor',
            explanation: 'Slow and error-prone. Automation prevents recurrence.',
            skillsAssessed: ['Automation']
          },
          {
            id: 'opt-3',
            text: 'Auto-enable encryption immediately without testing',
            outcome: 'suboptimal',
            explanation: 'Too risky. Need testing and gradual rollout.',
            skillsAssessed: ['Risk Management']
          }
        ]
      },
      {
        id: 'continuous-compliance',
        phase: 'Ongoing Compliance',
        situation: 'How do you maintain compliance as infrastructure evolves?',
        correctOptionId: 'opt-1',
        learningObjective: 'Shift-left compliance into development',
        options: [
          {
            id: 'opt-1',
            text: 'Policy gates in CI/CD, pre-commit hooks, compliance training, automated drift detection',
            outcome: 'optimal',
            explanation: 'Shift-left compliance! Catch issues before production.',
            skillsAssessed: ['Compliance', 'Security Automation', 'Process Design']
          },
          {
            id: 'opt-2',
            text: 'Monthly compliance scans',
            outcome: 'poor',
            explanation: 'Too late. Issues may be in production for weeks.',
            skillsAssessed: ['Compliance']
          },
          {
            id: 'opt-3',
            text: 'Block all infrastructure changes',
            outcome: 'suboptimal',
            explanation: 'Stifles innovation. Automated compliance enables safe velocity.',
            skillsAssessed: ['Process Design']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 5,
      complexity: 7,
      stakeholderCount: 5,
      technicalDepth: 7,
      communicationLoad: 6
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 8
  },
  {
    id: 'incident-postmortem',
    title: 'Incident Post-Mortem Facilitation',
    baseDifficulty: 'intermediate',
    currentDifficulty: 6,
    category: 'leadership',
    estimatedTime: 30,
    skills: ['Incident Management', 'Blameless Culture', 'Process Improvement'],
    prerequisites: ['Incident response basics'],
    description: 'Facilitate blameless post-mortem for major incident',
    scenario: 'Major outage lasted 4 hours, impacted $500k revenue. Teams are defensive, finger-pointing at each other. You need to facilitate a productive post-mortem that drives improvements. AI adapts based on your post-mortem facilitation skills.',
    challenges: [
      {
        id: 'blameless-culture',
        phase: 'Setting the Tone',
        situation: 'Post-mortem meeting starts with blame. "QA should have caught this!" How do you respond?',
        correctOptionId: 'opt-1',
        learningObjective: 'Establish psychological safety for learning',
        options: [
          {
            id: 'opt-1',
            text: '"We focus on systems, not people. What process failed to prevent this from reaching production?"',
            outcome: 'optimal',
            explanation: 'Perfect facilitation! Redirect to systemic issues, not individuals.',
            skillsAssessed: ['Blameless Culture', 'Incident Management', 'Leadership']
          },
          {
            id: 'opt-2',
            text: 'Let the blame discussion continue',
            outcome: 'poor',
            explanation: 'Blame destroys psychological safety. No one will be honest.',
            skillsAssessed: ['Leadership']
          },
          {
            id: 'opt-3',
            text: '"Let\'s not point fingers, just move on"',
            outcome: 'suboptimal',
            explanation: 'Too dismissive. Need to actively redirect to productive framing.',
            skillsAssessed: ['Blameless Culture']
          }
        ]
      },
      {
        id: 'timeline-construction',
        phase: 'Incident Timeline',
        situation: 'Team members have conflicting memories of event timing. How do you build accurate timeline?',
        correctOptionId: 'opt-2',
        learningObjective: 'Data-driven timeline from logs and metrics',
        options: [
          {
            id: 'opt-1',
            text: 'Trust the loudest voice',
            outcome: 'poor',
            explanation: 'Memory is unreliable. Use objective data.',
            skillsAssessed: ['Incident Management']
          },
          {
            id: 'opt-2',
            text: 'Correlate logs, metrics, alerts, Slack messages, deployment timestamps for objective timeline',
            outcome: 'optimal',
            explanation: 'Data-driven approach! Logs don\'t lie.',
            skillsAssessed: ['Incident Management', 'Technical Analysis', 'Process Design']
          },
          {
            id: 'opt-3',
            text: 'Average everyone\'s estimate',
            outcome: 'suboptimal',
            explanation: 'Still subjective. Need objective data sources.',
            skillsAssessed: ['Incident Management']
          }
        ]
      },
      {
        id: 'root-cause-analysis',
        phase: 'Finding Root Causes',
        situation: 'Initial diagnosis: "developer made a typo." Is this the root cause?',
        correctOptionId: 'opt-1',
        learningObjective: 'Five whys to systemic root causes',
        options: [
          {
            id: 'opt-1',
            text: 'Use 5 whys: Why did typo reach prod? No code review? Why not? Process not enforced? Why? Etc.',
            outcome: 'optimal',
            explanation: 'Excellent root cause analysis! Dig to systemic issues.',
            skillsAssessed: ['Incident Management', 'Process Improvement', 'Critical Thinking']
          },
          {
            id: 'opt-2',
            text: 'Accept "typo" as root cause',
            outcome: 'poor',
            explanation: 'Too shallow. Human error is never root cause. Systems should prevent errors.',
            skillsAssessed: ['Incident Management']
          },
          {
            id: 'opt-3',
            text: 'Blame the developer',
            outcome: 'suboptimal',
            explanation: 'Violates blameless principle. Focus on process gaps.',
            skillsAssessed: ['Blameless Culture']
          }
        ]
      },
      {
        id: 'action-items',
        phase: 'Action Items',
        situation: 'Team suggests 20 action items. How do you prioritize?',
        correctOptionId: 'opt-2',
        learningObjective: 'Focus on high-impact prevention measures',
        options: [
          {
            id: 'opt-1',
            text: 'Assign all 20 items',
            outcome: 'poor',
            explanation: 'Too many means none get done. Prioritize ruthlessly.',
            skillsAssessed: ['Process Improvement']
          },
          {
            id: 'opt-2',
            text: 'Focus on 3-5 high-impact items with clear owners and deadlines, track in project board',
            outcome: 'optimal',
            explanation: 'Focused execution! Fewer items with accountability.',
            skillsAssessed: ['Process Improvement', 'Incident Management', 'Leadership']
          },
          {
            id: 'opt-3',
            text: 'Do the quick wins only',
            outcome: 'suboptimal',
            explanation: 'May miss important systemic fixes. Need impact-based prioritization.',
            skillsAssessed: ['Process Improvement']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 4,
      complexity: 6,
      stakeholderCount: 7,
      technicalDepth: 5,
      communicationLoad: 8
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 7
  },
  {
    id: 'technical-debt-management',
    title: 'Technical Debt Management',
    baseDifficulty: 'intermediate',
    currentDifficulty: 6,
    category: 'leadership',
    estimatedTime: 35,
    skills: ['Technical Leadership', 'Prioritization', 'Stakeholder Management'],
    prerequisites: ['Engineering leadership'],
    description: 'Balance technical debt paydown with feature development',
    scenario: 'Engineering team velocity decreasing. Tech debt piling up: legacy code, outdated dependencies, missing tests. Product wants features, engineering wants refactoring time. You need to build consensus. AI adapts based on your technical debt management skills.',
    challenges: [
      {
        id: 'debt-quantification',
        phase: 'Making Debt Visible',
        situation: 'Product says "tech debt isn\'t a priority." How do you make the business case?',
        correctOptionId: 'opt-1',
        learningObjective: 'Quantify technical debt in business terms',
        options: [
          {
            id: 'opt-1',
            text: 'Show data: velocity trending down 20%, incident rate up 3x, time-to-market increasing',
            outcome: 'optimal',
            explanation: 'Business language! Connect tech debt to outcomes leadership cares about.',
            skillsAssessed: ['Technical Leadership', 'Stakeholder Management', 'Communication']
          },
          {
            id: 'opt-2',
            text: '"Trust us, the code is bad"',
            outcome: 'poor',
            explanation: 'Too vague. Need quantified business impact.',
            skillsAssessed: ['Communication']
          },
          {
            id: 'opt-3',
            text: 'Secretly work on tech debt',
            outcome: 'suboptimal',
            explanation: 'Destroys trust. Transparency and alignment better.',
            skillsAssessed: ['Stakeholder Management']
          }
        ]
      },
      {
        id: 'balanced-approach',
        phase: 'Resource Allocation',
        situation: 'How do you allocate team capacity between features and tech debt?',
        correctOptionId: 'opt-2',
        learningObjective: 'Sustainable balance prevents debt accumulation',
        options: [
          {
            id: 'opt-1',
            text: '100% features, debt later',
            outcome: 'poor',
            explanation: 'Debt compounds. Later never comes.',
            skillsAssessed: ['Technical Leadership']
          },
          {
            id: 'opt-2',
            text: '20-30% capacity for tech debt, debt tickets in every sprint, refactor alongside features',
            outcome: 'optimal',
            explanation: 'Sustainable engineering! Continuous debt management.',
            skillsAssessed: ['Technical Leadership', 'Prioritization', 'Process Design']
          },
          {
            id: 'opt-3',
            text: 'Alternate between feature and debt sprints',
            outcome: 'suboptimal',
            explanation: 'Too batched. Continuous is better than episodic.',
            skillsAssessed: ['Prioritization']
          }
        ]
      },
      {
        id: 'prioritization',
        phase: 'Debt Prioritization',
        situation: 'Which technical debt should you tackle first?',
        correctOptionId: 'opt-1',
        learningObjective: 'Prioritize debt by impact and risk',
        options: [
          {
            id: 'opt-1',
            text: 'High-traffic code with most incidents, security vulnerabilities, blocker dependencies',
            outcome: 'optimal',
            explanation: 'Impact-driven! Fix what hurts most first.',
            skillsAssessed: ['Prioritization', 'Technical Leadership', 'Risk Management']
          },
          {
            id: 'opt-2',
            text: 'Whatever engineers find most annoying',
            outcome: 'poor',
            explanation: 'Subjective. Need data-driven prioritization.',
            skillsAssessed: ['Prioritization']
          },
          {
            id: 'opt-3',
            text: 'Oldest code first',
            outcome: 'suboptimal',
            explanation: 'Age doesn\'t equal impact. Prioritize by risk and value.',
            skillsAssessed: ['Prioritization']
          }
        ]
      },
      {
        id: 'prevention',
        phase: 'Preventing New Debt',
        situation: 'How do you prevent new technical debt from accumulating?',
        correctOptionId: 'opt-2',
        learningObjective: 'Engineering standards prevent debt creation',
        options: [
          {
            id: 'opt-1',
            text: 'Review all code personally',
            outcome: 'poor',
            explanation: 'Doesn\'t scale. Need systemic quality gates.',
            skillsAssessed: ['Process Design']
          },
          {
            id: 'opt-2',
            text: 'Code review standards, automated testing requirements, architecture review for big changes',
            outcome: 'optimal',
            explanation: 'Systematic quality! Build quality in from the start.',
            skillsAssessed: ['Process Design', 'Technical Leadership', 'Process Improvement']
          },
          {
            id: 'opt-3',
            text: 'Slow down feature development',
            outcome: 'suboptimal',
            explanation: 'False trade-off. Quality and speed can coexist with good practices.',
            skillsAssessed: ['Technical Leadership']
          }
        ]
      }
    ],
    adaptiveFactors: {
      timePressure: 5,
      complexity: 7,
      stakeholderCount: 5,
      technicalDepth: 6,
      communicationLoad: 7
    },
    performanceMetrics: {
      accuracy: 0,
      speed: 0,
      communication: 0,
      leadership: 0,
      technical: 0
    },
    nextRecommendedLevel: 7
  }
];