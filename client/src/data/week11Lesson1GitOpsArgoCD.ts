/**
 * Week 11 Lesson 1 - GitOps with ArgoCD
 * 4-Level Mastery Progression: GitOps principles, ArgoCD, declarative deployment, sync strategies
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week11Lesson1GitOpsArgoCD: LeveledLessonContent = {
  lessonId: 'week11-lesson1-gitops-argocd',
  
  baseLesson: {
    title: 'GitOps with ArgoCD',
    description: 'Implement GitOps workflows with ArgoCD for declarative, Git-based continuous deployment to Kubernetes.',
    learningObjectives: [
      'Understand GitOps principles and benefits',
      'Install and configure ArgoCD',
      'Deploy applications declaratively using Git as source of truth',
      'Configure automated sync strategies and rollback',
      'Manage multi-cluster deployments with ArgoCD'
    ],
    prerequisites: [
      'Git fundamentals',
      'Kubernetes deployments',
      'YAML manifest knowledge'
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 30,
      runGuided: 25,
      runIndependent: 20
    }
  },

  crawl: {
    introduction: 'Learn GitOps and ArgoCD step-by-step. You will deploy ArgoCD, configure applications, and implement declarative deployment workflows.',
    expectedOutcome: 'Complete understanding of GitOps principles, ArgoCD installation and configuration, application deployment, sync strategies, automated rollback, and multi-cluster management',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Understand GitOps principles',
        command: 'echo "GitOps Principles:\n1. Declarative - Desired state in Git (YAML manifests)\n2. Versioned - All changes tracked in Git history\n3. Immutable - Infrastructure as code, no manual changes\n4. Pulled Automatically - Agents sync Git to cluster\n5. Continuously Reconciled - Drift detection and correction"',
        explanation: 'GitOps uses Git as single source of truth. Operators like ArgoCD watch Git repo, automatically apply changes to cluster. Rollback = git revert.',
        expectedOutput: 'GitOps principles listed',
        validationCriteria: [
          'Understand Git as source of truth',
          'Know pull-based vs push-based deployment',
          'Recognize drift detection benefits'
        ],
        commonMistakes: ['Manual kubectl changes breaking GitOps', 'Not understanding reconciliation']
      },
      {
        stepNumber: 2,
        instruction: 'Install ArgoCD on Kubernetes',
        command: 'kubectl create namespace argocd && kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml',
        explanation: 'ArgoCD installs: API server, repo server, application controller, UI server, Redis cache. Monitors Git repos, syncs manifests to cluster.',
        expectedOutput: 'ArgoCD installed',
        validationCriteria: [
          'All ArgoCD pods running',
          'Services created',
          'CRDs registered'
        ],
        commonMistakes: ['Insufficient cluster resources', 'Wrong namespace']
      },
      {
        stepNumber: 3,
        instruction: 'Access ArgoCD UI',
        command: 'kubectl patch svc argocd-server -n argocd -p \'{"spec":{"type":"LoadBalancer"}}\' && kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d',
        explanation: 'ArgoCD UI provides visual app management. Default username: admin. Password in secret. LoadBalancer exposes UI externally.',
        expectedOutput: 'Admin password retrieved',
        validationCriteria: [
          'UI accessible',
          'Login successful',
          'Dashboard visible'
        ],
        commonMistakes: ['Exposing UI without TLS', 'Not changing default password']
      },
      {
        stepNumber: 4,
        instruction: 'Create Git repository with Kubernetes manifests',
        command: 'mkdir -p gitops-demo/apps && cd gitops-demo && git init && cat > apps/deployment.yaml <<EOF\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: demo-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: demo\n  template:\n    metadata:\n      labels:\n        app: demo\n    spec:\n      containers:\n      - name: app\n        image: nginx:1.21\n        ports:\n        - containerPort: 80\nEOF\ngit add . && git commit -m "Initial app" && git push',
        explanation: 'GitOps repo contains Kubernetes manifests. ArgoCD watches this repo. Changes to Git automatically deploy to cluster.',
        expectedOutput: 'Git repo with manifests',
        validationCriteria: [
          'Repo initialized',
          'Manifests committed',
          'Pushed to remote'
        ],
        commonMistakes: ['Wrong file structure', 'Not pushing to remote']
      },
      {
        stepNumber: 5,
        instruction: 'Create ArgoCD Application via CLI',
        command: 'argocd app create demo-app --repo https://github.com/myorg/gitops-demo.git --path apps --dest-server https://kubernetes.default.svc --dest-namespace default',
        explanation: 'ArgoCD Application CRD defines: Git repo URL, path to manifests, target cluster/namespace. ArgoCD syncs Git state to cluster.',
        expectedOutput: 'Application created',
        validationCriteria: [
          'Application visible in UI',
          'Sync status shown',
          'Health status tracked'
        ],
        commonMistakes: ['Wrong repo URL', 'Missing access credentials']
      },
      {
        stepNumber: 6,
        instruction: 'Sync application manually',
        command: 'argocd app sync demo-app && argocd app wait demo-app --health',
        explanation: 'Manual sync applies Git manifests to cluster. Wait command blocks until app healthy. ArgoCD compares desired (Git) vs actual (cluster) state.',
        expectedOutput: 'Application synced and healthy',
        validationCriteria: [
          'Pods created in cluster',
          'Sync status: Synced',
          'Health status: Healthy'
        ],
        commonMistakes: ['Not waiting for health', 'Syncing before Git push']
      },
      {
        stepNumber: 7,
        instruction: 'Enable automated sync',
        command: 'argocd app set demo-app --sync-policy automated --auto-prune --self-heal',
        explanation: 'Automated sync: ArgoCD polls Git every 3 minutes, auto-applies changes. Auto-prune deletes resources removed from Git. Self-heal reverts manual kubectl changes.',
        expectedOutput: 'Auto-sync enabled',
        validationCriteria: [
          'Sync policy: automated',
          'Auto-prune enabled',
          'Self-heal active'
        ],
        commonMistakes: ['Auto-prune deleting unintended resources', 'Self-heal fighting manual changes']
      },
      {
        stepNumber: 8,
        instruction: 'Test GitOps workflow by updating Git',
        command: 'cd gitops-demo && sed -i "s/replicas: 3/replicas: 5/" apps/deployment.yaml && git commit -am "Scale to 5 replicas" && git push',
        explanation: 'GitOps workflow: change Git → ArgoCD detects change (within 3 min) → auto-syncs to cluster. No kubectl needed. Audit trail in Git history.',
        expectedOutput: 'Replicas scaled automatically',
        validationCriteria: [
          'Git updated',
          'ArgoCD detects change',
          '5 pods running in cluster'
        ],
        commonMistakes: ['Not waiting for sync interval', 'Forgetting git push']
      },
      {
        stepNumber: 9,
        instruction: 'Configure sync waves for ordered deployment',
        command: 'cat > apps/namespace.yaml <<EOF\napiVersion: v1\nkind: Namespace\nmetadata:\n  name: app-ns\n  annotations:\n    argocd.argoproj.io/sync-wave: "0"\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app\n  namespace: app-ns\n  annotations:\n    argocd.argoproj.io/sync-wave: "1"\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: myapp\n  template:\n    metadata:\n      labels:\n        app: myapp\n    spec:\n      containers:\n      - name: app\n        image: nginx:latest\nEOF',
        explanation: 'Sync waves control deployment order. Wave 0 (namespace) deploys before wave 1 (deployment). Use for dependencies: CRDs before CRs, namespaces before resources.',
        expectedOutput: 'Sync waves configured',
        validationCriteria: [
          'Namespace created first',
          'Deployment waits for namespace',
          'Ordered deployment verified'
        ],
        commonMistakes: ['Wrong wave numbers', 'Missing wave annotations']
      },
      {
        stepNumber: 10,
        instruction: 'Implement rollback by reverting Git commit',
        command: 'cd gitops-demo && git log --oneline && git revert HEAD && git push',
        explanation: 'GitOps rollback: revert Git commit, push, ArgoCD syncs old state. Full audit trail. No manual kubectl rollback needed.',
        expectedOutput: 'Application rolled back',
        validationCriteria: [
          'Git reverted',
          'ArgoCD syncs revert',
          'Previous state restored'
        ],
        commonMistakes: ['Using kubectl rollout undo instead of Git', 'Not pushing revert']
      },
      {
        stepNumber: 11,
        instruction: 'Configure health checks and sync options',
        command: 'kubectl apply -f - <<EOF\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: demo-app\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/myorg/gitops-demo.git\n    targetRevision: HEAD\n    path: apps\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: default\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true\n    syncOptions:\n    - CreateNamespace=true\n    retry:\n      limit: 5\n      backoff:\n        duration: 5s\n        factor: 2\n        maxDuration: 3m\nEOF',
        explanation: 'SyncOptions: CreateNamespace auto-creates target namespace. Retry with exponential backoff handles transient failures. Limits prevent infinite retries.',
        expectedOutput: 'Advanced sync configured',
        validationCriteria: [
          'Retry logic active',
          'Namespace auto-creation working',
          'Backoff preventing hammering'
        ],
        commonMistakes: ['No retry limits', 'Backoff too aggressive']
      },
      {
        stepNumber: 12,
        instruction: 'Set up multi-cluster management',
        command: 'kubectl config get-contexts && argocd cluster add staging-cluster --name staging && argocd app create staging-app --repo https://github.com/myorg/gitops-demo.git --path apps/staging --dest-server https://staging-cluster-api --dest-namespace staging',
        explanation: 'ArgoCD manages multiple clusters from single control plane. Add cluster with credentials, deploy apps to any cluster. Single Git repo, multiple environments.',
        expectedOutput: 'Multi-cluster configured',
        validationCriteria: [
          'Staging cluster added',
          'Apps deployed to both clusters',
          'Independent sync status'
        ],
        commonMistakes: ['Wrong cluster credentials', 'Namespace conflicts']
      }
    ]
  },

  walk: {
    introduction: 'Apply GitOps and ArgoCD through hands-on exercises.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Create ArgoCD Application manifest.',
        template: `apiVersion: argoproj.io/__V1ALPHA1__
kind: __APPLICATION__
metadata:
  name: my-app
  namespace: __ARGOCD__
spec:
  project: __DEFAULT__
  source:
    repoURL: https://github.com/myorg/gitops-repo.git
    targetRevision: __HEAD__
    path: __APPS__
  destination:
    server: __HTTPS://KUBERNETES.DEFAULT.SVC__
    namespace: production
  syncPolicy:
    automated:
      prune: __TRUE__
      selfHeal: __TRUE__`,
        blanks: [
          {
            id: 'V1ALPHA1',
            label: 'V1ALPHA1',
            hint: 'API version',
            correctValue: 'v1alpha1',
            validationPattern: 'v1alpha1'
          },
          {
            id: 'APPLICATION',
            label: 'APPLICATION',
            hint: 'Resource kind',
            correctValue: 'Application',
            validationPattern: 'application'
          },
          {
            id: 'ARGOCD',
            label: 'ARGOCD',
            hint: 'ArgoCD namespace',
            correctValue: 'argocd',
            validationPattern: 'argocd'
          },
          {
            id: 'DEFAULT',
            label: 'DEFAULT',
            hint: 'Project name',
            correctValue: 'default',
            validationPattern: 'default'
          },
          {
            id: 'HEAD',
            label: 'HEAD',
            hint: 'Git revision',
            correctValue: 'HEAD',
            validationPattern: 'head'
          },
          {
            id: 'APPS',
            label: 'APPS',
            hint: 'Manifest path',
            correctValue: 'apps',
            validationPattern: 'apps'
          },
          {
            id: 'HTTPS://KUBERNETES.DEFAULT.SVC',
            label: 'HTTPS://KUBERNETES.DEFAULT.SVC',
            hint: 'Cluster server',
            correctValue: 'https://kubernetes.default.svc',
            validationPattern: 'kubernetes'
          },
          {
            id: 'TRUE',
            label: 'TRUE',
            hint: 'Enable pruning',
            correctValue: 'true',
            validationPattern: 'true'
          }
        ],
        solution: 'ArgoCD Application syncs Git repo (apps/ directory) to Kubernetes cluster. Automated sync with prune (delete removed resources) and self-heal (revert manual changes). targetRevision: HEAD tracks latest commit.',
        explanation: 'ArgoCD Applications define declarative deployment from Git to cluster'
      },
      {
        exerciseNumber: 2,
        scenario: 'Configure sync waves for deployment ordering.',
        template: `apiVersion: v1
kind: __NAMESPACE__
metadata:
  name: myapp
  annotations:
    argocd.argoproj.io/sync-wave: "__0__"
---
apiVersion: v1
kind: __CONFIG_MAP__
metadata:
  name: app-config
  namespace: myapp
  annotations:
    argocd.argoproj.io/sync-wave: "__1__"
data:
  database_url: "postgres://db:5432"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: myapp
  annotations:
    argocd.argoproj.io/sync-wave: "__2__"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:v1`,
        blanks: [
          {
            id: 'NAMESPACE',
            label: 'NAMESPACE',
            hint: 'Resource kind',
            correctValue: 'Namespace',
            validationPattern: 'namespace'
          },
          {
            id: '0',
            label: '0',
            hint: 'First wave',
            correctValue: '0',
            validationPattern: '0'
          },
          {
            id: 'CONFIG_MAP',
            label: 'CONFIG_MAP',
            hint: 'Resource kind',
            correctValue: 'ConfigMap',
            validationPattern: 'config.*map'
          },
          {
            id: '1',
            label: '1',
            hint: 'Second wave',
            correctValue: '1',
            validationPattern: '1'
          },
          {
            id: '2',
            label: '2',
            hint: 'Third wave',
            correctValue: '2',
            validationPattern: '2'
          }
        ],
        solution: 'Sync waves ensure ordered deployment: wave 0 (namespace), wave 1 (ConfigMap), wave 2 (Deployment). Prevents failures from missing dependencies. Lower numbers deploy first.',
        explanation: 'Sync waves control resource creation order for dependencies'
      },
      {
        exerciseNumber: 3,
        scenario: 'Enable automated sync with retry and health checks.',
        template: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/repo.git
    targetRevision: HEAD
    path: manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: __TRUE__
      selfHeal: __TRUE__
    syncOptions:
    - __CREATE_NAMESPACE=TRUE__
    retry:
      limit: __5__
      backoff:
        duration: __5S__
        factor: __2__
        maxDuration: __3M__`,
        blanks: [
          {
            id: 'TRUE',
            label: 'TRUE',
            hint: 'Enable prune',
            correctValue: 'true',
            validationPattern: 'true'
          },
          {
            id: 'CREATE_NAMESPACE=TRUE',
            label: 'CREATE_NAMESPACE=TRUE',
            hint: 'Sync option',
            correctValue: 'CreateNamespace=true',
            validationPattern: 'create.*namespace'
          },
          {
            id: '5',
            label: '5',
            hint: 'Retry limit',
            correctValue: '5',
            validationPattern: '5'
          },
          {
            id: '5S',
            label: '5S',
            hint: 'Initial duration',
            correctValue: '5s',
            validationPattern: '5s'
          },
          {
            id: '2',
            label: '2',
            hint: 'Backoff factor',
            correctValue: '2',
            validationPattern: '2'
          },
          {
            id: '3M',
            label: '3M',
            hint: 'Max duration',
            correctValue: '3m',
            validationPattern: '3m'
          }
        ],
        solution: 'Automated sync with prune and self-heal. CreateNamespace auto-creates target namespace. Retry with exponential backoff: 5s, 10s, 20s, 40s, 80s, max 3m. Up to 5 retries for transient failures.',
        explanation: 'Retry policies handle transient failures with exponential backoff'
      },
      {
        exerciseNumber: 4,
        scenario: 'Configure multi-environment deployment with Kustomize.',
        template: `# Base kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- deployment.yaml
- service.yaml

# overlays/staging/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
bases:
- ../../base
namePrefix: __STAGING__-
namespace: __STAGING__
replicas:
- name: myapp
  count: __2__
images:
- name: myapp
  newTag: __V1.2.0__

# ArgoCD Application for staging
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp-staging
spec:
  source:
    repoURL: https://github.com/myorg/repo.git
    path: overlays/__STAGING__
  destination:
    namespace: staging`,
        blanks: [
          {
            id: 'STAGING',
            label: 'STAGING',
            hint: 'Environment name',
            correctValue: 'staging',
            validationPattern: 'staging'
          },
          {
            id: '2',
            label: '2',
            hint: 'Replica count',
            correctValue: '2',
            validationPattern: '2'
          },
          {
            id: 'V1.2.0',
            label: 'V1.2.0',
            hint: 'Image tag',
            correctValue: 'v1.2.0',
            validationPattern: 'v1'
          }
        ],
        solution: 'Kustomize overlays customize base manifests per environment. Staging overlay: prefix resources, 2 replicas, specific image tag, staging namespace. Single base, multiple environments.',
        explanation: 'Kustomize enables environment-specific configurations from single base'
      },
      {
        exerciseNumber: 5,
        scenario: 'Set up ArgoCD ApplicationSet for multi-cluster deployment.',
        template: `apiVersion: argoproj.io/__V1ALPHA1__
kind: __APPLICATION_SET__
metadata:
  name: multi-cluster-app
  namespace: argocd
spec:
  generators:
  - list:
      elements:
      - cluster: __PRODUCTION__
        url: https://prod-cluster
      - cluster: staging
        url: https://staging-cluster
  template:
    metadata:
      name: 'myapp-{{cluster}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/myorg/repo.git
        targetRevision: __HEAD__
        path: 'environments/{{__CLUSTER__}}'
      destination:
        server: '{{__URL__}}'
        namespace: myapp
      syncPolicy:
        automated:
          prune: true`,
        blanks: [
          {
            id: 'V1ALPHA1',
            label: 'V1ALPHA1',
            hint: 'API version',
            correctValue: 'v1alpha1',
            validationPattern: 'v1alpha1'
          },
          {
            id: 'APPLICATION_SET',
            label: 'APPLICATION_SET',
            hint: 'Resource kind',
            correctValue: 'ApplicationSet',
            validationPattern: 'application.*set'
          },
          {
            id: 'PRODUCTION',
            label: 'PRODUCTION',
            hint: 'Cluster name',
            correctValue: 'production',
            validationPattern: 'prod'
          },
          {
            id: 'HEAD',
            label: 'HEAD',
            hint: 'Git revision',
            correctValue: 'HEAD',
            validationPattern: 'head'
          },
          {
            id: 'CLUSTER',
            label: 'CLUSTER',
            hint: 'Template variable',
            correctValue: 'cluster',
            validationPattern: 'cluster'
          },
          {
            id: 'URL',
            label: 'URL',
            hint: 'Template variable',
            correctValue: 'url',
            validationPattern: 'url'
          }
        ],
        solution: 'ApplicationSet generates multiple Applications from template. List generator creates app per cluster: myapp-production, myapp-staging. Each deploys to different cluster from environment-specific path.',
        explanation: 'ApplicationSets automate multi-cluster deployments from templates'
      }
    ],
    hints: [
      'ArgoCD Application CRD defines Git repo, path, and destination cluster',
      'Automated sync with prune and self-heal enforces GitOps strictly',
      'Sync waves control deployment order (lower numbers first)',
      'Kustomize overlays enable environment-specific configurations',
      'ApplicationSets generate multiple apps for multi-cluster deployments'
    ]
  },

  runGuided: {
    objective: 'Build production GitOps platform with ArgoCD managing multi-environment, multi-cluster deployments with automated sync and rollback',
    conceptualGuidance: [
      'Design Git repository structure: base manifests + environment overlays',
      'Install ArgoCD with HA configuration and SSO',
      'Create ArgoCD Projects for team isolation',
      'Configure Applications for each environment (dev, staging, prod)',
      'Enable automated sync with self-heal and prune',
      'Implement sync waves for ordered deployment',
      'Set up ApplicationSets for multi-cluster management',
      'Configure RBAC for team-based access control',
      'Integrate with CI/CD: build updates Git, ArgoCD deploys',
      'Monitor sync status and health with Prometheus/Grafana'
    ],
    keyConceptsToApply: [
      'GitOps declarative deployment',
      'ArgoCD Application management',
      'Multi-environment with Kustomize',
      'Automated sync and self-healing',
      'Multi-cluster orchestration'
    ],
    checkpoints: [
      {
        checkpoint: 'ArgoCD deployed and managing applications',
        description: 'GitOps workflow active with automated sync',
        validationCriteria: [
          'ArgoCD installed with HA (3 replicas)',
          'Applications defined for dev, staging, prod',
          'Automated sync enabled with self-heal',
          'Git changes deploy automatically within 3 minutes',
          'Manual kubectl changes reverted by self-heal',
          'ArgoCD UI accessible with SSO'
        ],
        hintIfStuck: 'Install ArgoCD with HA manifest. Create Application CRDs for each environment. Enable syncPolicy.automated with prune and selfHeal. Test by changing Git and watching auto-sync.'
      },
      {
        checkpoint: 'Multi-environment deployment with Kustomize',
        description: 'Environment-specific configurations deployed',
        validationCriteria: [
          'Base manifests in base/ directory',
          'Overlays for dev, staging, prod',
          'Environment-specific replicas, images, configs',
          'Single ArgoCD Application per environment',
          'Promotion: update staging overlay, then prod',
          'No duplication between environments'
        ],
        hintIfStuck: 'Structure repo: base/ with common manifests, overlays/dev, overlays/staging, overlays/prod. Each overlay has kustomization.yaml customizing base. ArgoCD Applications point to overlay paths.'
      },
      {
        checkpoint: 'Multi-cluster management configured',
        description: 'Single ArgoCD managing multiple clusters',
        validationCriteria: [
          'Multiple clusters added to ArgoCD',
          'ApplicationSet generating apps per cluster',
          'Independent sync status per cluster',
          'Cluster-specific configurations',
          'Single Git repo, multiple clusters',
          'Cluster credentials secured in secrets'
        ],
        hintIfStuck: 'Add clusters with argocd cluster add. Create ApplicationSet with list generator for each cluster. Use templates to customize per cluster. Verify apps deployed to all clusters.'
      }
    ],
    resourcesAllowed: [
      'ArgoCD documentation',
      'GitOps principles guide',
      'Kustomize documentation',
      'ApplicationSet examples'
    ]
  },

  runIndependent: {
    objective: 'Build production-grade GitOps platform with comprehensive ArgoCD setup, multi-environment deployment, multi-cluster management, automated sync, RBAC, and complete observability',
    successCriteria: [
      'ArgoCD HA deployment: 3+ replicas, SSO integration, TLS enabled',
      'GitOps repository structure: base manifests, environment overlays, versioned',
      'Multi-environment: dev, staging, production with Kustomize overlays',
      'Automated sync: self-heal enabled, prune active, sync waves configured',
      'Multi-cluster: ApplicationSets deploying to multiple clusters',
      'RBAC: Projects isolating teams, role-based access to applications',
      'Rollback: Git revert for instant rollback with full audit trail',
      'CI/CD integration: build updates image tag in Git, ArgoCD deploys',
      'Monitoring: Prometheus metrics, Grafana dashboards, alerts on sync failures',
      'Documentation: GitOps workflows, promotion process, runbooks'
    ],
    timeTarget: 20,
    minimumRequirements: [
      'ArgoCD managing applications with automated sync',
      'Multi-environment deployment working',
      'Git as source of truth enforced'
    ],
    evaluationRubric: [
      {
        criterion: 'GitOps Implementation',
        weight: 30,
        passingThreshold: 'ArgoCD HA deployed. All apps managed declaratively via Git. Automated sync with self-heal preventing drift. Manual kubectl changes reverted automatically. Git history as complete audit trail. Rollback via git revert tested.'
      },
      {
        criterion: 'Multi-Environment Management',
        weight: 25,
        passingThreshold: 'Kustomize base + overlays for dev/staging/prod. Environment-specific configs (replicas, images, resources). Promotion workflow documented. No manifest duplication. Sync waves ensuring ordered deployment. Each environment isolated.'
      },
      {
        criterion: 'Multi-Cluster Orchestration',
        weight: 25,
        passingThreshold: 'ApplicationSets deploying to multiple clusters. Single ArgoCD control plane. Cluster-specific configurations. Independent sync per cluster. Credentials secured. Multi-region deployment capability.'
      },
      {
        criterion: 'Operations & Security',
        weight: 20,
        passingThreshold: 'RBAC restricting access by team. Projects isolating resources. SSO integrated. TLS enabled. Metrics exported to Prometheus. Alerts on sync failures. Documentation complete. Teams trained on GitOps workflow.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=MeU5_k9ssrs',
  documentation: [
    'https://argo-cd.readthedocs.io/',
    'https://www.gitops.tech/',
    'https://opengitops.dev/',
    'https://kustomize.io/',
    'https://argo-cd.readthedocs.io/en/stable/user-guide/application-set/',
    'https://codefresh.io/learn/gitops/'
  ],
  relatedConcepts: [
    'GitOps principles and workflow',
    'ArgoCD application management',
    'Declarative deployment',
    'Kustomize overlays for environments',
    'Multi-cluster orchestration',
    'Automated sync and self-healing'
  ]
};
