/**
 * Week 10 Lesson 3 - Advanced Deployment Patterns
 * 4-Level Mastery Progression: Canary, blue-green, progressive delivery, Flagger
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week10Lesson3AdvancedDeployments: LeveledLessonContent = {
  lessonId: 'week10-lesson3-advanced-deployments',
  
  baseLesson: {
    title: 'Advanced Deployment Patterns',
    description: 'Implement advanced deployment strategies including canary deployments, blue-green deployments, and progressive delivery with automated analysis.',
    learningObjectives: [
      'Implement canary deployments with traffic shifting',
      'Execute blue-green deployments for zero-downtime releases',
      'Configure progressive delivery with Flagger',
      'Set up automated canary analysis and rollback',
      'Implement A/B testing for feature experimentation'
    ],
    prerequisites: [
      'Kubernetes Deployments and Services',
      'Istio or service mesh basics',
      'Prometheus metrics knowledge'
    ],
    estimatedTimePerLevel: {
      crawl: 40,
      walk: 30,
      runGuided: 25,
      runIndependent: 20
    }
  },

  crawl: {
    introduction: 'Learn advanced deployment patterns step-by-step. You will implement canary, blue-green, and progressive delivery with automated rollback.',
    expectedOutcome: 'Complete understanding of canary deployments, blue-green strategy, progressive delivery with Flagger, automated analysis, and safe rollout patterns',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Understand deployment patterns comparison',
        command: 'echo "Deployment Patterns:\n1. Rolling Update - Gradual pod replacement (default)\n2. Canary - Small % traffic to new version, gradual increase\n3. Blue-Green - Full environment switch at once\n4. A/B Testing - Traffic split by user attributes\n5. Shadow - Copy traffic to new version for testing"',
        explanation: 'Different patterns balance risk, complexity, and resource usage. Canary minimizes risk, blue-green ensures instant rollback, A/B tests features.',
        expectedOutput: 'Deployment patterns listed',
        validationCriteria: [
          'Understand each pattern purpose',
          'Know risk/benefit tradeoffs',
          'Recognize use cases'
        ],
        commonMistakes: ['Using wrong pattern for use case', 'Not planning rollback']
      },
      {
        stepNumber: 2,
        instruction: 'Implement manual canary with kubectl',
        command: 'kubectl create deployment app-v1 --image=myapp:v1 --replicas=9 && kubectl create deployment app-v2 --image=myapp:v2 --replicas=1 && kubectl expose deployment app-v1 --port=80 --target-port=8080 --name=app --selector=app=myapp',
        explanation: 'Canary deployment: 9 pods v1, 1 pod v2 = 10% traffic to new version. Service selects all pods with app=myapp label. Manual traffic control.',
        expectedOutput: 'Canary deployment created',
        validationCriteria: [
          '10% traffic to v2',
          '90% traffic to v1',
          'Service load balancing both'
        ],
        commonMistakes: ['Wrong label selectors', 'Not matching pod counts to percentages']
      },
      {
        stepNumber: 3,
        instruction: 'Install Flagger for automated progressive delivery',
        command: 'kubectl apply -k github.com/fluxcd/flagger//kustomize/istio && kubectl -n istio-system rollout status deployment/flagger',
        explanation: 'Flagger automates canary analysis: gradually shifts traffic, monitors metrics, auto-rollback on failures. Works with Istio, Linkerd, App Mesh.',
        expectedOutput: 'Flagger installed',
        validationCriteria: [
          'Flagger pod running',
          'CRDs created',
          'Metrics server configured'
        ],
        commonMistakes: ['Missing Istio', 'No Prometheus']
      },
      {
        stepNumber: 4,
        instruction: 'Deploy application for Flagger canary',
        command: 'kubectl create deployment podinfo --image=ghcr.io/stefanprodan/podinfo:6.3.0 && kubectl set image deployment/podinfo podinfo=ghcr.io/stefanprodan/podinfo:6.3.0 && kubectl expose deployment podinfo --port=9898 --target-port=9898',
        explanation: 'Flagger takes over deployment management. Updates image in deployment, Flagger creates canary, shifts traffic gradually based on metrics.',
        expectedOutput: 'Application deployed',
        validationCriteria: [
          'Deployment created',
          'Service exposing app',
          'Ready for Flagger management'
        ],
        commonMistakes: ['Wrong port', 'Missing health checks']
      },
      {
        stepNumber: 5,
        instruction: 'Create Flagger Canary resource with automated analysis',
        command: 'kubectl apply -f - <<EOF\napiVersion: flagger.app/v1beta1\nkind: Canary\nmetadata:\n  name: podinfo\nspec:\n  targetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: podinfo\n  progressDeadlineSeconds: 60\n  service:\n    port: 9898\n  analysis:\n    interval: 30s\n    threshold: 5\n    maxWeight: 50\n    stepWeight: 10\n    metrics:\n    - name: request-success-rate\n      thresholdRange:\n        min: 99\n      interval: 1m\n    - name: request-duration\n      thresholdRange:\n        max: 500\n      interval: 1m\n    webhooks:\n    - name: load-test\n      url: http://flagger-loadtester/\n      timeout: 5s\n      metadata:\n        cmd: "hey -z 1m -q 10 -c 2 http://podinfo-canary:9898/"\nEOF',
        explanation: 'Canary spec: 10% traffic increments every 30s, up to 50% max. Checks success rate >99%, latency <500ms. Load test generates traffic. 5 consecutive passes needed.',
        expectedOutput: 'Canary resource created',
        validationCriteria: [
          'Canary initialized',
          'Primary deployment created',
          'VirtualService configured'
        ],
        commonMistakes: ['Metrics not available', 'Thresholds too strict']
      },
      {
        stepNumber: 6,
        instruction: 'Trigger canary deployment by updating image',
        command: 'kubectl set image deployment/podinfo podinfo=ghcr.io/stefanprodan/podinfo:6.3.1 && kubectl describe canary podinfo',
        explanation: 'Flagger detects image change, starts canary analysis: deploys canary pods, shifts traffic 10→20→30→40→50%, monitors metrics. Auto-rollback if metrics fail.',
        expectedOutput: 'Canary progressing',
        validationCriteria: [
          'Canary status: Progressing',
          'Traffic shifting gradually',
          'Metrics being checked'
        ],
        commonMistakes: ['Not waiting for completion', 'Updating during canary']
      },
      {
        stepNumber: 7,
        instruction: 'Monitor canary progress and metrics',
        command: 'kubectl get canary podinfo -w && kubectl -n istio-system logs deployment/flagger -f --tail=10',
        explanation: 'Watch canary phases: Initializing → Waiting → Progressing → Promoting or Rolling Back. Flagger logs show traffic weights, metric analysis, decisions.',
        expectedOutput: 'Canary promoted or rolled back',
        validationCriteria: [
          'Traffic shifted incrementally',
          'Metrics analyzed each step',
          'Final status: Succeeded or Failed'
        ],
        commonMistakes: ['Interrupting canary', 'Not checking metrics']
      },
      {
        stepNumber: 8,
        instruction: 'Implement blue-green deployment with Services',
        command: 'kubectl create deployment app-blue --image=myapp:v1 --replicas=3 && kubectl create deployment app-green --image=myapp:v2 --replicas=3 && kubectl create service clusterip app --tcp=80:8080 && kubectl patch service app -p \'{"spec":{"selector":{"version":"blue"}}}\'',
        explanation: 'Blue-green: two full environments. Service points to blue (v1). After testing green, switch service selector to green. Instant rollback: switch back to blue.',
        expectedOutput: 'Blue-green setup created',
        validationCriteria: [
          'Both environments running',
          'Service pointing to blue',
          'Ready to switch'
        ],
        commonMistakes: ['Insufficient resources for 2x pods', 'Not testing green before switch']
      },
      {
        stepNumber: 9,
        instruction: 'Switch traffic to green environment',
        command: 'kubectl patch service app -p \'{"spec":{"selector":{"version":"green"}}}\' && kubectl get endpoints app',
        explanation: 'Service now routes all traffic to green pods. Zero downtime switch. Monitor for issues. If problems, immediately patch back to blue.',
        expectedOutput: 'Traffic switched to green',
        validationCriteria: [
          'Endpoints showing green pods',
          'All traffic to v2',
          'Blue still running for rollback'
        ],
        commonMistakes: ['Deleting blue too soon', 'Not monitoring after switch']
      },
      {
        stepNumber: 10,
        instruction: 'Configure A/B testing with header-based routing',
        command: 'kubectl apply -f - <<EOF\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: ab-test\nspec:\n  hosts:\n  - myapp\n  http:\n  - match:\n    - headers:\n        x-version:\n          exact: beta\n    route:\n    - destination:\n        host: myapp\n        subset: v2\n  - route:\n    - destination:\n        host: myapp\n        subset: v1\nEOF',
        explanation: 'A/B testing routes based on user attributes. Users with "x-version: beta" header get v2, others get v1. Test features with specific user segments.',
        expectedOutput: 'A/B routing configured',
        validationCriteria: [
          'Header-based routing active',
          'Beta users see v2',
          'Default users see v1'
        ],
        commonMistakes: ['Wrong header matching', 'No analytics tracking']
      },
      {
        stepNumber: 11,
        instruction: 'Set up automated rollback on metric failures',
        command: 'kubectl apply -f - <<EOF\napiVersion: flagger.app/v1beta1\nkind: Canary\nmetadata:\n  name: podinfo\nspec:\n  targetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: podinfo\n  analysis:\n    interval: 1m\n    threshold: 3\n    metrics:\n    - name: error-rate\n      templateRef:\n        name: error-rate\n      thresholdRange:\n        max: 1\n    - name: latency-p99\n      templateRef:\n        name: latency\n      thresholdRange:\n        max: 1000\nEOF',
        explanation: 'Automated rollback triggers if error rate >1% or p99 latency >1s. After 3 consecutive failures, Flagger scales canary to 0, routes all traffic to primary.',
        expectedOutput: 'Rollback automation configured',
        validationCriteria: [
          'Metrics monitored continuously',
          'Threshold violations detected',
          'Automatic canary termination'
        ],
        commonMistakes: ['Thresholds too sensitive', 'Not enough data for metrics']
      },
      {
        stepNumber: 12,
        instruction: 'Implement traffic shadowing for testing',
        command: 'kubectl apply -f - <<EOF\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: shadow-test\nspec:\n  hosts:\n  - myapp\n  http:\n  - route:\n    - destination:\n        host: myapp\n        subset: v1\n      weight: 100\n    mirror:\n      host: myapp\n      subset: v2\n    mirrorPercentage:\n      value: 100\nEOF',
        explanation: 'Shadow deployment: 100% traffic to v1 (production), 100% mirrored to v2 (test). v2 responses ignored. Test new version with real traffic without user impact.',
        expectedOutput: 'Traffic shadowing active',
        validationCriteria: [
          'All production traffic to v1',
          'All traffic mirrored to v2',
          'v2 responses discarded'
        ],
        commonMistakes: ['Using mirror responses', 'Overloading v2']
      }
    ]
  },

  walk: {
    introduction: 'Apply advanced deployment patterns through hands-on exercises.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Create Flagger Canary with automated analysis.',
        template: `apiVersion: flagger.app/__V1BETA1__
kind: __CANARY__
metadata:
  name: my-app
spec:
  targetRef:
    apiVersion: apps/v1
    kind: __DEPLOYMENT__
    name: my-app
  progressDeadlineSeconds: __60__
  service:
    port: 8080
  analysis:
    interval: __30S__
    threshold: __5__
    maxWeight: __50__
    stepWeight: __10__
    metrics:
    - name: request-success-rate
      thresholdRange:
        min: __99__
      interval: 1m
    - name: request-duration
      thresholdRange:
        max: __500__
      interval: 1m`,
        blanks: [
          {
            id: 'V1BETA1',
            label: 'V1BETA1',
            hint: 'API version',
            correctValue: 'v1beta1',
            validationPattern: 'v1beta1'
          },
          {
            id: 'CANARY',
            label: 'CANARY',
            hint: 'Resource kind',
            correctValue: 'Canary',
            validationPattern: 'canary'
          },
          {
            id: 'DEPLOYMENT',
            label: 'DEPLOYMENT',
            hint: 'Target type',
            correctValue: 'Deployment',
            validationPattern: 'deployment'
          },
          {
            id: '60',
            label: '60',
            hint: 'Deadline seconds',
            correctValue: '60',
            validationPattern: '60'
          },
          {
            id: '30S',
            label: '30S',
            hint: 'Analysis interval',
            correctValue: '30s',
            validationPattern: '30s'
          },
          {
            id: '5',
            label: '5',
            hint: 'Pass threshold',
            correctValue: '5',
            validationPattern: '5'
          },
          {
            id: '50',
            label: '50',
            hint: 'Max traffic weight',
            correctValue: '50',
            validationPattern: '50'
          },
          {
            id: '10',
            label: '10',
            hint: 'Traffic increment',
            correctValue: '10',
            validationPattern: '10'
          },
          {
            id: '99',
            label: '99',
            hint: 'Min success rate',
            correctValue: '99',
            validationPattern: '99'
          },
          {
            id: '500',
            label: '500',
            hint: 'Max latency ms',
            correctValue: '500',
            validationPattern: '500'
          }
        ],
        solution: 'Flagger canary increases traffic 10% every 30s up to 50% max. Requires 5 consecutive metric passes: success rate >99%, latency <500ms. Auto-rollback on failures.',
        explanation: 'Progressive delivery automates safe rollouts with metric validation'
      },
      {
        exerciseNumber: 2,
        scenario: 'Implement blue-green deployment with service switching.',
        template: `# Deploy blue environment
kubectl create deployment app-blue --image=myapp:__V1__ --replicas=__3__
kubectl label deployment app-blue version=__BLUE__

# Deploy green environment  
kubectl create deployment app-green --image=myapp:v2 --replicas=3
kubectl label deployment app-green version=__GREEN__

# Create service pointing to blue
kubectl create service clusterip app --tcp=80:8080
kubectl patch service app -p '{"spec":{"selector":{"version":"__BLUE__"}}}'

# Switch to green
kubectl patch service app -p '{"spec":{"selector":{"version":"green"}}}'`,
        blanks: [
          {
            id: 'V1',
            label: 'V1',
            hint: 'Blue version',
            correctValue: 'v1',
            validationPattern: 'v1'
          },
          {
            id: '3',
            label: '3',
            hint: 'Replica count',
            correctValue: '3',
            validationPattern: '3'
          },
          {
            id: 'BLUE',
            label: 'BLUE',
            hint: 'Environment label',
            correctValue: 'blue',
            validationPattern: 'blue'
          },
          {
            id: 'GREEN',
            label: 'GREEN',
            hint: 'Environment label',
            correctValue: 'green',
            validationPattern: 'green'
          }
        ],
        solution: 'Blue-green deployment maintains two full environments. Service selector switches between blue and green. Instant rollback by switching back. Requires 2x resources.',
        explanation: 'Blue-green enables instant zero-downtime switches and rollbacks'
      },
      {
        exerciseNumber: 3,
        scenario: 'Configure A/B testing with header-based routing.',
        template: `apiVersion: networking.istio.io/__V1BETA1__
kind: __VIRTUAL_SERVICE__
metadata:
  name: ab-test
spec:
  hosts:
  - myapp
  http:
  - match:
    - headers:
        __X_VERSION__:
          exact: __BETA__
    route:
    - destination:
        host: myapp
        subset: __V2__
  - route:
    - destination:
        host: myapp
        subset: v1
      weight: __100__`,
        blanks: [
          {
            id: 'V1BETA1',
            label: 'V1BETA1',
            hint: 'API version',
            correctValue: 'v1beta1',
            validationPattern: 'v1beta1'
          },
          {
            id: 'VIRTUAL_SERVICE',
            label: 'VIRTUAL_SERVICE',
            hint: 'Resource kind',
            correctValue: 'VirtualService',
            validationPattern: 'virtual.*service'
          },
          {
            id: 'X_VERSION',
            label: 'X_VERSION',
            hint: 'Header name',
            correctValue: 'x-version',
            validationPattern: 'x.*version'
          },
          {
            id: 'BETA',
            label: 'BETA',
            hint: 'Header value',
            correctValue: 'beta',
            validationPattern: 'beta'
          },
          {
            id: 'V2',
            label: 'V2',
            hint: 'Destination subset',
            correctValue: 'v2',
            validationPattern: 'v2'
          },
          {
            id: '100',
            label: '100',
            hint: 'Default weight',
            correctValue: '100',
            validationPattern: '100'
          }
        ],
        solution: 'A/B testing routes by header: "x-version: beta" → v2, default → v1. Test features with specific user segments. Track metrics per version for comparison.',
        explanation: 'A/B testing enables feature experimentation with controlled user groups'
      },
      {
        exerciseNumber: 4,
        scenario: 'Set up canary with automated rollback.',
        template: `apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: my-app
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  analysis:
    interval: __1M__
    threshold: __3__
    metrics:
    - name: error-rate
      thresholdRange:
        max: __1__
    - name: latency-p99
      thresholdRange:
        max: __1000__
  canaryAnalysis:
    match:
    - headers:
        x-canary:
          exact: "__TRUE__"`,
        blanks: [
          {
            id: '1M',
            label: '1M',
            hint: 'Check interval',
            correctValue: '1m',
            validationPattern: '1m'
          },
          {
            id: '3',
            label: '3',
            hint: 'Failure threshold',
            correctValue: '3',
            validationPattern: '3'
          },
          {
            id: '1',
            label: '1',
            hint: 'Max error rate %',
            correctValue: '1',
            validationPattern: '1'
          },
          {
            id: '1000',
            label: '1000',
            hint: 'Max latency ms',
            correctValue: '1000',
            validationPattern: '1000'
          },
          {
            id: 'TRUE',
            label: 'TRUE',
            hint: 'Header value',
            correctValue: 'true',
            validationPattern: 'true'
          }
        ],
        solution: 'Automated rollback after 3 consecutive failures. Metrics checked every 1m: error rate <1%, p99 latency <1s. Canary traffic via x-canary header for controlled testing.',
        explanation: 'Automated rollback prevents bad deployments from affecting users'
      },
      {
        exerciseNumber: 5,
        scenario: 'Configure traffic shadowing for testing.',
        template: `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: shadow-test
spec:
  hosts:
  - myapp
  http:
  - route:
    - destination:
        host: myapp
        subset: __STABLE__
      weight: __100__
    mirror:
      host: myapp
      subset: __CANARY__
    mirrorPercentage:
      value: __100__`,
        blanks: [
          {
            id: 'STABLE',
            label: 'STABLE',
            hint: 'Production subset',
            correctValue: 'stable',
            validationPattern: 'stable'
          },
          {
            id: '100',
            label: '100',
            hint: 'Production weight',
            correctValue: '100',
            validationPattern: '100'
          },
          {
            id: 'CANARY',
            label: 'CANARY',
            hint: 'Test subset',
            correctValue: 'canary',
            validationPattern: 'canary'
          }
        ],
        solution: 'Traffic shadowing sends all production traffic to stable, mirrors 100% to canary. Canary responses discarded. Test new version with real traffic without user impact.',
        explanation: 'Shadowing tests new versions safely with production traffic patterns'
      }
    ],
    hints: [
      'Canary deployments gradually shift traffic while monitoring metrics',
      'Blue-green requires 2x resources but enables instant rollback',
      'Flagger automates progressive delivery with metric analysis',
      'A/B testing routes by user attributes for feature experiments',
      'Traffic shadowing sends copies without using responses'
    ]
  },

  runGuided: {
    objective: 'Build production deployment pipeline with automated progressive delivery, canary analysis, blue-green deployments, and safe rollback',
    conceptualGuidance: [
      'Design deployment strategy: canary for gradual rollouts, blue-green for instant rollback',
      'Deploy Flagger with Istio for automated progressive delivery',
      'Configure metric-based canary analysis (success rate, latency, errors)',
      'Set up automated rollback on metric failures',
      'Implement A/B testing for feature experimentation',
      'Use traffic shadowing to test with production traffic safely',
      'Monitor deployments with Prometheus and Grafana',
      'Document rollback procedures and runbooks',
      'Test failover scenarios and recovery'
    ],
    keyConceptsToApply: [
      'Progressive delivery patterns',
      'Automated canary analysis',
      'Metric-based rollback decisions',
      'Blue-green deployment strategy',
      'A/B testing and experimentation'
    ],
    checkpoints: [
      {
        checkpoint: 'Flagger progressive delivery automated',
        description: 'Automated canary deployments with metric analysis',
        validationCriteria: [
          'Flagger managing deployments',
          'Canary resources configured',
          'Traffic shifting automatically (10% increments)',
          'Metrics analyzed each step (success rate, latency)',
          'Load testing generating traffic',
          'Successful deployments promoted automatically'
        ],
        hintIfStuck: 'Install Flagger with Istio. Create Canary resource with analysis metrics. Update deployment image to trigger canary. Monitor with kubectl get canary -w.'
      },
      {
        checkpoint: 'Blue-green deployment working',
        description: 'Zero-downtime environment switching',
        validationCriteria: [
          'Blue and green environments running',
          'Service selector switching traffic',
          'Instant cutover with zero downtime',
          'Rollback tested by switching back',
          'Monitoring shows clean switch',
          'Old environment retained for rollback'
        ],
        hintIfStuck: 'Deploy two full environments with version labels. Create service with selector. Test green thoroughly. Switch service selector to green. Monitor traffic. Keep blue for rollback.'
      },
      {
        checkpoint: 'Automated rollback on failures',
        description: 'Metric failures trigger automatic rollback',
        validationCriteria: [
          'Canary deployment with strict metrics',
          'Failed metrics detected automatically',
          'Rollback triggered without manual intervention',
          'Traffic returned to stable version',
          'Alerts sent on rollback',
          'Deployment marked as failed'
        ],
        hintIfStuck: 'Configure Flagger Canary with low thresholds. Deploy broken version. Watch Flagger detect metric violations. Verify automatic rollback. Check Flagger logs for decision reasoning.'
      }
    ],
    resourcesAllowed: [
      'Flagger documentation',
      'Progressive delivery best practices',
      'Blue-green deployment guides',
      'Canary analysis patterns'
    ]
  },

  runIndependent: {
    objective: 'Build production-grade deployment pipeline with comprehensive progressive delivery, automated canary analysis, blue-green strategy, A/B testing, and complete observability',
    successCriteria: [
      'Progressive delivery: Flagger automating canary rollouts with traffic shifting',
      'Canary analysis: success rate, latency, error rate metrics validated',
      'Automated rollback: metric failures trigger immediate rollback',
      'Blue-green deployments: full environment switching for major releases',
      'A/B testing: header/cookie-based routing for feature experiments',
      'Traffic shadowing: testing with production traffic patterns',
      'Load testing: automated traffic generation during canary',
      'Monitoring: Prometheus metrics, Grafana dashboards, alerts',
      'Rollback procedures: documented and tested for all patterns',
      'Documentation: deployment strategies, metrics thresholds, runbooks'
    ],
    timeTarget: 20,
    minimumRequirements: [
      'Flagger managing canary deployments',
      'Automated metric analysis working',
      'Blue-green deployment tested'
    ],
    evaluationRubric: [
      {
        criterion: 'Progressive Delivery',
        weight: 35,
        passingThreshold: 'Flagger automating canary deployments. Traffic shifting incrementally (10-20-30-40-50%). Metrics analyzed each step. Load testing active. Promotions automatic on success. Rollback automatic on failure. Multiple apps using pattern.'
      },
      {
        criterion: 'Deployment Strategies',
        weight: 25,
        passingThreshold: 'Canary for gradual rollouts. Blue-green for instant switching. A/B testing for features. Traffic shadowing for testing. Each pattern documented with use cases. Teams know when to use which pattern.'
      },
      {
        criterion: 'Automated Analysis & Rollback',
        weight: 25,
        passingThreshold: 'Metrics monitored: success rate, latency, errors. Thresholds configured appropriately. Failures detected quickly. Rollback automatic within 2 minutes. Alerts on rollback. No manual intervention needed.'
      },
      {
        criterion: 'Observability',
        weight: 15,
        passingThreshold: 'Prometheus scraping deployment metrics. Grafana dashboards showing canary progress. Alerts on metric violations. Logs aggregated for debugging. Traffic patterns visualized. Historical deployment data tracked.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=qRPNuT080Hk',
  documentation: [
    'https://flagger.app/',
    'https://martinfowler.com/bliki/CanaryRelease.html',
    'https://martinfowler.com/bliki/BlueGreenDeployment.html',
    'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy',
    'https://docs.flagger.app/usage/progressive-delivery',
    'https://www.weave.works/blog/progressive-delivery-with-flagger-and-istio'
  ],
  relatedConcepts: [
    'Canary deployments',
    'Blue-green deployment strategy',
    'Progressive delivery with Flagger',
    'Automated canary analysis',
    'A/B testing patterns',
    'Traffic shadowing for testing'
  ]
};
