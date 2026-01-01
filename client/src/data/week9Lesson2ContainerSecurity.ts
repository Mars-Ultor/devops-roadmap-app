/**
 * Week 9 Lesson 2 - Container & Application Security
 * 4-Level Mastery Progression: Container hardening, secrets management, application security testing
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week9Lesson2ContainerSecurity: LeveledLessonContent = {
  lessonId: 'week9-lesson2-container-security',
  
  baseLesson: {
    title: 'Container & Application Security',
    description: 'Master container security practices including image scanning, runtime security, secrets management, and application-level security controls.',
    learningObjectives: [
      'Scan and harden container images',
      'Implement secure secrets management (Vault, External Secrets)',
      'Configure Kubernetes security contexts and Pod Security Standards',
      'Perform DAST (Dynamic Application Security Testing)',
      'Implement runtime security monitoring with Falco'
    ],
    prerequisites: [
      'Docker and container fundamentals',
      'Kubernetes basics',
      'Understanding of CI/CD pipelines'
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 30,
      runGuided: 25,
      runIndependent: 20
    }
  },

  crawl: {
    introduction: 'Learn container and application security step-by-step. You will scan images, manage secrets securely, and implement security controls.',
    expectedOutcome: 'Complete understanding of container security: image scanning with Trivy, multi-stage builds, Pod Security Standards, External Secrets Operator, Falco runtime monitoring, and zero-trust networking',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Scan container image for vulnerabilities',
        command: 'docker pull nginx:latest && trivy image nginx:latest --severity HIGH,CRITICAL',
        explanation: 'Trivy scans container images for OS and application vulnerabilities. Always scan before deploying to production.',
        expectedOutput: 'List of vulnerabilities with CVE numbers and severity',
        validationCriteria: [
          'Vulnerabilities listed by severity',
          'CVE identifiers shown',
          'Affected packages identified'
        ],
        commonMistakes: ['Using :latest tag', 'Not pinning base image versions']
      },
      {
        stepNumber: 2,
        instruction: 'Build minimal container image using multi-stage build',
        command: 'cat <<EOF > Dockerfile\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:18-alpine\nRUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001\nWORKDIR /app\nCOPY --from=builder --chown=nodejs:nodejs /app/dist ./dist\nCOPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules\nUSER nodejs\nEXPOSE 3000\nCMD ["node", "dist/index.js"]\nEOF\ndocker build -t myapp:secure .',
        explanation: 'Multi-stage builds reduce image size and attack surface. Alpine base image is minimal. Non-root user improves security.',
        expectedOutput: 'Docker image built successfully',
        validationCriteria: [
          'Image uses Alpine (small size)',
          'Non-root user created',
          'Only production dependencies included'
        ],
        commonMistakes: ['Including build tools in final image', 'Running as root user']
      },
      {
        stepNumber: 3,
        instruction: 'Configure Kubernetes Pod Security Context',
        command: 'kubectl apply -f - <<EOF\napiVersion: v1\nkind: Pod\nmetadata:\n  name: secure-pod\nspec:\n  securityContext:\n    runAsNonRoot: true\n    runAsUser: 1001\n    fsGroup: 1001\n    seccompProfile:\n      type: RuntimeDefault\n  containers:\n  - name: app\n    image: myapp:secure\n    securityContext:\n      allowPrivilegeEscalation: false\n      readOnlyRootFilesystem: true\n      capabilities:\n        drop:\n        - ALL\n    volumeMounts:\n    - name: tmp\n      mountPath: /tmp\n  volumes:\n  - name: tmp\n    emptyDir: {}\nEOF',
        explanation: 'Security context enforces: non-root user, read-only filesystem, dropped capabilities, seccomp profile. These prevent container breakout.',
        expectedOutput: 'Pod created with security restrictions',
        validationCriteria: [
          'Pod runs as non-root',
          'Root filesystem is read-only',
          'All capabilities dropped'
        ],
        commonMistakes: ['Not mounting /tmp as writable', 'Allowing privilege escalation']
      },
      {
        stepNumber: 4,
        instruction: 'Set up External Secrets Operator for Kubernetes',
        command: 'helm repo add external-secrets https://charts.external-secrets.io && helm install external-secrets external-secrets/external-secrets -n external-secrets-system --create-namespace',
        explanation: 'External Secrets Operator syncs secrets from external stores (AWS Secrets Manager, Vault) into Kubernetes. Secrets never in code.',
        expectedOutput: 'External Secrets Operator installed',
        validationCriteria: [
          'Operator pods running',
          'CRDs installed',
          'Ready to sync secrets'
        ],
        commonMistakes: ['Storing secrets in Git', 'Hardcoding credentials in manifests']
      },
      {
        stepNumber: 5,
        instruction: 'Create ExternalSecret to sync from AWS Secrets Manager',
        command: 'kubectl apply -f - <<EOF\napiVersion: external-secrets.io/v1beta1\nkind: SecretStore\nmetadata:\n  name: aws-secretstore\nspec:\n  provider:\n    aws:\n      service: SecretsManager\n      region: us-east-1\n      auth:\n        jwt:\n          serviceAccountRef:\n            name: external-secrets\n---\napiVersion: external-secrets.io/v1beta1\nkind: ExternalSecret\nmetadata:\n  name: app-secrets\nspec:\n  refreshInterval: 1h\n  secretStoreRef:\n    name: aws-secretstore\n    kind: SecretStore\n  target:\n    name: app-secrets\n  data:\n  - secretKey: database-password\n    remoteRef:\n      key: prod/database\n      property: password\nEOF',
        explanation: 'ExternalSecret syncs AWS Secrets Manager into Kubernetes Secret. Secrets rotate automatically.',
        expectedOutput: 'Secret synchronized from AWS',
        validationCriteria: [
          'SecretStore configured',
          'ExternalSecret created',
          'Kubernetes Secret populated'
        ],
        commonMistakes: ['Not configuring IRSA for authentication', 'Hardcoding secret ARNs']
      },
      {
        stepNumber: 6,
        instruction: 'Scan application for vulnerabilities with DAST',
        command: 'docker run -t owasp/zap2docker-stable zap-baseline.py -t https://myapp.example.com',
        explanation: 'OWASP ZAP performs dynamic application security testing by actually making HTTP requests. Finds runtime issues like XSS, injection.',
        expectedOutput: 'DAST scan report with found vulnerabilities',
        validationCriteria: [
          'Scan completes successfully',
          'Vulnerabilities categorized by risk',
          'Recommendations provided'
        ],
        commonMistakes: ['Only running SAST, not DAST', 'Not testing authenticated pages']
      },
      {
        stepNumber: 7,
        instruction: 'Implement Content Security Policy (CSP)',
        command: 'cat <<EOF > csp-middleware.js\nconst helmet = require("helmet");\n\napp.use(\n  helmet.contentSecurityPolicy({\n    directives: {\n      defaultSrc: ["\'self\'"],\n      scriptSrc: ["\'self\'", "\'unsafe-inline\'", "cdn.example.com"],\n      styleSrc: ["\'self\'", "\'unsafe-inline\'"],\n      imgSrc: ["\'self\'", "data:", "https:"],\n      connectSrc: ["\'self\'", "api.example.com"],\n      fontSrc: ["\'self\'", "fonts.gstatic.com"],\n      objectSrc: ["\'none\'"],\n      upgradeInsecureRequests: [],\n    },\n  })\n);\nEOF',
        explanation: 'CSP prevents XSS by whitelisting allowed sources for scripts, styles, images. Report-only mode helps test before enforcing.',
        expectedOutput: 'CSP middleware configured',
        validationCriteria: [
          'CSP header sent',
          'Script sources restricted',
          'Inline scripts controlled'
        ],
        commonMistakes: ['Using unsafe-eval', 'Allowing * sources']
      },
      {
        stepNumber: 8,
        instruction: 'Deploy runtime security monitoring with Falco',
        command: 'helm repo add falcosecurity https://falcosecurity.github.io/charts && helm install falco falcosecurity/falco --namespace falco --create-namespace --set falco.grpc.enabled=true',
        explanation: 'Falco monitors kernel events to detect suspicious behavior: shell in container, privilege escalation, unexpected network connections.',
        expectedOutput: 'Falco installed and monitoring',
        validationCriteria: [
          'Falco DaemonSet running',
          'Rules loaded',
          'Events being logged'
        ],
        commonMistakes: ['Not routing alerts to SIEM', 'Ignoring Falco warnings']
      },
      {
        stepNumber: 9,
        instruction: 'Create custom Falco rule to detect cryptocurrency mining',
        command: 'kubectl apply -f - <<EOF\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: falco-custom-rules\n  namespace: falco\ndata:\n  custom-rules.yaml: |\n    - rule: Detect Crypto Mining\n      desc: Detects cryptocurrency mining processes\n      condition: >\n        spawned_process and\n        (proc.name in (xmrig, ethminer, cpuminer) or\n         proc.cmdline contains "stratum+tcp")\n      output: "Crypto mining detected (user=%user.name command=%proc.cmdline)"\n      priority: WARNING\nEOF',
        explanation: 'Custom rules extend Falco to detect specific threats. Crypto mining is common in compromised containers.',
        expectedOutput: 'Custom rule loaded',
        validationCriteria: [
          'ConfigMap created',
          'Rule active',
          'Alerts on mining processes'
        ],
        commonMistakes: ['Not testing rules', 'Alert fatigue from noisy rules']
      },
      {
        stepNumber: 10,
        instruction: 'Implement network policies for pod isolation',
        command: 'kubectl apply -f - <<EOF\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: api-netpol\nspec:\n  podSelector:\n    matchLabels:\n      app: api\n  policyTypes:\n  - Ingress\n  - Egress\n  ingress:\n  - from:\n    - podSelector:\n        matchLabels:\n          app: frontend\n    ports:\n    - protocol: TCP\n      port: 8080\n  egress:\n  - to:\n    - podSelector:\n        matchLabels:\n          app: database\n    ports:\n    - protocol: TCP\n      port: 5432\n  - to:\n    - namespaceSelector:\n        matchLabels:\n          name: kube-system\n    ports:\n    - protocol: UDP\n      port: 53\nEOF',
        explanation: 'Network policies enforce zero-trust: pods can only communicate with explicitly allowed services. Default deny everything.',
        expectedOutput: 'Network policy applied',
        validationCriteria: [
          'Policy restricts ingress to frontend',
          'Egress limited to database and DNS',
          'Unauthorized connections blocked'
        ],
        commonMistakes: ['Not allowing DNS', 'Forgetting health check endpoints']
      },
      {
        stepNumber: 11,
        instruction: 'Sign container images with Cosign',
        command: 'cosign generate-key-pair && cosign sign --key cosign.key myapp:v1.0.0',
        explanation: 'Image signing proves authenticity and integrity. Kubernetes can verify signatures before running containers.',
        expectedOutput: 'Image signed successfully',
        validationCriteria: [
          'Key pair generated',
          'Image signature created',
          'Signature verifiable'
        ],
        commonMistakes: ['Not protecting private key', 'Signing unsigned base images']
      },
      {
        stepNumber: 12,
        instruction: 'Verify signed images with Kyverno policy',
        command: 'kubectl apply -f - <<EOF\napiVersion: kyverno.io/v1\nkind: ClusterPolicy\nmetadata:\n  name: verify-image-signature\nspec:\n  validationFailureAction: enforce\n  rules:\n  - name: verify-signature\n    match:\n      any:\n      - resources:\n          kinds:\n          - Pod\n    verifyImages:\n    - imageReferences:\n      - "myregistry.io/*"\n      attestors:\n      - count: 1\n        entries:\n        - keys:\n            publicKeys: |-\n              -----BEGIN PUBLIC KEY-----\n              <your-public-key>\n              -----END PUBLIC KEY-----\nEOF',
        explanation: 'Kyverno policy blocks unsigned/tampered images. Only images signed by trusted keys can run.',
        expectedOutput: 'Policy enforcing image signatures',
        validationCriteria: [
          'Policy active',
          'Unsigned images rejected',
          'Signed images allowed'
        ],
        commonMistakes: ['Not testing with valid signatures first', 'Public key mismatch']
      }
    ]
  },

  walk: {
    introduction: 'Apply container and application security through hands-on exercises.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Build secure multi-stage Docker image with vulnerability scanning.',
        template: 'Dockerfile:\n\nFROM __NODE:18-ALPINE__ AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=__PRODUCTION__\nCOPY . .\nRUN npm run build\n\nFROM node:18-alpine\nRUN addgroup -g __1001__ -S nodejs && adduser -S nodejs -u 1001\nWORKDIR /app\nCOPY --from=builder --chown=__NODEJS:NODEJS__ /app/dist ./dist\nCOPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules\nUSER __NODEJS__\nEXPOSE 3000\nCMD ["node", "dist/index.js"]\n\nBuild and scan:\ndocker build -t myapp:secure .\n__TRIVY__ image myapp:secure --severity __CRITICAL,HIGH__ --exit-code 1',
        blanks: [
          {
            id: 'NODE:18-ALPINE',
            label: 'NODE:18-ALPINE',
            hint: 'Minimal Node.js base image',
            correctValue: 'node:18-alpine',
            validationPattern: 'node.*alpine'
          },
          {
            id: 'PRODUCTION',
            label: 'PRODUCTION',
            hint: 'Install only prod dependencies',
            correctValue: 'production',
            validationPattern: 'production'
          },
          {
            id: '1001',
            label: '1001',
            hint: 'Non-root UID',
            correctValue: '1001',
            validationPattern: '1001'
          },
          {
            id: 'NODEJS:NODEJS',
            label: 'NODEJS:NODEJS',
            hint: 'User and group ownership',
            correctValue: 'nodejs:nodejs',
            validationPattern: 'nodejs.*nodejs'
          },
          {
            id: 'NODEJS',
            label: 'NODEJS',
            hint: 'Non-root user',
            correctValue: 'nodejs',
            validationPattern: 'nodejs'
          },
          {
            id: 'TRIVY',
            label: 'TRIVY',
            hint: 'Container scanner',
            correctValue: 'trivy',
            validationPattern: 'trivy'
          },
          {
            id: 'CRITICAL,HIGH',
            label: 'CRITICAL,HIGH',
            hint: 'Severity levels',
            correctValue: 'CRITICAL,HIGH',
            validationPattern: 'critical.*high|high.*critical'
          }
        ],
        solution: 'Multi-stage build: builder stage has dev dependencies, final image only has production artifacts. Alpine reduces size. Non-root user (nodejs:1001) prevents privilege escalation. Trivy scan fails build if critical/high vulnerabilities found.',
        explanation: 'Secure container images: minimal base, multi-stage build, non-root user, vulnerability scanning'
      },
      {
        exerciseNumber: 2,
        scenario: 'Configure Kubernetes Pod Security Context with all recommended settings.',
        template: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: secure-app\nspec:\n  securityContext:\n    runAsNonRoot: __TRUE__\n    runAsUser: __1001__\n    fsGroup: 1001\n    __SECCOMP_PROFILE__:\n      type: RuntimeDefault\n  containers:\n  - name: app\n    image: myapp:secure\n    securityContext:\n      allowPrivilegeEscalation: __FALSE__\n      readOnlyRootFilesystem: __TRUE__\n      capabilities:\n        __DROP__:\n        - __ALL__\n        add:\n        - NET_BIND_SERVICE\n    volumeMounts:\n    - name: tmp\n      mountPath: __/TMP__\n    - name: cache\n      mountPath: /app/cache\n  volumes:\n  - name: tmp\n    __EMPTY_DIR__: {}\n  - name: cache\n    emptyDir: {}',
        blanks: [
          {
            id: 'TRUE',
            label: 'TRUE',
            hint: 'Enable non-root',
            correctValue: 'true',
            validationPattern: 'true'
          },
          {
            id: '1001',
            label: '1001',
            hint: 'UID for non-root user',
            correctValue: '1001',
            validationPattern: '1001'
          },
          {
            id: 'SECCOMP_PROFILE',
            label: 'SECCOMP_PROFILE',
            hint: 'Syscall filtering',
            correctValue: 'seccompProfile',
            validationPattern: 'seccomp'
          },
          {
            id: 'FALSE',
            label: 'FALSE',
            hint: 'Block privilege escalation',
            correctValue: 'false',
            validationPattern: 'false'
          },
          {
            id: 'TRUE',
            label: 'TRUE',
            hint: 'Read-only root FS',
            correctValue: 'true',
            validationPattern: 'true'
          },
          {
            id: 'DROP',
            label: 'DROP',
            hint: 'Remove capabilities',
            correctValue: 'drop',
            validationPattern: 'drop'
          },
          {
            id: 'ALL',
            label: 'ALL',
            hint: 'Drop all capabilities',
            correctValue: 'ALL',
            validationPattern: 'all'
          },
          {
            id: '/TMP',
            label: '/TMP',
            hint: 'Writable temp directory',
            correctValue: '/tmp',
            validationPattern: '/tmp'
          },
          {
            id: 'EMPTY_DIR',
            label: 'EMPTY_DIR',
            hint: 'Ephemeral volume type',
            correctValue: 'emptyDir',
            validationPattern: 'empty.*dir'
          }
        ],
        solution: 'Security context: runAsNonRoot prevents root, readOnlyRootFilesystem prevents tampering, drop ALL capabilities minimizes attack surface, seccomp filters syscalls. Mount /tmp and /app/cache as emptyDir for writes.',
        explanation: 'Pod Security Standards enforce defense-in-depth at container runtime'
      },
      {
        exerciseNumber: 3,
        scenario: 'Set up External Secrets Operator to sync from AWS Secrets Manager.',
        template: 'Install operator:\nhelm repo add __EXTERNAL_SECRETS__ https://charts.external-secrets.io\nhelm install external-secrets external-secrets/external-secrets -n __EXTERNAL_SECRETS_SYSTEM__ --create-namespace\n\nSecretStore:\napiVersion: external-secrets.io/__V1BETA1__\nkind: __SECRET_STORE__\nmetadata:\n  name: aws-backend\nspec:\n  provider:\n    aws:\n      service: __SECRETS_MANAGER__\n      region: us-east-1\n      auth:\n        jwt:\n          serviceAccountRef:\n            name: external-secrets\n\nExternalSecret:\napiVersion: external-secrets.io/v1beta1\nkind: ExternalSecret\nmetadata:\n  name: database-creds\nspec:\n  refreshInterval: __1H__\n  secretStoreRef:\n    name: aws-backend\n  target:\n    name: __DB_SECRET__\n  data:\n  - secretKey: password\n    remoteRef:\n      key: __PROD/DATABASE__\n      property: password',
        blanks: [
          {
            id: 'EXTERNAL_SECRETS',
            label: 'EXTERNAL_SECRETS',
            hint: 'Helm repo name',
            correctValue: 'external-secrets',
            validationPattern: 'external.*secrets'
          },
          {
            id: 'EXTERNAL_SECRETS_SYSTEM',
            label: 'EXTERNAL_SECRETS_SYSTEM',
            hint: 'Namespace',
            correctValue: 'external-secrets-system',
            validationPattern: 'external.*secrets.*system'
          },
          {
            id: 'V1BETA1',
            label: 'V1BETA1',
            hint: 'API version',
            correctValue: 'v1beta1',
            validationPattern: 'v1beta1'
          },
          {
            id: 'SECRET_STORE',
            label: 'SECRET_STORE',
            hint: 'Resource kind',
            correctValue: 'SecretStore',
            validationPattern: 'secret.*store'
          },
          {
            id: 'SECRETS_MANAGER',
            label: 'SECRETS_MANAGER',
            hint: 'AWS service',
            correctValue: 'SecretsManager',
            validationPattern: 'secrets.*manager'
          },
          {
            id: '1H',
            label: '1H',
            hint: 'Refresh interval',
            correctValue: '1h',
            validationPattern: '1h|hour'
          },
          {
            id: 'DB_SECRET',
            label: 'DB_SECRET',
            hint: 'Target Kubernetes secret name',
            correctValue: 'db-secret',
            validationPattern: 'db.*secret'
          },
          {
            id: 'PROD/DATABASE',
            label: 'PROD/DATABASE',
            hint: 'AWS secret path',
            correctValue: 'prod/database',
            validationPattern: 'prod.*database'
          }
        ],
        solution: 'External Secrets Operator: SecretStore configures AWS Secrets Manager connection. ExternalSecret syncs specific secrets into Kubernetes. Secrets auto-refresh every 1 hour. Never store secrets in Git or container images.',
        explanation: 'External secrets management separates sensitive data from code and configs'
      },
      {
        exerciseNumber: 4,
        scenario: 'Implement network policies for zero-trust pod communication.',
        template: 'Default deny all:\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: __DEFAULT_DENY__\nspec:\n  podSelector: {}\n  policyTypes:\n  - __INGRESS__\n  - __EGRESS__\n\nAllow specific traffic:\napiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: api-policy\nspec:\n  podSelector:\n    matchLabels:\n      app: __API__\n  policyTypes:\n  - Ingress\n  - Egress\n  ingress:\n  - from:\n    - podSelector:\n        matchLabels:\n          app: __FRONTEND__\n    ports:\n    - protocol: __TCP__\n      port: __8080__\n  egress:\n  - to:\n    - podSelector:\n        matchLabels:\n          app: database\n    ports:\n    - protocol: TCP\n      port: __5432__\n  - to:\n    - namespaceSelector:\n        matchLabels:\n          name: kube-system\n    ports:\n    - protocol: __UDP__\n      port: __53__ # DNS',
        blanks: [
          {
            id: 'DEFAULT_DENY',
            label: 'DEFAULT_DENY',
            hint: 'Policy name',
            correctValue: 'default-deny',
            validationPattern: 'default.*deny'
          },
          {
            id: 'INGRESS',
            label: 'INGRESS',
            hint: 'Incoming traffic',
            correctValue: 'Ingress',
            validationPattern: 'ingress'
          },
          {
            id: 'EGRESS',
            label: 'EGRESS',
            hint: 'Outgoing traffic',
            correctValue: 'Egress',
            validationPattern: 'egress'
          },
          {
            id: 'API',
            label: 'API',
            hint: 'Target app label',
            correctValue: 'api',
            validationPattern: 'api'
          },
          {
            id: 'FRONTEND',
            label: 'FRONTEND',
            hint: 'Allowed source',
            correctValue: 'frontend',
            validationPattern: 'frontend'
          },
          {
            id: 'TCP',
            label: 'TCP',
            hint: 'Protocol',
            correctValue: 'TCP',
            validationPattern: 'tcp'
          },
          {
            id: '8080',
            label: '8080',
            hint: 'API port',
            correctValue: '8080',
            validationPattern: '8080'
          },
          {
            id: '5432',
            label: '5432',
            hint: 'PostgreSQL port',
            correctValue: '5432',
            validationPattern: '5432'
          },
          {
            id: 'UDP',
            label: 'UDP',
            hint: 'DNS protocol',
            correctValue: 'UDP',
            validationPattern: 'udp'
          },
          {
            id: '53',
            label: '53',
            hint: 'DNS port',
            correctValue: '53',
            validationPattern: '53'
          }
        ],
        solution: 'Zero-trust network: Default deny all traffic. Explicitly allow: frontend → api:8080, api → database:5432, all → kube-system:53 (DNS). Every pod only communicates with necessary services.',
        explanation: 'Network policies implement micro-segmentation and zero-trust networking'
      },
      {
        exerciseNumber: 5,
        scenario: 'Sign and verify container images with Cosign and Kyverno.',
        template: 'Generate key pair:\ncosign __GENERATE_KEY_PAIR__\n\nSign image:\ncosign sign --key __COSIGN.KEY__ myregistry.io/myapp:v1.0.0\n\nVerify signature:\ncosign verify --key __COSIGN.PUB__ myregistry.io/myapp:v1.0.0\n\nKyverno policy:\napiVersion: kyverno.io/__V1__\nkind: __CLUSTER_POLICY__\nmetadata:\n  name: verify-images\nspec:\n  validationFailureAction: __ENFORCE__\n  rules:\n  - name: check-signature\n    match:\n      any:\n      - resources:\n          kinds:\n          - __POD__\n    verifyImages:\n    - imageReferences:\n      - "myregistry.io/*"\n      attestors:\n      - count: __1__\n        entries:\n        - keys:\n            publicKeys: |-\n              -----BEGIN PUBLIC KEY-----\n              <public-key-content>\n              -----END PUBLIC KEY-----',
        blanks: [
          {
            id: 'GENERATE_KEY_PAIR',
            label: 'GENERATE_KEY_PAIR',
            hint: 'Cosign command',
            correctValue: 'generate-key-pair',
            validationPattern: 'generate.*key'
          },
          {
            id: 'COSIGN.KEY',
            label: 'COSIGN.KEY',
            hint: 'Private key file',
            correctValue: 'cosign.key',
            validationPattern: 'cosign\\.key'
          },
          {
            id: 'COSIGN.PUB',
            label: 'COSIGN.PUB',
            hint: 'Public key file',
            correctValue: 'cosign.pub',
            validationPattern: 'cosign\\.pub'
          },
          {
            id: 'V1',
            label: 'V1',
            hint: 'Kyverno API version',
            correctValue: 'v1',
            validationPattern: 'v1'
          },
          {
            id: 'CLUSTER_POLICY',
            label: 'CLUSTER_POLICY',
            hint: 'Kyverno resource kind',
            correctValue: 'ClusterPolicy',
            validationPattern: 'cluster.*policy'
          },
          {
            id: 'ENFORCE',
            label: 'ENFORCE',
            hint: 'Block unsigned images',
            correctValue: 'enforce',
            validationPattern: 'enforce'
          },
          {
            id: 'POD',
            label: 'POD',
            hint: 'Kubernetes resource',
            correctValue: 'Pod',
            validationPattern: 'pod'
          },
          {
            id: '1',
            label: '1',
            hint: 'Minimum attestors',
            correctValue: '1',
            validationPattern: '1'
          }
        ],
        solution: 'Image signing workflow: 1) Generate key pair with cosign 2) Sign images in CI/CD 3) Deploy Kyverno policy with public key 4) Kubernetes rejects unsigned images. Protects against supply chain attacks.',
        explanation: 'Image signing ensures authenticity and prevents tampering in the supply chain'
      }
    ],
    hints: [
      'Always use specific image tags, never :latest in production',
      'Multi-stage builds minimize attack surface and image size',
      'Never store secrets in container images or Kubernetes manifests',
      'Network policies should default deny, then explicitly allow',
      'Sign all production images and verify signatures before deployment'
    ]
  },

  runGuided: {
    objective: 'Build comprehensive container and application security platform with hardening, secrets management, and runtime protection',
    conceptualGuidance: [
      'Design secure container image build pipeline with multi-stage builds and scanning',
      'Implement secrets management strategy (External Secrets, Vault, or cloud-native)',
      'Configure Pod Security Standards (restricted profile) across all namespaces',
      'Deploy runtime security monitoring with Falco',
      'Implement network segmentation with NetworkPolicies',
      'Set up image signing and verification workflow',
      'Configure DAST scanning for running applications',
      'Implement security monitoring and alerting',
      'Create incident response playbooks for container security events'
    ],
    keyConceptsToApply: [
      'Defense in depth (multiple security layers)',
      'Least privilege (minimal permissions)',
      'Zero trust networking',
      'Immutable infrastructure',
      'Supply chain security'
    ],
    checkpoints: [
      {
        checkpoint: 'Secure container images built and scanned',
        description: 'Production-ready images with minimal vulnerabilities',
        validationCriteria: [
          'Multi-stage Dockerfiles with Alpine or Distroless base',
          'All images run as non-root users',
          'Image scanning integrated in CI/CD (Trivy, Grype, or Snyk)',
          'No critical or high vulnerabilities in production images',
          'Image size optimized (only production dependencies)',
          'Images tagged with digest, not :latest'
        ],
        hintIfStuck: 'Use node:18-alpine or gcr.io/distroless/nodejs. Multi-stage: builder + minimal runtime. Add non-root user (RUN adduser). Scan with: trivy image --severity CRITICAL,HIGH. Block deployment if vulnerabilities found.'
      },
      {
        checkpoint: 'Secrets managed externally with auto-rotation',
        description: 'Zero secrets in code, containers, or Git',
        validationCriteria: [
          'External Secrets Operator or Vault deployed',
          'All application secrets synced from external store',
          'No secrets in container images or manifests',
          'Secrets auto-refresh (hourly or on change)',
          'Access to secrets restricted via RBAC/IAM',
          'Secret rotation tested and documented'
        ],
        hintIfStuck: 'Install External Secrets Operator. Create SecretStore pointing to AWS Secrets Manager or Vault. Create ExternalSecret for each app. Mount as environment variables or files. Test rotation by updating secret in AWS.'
      },
      {
        checkpoint: 'Runtime security enforced with monitoring',
        description: 'Pod Security Standards and runtime detection active',
        validationCriteria: [
          'Pod Security Standards enforced (restricted profile)',
          'All pods run with securityContext (non-root, read-only FS, dropped caps)',
          'Network policies enforce zero-trust communication',
          'Falco deployed and monitoring runtime events',
          'Alerts configured for: shell in container, privilege escalation, crypto mining',
          'Image signatures verified before deployment (Kyverno/OPA)'
        ],
        hintIfStuck: 'Label namespaces: pod-security.kubernetes.io/enforce=restricted. Add securityContext to all deployments. Create default-deny NetworkPolicy. Install Falco via Helm. Create Kyverno policy to verify image signatures.'
      }
    ],
    resourcesAllowed: [
      'Trivy/Grype/Snyk documentation',
      'External Secrets Operator docs',
      'Kubernetes Pod Security Standards',
      'Falco rules and examples',
      'Sigstore/Cosign documentation'
    ]
  },

  runIndependent: {
    objective: 'Build production-ready container security platform with comprehensive hardening, secrets management, runtime monitoring, and supply chain security',
    successCriteria: [
      'Secure images: Multi-stage builds, Alpine/Distroless, non-root users, no critical/high CVEs',
      'Automated scanning: Image and dependency scanning in CI/CD with pipeline failure on findings',
      'Secrets management: External Secrets Operator or Vault, zero secrets in code/containers, auto-rotation',
      'Pod hardening: Security contexts enforced (non-root, read-only FS, dropped capabilities, seccomp)',
      'Network segmentation: NetworkPolicies implement zero-trust pod communication',
      'Runtime security: Falco monitors for threats, alerts on suspicious behavior',
      'Image signing: All production images signed, signatures verified before deployment',
      'Application security: DAST scanning, security headers (CSP, HSTS), input validation',
      'Compliance: CIS Kubernetes Benchmark controls implemented and tested',
      'Incident response: Runbooks for container breakout, compromised images, crypto mining'
    ],
    timeTarget: 20,
    minimumRequirements: [
      'Container images scanned with no critical/high vulnerabilities',
      'All pods run as non-root with security contexts',
      'Secrets stored externally (not in Git or containers)'
    ],
    evaluationRubric: [
      {
        criterion: 'Container Hardening',
        weight: 30,
        passingThreshold: 'Multi-stage builds minimize attack surface. Alpine or Distroless bases. Non-root users. Read-only root filesystems. All capabilities dropped. Images scanned in CI/CD with zero high/critical CVEs.'
      },
      {
        criterion: 'Secrets Management',
        weight: 20,
        passingThreshold: 'External Secrets Operator or Vault deployed. All secrets synced from external store. Auto-rotation configured. Access controlled via RBAC. Zero secrets in Git, manifests, or images. Rotation tested.'
      },
      {
        criterion: 'Runtime Security',
        weight: 30,
        passingThreshold: 'Pod Security Standards enforced. Security contexts on all workloads. Network policies default deny. Falco monitoring all events. Alerts configured and routed. Image signatures verified. Non-compliant resources blocked.'
      },
      {
        criterion: 'Application Security',
        weight: 20,
        passingThreshold: 'DAST scanning integrated. Security headers implemented (CSP, HSTS, X-Frame-Options). Input validation prevents injection. Rate limiting prevents abuse. Comprehensive security testing in CI/CD.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=VjlvS-qiz_U',
  documentation: [
    'https://kubernetes.io/docs/concepts/security/pod-security-standards/',
    'https://aquasecurity.github.io/trivy/',
    'https://external-secrets.io/latest/',
    'https://falco.org/docs/',
    'https://github.com/sigstore/cosign',
    'https://kyverno.io/docs/writing-policies/verify-images/',
    'https://owasp.org/www-project-zap/'
  ],
  relatedConcepts: [
    'Container image scanning and hardening',
    'Kubernetes Pod Security Standards',
    'Zero-trust networking',
    'Supply chain security (SLSA framework)',
    'Runtime security monitoring',
    'Secrets management patterns'
  ]
};
