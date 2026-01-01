/**
 * Week 1-12 Curriculum Data
 * Imports proper 4-level mastery lessons from individual week files
 */

import type { LeveledLessonContent } from '../types/lessonContent';
import type { LabStep } from '../components/StepValidation';
import type { TCSTask } from '../components/training/TCSDisplay';
import { WEEK_1_LESSONS } from './week1Lessons';
import { WEEK_2_LESSONS } from './week2Lessons';
import { WEEK_3_LESSONS } from './week3Lessons';
import { WEEK_4_LESSONS } from './week4Lessons';
import { WEEK_5_LESSONS } from './week5Lessons';
import { WEEK_6_LESSONS } from './week6Lessons';
import { WEEK_7_LESSONS } from './week7Lessons';
import { WEEK_8_LESSONS } from './week8Lessons';
import { WEEK_9_LESSONS } from './week9Lessons';
import { WEEK_10_LESSONS } from './week10Lessons';
import { WEEK_11_LESSONS } from './week11Lessons';
import { WEEK_12_LESSONS } from './week12Lessons';

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  xp: number;
  tasks: string[];
  hints?: string[];
  steps?: LabStep[]; // Step-by-step validation system
  tcs?: TCSTask; // Phase 11: Task, Conditions, Standards (military-style)
}

export interface Week {
  weekNumber: number;
  title: string;
  description: string;
  objectives: string[];
  lessons: LeveledLessonContent[];
  labs: Lab[];
  project?: {
    id: string;
    title: string;
    description: string;
    xp: number;
  };
}

export const curriculumData: Week[] = [
  // WEEK 1: DevOps Foundations & Linux Basics
  {
    weekNumber: 1,
    title: "DevOps Foundations & Linux Basics",
    description: "Start your DevOps journey by understanding core concepts and mastering the Linux command line.",
    objectives: [
      "Understand DevOps culture and principles",
      "Navigate the Linux filesystem confidently",
      "Manage files, permissions, and processes",
      "Use essential command-line tools"
    ],
    lessons: WEEK_1_LESSONS,
    labs: [
      {
        id: "w1-lab1",
        title: "Linux Command Line Basics",
        description: "Practice essential Linux commands in an interactive terminal environment.",
        difficulty: "beginner",
        estimatedTime: 30,
        xp: 100,
        tasks: [
          "Navigate to the /home directory and list all files",
          "Create a new directory called 'devops-practice'",
          "Create three text files: file1.txt, file2.txt, file3.txt",
          "Move all .txt files into the devops-practice directory",
          "Display the current working directory"
        ],
        hints: [
          "Use 'cd /home' to navigate",
          "Use 'mkdir' to create directories",
          "Use 'touch' to create files",
          "Use 'mv *.txt devops-practice/' to move files"
        ],
        tcs: {
          task: "Demonstrate proficiency with basic Linux command-line operations including navigation, directory creation, file manipulation, and file movement in a terminal environment.",
          conditions: {
            timeLimit: 30,
            environment: "Linux terminal with standard utilities (bash, coreutils)",
            resources: [
              "Full access to Linux terminal",
              "All standard command-line utilities (cd, mkdir, touch, mv, pwd, ls)",
              "Read/write permissions in /home directory",
              "Lab instruction document with task descriptions"
            ],
            restrictions: [
              "No graphical file manager - command line only",
              "No copying commands from external sources during execution",
              "Must use terminal commands, not scripting"
            ]
          },
          standards: [
            {
              id: "std-1",
              description: "Successfully navigate to /home directory and confirm location with pwd",
              required: true,
              met: false
            },
            {
              id: "std-2",
              description: "Create directory 'devops-practice' in correct location with proper naming",
              required: true,
              met: false
            },
            {
              id: "std-3",
              description: "Create exactly three text files (file1.txt, file2.txt, file3.txt) in /home",
              required: true,
              met: false
            },
            {
              id: "std-4",
              description: "Move all .txt files into devops-practice directory, leaving no files in /home",
              required: true,
              met: false
            },
            {
              id: "std-5",
              description: "All commands executed without errors or permission issues",
              required: true,
              met: false
            },
            {
              id: "std-6",
              description: "Final directory structure matches expected state (verified with ls -R)",
              required: true,
              met: false
            }
          ]
        },
        steps: [
          {
            number: 1,
            title: "Navigate to /home directory",
            description: "Use cd command to navigate to /home and verify with pwd",
            status: 'in_progress',
            completedValidations: 0,
            validations: [
              {
                type: 'command_success',
                cmd: 'pwd | grep -q "/home"',
              }
            ]
          },
          {
            number: 2,
            title: "Create devops-practice directory",
            description: "Create a new directory called 'devops-practice' in /home",
            status: 'locked',
            completedValidations: 0,
            validations: [
              {
                type: 'file_exists',
                target: '/home/devops-practice'
              },
              {
                type: 'command_success',
                cmd: 'test -d /home/devops-practice'
              }
            ]
          },
          {
            number: 3,
            title: "Create text files",
            description: "Create file1.txt, file2.txt, and file3.txt in /home",
            status: 'locked',
            completedValidations: 0,
            validations: [
              {
                type: 'file_exists',
                target: '/home/file1.txt'
              },
              {
                type: 'file_exists',
                target: '/home/file2.txt'
              },
              {
                type: 'file_exists',
                target: '/home/file3.txt'
              }
            ]
          },
          {
            number: 4,
            title: "Move files to devops-practice",
            description: "Move all .txt files into the devops-practice directory",
            status: 'locked',
            completedValidations: 0,
            validations: [
              {
                type: 'file_exists',
                target: '/home/devops-practice/file1.txt'
              },
              {
                type: 'file_exists',
                target: '/home/devops-practice/file2.txt'
              },
              {
                type: 'file_exists',
                target: '/home/devops-practice/file3.txt'
              },
              {
                type: 'command_success',
                cmd: 'test ! -f /home/file1.txt && test ! -f /home/file2.txt && test ! -f /home/file3.txt'
              }
            ]
          }
        ]
      },
      {
        id: "w1-lab2",
        title: "File Permissions & Ownership",
        description: "Understand and modify Linux file permissions using chmod and chown.",
        difficulty: "beginner",
        estimatedTime: 25,
        xp: 100,
        tasks: [
          "Create a file called script.sh",
          "Make the file executable using chmod",
          "Check the file permissions with ls -l",
          "Create a directory and set permissions to 755"
        ],
        hints: [
          "chmod +x makes files executable",
          "chmod 755 sets rwxr-xr-x permissions"
        ],
        tcs: {
          task: "Demonstrate understanding of Linux file permissions by creating files, modifying executable permissions, and setting directory permissions using chmod.",
          conditions: {
            timeLimit: 25,
            environment: "Linux terminal with file system access",
            resources: [
              "Linux terminal with bash shell",
              "chmod and chown utilities",
              "ls command for permission verification",
              "Write access to working directory"
            ],
            restrictions: [
              "Must use chmod numeric notation (755) for directory",
              "No GUI tools - command line only"
            ]
          },
          standards: [
            {
              id: "std-1",
              description: "Create script.sh file in current directory",
              required: true,
              met: false
            },
            {
              id: "std-2",
              description: "Set executable permission on script.sh (verify with ls -l showing 'x' flag)",
              required: true,
              met: false
            },
            {
              id: "std-3",
              description: "Create directory with correct 755 permissions (rwxr-xr-x)",
              required: true,
              met: false
            },
            {
              id: "std-4",
              description: "Verify permissions match requirements using ls -l",
              required: true,
              met: false
            }
          ]
        }
      },
      {
        id: "w1-lab3",
        title: "Process Management",
        description: "Learn to view, manage, and kill processes in Linux.",
        difficulty: "intermediate",
        estimatedTime: 20,
        xp: 120,
        tasks: [
          "List all running processes",
          "Find processes using grep",
          "Start a background process",
          "Kill a process by PID"
        ],
        tcs: {
          task: "Demonstrate Linux process management skills including listing processes, filtering with grep, managing background processes, and terminating processes by PID.",
          conditions: {
            timeLimit: 20,
            environment: "Linux terminal with running processes",
            resources: [
              "ps, top, and grep commands",
              "kill command for process termination",
              "Background process execution (&)",
              "Job control commands (jobs, fg, bg)"
            ],
            restrictions: [
              "Do not kill critical system processes",
              "Must use PID (not process name) for kill command"
            ]
          },
          standards: [
            {
              id: "std-1",
              description: "Successfully list all running processes using ps aux or equivalent",
              required: true,
              met: false
            },
            {
              id: "std-2",
              description: "Filter process list using grep to find specific processes",
              required: true,
              met: false
            },
            {
              id: "std-3",
              description: "Start process in background and verify with jobs command",
              required: true,
              met: false
            },
            {
              id: "std-4",
              description: "Identify process PID and terminate using kill command",
              required: true,
              met: false
            },
            {
              id: "std-5",
              description: "Verify process termination (process no longer in ps output)",
              required: true,
              met: false
            }
          ]
        }
      }
    ]
  },

  // WEEK 2: Version Control with Git & GitHub
  {
    weekNumber: 2,
    title: "Version Control with Git & GitHub",
    description: "Master Git workflows and collaboration on GitHub - essential for modern DevOps.",
    objectives: [
      "Understand Git fundamentals and branching",
      "Create and manage repositories",
      "Collaborate using pull requests",
      "Write meaningful commit messages"
    ],
    lessons: WEEK_2_LESSONS,
    labs: [
      {
        id: "w2-lab1",
        title: "Your First Git Repository",
        description: "Initialize a repository, make commits, and push to GitHub.",
        difficulty: "beginner",
        estimatedTime: 30,
        xp: 100,
        tasks: [
          "Initialize a new Git repository",
          "Create a README.md file",
          "Make your first commit",
          "Connect to a remote GitHub repository",
          "Push your code to GitHub"
        ]
      },
      {
        id: "w2-lab2",
        title: "Branching & Merging",
        description: "Practice creating branches, making changes, and merging.",
        difficulty: "intermediate",
        estimatedTime: 35,
        xp: 120,
        tasks: [
          "Create a feature branch",
          "Make changes in the feature branch",
          "Merge the feature branch to main",
          "Resolve a merge conflict"
        ]
      }
    ]
  },

  // WEEK 3: Cloud Fundamentals with AWS
  {
    weekNumber: 3,
    title: "Cloud Fundamentals with AWS",
    description: "Get hands-on with AWS core services - the foundation for the Cloud Resume Challenge.",
    objectives: [
      "Navigate the AWS Console confidently",
      "Understand IAM, S3, and CloudFront",
      "Deploy static websites on S3",
      "Configure custom domains with Route 53"
    ],
    lessons: WEEK_3_LESSONS,
    labs: [
      {
        id: "w3-lab1",
        title: "Deploy a Static Website on S3",
        description: "Host your first website on AWS S3 with public access.",
        difficulty: "beginner",
        estimatedTime: 40,
        xp: 150,
        tasks: [
          "Create an S3 bucket",
          "Enable static website hosting",
          "Upload HTML/CSS files",
          "Configure bucket policy for public access",
          "Access your website via S3 URL"
        ]
      },
      {
        id: "w3-lab2",
        title: "CloudFront CDN Setup",
        description: "Add CloudFront distribution for faster global access and HTTPS.",
        difficulty: "intermediate",
        estimatedTime: 35,
        xp: 150,
        tasks: [
          "Create a CloudFront distribution",
          "Point it to your S3 bucket",
          "Configure SSL certificate",
          "Test global edge locations"
        ]
      },
      {
        id: "w3-lab3",
        title: "Custom Domain with Route 53",
        description: "Register a domain and configure DNS for your website.",
        difficulty: "intermediate",
        estimatedTime: 30,
        xp: 120,
        tasks: [
          "Register a domain (or use existing)",
          "Create a hosted zone in Route 53",
          "Add A record pointing to CloudFront",
          "Verify domain resolution"
        ]
      }
    ]
  },

  // WEEK 4: Containers & Docker
  {
    weekNumber: 4,
    title: "Containers & Docker",
    description: "Master containerization with Docker - the foundation of modern application deployment.",
    objectives: [
      "Understand containerization vs virtualization",
      "Build and run Docker containers",
      "Create Dockerfiles for applications",
      "Use Docker Compose for multi-container apps"
    ],
    lessons: WEEK_4_LESSONS,
    labs: [
      {
        id: "w4-lab1",
        title: "Your First Docker Container",
        description: "Pull images, run containers, and understand Docker basics.",
        difficulty: "beginner",
        estimatedTime: 30,
        xp: 100,
        tasks: [
          "Pull nginx image from Docker Hub",
          "Run nginx container on port 8080",
          "Access the running container",
          "Stop and remove the container"
        ]
      },
      {
        id: "w4-lab2",
        title: "Build a Custom Docker Image",
        description: "Create a Dockerfile and build your own image.",
        difficulty: "intermediate",
        estimatedTime: 45,
        xp: 150,
        tasks: [
          "Write a Dockerfile for a Node.js app",
          "Build the image",
          "Run a container from your image",
          "Push image to Docker Hub"
        ]
      }
    ]
  },

  // WEEK 5: CI/CD with GitHub Actions
  {
    weekNumber: 5,
    title: "CI/CD with GitHub Actions",
    description: "Automate testing and deployment with continuous integration and delivery pipelines.",
    objectives: [
      "Understand CI/CD principles",
      "Create GitHub Actions workflows",
      "Automate testing and building",
      "Deploy applications automatically"
    ],
    lessons: WEEK_5_LESSONS,
    labs: [
      {
        id: "w5-lab1",
        title: "Your First GitHub Actions Workflow",
        description: "Create a workflow to run tests on every push.",
        difficulty: "beginner",
        estimatedTime: 35,
        xp: 120,
        tasks: [
          "Create .github/workflows directory",
          "Write a basic CI workflow",
          "Trigger workflow on push",
          "View workflow results"
        ]
      },
      {
        id: "w5-lab2",
        title: "Build and Deploy Pipeline",
        description: "Automate Docker builds and deployments.",
        difficulty: "intermediate",
        estimatedTime: 50,
        xp: 150,
        tasks: [
          "Add Docker build step to workflow",
          "Push images to Docker Hub",
          "Deploy to staging environment",
          "Add approval gates"
        ]
      }
    ]
  },

  // WEEK 6: Infrastructure as Code with Terraform
  {
    weekNumber: 6,
    title: "Infrastructure as Code with Terraform",
    description: "Define and manage infrastructure using code with Terraform.",
    objectives: [
      "Understand IaC principles",
      "Write Terraform configurations",
      "Manage AWS resources with code",
      "Use Terraform state and modules"
    ],
    lessons: WEEK_6_LESSONS,
    labs: [
      {
        id: "w6-lab1",
        title: "Terraform Basics",
        description: "Create your first Terraform configuration for AWS.",
        difficulty: "beginner",
        estimatedTime: 40,
        xp: 150,
        tasks: [
          "Install Terraform",
          "Write main.tf for S3 bucket",
          "Run terraform init, plan, apply",
          "Destroy resources with terraform destroy"
        ]
      },
      {
        id: "w6-lab2",
        title: "Multi-Resource Infrastructure",
        description: "Build a complete infrastructure with VPC, EC2, and RDS.",
        difficulty: "advanced",
        estimatedTime: 60,
        xp: 200,
        tasks: [
          "Create VPC with subnets",
          "Launch EC2 instance",
          "Set up RDS database",
          "Configure security groups"
        ]
      }
    ]
  },

  // WEEK 7: Kubernetes Fundamentals
  {
    weekNumber: 7,
    title: "Kubernetes Fundamentals",
    description: "Master container orchestration with Kubernetes.",
    objectives: [
      "Understand Kubernetes architecture",
      "Deploy applications to clusters",
      "Manage pods, deployments, and services",
      "Configure scaling and updates"
    ],
    lessons: WEEK_7_LESSONS,
    labs: [
      {
        id: "w7-lab1",
        title: "Deploy to Kubernetes",
        description: "Run your first application on a Kubernetes cluster.",
        difficulty: "intermediate",
        estimatedTime: 45,
        xp: 150,
        tasks: [
          "Set up local Kubernetes with minikube",
          "Create a deployment",
          "Expose with a service",
          "Scale the deployment"
        ]
      },
      {
        id: "w7-lab2",
        title: "ConfigMaps and Secrets",
        description: "Manage configuration and sensitive data in Kubernetes.",
        difficulty: "intermediate",
        estimatedTime: 35,
        xp: 120,
        tasks: [
          "Create ConfigMap for app config",
          "Create Secret for credentials",
          "Mount to pods",
          "Update and rollout changes"
        ]
      }
    ]
  },

  // WEEK 8: Monitoring & Observability
  {
    weekNumber: 8,
    title: "Monitoring & Observability",
    description: "Implement monitoring, logging, and alerting for production systems.",
    objectives: [
      "Set up Prometheus and Grafana",
      "Create dashboards and alerts",
      "Implement centralized logging",
      "Understand observability best practices"
    ],
    lessons: WEEK_8_LESSONS,
    labs: [
      {
        id: "w8-lab1",
        title: "Prometheus & Grafana Setup",
        description: "Install and configure monitoring stack.",
        difficulty: "intermediate",
        estimatedTime: 50,
        xp: 150,
        tasks: [
          "Deploy Prometheus",
          "Configure scrape targets",
          "Install Grafana",
          "Create dashboards"
        ]
      },
      {
        id: "w8-lab2",
        title: "Alert Configuration",
        description: "Set up alerts for critical metrics.",
        difficulty: "intermediate",
        estimatedTime: 40,
        xp: 130,
        tasks: [
          "Define alert rules",
          "Configure Alertmanager",
          "Set up notification channels",
          "Test alert firing"
        ]
      }
    ]
  },

  // WEEK 9: DevSecOps & Security
  {
    weekNumber: 9,
    title: "DevSecOps & Security",
    description: "Integrate security practices into your DevOps workflow.",
    objectives: [
      "Understand DevSecOps principles",
      "Scan containers for vulnerabilities",
      "Implement secrets management",
      "Secure infrastructure and applications"
    ],
    lessons: WEEK_9_LESSONS,
    labs: [
      {
        id: "w9-lab1",
        title: "Container Security Scanning",
        description: "Scan Docker images for vulnerabilities.",
        difficulty: "intermediate",
        estimatedTime: 35,
        xp: 120,
        tasks: [
          "Install Trivy scanner",
          "Scan Docker images",
          "Fix critical vulnerabilities",
          "Add scanning to CI pipeline"
        ]
      },
      {
        id: "w9-lab2",
        title: "Secrets Management with Vault",
        description: "Use HashiCorp Vault for secrets.",
        difficulty: "advanced",
        estimatedTime: 55,
        xp: 180,
        tasks: [
          "Deploy Vault",
          "Store secrets",
          "Integrate with applications",
          "Implement rotation policies"
        ]
      }
    ]
  },

  // WEEK 10: Advanced Kubernetes & Cloud Native
  {
    weekNumber: 10,
    title: "Advanced Kubernetes & Cloud Native",
    description: "Master advanced Kubernetes patterns and cloud-native architectures.",
    objectives: [
      "Implement service meshes",
      "Use operators and CRDs",
      "Manage stateful applications",
      "Deploy microservices patterns"
    ],
    lessons: WEEK_10_LESSONS,
    labs: [
      {
        id: "w10-lab1",
        title: "Service Mesh with Istio",
        description: "Deploy and configure Istio service mesh.",
        difficulty: "advanced",
        estimatedTime: 60,
        xp: 200,
        tasks: [
          "Install Istio",
          "Configure traffic management",
          "Implement circuit breakers",
          "Set up mTLS"
        ]
      },
      {
        id: "w10-lab2",
        title: "Stateful Applications",
        description: "Deploy databases with StatefulSets.",
        difficulty: "advanced",
        estimatedTime: 50,
        xp: 180,
        tasks: [
          "Create StatefulSet",
          "Configure persistent volumes",
          "Scale stateful apps",
          "Implement backup/restore"
        ]
      }
    ]
  },

  // WEEK 11: GitOps & Advanced IaC
  {
    weekNumber: 11,
    title: "GitOps & Advanced IaC",
    description: "Implement GitOps workflows and advanced infrastructure patterns.",
    objectives: [
      "Understand GitOps principles",
      "Deploy with ArgoCD",
      "Use advanced Terraform patterns",
      "Implement platform engineering"
    ],
    lessons: WEEK_11_LESSONS,
    labs: [
      {
        id: "w11-lab1",
        title: "GitOps with ArgoCD",
        description: "Set up continuous deployment with ArgoCD.",
        difficulty: "advanced",
        estimatedTime: 55,
        xp: 180,
        tasks: [
          "Install ArgoCD",
          "Connect Git repository",
          "Create application definitions",
          "Implement sync strategies"
        ]
      },
      {
        id: "w11-lab2",
        title: "Terraform Modules & Workspaces",
        description: "Build reusable infrastructure modules.",
        difficulty: "advanced",
        estimatedTime: 50,
        xp: 170,
        tasks: [
          "Create Terraform modules",
          "Use workspaces for environments",
          "Implement remote state",
          "Set up module registry"
        ]
      }
    ]
  },

  // WEEK 12: Capstone & Career Preparation
  {
    weekNumber: 12,
    title: "Capstone Project & Career Skills",
    description: "Complete your capstone project and prepare for your DevOps career.",
    objectives: [
      "Build end-to-end DevOps pipeline",
      "Prepare technical portfolio",
      "Practice interview questions",
      "Understand career paths"
    ],
    lessons: WEEK_12_LESSONS,
    labs: [],
    project: {
      id: "devops-capstone",
      title: "Full-Stack DevOps Capstone",
      description: "Build a complete production-ready application with full CI/CD, IaC, monitoring, and security.",
      xp: 1000
    }
  }
];

export const cloudResumeChallenge = {
  id: "cloud-resume-challenge",
  title: "Cloud Resume Challenge (Legacy)",
  description: "Note: This is an optional legacy project. The main curriculum now includes comprehensive projects throughout all 12 weeks.",
  difficulty: "advanced" as const,
  estimatedTime: 480,
  totalXP: 1800,
  phases: []
};
