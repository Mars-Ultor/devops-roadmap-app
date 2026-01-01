/**
 * Phase 2.7: Specialized Operations & Advanced Tactics
 * Domain-specific advanced training for specialized DevOps roles and scenarios
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Activity,
  Target,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Cloud,
  Lock,
  Globe
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import TimerCountdown from '../components/stress/TimerCountdown';

interface SpecializedScenario {
  id: string;
  title: string;
  domain: 'security' | 'performance' | 'platform' | 'compliance' | 'multi-cloud';
  difficulty: 'intermediate' | 'advanced' | 'expert';
  description: string;
  objectives: string[];
  timeLimit: number;
  specialization: string;
  scenario: string;
  challenges: SpecializedChallenge[];
  successCriteria: string[];
  debriefing: {
    keyTakeaways: string[];
    commonMistakes: string[];
    bestPractices: string[];
    nextSteps: string[];
  };
}

interface SpecializedChallenge {
  id: string;
  title: string;
  description: string;
  type: 'decision' | 'configuration' | 'analysis' | 'response';
  options?: string[];
  correctAnswer?: string;
  timeLimit?: number;
  points: number;
  hints: string[];
}

interface SpecializedAttempt {
  scenarioId: string;
  startTime: Date;
  endTime?: Date;
  score: number;
  decisions: SpecializedDecision[];
  completed: boolean;
  specialization: string;
}

interface SpecializedDecision {
  challengeId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
}

const SPECIALIZED_SCENARIOS: SpecializedScenario[] = [
  {
    id: 'security-incident-response',
    title: 'Zero-Day Vulnerability Response',
    domain: 'security',
    difficulty: 'expert',
    description: 'Respond to a critical zero-day vulnerability affecting production systems across multiple services.',
    objectives: [
      'Isolate compromised systems',
      'Assess breach scope and impact',
      'Implement emergency security measures',
      'Coordinate with security team and stakeholders',
      'Document incident response procedures'
    ],
    timeLimit: 1800, // 30 minutes
    specialization: 'DevSecOps',
    scenario: `A zero-day vulnerability has been discovered in your container runtime affecting all production workloads. The vulnerability allows remote code execution with root privileges. Your monitoring systems show unusual network activity and potential lateral movement across your Kubernetes clusters.

**Current Situation:**
- Vulnerability affects Docker containers running on EKS
- 15 services potentially compromised
- Customer data may have been exposed
- Security team has confirmed the threat
- Business stakeholders demanding immediate updates

**Your Role:** Lead Security Incident Commander`,
    challenges: [
      {
        id: 'initial-assessment',
        title: 'Initial Breach Assessment',
        description: 'What is your first priority action?',
        type: 'decision',
        options: [
          'Immediately patch all affected containers',
          'Isolate affected clusters from network',
          'Notify all customers of potential breach',
          'Start full forensic analysis'
        ],
        correctAnswer: 'Isolate affected clusters from network',
        points: 100,
        hints: [
          'Containment before eradication',
          'Network isolation prevents lateral movement',
          'Assessment should happen in parallel with containment'
        ]
      },
      {
        id: 'containment-strategy',
        title: 'Containment Strategy',
        description: 'How do you contain the breach while minimizing business impact?',
        type: 'decision',
        options: [
          'Shut down all production services immediately',
          'Implement network segmentation and ACLs',
          'Rotate all credentials and certificates',
          'Deploy IDS/IPS rules to block exploit'
        ],
        correctAnswer: 'Implement network segmentation and ACLs',
        points: 150,
        hints: [
          'Surgical containment minimizes downtime',
          'Network controls are fastest to implement',
          'Multiple layers of containment are ideal'
        ]
      },
      {
        id: 'communication-plan',
        title: 'Stakeholder Communication',
        description: 'How do you communicate with different stakeholder groups?',
        type: 'decision',
        options: [
          'Send mass email to all employees and customers',
          'Brief executive team first, then technical teams',
          'Post on company status page only',
          'Wait for complete assessment before communicating'
        ],
        correctAnswer: 'Brief executive team first, then technical teams',
        points: 120,
        hints: [
          'Executive team needs immediate awareness',
          'Technical teams need detailed information',
          'Avoid panic-inducing mass communications'
        ]
      },
      {
        id: 'eradication-approach',
        title: 'Vulnerability Eradication',
        description: 'How do you eradicate the vulnerability from your infrastructure?',
        type: 'decision',
        options: [
          'Apply patches across all systems simultaneously',
          'Phased patching with validation at each stage',
          'Rebuild all affected containers from scratch',
          'Upgrade to latest version of container runtime'
        ],
        correctAnswer: 'Phased patching with validation at each stage',
        points: 160,
        hints: [
          'Phased approach allows for testing',
          'Validation prevents new issues',
          'Gradual rollout reduces risk'
        ]
      },
      {
        id: 'recovery-validation',
        title: 'Recovery and Validation',
        description: 'How do you verify systems are clean and return to normal operations?',
        type: 'decision',
        options: [
          'Run automated security scans and resume immediately',
          'Conduct forensic analysis, scan, then gradual restore',
          'Wait 48 hours and monitor before full restore',
          'Restore from pre-incident backups only'
        ],
        correctAnswer: 'Conduct forensic analysis, scan, then gradual restore',
        points: 180,
        hints: [
          'Forensics ensure complete understanding',
          'Gradual restore allows monitoring',
          'Validation prevents reinfection'
        ]
      }
    ],
    successCriteria: [
      'Breach contained within 15 minutes',
      'No additional systems compromised',
      'Clear communication with stakeholders',
      'Incident documented for post-mortem'
    ],
    debriefing: {
      keyTakeaways: [
        'Speed of containment is critical in security incidents',
        'Network isolation is the fastest containment method',
        'Clear communication prevents panic and confusion',
        'Documentation enables learning and improvement'
      ],
      commonMistakes: [
        'Focusing on eradication before containment',
        'Over-communicating and causing panic',
        'Not involving security experts early',
        'Failing to document actions and decisions'
      ],
      bestPractices: [
        'Have pre-defined incident response playbooks',
        'Maintain network segmentation capabilities',
        'Establish clear communication protocols',
        'Regular incident response training and simulations'
      ],
      nextSteps: [
        'Review and update incident response procedures',
        'Enhance monitoring and detection capabilities',
        'Conduct security awareness training',
        'Schedule regular incident response drills'
      ]
    }
  },
  {
    id: 'performance-engineering-crisis',
    title: 'Performance Degradation Crisis',
    domain: 'performance',
    difficulty: 'advanced',
    description: 'Diagnose and resolve a complex performance degradation affecting multiple microservices.',
    objectives: [
      'Identify performance bottlenecks',
      'Implement performance optimizations',
      'Scale resources appropriately',
      'Monitor system performance metrics',
      'Document performance improvements'
    ],
    timeLimit: 1500, // 25 minutes
    specialization: 'Performance Engineering',
    scenario: `Your e-commerce platform is experiencing severe performance degradation during peak shopping hours. Response times have increased from 200ms to 5 seconds, and error rates are climbing. Customer complaints are flooding in, and revenue is being impacted.

**Current Metrics:**
- API Response Time: 5.2s (target: <200ms)
- Error Rate: 12% (target: <1%)
- Database CPU: 95% utilization
- Cache Hit Rate: 45% (target: >90%)
- Active Users: 500K concurrent

**System Architecture:**
- 20 microservices on Kubernetes
- PostgreSQL database cluster
- Redis cache layer
- CDN and load balancers

**Your Role:** Performance Engineering Lead`,
    challenges: [
      {
        id: 'diagnostic-approach',
        title: 'Diagnostic Strategy',
        description: 'What is your systematic approach to diagnosing the performance issues?',
        type: 'decision',
        options: [
          'Check application logs for errors first',
          'Review infrastructure metrics and dashboards',
          'Run load tests to reproduce the issue',
          'Interview developers about recent changes'
        ],
        correctAnswer: 'Review infrastructure metrics and dashboards',
        points: 100,
        hints: [
          'Metrics provide quantitative performance data',
          'Systematic approach prevents missing critical issues',
          'Multiple data sources needed for complete picture'
        ]
      },
      {
        id: 'bottleneck-identification',
        title: 'Bottleneck Analysis',
        description: 'Based on the metrics, what appears to be the primary bottleneck?',
        type: 'decision',
        options: [
          'Database connection pool exhaustion',
          'Insufficient cache capacity',
          'Microservice communication overhead',
          'Load balancer configuration issues'
        ],
        correctAnswer: 'Database connection pool exhaustion',
        points: 150,
        hints: [
          'High database CPU with low cache hit rate',
          'Connection pools are common bottleneck points',
          'Database is often the scaling constraint'
        ]
      },
      {
        id: 'optimization-strategy',
        title: 'Performance Optimization',
        description: 'What combination of optimizations will you implement?',
        type: 'decision',
        options: [
          'Increase database instance size only',
          'Implement database connection pooling and caching',
          'Add more application servers',
          'Optimize application code and database queries'
        ],
        correctAnswer: 'Implement database connection pooling and caching',
        points: 200,
        hints: [
          'Multiple optimizations needed for complex issues',
          'Connection pooling reduces database load',
          'Caching reduces database queries',
          'Code optimization provides long-term benefits'
        ]
      },
      {
        id: 'scaling-strategy',
        title: 'Resource Scaling',
        description: 'What scaling approach provides immediate relief while maintaining cost efficiency?',
        type: 'decision',
        options: [
          'Horizontal scaling - add more application instances',
          'Vertical scaling - increase instance sizes',
          'Auto-scaling with aggressive scale-out policies',
          'Hybrid approach with targeted scaling'
        ],
        correctAnswer: 'Hybrid approach with targeted scaling',
        points: 130,
        hints: [
          'Different components need different scaling',
          'Cost efficiency matters during scaling',
          'Monitor impact of each scaling decision'
        ]
      },
      {
        id: 'monitoring-improvement',
        title: 'Performance Monitoring Enhancement',
        description: 'How do you prevent future performance degradations?',
        type: 'decision',
        options: [
          'Set up basic uptime monitoring only',
          'Implement comprehensive APM with distributed tracing',
          'Rely on user-reported performance issues',
          'Schedule weekly performance reviews'
        ],
        correctAnswer: 'Implement comprehensive APM with distributed tracing',
        points: 140,
        hints: [
          'APM provides detailed performance insights',
          'Distributed tracing shows cross-service issues',
          'Proactive monitoring prevents incidents'
        ]
      }
    ],
    successCriteria: [
      'Response times reduced below 500ms',
      'Error rate below 2%',
      'System stable under load',
      'Performance improvements documented'
    ],
    debriefing: {
      keyTakeaways: [
        'Systematic performance analysis is crucial',
        'Database is often the primary bottleneck',
        'Multiple optimization layers needed',
        'Monitoring enables proactive performance management'
      ],
      commonMistakes: [
        'Focusing on symptoms rather than root causes',
        'Optimizing single components in isolation',
        'Not testing optimizations under load',
        'Failing to monitor long-term performance trends'
      ],
      bestPractices: [
        'Implement comprehensive performance monitoring',
        'Use APM tools for distributed tracing',
        'Establish performance budgets and SLIs',
        'Regular performance testing and optimization'
      ],
      nextSteps: [
        'Implement performance monitoring dashboards',
        'Set up automated performance regression testing',
        'Conduct performance optimization workshops',
        'Establish performance engineering practices'
      ]
    }
  },
  {
    id: 'platform-engineering-challenge',
    title: 'Platform Migration Crisis',
    domain: 'platform',
    difficulty: 'expert',
    description: 'Lead a complex platform migration while maintaining service availability and managing technical debt.',
    objectives: [
      'Plan migration strategy and timeline',
      'Manage technical debt during migration',
      'Ensure service availability throughout',
      'Coordinate cross-team dependencies',
      'Validate migration success and rollback procedures'
    ],
    timeLimit: 2100, // 35 minutes
    specialization: 'Platform Engineering',
    scenario: `Your organization has decided to migrate from a legacy monolithic platform to a modern cloud-native architecture. The migration involves 50+ services, multiple databases, and complex interdependencies. The legacy system has accumulated significant technical debt, and the migration must happen while maintaining 99.9% uptime.

**Migration Scope:**
- 50 microservices to migrate
- 3 database systems (Oracle → PostgreSQL, MySQL → Aurora)
- Legacy messaging system → Cloud-native event streaming
- Monolithic authentication → Modern identity platform
- 100+ development teams affected

**Constraints:**
- Zero downtime requirement
- Budget constraints on cloud resources
- Legacy system support until Q4
- Regulatory compliance requirements

**Your Role:** Platform Engineering Director`,
    challenges: [
      {
        id: 'migration-strategy',
        title: 'Migration Approach',
        description: 'What migration strategy minimizes risk and downtime?',
        type: 'decision',
        options: [
          'Big bang migration over a weekend',
          'Strangler fig pattern with gradual migration',
          'Parallel run with immediate cutover',
          'Blue-green deployment with feature flags'
        ],
        correctAnswer: 'Strangler fig pattern with gradual migration',
        points: 150,
        hints: [
          'Gradual migration reduces risk',
          'Strangler fig allows incremental replacement',
          'Maintains backward compatibility',
          'Enables testing at each step'
        ]
      },
      {
        id: 'technical-debt-management',
        title: 'Technical Debt Strategy',
        description: 'How do you address technical debt during migration?',
        type: 'decision',
        options: [
          'Refactor everything during migration',
          'Accept technical debt and address post-migration',
          'Create abstraction layers to hide debt',
          'Delay migration until debt is resolved'
        ],
        correctAnswer: 'Create abstraction layers to hide debt',
        points: 180,
        hints: [
          'Migration and refactoring have different goals',
          'Abstraction layers enable incremental improvement',
          'Technical debt can be managed separately',
          'Focus on migration success first'
        ]
      },
      {
        id: 'dependency-management',
        title: 'Cross-Team Coordination',
        description: 'How do you manage dependencies between teams?',
        type: 'decision',
        options: [
          'Create a centralized migration team',
          'Use contract testing and API versioning',
          'Force all teams to migrate simultaneously',
          'Allow teams to migrate at their own pace'
        ],
        correctAnswer: 'Use contract testing and API versioning',
        points: 160,
        hints: [
          'Contract testing ensures compatibility',
          'API versioning enables independent deployment',
          'Central coordination needed for major changes',
          'Balance autonomy with coordination'
        ]
      },
      {
        id: 'rollback-planning',
        title: 'Rollback and Safety Nets',
        description: 'What rollback strategy ensures you can safely revert if issues arise?',
        type: 'decision',
        options: [
          'No rollback needed - test thoroughly before migration',
          'Database backups only for rollback',
          'Feature flags with instant rollback capability',
          'Keep legacy system running in parallel for 6 months'
        ],
        correctAnswer: 'Feature flags with instant rollback capability',
        points: 170,
        hints: [
          'Feature flags enable instant rollback',
          'No infrastructure changes needed',
          'Can rollback individual features',
          'Parallel systems are costly'
        ]
      },
      {
        id: 'success-validation',
        title: 'Migration Success Validation',
        description: 'How do you validate migration success and gain stakeholder confidence?',
        type: 'decision',
        options: [
          'Run automated tests and declare success',
          'Monitor for 24 hours then validate',
          'Comprehensive validation with business and technical KPIs',
          'Wait for user feedback before validation'
        ],
        correctAnswer: 'Comprehensive validation with business and technical KPIs',
        points: 150,
        hints: [
          'Both technical and business metrics matter',
          'KPIs provide objective success criteria',
          'Stakeholder confidence requires data'
        ]
      }
    ],
    successCriteria: [
      'Migration completed within timeline',
      'Zero downtime achieved',
      'All services successfully migrated',
      'Technical debt properly managed',
      'Teams effectively coordinated'
    ],
    debriefing: {
      keyTakeaways: [
        'Platform migrations require careful planning',
        'Gradual migration patterns reduce risk',
        'Technical debt needs strategic management',
        'Cross-team coordination is critical'
      ],
      commonMistakes: [
        'Underestimating migration complexity',
        'Trying to fix all technical debt during migration',
        'Poor communication between teams',
        'Inadequate testing and validation'
      ],
      bestPractices: [
        'Use proven migration patterns (strangler fig)',
        'Implement comprehensive testing strategies',
        'Establish clear communication channels',
        'Plan for rollback scenarios'
      ],
      nextSteps: [
        'Document migration lessons learned',
        'Establish platform engineering practices',
        'Implement automated testing pipelines',
        'Create platform migration playbooks'
      ]
    }
  }
];

export default function SpecializedOperations() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [selectedScenario, setSelectedScenario] = useState<SpecializedScenario | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<SpecializedAttempt | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [phase, setPhase] = useState<'selection' | 'briefing' | 'execution' | 'debrief'>('selection');
  const [decisions, setDecisions] = useState<SpecializedDecision[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState(false);

  const startScenario = (scenario: SpecializedScenario) => {
    setSelectedScenario(scenario);
    setCurrentAttempt({
      scenarioId: scenario.id,
      startTime: new Date(),
      score: 0,
      decisions: [],
      completed: false,
      specialization: scenario.specialization
    });
    setPhase('briefing');
    setTimeRemaining(scenario.timeLimit);
  };

  const startExecution = () => {
    setPhase('execution');
    setCurrentChallengeIndex(0);
  };

  const submitAnswer = () => {
    if (!selectedScenario || !currentAttempt) return;

    const currentChallenge = selectedScenario.challenges[currentChallengeIndex];
    const isCorrect = selectedAnswer === currentChallenge.correctAnswer;

    const decision: SpecializedDecision = {
      challengeId: currentChallenge.id,
      selectedAnswer,
      isCorrect,
      timeSpent: selectedScenario.timeLimit - timeRemaining,
      points: isCorrect ? currentChallenge.points : 0
    };

    const newDecisions = [...decisions, decision];
    setDecisions(newDecisions);

    const newScore = newDecisions.reduce((sum, d) => sum + d.points, 0);
    setCurrentAttempt({
      ...currentAttempt,
      score: newScore,
      decisions: newDecisions
    });

    if (currentChallengeIndex < selectedScenario.challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setSelectedAnswer('');
      setShowHint(false);
    } else {
      completeScenario(newScore, newDecisions);
    }
  };

  const completeScenario = (finalScore: number, finalDecisions: SpecializedDecision[]) => {
    if (!currentAttempt) return;

    setCurrentAttempt({
      ...currentAttempt,
      endTime: new Date(),
      score: finalScore,
      decisions: finalDecisions,
      completed: true
    });
    setPhase('debrief');
  };

  const resetScenario = () => {
    setSelectedScenario(null);
    setCurrentAttempt(null);
    setCurrentChallengeIndex(0);
    setPhase('selection');
    setDecisions([]);
    setTimeRemaining(0);
    setSelectedAnswer('');
    setShowHint(false);
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'security': return <Shield className="w-5 h-5" />;
      case 'performance': return <TrendingUp className="w-5 h-5" />;
      case 'platform': return <Cloud className="w-5 h-5" />;
      case 'compliance': return <Lock className="w-5 h-5" />;
      case 'multi-cloud': return <Globe className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'security': return 'text-red-400 border-red-400';
      case 'performance': return 'text-green-400 border-green-400';
      case 'platform': return 'text-blue-400 border-blue-400';
      case 'compliance': return 'text-yellow-400 border-yellow-400';
      case 'multi-cloud': return 'text-purple-400 border-purple-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">Please log in to access specialized operations training.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Shield className="w-8 h-8 mr-3 text-indigo-400" />
                Specialized Operations
              </h1>
              <p className="text-slate-400 mt-2">
                Phase 2.7: Domain-specific advanced training for specialized DevOps roles
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {phase === 'selection' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPECIALIZED_SCENARIOS.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center px-3 py-1 rounded-full border ${getDomainColor(scenario.domain)}`}>
                    {getDomainIcon(scenario.domain)}
                    <span className="ml-2 text-sm font-medium capitalize">{scenario.domain}</span>
                  </div>
                  <span className={`text-sm font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                    {scenario.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{scenario.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{scenario.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {Math.floor(scenario.timeLimit / 60)} minutes
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <Award className="w-4 h-4 mr-2" />
                    {scenario.specialization}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {scenario.objectives.slice(0, 2).map((objective, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded"
                    >
                      {objective}
                    </span>
                  ))}
                  {scenario.objectives.length > 2 && (
                    <span className="px-2 py-1 bg-slate-700 text-xs text-slate-500 rounded">
                      +{scenario.objectives.length - 2} more
                    </span>
                  )}
                </div>

                <button
                  onClick={() => startScenario(scenario)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Start Scenario
                </button>
              </div>
            ))}
          </div>
        )}

        {phase === 'briefing' && selectedScenario && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedScenario.title}</h2>
                <div className={`flex items-center px-3 py-1 rounded-full border ${getDomainColor(selectedScenario.domain)}`}>
                  {getDomainIcon(selectedScenario.domain)}
                  <span className="ml-2 text-sm font-medium capitalize">{selectedScenario.domain}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center text-slate-400 mb-2">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="text-sm">Time Limit</span>
                  </div>
                  <p className="text-white font-semibold">{Math.floor(selectedScenario.timeLimit / 60)} minutes</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center text-slate-400 mb-2">
                    <Target className="w-5 h-5 mr-2" />
                    <span className="text-sm">Difficulty</span>
                  </div>
                  <p className={`font-semibold ${getDifficultyColor(selectedScenario.difficulty)}`}>
                    {selectedScenario.difficulty}
                  </p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center text-slate-400 mb-2">
                    <Award className="w-5 h-5 mr-2" />
                    <span className="text-sm">Specialization</span>
                  </div>
                  <p className="text-white font-semibold">{selectedScenario.specialization}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Scenario Brief</h3>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-600">
                  <p className="text-slate-300 whitespace-pre-line">{selectedScenario.scenario}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Objectives</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedScenario.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center text-slate-300">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                      {objective}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={resetScenario}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Back to Selection
                </button>
                <button
                  onClick={startExecution}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Begin Specialized Operation
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === 'execution' && selectedScenario && currentAttempt && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
              {/* Header with timer and progress */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedScenario.title}</h2>
                  <p className="text-slate-400">Challenge {currentChallengeIndex + 1} of {selectedScenario.challenges.length}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Score</p>
                    <p className="text-xl font-bold text-indigo-400">{currentAttempt.score}</p>
                  </div>
                  <TimerCountdown
                    sessionId={currentAttempt?.scenarioId || 'specialized-ops'}
                    initialTimeSeconds={timeRemaining}
                    onTimeUp={() => completeScenario(currentAttempt.score, decisions)}
                    className="text-2xl font-mono"
                  />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Progress</span>
                  <span>{currentChallengeIndex + 1} / {selectedScenario.challenges.length}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentChallengeIndex + 1) / selectedScenario.challenges.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current challenge */}
              {(() => {
                const currentChallenge = selectedScenario.challenges[currentChallengeIndex];
                return (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">{currentChallenge.title}</h3>
                      <p className="text-slate-300 text-lg">{currentChallenge.description}</p>
                    </div>

                    {currentChallenge.type === 'decision' && currentChallenge.options && (
                      <div className="space-y-3">
                        {currentChallenge.options.map((option, index) => (
                          <label
                            key={index}
                            className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                              selectedAnswer === option
                                ? 'border-indigo-500 bg-indigo-500/10'
                                : 'border-slate-600 hover:border-slate-500'
                            }`}
                          >
                            <input
                              type="radio"
                              name="answer"
                              value={option}
                              checked={selectedAnswer === option}
                              onChange={(e) => setSelectedAnswer(e.target.value)}
                              className="mr-3"
                            />
                            <span className="text-white">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Hint system */}
                    <div className="border-t border-slate-700 pt-6">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        {showHint ? 'Hide Hint' : 'Show Hint'}
                      </button>

                      {showHint && (
                        <div className="mt-3 p-4 bg-slate-900 rounded-lg border border-slate-600">
                          <p className="text-slate-300">
                            💡 {currentChallenge.hints[Math.floor(Math.random() * currentChallenge.hints.length)]}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
                      <button
                        onClick={resetScenario}
                        className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        Abort Operation
                      </button>
                      <button
                        onClick={submitAnswer}
                        disabled={!selectedAnswer}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        Submit Decision
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {phase === 'debrief' && selectedScenario && currentAttempt && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  currentAttempt.score >= selectedScenario.challenges.reduce((sum, c) => sum + c.points, 0) * 0.8
                    ? 'bg-green-500/20 text-green-400'
                    : currentAttempt.score >= selectedScenario.challenges.reduce((sum, c) => sum + c.points, 0) * 0.6
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {currentAttempt.score >= selectedScenario.challenges.reduce((sum, c) => sum + c.points, 0) * 0.8 ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <AlertTriangle className="w-8 h-8" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Operation Complete</h2>
                <p className="text-slate-400">
                  Final Score: <span className="text-indigo-400 font-semibold">{currentAttempt.score}</span> points
                </p>
              </div>

              {/* Decision summary */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Decision Summary</h3>
                <div className="space-y-3">
                  {decisions.map((decision, index) => {
                    const challenge = selectedScenario.challenges.find(c => c.id === decision.challengeId);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                        <div className="flex items-center">
                          {decision.isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mr-3" />
                          )}
                          <div>
                            <p className="text-white font-medium">{challenge?.title}</p>
                            <p className="text-slate-400 text-sm">{decision.selectedAnswer}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-indigo-400 font-semibold">+{decision.points}</p>
                          <p className="text-slate-400 text-sm">{decision.timeSpent}s</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Debriefing content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-green-400" />
                    Key Takeaways
                  </h3>
                  <ul className="space-y-2">
                    {selectedScenario.debriefing.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start text-slate-300">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                    Common Mistakes
                  </h3>
                  <ul className="space-y-2">
                    {selectedScenario.debriefing.commonMistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start text-slate-300">
                        <XCircle className="w-4 h-4 mr-2 text-red-400 mt-0.5 flex-shrink-0" />
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-400" />
                    Best Practices
                  </h3>
                  <ul className="space-y-2">
                    {selectedScenario.debriefing.bestPractices.map((practice, index) => (
                      <li key={index} className="flex items-start text-slate-300">
                        <Target className="w-4 h-4 mr-2 text-blue-400 mt-0.5 flex-shrink-0" />
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-indigo-400" />
                    Next Steps
                  </h3>
                  <ul className="space-y-2">
                    {selectedScenario.debriefing.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start text-slate-300">
                        <Activity className="w-4 h-4 mr-2 text-indigo-400 mt-0.5 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetScenario}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Try Another Scenario
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}