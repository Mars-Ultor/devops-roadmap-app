/**
 * Week 9 Lesson 3 - Infrastructure Security & Compliance
 * 4-Level Mastery Progression: IAM best practices, compliance as code, security auditing
 */

import type { LeveledLessonContent } from "../types/lessonContent";

export const week9Lesson3InfrastructureSecurity: LeveledLessonContent = {
  lessonId: "week9-lesson3-infrastructure-security",

  baseLesson: {
    title: "Infrastructure Security & Compliance",
    description:
      "Implement infrastructure security controls including IAM, compliance as code, security auditing, and automated compliance verification.",
    learningObjectives: [
      "Design least-privilege IAM policies and roles",
      "Implement compliance as code with OPA and Conftest",
      "Audit infrastructure security with CIS benchmarks",
      "Automate compliance scanning and reporting",
      "Configure security monitoring and incident detection",
    ],
    prerequisites: [
      "AWS/cloud platform knowledge",
      "Terraform basics",
      "Understanding of RBAC and authentication",
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 30,
      runGuided: 25,
      runIndependent: 20,
    },
  },

  crawl: {
    introduction:
      "Learn infrastructure security and compliance step-by-step. You will design IAM policies, implement compliance checks, and audit security posture.",
    expectedOutcome:
      "Complete understanding of infrastructure security: IAM least privilege, policy as code with OPA, IaC scanning with Checkov, AWS Config compliance, Security Hub monitoring, and automated auditing",
    steps: [
      {
        stepNumber: 1,
        instruction: "Understand the principle of least privilege",
        command:
          'echo "Least Privilege IAM:\n1. Grant minimum permissions needed\n2. Use specific resources (no wildcards *)\n3. Add conditions to restrict access\n4. Regular access reviews\n5. Temporary credentials only"',
        explanation:
          "Least privilege minimizes damage if credentials are compromised. Start with no access, add only what's needed.",
        expectedOutput: "Least privilege principles listed",
        validationCriteria: [
          "Understand minimal permissions concept",
          "Know why wildcards are dangerous",
          "Recognize importance of conditions",
        ],
        commonMistakes: [
          "Granting AdministratorAccess",
          "Using wildcard (*) resources",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Create IAM policy with specific permissions",
        command:
          'aws iam create-policy --policy-name S3ReadOnlySpecific --policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject","s3:ListBucket"],"Resource":["arn:aws:s3:::my-app-data","arn:aws:s3:::my-app-data/*"],"Condition":{"IpAddress":{"aws:SourceIp":"10.0.0.0/16"}}}]}\'',
        explanation:
          "Policy grants only GetObject and ListBucket (not PutObject or DeleteObject), scoped to specific bucket, restricted to VPC IP range.",
        expectedOutput: "IAM policy created",
        validationCriteria: [
          "Policy scoped to specific resources",
          "Actions limited to read-only",
          "IP condition restricts access",
        ],
        commonMistakes: ["Granting s3:*", "No resource scoping"],
      },
      {
        stepNumber: 3,
        instruction:
          "Set up AWS IAM Identity Center (SSO) for centralized access",
        command:
          'aws sso-admin list-instances --query "Instances[0].InstanceArn" --output text',
        explanation:
          "IAM Identity Center provides SSO with MFA, centralized access management, temporary credentials. Replaces long-lived IAM user keys.",
        expectedOutput: "Identity Center instance ARN",
        validationCriteria: [
          "SSO configured",
          "MFA required",
          "User groups mapped to permission sets",
        ],
        commonMistakes: ["Using IAM users instead of SSO", "Not requiring MFA"],
      },
      {
        stepNumber: 4,
        instruction: "Enable AWS CloudTrail for audit logging",
        command:
          "aws cloudtrail create-trail --name security-audit --s3-bucket-name my-cloudtrail-logs --is-multi-region-trail --enable-log-file-validation",
        explanation:
          "CloudTrail records all API calls for audit, forensics, compliance. Log file validation prevents tampering.",
        expectedOutput: "CloudTrail created",
        validationCriteria: [
          "Trail active in all regions",
          "Logs going to S3",
          "Integrity validation enabled",
        ],
        commonMistakes: ["Single region trail", "No log validation"],
      },
      {
        stepNumber: 5,
        instruction: "Run CIS Kubernetes Benchmark audit",
        command:
          "docker run --rm --net host --pid host --cap-add audit_control -v /etc:/node/etc:ro -v /var:/node/var:ro aquasec/kube-bench:latest",
        explanation:
          "kube-bench checks Kubernetes against CIS benchmark security controls. Identifies misconfigurations.",
        expectedOutput: "Benchmark results with pass/fail tests",
        validationCriteria: [
          "All critical tests pass",
          "Recommendations documented",
          "Failed tests have remediation plan",
        ],
        commonMistakes: ["Ignoring failed tests", "Not testing regularly"],
      },
      {
        stepNumber: 6,
        instruction: "Implement policy as code with Open Policy Agent (OPA)",
        command:
          "kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml",
        explanation:
          "OPA Gatekeeper enforces policies as admission controller. Blocks non-compliant resources before creation.",
        expectedOutput: "Gatekeeper installed",
        validationCriteria: [
          "Gatekeeper pods running",
          "Admission webhooks configured",
          "Ready to enforce policies",
        ],
        commonMistakes: [
          "Not testing policies",
          "Blocking all resources accidentally",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Create OPA policy requiring resource limits",
        command:
          'kubectl apply -f - <<EOF\napiVersion: templates.gatekeeper.sh/v1beta1\nkind: ConstraintTemplate\nmetadata:\n  name: k8srequiredresources\nspec:\n  crd:\n    spec:\n      names:\n        kind: K8sRequiredResources\n  targets:\n    - target: admission.k8s.gatekeeper.sh\n      rego: |\n        package k8srequiredresources\n        violation[{"msg": msg}] {\n          container := input.review.object.spec.containers[_]\n          not container.resources.limits.memory\n          msg := "Container must have memory limit"\n        }\n---\napiVersion: constraints.gatekeeper.sh/v1beta1\nkind: K8sRequiredResources\nmetadata:\n  name: must-have-resources\nspec:\n  match:\n    kinds:\n      - apiGroups: [""]\n        kinds: ["Pod"]\nEOF',
        explanation:
          "ConstraintTemplate defines policy logic in Rego. Constraint applies policy to specific resources. Blocks pods without memory limits.",
        expectedOutput: "Policy active",
        validationCriteria: [
          "Template and constraint created",
          "Pods without limits rejected",
          "Policy violations logged",
        ],
        commonMistakes: ["Syntax errors in Rego", "Too broad matching"],
      },
      {
        stepNumber: 8,
        instruction: "Scan Terraform for security issues with Checkov",
        command: "pip install checkov && checkov -d . --framework terraform",
        explanation:
          "Checkov scans IaC for misconfigurations: public S3 buckets, unencrypted EBS, overly permissive security groups.",
        expectedOutput: "Security findings in Terraform code",
        validationCriteria: [
          "Scan completes successfully",
          "Issues categorized by severity",
          "Remediation guidance provided",
        ],
        commonMistakes: [
          "Not scanning before terraform apply",
          "Ignoring medium-severity issues",
        ],
      },
      {
        stepNumber: 9,
        instruction: "Scan Terraform with Conftest for policy compliance",
        command: "conftest test terraform.tfplan --policy policy/",
        explanation:
          "Conftest uses OPA to enforce custom policies on IaC. Example: require encryption, deny public access, enforce tagging.",
        expectedOutput: "Policy violations found",
        validationCriteria: [
          "Policies evaluated",
          "Violations block deployment",
          "Policy language is Rego",
        ],
        commonMistakes: [
          "No policies defined",
          "Policies not version controlled",
        ],
      },
      {
        stepNumber: 10,
        instruction:
          "Enable AWS Security Hub for centralized security findings",
        command:
          "aws securityhub enable-security-hub --enable-default-standards",
        explanation:
          "Security Hub aggregates findings from GuardDuty, Inspector, Config, Macie. Provides compliance dashboards.",
        expectedOutput: "Security Hub enabled",
        validationCriteria: [
          "Hub active",
          "Standards enabled (CIS, PCI-DSS)",
          "Findings aggregated",
        ],
        commonMistakes: [
          "Not enabling GuardDuty first",
          "Ignoring critical findings",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Configure AWS Config rules for compliance monitoring",
        command:
          'aws configservice put-config-rule --config-rule \'{"ConfigRuleName":"s3-bucket-public-read-prohibited","Source":{"Owner":"AWS","SourceIdentifier":"S3_BUCKET_PUBLIC_READ_PROHIBITED"}}\'',
        explanation:
          "AWS Config continuously monitors resources for compliance. Rules auto-remediate or alert on violations.",
        expectedOutput: "Config rule created",
        validationCriteria: [
          "Rule evaluating resources",
          "Non-compliant resources identified",
          "Alerts configured",
        ],
        commonMistakes: ["No auto-remediation", "Alert fatigue from noise"],
      },
      {
        stepNumber: 12,
        instruction: "Set up compliance reporting dashboard",
        command:
          'echo "Compliance Dashboard:\n- CIS Benchmark score: 95%\n- Config rules passing: 87/90\n- Security Hub critical findings: 2\n- Last audit: 2025-12-10\n- Next review: 2025-12-17"',
        explanation:
          "Compliance dashboard provides visibility into security posture. Track trends, demonstrate compliance to auditors.",
        expectedOutput: "Compliance metrics shown",
        validationCriteria: [
          "All metrics collected",
          "Trends visualized",
          "Reports exportable",
        ],
        commonMistakes: ["Manual tracking", "No historical data"],
      },
    ],
  },

  walk: {
    introduction:
      "Apply infrastructure security and compliance through hands-on exercises.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario: "Create least-privilege IAM policy for S3 access.",
        template: `{
  "Version": "__2012-10-17__",
  "Statement": [
    {
      "Effect": "__ALLOW__",
      "Action": [
        "s3:__GET_OBJECT__",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::__MY_BUCKET__",
        "arn:aws:s3:::my-bucket/__UPLOADS__/*"
      ],
      "Condition": {
        "__IP_ADDRESS__": {
          "aws:SourceIp": "__10.0.0.0/16__"
        }
      }
    },
    {
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::my-bucket/__ADMIN__/*"
    }
  ]
}`,
        blanks: [
          {
            id: "2012-10-17",
            label: "2012-10-17",
            hint: "IAM policy version",
            correctValue: "2012-10-17",
            validationPattern: "2012-10-17",
          },
          {
            id: "ALLOW",
            label: "ALLOW",
            hint: "Grant permission",
            correctValue: "Allow",
            validationPattern: "allow",
          },
          {
            id: "GET_OBJECT",
            label: "GET_OBJECT",
            hint: "Read object action",
            correctValue: "GetObject",
            validationPattern: "get.*object",
          },
          {
            id: "MY_BUCKET",
            label: "MY_BUCKET",
            hint: "Bucket name",
            correctValue: "my-bucket",
            validationPattern: "my.*bucket",
          },
          {
            id: "UPLOADS",
            label: "UPLOADS",
            hint: "Allowed prefix",
            correctValue: "uploads",
            validationPattern: "uploads",
          },
          {
            id: "IP_ADDRESS",
            label: "IP_ADDRESS",
            hint: "Condition key",
            correctValue: "IpAddress",
            validationPattern: "ip.*address",
          },
          {
            id: "10.0.0.0/16",
            label: "10.0.0.0/16",
            hint: "VPC CIDR",
            correctValue: "10.0.0.0/16",
            validationPattern: "10\\.0",
          },
          {
            id: "ADMIN",
            label: "ADMIN",
            hint: "Restricted path",
            correctValue: "admin",
            validationPattern: "admin",
          },
        ],
        solution:
          "Least privilege policy: read-only (GetObject, ListBucket), scoped to specific bucket and uploads/* prefix, IP-restricted to VPC, explicit deny for admin/* paths. Never use s3:* or wildcard resources.",
        explanation:
          "IAM least privilege minimizes blast radius if credentials compromised",
      },
      {
        exerciseNumber: 2,
        scenario:
          "Create OPA Gatekeeper policy requiring pod security standards.",
        template: `apiVersion: templates.gatekeeper.sh/__V1BETA1__
kind: __CONSTRAINT_TEMPLATE__
metadata:
  name: k8spodsecurity
spec:
  crd:
    spec:
      names:
        kind: K8sPodSecurity
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8spodsecurity
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          container.securityContext.runAsNonRoot != __TRUE__
          msg := "Container must run as non-root"
        }
        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          container.securityContext.allowPrivilegeEscalation != __FALSE__
          msg := "Privilege escalation must be disabled"
        }
---
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: __K8S_POD_SECURITY__
metadata:
  name: pod-security-policy
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["__POD__"]`,
        blanks: [
          {
            id: "V1BETA1",
            label: "V1BETA1",
            hint: "API version",
            correctValue: "v1beta1",
            validationPattern: "v1beta1",
          },
          {
            id: "CONSTRAINT_TEMPLATE",
            label: "CONSTRAINT_TEMPLATE",
            hint: "Resource kind",
            correctValue: "ConstraintTemplate",
            validationPattern: "constraint.*template",
          },
          {
            id: "TRUE",
            label: "TRUE",
            hint: "Boolean value",
            correctValue: "true",
            validationPattern: "true",
          },
          {
            id: "FALSE",
            label: "FALSE",
            hint: "Boolean value",
            correctValue: "false",
            validationPattern: "false",
          },
          {
            id: "K8S_POD_SECURITY",
            label: "K8S_POD_SECURITY",
            hint: "Constraint kind",
            correctValue: "K8sPodSecurity",
            validationPattern: "k8s.*pod.*security",
          },
          {
            id: "POD",
            label: "POD",
            hint: "Kubernetes resource",
            correctValue: "Pod",
            validationPattern: "pod",
          },
        ],
        solution:
          "OPA Gatekeeper policy enforces Pod Security Standards: runAsNonRoot=true, allowPrivilegeEscalation=false. ConstraintTemplate defines Rego logic, Constraint applies to pods. Non-compliant pods are rejected.",
        explanation: "Policy as code automates security compliance enforcement",
      },
      {
        exerciseNumber: 3,
        scenario: "Scan Terraform for security issues with Checkov.",
        template: `# Install Checkov
pip install __CHECKOV__

# Scan Terraform directory
checkov -d . --framework __TERRAFORM__ --output __JSON__ > checkov-report.json

# Scan specific file
checkov -f main.tf --framework terraform

# Skip specific checks
checkov -d . --skip-check __CKV_AWS_20__ # Skip S3 encryption check

# Set severity threshold
checkov -d . --framework terraform --__COMPACT__ --quiet --check __CRITICAL__,HIGH`,
        blanks: [
          {
            id: "CHECKOV",
            label: "CHECKOV",
            hint: "IaC scanner",
            correctValue: "checkov",
            validationPattern: "checkov",
          },
          {
            id: "TERRAFORM",
            label: "TERRAFORM",
            hint: "Framework",
            correctValue: "terraform",
            validationPattern: "terraform",
          },
          {
            id: "JSON",
            label: "JSON",
            hint: "Output format",
            correctValue: "json",
            validationPattern: "json",
          },
          {
            id: "CKV_AWS_20",
            label: "CKV_AWS_20",
            hint: "Check ID",
            correctValue: "CKV_AWS_20",
            validationPattern: "ckv",
          },
          {
            id: "COMPACT",
            label: "COMPACT",
            hint: "Compact output",
            correctValue: "compact",
            validationPattern: "compact",
          },
          {
            id: "CRITICAL",
            label: "CRITICAL",
            hint: "Severity level",
            correctValue: "CRITICAL",
            validationPattern: "critical",
          },
        ],
        solution:
          "Checkov scans IaC for security misconfigurations: unencrypted resources, public access, missing logging. Integrate into CI/CD to prevent insecure infrastructure. Use --skip-check for accepted risks with justification.",
        explanation:
          "Infrastructure scanning catches security issues before deployment",
      },
      {
        exerciseNumber: 4,
        scenario: "Configure AWS Security Hub with compliance standards.",
        template: `# Enable Security Hub
aws securityhub __ENABLE_SECURITY_HUB__ --enable-default-standards

# Enable specific standards
aws securityhub batch-enable-standards --standards-subscription-requests \\
  StandardsArn=arn:aws:securityhub:us-east-1::standards/aws-foundational-security-best-practices/v/1.0.0 \\
  StandardsArn=arn:aws:securityhub:us-east-1::standards/__CIS_AWS_FOUNDATIONS_BENCHMARK__/v/1.2.0

# Get findings
aws securityhub get-findings --filters '{"SeverityLabel":[{"Value":"__CRITICAL__","Comparison":"EQUALS"}]}'

# Get compliance score
aws securityhub get-compliance-summary --compliance-standard-id arn:aws:securityhub:us-east-1::standards/cis-aws-foundations-benchmark/v/1.2.0

# Create custom insight
aws securityhub create-insight --name "Public S3 Buckets" --filters '{"Type":[{"Value":"Software and Configuration Checks/AWS Security Best Practices","Comparison":"EQUALS"}],"ResourceType":[{"Value":"__AWS_S3_BUCKET__","Comparison":"EQUALS"}]}'`,
        blanks: [
          {
            id: "ENABLE_SECURITY_HUB",
            label: "ENABLE_SECURITY_HUB",
            hint: "Command",
            correctValue: "enable-security-hub",
            validationPattern: "enable.*security.*hub",
          },
          {
            id: "CIS_AWS_FOUNDATIONS_BENCHMARK",
            label: "CIS_AWS_FOUNDATIONS_BENCHMARK",
            hint: "Standard name",
            correctValue: "cis-aws-foundations-benchmark",
            validationPattern: "cis.*aws",
          },
          {
            id: "CRITICAL",
            label: "CRITICAL",
            hint: "Severity",
            correctValue: "CRITICAL",
            validationPattern: "critical",
          },
          {
            id: "AWS_S3_BUCKET",
            label: "AWS_S3_BUCKET",
            hint: "Resource type",
            correctValue: "AwsS3Bucket",
            validationPattern: "aws.*s3",
          },
        ],
        solution:
          "Security Hub aggregates findings from GuardDuty, Inspector, Config, Macie. Enable compliance standards (CIS, PCI-DSS). Filter by severity to prioritize remediation. Create custom insights for tracking specific issues.",
        explanation:
          "Centralized security monitoring provides comprehensive visibility",
      },
      {
        exerciseNumber: 5,
        scenario: "Create compliance reporting with AWS Config rules.",
        template: `# Create Config rule for encrypted EBS
aws configservice put-config-rule --config-rule '{
  "ConfigRuleName": "__ENCRYPTED_VOLUMES__",
  "Source": {
    "Owner": "__AWS__",
    "SourceIdentifier": "ENCRYPTED_VOLUMES"
  }
}'

# Create rule for S3 public access
aws configservice put-config-rule --config-rule '{
  "ConfigRuleName": "s3-bucket-public-read-prohibited",
  "Source": {
    "Owner": "AWS",
    "SourceIdentifier": "__S3_BUCKET_PUBLIC_READ_PROHIBITED__"
  }
}'

# Get compliance status
aws configservice describe-compliance-by-config-rule --config-rule-names encrypted-volumes

# Get non-compliant resources
aws configservice get-compliance-details-by-config-rule \\
  --config-rule-name encrypted-volumes \\
  --compliance-types __NON_COMPLIANT__

# Remediate manually
aws ec2 create-snapshot --volume-id vol-abc123 --description "Before encryption"
aws ec2 copy-snapshot --source-snapshot-id snap-abc123 --encrypted`,
        blanks: [
          {
            id: "ENCRYPTED_VOLUMES",
            label: "ENCRYPTED_VOLUMES",
            hint: "Rule name",
            correctValue: "encrypted-volumes",
            validationPattern: "encrypted",
          },
          {
            id: "AWS",
            label: "AWS",
            hint: "Rule owner",
            correctValue: "AWS",
            validationPattern: "aws",
          },
          {
            id: "S3_BUCKET_PUBLIC_READ_PROHIBITED",
            label: "S3_BUCKET_PUBLIC_READ_PROHIBITED",
            hint: "Rule identifier",
            correctValue: "S3_BUCKET_PUBLIC_READ_PROHIBITED",
            validationPattern: "s3.*public",
          },
          {
            id: "NON_COMPLIANT",
            label: "NON_COMPLIANT",
            hint: "Compliance type",
            correctValue: "NON_COMPLIANT",
            validationPattern: "non.*compliant",
          },
        ],
        solution:
          "AWS Config rules continuously evaluate resources for compliance. Create rules for encryption, public access, tagging. Query non-compliant resources. Set up auto-remediation with SSM or Lambda for automatic fixes.",
        explanation:
          "Automated compliance monitoring ensures continuous security posture",
      },
    ],
    hints: [
      "Always use specific resources in IAM policies, never wildcards (*)",
      "Policy as code (OPA, Conftest) catches issues before deployment",
      "Scan IaC with Checkov in CI/CD to prevent misconfigurations",
      "AWS Security Hub aggregates findings from multiple services",
      "Config rules + auto-remediation = self-healing compliance",
    ],
  },

  runGuided: {
    objective:
      "Build comprehensive infrastructure security and compliance platform with IAM, policy enforcement, and automated auditing",
    conceptualGuidance: [
      "Design IAM strategy: SSO with MFA, least privilege roles, no long-lived keys",
      "Implement policy as code with OPA Gatekeeper or Kyverno",
      "Set up IaC scanning (Checkov, Terraform Sentinel) in CI/CD",
      "Configure compliance monitoring with AWS Config or equivalent",
      "Deploy security auditing with CloudTrail and centralized logging",
      "Create compliance dashboards tracking CIS benchmarks",
      "Implement automated remediation for common violations",
      "Document security controls and map to frameworks (SOC2, ISO27001)",
      "Set up incident detection and response workflows",
    ],
    keyConceptsToApply: [
      "Least privilege access control",
      "Policy as code for compliance",
      "Continuous security monitoring",
      "Automated compliance verification",
      "Infrastructure immutability",
    ],
    checkpoints: [
      {
        checkpoint: "IAM configured with least privilege and SSO",
        description: "All access uses temporary credentials and MFA",
        validationCriteria: [
          "SSO configured with MFA required",
          "All IAM policies follow least privilege (specific resources, minimal actions)",
          "No long-lived access keys in use",
          "IAM roles used for service-to-service authentication",
          "Conditions restrict access (IP, MFA, time)",
          "Regular access reviews documented",
        ],
        hintIfStuck:
          "Enable AWS IAM Identity Center. Create permission sets with specific policies. Require MFA. Delete IAM user access keys. Use IRSA for pods, instance profiles for EC2.",
      },
      {
        checkpoint: "Policy as code enforcing compliance",
        description:
          "Automated policy enforcement blocks non-compliant resources",
        validationCriteria: [
          "OPA Gatekeeper or Kyverno deployed",
          "Policies enforce: non-root users, resource limits, security contexts",
          "IaC scanned with Checkov/Conftest in CI/CD",
          "Policy violations block deployments",
          "Policies version controlled and tested",
          "Policy exceptions documented with justification",
        ],
        hintIfStuck:
          "Install Gatekeeper. Create ConstraintTemplates for pod security, resource requirements, allowed registries. Add Checkov to GitHub Actions. Require policies to pass before terraform apply.",
      },
      {
        checkpoint: "Compliance monitoring and reporting automated",
        description: "Continuous compliance verification with dashboards",
        validationCriteria: [
          "AWS Config rules or equivalent deployed",
          "CIS benchmark compliance tracked",
          "Security Hub aggregating findings",
          "Compliance dashboard showing current posture",
          "Automated alerts for critical violations",
          "Monthly compliance reports generated",
        ],
        hintIfStuck:
          "Enable AWS Config with managed rules (encryption, public access). Run kube-bench for Kubernetes. Enable Security Hub with CIS standard. Create CloudWatch dashboard. Set up SNS alerts for critical findings.",
      },
    ],
    resourcesAllowed: [
      "AWS IAM best practices documentation",
      "OPA/Gatekeeper policy examples",
      "CIS Benchmarks (AWS, Kubernetes)",
      "Checkov documentation",
      "AWS Security Hub user guide",
    ],
  },

  runIndependent: {
    objective:
      "Build production-ready infrastructure security platform with comprehensive IAM, automated compliance enforcement, continuous monitoring, and incident response",
    successCriteria: [
      "IAM security: SSO with MFA, least privilege policies, no long-lived keys, role-based access",
      "Policy as code: OPA/Kyverno enforcing pod security, IaC scanning in CI/CD",
      "Compliance automation: Config rules, CIS benchmark tracking, automated remediation",
      "Security monitoring: CloudTrail, GuardDuty, Security Hub all enabled and alerting",
      "Audit logging: Centralized logs with tamper-proofing and retention policies",
      "Network security: Zero-trust architecture, segmentation, encrypted transit",
      "Encryption: At-rest and in-transit encryption for all data",
      "Compliance reporting: Automated dashboards, monthly reports, control mapping",
      "Incident response: Runbooks, automated containment, forensics capabilities",
      "Documentation: All security controls documented, compliance artifacts maintained",
    ],
    timeTarget: 20,
    minimumRequirements: [
      "IAM follows least privilege with no wildcard permissions",
      "Policy enforcement blocks non-compliant resources",
      "Compliance monitoring active with alerting",
    ],
    evaluationRubric: [
      {
        criterion: "IAM Security",
        weight: 25,
        passingThreshold:
          "SSO with MFA mandatory. All policies use least privilege (specific resources, minimal actions, conditions). No long-lived keys. Roles for service authentication. Access reviews documented.",
      },
      {
        criterion: "Policy Enforcement",
        weight: 30,
        passingThreshold:
          "OPA/Kyverno policies deployed enforcing security standards. IaC scanned in CI/CD (Checkov/Conftest). Non-compliant resources blocked. Policies tested and version controlled.",
      },
      {
        criterion: "Compliance Monitoring",
        weight: 25,
        passingThreshold:
          "Config rules monitoring compliance. CIS benchmarks tracked. Security Hub aggregating findings. Dashboards show current posture. Alerts on violations. Automated remediation for common issues.",
      },
      {
        criterion: "Security Operations",
        weight: 20,
        passingThreshold:
          "CloudTrail logging all actions. GuardDuty detecting threats. Logs centralized with tamper-proofing. Incident runbooks tested. Forensics capabilities ready. Compliance documented.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=SZQUXeT_1pI",
  documentation: [
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
    "https://www.openpolicyagent.org/docs/latest/",
    "https://www.checkov.io/documentation.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/",
    "https://docs.aws.amazon.com/config/latest/developerguide/",
    "https://www.cisecurity.org/cis-benchmarks",
    "https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/",
  ],
  relatedConcepts: [
    "IAM least privilege design",
    "Policy as code with OPA",
    "Infrastructure compliance scanning",
    "CIS Benchmarks",
    "Zero-trust architecture",
    "Automated compliance remediation",
  ],
};
