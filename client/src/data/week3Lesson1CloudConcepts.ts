/**
 * Week 3 Lesson 1 - Cloud Computing Concepts
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week3Lesson1CloudConcepts: LeveledLessonContent = {
  lessonId: 'week3-lesson1-cloud-concepts',
  
  baseLesson: {
    title: 'Cloud Computing Fundamentals',
    description: 'Understand cloud computing models, service types, and benefits for modern infrastructure.',
    learningObjectives: [
      'Explain cloud computing models (IaaS, PaaS, SaaS)',
      'Compare cloud providers and deployment models',
      'Understand cloud benefits and trade-offs',
      'Identify use cases for cloud services'
    ],
    prerequisites: [
      'Basic understanding of servers and networking',
      'Linux command line familiarity'
    ],
    estimatedTimePerLevel: {
      crawl: 40,
      walk: 30,
      runGuided: 25,
      runIndependent: 20
    }
  },

  crawl: {
    introduction: 'Learn cloud computing concepts step-by-step: service models, deployment types, major providers, and core benefits.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Understand the problem: Traditional infrastructure limitations',
        command: 'Traditional setup: Buy physical servers → Install in data center → Manage hardware → Scale manually → Pay upfront costs',
        explanation: 'Before cloud: expensive capital investment, long provisioning time (weeks/months), limited scalability, manual maintenance. You own hardware, responsible for failures.',
        expectedOutput: 'Understanding: Physical servers = high cost, slow setup, inflexible capacity, hardware maintenance burden',
        validationCriteria: [
          'Recognize upfront capital expenses (CapEx)',
          'Understand long lead times for new servers',
          'See scaling limitations (can\'t quickly add capacity)',
          'Acknowledge maintenance overhead (physical hardware)'
        ],
        commonMistakes: [
          'Thinking traditional is always cheaper (ignoring maintenance, scaling costs)',
          'Forgetting opportunity cost of slow provisioning'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Cloud computing solution: On-demand resources',
        command: 'Cloud model: Provision virtual resources instantly → Pay only for usage → Scale automatically → No hardware management',
        explanation: 'Cloud = rent compute/storage/services from provider. Instant provisioning (minutes not months). Pay-as-you-go (OpEx not CapEx). Provider manages hardware.',
        expectedOutput: 'Understanding: Cloud offers speed, flexibility, operational expenses instead of capital expenses',
        validationCriteria: [
          'On-demand provisioning (instant access)',
          'Pay-per-use pricing (operational expenses)',
          'Elastic scaling (grow/shrink capacity)',
          'Managed infrastructure (provider handles hardware)'
        ],
        commonMistakes: [
          'Thinking cloud is always cheaper (can be expensive if misconfigured)',
          'Assuming cloud means no cost management (need to monitor spending)'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'IaaS: Infrastructure as a Service',
        command: 'Example: AWS EC2, Azure VMs, Google Compute Engine\nYou manage: OS, middleware, runtime, data, applications\nProvider manages: Servers, storage, networking, virtualization',
        explanation: 'IaaS = rent virtual machines. You control OS and software. Provider handles physical hardware. Maximum flexibility, maximum responsibility.',
        expectedOutput: 'Understanding: IaaS gives you virtual servers with full control but requires OS management',
        validationCriteria: [
          'Provider gives you virtual machine',
          'You install and configure everything (OS, apps, security)',
          'Full control over environment',
          'You handle patches, updates, security hardening'
        ],
        commonMistakes: [
          'Confusing IaaS with PaaS (IaaS you manage OS, PaaS you don\'t)',
          'Forgetting you\'re responsible for OS security patches'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'PaaS: Platform as a Service',
        command: 'Example: Heroku, AWS Elastic Beanstalk, Google App Engine\nYou manage: Data, applications\nProvider manages: OS, runtime, middleware, servers, storage, networking',
        explanation: 'PaaS = deploy code, provider handles infrastructure. No OS management. Focus on application logic. Less control, less maintenance.',
        expectedOutput: 'Understanding: PaaS lets you deploy code without managing servers or OS',
        validationCriteria: [
          'Upload application code',
          'Provider manages OS, runtime, scaling',
          'Less configuration than IaaS',
          'Faster deployment, less flexibility'
        ],
        commonMistakes: [
          'Expecting same control as IaaS (PaaS is more opinionated)',
          'Not understanding platform lock-in (harder to migrate)'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'SaaS: Software as a Service',
        command: 'Example: Gmail, Salesforce, Office 365, GitHub\nYou manage: Your data within the application\nProvider manages: Everything (application, OS, infrastructure)',
        explanation: 'SaaS = use software via web browser. No installation, no management. Provider handles everything. You just use the application.',
        expectedOutput: 'Understanding: SaaS is ready-to-use applications with zero infrastructure management',
        validationCriteria: [
          'Access via web browser',
          'No installation or configuration',
          'Provider updates automatically',
          'You only manage your data/settings'
        ],
        commonMistakes: [
          'Thinking you can customize heavily (limited compared to IaaS/PaaS)',
          'Not considering data portability (vendor lock-in)'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'Public Cloud: Multi-tenant infrastructure',
        command: 'AWS, Azure, GCP = public clouds\nCharacteristics: Shared infrastructure, pay-per-use, internet-accessible, managed by provider',
        explanation: 'Public cloud = provider owns infrastructure, multiple customers share (isolated virtually). Most cost-effective. Accessible from anywhere. Provider secures physical infrastructure.',
        expectedOutput: 'Understanding: Public cloud is shared, managed infrastructure with pay-as-you-go pricing',
        validationCriteria: [
          'Multi-tenant (isolated customers on shared hardware)',
          'Provider manages everything',
          'Internet-based access',
          'No upfront hardware costs'
        ],
        commonMistakes: [
          'Confusing multi-tenant with insecure (proper isolation exists)',
          'Thinking public = publicly accessible (you control access)'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'Private Cloud: Dedicated infrastructure',
        command: 'VMware, OpenStack, on-premises data center\nCharacteristics: Single tenant, your organization only, you manage or third-party manages',
        explanation: 'Private cloud = cloud capabilities (automation, self-service) but dedicated to one organization. More control, more expensive. For compliance, security, or regulatory needs.',
        expectedOutput: 'Understanding: Private cloud offers cloud benefits with dedicated infrastructure',
        validationCriteria: [
          'Single tenant (your organization only)',
          'Can be on-premises or hosted',
          'Full control over infrastructure',
          'Higher cost than public cloud'
        ],
        commonMistakes: [
          'Thinking private cloud is always on-premises (can be hosted)',
          'Not considering if public cloud meets compliance needs (often it does)'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'Hybrid Cloud: Combination of public and private',
        command: 'Example: Sensitive data in private cloud, web tier in public cloud\nBenefits: Flexibility, compliance, cost optimization, disaster recovery',
        explanation: 'Hybrid = public + private clouds integrated. Run workloads where they fit best. Keep sensitive data private, scale public. Complex but powerful.',
        expectedOutput: 'Understanding: Hybrid cloud combines public and private for flexibility and compliance',
        validationCriteria: [
          'Uses both public and private clouds',
          'Workloads distributed based on requirements',
          'Data/services can move between clouds',
          'Requires integration and management'
        ],
        commonMistakes: [
          'Assuming hybrid is always complex (modern tools simplify)',
          'Not having clear criteria for what goes where'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'Cloud benefits: Scalability and elasticity',
        command: 'Scalability: Handle increased load by adding resources\nElasticity: Automatically scale up/down based on demand\nExample: E-commerce scales up during holidays, down after',
        explanation: 'Scale out (add more servers) or scale up (bigger servers). Elastic scaling automatically adjusts. Only pay for what you need. Traffic spikes don\'t crash your app.',
        expectedOutput: 'Understanding: Cloud scales to meet demand automatically, reducing waste and preventing outages',
        validationCriteria: [
          'Can add capacity quickly',
          'Auto-scaling based on metrics (CPU, requests)',
          'Scale down to save money during low traffic',
          'No over-provisioning for peak capacity'
        ],
        commonMistakes: [
          'Not configuring auto-scaling (missing cost savings)',
          'Setting scaling thresholds incorrectly (too aggressive or too slow)'
        ]
      },
      {
        stepNumber: 10,
        instruction: 'Cloud benefits: Reliability and disaster recovery',
        command: 'Multiple Availability Zones = data centers in different locations\nAutomatic failover = if one zone fails, traffic routes to another\nBackups = automated, geo-redundant',
        explanation: 'Cloud providers have infrastructure in multiple regions and zones. Your app can survive data center failures. Backups stored in multiple locations. Higher uptime than single data center.',
        expectedOutput: 'Understanding: Cloud provides built-in redundancy and disaster recovery capabilities',
        validationCriteria: [
          'Multi-zone deployment possible',
          'Automatic failover capabilities',
          'Geo-redundant backups',
          'High availability by design'
        ],
        commonMistakes: [
          'Deploying to single zone (no redundancy)',
          'Not testing disaster recovery (untested plans fail)'
        ]
      },
      {
        stepNumber: 11,
        instruction: 'Cloud providers comparison',
        command: 'AWS: Largest, most services, complex pricing\nAzure: Microsoft ecosystem, hybrid focus\nGCP: Data/ML strength, Kubernetes origins\nAll offer: Compute, storage, networking, databases, serverless',
        explanation: 'AWS dominates market share. Azure integrates with Windows/Office. GCP excels at data analytics and containers. All have similar core services with different names.',
        expectedOutput: 'Understanding: Major cloud providers have similar capabilities with different strengths',
        validationCriteria: [
          'AWS = broadest service catalog',
          'Azure = enterprise/Microsoft integration',
          'GCP = data analytics and ML',
          'All suitable for most workloads'
        ],
        commonMistakes: [
          'Choosing based on hype instead of requirements',
          'Not considering existing ecosystem (Microsoft shops benefit from Azure)'
        ]
      },
      {
        stepNumber: 12,
        instruction: 'Cloud cost model and management',
        command: 'Pay-as-you-go: No upfront, pay for usage\nReserved instances: Commit 1-3 years, save 30-70%\nSpot/Preemptible: Bid on unused capacity, save 60-90%\nCost monitoring essential',
        explanation: 'Cloud costs vary by usage. On-demand = flexible, expensive. Reserved = commitment, cheaper. Spot = interruptible, cheapest. Must monitor spending or costs spiral.',
        expectedOutput: 'Understanding: Cloud offers flexible pricing models requiring active cost management',
        validationCriteria: [
          'On-demand = flexibility, higher cost',
          'Reserved = savings for predictable workloads',
          'Spot = massive savings for fault-tolerant workloads',
          'Cost monitoring prevents surprises'
        ],
        commonMistakes: [
          'Using on-demand for everything (expensive)',
          'Not setting billing alerts (unexpected bills)',
          'Leaving unused resources running (waste money)'
        ]
      }
    ],
    expectedOutcome: 'You understand cloud service models (IaaS/PaaS/SaaS), deployment types (public/private/hybrid), major providers, scalability benefits, and cost models. You can explain when cloud makes sense and what model fits different needs.'
  },

  walk: {
    introduction: 'Apply cloud concepts through scenario-based decision-making exercises.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Your startup needs to deploy a web application quickly. Choose the cloud model.',
        template: 'Requirement: Fast deployment, focus on code, minimal ops team\nBest choice: __PAAS__\nReason: __NO_SERVER_MANAGEMENT__, __FASTER_DEPLOYMENT__\nExamples: __HEROKU__, __ELASTIC_BEANSTALK__',
        blanks: [
          {
            id: 'PAAS',
            label: 'PAAS',
            hint: 'Platform that manages infrastructure for you',
            correctValue: 'PaaS',
            validationPattern: '^[Pp]aa[Ss]$'
          },
          {
            id: 'NO_SERVER_MANAGEMENT',
            label: 'NO_SERVER_MANAGEMENT',
            hint: 'Provider handles OS and runtime',
            correctValue: 'No server management',
            validationPattern: '.*(no.*server|managed.*infrastructure|automatic).*'
          },
          {
            id: 'FASTER_DEPLOYMENT',
            label: 'FASTER_DEPLOYMENT',
            hint: 'Deploy code without configuring servers',
            correctValue: 'Faster deployment',
            validationPattern: '.*(faster|quick|rapid|deploy).*'
          },
          {
            id: 'HEROKU',
            label: 'HEROKU',
            hint: 'Popular PaaS platform',
            correctValue: 'Heroku',
            validationPattern: '.*(heroku|railway).*'
          },
          {
            id: 'ELASTIC_BEANSTALK',
            label: 'ELASTIC_BEANSTALK',
            hint: 'AWS PaaS offering',
            correctValue: 'AWS Elastic Beanstalk',
            validationPattern: '.*(beanstalk|app.*engine).*'
          }
        ],
        solution: 'Requirement: Fast deployment, focus on code, minimal ops team\nBest choice: PaaS\nReason: No server management, Faster deployment\nExamples: Heroku, AWS Elastic Beanstalk',
        explanation: 'PaaS lets startups deploy code without managing infrastructure. Faster time-to-market. Small teams focus on product, not servers.'
      },
      {
        exerciseNumber: 2,
        scenario: 'Bank needs cloud but must keep customer data on-premises for compliance.',
        template: 'Requirement: __COMPLIANCE__, sensitive data\nDeployment model: __HYBRID__\nStrategy: Customer data in __PRIVATE__ cloud, __PUBLIC__ cloud for non-sensitive workloads',
        blanks: [
          {
            id: 'COMPLIANCE',
            label: 'COMPLIANCE',
            hint: 'Regulatory requirements',
            correctValue: 'Compliance',
            validationPattern: '.*(compliance|regulatory|regulation).*'
          },
          {
            id: 'HYBRID',
            label: 'HYBRID',
            hint: 'Combination of deployment models',
            correctValue: 'Hybrid',
            validationPattern: '^[Hh]ybrid$'
          },
          {
            id: 'PRIVATE',
            label: 'PRIVATE',
            hint: 'Dedicated infrastructure',
            correctValue: 'Private',
            validationPattern: '^[Pp]rivate$'
          },
          {
            id: 'PUBLIC',
            label: 'PUBLIC',
            hint: 'Shared provider infrastructure',
            correctValue: 'Public',
            validationPattern: '^[Pp]ublic$'
          }
        ],
        solution: 'Requirement: Compliance, sensitive data\nDeployment model: Hybrid\nStrategy: Customer data in Private cloud, Public cloud for non-sensitive workloads',
        explanation: 'Hybrid cloud meets compliance (private for sensitive data) while leveraging public cloud benefits for other workloads.'
      },
      {
        exerciseNumber: 3,
        scenario: 'E-commerce site has 10x traffic during Black Friday. What cloud benefit helps?',
        template: 'Problem: __TRAFFIC_SPIKES__ during holidays\nCloud benefit: __ELASTICITY__\nSolution: __AUTO_SCALING__ adds servers during peak, __SCALES_DOWN__ after\nCost benefit: Only pay for __ACTUAL_USAGE__',
        blanks: [
          {
            id: 'TRAFFIC_SPIKES',
            label: 'TRAFFIC_SPIKES',
            hint: 'Sudden increase in visitors',
            correctValue: 'Traffic spikes',
            validationPattern: '.*(spike|surge|peak|increase).*'
          },
          {
            id: 'ELASTICITY',
            label: 'ELASTICITY',
            hint: 'Automatic scaling up and down',
            correctValue: 'Elasticity',
            validationPattern: '.*(elastic|auto.*scal).*'
          },
          {
            id: 'AUTO_SCALING',
            label: 'AUTO_SCALING',
            hint: 'Automatically increases capacity',
            correctValue: 'Auto-scaling',
            validationPattern: '.*(auto.*scal|automatic).*'
          },
          {
            id: 'SCALES_DOWN',
            label: 'SCALES_DOWN',
            hint: 'Reduces capacity when not needed',
            correctValue: 'Scales down',
            validationPattern: '.*(scale.*down|reduce|shrink).*'
          },
          {
            id: 'ACTUAL_USAGE',
            label: 'ACTUAL_USAGE',
            hint: 'What you actually consumed',
            correctValue: 'Actual usage',
            validationPattern: '.*(actual|used|consumed).*'
          }
        ],
        solution: 'Problem: Traffic spikes during holidays\nCloud benefit: Elasticity\nSolution: Auto-scaling adds servers during peak, Scales down after\nCost benefit: Only pay for Actual usage',
        explanation: 'Cloud elasticity handles variable demand automatically. No over-provisioning for peak capacity. Pay only during high traffic.'
      },
      {
        exerciseNumber: 4,
        scenario: 'Choose between AWS, Azure, and GCP for different organizations.',
        template: 'Microsoft-heavy enterprise: __AZURE__ (integrates with __ACTIVE_DIRECTORY__, Office 365)\nData analytics startup: __GCP__ (strengths in __BIGQUERY__, ML)\nNeed most services/flexibility: __AWS__ (largest __SERVICE_CATALOG__)',
        blanks: [
          {
            id: 'AZURE',
            label: 'AZURE',
            hint: 'Microsoft cloud',
            correctValue: 'Azure',
            validationPattern: '^[Aa]zure$'
          },
          {
            id: 'ACTIVE_DIRECTORY',
            label: 'ACTIVE_DIRECTORY',
            hint: 'Microsoft identity management',
            correctValue: 'Active Directory',
            validationPattern: '.*(active.*directory|AD|identity).*'
          },
          {
            id: 'GCP',
            label: 'GCP',
            hint: 'Google cloud',
            correctValue: 'GCP',
            validationPattern: '^(GCP|Google.*Cloud)$'
          },
          {
            id: 'BIGQUERY',
            label: 'BIGQUERY',
            hint: 'Google data warehouse',
            correctValue: 'BigQuery',
            validationPattern: '.*(bigquery|data.*analytics).*'
          },
          {
            id: 'AWS',
            label: 'AWS',
            hint: 'Amazon cloud',
            correctValue: 'AWS',
            validationPattern: '^AWS$'
          },
          {
            id: 'SERVICE_CATALOG',
            label: 'SERVICE_CATALOG',
            hint: 'Range of available services',
            correctValue: 'Service catalog',
            validationPattern: '.*(service|catalog|offering).*'
          }
        ],
        solution: 'Microsoft-heavy enterprise: Azure (integrates with Active Directory, Office 365)\nData analytics startup: GCP (strengths in BigQuery, ML)\nNeed most services/flexibility: AWS (largest Service catalog)',
        explanation: 'Choose cloud provider based on existing ecosystem, workload strengths, and service requirements.'
      },
      {
        exerciseNumber: 5,
        scenario: 'Optimize cloud costs for a web application running 24/7.',
        template: 'Current: __ON_DEMAND__ instances (most expensive)\nOptimization: __RESERVED__ instances (commit 1-3 years, save __30_70_PERCENT__)\nFurther savings: Use __SPOT__ instances for __BATCH__ workloads (save up to 90%)\nMust implement: __COST_MONITORING__ and alerts',
        blanks: [
          {
            id: 'ON_DEMAND',
            label: 'ON_DEMAND',
            hint: 'Pay-as-you-go pricing',
            correctValue: 'On-demand',
            validationPattern: '.*(on.*demand|pay.*as.*go).*'
          },
          {
            id: 'RESERVED',
            label: 'RESERVED',
            hint: 'Commit for discount',
            correctValue: 'Reserved',
            validationPattern: '.*(reserved|commitment).*'
          },
          {
            id: '30_70_PERCENT',
            label: '30_70_PERCENT',
            hint: 'Discount range',
            correctValue: '30-70%',
            validationPattern: '.*(30|40|50|60|70).*'
          },
          {
            id: 'SPOT',
            label: 'SPOT',
            hint: 'Unused capacity',
            correctValue: 'Spot',
            validationPattern: '.*(spot|preemptible).*'
          },
          {
            id: 'BATCH',
            label: 'BATCH',
            hint: 'Non-interactive workloads',
            correctValue: 'Batch',
            validationPattern: '.*(batch|background|fault.*tolerant).*'
          },
          {
            id: 'COST_MONITORING',
            label: 'COST_MONITORING',
            hint: 'Track spending',
            correctValue: 'Cost monitoring',
            validationPattern: '.*(cost|monitor|budget|billing).*'
          }
        ],
        solution: 'Current: On-demand instances (most expensive)\nOptimization: Reserved instances (commit 1-3 years, save 30-70%)\nFurther savings: Use Spot instances for Batch workloads (save up to 90%)\nMust implement: Cost monitoring and alerts',
        explanation: 'Cloud costs optimize through pricing models: Reserved for steady workloads, Spot for fault-tolerant jobs, monitoring to prevent waste.'
      }
    ],
    hints: [
      'IaaS = you manage OS, PaaS = provider manages OS, SaaS = provider manages everything',
      'Public cloud is cheapest for most workloads',
      'Hybrid cloud balances compliance with cloud benefits',
      'Cloud elasticity prevents over-provisioning',
      'Choose provider based on existing tools and workload needs'
    ]
  },

  runGuided: {
    objective: 'Analyze your organization\'s current infrastructure and create cloud migration strategy',
    conceptualGuidance: [
      'Document current infrastructure: servers, databases, storage, networking',
      'Identify pain points: cost, scalability, maintenance burden, disaster recovery gaps',
      'Categorize workloads: stateless web apps, databases, batch jobs, file storage',
      'Map workloads to cloud services: IaaS for legacy apps, PaaS for new development, SaaS for standard tools',
      'Choose deployment model: public for most, private for compliance, hybrid as transition',
      'Select cloud provider based on: existing tools, team skills, workload requirements, pricing',
      'Plan migration: low-risk apps first, critical systems later, test thoroughly',
      'Estimate costs: compare current expenses to cloud pricing, factor in reserved instances',
      'Identify risks: vendor lock-in, data transfer costs, learning curve',
      'Create timeline: phased migration over months, not big-bang'
    ],
    keyConceptsToApply: [
      'IaaS vs PaaS vs SaaS decision criteria',
      'Public vs private vs hybrid trade-offs',
      'Cloud provider selection based on requirements',
      'Cost modeling and optimization strategies',
      'Migration planning and risk management'
    ],
    checkpoints: [
      {
        checkpoint: 'Current state documented',
        description: 'Inventory of existing infrastructure and pain points',
        validationCriteria: [
          'All servers, databases, storage documented',
          'Current costs calculated',
          'Pain points identified (slow provisioning, high costs, scaling issues)',
          'Workload characteristics understood',
          'Team skills assessed'
        ],
        hintIfStuck: 'Use real organization (your workplace) or fictional company (e-commerce with 50 servers, growing 30% annually, manual deployments taking days)'
      },
      {
        checkpoint: 'Cloud strategy defined',
        description: 'Workloads mapped to cloud services with rationale',
        validationCriteria: [
          'Each workload mapped to IaaS/PaaS/SaaS',
          'Deployment model chosen (public/private/hybrid) with justification',
          'Cloud provider selected based on criteria',
          'Migration approach outlined (phases, timeline)',
          'Cost estimate completed'
        ],
        hintIfStuck: 'Simple web apps → PaaS. Legacy monoliths → IaaS initially. Email → SaaS (Office 365/Gmail). Databases → Managed database services.'
      },
      {
        checkpoint: 'Risks and mitigation identified',
        description: 'Potential issues addressed proactively',
        validationCriteria: [
          'Vendor lock-in risks identified with mitigation',
          'Data transfer costs estimated',
          'Training needs assessed',
          'Disaster recovery plan',
          'Cost monitoring strategy'
        ],
        hintIfStuck: 'Lock-in mitigation: Use open standards (Kubernetes, PostgreSQL). Cost control: Set billing alerts, use reserved instances, implement auto-shutdown for dev environments.'
      }
    ],
    resourcesAllowed: [
      'Cloud provider pricing calculators',
      'Cloud migration frameworks (AWS CAF, Azure WAF)',
      'TCO (Total Cost of Ownership) comparison tools'
    ]
  },

  runIndependent: {
    objective: 'Create comprehensive cloud adoption proposal for executive leadership, including business case, technical strategy, cost analysis, and migration roadmap',
    successCriteria: [
      'Executive summary: Problem statement, proposed solution, expected benefits, investment required',
      'Current state analysis: Infrastructure inventory, costs, limitations, risks',
      'Cloud strategy: Service models chosen (IaaS/PaaS/SaaS) with rationale for each workload',
      'Deployment model: Public/private/hybrid decision with compliance considerations',
      'Provider selection: AWS/Azure/GCP recommendation with detailed comparison',
      'Migration roadmap: Phased approach with timeline (6-18 months typical)',
      'Cost analysis: 3-year TCO comparison (current vs cloud), break-even point, ROI',
      'Risk assessment: Technical risks, vendor lock-in, data security, mitigation strategies',
      'Success metrics: KPIs to measure (cost savings, deployment speed, uptime, scalability)',
      'Team readiness: Training plan, skill gaps, hiring needs'
    ],
    timeTarget: 20,
    minimumRequirements: [
      'Business case with cost comparison and ROI',
      'Technical strategy mapping workloads to cloud services',
      'Migration roadmap with at least 3 phases'
    ],
    evaluationRubric: [
      {
        criterion: 'Business Alignment',
        weight: 30,
        passingThreshold: 'Proposal clearly connects cloud migration to business outcomes. Executives understand value proposition. Financial analysis is thorough and credible.'
      },
      {
        criterion: 'Technical Soundness',
        weight: 30,
        passingThreshold: 'Workload mapping is appropriate. Service model choices justified. Provider selection criteria clear. Migration approach is realistic and low-risk.'
      },
      {
        criterion: 'Risk Management',
        weight: 20,
        passingThreshold: 'Major risks identified (cost overruns, vendor lock-in, security, skills). Mitigation strategies are practical. Disaster recovery addressed.'
      },
      {
        criterion: 'Completeness',
        weight: 20,
        passingThreshold: 'All required sections present. Timeline realistic. Metrics defined. Team readiness addressed. Nothing major missing for decision-making.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=M988_fsOSWo',
  documentation: [
    'https://aws.amazon.com/what-is-cloud-computing/',
    'https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/',
    'https://cloud.google.com/learn/what-is-cloud-computing'
  ],
  relatedConcepts: [
    'Infrastructure as Code (IaC)',
    'Cloud-native architecture',
    'Multi-cloud strategy',
    'FinOps (Cloud Financial Operations)',
    'Cloud security and compliance',
    'Serverless computing'
  ]
};
