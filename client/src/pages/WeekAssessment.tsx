/* eslint-disable max-lines-per-function, complexity, sonarjs/no-duplicate-string */
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { Brain, CheckCircle, XCircle, Award, TrendingUp, Target } from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

interface AssessmentResult {
  weekNumber: number;
  type: 'pre' | 'post';
  score: number;
  totalQuestions: number;
  answers: Record<string, number>;
  completedAt: Date;
  timeSpent: number;
}

const weekAssessments: Record<number, { pre: AssessmentQuestion[]; post: AssessmentQuestion[] }> = {
  1: {
    pre: [
      {
        id: 'pre-1',
        question: 'What is DevOps?',
        options: [
          'A programming language',
          'A cultural practice combining development and operations',
          'A cloud service provider',
          'A database management system'
        ],
        correctAnswer: 1,
        explanation: 'DevOps is a cultural and technical practice that combines software development (Dev) and IT operations (Ops).',
        topic: 'DevOps Fundamentals'
      },
      {
        id: 'pre-2',
        question: 'Which command lists files in a Linux directory?',
        options: ['dir', 'ls', 'list', 'show'],
        correctAnswer: 1,
        explanation: 'The "ls" command is used to list directory contents in Linux/Unix systems.',
        topic: 'Linux Basics'
      },
      {
        id: 'pre-3',
        question: 'What does CI/CD stand for?',
        options: [
          'Code Integration/Code Deployment',
          'Continuous Integration/Continuous Deployment',
          'Container Integration/Container Development',
          'Cloud Integration/Cloud Delivery'
        ],
        correctAnswer: 1,
        explanation: 'CI/CD stands for Continuous Integration and Continuous Deployment/Delivery.',
        topic: 'DevOps Concepts'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'Which command changes file permissions in Linux?',
        options: ['chown', 'chmod', 'chgrp', 'chperm'],
        correctAnswer: 1,
        explanation: 'chmod (change mode) is used to modify file permissions in Linux.',
        topic: 'Linux Administration'
      },
      {
        id: 'post-2',
        question: 'What does "sudo" do in Linux?',
        options: [
          'Shuts down the system',
          'Executes commands with superuser privileges',
          'Shows disk usage',
          'Saves user data'
        ],
        correctAnswer: 1,
        explanation: 'sudo (superuser do) allows users to run programs with the security privileges of another user.',
        topic: 'Linux Administration'
      },
      {
        id: 'post-3',
        question: 'Which file contains user account information in Linux?',
        options: ['/etc/passwd', '/etc/users', '/home/users', '/var/accounts'],
        correctAnswer: 0,
        explanation: '/etc/passwd contains basic user account information in Linux systems.',
        topic: 'Linux System Files'
      },
      {
        id: 'post-4',
        question: 'What is the purpose of the PATH environment variable?',
        options: [
          'Stores file paths',
          'Defines where the shell looks for executable files',
          'Sets the current directory',
          'Contains user passwords'
        ],
        correctAnswer: 1,
        explanation: 'PATH is an environment variable that tells the shell which directories to search for executable files.',
        topic: 'Linux Environment'
      }
    ]
  },
  2: {
    pre: [
      {
        id: 'pre-1',
        question: 'What is version control?',
        options: [
          'A way to control software versions',
          'A system to track changes in files over time',
          'A method to version databases',
          'A cloud storage service'
        ],
        correctAnswer: 1,
        explanation: 'Version control is a system that records changes to files over time so you can recall specific versions later.',
        topic: 'Git Fundamentals'
      },
      {
        id: 'pre-2',
        question: 'What does "git" stand for?',
        options: [
          'Global Information Tracker',
          'It doesn\'t stand for anything',
          'General Integration Tool',
          'Git is Terrible'
        ],
        correctAnswer: 1,
        explanation: 'Git is just the name chosen by Linus Torvalds; it doesn\'t stand for anything specific.',
        topic: 'Git History'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'What command stages changes for commit?',
        options: ['git stage', 'git add', 'git commit', 'git push'],
        correctAnswer: 1,
        explanation: 'git add stages changes, preparing them to be included in the next commit.',
        topic: 'Git Workflow'
      },
      {
        id: 'post-2',
        question: 'What is a merge conflict?',
        options: [
          'When two branches can\'t be merged',
          'When Git can\'t automatically resolve differences between branches',
          'When a commit fails',
          'When the repository is corrupted'
        ],
        correctAnswer: 1,
        explanation: 'A merge conflict occurs when Git cannot automatically resolve differences in code between two commits.',
        topic: 'Git Merging'
      },
      {
        id: 'post-3',
        question: 'What does "git clone" do?',
        options: [
          'Creates a copy of a repository',
          'Duplicates a file',
          'Copies a branch',
          'Clones a commit'
        ],
        correctAnswer: 0,
        explanation: 'git clone creates a local copy of a remote repository.',
        topic: 'Git Commands'
      },
      {
        id: 'post-4',
        question: 'What is the difference between "git pull" and "git fetch"?',
        options: [
          'There is no difference',
          'git pull fetches and merges, git fetch only downloads changes',
          'git fetch is faster',
          'git pull is deprecated'
        ],
        correctAnswer: 1,
        explanation: 'git pull fetches remote changes and merges them, while git fetch only downloads changes without merging.',
        topic: 'Git Remote Operations'
      }
    ]
  },
  3: {
    pre: [
      {
        id: 'pre-1',
        question: 'What is cloud computing?',
        options: [
          'Computing in the sky',
          'Delivering computing services over the internet',
          'A type of weather forecasting',
          'Storing files locally'
        ],
        correctAnswer: 1,
        explanation: 'Cloud computing is the delivery of computing services (servers, storage, databases, etc.) over the internet.',
        topic: 'Cloud Fundamentals'
      },
      {
        id: 'pre-2',
        question: 'What does AWS stand for?',
        options: [
          'Amazon Web Store',
          'Amazon Web Services',
          'Automated Web System',
          'Advanced Web Server'
        ],
        correctAnswer: 1,
        explanation: 'AWS stands for Amazon Web Services, a comprehensive cloud platform by Amazon.',
        topic: 'AWS Basics'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'What is Amazon S3 used for?',
        options: ['Compute', 'Object storage', 'Database', 'Networking'],
        correctAnswer: 1,
        explanation: 'Amazon S3 (Simple Storage Service) is an object storage service.',
        topic: 'AWS Services'
      },
      {
        id: 'post-2',
        question: 'What is an EC2 instance?',
        options: [
          'A storage bucket',
          'A virtual server in the cloud',
          'A database',
          'A network gateway'
        ],
        correctAnswer: 1,
        explanation: 'EC2 (Elastic Compute Cloud) provides resizable virtual servers in the cloud.',
        topic: 'AWS Compute'
      },
      {
        id: 'post-3',
        question: 'What is the purpose of IAM in AWS?',
        options: [
          'Internet Access Management',
          'Identity and Access Management',
          'Internal Application Monitor',
          'Image Asset Manager'
        ],
        correctAnswer: 1,
        explanation: 'IAM (Identity and Access Management) manages access to AWS services and resources securely.',
        topic: 'AWS Security'
      },
      {
        id: 'post-4',
        question: 'What is CloudFront?',
        options: [
          'A CDN service',
          'A computing service',
          'A database service',
          'A monitoring tool'
        ],
        correctAnswer: 0,
        explanation: 'CloudFront is AWS\'s Content Delivery Network (CDN) service for fast content distribution.',
        topic: 'AWS Networking'
      }
    ]
  },
  4: {
    pre: [
      {
        id: 'pre-1',
        question: 'What is containerization?',
        options: [
          'A way to package applications with their dependencies',
          'A method to virtualize entire operating systems',
          'A technique for compressing files',
          'A database storage method'
        ],
        correctAnswer: 0,
        explanation: 'Containerization packages applications with their dependencies into isolated, portable units.',
        topic: 'Containerization Basics'
      },
      {
        id: 'pre-2',
        question: 'What is Docker?',
        options: [
          'A programming language',
          'A containerization platform',
          'A cloud service',
          'A database'
        ],
        correctAnswer: 1,
        explanation: 'Docker is a platform for developing, shipping, and running applications in containers.',
        topic: 'Docker Fundamentals'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'What does a Dockerfile do?',
        options: [
          'Runs containers',
          'Defines how to build a Docker image',
          'Manages container networks',
          'Monitors container performance'
        ],
        correctAnswer: 1,
        explanation: 'A Dockerfile contains instructions for building a Docker image.',
        topic: 'Docker Images'
      },
      {
        id: 'post-2',
        question: 'What is Docker Compose used for?',
        options: [
          'Single container management',
          'Multi-container application orchestration',
          'Container security scanning',
          'Image optimization'
        ],
        correctAnswer: 1,
        explanation: 'Docker Compose defines and runs multi-container Docker applications.',
        topic: 'Docker Compose'
      },
      {
        id: 'post-3',
        question: 'What is the difference between a Docker image and container?',
        options: [
          'There is no difference',
          'Image is a blueprint, container is a running instance',
          'Container is static, image is dynamic',
          'Image is for storage, container is for networking'
        ],
        correctAnswer: 1,
        explanation: 'A Docker image is a read-only template, while a container is a runnable instance of that image.',
        topic: 'Docker Concepts'
      },
      {
        id: 'post-4',
        question: 'What does "docker build" do?',
        options: [
          'Runs a container',
          'Creates an image from a Dockerfile',
          'Stops a running container',
          'Lists all containers'
        ],
        correctAnswer: 1,
        explanation: 'docker build creates a Docker image from a Dockerfile and context.',
        topic: 'Docker Commands'
      }
    ]
  },
  5: {
    pre: [
      {
        id: 'pre-1',
        question: 'What does CI/CD stand for?',
        options: [
          'Continuous Integration/Continuous Deployment',
          'Code Integration/Code Delivery',
          'Cloud Integration/Cloud Development',
          'Container Integration/Container Deployment'
        ],
        correctAnswer: 0,
        explanation: 'CI/CD stands for Continuous Integration and Continuous Deployment/Delivery.',
        topic: 'CI/CD Fundamentals'
      },
      {
        id: 'pre-2',
        question: 'What is the main purpose of CI?',
        options: [
          'Deploy to production',
          'Automatically test code changes',
          'Monitor applications',
          'Manage infrastructure'
        ],
        correctAnswer: 1,
        explanation: 'Continuous Integration automatically builds and tests code changes to catch issues early.',
        topic: 'Continuous Integration'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'What are GitHub Actions?',
        options: [
          'A project management tool',
          'A CI/CD platform integrated with GitHub',
          'A code review tool',
          'A documentation generator'
        ],
        correctAnswer: 1,
        explanation: 'GitHub Actions is a CI/CD platform that allows you to automate workflows directly in your GitHub repository.',
        topic: 'GitHub Actions'
      },
      {
        id: 'post-2',
        question: 'What is a workflow file in GitHub Actions?',
        options: [
          'A configuration file defining automation steps',
          'A log of all actions performed',
          'A list of repository contributors',
          'A documentation file'
        ],
        correctAnswer: 0,
        explanation: 'A workflow file (.github/workflows/*.yml) defines the automation steps, triggers, and jobs for GitHub Actions.',
        topic: 'Workflow Configuration'
      },
      {
        id: 'post-3',
        question: 'What does the "on" key specify in a GitHub Actions workflow?',
        options: [
          'The programming language',
          'The events that trigger the workflow',
          'The operating system to use',
          'The Docker image to use'
        ],
        correctAnswer: 1,
        explanation: 'The "on" key specifies which events (like push, pull_request) will trigger the workflow.',
        topic: 'Workflow Triggers'
      },
      {
        id: 'post-4',
        question: 'What is a "job" in GitHub Actions?',
        options: [
          'A single task within a workflow',
          'A set of workflows that run together',
          'A type of GitHub repository',
          'A billing unit'
        ],
        correctAnswer: 0,
        explanation: 'A job is a set of steps that execute on the same runner, representing a single task within a workflow.',
        topic: 'GitHub Actions Jobs'
      }
    ]
  },
  6: {
    pre: [
      {
        id: 'pre-1',
        question: 'What is Infrastructure as Code (IaC)?',
        options: [
          'Writing code for applications',
          'Managing infrastructure through code',
          'Creating network diagrams',
          'Documenting system architecture'
        ],
        correctAnswer: 1,
        explanation: 'Infrastructure as Code (IaC) is the practice of managing and provisioning infrastructure through machine-readable code.',
        topic: 'IaC Fundamentals'
      },
      {
        id: 'pre-2',
        question: 'What is Terraform?',
        options: [
          'A programming language',
          'An IaC tool by HashiCorp',
          'A cloud service',
          'A database tool'
        ],
        correctAnswer: 1,
        explanation: 'Terraform is an open-source IaC tool by HashiCorp that allows you to define and provision infrastructure.',
        topic: 'Terraform Basics'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'What does "terraform init" do?',
        options: [
          'Creates infrastructure',
          'Initializes a Terraform working directory',
          'Plans infrastructure changes',
          'Applies infrastructure changes'
        ],
        correctAnswer: 1,
        explanation: 'terraform init initializes a working directory containing Terraform configuration files.',
        topic: 'Terraform Commands'
      },
      {
        id: 'post-2',
        question: 'What is a Terraform provider?',
        options: [
          'A cloud service',
          'A plugin that enables Terraform to interact with APIs',
          'A type of resource',
          'A configuration file'
        ],
        correctAnswer: 1,
        explanation: 'A provider is a plugin that enables Terraform to interact with cloud platforms, services, and other APIs.',
        topic: 'Terraform Providers'
      },
      {
        id: 'post-3',
        question: 'What does "terraform plan" show?',
        options: [
          'Current infrastructure state',
          'What changes Terraform will make',
          'Cost of infrastructure',
          'Security vulnerabilities'
        ],
        correctAnswer: 1,
        explanation: 'terraform plan shows what changes Terraform will make to reach the desired state defined in configuration.',
        topic: 'Terraform Planning'
      },
      {
        id: 'post-4',
        question: 'What is Terraform state?',
        options: [
          'A backup of infrastructure',
          'A file tracking managed resources and their state',
          'A log of all changes',
          'A configuration template'
        ],
        correctAnswer: 1,
        explanation: 'Terraform state is a file that tracks which resources Terraform manages and their current state.',
        topic: 'Terraform State'
      }
    ]
  },
  7: {
    pre: [
      {
        id: 'pre-1',
        question: 'What is Kubernetes?',
        options: [
          'A programming language',
          'A container orchestration platform',
          'A cloud service',
          'A database'
        ],
        correctAnswer: 1,
        explanation: 'Kubernetes is an open-source platform for automating deployment, scaling, and management of containerized applications.',
        topic: 'Kubernetes Fundamentals'
      },
      {
        id: 'pre-2',
        question: 'What is a Kubernetes Pod?',
        options: [
          'A storage unit',
          'The smallest deployable unit in Kubernetes',
          'A networking component',
          'A security policy'
        ],
        correctAnswer: 1,
        explanation: 'A Pod is the smallest and simplest Kubernetes object, representing a single instance of a running process in a cluster.',
        topic: 'Kubernetes Pods'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'What is a Kubernetes Deployment?',
        options: [
          'A way to deploy applications to production',
          'A resource that manages a set of identical Pods',
          'A networking configuration',
          'A storage solution'
        ],
        correctAnswer: 1,
        explanation: 'A Deployment provides declarative updates for Pods and ReplicaSets, managing the desired state of your application.',
        topic: 'Kubernetes Deployments'
      },
      {
        id: 'post-2',
        question: 'What is a Kubernetes Service?',
        options: [
          'A background process',
          'An abstraction that defines a logical set of Pods',
          'A configuration file',
          'A monitoring tool'
        ],
        correctAnswer: 1,
        explanation: 'A Service is an abstraction that defines a logical set of Pods and a policy for accessing them.',
        topic: 'Kubernetes Services'
      },
      {
        id: 'post-3',
        question: 'What does kubectl do?',
        options: [
          'Manages Kubernetes clusters',
          'The command-line tool for interacting with Kubernetes',
          'A Kubernetes dashboard',
          'A container runtime'
        ],
        correctAnswer: 1,
        explanation: 'kubectl is the command-line tool for running commands against Kubernetes clusters.',
        topic: 'kubectl'
      },
      {
        id: 'post-4',
        question: 'What is a ConfigMap in Kubernetes?',
        options: [
          'A secret storage mechanism',
          'A way to store non-confidential configuration data',
          'A networking policy',
          'A monitoring configuration'
        ],
        correctAnswer: 1,
        explanation: 'A ConfigMap is used to store non-confidential configuration data that can be consumed by Pods.',
        topic: 'Kubernetes ConfigMaps'
      }
    ]
  },
  8: {
    pre: [
      {
        id: 'pre-1',
        question: 'What is observability?',
        options: [
          'The ability to see system behavior',
          'A monitoring tool',
          'A logging service',
          'A metrics collector'
        ],
        correctAnswer: 0,
        explanation: 'Observability is the ability to understand a system\'s internal state from its external outputs.',
        topic: 'Observability Fundamentals'
      },
      {
        id: 'pre-2',
        question: 'What is Prometheus?',
        options: [
          'A logging tool',
          'A metrics collection and alerting system',
          'A visualization tool',
          'A tracing system'
        ],
        correctAnswer: 1,
        explanation: 'Prometheus is an open-source systems monitoring and alerting toolkit with a dimensional data model.',
        topic: 'Monitoring Tools'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'What is Grafana used for?',
        options: [
          'Metrics collection',
          'Log aggregation',
          'Data visualization and dashboards',
          'Alert management'
        ],
        correctAnswer: 2,
        explanation: 'Grafana is an open-source platform for monitoring and observability with beautiful dashboards.',
        topic: 'Grafana'
      },
      {
        id: 'post-2',
        question: 'What are the three pillars of observability?',
        options: [
          'Metrics, Logs, Traces',
          'CPU, Memory, Disk',
          'Availability, Latency, Throughput',
          'Security, Performance, Reliability'
        ],
        correctAnswer: 0,
        explanation: 'The three pillars of observability are Metrics (measurements), Logs (events), and Traces (request flows).',
        topic: 'Observability Pillars'
      },
      {
        id: 'post-3',
        question: 'What is centralized logging?',
        options: [
          'Logging to a single file',
          'Aggregating logs from multiple sources into one system',
          'Using cloud logging services',
          'Compressing log files'
        ],
        correctAnswer: 1,
        explanation: 'Centralized logging aggregates logs from multiple sources into a single, searchable system for analysis.',
        topic: 'Logging'
      },
      {
        id: 'post-4',
        question: 'What is an alert in monitoring?',
        options: [
          'A notification of system status',
          'An automatic notification when conditions are met',
          'A dashboard widget',
          'A log entry'
        ],
        correctAnswer: 1,
        explanation: 'An alert is an automatic notification sent when monitoring conditions are met or thresholds are exceeded.',
        topic: 'Alerting'
      }
    ]
  },
  9: {
    pre: [
      {
        id: 'pre-1',
        question: 'What is DevSecOps?',
        options: [
          'Development without security',
          'Integrating security practices into DevOps',
          'A security testing tool',
          'A compliance framework'
        ],
        correctAnswer: 1,
        explanation: 'DevSecOps integrates security practices into the DevOps process, making security a shared responsibility.',
        topic: 'DevSecOps Fundamentals'
      },
      {
        id: 'pre-2',
        question: 'What is container vulnerability scanning?',
        options: [
          'Checking container performance',
          'Scanning for security vulnerabilities in container images',
          'Monitoring container networks',
          'Testing container orchestration'
        ],
        correctAnswer: 1,
        explanation: 'Container vulnerability scanning identifies security vulnerabilities in container images before deployment.',
        topic: 'Container Security'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'What is HashiCorp Vault used for?',
        options: [
          'Infrastructure provisioning',
          'Secrets management and data protection',
          'Container orchestration',
          'Monitoring and alerting'
        ],
        correctAnswer: 1,
        explanation: 'HashiCorp Vault is a tool for securely accessing secrets, including authentication, authorization, and encryption.',
        topic: 'Secrets Management'
      },
      {
        id: 'post-2',
        question: 'What is a security policy in DevSecOps?',
        options: [
          'A document describing security requirements',
          'Rules defining how security is implemented',
          'A compliance checklist',
          'A security audit report'
        ],
        correctAnswer: 1,
        explanation: 'A security policy defines rules and procedures for implementing security controls and practices.',
        topic: 'Security Policies'
      },
      {
        id: 'post-3',
        question: 'What is infrastructure security scanning?',
        options: [
          'Checking physical security',
          'Scanning infrastructure configurations for security issues',
          'Monitoring network traffic',
          'Testing application security'
        ],
        correctAnswer: 1,
        explanation: 'Infrastructure security scanning identifies misconfigurations and security issues in infrastructure setups.',
        topic: 'Infrastructure Security'
      },
      {
        id: 'post-4',
        question: 'What is the principle of least privilege?',
        options: [
          'Giving maximum access to administrators',
          'Granting only the minimum access required',
          'Removing all access controls',
          'Using default permissions'
        ],
        correctAnswer: 1,
        explanation: 'The principle of least privilege means giving users only the minimum access they need to perform their tasks.',
        topic: 'Access Control'
      }
    ]
  },
  10: {
    pre: [
      {
        id: 'pre-1',
        question: 'What is a service mesh?',
        options: [
          'A physical network',
          'A dedicated infrastructure layer for service-to-service communication',
          'A monitoring tool',
          'A container runtime'
        ],
        correctAnswer: 1,
        explanation: 'A service mesh is a dedicated infrastructure layer for handling service-to-service communication in microservices architectures.',
        topic: 'Service Mesh'
      },
      {
        id: 'pre-2',
        question: 'What is Istio?',
        options: [
          'A container runtime',
          'An open-source service mesh platform',
          'A monitoring tool',
          'A CI/CD platform'
        ],
        correctAnswer: 1,
        explanation: 'Istio is an open-source service mesh that provides traffic management, security, and observability for microservices.',
        topic: 'Istio'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'What is a StatefulSet in Kubernetes?',
        options: [
          'A set of identical pods with stable identities',
          'A configuration for stateless applications',
          'A networking policy',
          'A storage class'
        ],
        correctAnswer: 0,
        explanation: 'A StatefulSet manages the deployment and scaling of a set of Pods with stable identities and persistent storage.',
        topic: 'Kubernetes StatefulSets'
      },
      {
        id: 'post-2',
        question: 'What is mTLS?',
        options: [
          'Multi-threaded TLS',
          'Mutual Transport Layer Security',
          'Managed TLS certificates',
          'Microservice TLS'
        ],
        correctAnswer: 1,
        explanation: 'mTLS (mutual TLS) is a security protocol where both client and server authenticate each other using certificates.',
        topic: 'Security'
      },
      {
        id: 'post-3',
        question: 'What is a Custom Resource Definition (CRD) in Kubernetes?',
        options: [
          'A user-defined API resource',
          'A built-in Kubernetes resource',
          'A configuration file',
          'A networking component'
        ],
        correctAnswer: 0,
        explanation: 'A CRD extends the Kubernetes API with custom resources, allowing users to define their own resource types.',
        topic: 'Kubernetes CRDs'
      },
      {
        id: 'post-4',
        question: 'What is an Operator pattern?',
        options: [
          'A design pattern for applications',
          'A method for automating application management',
          'A Kubernetes networking pattern',
          'A monitoring pattern'
        ],
        correctAnswer: 1,
        explanation: 'The Operator pattern automates the management of complex applications on Kubernetes using custom controllers.',
        topic: 'Kubernetes Operators'
      }
    ]
  },
  11: {
    pre: [
      {
        id: 'pre-1',
        question: 'What is GitOps?',
        options: [
          'Using Git for version control',
          'A operational framework using Git as source of truth',
          'A Git workflow strategy',
          'A Git hosting service'
        ],
        correctAnswer: 1,
        explanation: 'GitOps is an operational framework that uses Git as the single source of truth for infrastructure and application deployments.',
        topic: 'GitOps Fundamentals'
      },
      {
        id: 'pre-2',
        question: 'What is ArgoCD?',
        options: [
          'A CI/CD tool',
          'A GitOps continuous delivery tool for Kubernetes',
          'A monitoring platform',
          'A security scanner'
        ],
        correctAnswer: 1,
        explanation: 'ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes that follows the GitOps pattern.',
        topic: 'ArgoCD'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'What is declarative configuration?',
        options: [
          'Writing step-by-step instructions',
          'Describing the desired state, not how to achieve it',
          'Documenting system requirements',
          'Creating configuration scripts'
        ],
        correctAnswer: 1,
        explanation: 'Declarative configuration describes what the desired state should be, rather than how to achieve it.',
        topic: 'Configuration Management'
      },
      {
        id: 'post-2',
        question: 'What is a Terraform module?',
        options: [
          'A single configuration file',
          'A reusable, shareable package of Terraform configurations',
          'A Terraform command',
          'A state file'
        ],
        correctAnswer: 1,
        explanation: 'A Terraform module is a container for multiple resources that are used together, allowing code reuse.',
        topic: 'Terraform Modules'
      },
      {
        id: 'post-3',
        question: 'What is continuous reconciliation in GitOps?',
        options: [
          'Regular code reviews',
          'Automatically ensuring actual state matches desired state',
          'Continuous testing',
          'Regular deployments'
        ],
        correctAnswer: 1,
        explanation: 'Continuous reconciliation ensures that the actual state of infrastructure matches the desired state defined in Git.',
        topic: 'GitOps Reconciliation'
      },
      {
        id: 'post-4',
        question: 'What is platform engineering?',
        options: [
          'Building physical platforms',
          'Creating self-service infrastructure platforms',
          'Engineering cloud platforms',
          'Platform configuration management'
        ],
        correctAnswer: 1,
        explanation: 'Platform engineering involves building self-service platforms that enable teams to deploy and manage applications independently.',
        topic: 'Platform Engineering'
      }
    ]
  },
  12: {
    pre: [
      {
        id: 'pre-1',
        question: 'What is a capstone project?',
        options: [
          'A small coding exercise',
          'A comprehensive project demonstrating full skill integration',
          'A documentation task',
          'A certification exam'
        ],
        correctAnswer: 1,
        explanation: 'A capstone project is a culminating academic project that demonstrates the integration of skills and knowledge.',
        topic: 'Capstone Projects'
      },
      {
        id: 'pre-2',
        question: 'What should be included in a technical portfolio?',
        options: [
          'Only code samples',
          'Projects, documentation, and problem-solving examples',
          'Personal photos',
          'Social media posts'
        ],
        correctAnswer: 1,
        explanation: 'A technical portfolio should showcase projects, documentation, architecture decisions, and problem-solving approaches.',
        topic: 'Career Development'
      }
    ],
    post: [
      {
        id: 'post-1',
        question: 'What is CI/CD pipeline security?',
        options: [
          'Securing the pipeline infrastructure',
          'Implementing security checks throughout the pipeline',
          'Monitoring pipeline performance',
          'Pipeline access control'
        ],
        correctAnswer: 1,
        explanation: 'CI/CD pipeline security involves implementing security checks, scans, and controls throughout the entire pipeline.',
        topic: 'DevSecOps'
      },
      {
        id: 'post-2',
        question: 'What is infrastructure monitoring?',
        options: [
          'Watching physical servers',
          'Tracking infrastructure performance and health',
          'Monitoring network traffic only',
          'Checking hardware temperatures'
        ],
        correctAnswer: 1,
        explanation: 'Infrastructure monitoring tracks the performance, availability, and health of infrastructure components.',
        topic: 'Monitoring'
      },
      {
        id: 'post-3',
        question: 'What is a production deployment strategy?',
        options: [
          'Deploying directly to production',
          'Using staged deployments with rollbacks',
          'Manual deployments only',
          'Testing in production'
        ],
        correctAnswer: 1,
        explanation: 'Production deployment strategies include blue-green, canary, and rolling deployments with rollback capabilities.',
        topic: 'Deployment Strategies'
      },
      {
        id: 'post-4',
        question: 'What is incident response?',
        options: [
          'Writing incident reports',
          'A structured approach to handling system incidents',
          'Creating incident tickets',
          'Incident prevention only'
        ],
        correctAnswer: 1,
        explanation: 'Incident response is a structured approach to detecting, responding to, and learning from system incidents.',
        topic: 'Incident Management'
      }
    ]
  }
};

export default function WeekAssessment() {
  const { weekNumber } = useParams<{ weekNumber: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const typeFromUrl = searchParams.get('type') as 'pre' | 'post' | null;
  const [assessmentType, setAssessmentType] = useState<'pre' | 'post'>(typeFromUrl || 'pre');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());
  const [preAssessmentScore, setPreAssessmentScore] = useState<number | null>(null);
  const [postAssessmentScore, setPostAssessmentScore] = useState<number | null>(null);

  const week = parseInt(weekNumber || '1');
  const questions = weekAssessments[week]?.[assessmentType] || [];
  const currentQ = questions[currentQuestion];

  const loadPreviousResults = useCallback(async () => {
    if (!user || !weekNumber) return;

    try {
      const preDoc = await getDoc(doc(db, 'assessments', `${user.uid}_week${weekNumber}_pre`));
      if (preDoc.exists()) {
        setPreAssessmentScore(preDoc.data().score);
      }

      const postDoc = await getDoc(doc(db, 'assessments', `${user.uid}_week${weekNumber}_post`));
      if (postDoc.exists()) {
        setPostAssessmentScore(postDoc.data().score);
      }
    } catch (error) {
      console.error('Error loading previous results:', error);
    }
  }, [user, weekNumber]);

  useEffect(() => {
    loadPreviousResults();
  }, [weekNumber, user, loadPreviousResults]);

  useEffect(() => {
    // Update assessment type when URL query parameter changes
    if (typeFromUrl && typeFromUrl !== assessmentType) {
      setAssessmentType(typeFromUrl);
      setCurrentQuestion(0);
      setAnswers({});
      setShowResults(false);
    }
  }, [typeFromUrl, assessmentType]);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = async () => {
    const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const score = Math.round((correct / questions.length) * 100);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    const result: AssessmentResult = {
      weekNumber: week,
      type: assessmentType,
      score,
      totalQuestions: questions.length,
      answers,
      completedAt: new Date(),
      timeSpent
    };

    // Save to Firestore
    if (user) {
      try {
        await setDoc(
          doc(db, 'assessments', `${user.uid}_week${weekNumber}_${assessmentType}`),
          {
            ...result,
            userId: user.uid
          }
        );

        if (assessmentType === 'pre') {
          setPreAssessmentScore(score);
        } else {
          setPostAssessmentScore(score);
        }
      } catch (error) {
        console.error('Error saving assessment:', error);
      }
    }

    setShowResults(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getImprovement = () => {
    if (preAssessmentScore !== null && postAssessmentScore !== null) {
      return postAssessmentScore - preAssessmentScore;
    }
    return null;
  };

  if (!weekAssessments[week]) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400">
          No assessment available for Week {week}.
        </div>
      </div>
    );
  }

  // Assessment selection screen (only show if no type specified in URL)
  if (!typeFromUrl && !showResults && currentQuestion === 0 && Object.keys(answers).length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Week {week} Assessment</h1>
            <p className="text-lg text-slate-300">
              Test your knowledge before and after the week
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pre-Assessment */}
            <div
              className={`bg-slate-800 rounded-lg p-6 border-2 cursor-pointer transition-all ${
                assessmentType === 'pre' ? 'border-indigo-500' : 'border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => setAssessmentType('pre')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Pre-Assessment</h2>
                </div>
                {preAssessmentScore !== null && (
                  <div className={`text-2xl font-bold ${getScoreColor(preAssessmentScore)}`}>
                    {preAssessmentScore}%
                  </div>
                )}
              </div>
              
              <p className="text-slate-300 mb-4">
                Take this before starting Week {week} to gauge your current knowledge.
              </p>
              
              <div className="text-sm text-slate-400">
                <div>• {weekAssessments[week].pre.length} questions</div>
                <div>• ~3 minutes</div>
                {preAssessmentScore !== null && (
                  <div className="mt-2 text-green-400">✓ Completed</div>
                )}
              </div>
            </div>

            {/* Post-Assessment */}
            <div
              className={`bg-slate-800 rounded-lg p-6 border-2 cursor-pointer transition-all ${
                assessmentType === 'post' ? 'border-indigo-500' : 'border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => setAssessmentType('post')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Post-Assessment</h2>
                </div>
                {postAssessmentScore !== null && (
                  <div className={`text-2xl font-bold ${getScoreColor(postAssessmentScore)}`}>
                    {postAssessmentScore}%
                  </div>
                )}
              </div>
              
              <p className="text-slate-300 mb-4">
                Take this after completing Week {week} to measure your improvement.
              </p>
              
              <div className="text-sm text-slate-400">
                <div>• {weekAssessments[week].post.length} questions</div>
                <div>• ~5 minutes</div>
                {postAssessmentScore !== null && (
                  <div className="mt-2 text-green-400">✓ Completed</div>
                )}
              </div>
            </div>
          </div>

          {/* Improvement Stats */}
          {preAssessmentScore !== null && postAssessmentScore !== null && (
            <div className="mt-8 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-600/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <h3 className="text-2xl font-bold text-white">Your Improvement</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Before</div>
                  <div className={`text-3xl font-bold ${getScoreColor(preAssessmentScore)}`}>
                    {preAssessmentScore}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">After</div>
                  <div className={`text-3xl font-bold ${getScoreColor(postAssessmentScore)}`}>
                    {postAssessmentScore}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Growth</div>
                  <div className={`text-3xl font-bold ${getImprovement()! >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {getImprovement()! >= 0 ? '+' : ''}{getImprovement()}%
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => {
                setAnswers({});
                setCurrentQuestion(0);
                setShowResults(false);
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start {assessmentType === 'pre' ? 'Pre' : 'Post'}-Assessment
            </button>
            <button
              onClick={() => navigate(`/week/${week}`)}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Week
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const score = Math.round((correct / questions.length) * 100);

    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              {assessmentType === 'pre' ? 'Pre' : 'Post'}-Assessment Complete!
            </h1>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 mb-8">
            <div className="text-center">
              <div className={`text-6xl font-bold text-white mb-2`}>
                {score}%
              </div>
              <div className="text-xl text-indigo-100">
                {correct} out of {questions.length} correct
              </div>
            </div>
          </div>

          {/* Review Answers */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Review Your Answers</h2>
            <div className="space-y-4">
              {questions.map((q, index) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                
                return (
                  <div key={q.id} className="p-4 bg-slate-900 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium mb-2">
                          {index + 1}. {q.question}
                        </p>
                        <p className="text-sm text-slate-400 mb-2">
                          Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                            {q.options[answers[q.id]]}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-slate-400 mb-2">
                            Correct answer: <span className="text-green-400">
                              {q.options[q.correctAnswer]}
                            </span>
                          </p>
                        )}
                        <p className="text-sm text-slate-300 italic">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/week/${week}`)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Week {week}
            </button>
            <button
              onClick={() => {
                setAnswers({});
                setCurrentQuestion(0);
                setShowResults(false);
                setAssessmentType(assessmentType === 'pre' ? 'post' : 'pre');
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Take {assessmentType === 'pre' ? 'Post' : 'Pre'}-Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Week {week} {assessmentType === 'pre' ? 'Pre' : 'Post'}-Assessment
              </h1>
              <p className="text-slate-400">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <Brain className="w-8 h-8 text-indigo-400" />
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 mb-6">
          <div className="mb-6">
            <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-xs rounded-full">
              {currentQ.topic}
            </span>
            <h2 className="text-2xl font-semibold text-white mt-4">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQ.id] === index;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQ.id, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600/20'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-indigo-500 bg-indigo-600' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-white">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={answers[currentQ.id] === undefined}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            answers[currentQ.id] !== undefined
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      </div>
    </div>
  );
}
