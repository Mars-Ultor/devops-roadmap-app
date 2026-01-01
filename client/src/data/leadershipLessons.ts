/**
 * Leadership & Command Training - Advanced Lessons
 * Crisis leadership, team coordination, and incident command
 */

import type { LeveledLessonContent } from '../types/lessonContent';

// ============================================
// LESSON 1: Crisis Communication Command
// ============================================

export const leadershipLesson1CrisisCommunication: LeveledLessonContent = {
  lessonId: 'leadership-lesson1-crisis-communication',
  
  baseLesson: {
    title: 'Crisis Communication Command',
    description: 'Master effective communication during major production incidents affecting millions of users.',
    learningObjectives: [
      'Establish clear communication channels during incidents',
      'Manage stakeholder expectations under pressure',
      'Coordinate cross-functional teams effectively',
      'Maintain team morale during crisis situations',
      'Provide structured status updates'
    ],
    prerequisites: [
      'Completed Week 12 curriculum',
      'Experience with incident response',
      'Understanding of DevOps team structures'
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 35,
      runGuided: 30,
      runIndependent: 25
    }
  },

  crawl: {
    introduction: 'You will learn crisis communication fundamentals by working through a simulated major outage with guided decision points.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Establish the incident command structure',
        command: 'Review incident command roles and select your communication strategy',
        explanation: 'The first critical action in any major incident is establishing clear command structure. As incident commander, you must define who communicates what to whom.',
        expectedOutput: 'Clear role assignments: Incident Commander, Technical Lead, Communications Lead, Scribe',
        validationCriteria: [
          'All critical roles assigned',
          'Communication channels established',
          'Escalation path defined'
        ],
        commonMistakes: [
          'Trying to handle all communication yourself',
          'Not establishing clear roles upfront',
          'Forgetting to assign a scribe for documentation'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Draft initial stakeholder communication',
        command: 'Create incident notification template addressing impact, actions, and timeline',
        explanation: 'First communication sets the tone. Include: what happened, impact scope, immediate actions, estimated timeline, next update time.',
        expectedOutput: 'Professional incident notification with all key elements',
        validationCriteria: [
          'Clear description of impact',
          'Specific actions being taken',
          'Realistic timeline estimate',
          'Next update commitment'
        ],
        commonMistakes: [
          'Being too technical for business stakeholders',
          'Overpromising on timeline',
          'Not committing to next update time'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Manage conflicting information from teams',
        command: 'Review three different team reports and synthesize consistent message',
        explanation: 'Teams often provide conflicting information during incidents. Your job is to verify facts, reconcile differences, and provide one clear truth.',
        validationCriteria: [
          'Identified conflicting reports',
          'Verified facts with technical leads',
          'Created unified status message',
          'Documented uncertainty appropriately'
        ],
        commonMistakes: [
          'Sharing unverified information',
          'Delaying update while waiting for perfect information',
          'Not acknowledging uncertainty'
        ]
      }
    ],
    exercises: [
      {
        id: 'crisis-comm-crawl-ex1',
        title: 'Incident Command Structure Setup',
        description: 'Set up complete incident command structure for a database outage affecting 1M users',
        difficulty: 'beginner',
        estimatedTime: 15,
        objectives: [
          'Define all incident command roles',
          'Establish communication channels',
          'Create escalation matrix'
        ],
        startingCondition: 'Major database outage detected, users experiencing errors, executives asking questions',
        successCriteria: [
          'All roles assigned with contact info',
          'Primary and backup channels established',
          'Clear escalation path documented'
        ]
      }
    ]
  },

  walk: {
    introduction: 'Apply crisis communication skills with less guidance. You will make decisions and receive feedback.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Lead a cross-functional incident response meeting',
        command: 'Facilitate 15-minute status sync with Engineering, Product, Support, and Executive teams',
        explanation: 'Different teams need different information at different levels of detail. Balance technical accuracy with business clarity.',
        validationCriteria: [
          'Technical team aligned on root cause investigation',
          'Product team understands customer impact',
          'Support has clear customer messaging',
          'Executives know business impact and ETA'
        ],
        commonMistakes: [
          'Using too much technical jargon with executives',
          'Not giving enough technical detail to engineering',
          'Failing to keep meeting focused and time-boxed'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Handle stakeholder pressure during recovery',
        command: 'Respond to executive request for immediate update while engineers are debugging',
        explanation: 'Executives need answers, but engineers need focus. Learn to provide meaningful updates without disrupting technical work.',
        validationCriteria: [
          'Provided update without interrupting debugging',
          'Set appropriate expectation for next update',
          'Maintained executive confidence in team'
        ],
        commonMistakes: [
          'Constantly interrupting engineers for updates',
          'Telling executives to "wait" without context',
          'Overpromising to reduce pressure'
        ]
      }
    ],
    exercises: [
      {
        id: 'crisis-comm-walk-ex1',
        title: 'Multi-Team Coordination Scenario',
        description: 'Coordinate response across Engineering, SRE, Security, and Customer Success during security incident',
        difficulty: 'intermediate',
        estimatedTime: 25,
        objectives: [
          'Align technical teams on investigation approach',
          'Provide Customer Success with accurate messaging',
          'Keep Security informed of compliance implications',
          'Update executives on business risk'
        ],
        startingCondition: 'Potential data breach detected, scope unknown, customers asking questions, media inquiring',
        successCriteria: [
          'All teams have clear action items',
          'Customer messaging approved by Legal and Security',
          'Investigation proceeding without confusion',
          'Stakeholders receiving appropriate updates'
        ]
      }
    ]
  },

  runGuided: {
    introduction: 'Lead realistic crisis scenarios with minimal guidance. Apply leadership principles under pressure.',
    exercises: [
      {
        id: 'crisis-comm-run-guided-ex1',
        title: 'Multi-Vendor Outage Coordination',
        description: 'Lead incident response when outage involves AWS, database vendor, and CDN provider simultaneously',
        difficulty: 'advanced',
        estimatedTime: 30,
        objectives: [
          'Coordinate with external vendor support teams',
          'Manage internal stakeholder expectations',
          'Maintain team morale during extended outage',
          'Document lessons learned in real-time'
        ],
        startingCondition: 'Cascading failure affecting multiple vendors, 4-hour outage, customer churn risk, team exhausted',
        successCriteria: [
          'Clear vendor accountability established',
          'Escalation with vendors progressing',
          'Internal teams aligned and focused',
          'Stakeholders informed of realistic timeline',
          'Team morale maintained through support and breaks'
        ],
        hints: [
          'Assign dedicated person to each vendor relationship',
          'Set clear expectations about what you can and cannot control',
          'Schedule mandatory breaks for team members',
          'Document vendor responses for post-mortem'
        ]
      }
    ]
  },

  runIndependent: {
    introduction: 'Demonstrate mastery by leading complex, realistic crisis scenarios independently. No hints provided.',
    exercises: [
      {
        id: 'crisis-comm-run-independent-ex1',
        title: 'Complete Incident Command Exercise',
        description: 'Lead full incident lifecycle from detection through resolution and post-mortem for major production outage',
        difficulty: 'expert',
        estimatedTime: 45,
        objectives: [
          'Establish incident command structure within 5 minutes',
          'Coordinate response across 5+ teams',
          'Manage communications to 10+ stakeholder groups',
          'Maintain team effectiveness through 6+ hour incident',
          'Conduct effective post-mortem within 24 hours'
        ],
        startingCondition: 'Major production outage, unclear root cause, multiple systems affected, high customer impact, executive escalation',
        successCriteria: [
          'Incident resolved with minimal customer impact',
          'All stakeholders appropriately informed throughout',
          'Team maintained high performance despite pressure',
          'Post-mortem identified actionable improvements',
          'Communication patterns established for future incidents'
        ]
      }
    ]
  }
};

// ============================================
// LESSON 2: Team Coordination & Delegation
// ============================================

export const leadershipLesson2TeamCoordination: LeveledLessonContent = {
  lessonId: 'leadership-lesson2-team-coordination',
  
  baseLesson: {
    title: 'Advanced Team Coordination & Delegation',
    description: 'Master coordinating multiple teams during complex incidents and learning effective delegation under pressure.',
    learningObjectives: [
      'Delegate tasks effectively during high-pressure situations',
      'Coordinate parallel work streams across multiple teams',
      'Monitor team performance and adjust strategies',
      'Identify and resolve team conflicts quickly',
      'Optimize team utilization and prevent burnout'
    ],
    prerequisites: [
      'Completed Crisis Communication Command',
      'Experience leading incident response',
      'Understanding of team dynamics'
    ],
    estimatedTimePerLevel: {
      crawl: 40,
      walk: 30,
      runGuided: 25,
      runIndependent: 20
    }
  },

  crawl: {
    introduction: 'Learn delegation fundamentals and team coordination through structured scenarios.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Assess team capabilities and assign roles',
        command: 'Review team member skills and assign incident response roles based on strengths',
        explanation: 'Effective delegation starts with knowing your team. Match tasks to skills while considering capacity and stress levels.',
        validationCriteria: [
          'Roles matched to individual strengths',
          'Workload balanced across team',
          'Backup assignments in place'
        ],
        commonMistakes: [
          'Always assigning same people to same roles',
          'Not considering current workload',
          'Forgetting to assign backups'
        ]
      }
    ],
    exercises: [
      {
        id: 'team-coord-crawl-ex1',
        title: 'Team Assignment Exercise',
        description: 'Assign 8 team members to incident response roles based on their skills and availability',
        difficulty: 'beginner',
        estimatedTime: 15,
        objectives: [
          'Match skills to incident needs',
          'Balance workload appropriately',
          'Plan for team member rotation'
        ],
        startingCondition: 'Team of 8 with varying experience levels, 12-hour incident expected',
        successCriteria: [
          'All critical roles covered',
          'No single point of failure',
          'Rotation plan for extended incident'
        ]
      }
    ]
  },

  walk: {
    introduction: 'Practice delegation and coordination with real-time decision making.',
    exercises: [
      {
        id: 'team-coord-walk-ex1',
        title: 'Parallel Investigation Coordination',
        description: 'Coordinate three parallel investigation streams for complex performance degradation',
        difficulty: 'intermediate',
        estimatedTime: 25,
        objectives: [
          'Set up parallel investigation tracks',
          'Prevent duplicate work',
          'Synthesize findings from multiple teams',
          'Make go/no-go decisions on potential fixes'
        ],
        startingCondition: 'Performance degradation with three possible root causes, need to investigate all simultaneously',
        successCriteria: [
          'All investigation tracks making progress',
          'Regular sync points established',
          'Clear decision criteria defined',
          'Resource conflicts resolved'
        ]
      }
    ]
  },

  runGuided: {
    introduction: 'Lead complex multi-team coordination scenarios with guidance.',
    exercises: [
      {
        id: 'team-coord-run-guided-ex1',
        title: 'Cross-Team Crisis Coordination',
        description: 'Coordinate response across Engineering, SRE, Security, Database, and Infrastructure teams',
        difficulty: 'advanced',
        estimatedTime: 30,
        objectives: [
          'Establish clear inter-team communication patterns',
          'Resolve conflicting priorities between teams',
          'Maintain overall incident progress',
          'Identify and escalate blockers'
        ],
        startingCondition: 'Complex incident requiring coordination of 5 specialized teams, competing priorities, resource constraints',
        successCriteria: [
          'All teams aligned on priorities',
          'Dependencies identified and managed',
          'Blockers escalated appropriately',
          'Incident progressing efficiently'
        ],
        hints: [
          'Establish single source of truth for status',
          'Create dependency map early',
          'Assign liaison between dependent teams'
        ]
      }
    ]
  },

  runIndependent: {
    introduction: 'Demonstrate mastery of multi-team coordination independently.',
    exercises: [
      {
        id: 'team-coord-run-independent-ex1',
        title: 'Large-Scale Incident Coordination',
        description: 'Coordinate response to major incident affecting 10+ teams across multiple time zones',
        difficulty: 'expert',
        estimatedTime: 40,
        objectives: [
          'Coordinate 24-hour follow-the-sun incident response',
          'Manage handoffs between regions',
          'Maintain context across time zones',
          'Ensure consistent decision making globally'
        ],
        startingCondition: 'Global outage requiring coordination across US, EU, and APAC teams for 24+ hours',
        successCriteria: [
          'Smooth handoffs between regions',
          'Context preserved across handoffs',
          'Consistent communication to global stakeholders',
          'All regions empowered to make decisions'
        ]
      }
    ]
  }
};

// Export all leadership lessons
export const LEADERSHIP_LESSONS = [
  leadershipLesson1CrisisCommunication,
  leadershipLesson2TeamCoordination
];
