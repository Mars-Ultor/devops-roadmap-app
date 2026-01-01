/**
 * Week 10 Lesson 1 - Microservices Architecture & Service Mesh
 * 4-Level Mastery Progression: Microservices design, service mesh, Istio, traffic management
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week10Lesson1MicroservicesServiceMesh: LeveledLessonContent = {
  lessonId: 'week10-lesson1-microservices-service-mesh',
  
  baseLesson: {
    title: 'Microservices Architecture & Service Mesh',
    description: 'Design microservices architectures and implement service mesh with Istio for traffic management, security, and observability.',
    learningObjectives: [
      'Understand microservices architecture patterns and design principles',
      'Deploy and configure Istio service mesh',
      'Implement traffic management: routing, splitting, mirroring',
      'Configure mutual TLS and service-to-service authentication',
      'Set up observability with distributed tracing and metrics'
    ],
    prerequisites: [
      'Kubernetes fundamentals',
      'Container networking basics',
      'Understanding of distributed systems'
    ],
    estimatedTimePerLevel: {
      crawl: 50,
      walk: 35,
      runGuided: 30,
      runIndependent: 25
    }
  },

  crawl: {
    introduction: 'Learn microservices and service mesh step-by-step. You will design microservices, deploy Istio, and configure traffic management.',
    expectedOutcome: 'Complete understanding of microservices architecture patterns, service mesh concepts, Istio installation and configuration, traffic routing, mTLS, and distributed tracing',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Understand microservices architecture principles',
        command: 'echo "Microservices Principles:\n1. Single Responsibility - Each service does one thing well\n2. Autonomous - Services deployed independently\n3. Decentralized - No central orchestration\n4. Resilient - Failures isolated and handled\n5. Observable - Comprehensive logging and monitoring\n6. API-First - Well-defined contracts"',
        explanation: 'Microservices break monoliths into small, independent services. Each service has its own database, can be deployed separately, and communicates via APIs.',
        expectedOutput: 'Microservices principles listed',
        validationCriteria: [
          'Understand service autonomy',
          'Know benefits over monoliths',
          'Recognize communication patterns'
        ],
        commonMistakes: ['Creating too many microservices', 'Shared databases between services']
      },
      {
        stepNumber: 2,
        instruction: 'Install Istio service mesh',
        command: 'curl -L https://istio.io/downloadIstio | sh - && cd istio-* && export PATH=$PWD/bin:$PATH && istioctl install --set profile=demo -y',
        explanation: 'Istio provides traffic management, security, and observability without changing application code. It uses sidecar proxies (Envoy) injected into each pod.',
        expectedOutput: 'Istio installed',
        validationCriteria: [
          'Istio control plane running',
          'istioctl command available',
          'Ingress gateway deployed'
        ],
        commonMistakes: ['Wrong Kubernetes version', 'Insufficient cluster resources']
      },
      {
        stepNumber: 3,
        instruction: 'Enable sidecar injection for namespace',
        command: 'kubectl label namespace default istio-injection=enabled && kubectl get namespace -L istio-injection',
        explanation: 'Sidecar injection adds Envoy proxy container to every pod. The proxy intercepts all network traffic for traffic management and telemetry.',
        expectedOutput: 'Namespace labeled for injection',
        validationCriteria: [
          'istio-injection=enabled label set',
          'New pods have 2 containers (app + proxy)',
          'Istio annotations present'
        ],
        commonMistakes: ['Forgetting to restart pods after labeling', 'Injection disabled']
      },
      {
        stepNumber: 4,
        instruction: 'Deploy sample microservices application',
        command: 'kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/bookinfo/platform/kube/bookinfo.yaml',
        explanation: 'Bookinfo app has 4 microservices: productpage (Python), details (Ruby), reviews (Java, 3 versions), ratings (Node.js). Demonstrates polyglot microservices.',
        expectedOutput: 'Application deployed',
        validationCriteria: [
          'All pods running with 2 containers',
          'Services created',
          'Sidecars injected'
        ],
        commonMistakes: ['Namespace not labeled', 'Insufficient resources']
      },
      {
        stepNumber: 5,
        instruction: 'Create Istio Gateway for ingress',
        command: 'kubectl apply -f - <<EOF\napiVersion: networking.istio.io/v1beta1\nkind: Gateway\nmetadata:\n  name: bookinfo-gateway\nspec:\n  selector:\n    istio: ingressgateway\n  servers:\n  - port:\n      number: 80\n      name: http\n      protocol: HTTP\n    hosts:\n    - "*"\n---\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: bookinfo\nspec:\n  hosts:\n  - "*"\n  gateways:\n  - bookinfo-gateway\n  http:\n  - match:\n    - uri:\n        exact: /productpage\n    route:\n    - destination:\n        host: productpage\n        port:\n          number: 9080\nEOF',
        explanation: 'Gateway configures load balancer for external traffic. VirtualService routes traffic from Gateway to internal services.',
        expectedOutput: 'Gateway and VirtualService created',
        validationCriteria: [
          'Gateway bound to ingress',
          'VirtualService routing configured',
          'Application accessible via gateway'
        ],
        commonMistakes: ['Host mismatch', 'Wrong port number']
      },
      {
        stepNumber: 6,
        instruction: 'Configure traffic splitting (canary)',
        command: 'kubectl apply -f - <<EOF\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: reviews\nspec:\n  hosts:\n  - reviews\n  http:\n  - match:\n    - headers:\n        end-user:\n          exact: jason\n    route:\n    - destination:\n        host: reviews\n        subset: v2\n  - route:\n    - destination:\n        host: reviews\n        subset: v1\n      weight: 80\n    - destination:\n        host: reviews\n        subset: v3\n      weight: 20\n---\napiVersion: networking.istio.io/v1beta1\nkind: DestinationRule\nmetadata:\n  name: reviews\nspec:\n  host: reviews\n  subsets:\n  - name: v1\n    labels:\n      version: v1\n  - name: v2\n    labels:\n      version: v2\n  - name: v3\n    labels:\n      version: v3\nEOF',
        explanation: 'VirtualService routes 80% traffic to v1, 20% to v3 (canary). User "jason" always gets v2. DestinationRule defines service subsets based on labels.',
        expectedOutput: 'Traffic splitting configured',
        validationCriteria: [
          'VirtualService routing by weight',
          'DestinationRule subsets defined',
          'Traffic distributed correctly'
        ],
        commonMistakes: ['Weights not adding to 100', 'Subset label mismatch']
      },
      {
        stepNumber: 7,
        instruction: 'Enable mutual TLS for service-to-service encryption',
        command: 'kubectl apply -f - <<EOF\napiVersion: security.istio.io/v1beta1\nkind: PeerAuthentication\nmetadata:\n  name: default\n  namespace: default\nspec:\n  mtls:\n    mode: STRICT\nEOF',
        explanation: 'PeerAuthentication enforces mutual TLS between all services. STRICT mode requires mTLS, PERMISSIVE allows both encrypted and plaintext.',
        expectedOutput: 'mTLS enabled',
        validationCriteria: [
          'All service-to-service traffic encrypted',
          'Certificate rotation automatic',
          'Zero-trust networking active'
        ],
        commonMistakes: ['Breaking external services', 'Legacy apps not compatible']
      },
      {
        stepNumber: 8,
        instruction: 'Configure request timeout and retry',
        command: 'kubectl apply -f - <<EOF\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: ratings-timeout\nspec:\n  hosts:\n  - ratings\n  http:\n  - timeout: 1s\n    retries:\n      attempts: 3\n      perTryTimeout: 500ms\n      retryOn: 5xx,reset,connect-failure,refused-stream\n    route:\n    - destination:\n        host: ratings\nEOF',
        explanation: 'Timeout prevents hanging requests (1s total). Retries handle transient failures (3 attempts, 500ms each). RetryOn specifies error conditions.',
        expectedOutput: 'Resilience policies configured',
        validationCriteria: [
          'Requests timeout after 1s',
          'Failed requests retry up to 3 times',
          'Total maximum time: 1.5s'
        ],
        commonMistakes: ['Timeout too short', 'Retry amplification']
      },
      {
        stepNumber: 9,
        instruction: 'Implement circuit breaker',
        command: 'kubectl apply -f - <<EOF\napiVersion: networking.istio.io/v1beta1\nkind: DestinationRule\nmetadata:\n  name: ratings-circuit-breaker\nspec:\n  host: ratings\n  trafficPolicy:\n    connectionPool:\n      tcp:\n        maxConnections: 100\n      http:\n        http1MaxPendingRequests: 10\n        maxRequestsPerConnection: 2\n    outlierDetection:\n      consecutiveErrors: 5\n      interval: 30s\n      baseEjectionTime: 30s\n      maxEjectionPercent: 50\nEOF',
        explanation: 'Circuit breaker limits connections and requests to prevent cascading failures. Outlier detection ejects unhealthy instances after 5 consecutive errors.',
        expectedOutput: 'Circuit breaker active',
        validationCriteria: [
          'Connection limits enforced',
          'Failed instances ejected',
          'Prevents cascade failures'
        ],
        commonMistakes: ['Limits too aggressive', 'Not monitoring ejections']
      },
      {
        stepNumber: 10,
        instruction: 'Enable distributed tracing with Jaeger',
        command: 'kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/jaeger.yaml && kubectl rollout status deployment/jaeger -n istio-system',
        explanation: 'Jaeger collects traces from Envoy sidecars. Shows request flow through microservices, latencies, and failures. No application changes needed.',
        expectedOutput: 'Jaeger deployed',
        validationCriteria: [
          'Jaeger pods running',
          'Traces collected automatically',
          'UI accessible'
        ],
        commonMistakes: ['Not propagating trace headers', 'Sampling rate too low']
      },
      {
        stepNumber: 11,
        instruction: 'Deploy Kiali for service mesh visualization',
        command: 'kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.20/samples/addons/kiali.yaml && kubectl rollout status deployment/kiali -n istio-system',
        explanation: 'Kiali visualizes service mesh topology, traffic flow, health, and configuration. Shows which services communicate, error rates, latencies.',
        expectedOutput: 'Kiali deployed',
        validationCriteria: [
          'Kiali UI accessible',
          'Service graph visible',
          'Traffic metrics shown'
        ],
        commonMistakes: ['Missing Prometheus', 'No traffic to visualize']
      },
      {
        stepNumber: 12,
        instruction: 'Implement traffic mirroring (shadow testing)',
        command: 'kubectl apply -f - <<EOF\napiVersion: networking.istio.io/v1beta1\nkind: VirtualService\nmetadata:\n  name: reviews-mirror\nspec:\n  hosts:\n  - reviews\n  http:\n  - route:\n    - destination:\n        host: reviews\n        subset: v1\n      weight: 100\n    mirror:\n      host: reviews\n      subset: v3\n    mirrorPercentage:\n      value: 10.0\nEOF',
        explanation: 'Traffic mirroring sends copy of production traffic to v3 for testing. 100% goes to v1 (production), 10% mirrored to v3. v3 responses discarded.',
        expectedOutput: 'Traffic mirroring active',
        validationCriteria: [
          'Production traffic to v1',
          'Copy sent to v3',
          'v3 responses ignored'
        ],
        commonMistakes: ['Using mirrored responses', 'Too much mirror traffic']
      }
    ]
  },

  walk: {
    introduction: 'Apply microservices and service mesh through hands-on exercises.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Create Istio VirtualService with weighted routing.',
        template: `apiVersion: networking.istio.io/__V1BETA1__
kind: __VIRTUAL_SERVICE__
metadata:
  name: my-service
spec:
  hosts:
  - my-service
  http:
  - route:
    - destination:
        host: my-service
        subset: __V1__
      weight: __90__
    - destination:
        host: my-service
        subset: v2
      weight: 10
---
apiVersion: networking.istio.io/v1beta1
kind: __DESTINATION_RULE__
metadata:
  name: my-service
spec:
  host: my-service
  subsets:
  - name: v1
    labels:
      version: __V1__
  - name: v2
    labels:
      version: v2`,
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
            id: 'V1',
            label: 'V1',
            hint: 'Version subset',
            correctValue: 'v1',
            validationPattern: 'v1'
          },
          {
            id: '90',
            label: '90',
            hint: 'Percentage weight',
            correctValue: '90',
            validationPattern: '90'
          },
          {
            id: 'DESTINATION_RULE',
            label: 'DESTINATION_RULE',
            hint: 'Resource kind',
            correctValue: 'DestinationRule',
            validationPattern: 'destination.*rule'
          }
        ],
        solution: 'VirtualService routes 90% to v1, 10% to v2 (canary deployment). DestinationRule defines subsets based on version labels. Use for gradual rollouts.',
        explanation: 'Weighted routing enables safe canary deployments and A/B testing'
      },
      {
        exerciseNumber: 2,
        scenario: 'Configure circuit breaker with outlier detection.',
        template: `apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: circuit-breaker
spec:
  host: __MY_SERVICE__
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: __100__
      http:
        http1MaxPendingRequests: 10
        maxRequestsPerConnection: __2__
    outlierDetection:
      consecutiveErrors: __5__
      interval: __30S__
      baseEjectionTime: 30s
      maxEjectionPercent: 50`,
        blanks: [
          {
            id: 'MY_SERVICE',
            label: 'MY_SERVICE',
            hint: 'Service name',
            correctValue: 'my-service',
            validationPattern: 'my.*service'
          },
          {
            id: '100',
            label: '100',
            hint: 'Max connections',
            correctValue: '100',
            validationPattern: '100'
          },
          {
            id: '2',
            label: '2',
            hint: 'Requests per connection',
            correctValue: '2',
            validationPattern: '2'
          },
          {
            id: '5',
            label: '5',
            hint: 'Error threshold',
            correctValue: '5',
            validationPattern: '5'
          },
          {
            id: '30S',
            label: '30S',
            hint: 'Detection interval',
            correctValue: '30s',
            validationPattern: '30s'
          }
        ],
        solution: 'Circuit breaker limits connections (100), requests per connection (2). Outlier detection ejects instances after 5 consecutive errors, checked every 30s. Prevents cascading failures.',
        explanation: 'Circuit breakers protect services from overload and cascading failures'
      },
      {
        exerciseNumber: 3,
        scenario: 'Enable mutual TLS with authorization policy.',
        template: `apiVersion: security.istio.io/__V1BETA1__
kind: __PEER_AUTHENTICATION__
metadata:
  name: default
  namespace: default
spec:
  mtls:
    mode: __STRICT__
---
apiVersion: security.istio.io/v1beta1
kind: __AUTHORIZATION_POLICY__
metadata:
  name: allow-frontend
spec:
  selector:
    matchLabels:
      app: __BACKEND__
  action: __ALLOW__
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/default/sa/__FRONTEND__"]
    to:
    - operation:
        methods: ["GET", "POST"]`,
        blanks: [
          {
            id: 'V1BETA1',
            label: 'V1BETA1',
            hint: 'API version',
            correctValue: 'v1beta1',
            validationPattern: 'v1beta1'
          },
          {
            id: 'PEER_AUTHENTICATION',
            label: 'PEER_AUTHENTICATION',
            hint: 'Resource kind',
            correctValue: 'PeerAuthentication',
            validationPattern: 'peer.*auth'
          },
          {
            id: 'STRICT',
            label: 'STRICT',
            hint: 'mTLS mode',
            correctValue: 'STRICT',
            validationPattern: 'strict'
          },
          {
            id: 'AUTHORIZATION_POLICY',
            label: 'AUTHORIZATION_POLICY',
            hint: 'Resource kind',
            correctValue: 'AuthorizationPolicy',
            validationPattern: 'authorization.*policy'
          },
          {
            id: 'BACKEND',
            label: 'BACKEND',
            hint: 'Target service',
            correctValue: 'backend',
            validationPattern: 'backend'
          },
          {
            id: 'ALLOW',
            label: 'ALLOW',
            hint: 'Policy action',
            correctValue: 'ALLOW',
            validationPattern: 'allow'
          },
          {
            id: 'FRONTEND',
            label: 'FRONTEND',
            hint: 'Source service account',
            correctValue: 'frontend',
            validationPattern: 'frontend'
          }
        ],
        solution: 'PeerAuthentication enforces STRICT mTLS (all traffic encrypted). AuthorizationPolicy allows only frontend service account to access backend with GET/POST. Implements zero-trust security.',
        explanation: 'mTLS + authorization policies create zero-trust service-to-service security'
      },
      {
        exerciseNumber: 4,
        scenario: 'Configure request timeout and retry policy.',
        template: `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: resilient-service
spec:
  hosts:
  - my-service
  http:
  - timeout: __2S__
    retries:
      attempts: __3__
      perTryTimeout: __500MS__
      retryOn: __5XX__,reset,connect-failure
    route:
    - destination:
        host: my-service`,
        blanks: [
          {
            id: '2S',
            label: '2S',
            hint: 'Total timeout',
            correctValue: '2s',
            validationPattern: '2s'
          },
          {
            id: '3',
            label: '3',
            hint: 'Retry attempts',
            correctValue: '3',
            validationPattern: '3'
          },
          {
            id: '500MS',
            label: '500MS',
            hint: 'Per-attempt timeout',
            correctValue: '500ms',
            validationPattern: '500ms'
          },
          {
            id: '5XX',
            label: '5XX',
            hint: 'Retry condition',
            correctValue: '5xx',
            validationPattern: '5xx'
          }
        ],
        solution: 'Timeout limits total request to 2s. Retries up to 3 times with 500ms per attempt on 5xx errors, resets, connection failures. Handles transient failures without application code changes.',
        explanation: 'Timeout and retry policies improve resilience without code changes'
      },
      {
        exerciseNumber: 5,
        scenario: 'Set up traffic mirroring for shadow testing.',
        template: `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: shadow-test
spec:
  hosts:
  - my-service
  http:
  - route:
    - destination:
        host: my-service
        subset: __STABLE__
      weight: __100__
    mirror:
      host: my-service
      subset: __CANARY__
    mirrorPercentage:
      value: __20.0__`,
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
          },
          {
            id: '20.0',
            label: '20.0',
            hint: 'Mirror percentage',
            correctValue: '20.0',
            validationPattern: '20'
          }
        ],
        solution: 'All production traffic (100%) goes to stable version. 20% is mirrored to canary for shadow testing. Canary responses ignored. Test new version with real traffic without affecting users.',
        explanation: 'Traffic mirroring tests new versions with production traffic safely'
      }
    ],
    hints: [
      'VirtualService controls routing logic, DestinationRule defines subsets and policies',
      'Weights in VirtualService must sum to 100 for proper distribution',
      'mTLS STRICT mode encrypts all service-to-service communication',
      'Circuit breakers prevent cascading failures across microservices',
      'Traffic mirroring sends copies, not live traffic - responses discarded'
    ]
  },

  runGuided: {
    objective: 'Build production microservices platform with Istio service mesh, traffic management, security, and observability',
    conceptualGuidance: [
      'Design microservices with clear boundaries and APIs',
      'Deploy Istio with production profile and resource limits',
      'Implement progressive delivery: canary → blue-green → full rollout',
      'Configure mTLS and authorization policies for zero-trust',
      'Set up resilience: timeouts, retries, circuit breakers',
      'Enable distributed tracing with Jaeger for debugging',
      'Monitor with Kiali, Prometheus, Grafana dashboards',
      'Implement traffic shadowing for testing',
      'Configure ingress and egress gateways securely'
    ],
    keyConceptsToApply: [
      'Microservices decomposition patterns',
      'Service mesh traffic management',
      'Zero-trust security with mTLS',
      'Resilience patterns (timeout, retry, circuit breaker)',
      'Distributed tracing and observability'
    ],
    checkpoints: [
      {
        checkpoint: 'Istio service mesh deployed and configured',
        description: 'Service mesh handling all traffic with observability',
        validationCriteria: [
          'Istio control plane running',
          'Sidecar injection enabled',
          'All pods have Envoy proxy',
          'Prometheus scraping metrics',
          'Jaeger collecting traces',
          'Kiali showing service graph'
        ],
        hintIfStuck: 'Install Istio with demo profile. Label namespace for injection. Deploy sample app. Verify 2 containers per pod. Install addons: Prometheus, Jaeger, Kiali.'
      },
      {
        checkpoint: 'Traffic management with canary deployment',
        description: 'Progressive rollout with traffic splitting',
        validationCriteria: [
          'VirtualService routing by weight',
          'DestinationRule defining subsets',
          'Traffic split: 90% stable, 10% canary',
          'Gateway configured for ingress',
          'Metrics showing traffic distribution',
          'Can gradually increase canary percentage'
        ],
        hintIfStuck: 'Create DestinationRule with v1/v2 subsets. VirtualService weights: 90/10. Monitor metrics. Increase canary weight gradually. Roll back if errors spike.'
      },
      {
        checkpoint: 'Security and resilience configured',
        description: 'mTLS, authorization, and failure handling active',
        validationCriteria: [
          'PeerAuthentication STRICT mode enabled',
          'AuthorizationPolicy enforcing access control',
          'Circuit breakers limiting connections',
          'Timeouts preventing hanging requests',
          'Retries handling transient failures',
          'No plaintext service-to-service traffic'
        ],
        hintIfStuck: 'Enable PeerAuthentication with STRICT mTLS. Create AuthorizationPolicy for service access. Add circuit breaker in DestinationRule. Configure timeout and retry in VirtualService.'
      }
    ],
    resourcesAllowed: [
      'Istio documentation',
      'Microservices patterns (Martin Fowler)',
      'Envoy proxy documentation',
      'Service mesh comparison guide'
    ]
  },

  runIndependent: {
    objective: 'Build production-grade microservices platform with complete service mesh, advanced traffic management, zero-trust security, comprehensive observability, and automated resilience',
    successCriteria: [
      'Microservices architecture: properly decomposed services with clear APIs',
      'Istio service mesh: control plane, sidecars, ingress/egress gateways',
      'Traffic management: canary deployments, A/B testing, traffic mirroring',
      'Security: STRICT mTLS, authorization policies, zero-trust networking',
      'Resilience: circuit breakers, timeouts, retries, bulkheads',
      'Observability: distributed tracing (Jaeger), metrics (Prometheus), visualization (Kiali)',
      'Progressive delivery: automated canary analysis and rollback',
      'Gateway security: rate limiting, authentication, TLS termination',
      'Multi-cluster: federation across clusters or regions',
      'Documentation: architecture diagrams, runbooks, traffic flow'
    ],
    timeTarget: 25,
    minimumRequirements: [
      'Istio deployed with sidecars injected',
      'Traffic splitting working with weighted routing',
      'mTLS enabled with authorization policies'
    ],
    evaluationRubric: [
      {
        criterion: 'Service Mesh Architecture',
        weight: 25,
        passingThreshold: 'Istio control plane stable. Sidecars in all pods. Ingress/egress gateways configured. Namespaces organized. Resource limits set. Addons deployed (Prometheus, Jaeger, Kiali).'
      },
      {
        criterion: 'Traffic Management',
        weight: 30,
        passingThreshold: 'Canary deployments with weighted routing. A/B testing with header-based routing. Traffic mirroring for shadow testing. Gateway routing rules. Gradual rollout automation. Rollback capability.'
      },
      {
        criterion: 'Security & Resilience',
        weight: 25,
        passingThreshold: 'STRICT mTLS enforced. AuthorizationPolicy for access control. Circuit breakers preventing cascade failures. Timeouts and retries configured. Rate limiting active. No security misconfigurations.'
      },
      {
        criterion: 'Observability',
        weight: 20,
        passingThreshold: 'Distributed tracing tracking requests across services. Metrics exported to Prometheus. Kiali showing real-time topology. Grafana dashboards for traffic, errors, latency. Alerts on anomalies. Logs centralized.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=16fgzklcF7Y',
  documentation: [
    'https://istio.io/latest/docs/',
    'https://microservices.io/patterns/',
    'https://www.envoyproxy.io/docs/',
    'https://www.jaegertracing.io/docs/',
    'https://kiali.io/docs/',
    'https://martin.kleppmann.com/2015/12/08/distributed-systems-talk.html'
  ],
  relatedConcepts: [
    'Microservices architecture patterns',
    'Service mesh fundamentals',
    'Istio traffic management',
    'Zero-trust security with mTLS',
    'Distributed tracing',
    'Canary and blue-green deployments'
  ]
};
