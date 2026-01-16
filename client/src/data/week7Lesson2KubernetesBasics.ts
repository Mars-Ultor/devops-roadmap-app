import type { LeveledLessonContent } from '../types/lessonContent';

export const week7Lesson2KubernetesBasics: LeveledLessonContent = {
  lessonId: 'week7-lesson2-kubernetes-basics',
  baseLesson: {
    title: 'Kubernetes Basics',
    description: 'Master core Kubernetes concepts through hands-on practice with kubectl, pods, deployments, and services.',
    learningObjectives: [
      'Set up a local Kubernetes environment for development',
      'Use kubectl to interact with Kubernetes clusters',
      'Create and manage pods, deployments, and services',
      'Understand YAML manifest structure and syntax',
      'Debug common Kubernetes issues'
    ],
    prerequisites: ['Docker basics', 'YAML syntax', 'Command line proficiency', 'Why Kubernetes lesson'],
    estimatedTimePerLevel: {
      crawl: 120,
      walk: 60,
      runGuided: 90,
      runIndependent: 180
    }
  },
  crawl: {
    introduction: 'Get hands-on with Kubernetes by setting up a local cluster and practicing with core objects: pods, deployments, and services.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Install and start a local Kubernetes cluster with Docker Desktop or Minikube',
        command: '# Docker Desktop (easiest for Windows/Mac):\n# Enable Kubernetes in Docker Desktop settings → Kubernetes → Enable\n\n# OR Minikube (cross-platform):\n# macOS:\nbrew install minikube\nminikube start\n\n# Windows (PowerShell):\nchoco install minikube\nminikube start\n\n# Verify cluster is running:\nkubectl cluster-info\nkubectl get nodes',
        explanation: 'Docker Desktop includes Kubernetes built-in - just enable it in settings. Minikube runs a single-node cluster in a VM or Docker container. Both are perfect for learning. `kubectl cluster-info` shows cluster endpoint. `kubectl get nodes` lists nodes in your cluster (you\'ll see 1 node for local dev). kubectl is the command-line tool for all Kubernetes operations.',
        expectedOutput: 'Cluster info showing Kubernetes control plane URL, one node in Ready state',
        validationCriteria: [
          'kubectl cluster-info returns cluster endpoint',
          'kubectl get nodes shows at least one node in Ready status',
          'kubectl version shows both client and server versions'
        ],
        commonMistakes: [
          'Not waiting for cluster to fully start (takes 1-2 minutes)',
          'Using old kubectl version (should match server version)',
          'Firewall blocking Kubernetes ports (8443, 10250)'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Understand kubectl syntax and get cluster resources',
        command: '# Kubectl syntax: kubectl [command] [type] [name] [flags]\n\n# Get all namespaces:\nkubectl get namespaces\n\n# Get pods in default namespace:\nkubectl get pods\n\n# Get pods in all namespaces:\nkubectl get pods --all-namespaces\n# OR shorthand:\nkubectl get pods -A\n\n# Get detailed info about a resource:\nkubectl describe node <node-name>\n\n# See available resource types:\nkubectl api-resources',
        explanation: 'kubectl follows a consistent pattern: command (get, describe, create, delete), resource type (pods, deployments, services), optional name, and flags. `get` lists resources, `describe` shows details. The -A flag shows resources across all namespaces (default only shows default namespace). `api-resources` lists all available resource types in your cluster.',
        expectedOutput: 'List of namespaces (default, kube-system, kube-public), system pods in kube-system, node details',
        validationCriteria: [
          'Can list namespaces and see default, kube-system, kube-public',
          'Can view pods across all namespaces (-A flag)',
          'Understand kubectl command structure'
        ],
        commonMistakes: [
          'Forgetting -A flag and wondering why no pods show (they\'re in other namespaces)',
          'Trying to describe without specifying resource name',
          'Not understanding difference between get (list) and describe (details)'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Create your first pod using kubectl run',
        command: '# Create a pod running nginx:\nkubectl run nginx --image=nginx:latest\n\n# Watch pod status until Running:\nkubectl get pods --watch\n# (Press Ctrl+C to stop watching)\n\n# Get detailed pod information:\nkubectl describe pod nginx\n\n# Get pod logs:\nkubectl logs nginx\n\n# Execute command inside pod:\nkubectl exec nginx -- nginx -v\n\n# Interactive shell in pod:\nkubectl exec -it nginx -- /bin/bash\n# (type "exit" to leave)',
        explanation: '`kubectl run` creates a pod quickly for testing (not for production - use Deployments). The pod pulls the nginx image from Docker Hub and starts it. `--watch` monitors status changes. `describe` shows events (pulling image, starting container). `logs` shows container stdout. `exec` runs commands in the container, `-it` makes it interactive (like docker exec). This is how you debug running pods.',
        expectedOutput: 'Pod transitions from Pending → ContainerCreating → Running, nginx logs show startup, exec shows nginx version',
        validationCriteria: [
          'Pod reaches Running status within 60 seconds',
          'kubectl logs shows nginx access/error log format',
          'kubectl exec can run commands inside container'
        ],
        commonMistakes: [
          'Not waiting for image pull (can take time on first run)',
          'Forgetting -- separator before command in exec',
          'Not using -it for interactive shells (you need both flags)'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'Create a pod using YAML manifest (declarative approach)',
        command: '# Create pod.yaml:\ncat > pod.yaml << EOF\napiVersion: v1\nkind: Pod\nmetadata:\n  name: nginx-pod\n  labels:\n    app: nginx\nspec:\n  containers:\n  - name: nginx\n    image: nginx:latest\n    ports:\n    - containerPort: 80\nEOF\n\n# Apply the manifest:\nkubectl apply -f pod.yaml\n\n# Get pods with labels:\nkubectl get pods --show-labels\n\n# Get pods by label selector:\nkubectl get pods -l app=nginx\n\n# Delete pod:\nkubectl delete pod nginx-pod',
        explanation: 'YAML manifests are the declarative way to define Kubernetes resources. Every manifest has: apiVersion (API group), kind (resource type), metadata (name, labels), and spec (desired state). Labels are key-value pairs that identify resources - they\'re used by Services and selectors. `kubectl apply` creates or updates resources. This is the production approach - manifests go in Git, applied by CI/CD.',
        expectedOutput: 'Pod created from YAML, labels visible, can select by label, pod deleted successfully',
        validationCriteria: [
          'YAML manifest creates pod successfully',
          'Labels are set correctly (app=nginx visible)',
          'Can filter pods using label selector (-l flag)',
          'kubectl apply is idempotent (can run multiple times safely)'
        ],
        commonMistakes: [
          'YAML indentation errors (must use spaces, not tabs, 2-space indent)',
          'Forgetting apiVersion or kind (required fields)',
          'Not using labels (needed for Services to find pods)',
          'Using kubectl create instead of apply (create fails if resource exists, apply is idempotent)'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'Create a Deployment (the right way to run applications)',
        command: '# Create deployment.yaml:\ncat > deployment.yaml << EOF\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-deployment\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:latest\n        ports:\n        - containerPort: 80\nEOF\n\n# Apply deployment:\nkubectl apply -f deployment.yaml\n\n# Watch deployment rollout:\nkubectl rollout status deployment/nginx-deployment\n\n# Get pods created by deployment:\nkubectl get pods -l app=nginx\n\n# Get deployment details:\nkubectl describe deployment nginx-deployment',
        explanation: 'Deployments are the production way to run stateless apps. The Deployment creates a ReplicaSet, which creates pods. `replicas: 3` means 3 copies of the pod. `selector.matchLabels` tells Deployment which pods it manages. `template` is the pod specification. Deployment ensures 3 replicas are always running - if one crashes, it creates a new one. `rollout status` tracks deployment progress.',
        expectedOutput: '3 nginx pods created, all Running, deployment shows 3/3 ready replicas',
        validationCriteria: [
          'Deployment creates exactly 3 pod replicas',
          'All pods reach Running status',
          'Deployment status shows READY 3/3',
          'Pods have random suffixes (deployment-abc123-xyz456)'
        ],
        commonMistakes: [
          'Mismatch between selector.matchLabels and template.labels (deployment won\'t create pods)',
          'Not understanding Deployment creates ReplicaSet creates Pods (three layers)',
          'Thinking you should create pods directly (use Deployment instead)',
          'Forgetting selector is required for Deployments (not for bare pods)'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'Test self-healing by deleting a pod',
        command: '# Get pod names:\nkubectl get pods -l app=nginx\n\n# Delete one pod:\nkubectl delete pod <pod-name>\n\n# Immediately check pods:\nkubectl get pods -l app=nginx --watch\n\n# See ReplicaSet events:\nkubectl describe rs <replicaset-name>',
        explanation: 'Delete a pod and watch what happens: Deployment\'s ReplicaSet controller notices desired state (3 replicas) doesn\'t match actual state (2 running). It immediately creates a new pod to restore desired state. You\'ll see the new pod go Pending → ContainerCreating → Running. This is self-healing in action - Kubernetes continuously reconciles desired vs actual state.',
        expectedOutput: 'Deleted pod terminated, new pod created automatically, count returns to 3 pods',
        validationCriteria: [
          'New pod created within seconds of deletion',
          'Total pod count returns to 3 (desired replicas)',
          'ReplicaSet events show "Created pod"'
        ],
        commonMistakes: [
          'Deleting the Deployment instead of pod (deletes everything)',
          'Not understanding the new pod has a different name (pods are cattle, not pets)',
          'Expecting instant recovery (takes 5-15 seconds)'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'Scale the deployment up and down',
        command: '# Scale up to 5 replicas:\nkubectl scale deployment nginx-deployment --replicas=5\n\n# Watch scaling:\nkubectl get pods -l app=nginx --watch\n\n# Check deployment status:\nkubectl get deployment nginx-deployment\n\n# Scale down to 2:\nkubectl scale deployment nginx-deployment --replicas=2\n\n# Alternative: edit YAML and apply:\n# Edit deployment.yaml, change replicas: 2\nkubectl apply -f deployment.yaml',
        explanation: '`kubectl scale` changes replica count immediately. Scaling up creates new pods. Scaling down terminates excess pods gracefully (SIGTERM, wait, SIGKILL). You can scale imperatively (kubectl scale) or declaratively (edit YAML, kubectl apply). Declarative is better for production (Git tracks changes). Scaling is instant for compute, but remember each pod needs resources (CPU, memory).',
        expectedOutput: 'Scaling from 3→5 creates 2 new pods, 5→2 terminates 3 pods, deployment reflects current replica count',
        validationCriteria: [
          'Scaling up creates exact number of new pods',
          'Scaling down terminates extra pods gracefully',
          'Deployment READY count matches desired replicas',
          'Both imperative (scale) and declarative (apply) methods work'
        ],
        commonMistakes: [
          'Not waiting for pods to reach Running before scaling again',
          'Scaling to 0 in production (no pods to serve traffic)',
          'Using kubectl scale in production (use GitOps/declarative approach)'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'Create a Service to expose the deployment',
        command: '# Create service.yaml:\ncat > service.yaml << EOF\napiVersion: v1\nkind: Service\nmetadata:\n  name: nginx-service\nspec:\n  selector:\n    app: nginx\n  ports:\n  - protocol: TCP\n    port: 80\n    targetPort: 80\n  type: ClusterIP\nEOF\n\n# Apply service:\nkubectl apply -f service.yaml\n\n# Get service:\nkubectl get service nginx-service\n\n# Get service endpoints (pod IPs):\nkubectl get endpoints nginx-service\n\n# Describe service:\nkubectl describe service nginx-service',
        explanation: 'Services provide stable network endpoints for dynamic pods. `selector: app: nginx` makes the Service find all pods with that label. The Service gets a cluster IP (virtual IP) and DNS name (nginx-service.default.svc.cluster.local). `port: 80` is the Service port, `targetPort: 80` is the container port. `type: ClusterIP` means internal only (default). Endpoints show actual pod IPs the Service load balances across.',
        expectedOutput: 'Service created with ClusterIP, endpoints list shows 2 pod IPs (current replica count), service DNS name resolves',
        validationCriteria: [
          'Service has a ClusterIP assigned (10.x.x.x range)',
          'Endpoints match current pod count and IPs',
          'Service selector matches pod labels',
          'Service is reachable via DNS name internally'
        ],
        commonMistakes: [
          'Selector doesn\'t match pod labels (service has no endpoints)',
          'Confusing port (Service port) with targetPort (container port)',
          'Expecting ClusterIP to be accessible from outside (it\'s internal only)',
          'Not understanding Service IP is virtual (not tied to any pod)'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'Test Service load balancing and DNS',
        command: '# Create a test pod to call service:\nkubectl run test-pod --image=busybox:latest --rm -it --restart=Never -- sh\n\n# Inside test pod, test Service DNS:\nwget -O- http://nginx-service\n\n# Test multiple times to see load balancing:\nfor i in 1 2 3 4 5; do wget -O- -q http://nginx-service | grep "Welcome to nginx"; done\n\n# Exit test pod (pod auto-deletes due to --rm):\nexit\n\n# Alternatively, test with curl pod:\nkubectl run curl-pod --image=curlimages/curl:latest --rm -it --restart=Never -- curl http://nginx-service',
        explanation: 'The test pod can reach nginx via Service DNS name (nginx-service). Kubernetes DNS automatically creates records for Services (servicename.namespace.svc.cluster.local, but servicename works within same namespace). The Service load balances across all backend pods - if you curl multiple times, requests go to different pods (though nginx returns same content, so you won\'t see different responses). `--rm` auto-deletes pod on exit.',
        expectedOutput: 'wget/curl successfully retrieves nginx welcome page, DNS resolves service name, multiple requests succeed',
        validationCriteria: [
          'Service DNS name resolves correctly',
          'HTTP request to service succeeds',
          'Service is reachable from other pods in cluster',
          'Load balancing distributes requests (visible in pod logs if you add unique responses)'
        ],
        commonMistakes: [
          'Testing from outside cluster (ClusterIP is internal only)',
          'Using external DNS (need to use Service name, not external domain)',
          'Not understanding nginx returns same content from all pods (need custom app to see load balancing)'
        ]
      },
      {
        stepNumber: 10,
        instruction: 'Expose service externally with LoadBalancer or NodePort',
        command: '# For local development, change Service type to NodePort:\nkubectl patch service nginx-service -p \'{"spec":{"type":"NodePort"}}\'\n\n# Get service with NodePort:\nkubectl get service nginx-service\n\n# Access via NodePort:\n# Minikube:\nminikube service nginx-service --url\n# (Opens in browser or shows URL)\n\n# Docker Desktop:\n# Visit http://localhost:<NodePort>\n\n# For cloud clusters, use LoadBalancer:\n# kubectl patch service nginx-service -p \'{"spec":{"type":"LoadBalancer"}}\'\n# (Cloud provider creates external load balancer)',
        explanation: 'ClusterIP is internal only. NodePort exposes on every node\'s IP on a high port (30000-32767). For Minikube, use `minikube service` to access. For Docker Desktop, use localhost:NodePort. LoadBalancer (cloud only) provisions an external load balancer (AWS ELB, GCP Load Balancer). LoadBalancer is the production way to expose services externally (or use Ingress for HTTP/HTTPS routing).',
        expectedOutput: 'Service type changed to NodePort, NodePort assigned (e.g., 31234), nginx accessible via node IP:port or LoadBalancer external IP',
        validationCriteria: [
          'Service type changes successfully',
          'NodePort assigned in 30000-32767 range',
          'Can access nginx from browser via NodePort',
          'For LoadBalancer (cloud), external IP assigned'
        ],
        commonMistakes: [
          'Using LoadBalancer on local cluster (only works on cloud providers)',
          'Not using `minikube service` to access NodePort on Minikube',
          'Expecting NodePort to be accessible via Service ClusterIP (need node IP instead)',
          'Using NodePort in production (use LoadBalancer or Ingress instead)'
        ]
      },
      {
        stepNumber: 11,
        instruction: 'Update deployment with rolling update',
        command: '# Update image to nginx:1.25:\nkubectl set image deployment/nginx-deployment nginx=nginx:1.25\n\n# Watch rollout:\nkubectl rollout status deployment/nginx-deployment\n\n# Check rollout history:\nkubectl rollout history deployment/nginx-deployment\n\n# See pod changes in real-time:\nkubectl get pods -l app=nginx --watch\n\n# Verify new version:\nkubectl exec -it <new-pod-name> -- nginx -v',
        explanation: 'Changing the image triggers a rolling update. Kubernetes creates new pods with nginx:1.25 while keeping old nginx:latest pods running. Once new pods are Ready, old pods terminate. This ensures zero downtime. `rollout status` tracks progress. `rollout history` shows revision history. You\'ll see new pods created, old pods terminated gradually. This is how production deployments work - update declaratively, Kubernetes handles the rollout.',
        expectedOutput: 'New pods created with nginx:1.25, old pods terminated after new ones ready, no downtime, rollout succeeds',
        validationCriteria: [
          'Rolling update completes successfully',
          'At no point are all pods down (zero downtime)',
          'New pods run nginx:1.25',
          'Old pods gracefully terminated after new ones ready'
        ],
        commonMistakes: [
          'Using kubectl set image in production (use declarative YAML in Git)',
          'Not monitoring rollout status (could fail silently if not watched)',
          'Not setting readiness probes (new pods receive traffic before ready)',
          'Expecting instant update (rolling updates take time intentionally)'
        ]
      },
      {
        stepNumber: 12,
        instruction: 'Rollback a deployment',
        command: '# Intentionally deploy a bad version:\nkubectl set image deployment/nginx-deployment nginx=nginx:broken-tag\n\n# Watch it fail:\nkubectl rollout status deployment/nginx-deployment\n# (Will show ImagePullBackOff error)\n\n# Check pod status:\nkubectl get pods -l app=nginx\n\n# Rollback to previous version:\nkubectl rollout undo deployment/nginx-deployment\n\n# Watch rollback:\nkubectl rollout status deployment/nginx-deployment\n\n# Verify pods recovered:\nkubectl get pods -l app=nginx\n\n# Rollback to specific revision:\n# kubectl rollout undo deployment/nginx-deployment --to-revision=1',
        explanation: 'If a deployment fails (bad image, crash loop, etc), `rollout undo` reverts to the previous revision. Kubernetes keeps revision history (default 10). The rollback is also a rolling update - it creates pods with the old version, terminates failing pods. This enables safe experimentation - if an update breaks production, rollback with one command. In practice, CI/CD should test before deploying, but rollback is your safety net.',
        expectedOutput: 'Bad image causes ImagePullBackOff, rollback restores previous working version, pods return to Running',
        validationCriteria: [
          'Bad deployment shows ImagePullBackOff or CrashLoopBackOff',
          'Rollback command succeeds',
          'Pods return to previous working image',
          'All pods reach Running status after rollback'
        ],
        commonMistakes: [
          'Not checking rollout status after deploy (failing deployments may not be obvious)',
          'Panic-deleting deployment instead of rolling back (loses all history)',
          'Not testing deployments in staging before production (should catch broken images)',
          'Not understanding rollback is just deploying previous revision'
        ]
      }
    ],
    expectedOutcome: 'Hands-on proficiency with kubectl, creating pods and deployments, scaling, exposing with services, performing rolling updates, and rollbacks.'
  },
  walk: {
    introduction: 'Apply Kubernetes knowledge to practical scenarios, completing manifests and troubleshooting common issues.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Create a complete Deployment and Service for a Node.js API. Fill in the missing configuration.',
        template: `# deployment.yaml
apiVersion: ___________
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: ___________
  selector:
    ___________:
      app: api
  template:
    metadata:
      ___________:
        app: api
    spec:
      containers:
      - name: api
        image: node:18-alpine
        command: ["node", "server.js"]
        ports:
        - containerPort: ___________
        env:
        - name: PORT
          value: ___________

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    ___________: ___________
  ports:
  - protocol: TCP
    port: ___________
    targetPort: ___________
  type: ___________`,
        blanks: [
          {
            id: 'deployment_apiversion',
            label: 'Deployment apiVersion',
            hint: 'What API group for Deployments?',
            correctValue: 'apps/v1',
            validationPattern: 'apps/v1'
          },
          {
            id: 'replicas',
            label: 'Number of replicas',
            hint: 'How many for high availability?',
            correctValue: '3',
            validationPattern: '3|2\\+'
          },
          {
            id: 'selector_key',
            label: 'Selector key',
            hint: 'How to match pods?',
            correctValue: 'matchLabels',
            validationPattern: 'matchLabels'
          },
          {
            id: 'template_labels_key',
            label: 'Template metadata key',
            hint: 'Where to define pod labels?',
            correctValue: 'labels',
            validationPattern: 'labels'
          },
          {
            id: 'container_port',
            label: 'Container port',
            hint: 'What port does Node.js API typically use?',
            correctValue: '3000',
            validationPattern: '3000|8080|4000'
          },
          {
            id: 'port_env',
            label: 'PORT environment variable value',
            hint: 'Should match containerPort',
            correctValue: '"3000"',
            validationPattern: '3000|8080|4000'
          },
          {
            id: 'service_selector_key',
            label: 'Service selector key',
            hint: 'What label to match?',
            correctValue: 'app',
            validationPattern: 'app'
          },
          {
            id: 'service_selector_value',
            label: 'Service selector value',
            hint: 'Should match pod labels',
            correctValue: 'api',
            validationPattern: 'api'
          },
          {
            id: 'service_port',
            label: 'Service port',
            hint: 'External port to expose',
            correctValue: '80',
            validationPattern: '80|3000|8080'
          },
          {
            id: 'service_targetport',
            label: 'Service targetPort',
            hint: 'Must match container port',
            correctValue: '3000',
            validationPattern: '3000|8080|4000'
          },
          {
            id: 'service_type',
            label: 'Service type',
            hint: 'Internal or external?',
            correctValue: 'ClusterIP',
            validationPattern: 'ClusterIP|LoadBalancer|NodePort'
          }
        ],
        solution: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: node:18-alpine
        command: ["node", "server.js"]
        ports:
        - containerPort: 3000
        env:
        - name: PORT
          value: "3000"

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP`,
        explanation: 'Deployments use apps/v1 API. Selector matchLabels must match template labels exactly. Service selector must match pod labels. Service port (external) can differ from targetPort (container), enabling flexibility. ClusterIP for internal services, LoadBalancer for external.'
      },
      {
        exerciseNumber: 2,
        scenario: 'You deployed an application but `kubectl get pods` shows ImagePullBackOff. Debug and fix the issue.',
        template: `Current deployment:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
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
      - name: myapp
        image: myregistry.com/myapp:v1.0.0
        ports:
        - containerPort: 8080

Problem: Pods show ImagePullBackOff

Debug commands to run:
1. ___________
2. ___________

Likely causes:
1. ___________
2. ___________
3. ___________

Solutions:
1. If image doesn't exist: ___________
2. If image is private: ___________
3. If image tag is wrong: ___________`,
        blanks: [
          {
            id: 'debug_command_1',
            label: 'First debug command',
            hint: 'Get detailed pod information',
            correctValue: 'kubectl describe pod <pod-name>',
            validationPattern: 'kubectl.*describe.*pod'
          },
          {
            id: 'debug_command_2',
            label: 'Second debug command',
            hint: 'Check pod events and status',
            correctValue: 'kubectl get events --sort-by=.metadata.creationTimestamp',
            validationPattern: 'kubectl.*(get.*events|logs)'
          },
          {
            id: 'cause_1',
            label: 'Likely cause 1',
            hint: 'Most common ImagePullBackOff reason',
            correctValue: 'Image doesn\'t exist or tag is wrong (typo in image name or tag)',
            validationPattern: 'image.*doesn.*t.*exist|wrong.*tag|typo|not.*found'
          },
          {
            id: 'cause_2',
            label: 'Likely cause 2',
            hint: 'Authentication issue',
            correctValue: 'Image is in private registry and no credentials provided',
            validationPattern: 'private.*registry|credentials|authentication|secret'
          },
          {
            id: 'cause_3',
            label: 'Likely cause 3',
            hint: 'Network or registry issue',
            correctValue: 'Registry is unreachable or network issues',
            validationPattern: 'registry.*unreachable|network|timeout|dns'
          },
          {
            id: 'solution_no_image',
            label: 'Solution if image doesn\'t exist',
            hint: 'How to fix image reference',
            correctValue: 'Verify image exists, fix image name/tag, rebuild and push image, update deployment',
            validationPattern: 'verify.*image|fix.*tag|push.*image|build|update.*deployment'
          },
          {
            id: 'solution_private',
            label: 'Solution if image is private',
            hint: 'How to authenticate to private registry',
            correctValue: 'Create imagePullSecret with registry credentials, reference in deployment spec.imagePullSecrets',
            validationPattern: 'imagePullSecret|secret|credentials|registry.*auth'
          },
          {
            id: 'solution_wrong_tag',
            label: 'Solution if tag is wrong',
            hint: 'How to fix tag',
            correctValue: 'Update image tag in deployment (kubectl set image or edit YAML), verify tag exists in registry',
            validationPattern: 'update.*tag|set.*image|edit.*yaml|correct.*tag'
          }
        ],
        solution: `Debug commands to run:
1. kubectl describe pod <pod-name>
   (Shows events: "Failed to pull image", "Back-off pulling image")
2. kubectl get events --sort-by=.metadata.creationTimestamp
   (Shows recent cluster events with image pull errors)

Likely causes:
1. Image doesn't exist or tag is wrong (typo in image name or tag)
2. Image is in private registry and no credentials provided
3. Registry is unreachable or network issues

Solutions:
1. If image doesn't exist: Verify image exists, fix image name/tag, rebuild and push image, update deployment
2. If image is private: Create imagePullSecret with registry credentials, reference in deployment spec.imagePullSecrets:
   kubectl create secret docker-registry regcred \\
     --docker-server=myregistry.com \\
     --docker-username=user \\
     --docker-password=pass
   # Add to deployment:
   spec:
     imagePullSecrets:
     - name: regcred
3. If image tag is wrong: Update image tag (kubectl set image deployment/myapp myapp=myregistry.com/myapp:v1.0.1)`,
        explanation: 'ImagePullBackOff means Kubernetes can\'t pull the container image. Common causes: wrong image name/tag, private registry without credentials, network issues. Use kubectl describe pod to see exact error. For private registries, create imagePullSecret and reference it in pod spec.'
      },
      {
        exerciseNumber: 3,
        scenario: 'Scale a deployment manually and with HorizontalPodAutoscaler. Complete the configurations.',
        template: `# Manual scaling:
Command to scale to 5 replicas: ___________
Command to check scaling status: ___________

# Declarative scaling (edit YAML):
spec:
  replicas: ___________

# HorizontalPodAutoscaler (HPA):
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: ___________
    name: api-deployment
  minReplicas: ___________
  maxReplicas: ___________
  metrics:
  - type: Resource
    resource:
      name: ___________
      target:
        type: Utilization
        averageUtilization: ___________

When HPA will scale:
- Scale up when: ___________
- Scale down when: ___________
- Maximum pods: ___________`,
        blanks: [
          {
            id: 'scale_command',
            label: 'Scale command',
            hint: 'kubectl command to change replicas',
            correctValue: 'kubectl scale deployment api-deployment --replicas=5',
            validationPattern: 'kubectl.*scale.*deployment.*replicas.*=.*5'
          },
          {
            id: 'check_status',
            label: 'Check status command',
            hint: 'See current deployment status',
            correctValue: 'kubectl get deployment api-deployment',
            validationPattern: 'kubectl.*get.*deployment'
          },
          {
            id: 'yaml_replicas',
            label: 'YAML replicas value',
            hint: 'Desired replica count',
            correctValue: '5',
            validationPattern: '5'
          },
          {
            id: 'hpa_kind',
            label: 'HPA scaleTargetRef kind',
            hint: 'What resource type does HPA scale?',
            correctValue: 'Deployment',
            validationPattern: 'Deployment'
          },
          {
            id: 'min_replicas',
            label: 'HPA minReplicas',
            hint: 'Minimum pods to maintain',
            correctValue: '2',
            validationPattern: '2|3'
          },
          {
            id: 'max_replicas',
            label: 'HPA maxReplicas',
            hint: 'Maximum pods allowed',
            correctValue: '10',
            validationPattern: '10|8|12|15'
          },
          {
            id: 'metric_name',
            label: 'Metric to scale on',
            hint: 'Common resource metric',
            correctValue: 'cpu',
            validationPattern: 'cpu|memory'
          },
          {
            id: 'target_utilization',
            label: 'Target utilization percentage',
            hint: 'Threshold to trigger scaling',
            correctValue: '70',
            validationPattern: '70|80|50|60'
          },
          {
            id: 'scale_up_condition',
            label: 'When HPA scales up',
            hint: 'Condition for adding pods',
            correctValue: 'CPU utilization exceeds 70% average across pods',
            validationPattern: 'cpu.*exceed|above.*70|utilization.*high'
          },
          {
            id: 'scale_down_condition',
            label: 'When HPA scales down',
            hint: 'Condition for removing pods',
            correctValue: 'CPU utilization falls below 70% average across pods',
            validationPattern: 'cpu.*below|under.*70|utilization.*low'
          },
          {
            id: 'max_pods',
            label: 'Maximum pods HPA will create',
            hint: 'From maxReplicas',
            correctValue: '10',
            validationPattern: '10|8|12|15'
          }
        ],
        solution: `# Manual scaling:
Command to scale to 5 replicas: kubectl scale deployment api-deployment --replicas=5
Command to check scaling status: kubectl get deployment api-deployment

# Declarative scaling (edit YAML):
spec:
  replicas: 5

# HorizontalPodAutoscaler (HPA):
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70

When HPA will scale:
- Scale up when: CPU utilization exceeds 70% average across pods
- Scale down when: CPU utilization falls below 70% average across pods
- Maximum pods: 10`,
        explanation: 'Manual scaling with kubectl scale or editing replicas in YAML is static. HPA provides automatic scaling based on metrics (CPU, memory, custom). HPA continuously monitors metrics and adjusts replicas between min and max to maintain target utilization. Requires metrics-server installed in cluster.'
      },
      {
        exerciseNumber: 4,
        scenario: 'A Service is not routing traffic to pods. Diagnose and fix the configuration.',
        template: `Deployment:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: website
      tier: frontend
  template:
    metadata:
      labels:
        app: website
        tier: frontend
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80

Service (NOT WORKING):
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP

Debug commands:
1. ___________
2. ___________

Problems found:
1. Service selector: ___________
2. Service targetPort: ___________

Fixed Service:
spec:
  selector:
    ___________: ___________
  ports:
  - protocol: TCP
    port: 80
    targetPort: ___________`,
        blanks: [
          {
            id: 'debug_endpoints',
            label: 'Command to check endpoints',
            hint: 'See which pods Service is routing to',
            correctValue: 'kubectl get endpoints web-service',
            validationPattern: 'kubectl.*get.*endpoints'
          },
          {
            id: 'debug_service_describe',
            label: 'Command to describe Service',
            hint: 'Get detailed Service information',
            correctValue: 'kubectl describe service web-service',
            validationPattern: 'kubectl.*describe.*service'
          },
          {
            id: 'selector_problem',
            label: 'Problem with selector',
            hint: 'Compare Service selector to pod labels',
            correctValue: 'Selector "app: web" doesn\'t match pod label "app: website" - no endpoints',
            validationPattern: 'doesn.*t.*match|wrong.*label|mismatch|web.*website'
          },
          {
            id: 'targetport_problem',
            label: 'Problem with targetPort',
            hint: 'Compare targetPort to container port',
            correctValue: 'targetPort 8080 doesn\'t match container port 80',
            validationPattern: 'doesn.*t.*match|wrong.*port|8080.*80|mismatch'
          },
          {
            id: 'fixed_selector_key',
            label: 'Fixed selector key',
            hint: 'What label to use?',
            correctValue: 'app',
            validationPattern: 'app'
          },
          {
            id: 'fixed_selector_value',
            label: 'Fixed selector value',
            hint: 'Must match pod labels',
            correctValue: 'website',
            validationPattern: 'website'
          },
          {
            id: 'fixed_targetport',
            label: 'Fixed targetPort',
            hint: 'Must match container port',
            correctValue: '80',
            validationPattern: '80'
          }
        ],
        solution: `Debug commands:
1. kubectl get endpoints web-service
   (Shows no endpoints - Service isn't finding pods)
2. kubectl describe service web-service
   (Shows selector and confirms no endpoints)

Problems found:
1. Service selector: "app: web" doesn't match pod label "app: website" - Service has no endpoints
2. Service targetPort: 8080 doesn't match container port 80 - traffic would go to wrong port

Fixed Service:
spec:
  selector:
    app: website
    # Can also match tier: frontend for more specificity
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80`,
        explanation: 'Service selector must exactly match pod labels. If selector doesn\'t match, Service has no endpoints (no pods to route to). Use kubectl get endpoints to verify Service found pods. targetPort must match the actual container port. Service port (external) can differ from targetPort (internal).'
      },
      {
        exerciseNumber: 5,
        scenario: 'Perform a rolling update and rollback. Complete the workflow.',
        template: `Initial deployment:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 4
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: api:v1.0
        ports:
        - containerPort: 3000

Update workflow:
1. Update to v2.0: ___________
2. Watch rollout: ___________
3. Check rollout history: ___________
4. Verify new version: ___________

Rollback workflow:
1. Undo last rollout: ___________
2. Watch rollback: ___________
3. Verify old version restored: ___________

Rolling update strategy (add to deployment):
spec:
  strategy:
    type: ___________
    rollingUpdate:
      maxSurge: ___________
      maxUnavailable: ___________

What these settings mean:
- maxSurge: ___________
- maxUnavailable: ___________`,
        blanks: [
          {
            id: 'update_command',
            label: 'Update image command',
            hint: 'kubectl command to change image',
            correctValue: 'kubectl set image deployment/api api=api:v2.0',
            validationPattern: 'kubectl.*set.*image.*deployment.*api.*v2'
          },
          {
            id: 'watch_rollout',
            label: 'Watch rollout command',
            hint: 'Monitor rollout progress',
            correctValue: 'kubectl rollout status deployment/api',
            validationPattern: 'kubectl.*rollout.*status'
          },
          {
            id: 'rollout_history',
            label: 'Rollout history command',
            hint: 'See revision history',
            correctValue: 'kubectl rollout history deployment/api',
            validationPattern: 'kubectl.*rollout.*history'
          },
          {
            id: 'verify_version',
            label: 'Verify version command',
            hint: 'Check which image is running',
            correctValue: 'kubectl describe deployment api | grep Image',
            validationPattern: 'kubectl.*(describe.*deployment|get.*pod.*yaml).*image'
          },
          {
            id: 'undo_command',
            label: 'Rollback command',
            hint: 'Undo last rollout',
            correctValue: 'kubectl rollout undo deployment/api',
            validationPattern: 'kubectl.*rollout.*undo'
          },
          {
            id: 'watch_rollback',
            label: 'Watch rollback command',
            hint: 'Monitor rollback progress',
            correctValue: 'kubectl rollout status deployment/api',
            validationPattern: 'kubectl.*rollout.*status'
          },
          {
            id: 'verify_rollback',
            label: 'Verify rollback command',
            hint: 'Confirm old version restored',
            correctValue: 'kubectl describe deployment api | grep Image',
            validationPattern: 'kubectl.*(describe.*deployment|get.*pod.*yaml).*image'
          },
          {
            id: 'strategy_type',
            label: 'Update strategy type',
            hint: 'Type for zero-downtime updates',
            correctValue: 'RollingUpdate',
            validationPattern: 'RollingUpdate'
          },
          {
            id: 'max_surge',
            label: 'maxSurge value',
            hint: 'How many extra pods during update?',
            correctValue: '1',
            validationPattern: '1|25%'
          },
          {
            id: 'max_unavailable',
            label: 'maxUnavailable value',
            hint: 'How many pods can be down during update?',
            correctValue: '0',
            validationPattern: '0|1'
          },
          {
            id: 'max_surge_meaning',
            label: 'maxSurge meaning',
            hint: 'What does this control?',
            correctValue: 'Maximum number of pods that can be created above desired replicas during update',
            validationPattern: 'extra.*pod|above.*desired|additional.*pod|create.*during'
          },
          {
            id: 'max_unavailable_meaning',
            label: 'maxUnavailable meaning',
            hint: 'What does this control?',
            correctValue: 'Maximum number of pods that can be unavailable during update',
            validationPattern: 'unavailable|down|not.*ready|below.*desired'
          }
        ],
        solution: `Update workflow:
1. Update to v2.0: kubectl set image deployment/api api=api:v2.0
2. Watch rollout: kubectl rollout status deployment/api
3. Check rollout history: kubectl rollout history deployment/api
4. Verify new version: kubectl describe deployment api | grep Image

Rollback workflow:
1. Undo last rollout: kubectl rollout undo deployment/api
2. Watch rollback: kubectl rollout status deployment/api
3. Verify old version restored: kubectl describe deployment api | grep Image

Rolling update strategy:
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0

What these settings mean:
- maxSurge: Maximum number of pods that can be created above desired replicas during update (e.g., if replicas=4 and maxSurge=1, can have 5 pods during update)
- maxUnavailable: Maximum number of pods that can be unavailable during update (0 means all pods must be available throughout update - true zero downtime)`,
        explanation: 'Rolling updates enable zero-downtime deployments by gradually replacing pods. maxSurge controls how many extra pods can exist during update. maxUnavailable controls how many pods can be down. Setting maxUnavailable=0 ensures all pods remain available throughout update. Rollback with kubectl rollout undo reverts to previous revision.'
      }
    ],
    hints: [
      'Deployment selector.matchLabels must exactly match template.labels',
      'Service selector must match pod labels - check with kubectl get endpoints',
      'Use kubectl describe pod to see detailed error messages and events',
      'targetPort must match the actual container port, not the Service port',
      'Rolling updates are gradual - watch with kubectl rollout status'
    ]
  },
  runGuided: {
    objective: 'Deploy a complete multi-tier application to Kubernetes with proper networking, configuration, and operational practices.',
    conceptualGuidance: [
      'Application Architecture: 3 tiers (frontend, API, database) with appropriate K8s objects for each',
      'Networking: Services for internal communication (ClusterIP) and external access (LoadBalancer/Ingress)',
      'Configuration: ConfigMaps for non-sensitive settings, Secrets for passwords/keys, environment variables',
      'Resource Management: Resource requests/limits to ensure scheduling and prevent resource starvation',
      'High Availability: Multiple replicas, readiness/liveness probes, rolling update strategy'
    ],
    keyConceptsToApply: [
      'Deployments for stateless tiers (frontend, API) with 3+ replicas',
      'StatefulSet for database (or use managed database like RDS)',
      'ClusterIP Services for internal communication (frontend→API, API→database)',
      'LoadBalancer Service or Ingress for external access to frontend',
      'ConfigMaps for application settings (API URLs, feature flags)',
      'Secrets for sensitive data (database password, API keys)',
      'PersistentVolumeClaim for database storage',
      'Readiness probes to ensure traffic only goes to ready pods',
      'Resource requests (CPU, memory) for proper scheduling'
    ],
    checkpoints: [
      {
        checkpoint: 'Application architecture designed and manifests created',
        description: 'Design 3-tier architecture: frontend (React/nginx), API (Node.js/Python), database (PostgreSQL/MySQL). Create Deployment manifests for frontend and API, StatefulSet for database. Define resource requests/limits.',
        validationCriteria: [
          'Frontend Deployment: nginx or similar, 3 replicas, resource requests defined, readiness probe on HTTP endpoint',
          'API Deployment: Node.js/Python/Go, 3 replicas, resource requests, readiness probe on /health endpoint',
          'Database: StatefulSet with PersistentVolumeClaim for data persistence, 1 replica (or use managed DB like RDS)',
          'All manifests have proper labels for Service selectors',
          'Resource requests set (e.g., cpu: 100m, memory: 128Mi)'
        ],
        hintIfStuck: 'Start with frontend: Deployment with nginx image, 3 replicas, containerPort 80, resources, readiness probe (httpGet /index.html). API: similar but with your API image and port. Database: StatefulSet with PVC for persistent storage.'
      },
      {
        checkpoint: 'Networking configured and services accessible',
        description: 'Create Services for each tier. Frontend: LoadBalancer or Ingress for external access. API: ClusterIP for frontend to reach. Database: ClusterIP for API to reach. Verify connectivity between tiers.',
        validationCriteria: [
          'Frontend Service: type LoadBalancer (or Ingress controller), exposes port 80/443',
          'API Service: type ClusterIP, stable DNS name (api-service.default.svc.cluster.local)',
          'Database Service: type ClusterIP, only accessible within cluster',
          'Frontend can reach API via Service DNS name',
          'API can reach database via Service DNS name',
          'External users can reach frontend via LoadBalancer IP or Ingress'
        ],
        hintIfStuck: 'Services use selectors matching pod labels. Frontend Service: type LoadBalancer, selector app=frontend. API Service: type ClusterIP, selector app=api. Test with kubectl run test-pod -- curl api-service to verify internal connectivity.'
      },
      {
        checkpoint: 'Configuration and operational readiness',
        description: 'Externalize configuration with ConfigMaps and Secrets. Implement health checks. Perform rolling update and rollback. Document kubectl commands for common operations.',
        validationCriteria: [
          'ConfigMap created with API URL and other non-sensitive config, mounted in frontend/API pods',
          'Secret created with database password, mounted in API pod as environment variable',
          'Readiness probes defined for frontend and API (HTTP GET on health endpoints)',
          'Liveness probes defined (restart unhealthy pods)',
          'Rolling update performed successfully (change image tag, watch rollout)',
          'Rollback tested (undo deployment)',
          'Runbook documented: deploy, scale, update, rollback, get logs, troubleshoot pod crash'
        ],
        hintIfStuck: 'Create ConfigMap: kubectl create configmap app-config --from-literal=API_URL=http://api-service. Create Secret: kubectl create secret generic db-secret --from-literal=DB_PASSWORD=secret123. Mount in deployment with env.valueFrom.configMapKeyRef and secretKeyRef. Add readinessProbe httpGet to containers.'
      }
    ],
    resourcesAllowed: [
      'Kubernetes documentation for Deployments, Services, ConfigMaps',
      'kubectl reference documentation',
      'Sample multi-tier application manifests',
      'Health check probe examples',
      'Resource requests/limits best practices'
    ]
  },
  runIndependent: {
    objective: 'Independently design, deploy, and operate a production-ready multi-tier application on Kubernetes with complete configuration, networking, monitoring, and operational documentation.',
    successCriteria: [
      'Complete 3-tier application deployed (frontend, API, database)',
      'High availability: 3+ replicas for stateless tiers, distributed across nodes (anti-affinity preferred)',
      'Networking: ClusterIP for internal, LoadBalancer/Ingress for external, all services reachable',
      'Configuration: ConfigMaps for settings, Secrets for passwords (consider external secrets management)',
      'Resource management: Requests and limits set for all containers, no resource starvation',
      'Health checks: Readiness and liveness probes for all deployments',
      'Storage: PersistentVolumeClaims for stateful data with appropriate storage class',
      'Rolling updates: Tested with zero downtime (maxUnavailable=0)',
      'Operational readiness: Runbook with deploy/scale/update/rollback/troubleshoot procedures',
      'Monitoring: Pod logs accessible, basic metrics (CPU, memory) tracked'
    ],
    timeTarget: 180,
    minimumRequirements: [
      'YAML manifests for all components: Deployments (frontend, API), StatefulSet (database), Services, ConfigMaps, Secrets, PVCs',
      'Frontend accessible externally via LoadBalancer or Ingress',
      'API reachable from frontend via ClusterIP Service DNS',
      'Database reachable from API via ClusterIP Service DNS',
      'ConfigMap with at least 3 configuration values',
      'Secret with at least 1 sensitive value (database password)',
      'Readiness probe on HTTP endpoint for frontend and API',
      'Resource requests and limits for all containers',
      'Rolling update demonstrated with image tag change',
      'Rollback tested and documented',
      'Runbook with kubectl commands for 5+ operations'
    ],
    evaluationRubric: [
      {
        criterion: 'Architecture and Design',
        weight: 20,
        passingThreshold: '3-tier architecture with appropriate K8s objects (Deployments for stateless, StatefulSet for database), proper separation of concerns, labels used consistently for Service selectors'
      },
      {
        criterion: 'High Availability',
        weight: 15,
        passingThreshold: 'Stateless tiers have 3+ replicas, readiness/liveness probes configured, rolling update strategy with maxUnavailable=0 or 1, resource requests ensure proper scheduling'
      },
      {
        criterion: 'Networking Configuration',
        weight: 15,
        passingThreshold: 'Services configured correctly (ClusterIP for internal, LoadBalancer/Ingress for external), all tiers can communicate, external access works, DNS resolution verified'
      },
      {
        criterion: 'Configuration Management',
        weight: 15,
        passingThreshold: 'ConfigMaps used for non-sensitive config, Secrets for passwords/keys, configuration injected as env vars or volume mounts, no hardcoded values in manifests'
      },
      {
        criterion: 'Resource Management',
        weight: 10,
        passingThreshold: 'Resource requests and limits set for all containers, appropriate values (not too high or too low), prevents resource starvation and ensures scheduling'
      },
      {
        criterion: 'Storage and Persistence',
        weight: 10,
        passingThreshold: 'Database uses PersistentVolumeClaim with appropriate storage class and size, data persists across pod restarts'
      },
      {
        criterion: 'Operational Readiness',
        weight: 15,
        passingThreshold: 'Runbook documented with deploy/scale/update/rollback/logs/troubleshoot procedures, rolling update and rollback tested and working, health checks functional, logs accessible'
      }
    ]
  },
  videoUrl: 'https://www.youtube.com/watch?v=X48VuDVv0do',
  documentation: [
    'https://kubernetes.io/docs/reference/kubectl/quick-reference/',
    'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/',
    'https://kubernetes.io/docs/concepts/services-networking/service/',
    'https://kubernetes.io/docs/concepts/configuration/configmap/',
    'https://kubernetes.io/docs/concepts/configuration/secret/',
    'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/'
  ],
  relatedConcepts: ['Docker containers', 'YAML syntax', 'Networking basics', 'Load balancing', 'High availability patterns']
};
