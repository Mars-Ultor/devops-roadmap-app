/**
 * Advanced Integration Scenarios - Complex Multi-Team Coordination
 * Real-world scenarios requiring coordination across multiple teams and systems
 */

import type { LeveledLessonContent } from "../types/lessonContent";

// ============================================
// LESSON 1: Multi-Team Incident Coordination
// ============================================

export const integrationLesson1MultiTeam: LeveledLessonContent = {
  lessonId: "integration-lesson1-multi-team",

  baseLesson: {
    title: "Multi-Team Incident Coordination",
    description:
      "Master coordinating complex incidents requiring multiple specialized teams working together.",
    learningObjectives: [
      "Coordinate response across Engineering, SRE, Security, and Product teams",
      "Resolve conflicts between team priorities",
      "Maintain overall incident progress while teams work independently",
      "Facilitate effective cross-team communication",
      "Synthesize technical findings from multiple teams",
    ],
    prerequisites: [
      "Completed Leadership & Command training",
      "Experience with incident response",
      "Understanding of organizational structures",
      "Knowledge of various technical domains",
    ],
    estimatedTimePerLevel: {
      crawl: 50,
      walk: 40,
      runGuided: 35,
      runIndependent: 30,
    },
  },

  crawl: {
    introduction:
      "Learn multi-team coordination through structured incident scenarios.",
    steps: [
      {
        stepNumber: 1,
        instruction: "Map team responsibilities and dependencies",
        command: "Create RACI matrix for incident response involving 5 teams",
        explanation:
          "Complex incidents require clear understanding of who does what. Map Responsible, Accountable, Consulted, and Informed roles for all teams involved.",
        expectedOutput:
          "Complete RACI matrix showing each team role in incident response",
        validationCriteria: [
          "All teams have clear responsibilities",
          "Dependencies between teams identified",
          "Decision-making authority established",
          "Communication paths defined",
        ],
        commonMistakes: [
          "Not identifying dependencies early",
          "Unclear decision-making authority",
          "Too many teams marked as Accountable for same task",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Establish cross-team communication rhythm",
        command:
          "Define sync meeting cadence, status update format, and escalation paths",
        explanation:
          "Multiple teams need coordinated communication. Define when teams sync, how they share status, and how to escalate blockers.",
        validationCriteria: [
          "Sync meeting schedule established",
          "Status update template created",
          "Escalation paths documented",
          "Communication channels assigned",
        ],
        commonMistakes: [
          "Too many meetings disrupting work",
          "Inconsistent status update formats",
          "Unclear escalation procedures",
        ],
      },
      {
        stepNumber: 3,
        instruction: "Coordinate parallel investigation streams",
        command:
          "Assign investigation tracks to teams, define success criteria, schedule check-ins",
        explanation:
          "Teams can investigate different hypotheses in parallel. Coordinate without creating duplication or gaps in coverage.",
        validationCriteria: [
          "Investigation tracks clearly defined",
          "No overlap between team efforts",
          "Check-in points scheduled",
          "Integration plan for findings",
        ],
        commonMistakes: [
          "Teams investigating same thing independently",
          "Missing gaps between investigation areas",
          "No plan for integrating findings",
        ],
      },
    ],
    exercises: [
      {
        id: "multi-team-crawl-ex1",
        title: "Cross-Team Incident Setup",
        description:
          "Set up coordination structure for incident involving Engineering, SRE, Database, and Network teams",
        difficulty: "intermediate",
        estimatedTime: 25,
        objectives: [
          "Create RACI matrix for all teams",
          "Establish communication cadence",
          "Define escalation paths",
          "Set up shared documentation",
        ],
        startingCondition:
          "Performance degradation affecting multiple services, root cause unclear, requires expertise from 4 different teams",
        successCriteria: [
          "All teams know their responsibilities",
          "Communication rhythm established",
          "Shared war room set up",
          "Teams coordinating effectively",
        ],
      },
    ],
  },

  walk: {
    introduction:
      "Practice multi-team coordination with realistic decision-making.",
    exercises: [
      {
        id: "multi-team-walk-ex1",
        title: "Conflicting Team Priorities",
        description:
          "Resolve conflicts when Security wants to shut down services but Product needs them running",
        difficulty: "advanced",
        estimatedTime: 30,
        objectives: [
          "Understand each team perspective",
          "Identify middle-ground solutions",
          "Make risk-based decisions",
          "Get team alignment on path forward",
        ],
        startingCondition:
          "Security vulnerability detected, Security wants immediate shutdown, Product has major customer demo in 2 hours",
        successCriteria: [
          "Risk properly assessed and communicated",
          "Solution balances security and business needs",
          "All teams aligned on decision",
          "Contingency plans in place",
        ],
      },
    ],
  },

  runGuided: {
    introduction: "Lead complex multi-team scenarios with strategic guidance.",
    exercises: [
      {
        id: "multi-team-run-guided-ex1",
        title: "Global Team Coordination",
        description:
          "Coordinate incident response across teams in US, EU, and APAC with follow-the-sun coverage",
        difficulty: "expert",
        estimatedTime: 45,
        objectives: [
          "Establish 24-hour coverage rotation",
          "Ensure effective handoffs between regions",
          "Maintain context across time zones",
          "Coordinate with local stakeholders in each region",
        ],
        startingCondition:
          "Critical incident requiring 24+ hour response, teams distributed globally, local stakeholders in each region",
        successCriteria: [
          "Smooth handoffs between regions",
          "Context preserved across handoffs",
          "Local stakeholders kept informed",
          "Incident progresses continuously",
          "Team members get adequate rest",
        ],
        hints: [
          "Create detailed handoff document template",
          "Schedule overlap time between regions",
          "Assign regional coordinators",
          "Use asynchronous communication for updates",
        ],
      },
    ],
  },

  runIndependent: {
    introduction: "Demonstrate multi-team coordination mastery.",
    exercises: [
      {
        id: "multi-team-run-independent-ex1",
        title: "Enterprise-Wide Incident",
        description:
          "Lead response to major incident affecting entire organization with 10+ teams involved",
        difficulty: "expert",
        estimatedTime: 60,
        objectives: [
          "Coordinate response across 10+ specialized teams",
          "Manage executive stakeholder communications",
          "Balance multiple competing priorities",
          "Maintain incident momentum despite complexity",
          "Conduct effective post-incident review",
        ],
        startingCondition:
          "Major platform outage affecting all services, unclear root cause, high visibility, 10+ teams needed for investigation and recovery",
        successCriteria: [
          "All teams coordinated effectively",
          "Incident resolved with minimal customer impact",
          "Executives kept appropriately informed",
          "Team morale maintained",
          "Lessons learned captured and shared",
        ],
      },
    ],
  },
};

// ============================================
// LESSON 2: Complex System Integration
// ============================================

export const integrationLesson2SystemIntegration: LeveledLessonContent = {
  lessonId: "integration-lesson2-system-integration",

  baseLesson: {
    title: "Complex System Integration Scenarios",
    description:
      "Handle incidents involving complex integrations between multiple systems and vendors.",
    learningObjectives: [
      "Debug issues spanning multiple integrated systems",
      "Coordinate with external vendors during incidents",
      "Trace requests through complex integration chains",
      "Manage incidents when dependencies are outside your control",
      "Design resilient integration patterns",
    ],
    prerequisites: [
      "Completed Multi-Team Incident Coordination",
      "Understanding of distributed systems",
      "Experience with API integrations",
      "Knowledge of vendor management",
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 35,
      runGuided: 30,
      runIndependent: 25,
    },
  },

  crawl: {
    introduction: "Learn to debug complex system integrations systematically.",
    steps: [
      {
        stepNumber: 1,
        instruction: "Map the integration architecture",
        command:
          "Create sequence diagram showing all systems involved in failed transaction",
        explanation:
          "Complex integrations require visual mapping. Document each system, API call, and data transformation in the request flow.",
        validationCriteria: [
          "All systems in chain identified",
          "API calls documented with payloads",
          "Authentication flows mapped",
          "Error handling points identified",
        ],
        commonMistakes: [
          "Missing intermediate systems",
          "Not documenting authentication",
          "Forgetting about asynchronous callbacks",
        ],
      },
    ],
    exercises: [
      {
        id: "integration-crawl-ex1",
        title: "Payment Integration Failure",
        description:
          "Debug failed payment flow involving your app, payment gateway, bank API, and fraud detection service",
        difficulty: "intermediate",
        estimatedTime: 25,
        objectives: [
          "Map complete payment flow",
          "Identify failure point",
          "Determine root cause",
          "Implement fix or workaround",
        ],
        startingCondition:
          "Customers reporting failed payments, error messages unclear, involves 4 different systems",
        successCriteria: [
          "Integration flow fully documented",
          "Failure point identified",
          "Root cause determined",
          "Solution implemented and tested",
        ],
      },
    ],
  },

  walk: {
    introduction:
      "Debug realistic integration issues with vendor dependencies.",
    exercises: [
      {
        id: "integration-walk-ex1",
        title: "Third-Party API Degradation",
        description:
          "Handle performance issues when critical third-party API is slow but not down",
        difficulty: "advanced",
        estimatedTime: 30,
        objectives: [
          "Implement circuit breaker pattern",
          "Add fallback mechanisms",
          "Coordinate with vendor support",
          "Minimize customer impact",
        ],
        startingCondition:
          "Critical third-party API responding slowly, causing timeouts in your app, vendor support responsive but no ETA",
        successCriteria: [
          "Circuit breaker prevents cascading failures",
          "Fallback provides degraded functionality",
          "Customer impact minimized",
          "Vendor actively working on issue",
        ],
      },
    ],
  },

  runGuided: {
    introduction: "Handle complex integration incidents with guidance.",
    exercises: [
      {
        id: "integration-run-guided-ex1",
        title: "Multi-Vendor Integration Crisis",
        description:
          "Resolve incident involving your infrastructure, AWS, payment processor, and analytics vendor",
        difficulty: "expert",
        estimatedTime: 40,
        objectives: [
          "Coordinate with multiple external vendors",
          "Isolate issue to specific vendor",
          "Implement temporary workarounds",
          "Design more resilient architecture",
        ],
        startingCondition:
          "Transaction failures involving 4 vendors, each blaming others, customer impact growing",
        successCriteria: [
          "Root cause identified despite vendor complexity",
          "Workarounds implemented",
          "Customer impact stopped",
          "Architecture improvements planned",
        ],
        hints: [
          "Capture detailed traces of full transaction flow",
          "Get all vendors on shared call if possible",
          "Focus on data - avoid vendor blame game",
        ],
      },
    ],
  },

  runIndependent: {
    introduction: "Demonstrate integration scenario mastery.",
    exercises: [
      {
        id: "integration-run-independent-ex1",
        title: "Complex Integration Architecture",
        description:
          "Design and implement resilient integration architecture for critical business flow",
        difficulty: "expert",
        estimatedTime: 50,
        objectives: [
          "Design resilient integration patterns",
          "Implement comprehensive monitoring",
          "Build fallback mechanisms",
          "Create vendor management playbook",
          "Document incident response procedures",
        ],
        startingCondition:
          "Business requires integrating with 6 external systems for critical checkout flow, SLA requirements strict",
        successCriteria: [
          "Architecture handles vendor failures gracefully",
          "Monitoring provides clear visibility",
          "Fallbacks maintain core functionality",
          "Vendor escalation procedures documented",
          "Team trained on incident response",
        ],
      },
    ],
  },
};

// Export all integration lessons
export const INTEGRATION_LESSONS = [
  integrationLesson1MultiTeam,
  integrationLesson2SystemIntegration,
];
