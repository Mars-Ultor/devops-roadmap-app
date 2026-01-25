/**
 * Week 1 Lesson Content - 4-Level Mastery Progression
 * DevOps Foundations & Linux Basics
 */

import type { LeveledLessonContent } from "../types/lessonContent";
import { week1Lesson1WhatIsDevOps } from "./week1Lesson1DevOps";
import { week1Lesson3BashBasics } from "./week1Lesson3Bash";

// ============================================
// WEEK 1, LESSON 2: Linux Command Line Basics
// ============================================

export const week1Lesson2LinuxBasics: LeveledLessonContent = {
  id: "week1-lesson2-linux-basics",
  lessonId: "week1-lesson2-linux-basics",

  baseLesson: {
    title: "Linux Command Line Fundamentals",
    description:
      "Master essential Linux commands for navigating, managing files, and understanding the filesystem.",
    learningObjectives: [
      "Navigate the Linux filesystem confidently",
      "Create, move, copy, and delete files and directories",
      "Use file permissions and ownership commands",
      "Understand absolute vs relative paths",
    ],
    prerequisites: [
      "Basic computer literacy",
      "Understanding of files and folders",
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 35,
      runGuided: 25,
      runIndependent: 15,
    },
  },

  // CRAWL: Step-by-step guided execution
  crawl: {
    introduction:
      "You will learn core Linux commands by executing each one step-by-step. Every command is provided with explanation.",
    steps: [
      {
        stepNumber: 1,
        instruction: "Check your current location in the filesystem",
        command: "pwd",
        explanation:
          "pwd (print working directory) shows where you are in the filesystem. You always start in your home directory.",
        expectedOutput: "/home/username",
        validationCriteria: [
          "Command executed without error",
          "Output shows a path starting with /",
          "Output contains your username or home",
        ],
        commonMistakes: [
          "Typing pwd with capital letters (Linux is case-sensitive)",
        ],
      },
      {
        stepNumber: 2,
        instruction:
          "List all files in the current directory including hidden files",
        command: "ls -la",
        explanation:
          "ls lists files. -l shows details (permissions, owner, size). -a shows hidden files (starting with .).",
        expectedOutput:
          "List of files with permissions, owner, size, and modification date",
        validationCriteria: [
          "Output shows file permissions (like drwxr-xr-x)",
          "Hidden files (.bashrc, .profile) are visible",
          "Each file shows owner and group",
        ],
        commonMistakes: [
          "Forgetting the hyphen before flags",
          "Using capital L instead of lowercase l",
        ],
      },
      {
        stepNumber: 3,
        instruction: 'Create a new directory called "devops-practice"',
        command: "mkdir devops-practice",
        explanation:
          "mkdir creates a new directory. This will be your workspace for learning.",
        validationCriteria: [
          "Directory created successfully",
          "No error message displayed",
          "ls shows devops-practice in current directory",
        ],
        commonMistakes: [
          "Using spaces in directory name without quotes",
          "Trying to create a directory that already exists",
        ],
      },
      {
        stepNumber: 4,
        instruction: "Change into the new directory",
        command: "cd devops-practice",
        explanation:
          "cd (change directory) moves you to a different folder. You can use relative paths (from current location) or absolute paths (from root /).",
        validationCriteria: [
          "Current directory changed (verify with pwd)",
          "Prompt shows new directory name",
          "ls shows empty directory (nothing created yet)",
        ],
        commonMistakes: [
          "Misspelling the directory name",
          "Forgetting cd only changes location, does not create directories",
        ],
      },
      {
        stepNumber: 5,
        instruction: 'Create a file called "welcome.txt" with content',
        command: 'echo "Hello DevOps World!" > welcome.txt',
        explanation:
          "echo prints text. > redirects output to a file (creates or overwrites). This is how you create simple text files from the command line.",
        expectedOutput: "No output (success means silence in Linux)",
        validationCriteria: [
          "File created successfully",
          'cat welcome.txt shows "Hello DevOps World!"',
          "ls shows welcome.txt in directory",
        ],
        commonMistakes: [
          "Using >> instead of > (appends instead of overwrites)",
          "Forgetting quotes around text with spaces",
        ],
      },
      {
        stepNumber: 6,
        instruction: "Display the contents of welcome.txt",
        command: "cat welcome.txt",
        explanation:
          "cat (concatenate) displays file contents. For large files, use less or head/tail instead.",
        expectedOutput: "Hello DevOps World!",
        validationCriteria: [
          'Exact text "Hello DevOps World!" displayed',
          "No errors about file not found",
        ],
      },
      {
        stepNumber: 7,
        instruction: "Copy welcome.txt to backup.txt",
        command: "cp welcome.txt backup.txt",
        explanation:
          "cp copies files. First argument is source, second is destination. Original file remains unchanged.",
        validationCriteria: [
          "backup.txt created",
          "Both files exist (ls shows 2 files)",
          "Both files have same content (cat backup.txt matches cat welcome.txt)",
        ],
      },
      {
        stepNumber: 8,
        instruction: 'Move backup.txt to a new directory called "backups"',
        command: "mkdir backups && mv backup.txt backups/",
        explanation:
          '&& runs second command only if first succeeds. mv moves (renames) files. backups/ means "move into backups directory".',
        validationCriteria: [
          "backups directory created",
          "backup.txt no longer in current directory",
          "backup.txt exists in backups/ directory",
          "ls backups/ shows backup.txt",
        ],
      },
      {
        stepNumber: 9,
        instruction: "Check file permissions",
        command: "ls -l welcome.txt",
        explanation:
          "Permissions show as: -rw-r--r-- meaning: - (file), rw- (owner can read/write), r-- (group can read), r-- (others can read).",
        expectedOutput: "-rw-r--r-- 1 username username 20 date welcome.txt",
        validationCriteria: [
          "Output shows permission string (-rw-r--r--)",
          "Shows file owner and group",
          "Shows file size in bytes",
        ],
      },
      {
        stepNumber: 10,
        instruction: "Make welcome.txt executable",
        command: "chmod +x welcome.txt",
        explanation:
          "chmod changes file permissions. +x adds execute permission for everyone. Verify with ls -l (permissions now show x).",
        validationCriteria: [
          "Permissions changed to -rwxr-xr-x",
          "x appears in permission string",
          "File is now executable (though it's not a script)",
        ],
      },
      {
        stepNumber: 11,
        instruction: "Delete the welcome.txt file",
        command: "rm welcome.txt",
        explanation:
          "rm removes files. Be careful! There's no recycle bin in Linux. Once deleted, it's gone. Use rm -i for confirmation prompts.",
        validationCriteria: [
          "File deleted successfully",
          "ls no longer shows welcome.txt",
          "backup.txt still exists in backups/",
        ],
        commonMistakes: [
          "Trying to use rm on directories without -r flag",
          "Deleting the wrong file - always double-check file names!",
        ],
      },
      {
        stepNumber: 12,
        instruction: "Return to parent directory and remove practice folder",
        command: "cd .. && rm -r devops-practice",
        explanation:
          "cd .. moves up one directory. rm -r recursively deletes directory and all contents. -r flag required for directories.",
        validationCriteria: [
          "Now in parent directory (pwd confirms)",
          "devops-practice directory deleted",
          "ls no longer shows devops-practice",
        ],
        commonMistakes: [
          "Forgetting -r flag (gives error: cannot remove directory)",
          "Being in the directory you're trying to delete",
        ],
      },
    ],
    expectedOutcome:
      "You have successfully navigated the Linux filesystem, created files and directories, managed permissions, and cleaned up. You understand the basic commands needed for DevOps work.",
  },

  // WALK: Fill-in-the-blank templates
  walk: {
    introduction:
      "Now practice Linux commands with fill-in-the-blank exercises. Key parameters are missing - use your knowledge from Crawl level.",
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Create a directory called "project" and change into it',
        template: "__CREATE_DIR__ project && __CHANGE_DIR__ project",
        blanks: [
          {
            id: "__CREATE_DIR__",
            label: "CREATE_DIR",
            hint: "Command to make a directory",
            correctValue: "mkdir",
            validationPattern: "^mkdir$",
          },
          {
            id: "__CHANGE_DIR__",
            label: "CHANGE_DIR",
            hint: "Command to change directory",
            correctValue: "cd",
            validationPattern: "^cd$",
          },
        ],
        solution: "mkdir project && cd project",
        explanation:
          "mkdir creates directories, cd navigates to them. && ensures second command runs only if first succeeds.",
      },
      {
        exerciseNumber: 2,
        scenario:
          'Create a file "app.log" containing "Server started on port 8080"',
        template: '__PRINT__ "__TEXT__" __REDIRECT__ app.log',
        blanks: [
          {
            id: "__PRINT__",
            label: "PRINT",
            hint: "Command to print text",
            correctValue: "echo",
            validationPattern: "^echo$",
          },
          {
            id: "__TEXT__",
            label: "TEXT",
            hint: "Text to write to file",
            correctValue: "Server started on port 8080",
            validationPattern: ".*Server started.*8080.*",
          },
          {
            id: "__REDIRECT__",
            label: "REDIRECT",
            hint: "Symbol to redirect output to file",
            correctValue: ">",
            validationPattern: "^>$",
          },
        ],
        solution: 'echo "Server started on port 8080" > app.log',
        explanation:
          "echo outputs text, > writes to file (overwrites if exists). Use >> to append instead.",
      },
      {
        exerciseNumber: 3,
        scenario:
          "List all files including hidden ones with detailed information",
        template: "__LIST__ __FLAG_LONG__ __FLAG_ALL__",
        blanks: [
          {
            id: "__LIST__",
            label: "LIST",
            hint: "Command to list files",
            correctValue: "ls",
            validationPattern: "^ls$",
          },
          {
            id: "__FLAG_LONG__",
            label: "FLAG_LONG",
            hint: "Flag for long format (detailed info)",
            correctValue: "-l",
            validationPattern: "^-l$",
          },
          {
            id: "__FLAG_ALL__",
            label: "FLAG_ALL",
            hint: "Flag to show hidden files",
            correctValue: "-a",
            validationPattern: "^-a$",
          },
        ],
        solution: "ls -l -a",
        explanation:
          "ls lists files. -l shows permissions/ownership/size in long format. -a shows hidden files (starting with .). Flags can be combined as -la or written separately as -l -a.",
      },
      {
        exerciseNumber: 4,
        scenario: "Make app.log executable for owner only",
        template: "__CHANGE_PERM__ __MODE__ app.log",
        blanks: [
          {
            id: "__CHANGE_PERM__",
            label: "CHANGE_PERM",
            hint: "Command to change permissions",
            correctValue: "chmod",
            validationPattern: "^chmod$",
          },
          {
            id: "__MODE__",
            label: "MODE",
            hint: "Permission mode to add execute for user",
            correctValue: "u+x",
            validationPattern: String.raw`^(u\+x|700|740|750)$`,
          },
        ],
        solution: "chmod u+x app.log",
        explanation:
          "chmod changes permissions. u+x adds execute for user (owner). Could also use numeric: chmod 744 app.log",
      },
      {
        exerciseNumber: 5,
        scenario:
          'Copy app.log to backup.log and then move backup.log into a new "logs" directory',
        template:
          "__COPY__ app.log backup.log && mkdir logs && __MOVE__ backup.log logs/",
        blanks: [
          {
            id: "__COPY__",
            label: "COPY",
            hint: "Command to copy files",
            correctValue: "cp",
            validationPattern: "^cp$",
          },
          {
            id: "__MOVE__",
            label: "MOVE",
            hint: "Command to move/rename files",
            correctValue: "mv",
            validationPattern: "^mv$",
          },
        ],
        solution: "cp app.log backup.log && mkdir logs && mv backup.log logs/",
        explanation:
          'cp copies (source remains), mv moves (source removed). logs/ means "into logs directory".',
      },
    ],
    hints: [
      "Linux commands are case-sensitive - use lowercase",
      "Flags start with - (single dash for single letter, double dash for words)",
      "Use tab completion to avoid typos in file/directory names",
      "pwd shows current location if you get lost",
    ],
  },

  // RUN-GUIDED: Conceptual guidance only
  runGuided: {
    objective:
      "Set up a directory structure for a CI/CD pipeline with proper security",
    terminalEnabled: true,
    conceptualGuidance: [
      "Create a parent directory for your CI/CD pipeline",
      "Inside, create subdirectories for: builds, deploy, secrets, artifacts, and logs",
      "Create sample build artifacts in the artifacts directory",
      "Create a deployment script in deploy directory with execute permissions",
      "Set restrictive permissions on secrets (only owner can access)",
      "Set appropriate permissions on logs (readable by all, writable by owner)",
      "Create documentation explaining the directory structure",
      "Verify all paths use relative references from the pipeline root",
    ],
    keyConceptsToApply: [
      "Directory creation (mkdir)",
      "Navigation (cd, pwd)",
      "File creation (echo, touch)",
      "Permission management (chmod)",
      "File operations (cp, mv, rm)",
      "Verification (ls -la, cat)",
    ],
    checkpoints: [
      {
        checkpoint: "Directory structure created",
        description:
          "webapp/ directory with src/, config/, logs/, backups/ subdirectories",
        validationCriteria: [
          "All 4 subdirectories exist",
          "Directory tree is organized logically",
          "pwd confirms you're in the right location",
        ],
        hintIfStuck:
          "Use mkdir -p to create parent and child directories in one command",
      },
      {
        checkpoint: "Config file created with secrets",
        description: "config/app.conf contains database credentials",
        validationCriteria: [
          "File exists in config directory",
          "Contains DB_USER, DB_PASS, API_KEY entries",
          "Permissions are restrictive (600 or 400)",
        ],
        hintIfStuck:
          "Use echo with > to create file, chmod 600 to restrict access to owner only",
      },
      {
        checkpoint: "Log directory is writable",
        description: "logs/ allows anyone to write log files",
        validationCriteria: [
          "Permissions show w for group and others",
          "ls -ld logs/ shows drwxrwxrwx or similar",
          "Can create files as any user",
        ],
        hintIfStuck:
          "chmod 777 logs/ makes directory fully permissive (use with caution in production!)",
      },
    ],
    resourcesAllowed: [
      "man pages (man ls, man chmod)",
      "Linux command cheat sheet",
      "Google for specific permission patterns",
    ],
  },

  // RUN-INDEPENDENT: Just the objective
  runIndependent: {
    objective:
      "Create a complete Linux filesystem environment for a CI/CD pipeline with proper security",
    successCriteria: [
      "cicd/ parent directory exists",
      "Subdirectories: builds/, deploy/, secrets/, artifacts/, logs/",
      "secrets/ has 700 permissions (owner only)",
      "logs/ has 755 permissions (everyone reads, owner writes)",
      "artifacts/ contains at least 2 sample build files",
      "deploy/ contains a deployment script (deploy.sh) with execute permissions",
      "All file paths use relative references from cicd/ root",
      "README.md in cicd/ explains directory structure",
    ],
    timeTarget: 15,
    minimumRequirements: [
      "Proper permission separation (secrets locked down)",
      "Executable deployment script",
      "Documented structure",
    ],
    evaluationRubric: [
      {
        criterion: "Directory structure completeness",
        weight: 0.3,
        passingThreshold: "All 5 subdirectories exist with correct names",
      },
      {
        criterion: "Security (permissions)",
        weight: 0.3,
        passingThreshold:
          "secrets/ is 700, logs/ is 755, deploy.sh is executable",
      },
      {
        criterion: "Functionality",
        weight: 0.2,
        passingThreshold:
          "deploy.sh can be executed and contains valid commands",
      },
      {
        criterion: "Documentation",
        weight: 0.2,
        passingThreshold: "README.md clearly explains each directory's purpose",
      },
    ],
    strategyGuide: {
      suggestedStructure: [
        "Start by creating the main cicd/ directory",
        "Create subdirectories in logical order: builds/, deploy/, artifacts/, logs/, secrets/",
        "Set permissions immediately after creating directories",
        "Create sample files in artifacts/ and deploy/ directories",
        "Test permissions by trying to access directories as different users",
        "Document the structure in README.md last",
      ],
      questionsToConsider: [
        {
          section: "Directory Organization",
          questions: [
            "What should be the permission scheme for each directory?",
            "Which directories need to be accessible by CI/CD tools?",
            "How will secrets be protected from unauthorized access?",
            "What logging strategy fits this pipeline structure?",
          ],
        },
        {
          section: "Security Considerations",
          questions: [
            "How do 700 vs 755 permissions affect access control?",
            "What happens if deployment scripts aren't executable?",
            "How can you verify permission settings are correct?",
            "What security risks exist with improper permissions?",
          ],
        },
        {
          section: "CI/CD Integration",
          questions: [
            "How will build artifacts be stored and accessed?",
            "What deployment scripts are typically needed?",
            "How should logs be organized for troubleshooting?",
            "What directory structure supports automated cleanup?",
          ],
        },
      ],
      commonPitfalls: [
        "Creating directories without setting permissions immediately",
        "Using absolute paths instead of relative paths from cicd/ root",
        "Forgetting to make deployment scripts executable",
        "Setting overly permissive permissions on secrets directory",
        "Not testing directory access after setting permissions",
        "Creating files before their target directories exist",
      ],
      writingTips: [
        "Use relative paths for all file references within the cicd/ structure",
        "Test permissions by attempting operations as different users",
        "Document permission schemes and their security implications",
        "Consider automation scripts for directory creation and permission setup",
      ],
    },
  },

  videoUrl: "https://example.com/linux-basics",
  documentation: [
    "Linux man pages: man ls, man chmod, man mkdir",
    "Linux filesystem hierarchy: /home, /etc, /var",
    "Permission calculator: chmod-calculator.com",
  ],
  relatedConcepts: [
    "File permissions (rwx)",
    "Absolute vs relative paths",
    "Standard streams (stdin, stdout, stderr)",
    "Environment variables",
  ],
};

export const WEEK_1_LESSONS = [
  week1Lesson1WhatIsDevOps,
  week1Lesson2LinuxBasics,
  week1Lesson3BashBasics,
];
