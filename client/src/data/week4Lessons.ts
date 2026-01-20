/**
 * Week 4 Lesson Content - 4-Level Mastery Progression
 * Docker & Containerization
 */

import type { LeveledLessonContent } from "../types/lessonContent";
import { week4Lesson1WhyContainers } from "./week4Lesson1WhyContainers";
import { week4Lesson3DockerCompose } from "./week4Lesson3DockerCompose";

// ============================================
// WEEK 4, LESSON 2: Docker Container Basics
// ============================================

export const week4Lesson2DockerBasics: LeveledLessonContent = {
  lessonId: "week4-lesson2-docker-basics",

  baseLesson: {
    title: "Docker Container Fundamentals",
    description:
      "Learn Docker basics: images, containers, running applications, and basic lifecycle management.",
    learningObjectives: [
      "Understand the difference between images and containers",
      "Run containers from Docker Hub images",
      "Execute commands inside running containers",
      "Manage container lifecycle (start, stop, remove)",
    ],
    prerequisites: [
      "Linux command line basics",
      "Understanding of processes and applications",
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 35,
      runGuided: 30,
      runIndependent: 25,
    },
  },

  crawl: {
    introduction:
      "Learn Docker by running containers step-by-step. You will pull images, run containers, and manage their lifecycle.",
    steps: [
      {
        stepNumber: 1,
        instruction: "Verify Docker is installed and running",
        command: "docker --version",
        explanation:
          "Check that Docker is installed. This shows the version of Docker engine.",
        expectedOutput: "Docker version 24.0.0, build abc1234",
        validationCriteria: [
          "Command executes without error",
          "Version number is displayed",
          'No "command not found" error',
        ],
        commonMistakes: [
          "Docker daemon not running (need to start Docker Desktop or service)",
          "Permission errors (may need sudo on Linux)",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Pull your first Docker image from Docker Hub",
        command: "docker pull nginx:latest",
        explanation:
          'Download the nginx web server image from Docker Hub. "latest" is a tag indicating the most recent version.',
        expectedOutput:
          "latest: Pulling from library/nginx\n...\nStatus: Downloaded newer image for nginx:latest",
        validationCriteria: [
          "Image downloads successfully",
          'Status shows "Downloaded" or "Image is up to date"',
          "No network or permission errors",
        ],
        commonMistakes: [
          "No internet connection",
          "Forgetting to specify tag (defaults to :latest anyway)",
          "Typing image name incorrectly",
        ],
      },
      {
        stepNumber: 3,
        instruction: "List downloaded images",
        command: "docker images",
        explanation:
          "See all images on your system. Shows repository name, tag, image ID, creation time, and size.",
        expectedOutput:
          "REPOSITORY   TAG       IMAGE ID       CREATED        SIZE\nnginx        latest    abc123def456   2 weeks ago    142MB",
        validationCriteria: [
          "nginx image appears in list",
          "Shows IMAGE ID, SIZE, and other columns",
          "Command executes without error",
        ],
        commonMistakes: [
          "Confusing images with containers (images are templates, containers are running instances)",
          "Expecting to see containers in this list (use docker ps for that)",
        ],
      },
      {
        stepNumber: 4,
        instruction: "Run a container from the nginx image",
        command: "docker run -d -p 8080:80 --name my-nginx nginx:latest",
        explanation:
          "-d runs detached (background), -p maps port 8080 on host to port 80 in container, --name gives it a friendly name.",
        expectedOutput: "abc123def456789... (long container ID)",
        validationCriteria: [
          "Long container ID is returned",
          "Container starts without error",
          "Port 8080 is not already in use",
        ],
        commonMistakes: [
          "Port 8080 already in use (try different port)",
          "Forgetting -d flag (container runs in foreground, blocks terminal)",
          "Container name already exists (use different name or remove old one)",
        ],
      },
      {
        stepNumber: 5,
        instruction: "List running containers",
        command: "docker ps",
        explanation:
          "Shows all currently running containers with details: ID, image, command, status, ports, and name.",
        expectedOutput:
          'CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                  NAMES\nabc123...      nginx:latest   "nginx -g daemon off"    10 seconds ago  Up 9 seconds   0.0.0.0:8080->80/tcp   my-nginx',
        validationCriteria: [
          "my-nginx container appears in list",
          'STATUS shows "Up" (running)',
          "PORTS shows 0.0.0.0:8080->80/tcp mapping",
        ],
        commonMistakes: [
          "Using docker images instead (that lists images, not containers)",
          "Not seeing container (it may have exited - check docker ps -a for all containers)",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Test the nginx web server in your browser or with curl",
        command: "curl http://localhost:8080",
        explanation:
          "Access the nginx web server running in the container through the exposed port 8080.",
        expectedOutput:
          'HTML content starting with <!DOCTYPE html> and containing "Welcome to nginx!"',
        validationCriteria: [
          "HTML response received",
          'Contains "Welcome to nginx" text',
          "No connection refused error",
        ],
        commonMistakes: [
          "Using wrong port (container listens on 80 inside, but you exposed 8080 outside)",
          "Container not actually running (check docker ps)",
          "Firewall blocking connection",
        ],
      },
      {
        stepNumber: 7,
        instruction: "View container logs",
        command: "docker logs my-nginx",
        explanation:
          "See stdout and stderr output from the container. Shows nginx access logs and errors.",
        expectedOutput:
          '172.17.0.1 - - [date/time] "GET / HTTP/1.1" 200 615 "-" "curl/7.68.0"',
        validationCriteria: [
          "Log entries are displayed",
          "Shows access logs from your curl request",
          "No errors indicating container problems",
        ],
        commonMistakes: [
          "Expecting logs to auto-update (add -f flag for follow mode)",
          "Forgetting container name or ID",
        ],
      },
      {
        stepNumber: 8,
        instruction: "Execute a command inside the running container",
        command: "docker exec -it my-nginx /bin/bash",
        explanation:
          "Opens an interactive bash shell inside the running container. -it means interactive with TTY (terminal).",
        expectedOutput:
          "root@abc123def456:/# (you are now inside the container)",
        validationCriteria: [
          "Prompt changes to show you are inside container",
          "Shows root user in container",
          "Can run commands like ls, pwd, etc.",
        ],
        commonMistakes: [
          "Forgetting -it flags (command executes but you cannot interact)",
          "Container does not have bash installed (try /bin/sh instead)",
          'To exit: type "exit" or press Ctrl+D',
        ],
      },
      {
        stepNumber: 9,
        instruction: "Stop the running container",
        command: "docker stop my-nginx",
        explanation:
          "Gracefully stop the container. Sends SIGTERM, waits 10 seconds, then SIGKILL if needed.",
        expectedOutput: "my-nginx",
        validationCriteria: [
          "Container name echoed back",
          "docker ps no longer shows the container",
          "docker ps -a shows container with Exited status",
        ],
        commonMistakes: [
          "Confusing stop with rm (stop pauses, rm deletes)",
          "Container takes long to stop (may need docker kill for immediate termination)",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Start the stopped container again",
        command: "docker start my-nginx",
        explanation:
          "Restart a stopped container. It resumes with same configuration (ports, name, etc.).",
        expectedOutput: "my-nginx",
        validationCriteria: [
          "docker ps shows container running again",
          "curl http://localhost:8080 works again",
          "Container ID remains the same as before",
        ],
        commonMistakes: [
          "Using docker run instead (creates new container)",
          "Forgetting container name",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Remove the container (must be stopped first)",
        command: "docker stop my-nginx && docker rm my-nginx",
        explanation:
          "Stop then delete the container. && ensures rm only runs if stop succeeds.",
        expectedOutput: "my-nginx\nmy-nginx",
        validationCriteria: [
          "Container stops and is removed",
          "docker ps -a no longer shows the container",
          "Image still exists (check docker images)",
        ],
        commonMistakes: [
          "Trying to remove running container (must stop first or use docker rm -f)",
          "Confusing removing container with removing image",
        ],
      },
      {
        stepNumber: 12,
        instruction: "Remove the nginx image",
        command: "docker rmi nginx:latest",
        explanation:
          "Delete the nginx image from your system. Frees up disk space.",
        expectedOutput: "Untagged: nginx:latest\nDeleted: sha256:abc123...",
        validationCriteria: [
          "Image is deleted",
          "docker images no longer shows nginx",
          "No containers using this image exist",
        ],
        commonMistakes: [
          "Trying to delete image while containers use it (must remove containers first)",
          "Using docker rm instead of docker rmi (rm is for containers)",
        ],
      },
    ],
    expectedOutcome:
      "You have mastered Docker basics: pulling images, running containers, executing commands inside containers, managing lifecycle (start/stop/remove). You can now run containerized applications.",
  },

  walk: {
    introduction:
      "Apply Docker knowledge with fill-in-the-blank exercises covering common container workflows.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario:
          "You need to run a Redis database container in the background with port mapping.",
        template:
          "docker _____ redis:latest\ndocker _____ -d -p 6379:6379 --name my-redis redis:latest\ndocker _____ my-redis",
        blanks: [
          {
            id: "pull",
            label: "Download image",
            hint: "Command to download image from Docker Hub",
            correctValue: "pull",
            validationPattern: "^pull$",
          },
          {
            id: "run",
            label: "Run container",
            hint: "Command to create and start container",
            correctValue: "run",
            validationPattern: "^run$",
          },
          {
            id: "check",
            label: "Check if running",
            hint: "Command to list running containers",
            correctValue: "ps",
            validationPattern: "^ps$",
          },
        ],
        solution:
          "docker pull redis:latest\ndocker run -d -p 6379:6379 --name my-redis redis:latest\ndocker ps",
        explanation:
          "pull downloads image, run -d starts container in background with port mapping, ps confirms it is running.",
      },
      {
        exerciseNumber: 2,
        scenario:
          "Inspect logs and execute a command inside a running PostgreSQL container.",
        template:
          "docker _____ my-postgres\ndocker _____ -it my-postgres psql -U postgres",
        blanks: [
          {
            id: "logs",
            label: "View container logs",
            hint: "Command to see container output",
            correctValue: "logs",
            validationPattern: "^logs$",
          },
          {
            id: "exec",
            label: "Execute command inside",
            hint: "Command to run something in running container",
            correctValue: "exec",
            validationPattern: "^exec$",
          },
        ],
        solution:
          "docker logs my-postgres\ndocker exec -it my-postgres psql -U postgres",
        explanation:
          "logs shows container output, exec runs command inside running container. -it makes it interactive.",
      },
      {
        exerciseNumber: 3,
        scenario: "Stop and remove a container, then clean up the image.",
        template:
          "docker _____ my-app\ndocker _____ my-app\ndocker _____ myapp-image:1.0",
        blanks: [
          {
            id: "stop",
            label: "Stop container",
            hint: "Command to gracefully stop container",
            correctValue: "stop",
            validationPattern: "^stop$",
          },
          {
            id: "remove",
            label: "Remove container",
            hint: "Command to delete stopped container",
            correctValue: "rm",
            validationPattern: "^rm$",
          },
          {
            id: "removeImage",
            label: "Remove image",
            hint: "Command to delete image",
            correctValue: "rmi",
            validationPattern: "^rmi$",
          },
        ],
        solution:
          "docker stop my-app\ndocker rm my-app\ndocker rmi myapp-image:1.0",
        explanation:
          "stop pauses container, rm deletes container, rmi removes image. Must remove container before image.",
      },
      {
        exerciseNumber: 4,
        scenario:
          "Run a temporary container that auto-removes after execution.",
        template:
          'docker run _____ ubuntu echo "Hello Docker"\ndocker _____ -a',
        blanks: [
          {
            id: "autoRemove",
            label: "Auto-remove flag",
            hint: "Flag to automatically remove container when it exits",
            correctValue: "--rm",
            validationPattern: "^--rm$",
          },
          {
            id: "listAll",
            label: "List all containers",
            hint: "Command to see all containers including stopped",
            correctValue: "ps",
            validationPattern: "^ps$",
          },
        ],
        solution: 'docker run --rm ubuntu echo "Hello Docker"\ndocker ps -a',
        explanation:
          "--rm flag auto-deletes container after exit. Useful for one-off commands. ps -a shows it is gone.",
      },
      {
        exerciseNumber: 5,
        scenario:
          "List all images, then remove unused/dangling images to free space.",
        template: "docker _____\ndocker image _____ -a",
        blanks: [
          {
            id: "listImages",
            label: "List images",
            hint: "Command to show all downloaded images",
            correctValue: "images",
            validationPattern: "^images$",
          },
          {
            id: "cleanup",
            label: "Remove unused images",
            hint: "Subcommand to clean up dangling images",
            correctValue: "prune",
            validationPattern: "^prune$",
          },
        ],
        solution: "docker images\ndocker image prune -a",
        explanation:
          "images lists all images, prune -a removes unused images to free disk space.",
      },
    ],
    hints: [
      "docker ps shows running containers, docker ps -a shows all (including stopped)",
      "Always use --name to give containers meaningful names",
      "Port format: -p HOST_PORT:CONTAINER_PORT",
      "Use docker rm -f to force remove running container (stop + rm combined)",
    ],
  },

  runGuided: {
    objective:
      "Deploy a multi-tier web application using Docker containers (web server + database)",
    conceptualGuidance: [
      "Run a MySQL database container with persistent storage",
      "Run a web application container (nginx or apache) linked to database",
      "Configure environment variables for database connection",
      "Test connectivity between containers",
      "Verify data persists after container restart",
      "Clean up all resources when done",
    ],
    keyConceptsToApply: [
      "Docker volumes for data persistence",
      "Container networking (default bridge)",
      "Environment variables (-e flag)",
      "Port mapping for external access",
    ],
    checkpoints: [
      {
        checkpoint: "Database container running",
        description:
          "MySQL container running with persistent volume and accessible on port 3306",
        validationCriteria: [
          "docker ps shows mysql container running",
          "Container uses volume for /var/lib/mysql",
          "Environment variables set: MYSQL_ROOT_PASSWORD, MYSQL_DATABASE",
          "Can connect with: docker exec -it <container> mysql -u root -p",
        ],
        hintIfStuck:
          "Use: docker run -d --name mysql-db -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=myapp -v mysql-data:/var/lib/mysql -p 3306:3306 mysql:8.0",
      },
      {
        checkpoint: "Web server accessible",
        description:
          "Web server container running and accessible via browser on port 80 or 8080",
        validationCriteria: [
          "docker ps shows web server container",
          "curl localhost:<port> returns HTML response",
          "Container serves custom content (not just default page)",
          "Logs show successful startup (docker logs <container>)",
        ],
        hintIfStuck:
          "Use nginx or httpd image, map port with -p, mount custom HTML with -v or copy files in Dockerfile",
      },
      {
        checkpoint: "Data persists across restarts",
        description:
          "Verified data persistence: stop/start containers without data loss",
        validationCriteria: [
          "Create data in MySQL, stop container, start container, data still exists",
          "Volume persists after docker rm (check docker volume ls)",
          "Web server content survives restart",
          "Both containers can be removed and recreated using same volumes",
        ],
        hintIfStuck:
          "Volumes persist independently of containers. Use docker volume inspect <volume> to see location.",
      },
    ],
    resourcesAllowed: [
      "docker run --help",
      "https://hub.docker.com (for image documentation)",
      "docker volume --help",
    ],
  },

  runIndependent: {
    objective:
      "Deploy a complete 3-tier application stack using Docker: frontend, backend API, and database",
    successCriteria: [
      "Three containers running: web frontend (nginx), API backend (node/python), database (postgres/mysql)",
      "Custom Docker network created for container communication",
      "Frontend accessible on port 80/8080 from host machine",
      "API accessible from frontend (proper networking)",
      "Database accessible from API (environment variables configured)",
      "All data persists in named volumes",
      "README documents how to start/stop entire stack",
      "Can tear down and rebuild stack without data loss",
    ],
    timeTarget: 25,
    minimumRequirements: [
      "At least 2 containers running (web + database)",
      "Port mapping allows external access to web interface",
      "Database uses volume for persistence",
    ],
    evaluationRubric: [
      {
        criterion: "Container Architecture",
        weight: 30,
        passingThreshold:
          "All three tiers running in separate containers. Proper separation of concerns. Containers use official base images.",
      },
      {
        criterion: "Networking & Communication",
        weight: 25,
        passingThreshold:
          "Custom Docker network created. Containers communicate by name. Proper port exposure for external access. No hardcoded IPs.",
      },
      {
        criterion: "Data Persistence",
        weight: 25,
        passingThreshold:
          "Named volumes for database and any user uploads. Data survives container removal. Volume configuration documented.",
      },
      {
        criterion: "Documentation & Reproducibility",
        weight: 20,
        passingThreshold:
          "README with clear start/stop instructions. All commands documented. Can rebuild stack from scratch following docs.",
      },
    ],
  },

  videoUrl: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
  documentation: [
    "https://docs.docker.com/get-started/",
    "https://docs.docker.com/engine/reference/run/",
    "https://hub.docker.com",
  ],
  relatedConcepts: [
    "Containerization vs virtualization",
    "Docker images and layers",
    "Docker Compose (next lesson)",
    "Container orchestration (Kubernetes)",
  ],
};

export const WEEK_4_LESSONS = [
  week4Lesson1WhyContainers,
  week4Lesson2DockerBasics,
  week4Lesson3DockerCompose,
];
