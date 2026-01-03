import type { LeveledLessonContent } from '../types/lessonContent';

export const week7Lesson1WhyKubernetes: LeveledLessonContent = {
  lessonId: 'week7-lesson1-why-kubernetes',
  baseLesson: {
    title: 'Why Kubernetes?',
    description: 'Understand the problems Kubernetes solves and when to use container orchestration.',
    learningObjectives: [
      'Identify the challenges of managing containers at scale',
      'Explain how Kubernetes addresses orchestration problems',
      'Understand Kubernetes architecture and components',
      'Recognize when Kubernetes is the right solution'
    ],
    prerequisites: ['Docker fundamentals', 'Basic networking concepts', 'Linux command line'],
    estimatedTimePerLevel: {
      crawl: 120,
      walk: 60,
      runGuided: 90,
      runIndependent: 180
    }
  },
  crawl: {
    introduction: 'Learn why container orchestration is essential for production workloads and how Kubernetes solves the challenges of running containers at scale.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Understand the problem: manual container management',
        command: 'echo "With Docker alone, you must manually:\\n- Start/stop containers on each server\\n- Handle crashes (no auto-restart)\\n- Distribute containers across servers\\n- Load balance traffic between containers\\n- Update containers without downtime"',
        explanation: 'Docker is great for running containers, but managing many containers across multiple servers requires manual work. If a container crashes, Docker won\'t restart it. If a server fails, you must manually move containers. Scaling requires starting containers on different servers by hand. This doesn\'t work for production systems that need reliability and scale.',
        expectedOutput: 'List of manual tasks required without orchestration',
        validationCriteria: [
          'Understand Docker alone requires manual container lifecycle management',
          'Recognize lack of automatic recovery from failures',
          'See difficulty of distributing containers across servers'
        ],
        commonMistakes: [
          'Thinking Docker Compose solves multi-server orchestration (it only works on a single host)',
          'Underestimating complexity of manual production management',
          'Not considering how to handle server failures'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Understand what container orchestration provides',
        command: 'echo "Container orchestration automates:\\n- Deployment: Place containers intelligently across servers\\n- Scaling: Add/remove containers based on load\\n- Self-healing: Restart failed containers automatically\\n- Load balancing: Distribute traffic across container replicas\\n- Rolling updates: Update without downtime\\n- Service discovery: Containers find each other automatically"',
        explanation: 'Container orchestration platforms like Kubernetes, Docker Swarm, and Amazon ECS automate the operational tasks. They continuously monitor the desired state (what you want running) vs actual state (what\'s actually running) and reconcile differences. If you say "run 3 replicas," the orchestrator ensures 3 are always running. If one crashes, it starts a new one. This enables reliable, scalable production systems.',
        expectedOutput: 'List of capabilities provided by orchestration',
        validationCriteria: [
          'Understand orchestration automates operational tasks',
          'Recognize desired state vs actual state reconciliation',
          'See benefits of automated self-healing and scaling'
        ],
        commonMistakes: [
          'Confusing orchestration with containerization (they\'re different layers)',
          'Thinking orchestration is only for large companies (it helps at any scale)',
          'Not understanding the automation is continuous, not one-time'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Understand why Kubernetes won the orchestration war',
        command: 'echo "Kubernetes advantages:\\n- Cloud-native: Designed for modern distributed systems\\n- Declarative: Describe desired state, K8s makes it happen\\n- Extensible: Rich ecosystem of plugins and tools\\n- Portable: Run on AWS, Azure, GCP, on-prem, or laptop\\n- Community: Massive adoption, extensive resources\\n- Features: Advanced networking, storage, security"',
        explanation: 'Kubernetes (K8s) emerged as the standard because it was designed from the start for cloud-native applications (Google\'s internal Borg system). It uses a declarative approach (you describe what you want, not how to achieve it). The ecosystem is massive - Helm for package management, Istio for service mesh, Prometheus for monitoring. Every major cloud provider offers managed Kubernetes. It\'s become the Linux of the cloud era.',
        expectedOutput: 'List of Kubernetes competitive advantages',
        validationCriteria: [
          'Understand declarative configuration approach',
          'Recognize cloud portability benefits',
          'See value of large ecosystem and community'
        ],
        commonMistakes: [
          'Thinking Kubernetes is the only orchestrator (Docker Swarm, ECS, Nomad exist)',
          'Assuming Kubernetes is always the best choice (it has complexity trade-offs)',
          'Not understanding declarative vs imperative approaches'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'Understand Kubernetes cluster architecture',
        command: 'echo "Kubernetes cluster components:\\n\\nControl Plane (brain):\\n- API Server: REST API for all operations\\n- Scheduler: Decides which node runs each pod\\n- Controller Manager: Maintains desired state\\n- etcd: Distributed database storing cluster state\\n\\nWorker Nodes (muscle):\\n- Kubelet: Agent ensuring containers run\\n- Container Runtime: Docker/containerd running containers\\n- Kube-proxy: Network routing for services"',
        explanation: 'A Kubernetes cluster has two parts: control plane and worker nodes. The control plane is the "brain" - it stores desired state (etcd), accepts API requests (API server), decides placement (scheduler), and maintains state (controllers). Worker nodes are the "muscle" - they run your containers (container runtime), ensure pods run (kubelet), and route network traffic (kube-proxy). This separation allows resilience and scale.',
        expectedOutput: 'Cluster architecture diagram with control plane and nodes',
        validationCriteria: [
          'Understand control plane vs worker node separation',
          'Recognize role of each major component',
          'See how components interact to maintain desired state'
        ],
        commonMistakes: [
          'Confusing control plane components with application containers',
          'Not understanding etcd is the source of truth for cluster state',
          'Thinking kubelet and container runtime are the same thing'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'Understand the basic Kubernetes objects: Pods',
        command: 'echo "Pod: Smallest deployable unit in Kubernetes\\n- One or more containers that share:\\n  - Network namespace (localhost communication)\\n  - Storage volumes\\n  - IP address\\n- Usually run 1 container per pod\\n- Ephemeral: Pods can be created/destroyed\\n- Not self-healing: Use higher-level controllers"',
        explanation: 'A Pod is the basic execution unit in Kubernetes - a wrapper around one or more containers. Containers in a pod share an IP address and can communicate via localhost. They share mounted volumes. Pods are ephemeral (temporary) - they can be deleted and recreated. You usually run one container per pod (sidecars are the exception). Pods themselves don\'t restart if they fail - you need a Deployment or other controller for that.',
        expectedOutput: 'Definition and characteristics of Kubernetes Pods',
        validationCriteria: [
          'Understand pods are wrappers for containers',
          'Recognize containers in a pod share network and storage',
          'See that pods are ephemeral, not self-healing'
        ],
        commonMistakes: [
          'Creating pods directly instead of using Deployments',
          'Thinking pods restart themselves (they don\'t - controllers do)',
          'Running too many containers in one pod (usually antipattern)'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'Understand Deployments for managing pods',
        command: 'echo "Deployment: Controller for stateless applications\\n- Desired state: \\"I want 3 replicas of my app\\"\\n- Creates ReplicaSet to maintain pod count\\n- Self-healing: Replaces failed pods automatically\\n- Scaling: Change replica count easily\\n- Rolling updates: Update pods with zero downtime\\n- Rollback: Revert to previous version if issues"',
        explanation: 'Deployments are the standard way to run stateless applications in Kubernetes. You declare desired state ("I want 3 replicas") and the Deployment controller maintains it. If a pod crashes, Deployment creates a new one. Need more capacity? Change replicas to 5. Updates happen gradually (rolling update) - new pods start before old ones stop, ensuring zero downtime. If update fails, rollback to previous version. This is production-ready automation.',
        expectedOutput: 'Definition and capabilities of Deployments',
        validationCriteria: [
          'Understand Deployments manage desired state for pods',
          'Recognize self-healing and scaling capabilities',
          'See how rolling updates enable zero-downtime deployments'
        ],
        commonMistakes: [
          'Creating bare pods instead of using Deployments',
          'Not setting resource requests/limits in production',
          'Expecting instant rollout (rolling updates take time)'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'Understand Services for networking',
        command: 'echo "Service: Stable network endpoint for pods\\n- Pods are ephemeral with changing IPs\\n- Service provides stable DNS name and IP\\n- Load balances traffic across pod replicas\\n- Types:\\n  - ClusterIP: Internal only (default)\\n  - NodePort: Expose on node port (testing)\\n  - LoadBalancer: Cloud load balancer (production)\\n- Selector: Labels to find pods"',
        explanation: 'Services solve the networking problem: pods have dynamic IPs that change when they restart. A Service provides a stable DNS name (my-app.default.svc.cluster.local) and virtual IP that load balances across pods matching a label selector. ClusterIP (default) is internal only. NodePort exposes on every node\'s IP. LoadBalancer provisions a cloud load balancer (AWS ELB, etc). Services enable reliable discovery and load balancing.',
        expectedOutput: 'Service types and networking capabilities',
        validationCriteria: [
          'Understand Services provide stable endpoints for dynamic pods',
          'Recognize different Service types for different use cases',
          'See how label selectors connect Services to Pods'
        ],
        commonMistakes: [
          'Using NodePort in production (use LoadBalancer or Ingress)',
          'Not understanding Services don\'t create pods (Deployments do)',
          'Forgetting Service selectors must match pod labels'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'Understand ConfigMaps and Secrets for configuration',
        command: 'echo "ConfigMaps: Non-sensitive configuration\\n- Key-value pairs or files\\n- Inject as env vars or volume mounts\\n- Example: API URLs, feature flags\\n\\nSecrets: Sensitive data\\n- Base64 encoded (not encrypted by default!)\\n- Inject as env vars or volume mounts\\n- Example: passwords, API keys\\n- Use external secrets management in production"',
        explanation: 'ConfigMaps and Secrets externalize configuration from container images. ConfigMaps store non-sensitive data (API URLs, settings). Secrets store sensitive data (passwords, keys) - but they\'re only base64 encoded, not encrypted by default (enable encryption at rest in production). Both can be injected as environment variables or mounted as files. This follows 12-factor app principles: configuration separate from code.',
        expectedOutput: 'ConfigMap and Secret usage patterns',
        validationCriteria: [
          'Understand separation of configuration from images',
          'Recognize difference between ConfigMaps and Secrets',
          'See injection methods (env vars vs volume mounts)'
        ],
        commonMistakes: [
          'Hardcoding configuration in Docker images',
          'Thinking Secrets are encrypted by default (they\'re only base64)',
          'Committing Secrets to Git (use sealed-secrets or external providers)'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'Understand Kubernetes namespaces for isolation',
        command: 'echo "Namespaces: Virtual clusters within one physical cluster\\n- Isolate resources between teams/projects\\n- Default namespaces:\\n  - default: Your resources go here\\n  - kube-system: Kubernetes system components\\n  - kube-public: Publicly accessible resources\\n- Use cases:\\n  - Multi-tenancy (dev, staging, prod)\\n  - Team isolation (team-a, team-b)\\n  - Environment separation"',
        explanation: 'Namespaces provide virtual clusters within one physical cluster. Resources in different namespaces are isolated (Services in namespace A can\'t directly access Services in namespace B without explicit networking). Most resources are namespaced (Deployments, Services, ConfigMaps), but some are cluster-wide (Nodes, PersistentVolumes). Common pattern: create namespaces for dev, staging, prod or for different teams.',
        expectedOutput: 'Namespace concepts and use cases',
        validationCriteria: [
          'Understand namespaces provide isolation within cluster',
          'Recognize default namespaces and their purposes',
          'See practical use cases for multi-tenancy'
        ],
        commonMistakes: [
          'Not using namespaces for multi-environment setups',
          'Thinking namespaces provide security isolation (they\'re organizational, not security boundary)',
          'Forgetting to specify namespace in kubectl commands'
        ]
      },
      {
        stepNumber: 10,
        instruction: 'Understand when to use Kubernetes vs alternatives',
        command: 'echo "Use Kubernetes when:\\n- Multiple microservices requiring orchestration\\n- Need multi-cloud or cloud portability\\n- Require advanced features (autoscaling, service mesh)\\n- Have operational expertise or managed service\\n\\nAlternatives when:\\n- Simple app: Use PaaS (Heroku, Cloud Run)\\n- AWS-only: Consider ECS (simpler)\\n- Serverless fit: Use Lambda/Cloud Functions\\n- Small scale: Docker Compose may suffice"',
        explanation: 'Kubernetes is powerful but complex. Use it when you have multiple services that need orchestration, care about portability across clouds, or need advanced features (HorizontalPodAutoscaler, Istio service mesh, advanced networking). For simple applications, use a Platform-as-a-Service like Heroku or Google Cloud Run. If you\'re AWS-only, ECS is simpler. For event-driven workloads, serverless (Lambda) may fit. For learning or small projects, Docker Compose may be enough. Choose the right tool for your needs.',
        expectedOutput: 'Decision criteria for Kubernetes vs alternatives',
        validationCriteria: [
          'Understand Kubernetes trade-offs (power vs complexity)',
          'Recognize scenarios where simpler alternatives fit',
          'See importance of operational expertise'
        ],
        commonMistakes: [
          'Using Kubernetes because it\'s popular (not because it fits need)',
          'Underestimating operational complexity of running K8s',
          'Not considering managed services (EKS, GKE, AKS) vs self-managed'
        ]
      },
      {
        stepNumber: 11,
        instruction: 'Understand Kubernetes managed services',
        command: 'echo "Managed Kubernetes services:\\n- AWS EKS (Elastic Kubernetes Service)\\n- Google GKE (Google Kubernetes Engine)\\n- Azure AKS (Azure Kubernetes Service)\\n\\nBenefits:\\n- Control plane managed (no etcd maintenance)\\n- Automatic upgrades available\\n- Integrated with cloud services\\n- Reduced operational burden\\n\\nYou still manage:\\n- Worker nodes (or use Fargate/Autopilot)\\n- Application deployments\\n- Monitoring and logging\\n- Security policies"',
        explanation: 'Managed Kubernetes services (EKS, GKE, AKS) run the control plane for you - you don\'t manage etcd, API server, scheduler, etc. The cloud provider handles upgrades, backups, high availability. You still manage worker nodes (though Fargate/Autopilot can manage those too). You deploy applications, configure monitoring, set security policies. This reduces operational burden significantly vs self-managed clusters. Recommended for production unless you have strong K8s expertise.',
        expectedOutput: 'Comparison of managed vs self-managed Kubernetes',
        validationCriteria: [
          'Understand what managed services handle vs what you manage',
          'Recognize benefits of reduced operational complexity',
          'See integration with cloud provider services'
        ],
        commonMistakes: [
          'Thinking managed K8s is "hands-off" (you still operate worker nodes and apps)',
          'Not understanding cost implications (control plane + nodes)',
          'Choosing self-managed without operational expertise'
        ]
      },
      {
        stepNumber: 12,
        instruction: 'Understand local Kubernetes for development',
        command: 'echo "Local Kubernetes options:\\n- Minikube: Full K8s cluster in VM (most features)\\n- kind: K8s in Docker (fast, CI/CD friendly)\\n- Docker Desktop: Built-in K8s (convenient)\\n- k3s: Lightweight K8s (edge/IoT, also good for local)\\n\\nDevelopment workflow:\\n1. Develop app with Docker Compose (fast iteration)\\n2. Test on local Kubernetes (validate K8s manifests)\\n3. Deploy to cloud K8s (staging/production)\\n\\nBenefits:\\n- Test before deploying to cloud\\n- Learn Kubernetes without cloud costs\\n- Catch configuration issues early"',
        explanation: 'You don\'t need a cloud cluster to learn Kubernetes. Minikube runs a full cluster in a VM on your laptop. kind (Kubernetes in Docker) runs cluster nodes as Docker containers - very fast for CI/CD. Docker Desktop has built-in Kubernetes. k3s is a lightweight distribution. Typical workflow: use Docker Compose for rapid development iteration, then test on local Kubernetes to validate manifests, then deploy to cloud. This catches issues early and enables learning without cloud costs.',
        expectedOutput: 'Local Kubernetes options and development workflow',
        validationCriteria: [
          'Understand options for running Kubernetes locally',
          'Recognize development workflow progression',
          'See benefits of local testing before cloud deployment'
        ],
        commonMistakes: [
          'Developing directly on cloud clusters (slow, expensive)',
          'Not testing K8s manifests locally before deploying',
          'Expecting local clusters to exactly match cloud (close, but not identical)'
        ]
      }
    ],
    expectedOutcome: 'Understand the problems Kubernetes solves, its architecture, core concepts (Pods, Deployments, Services), and when to use it vs alternatives.'
  },
  walk: {
    introduction: 'Apply your Kubernetes knowledge to scenario-based exercises that test your understanding of orchestration concepts.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Your company runs 10 microservices on Docker. Each service runs on 3 servers for redundancy. Developers manually SSH to servers to deploy updates. Last week, a server crashed and 3 services went down until someone noticed. Explain how Kubernetes would solve these problems.',
        template: `Problems with current approach:
1. Manual deployment: ___________
2. No automatic recovery: ___________
3. Manual load balancing: ___________
4. No zero-downtime updates: ___________

Kubernetes solutions:
1. Deployments: ___________
2. Self-healing: ___________
3. Services: ___________
4. Rolling updates: ___________`,
        blanks: [
          {
            id: 'manual_deployment_problem',
            label: 'Problem with manual deployment',
            hint: 'What issues arise from SSHing to servers?',
            correctValue: 'Slow, error-prone, inconsistent deployments across servers, no audit trail, requires access to production servers',
            validationPattern: 'slow|error|inconsistent|manual|ssh|access'
          },
          {
            id: 'no_recovery_problem',
            label: 'Problem with no automatic recovery',
            hint: 'What happens when services crash?',
            correctValue: 'Services stay down until someone notices and manually restarts them, leading to extended outages and manual intervention',
            validationPattern: 'down|manual|notice|restart|outage|intervention'
          },
          {
            id: 'manual_lb_problem',
            label: 'Problem with manual load balancing',
            hint: 'How is traffic distributed without orchestration?',
            correctValue: 'Must manually configure load balancers when adding/removing servers, static configuration, can\'t adapt to failures',
            validationPattern: 'manual|configure|static|adapt|fail'
          },
          {
            id: 'no_zdt_problem',
            label: 'Problem with no zero-downtime updates',
            hint: 'What happens during deployments?',
            correctValue: 'Must stop old version before starting new, causing downtime, or coordinate complex blue-green deployment manually',
            validationPattern: 'stop|downtime|manual|blue-green|coordinate'
          },
          {
            id: 'deployment_solution',
            label: 'How Deployments solve this',
            hint: 'What does a Deployment provide?',
            correctValue: 'Declarative desired state (replicas: 3), automatic scheduling across nodes, consistent deployment process via kubectl or CI/CD',
            validationPattern: 'declarative|desired.*state|replicas|schedule|kubectl|ci.*cd'
          },
          {
            id: 'selfhealing_solution',
            label: 'How self-healing solves this',
            hint: 'What happens when pods fail in K8s?',
            correctValue: 'Deployment controller automatically restarts failed pods, maintains desired replica count, recovers from node failures without manual intervention',
            validationPattern: 'automatic|restart|replica|controller|maintain|recover'
          },
          {
            id: 'service_solution',
            label: 'How Services solve load balancing',
            hint: 'What networking does a Service provide?',
            correctValue: 'Stable DNS name and IP, automatic load balancing across healthy pods, dynamic endpoint updates as pods come and go',
            validationPattern: 'dns|stable|load.*balanc|endpoint|dynamic|healthy'
          },
          {
            id: 'rolling_solution',
            label: 'How rolling updates solve downtime',
            hint: 'How do rolling updates work?',
            correctValue: 'Start new pods before stopping old ones, gradually shift traffic, ensure minimum available pods throughout update, zero downtime',
            validationPattern: 'gradual|before.*stop|traffic|minimum.*available|zero.*downtime'
          }
        ],
        solution: `Problems with current approach:
1. Manual deployment: Slow, error-prone, inconsistent deployments across servers, no audit trail, requires access to production servers
2. No automatic recovery: Services stay down until someone notices and manually restarts them, leading to extended outages and manual intervention
3. Manual load balancing: Must manually configure load balancers when adding/removing servers, static configuration, can't adapt to failures
4. No zero-downtime updates: Must stop old version before starting new, causing downtime, or coordinate complex blue-green deployment manually

Kubernetes solutions:
1. Deployments: Declarative desired state (replicas: 3), automatic scheduling across nodes, consistent deployment process via kubectl or CI/CD
2. Self-healing: Deployment controller automatically restarts failed pods, maintains desired replica count, recovers from node failures without manual intervention
3. Services: Stable DNS name and IP, automatic load balancing across healthy pods, dynamic endpoint updates as pods come and go
4. Rolling updates: Start new pods before stopping old ones, gradually shift traffic, ensure minimum available pods throughout update, zero downtime`,
        explanation: 'Kubernetes transforms operational burden into declarative configuration. Instead of manually managing servers and services, you declare desired state and K8s maintains it automatically. Self-healing, load balancing, and zero-downtime deployments are built-in.'
      },
      {
        exerciseNumber: 2,
        scenario: 'Compare Kubernetes architecture to traditional application deployment. Fill in the components and their purposes.',
        template: `Traditional Deployment:
Component: Load Balancer → Purpose: ___________
Component: App Servers (3) → Purpose: ___________
Component: Manual monitoring → Purpose: ___________
Component: Manual scaling → Purpose: ___________

Kubernetes Deployment:
Control Plane - API Server → Purpose: ___________
Control Plane - Scheduler → Purpose: ___________
Control Plane - Controller Manager → Purpose: ___________
Worker Nodes - Kubelet → Purpose: ___________
K8s Object - Service → Purpose: ___________
K8s Object - Deployment → Purpose: ___________`,
        blanks: [
          {
            id: 'traditional_lb',
            label: 'Traditional load balancer purpose',
            hint: 'What does the LB do?',
            correctValue: 'Distribute traffic across app servers, manually configured with server IPs',
            validationPattern: 'distribut.*traffic|load.*balanc|server.*ip|manual'
          },
          {
            id: 'traditional_servers',
            label: 'Traditional app servers purpose',
            hint: 'What do app servers do?',
            correctValue: 'Run application processes, manually started/stopped, no automatic recovery',
            validationPattern: 'run.*app|process|manual|no.*automatic'
          },
          {
            id: 'traditional_monitoring',
            label: 'Traditional monitoring purpose',
            hint: 'How is health checked traditionally?',
            correctValue: 'Human checks logs/metrics to detect issues, manual intervention to restart services',
            validationPattern: 'human|check|manual|log|metric|restart'
          },
          {
            id: 'traditional_scaling',
            label: 'Traditional scaling purpose',
            hint: 'How is scaling done traditionally?',
            correctValue: 'Human decides to add servers, manual provisioning and configuration',
            validationPattern: 'human|manual|provision|add.*server|decide'
          },
          {
            id: 'k8s_apiserver',
            label: 'K8s API Server purpose',
            hint: 'What is the API server\'s role?',
            correctValue: 'REST API for all cluster operations, authentication, authorization, admission control, stores in etcd',
            validationPattern: 'rest.*api|operation|auth|etcd|store'
          },
          {
            id: 'k8s_scheduler',
            label: 'K8s Scheduler purpose',
            hint: 'What does the scheduler decide?',
            correctValue: 'Decides which node to run each pod on based on resources, constraints, affinity rules',
            validationPattern: 'decide|node|pod|resource|placement|schedule'
          },
          {
            id: 'k8s_controller',
            label: 'K8s Controller Manager purpose',
            hint: 'What do controllers do?',
            correctValue: 'Maintains desired state by creating/updating/deleting resources, handles Deployments, ReplicaSets, Services',
            validationPattern: 'desired.*state|maintain|create|update|reconcile|deployment|replicaset'
          },
          {
            id: 'k8s_kubelet',
            label: 'Kubelet purpose',
            hint: 'What does kubelet do on each node?',
            correctValue: 'Agent ensuring containers described in pods are running and healthy on the node',
            validationPattern: 'agent|container|pod|running|healthy|ensure'
          },
          {
            id: 'k8s_service',
            label: 'K8s Service purpose',
            hint: 'Why do we need Services?',
            correctValue: 'Stable network endpoint and load balancing for dynamic pods, DNS name and virtual IP',
            validationPattern: 'stable|endpoint|load.*balanc|dns|pod|ip'
          },
          {
            id: 'k8s_deployment',
            label: 'K8s Deployment purpose',
            hint: 'What does a Deployment manage?',
            correctValue: 'Declarative desired state for pods, manages replicas, rolling updates, self-healing',
            validationPattern: 'desired.*state|replicas|pod|rolling.*update|self.*heal'
          }
        ],
        solution: `Traditional Deployment:
Component: Load Balancer → Purpose: Distribute traffic across app servers, manually configured with server IPs
Component: App Servers (3) → Purpose: Run application processes, manually started/stopped, no automatic recovery
Component: Manual monitoring → Purpose: Human checks logs/metrics to detect issues, manual intervention to restart services
Component: Manual scaling → Purpose: Human decides to add servers, manual provisioning and configuration

Kubernetes Deployment:
Control Plane - API Server → Purpose: REST API for all cluster operations, authentication, authorization, admission control, stores in etcd
Control Plane - Scheduler → Purpose: Decides which node to run each pod on based on resources, constraints, affinity rules
Control Plane - Controller Manager → Purpose: Maintains desired state by creating/updating/deleting resources, handles Deployments, ReplicaSets, Services
Worker Nodes - Kubelet → Purpose: Agent ensuring containers described in pods are running and healthy on the node
K8s Object - Service → Purpose: Stable network endpoint and load balancing for dynamic pods, DNS name and virtual IP
K8s Object - Deployment → Purpose: Declarative desired state for pods, manages replicas, rolling updates, self-healing`,
        explanation: 'Kubernetes automates what was manual in traditional deployments. The control plane components provide intelligence (scheduling, state management), while worker node components execute (running containers). K8s objects (Service, Deployment) provide abstractions for networking and lifecycle management.'
      },
      {
        exerciseNumber: 3,
        scenario: 'You need to decide whether to use Kubernetes for different scenarios. For each, recommend Kubernetes or an alternative, with justification.',
        template: `Scenario A: E-commerce site with 5 microservices (frontend, API, cart, orders, inventory). Expected 1M daily users. Multi-cloud strategy.
Recommendation: ___________
Justification: ___________

Scenario B: Simple CRUD app with React frontend and Node.js API. Small startup, 1000 daily users.
Recommendation: ___________
Justification: ___________

Scenario C: Data processing pipeline - ingest data every hour, process with Python, store in database. Event-driven, bursty workload.
Recommendation: ___________
Justification: ___________

Scenario D: Enterprise with 20+ teams, each deploying multiple services. Need isolation, self-service, multi-environment support.
Recommendation: ___________
Justification: ___________`,
        blanks: [
          {
            id: 'scenario_a_recommendation',
            label: 'Scenario A recommendation',
            hint: 'Multiple services, high scale, multi-cloud',
            correctValue: 'Use Kubernetes (managed EKS, GKE, or AKS)',
            validationPattern: 'kubernetes|k8s|eks|gke|aks'
          },
          {
            id: 'scenario_a_justification',
            label: 'Scenario A justification',
            hint: 'Why K8s fits this scenario',
            correctValue: 'Multiple microservices need orchestration, high scale requires autoscaling, multi-cloud strategy needs portability, managed K8s reduces operational burden',
            validationPattern: 'microservice|orchestration|scale|autoscal|multi.*cloud|portab|managed'
          },
          {
            id: 'scenario_b_recommendation',
            label: 'Scenario B recommendation',
            hint: 'Simple app, small scale, startup',
            correctValue: 'Use PaaS like Heroku, Render, Google Cloud Run, or AWS App Runner',
            validationPattern: 'paas|heroku|render|cloud.*run|app.*runner|simple'
          },
          {
            id: 'scenario_b_justification',
            label: 'Scenario B justification',
            hint: 'Why not K8s for this?',
            correctValue: 'Simple architecture doesn\'t need orchestration complexity, PaaS provides easier deployment and management, lower operational burden for small team, adequate scale for 1000 users',
            validationPattern: 'simple|don.*t.*need|paas|easier|low.*operational|small.*team|adequate|overkill'
          },
          {
            id: 'scenario_c_recommendation',
            label: 'Scenario C recommendation',
            hint: 'Event-driven, bursty, batch processing',
            correctValue: 'Use serverless (AWS Lambda, Cloud Functions) or managed batch (AWS Batch, Cloud Run Jobs)',
            validationPattern: 'serverless|lambda|function|batch|cloud.*run.*job'
          },
          {
            id: 'scenario_c_justification',
            label: 'Scenario C justification',
            hint: 'Why serverless for this pattern?',
            correctValue: 'Event-driven workload fits serverless model, bursty pattern benefits from automatic scale-to-zero, pay only for processing time, no infrastructure to manage',
            validationPattern: 'event.*driven|serverless|burst|scale.*zero|pay.*for|no.*infrastructure'
          },
          {
            id: 'scenario_d_recommendation',
            label: 'Scenario D recommendation',
            hint: 'Enterprise, multi-team, isolation needed',
            correctValue: 'Use Kubernetes with namespaces for isolation, managed service (EKS/GKE/AKS)',
            validationPattern: 'kubernetes|k8s|namespace|managed|eks|gke|aks'
          },
          {
            id: 'scenario_d_justification',
            label: 'Scenario D justification',
            hint: 'Why K8s for enterprise multi-team?',
            correctValue: 'Namespaces provide team isolation, RBAC enables self-service with governance, supports multi-environment, standardized platform across teams, managed service reduces operational burden',
            validationPattern: 'namespace|isolation|rbac|self.*service|multi.*environment|standard|managed'
          }
        ],
        solution: `Scenario A: E-commerce site with 5 microservices (frontend, API, cart, orders, inventory). Expected 1M daily users. Multi-cloud strategy.
Recommendation: Use Kubernetes (managed EKS, GKE, or AKS)
Justification: Multiple microservices need orchestration, high scale requires autoscaling, multi-cloud strategy needs portability, managed K8s reduces operational burden

Scenario B: Simple CRUD app with React frontend and Node.js API. Small startup, 1000 daily users.
Recommendation: Use PaaS like Heroku, Render, Google Cloud Run, or AWS App Runner
Justification: Simple architecture doesn't need orchestration complexity, PaaS provides easier deployment and management, lower operational burden for small team, adequate scale for 1000 users

Scenario C: Data processing pipeline - ingest data every hour, process with Python, store in database. Event-driven, bursty workload.
Recommendation: Use serverless (AWS Lambda, Cloud Functions) or managed batch (AWS Batch, Cloud Run Jobs)
Justification: Event-driven workload fits serverless model, bursty pattern benefits from automatic scale-to-zero, pay only for processing time, no infrastructure to manage

Scenario D: Enterprise with 20+ teams, each deploying multiple services. Need isolation, self-service, multi-environment support.
Recommendation: Use Kubernetes with namespaces for isolation, managed service (EKS/GKE/AKS)
Justification: Namespaces provide team isolation, RBAC enables self-service with governance, supports multi-environment, standardized platform across teams, managed service reduces operational burden`,
        explanation: 'Kubernetes is powerful but not always the right choice. For microservices at scale with multi-cloud needs, K8s excels. For simple apps, PaaS is easier. For event-driven workloads, serverless fits better. For enterprises with many teams, K8s provides standardization and isolation. Choose based on complexity, scale, and operational capacity.'
      },
      {
        exerciseNumber: 4,
        scenario: 'Design a Kubernetes deployment strategy for a web application. Fill in the architecture choices.',
        template: `Application: 3-tier web app (frontend, API, database)

Frontend (React SPA):
- K8s Object: ___________ (manages pods)
- Replicas: ___________
- Exposure: ___________ (how external users access it)

API (Node.js):
- K8s Object: ___________ (manages pods)
- Replicas: ___________
- Exposure: ___________ (how frontend reaches it)
- Configuration: ___________ (env vars like DB_HOST)

Database (PostgreSQL):
- K8s Object: ___________ (stateful workload)
- Storage: ___________ (persistent data)
- Exposure: ___________ (internal only)

High Availability:
- Node failure handling: ___________
- Zero-downtime updates: ___________
- Auto-scaling: ___________`,
        blanks: [
          {
            id: 'frontend_object',
            label: 'Frontend K8s object',
            hint: 'What manages stateless web frontends?',
            correctValue: 'Deployment',
            validationPattern: 'deployment'
          },
          {
            id: 'frontend_replicas',
            label: 'Frontend replicas',
            hint: 'How many for redundancy?',
            correctValue: '3 (or 2+ for high availability)',
            validationPattern: '3|2\\+|multiple|high.*availab'
          },
          {
            id: 'frontend_exposure',
            label: 'Frontend exposure method',
            hint: 'How do external users reach the frontend?',
            correctValue: 'LoadBalancer Service or Ingress controller (preferred for path routing)',
            validationPattern: 'loadbalancer|ingress|service.*type.*loadbalancer'
          },
          {
            id: 'api_object',
            label: 'API K8s object',
            hint: 'What manages stateless APIs?',
            correctValue: 'Deployment',
            validationPattern: 'deployment'
          },
          {
            id: 'api_replicas',
            label: 'API replicas',
            hint: 'How many for redundancy and load?',
            correctValue: '3+ (scale based on load, HorizontalPodAutoscaler)',
            validationPattern: '3|multiple|autoscal|scale|hpa'
          },
          {
            id: 'api_exposure',
            label: 'API exposure method',
            hint: 'Internal service for frontend to reach API',
            correctValue: 'ClusterIP Service (internal only, frontend calls service DNS name)',
            validationPattern: 'clusterip|service.*internal|dns'
          },
          {
            id: 'api_config',
            label: 'API configuration method',
            hint: 'How to inject env vars in K8s?',
            correctValue: 'ConfigMap for non-sensitive (DB_HOST), Secret for sensitive (DB_PASSWORD)',
            validationPattern: 'configmap|secret|env.*var'
          },
          {
            id: 'db_object',
            label: 'Database K8s object',
            hint: 'Databases are stateful, need ordered deployment',
            correctValue: 'StatefulSet (for stateful workloads with persistent identity)',
            validationPattern: 'statefulset'
          },
          {
            id: 'db_storage',
            label: 'Database storage',
            hint: 'How to persist data beyond pod lifecycle?',
            correctValue: 'PersistentVolumeClaim (PVC) backed by cloud storage (EBS, Persistent Disk)',
            validationPattern: 'persistentvolume|pvc|pv|ebs|persistent.*disk'
          },
          {
            id: 'db_exposure',
            label: 'Database exposure',
            hint: 'Should database be externally accessible?',
            correctValue: 'ClusterIP Service (internal only, only API can reach it)',
            validationPattern: 'clusterip|internal.*only|service.*internal'
          },
          {
            id: 'node_failure',
            label: 'Node failure handling',
            hint: 'What happens when a node dies?',
            correctValue: 'Kubernetes reschedules pods from failed node to healthy nodes automatically',
            validationPattern: 'reschedule|move|healthy.*node|automatic|pod.*recreate'
          },
          {
            id: 'zero_downtime',
            label: 'Zero-downtime update strategy',
            hint: 'How to update without downtime?',
            correctValue: 'Rolling update strategy (start new pods before stopping old, readiness probes ensure traffic only to ready pods)',
            validationPattern: 'rolling.*update|readiness|probe|gradual|before.*stop'
          },
          {
            id: 'autoscaling',
            label: 'Auto-scaling approach',
            hint: 'How to scale based on load?',
            correctValue: 'HorizontalPodAutoscaler (HPA) based on CPU/memory or custom metrics',
            validationPattern: 'horizontalpodautoscaler|hpa|autoscal|cpu|memory|metric'
          }
        ],
        solution: `Application: 3-tier web app (frontend, API, database)

Frontend (React SPA):
- K8s Object: Deployment (manages pods)
- Replicas: 3 (or 2+ for high availability)
- Exposure: LoadBalancer Service or Ingress controller (preferred for path routing)

API (Node.js):
- K8s Object: Deployment (manages pods)
- Replicas: 3+ (scale based on load, HorizontalPodAutoscaler)
- Exposure: ClusterIP Service (internal only, frontend calls service DNS name)
- Configuration: ConfigMap for non-sensitive (DB_HOST), Secret for sensitive (DB_PASSWORD)

Database (PostgreSQL):
- K8s Object: StatefulSet (for stateful workloads with persistent identity)
- Storage: PersistentVolumeClaim (PVC) backed by cloud storage (EBS, Persistent Disk)
- Exposure: ClusterIP Service (internal only, only API can reach it)

High Availability:
- Node failure handling: Kubernetes reschedules pods from failed node to healthy nodes automatically
- Zero-downtime updates: Rolling update strategy (start new pods before stopping old, readiness probes ensure traffic only to ready pods)
- Auto-scaling: HorizontalPodAutoscaler (HPA) based on CPU/memory or custom metrics`,
        explanation: 'This architecture uses appropriate K8s objects for each tier: Deployments for stateless (frontend/API), StatefulSet for stateful (database). Services provide networking (LoadBalancer/Ingress for external, ClusterIP for internal). ConfigMaps/Secrets externalize configuration. High availability comes from replicas, automatic rescheduling, rolling updates, and auto-scaling.'
      },
      {
        exerciseNumber: 5,
        scenario: 'Explain the journey of a request through a Kubernetes cluster, from external user to application pod and back.',
        template: `User makes request to: ___________

Step 1 - Cloud Load Balancer:
- Receives request from user
- Forwards to: ___________

Step 2 - LoadBalancer Service:
- Kubernetes object providing: ___________
- Uses selector to find: ___________
- Forwards to one of: ___________

Step 3 - Pod (selected by Service):
- Container receives request
- Application processes request
- If needs database, calls: ___________

Step 4 - Database Service:
- Type: ___________ (not externally accessible)
- Forwards to: ___________

Step 5 - Response Path:
- Pod sends response through: ___________
- User receives: ___________

Fault Tolerance:
- If pod crashes: ___________
- If node fails: ___________`,
        blanks: [
          {
            id: 'user_request_target',
            label: 'What does user request?',
            hint: 'External DNS name',
            correctValue: 'DNS name (myapp.example.com) pointing to cloud load balancer IP',
            validationPattern: 'dns|domain|load.*balancer.*ip|example\\.com'
          },
          {
            id: 'cloud_lb_forwards',
            label: 'Cloud LB forwards to',
            hint: 'Where does AWS ELB/GCP LB send traffic?',
            correctValue: 'Kubernetes LoadBalancer Service (on NodePort of worker nodes)',
            validationPattern: 'service|loadbalancer|nodeport|worker.*node'
          },
          {
            id: 'service_provides',
            label: 'LoadBalancer Service provides',
            hint: 'What networking does Service offer?',
            correctValue: 'Stable endpoint, load balancing across pod replicas, health checking',
            validationPattern: 'stable|endpoint|load.*balanc|health|replica'
          },
          {
            id: 'service_finds',
            label: 'Service uses selector to find',
            hint: 'How does Service know which pods?',
            correctValue: 'Pods with matching labels (e.g., app=frontend)',
            validationPattern: 'pod|label|app.*=.*frontend|match'
          },
          {
            id: 'service_forwards',
            label: 'Service forwards to',
            hint: 'What receives the request?',
            correctValue: 'Healthy pod IP (one of the replicas)',
            validationPattern: 'pod.*ip|replica|healthy.*pod'
          },
          {
            id: 'db_service_call',
            label: 'Application calls for database',
            hint: 'How does pod reach database?',
            correctValue: 'Database Service DNS name (e.g., postgres.default.svc.cluster.local)',
            validationPattern: 'service.*dns|postgres|cluster[.]local|dns.*name'
          },
          {
            id: 'db_service_type',
            label: 'Database Service type',
            hint: 'Internal or external?',
            correctValue: 'ClusterIP (internal only, not exposed outside cluster)',
            validationPattern: 'clusterip|internal'
          },
          {
            id: 'db_service_forwards',
            label: 'Database Service forwards to',
            hint: 'What runs the database?',
            correctValue: 'Database pod (managed by StatefulSet)',
            validationPattern: 'database.*pod|postgres.*pod|statefulset'
          },
          {
            id: 'response_path',
            label: 'Response goes through',
            hint: 'How does response get back?',
            correctValue: 'Same path in reverse: pod → Service → cloud LB → user',
            validationPattern: 'reverse|same.*path|service|load.*balancer|back'
          },
          {
            id: 'user_receives',
            label: 'User receives',
            hint: 'End result',
            correctValue: 'HTTP response with data from application',
            validationPattern: 'http|response|data|result'
          },
          {
            id: 'pod_crash_handling',
            label: 'If pod crashes',
            hint: 'What does Deployment do?',
            correctValue: 'Deployment controller creates new pod to replace it, Service routes around crashed pod',
            validationPattern: 'deployment|create.*new|replace|service.*route|automatic'
          },
          {
            id: 'node_fail_handling',
            label: 'If node fails',
            hint: 'What does Kubernetes do?',
            correctValue: 'Scheduler reschedules pods from failed node to healthy nodes, Service updates endpoints',
            validationPattern: 'reschedule|healthy.*node|scheduler|move|endpoint.*update'
          }
        ],
        solution: `User makes request to: DNS name (myapp.example.com) pointing to cloud load balancer IP

Step 1 - Cloud Load Balancer:
- Receives request from user
- Forwards to: Kubernetes LoadBalancer Service (on NodePort of worker nodes)

Step 2 - LoadBalancer Service:
- Kubernetes object providing: Stable endpoint, load balancing across pod replicas, health checking
- Uses selector to find: Pods with matching labels (e.g., app=frontend)
- Forwards to one of: Healthy pod IP (one of the replicas)

Step 3 - Pod (selected by Service):
- Container receives request
- Application processes request
- If needs database, calls: Database Service DNS name (e.g., postgres.default.svc.cluster.local)

Step 4 - Database Service:
- Type: ClusterIP (internal only, not exposed outside cluster)
- Forwards to: Database pod (managed by StatefulSet)

Step 5 - Response Path:
- Pod sends response through: Same path in reverse: pod → Service → cloud LB → user
- User receives: HTTP response with data from application

Fault Tolerance:
- If pod crashes: Deployment controller creates new pod to replace it, Service routes around crashed pod
- If node fails: Scheduler reschedules pods from failed node to healthy nodes, Service updates endpoints`,
        explanation: 'Requests flow through layers: DNS → cloud LB → LoadBalancer Service → pod. Services provide stable endpoints despite dynamic pods. Internal services (ClusterIP) enable pod-to-pod communication. Kubernetes continuously monitors desired vs actual state, automatically recovering from pod crashes and node failures.'
      }
    ],
    hints: [
      'Kubernetes provides automation - think about what was manual before',
      'Services solve the networking problem of dynamic pod IPs',
      'Deployments manage desired state - the controller ensures reality matches',
      'Choose tools based on your needs, not popularity - K8s isn\'t always the answer',
      'Managed Kubernetes services reduce operational burden significantly'
    ]
  },
  runGuided: {
    objective: 'Analyze a real application and design a Kubernetes migration strategy with architecture, justification, and risk assessment.',
    conceptualGuidance: [
      'Current State Analysis: Document existing architecture, deployment process, scaling strategy, and pain points',
      'Kubernetes Justification: Explain why K8s solves current problems vs alternatives (PaaS, serverless, other orchestrators)',
      'Architecture Design: Map application components to K8s objects (Deployments, Services, ConfigMaps, Ingress)',
      'Migration Strategy: Incremental approach (parallel run, gradual traffic shift, rollback plan)',
      'Operational Considerations: Monitoring, logging, CI/CD integration, team training'
    ],
    keyConceptsToApply: [
      'Deployments for stateless services with replicas and rolling updates',
      'StatefulSets for stateful services (databases, queues)',
      'Services for networking (LoadBalancer for external, ClusterIP for internal)',
      'ConfigMaps and Secrets for configuration externalization',
      'Namespaces for environment isolation (dev, staging, prod)',
      'HorizontalPodAutoscaler for auto-scaling based on load',
      'Ingress for external access with path-based routing',
      'Managed Kubernetes (EKS/GKE/AKS) to reduce operational burden'
    ],
    checkpoints: [
      {
        checkpoint: 'Current state documented and problems identified',
        description: 'Analyze existing application: architecture diagram, deployment process, scaling limitations, pain points (manual work, downtime, inconsistency). Clearly articulate problems K8s would solve.',
        validationCriteria: [
          'Architecture diagram showing current components and their relationships',
          'Deployment process documented with time estimates and manual steps',
          'Pain points identified with impact assessment (downtime, manual effort, errors)',
          'Metrics baseline (deployment frequency, MTTR, manual intervention needed)'
        ],
        hintIfStuck: 'Focus on operational pain: How long do deployments take? How often do things break? What requires manual intervention? What can\'t you do today that you wish you could?'
      },
      {
        checkpoint: 'Kubernetes architecture designed and justified',
        description: 'Design K8s architecture: map each component to K8s objects, define Services for networking, plan ConfigMaps/Secrets. Justify why K8s vs alternatives. Consider managed K8s vs self-managed.',
        validationCriteria: [
          'Architecture diagram with K8s objects (Deployments, Services, Ingress, ConfigMaps)',
          'Namespace strategy for environments (dev, staging, prod)',
          'Service types chosen appropriately (ClusterIP for internal, LoadBalancer/Ingress for external)',
          'Justification comparing K8s to alternatives (PaaS, ECS, serverless) with decision criteria',
          'Managed K8s service selected (EKS/GKE/AKS) with rationale'
        ],
        hintIfStuck: 'Start with application tiers: frontend → Deployment + LoadBalancer/Ingress, API → Deployment + ClusterIP Service, database → StatefulSet + PersistentVolume. Use namespaces for environments. Choose managed K8s to reduce operational burden.'
      },
      {
        checkpoint: 'Migration and operational plan complete',
        description: 'Create migration strategy: incremental rollout (parallel run, traffic shift), rollback plan, CI/CD integration. Define operational approach: monitoring, logging, team training, runbooks.',
        validationCriteria: [
          'Migration phases defined (setup cluster, deploy to dev, staging validation, gradual production traffic shift)',
          'Rollback plan for each phase (how to revert if issues)',
          'CI/CD integration (GitHub Actions: build → push → deploy to K8s)',
          'Monitoring strategy (Prometheus/Grafana for metrics, alert rules)',
          'Logging strategy (centralized logging, structured logs)',
          'Team training plan (K8s fundamentals, kubectl, troubleshooting)',
          'Runbooks for common operations (deployment, rollback, scaling, troubleshooting)'
        ],
        hintIfStuck: 'Migration should be gradual: deploy to K8s dev/staging first, validate thoroughly, then gradually shift production traffic (10% → 50% → 100%) with ability to rollback. For operations, use managed services (CloudWatch/Stackdriver for logs, Prometheus for metrics). Train team before production migration.'
      }
    ],
    resourcesAllowed: [
      'Kubernetes documentation for architecture patterns',
      'Cloud provider K8s docs (EKS/GKE/AKS architecture)',
      'Sample K8s manifests for reference',
      'Migration case studies from similar companies',
      'kubectl reference documentation',
      'Cost calculators for managed K8s pricing'
    ]
  },
  runIndependent: {
    objective: 'Independently create a comprehensive Kubernetes adoption plan for a real or realistic application, including architecture, migration strategy, operational readiness, and business case.',
    successCriteria: [
      'Complete current state analysis with architecture, metrics, and pain points',
      'K8s architecture design with all necessary objects (Deployments, Services, ConfigMaps, Secrets, Ingress, etc)',
      'Namespace strategy and RBAC for multi-environment and team access control',
      'Migration strategy with phases, timeline, rollback plans, and risk mitigation',
      'CI/CD pipeline integration (GitHub Actions or similar) for automated deployments',
      'Operational plan: monitoring (metrics, alerts), logging (centralized), backup/DR',
      'Cost analysis comparing current infrastructure to K8s (managed service preferred)',
      'Team enablement plan: training, documentation, runbooks',
      'Business case with ROI projection (time savings, reduced downtime, faster delivery)'
    ],
    timeTarget: 180,
    minimumRequirements: [
      'Architecture diagrams: current state and future K8s state',
      'K8s manifests for core application components (at least 3 tiers: frontend, API, database)',
      'Migration plan with at least 4 phases and success criteria for each',
      'Monitoring and logging strategy with specific tools and configurations',
      'CI/CD workflow definition (YAML for GitHub Actions or equivalent)',
      'Runbooks for 5+ operational scenarios (deploy, rollback, scale, troubleshoot pod crash, troubleshoot node failure)',
      'Cost comparison spreadsheet (current vs K8s for 12 months)',
      'Training plan with timeline and topics for team',
      'Risk assessment with mitigation strategies'
    ],
    evaluationRubric: [
      {
        criterion: 'Architecture Quality',
        weight: 25,
        passingThreshold: 'K8s objects chosen appropriately for each component, Services configured correctly for networking, proper separation of concerns, uses managed K8s service'
      },
      {
        criterion: 'Migration Strategy',
        weight: 20,
        passingThreshold: 'Incremental approach with clear phases, validation gates between phases, rollback plan for each phase, minimal risk to production'
      },
      {
        criterion: 'Operational Readiness',
        weight: 20,
        passingThreshold: 'Monitoring and alerting defined, centralized logging, backup and DR strategy, runbooks for common scenarios, team training plan'
      },
      {
        criterion: 'CI/CD Integration',
        weight: 15,
        passingThreshold: 'Automated build/test/deploy pipeline, deploys to multiple environments, uses GitOps or similar for deployment automation, includes health checks and rollback capability'
      },
      {
        criterion: 'Business Case',
        weight: 10,
        passingThreshold: 'Cost analysis with realistic estimates, ROI calculation with time savings and downtime reduction, clear articulation of benefits beyond cost'
      },
      {
        criterion: 'Documentation Quality',
        weight: 10,
        passingThreshold: 'Clear diagrams, step-by-step procedures, runbooks covering key scenarios, team can follow documentation to execute plan'
      }
    ]
  },
  videoUrl: 'https://www.youtube.com/watch?v=PH-2FfFD2PU',
  documentation: [
    'https://kubernetes.io/docs/home/',
    'https://kubernetes.io/docs/concepts/',
    'https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/',
    'https://docs.aws.amazon.com/eks/',
    'https://cloud.google.com/kubernetes-engine/docs',
    'https://docs.microsoft.com/en-us/azure/aks/'
  ],
  relatedConcepts: ['Docker and containerization', 'Microservices architecture', 'Cloud infrastructure', 'CI/CD pipelines', 'Infrastructure as Code']
};
