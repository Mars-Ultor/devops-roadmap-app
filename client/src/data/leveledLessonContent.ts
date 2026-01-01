/**
 * Example Level-Specific Lesson Content
 * Demonstrates Crawl → Walk → Run-Guided → Run-Independent progression
 */

import type {
  LeveledLessonContent
} from '../types/lessonContent';

// Example: Docker Basics Lesson
export const dockerBasicsLesson: LeveledLessonContent = {
  lessonId: 'week1-lesson3-docker-basics',
  
  baseLesson: {
    title: 'Docker Basics: Containers and Images',
    description: 'Learn to create, run, and manage Docker containers for application deployment.',
    learningObjectives: [
      'Understand Docker images and containers',
      'Pull images from Docker Hub',
      'Run containers with various configurations',
      'Manage container lifecycle'
    ],
    prerequisites: [
      'Linux command line basics',
      'Understanding of processes and isolation'
    ],
    estimatedTimePerLevel: {
      crawl: 30,
      walk: 25,
      runGuided: 20,
      runIndependent: 15
    }
  },

  // CRAWL: Step-by-step with every command provided
  crawl: {
    introduction: 'In this Crawl-level exercise, you will follow step-by-step instructions to run your first Docker container. Every command is provided - your job is to execute them perfectly and understand what each does.',
    
    steps: [
      {
        stepNumber: 1,
        instruction: 'First, let\'s verify Docker is installed and running on your system.',
        command: 'docker --version',
        explanation: 'This command checks the installed Docker version. You should see output like "Docker version 24.0.7".',
        expectedOutput: 'Docker version',
        validationCriteria: [
          'Command executes without errors',
          'Version number is displayed'
        ],
        commonMistakes: [
          'Docker service not running - start with: sudo systemctl start docker',
          'Permission denied - add user to docker group'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Pull the official nginx web server image from Docker Hub.',
        command: 'docker pull nginx:latest',
        explanation: 'This downloads the nginx image from Docker Hub. The "latest" tag gets the most recent stable version.',
        expectedOutput: 'Status: Downloaded newer image for nginx:latest',
        validationCriteria: [
          'Image downloaded successfully',
          'No connection errors',
          'Image appears in docker images list'
        ],
        commonMistakes: [
          'Network connectivity issues - check internet connection',
          'Registry authentication required - run docker login first'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Verify the nginx image was downloaded.',
        command: 'docker images nginx',
        explanation: 'Lists all nginx images on your system with their size, creation date, and tags.',
        expectedOutput: 'nginx   latest',
        validationCriteria: [
          'nginx image is listed',
          'Size is displayed (typically ~180MB)',
          'TAG shows "latest"'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'Run an nginx container in detached mode, mapping port 8080 to container port 80.',
        command: 'docker run -d -p 8080:80 --name my-nginx nginx:latest',
        explanation: '-d runs in background (detached), -p maps host port 8080 to container port 80, --name gives it a friendly name.',
        expectedOutput: 'Long container ID (64 characters)',
        validationCriteria: [
          'Container ID returned',
          'No port conflict errors',
          'Container appears in docker ps'
        ],
        commonMistakes: [
          'Port 8080 already in use - choose different port like 8081',
          'Container name already exists - use docker rm to remove or choose different name'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'Check that your nginx container is running.',
        command: 'docker ps',
        explanation: 'Lists all currently running containers with their status, ports, and names.',
        expectedOutput: 'my-nginx   Up',
        validationCriteria: [
          'Container named "my-nginx" is listed',
          'STATUS shows "Up" (not Exited)',
          'PORTS shows 0.0.0.0:8080->80/tcp'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'Test the nginx web server by accessing it from the command line.',
        command: 'curl http://localhost:8080',
        explanation: 'Sends HTTP request to the nginx server running in the container.',
        expectedOutput: 'Welcome to nginx!',
        validationCriteria: [
          'HTML content returned',
          'Contains "Welcome to nginx!"',
          'No connection refused errors'
        ],
        commonMistakes: [
          'curl not installed - install with: sudo apt install curl',
          'Wrong port number - verify with docker ps'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'View the nginx container logs.',
        command: 'docker logs my-nginx',
        explanation: 'Shows all output from the container, including access logs from your curl request.',
        expectedOutput: 'GET / HTTP/1.1',
        validationCriteria: [
          'Log entries visible',
          'Shows GET request from curl',
          'Status code 200 logged'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'Stop the nginx container gracefully.',
        command: 'docker stop my-nginx',
        explanation: 'Sends SIGTERM to container, giving it 10 seconds to shut down gracefully before forcing.',
        expectedOutput: 'my-nginx',
        validationCriteria: [
          'Container name echoed',
          'docker ps no longer shows container',
          'docker ps -a shows container with Exited status'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'Remove the stopped container to clean up.',
        command: 'docker rm my-nginx',
        explanation: 'Permanently deletes the container. The image remains available for future use.',
        expectedOutput: 'my-nginx',
        validationCriteria: [
          'Container name echoed',
          'docker ps -a no longer shows container',
          'No errors about container still running'
        ]
      }
    ],
    
    expectedOutcome: 'You have successfully pulled a Docker image, run a container, tested it, viewed logs, and cleaned up. You understand the basic Docker workflow and can repeat these steps for any Docker image.'
  },

  // WALK: Fill-in-the-blank templates
  walk: {
    introduction: 'Now you\'ll practice Docker commands with fill-in-the-blank templates. Key parameters are missing - use your knowledge from Crawl level to complete them correctly.',
    
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'You need to run a Redis container in the background, mapping host port 6379 to container port 6379, with the name "my-redis".',
        template: 'docker run __DETACH_FLAG__ -p __HOST_PORT__:__CONTAINER_PORT__ --name __CONTAINER_NAME__ redis:latest',
        blanks: [
          {
            id: 'detach',
            label: 'DETACH_FLAG',
            hint: 'Single letter flag for background/detached mode',
            correctValue: '-d',
            validationPattern: '^-d$'
          },
          {
            id: 'hostPort',
            label: 'HOST_PORT',
            hint: 'Default Redis port number',
            correctValue: '6379'
          },
          {
            id: 'containerPort',
            label: 'CONTAINER_PORT',
            hint: 'Redis listens on this port inside container',
            correctValue: '6379'
          },
          {
            id: 'containerName',
            label: 'CONTAINER_NAME',
            hint: 'Friendly name mentioned in scenario',
            correctValue: 'my-redis'
          }
        ],
        solution: 'docker run -d -p 6379:6379 --name my-redis redis:latest',
        explanation: 'This runs Redis in detached mode with port mapping. Both host and container use port 6379, which is Redis\'s default port.'
      },
      {
        exerciseNumber: 2,
        scenario: 'Pull the PostgreSQL database image, version 15.',
        template: 'docker __COMMAND__ __IMAGE__:__TAG__',
        blanks: [
          {
            id: 'command',
            label: 'COMMAND',
            hint: 'Docker command to download images',
            correctValue: 'pull'
          },
          {
            id: 'image',
            label: 'IMAGE',
            hint: 'Official PostgreSQL image name',
            correctValue: 'postgres'
          },
          {
            id: 'tag',
            label: 'TAG',
            hint: 'Version number specified in scenario',
            correctValue: '15'
          }
        ],
        solution: 'docker pull postgres:15',
        explanation: 'Tags let you specify exact versions. Using "15" instead of "latest" ensures consistent behavior.'
      },
      {
        exerciseNumber: 3,
        scenario: 'List all containers (including stopped ones).',
        template: 'docker ps __FLAG__',
        blanks: [
          {
            id: 'flag',
            label: 'FLAG',
            hint: 'Flag to show ALL containers, not just running',
            correctValue: '-a'
          }
        ],
        solution: 'docker ps -a',
        explanation: 'The -a flag shows all containers. Without it, only running containers appear.'
      }
    ],
    
    hints: [
      'Common flags: -d (detached), -p (port), -a (all), -v (volume)',
      'Port format: hostPort:containerPort',
      'Image format: name:tag (default tag is "latest")',
      'Container names must be unique on your system'
    ]
  },

  // RUN-GUIDED: Conceptual guidance, figure out the commands
  runGuided: {
    objective: 'Deploy a web application using Docker with proper port mapping, environment variables, and volume mounting.',
    
    conceptualGuidance: [
      'You need to containerize and run a web application',
      'The application requires environment variables for configuration',
      'Data must persist even if container is restarted',
      'Application must be accessible from your host machine'
    ],
    
    keyConceptsToApply: [
      'Image pulling and container lifecycle',
      'Port mapping for network access',
      'Environment variable injection with -e flag',
      'Volume mounting for data persistence'
    ],
    
    checkpoints: [
      {
        checkpoint: '1. Application Image Available',
        description: 'Ensure you have the application image on your system',
        validationCriteria: [
          'Image visible in docker images output',
          'Correct tag/version downloaded'
        ],
        hintIfStuck: 'Use docker pull to download images from registries'
      },
      {
        checkpoint: '2. Container Running Successfully',
        description: 'Container is running and healthy',
        validationCriteria: [
          'docker ps shows container with "Up" status',
          'No error logs in docker logs output',
          'Container didn\'t immediately exit'
        ],
        hintIfStuck: 'Check if required environment variables are set and ports aren\'t conflicting'
      },
      {
        checkpoint: '3. Application Accessible',
        description: 'Web application responds to HTTP requests',
        validationCriteria: [
          'curl or browser can reach the application',
          'Correct HTTP status code returned',
          'Application renders properly'
        ],
        hintIfStuck: 'Verify port mapping with docker ps and test with curl localhost:PORT'
      },
      {
        checkpoint: '4. Data Persists After Restart',
        description: 'Volume ensures data survives container restarts',
        validationCriteria: [
          'Volume mounted at correct path',
          'Data created in container exists on host',
          'After docker stop/start, data still accessible'
        ],
        hintIfStuck: 'Use -v flag to mount volumes: -v /host/path:/container/path'
      }
    ],
    
    resourcesAllowed: [
      'Docker official documentation',
      'docker --help and docker COMMAND --help',
      'Online Docker Hub for image details'
    ]
  },

  // RUN-INDEPENDENT: Just the objective and success criteria
  runIndependent: {
    objective: 'Deploy a multi-container application (web server + database) that is production-ready with health checks, restart policies, and proper networking.',
    
    successCriteria: [
      'Both containers running and communicating',
      'Web application accessible via HTTP on a mapped port',
      'Database persists data across container restarts',
      'Containers automatically restart on failure',
      'All containers on custom bridge network (not default)',
      'Environment variables used (no hardcoded secrets)',
      'Health check configured for web container',
      'Completed within time target'
    ],
    
    timeTarget: 15, // minutes
    
    minimumRequirements: [
      'Web server container running',
      'Database container running',
      'Application functional (can create/read data)',
      'Data persistence verified',
      'Custom network created and used'
    ],
    
    evaluationRubric: [
      {
        criterion: 'Containers running and functional',
        weight: 0.3,
        passingThreshold: 'Both containers in "Up" status with no errors in logs'
      },
      {
        criterion: 'Networking configured properly',
        weight: 0.2,
        passingThreshold: 'Containers on custom bridge network, can communicate by name'
      },
      {
        criterion: 'Data persistence',
        weight: 0.2,
        passingThreshold: 'Data survives container stop/start cycle'
      },
      {
        criterion: 'Production best practices',
        weight: 0.2,
        passingThreshold: 'Restart policy, health checks, no exposed secrets'
      },
      {
        criterion: 'Time efficiency',
        weight: 0.1,
        passingThreshold: 'Completed within 15 minutes'
      }
    ]
  },

  // Common resources across all levels
  videoUrl: 'https://example.com/docker-basics-video',
  documentation: [
    'https://docs.docker.com/engine/reference/run/',
    'https://docs.docker.com/engine/reference/commandline/cli/'
  ],
  relatedConcepts: [
    'Container orchestration',
    'Docker Compose',
    'Image layering and caching',
    'Container networking modes'
  ],
  
  troubleshootingGuide: {
    commonErrors: [
      {
        error: 'docker: Error response from daemon: driver failed programming external connectivity on endpoint',
        cause: 'Port already in use by another process or container',
        solution: 'Use "docker ps" and "sudo lsof -i :PORT" to find what\'s using the port, then either stop it or choose a different port',
        preventionTip: 'Always check port availability before starting containers'
      },
      {
        error: 'docker: Error response from daemon: Conflict. The container name is already in use',
        cause: 'A container with that name already exists (even if stopped)',
        solution: 'Remove existing container with "docker rm CONTAINER_NAME" or use a different name',
        preventionTip: 'Use unique container names or let Docker auto-generate names'
      },
      {
        error: 'Cannot connect to the Docker daemon. Is the docker daemon running?',
        cause: 'Docker service is not running',
        solution: 'Start Docker service: sudo systemctl start docker',
        preventionTip: 'Enable Docker to start on boot: sudo systemctl enable docker'
      }
    ],
    debuggingSteps: [
      'Check container status: docker ps -a',
      'View container logs: docker logs CONTAINER_NAME',
      'Inspect container details: docker inspect CONTAINER_NAME',
      'Check resource usage: docker stats',
      'Test network connectivity: docker exec CONTAINER_NAME ping other_container'
    ],
    whereToGetHelp: [
      'Docker official documentation',
      'Docker Community Forums',
      'Stack Overflow [docker] tag',
      'Your previous failure log entries'
    ]
  }
};

// Export collection for easy access
export const leveledLessons: Record<string, LeveledLessonContent> = {
  'week1-lesson3-docker-basics': dockerBasicsLesson
  // Add more lessons here...
};
