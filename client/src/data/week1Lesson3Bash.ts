/**
 * Week 1 Lesson 3 - Bash Scripting Basics
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week1Lesson3BashBasics: LeveledLessonContent = {
  id: 'week1-lesson3-bash-basics',
  lessonId: 'week1-lesson3-bash-basics',
  
  baseLesson: {
    title: 'Bash Scripting & Command Line Power Tools',
    description: 'Master Bash scripting essentials: variables, pipes, redirection, loops, and automation for DevOps workflows.',
    learningObjectives: [
      'Use variables and environment variables effectively',
      'Chain commands with pipes and redirect output',
      'Write loops and conditionals for automation',
      'Create executable Bash scripts for DevOps tasks',
      'Understand command substitution and exit codes'
    ],
    prerequisites: [
      'Linux command line basics (cd, ls, mkdir, etc.)',
      'Basic understanding of files and processes'
    ],
    estimatedTimePerLevel: {
      crawl: 50,
      walk: 40,
      runGuided: 35,
      runIndependent: 30
    }
  },

  crawl: {
    introduction: 'Learn Bash scripting step-by-step. Execute each command to understand variables, pipes, redirection, loops, and script creation.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Create and use a variable',
        command: 'NAME="DevOps Engineer" && echo "Hello, $NAME"',
        explanation: 'Variables store data. Use = to assign (no spaces!). Access with $VARIABLE_NAME. Double quotes allow variable expansion.',
        expectedOutput: 'Hello, DevOps Engineer',
        validationCriteria: [
          'Variable assigned successfully',
          'Variable value printed correctly',
          'Understands $VARIABLE syntax'
        ],
        commonMistakes: [
          'Spaces around = (NAME = "value" fails)',
          'Using single quotes (prevents expansion: echo \'$NAME\' prints literal $NAME)',
          'Forgetting $ when accessing variable'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Use environment variables',
        command: 'echo "Home directory: $HOME" && echo "Current user: $USER" && echo "Shell: $SHELL"',
        explanation: 'Environment variables are system-wide settings. $HOME is home directory, $USER is username, $SHELL is current shell. Always available.',
        expectedOutput: 'Home directory: /home/username\nCurrent user: username\nShell: /bin/bash',
        validationCriteria: [
          'All three environment variables displayed',
          'Values are correct for your system',
          'Understands difference between user variables and environment variables'
        ],
        commonMistakes: [
          'Confusing environment variables with regular variables',
          'Trying to modify system env vars without export'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Export a variable to make it available to subprocesses',
        command: 'export API_KEY="secret123" && bash -c \'echo "API Key in subprocess: $API_KEY"\'',
        explanation: 'export makes a variable available to child processes. Without export, subprocesses can\'t see the variable. Critical for scripts that call other scripts.',
        expectedOutput: 'API Key in subprocess: secret123',
        validationCriteria: [
          'Variable exported successfully',
          'Subprocess can access the variable',
          'Understands export purpose'
        ],
        commonMistakes: [
          'Forgetting export when variable needed in scripts',
          'Expecting non-exported variables to be available everywhere'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'Use pipes to chain commands',
        command: 'echo -e "apple\\nbanana\\ncherry\\napricot" | grep "a" | sort',
        explanation: 'Pipes (|) send output of one command as input to next. This creates "banana, apple, apricot" list, filters lines with "a", then sorts alphabetically.',
        expectedOutput: 'apple\napricot\nbanana',
        validationCriteria: [
          'Pipeline executes successfully',
          'Only lines containing "a" shown',
          'Results sorted alphabetically',
          'Understands data flows left to right through pipe'
        ],
        commonMistakes: [
          'Using > instead of | (> writes to file, | sends to command)',
          'Not understanding order matters (grep then sort ≠ sort then grep)'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'Redirect output to a file',
        command: 'echo "Build started at $(date)" > build.log && cat build.log',
        explanation: '> redirects stdout to file (overwrites). >> appends. $(date) is command substitution - runs date command and inserts result.',
        expectedOutput: 'Build started at [current date and time]',
        validationCriteria: [
          'File created with timestamp',
          'cat shows file contents',
          'Understands > overwrites existing file'
        ],
        commonMistakes: [
          'Accidentally overwriting important files with >',
          'Forgetting >> appends while > overwrites',
          'Not using quotes with command substitution containing spaces'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'Redirect stderr separately from stdout',
        command: 'ls /nonexistent 2> error.log && echo "Stdout works" > output.log; cat error.log output.log',
        explanation: 'File descriptor 1 = stdout, 2 = stderr. 2> redirects errors separately. Useful for logging errors vs normal output. ; runs commands sequentially.',
        expectedOutput: 'ls: cannot access \'/nonexistent\': No such file or directory\nStdout works',
        validationCriteria: [
          'Error message captured in error.log',
          'Success message in output.log',
          'Understands stderr vs stdout separation'
        ],
        commonMistakes: [
          'Using > for both stdout and stderr (errors still show on screen)',
          'Not knowing about file descriptors (0=stdin, 1=stdout, 2=stderr)'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'Use command substitution',
        command: 'CURRENT_DATE=$(date +%Y-%m-%d) && echo "Backup file: backup-$CURRENT_DATE.tar.gz"',
        explanation: '$(...) runs command and substitutes output. Alternative: backticks `...` (old style). Useful for dynamic file names, timestamps, etc.',
        expectedOutput: 'Backup file: backup-2025-12-10.tar.gz',
        validationCriteria: [
          'Date formatted as YYYY-MM-DD',
          'Variable contains command output',
          'Understands $(...) executes command inline'
        ],
        commonMistakes: [
          'Using quotes wrong (single quotes prevent substitution)',
          'Nesting $(...) incorrectly (use escaping or mix with backticks)'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'Write a simple for loop',
        command: 'for i in 1 2 3 4 5; do echo "Processing item $i"; done',
        explanation: 'for loop iterates over list. Syntax: for VAR in LIST; do COMMANDS; done. VAR takes each value in LIST sequentially.',
        expectedOutput: 'Processing item 1\nProcessing item 2\nProcessing item 3\nProcessing item 4\nProcessing item 5',
        validationCriteria: [
          'Loop executes 5 times',
          'Each iteration shows different number',
          'Understands loop syntax'
        ],
        commonMistakes: [
          'Forgetting semicolon before do',
          'Forgetting done at end',
          'Using wrong variable name in loop body'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'Loop over files in a directory',
        command: 'mkdir test_files && touch test_files/{file1.txt,file2.txt,file3.txt} && for file in test_files/*.txt; do echo "Found: $file"; done',
        explanation: 'Globbing pattern *.txt expands to all .txt files. Loop processes each file. Common DevOps pattern: process logs, configs, etc.',
        expectedOutput: 'Found: test_files/file1.txt\nFound: test_files/file2.txt\nFound: test_files/file3.txt',
        validationCriteria: [
          'All three files detected',
          'Loop processes each file',
          'Understands glob patterns'
        ],
        commonMistakes: [
          'Using quotes around glob (for file in "*.txt" treats as literal string)',
          'Not handling spaces in filenames (use quotes: "$file")'
        ]
      },
      {
        stepNumber: 10,
        instruction: 'Write a conditional (if statement)',
        command: 'if [ -f "build.log" ]; then echo "Build log exists"; else echo "No build log found"; fi',
        explanation: 'if tests condition. -f checks if file exists and is regular file. Must have spaces around brackets! fi ends if statement.',
        expectedOutput: 'Build log exists (or "No build log found" if file doesn\'t exist)',
        validationCriteria: [
          'Condition evaluated correctly',
          'Appropriate message displayed',
          'Understands test operators (-f, -d, -z, etc.)'
        ],
        commonMistakes: [
          'No spaces around brackets: [condition] fails, need [ condition ]',
          'Using = instead of == for string comparison',
          'Forgetting fi at end'
        ]
      },
      {
        stepNumber: 11,
        instruction: 'Create and execute a simple script',
        command: 'echo -e "#!/bin/bash\\necho \\"Hello from script\\"\\necho \\"Current directory: \\$(pwd)\\"" > hello.sh && chmod +x hello.sh && ./hello.sh',
        explanation: '#!/bin/bash is shebang - tells system to use Bash. chmod +x makes file executable. ./ runs script in current directory.',
        expectedOutput: 'Hello from script\nCurrent directory: [your current directory path]',
        validationCriteria: [
          'Script file created',
          'Script is executable',
          'Script runs successfully',
          'Understands shebang and execution'
        ],
        commonMistakes: [
          'Forgetting shebang (script might run in wrong shell)',
          'Forgetting chmod +x (Permission denied error)',
          'Trying to run without ./ (command not found if not in PATH)'
        ]
      },
      {
        stepNumber: 12,
        instruction: 'Use exit codes to check command success',
        command: 'ls /tmp > /dev/null && echo "Command succeeded (exit code: $?)" || echo "Command failed (exit code: $?)"',
        explanation: 'Every command returns exit code: 0 = success, non-zero = failure. $? contains last exit code. && runs if previous succeeded, || runs if failed.',
        expectedOutput: 'Command succeeded (exit code: 0)',
        validationCriteria: [
          'Exit code is 0 for successful ls',
          'Understands && and || logic',
          'Can use exit codes for error handling'
        ],
        commonMistakes: [
          'Forgetting $? changes with every command (save to variable if needed)',
          'Confusing && (AND) with || (OR)',
          'Not checking exit codes in scripts (leads to cascading failures)'
        ]
      }
    ],
    expectedOutcome: 'You can write Bash commands using variables, pipes, redirection, loops, conditionals, and scripts. You understand command substitution, exit codes, and basic automation patterns for DevOps tasks.'
  },

  walk: {
    introduction: 'Apply Bash knowledge with fill-in-the-blank exercises. Build practical automation snippets.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'Create a variable with today\'s date and use it in a backup filename',
        template: '___ASSIGN_VAR___=$(date +%Y%m%d)\necho "Creating backup: app-backup-$___VAR_NAME___.tar.gz"',
        blanks: [
          {
            id: 'ASSIGN_VAR',
            label: 'ASSIGN_VAR',
            hint: 'Variable name to store date (use uppercase, e.g., BACKUP_DATE)',
            correctValue: 'BACKUP_DATE',
            validationPattern: '^[A-Z_]+$'
          },
          {
            id: 'VAR_NAME',
            label: 'VAR_NAME',
            hint: 'Same variable name used above',
            correctValue: 'BACKUP_DATE',
            validationPattern: '^[A-Z_]+$'
          }
        ],
        solution: 'BACKUP_DATE=$(date +%Y%m%d)\necho "Creating backup: app-backup-$BACKUP_DATE.tar.gz"',
        explanation: 'Command substitution $(...) captures date output. Variable used in filename creates unique backups (e.g., app-backup-20251210.tar.gz).'
      },
      {
        exerciseNumber: 2,
        scenario: 'Find all .log files and count total lines across all logs',
        template: 'cat ___GLOB___ | ___COUNT_COMMAND___ -l',
        blanks: [
          {
            id: 'GLOB',
            label: 'GLOB',
            hint: 'Pattern to match all .log files',
            correctValue: '*.log',
            validationPattern: '.*\\.log$'
          },
          {
            id: 'COUNT_COMMAND',
            label: 'COUNT_COMMAND',
            hint: 'Command to count lines (word count)',
            correctValue: 'wc',
            validationPattern: '^wc$'
          }
        ],
        solution: 'cat *.log | wc -l',
        explanation: 'cat *.log concatenates all log files. Pipe to wc -l (word count lines) gives total line count. Useful for log analysis.'
      },
      {
        exerciseNumber: 3,
        scenario: 'Redirect both stdout and stderr to the same log file',
        template: './deploy.sh ___REDIRECT_STDOUT___ deploy.log ___REDIRECT_STDERR___',
        blanks: [
          {
            id: 'REDIRECT_STDOUT',
            label: 'REDIRECT_STDOUT',
            hint: 'Redirect stdout (file descriptor 1) to file',
            correctValue: '>',
            validationPattern: '^>$'
          },
          {
            id: 'REDIRECT_STDERR',
            label: 'REDIRECT_STDERR',
            hint: 'Redirect stderr (file descriptor 2) to stdout (>&1 or 2>&1)',
            correctValue: '2>&1',
            validationPattern: '^2>&1$'
          }
        ],
        solution: './deploy.sh > deploy.log 2>&1',
        explanation: '> redirects stdout to file. 2>&1 redirects stderr (fd 2) to wherever stdout (fd 1) is going. Captures all output in one log.'
      },
      {
        exerciseNumber: 4,
        scenario: 'Loop through all .sh files and make them executable',
        template: 'for ___LOOP_VAR___ in *.sh; do\n  ___MAKE_EXECUTABLE___ "$___LOOP_VAR___"\ndone',
        blanks: [
          {
            id: 'LOOP_VAR',
            label: 'LOOP_VAR',
            hint: 'Variable name for loop (commonly: file, script, or f)',
            correctValue: 'script',
            validationPattern: '^(file|script|f|item)$'
          },
          {
            id: 'MAKE_EXECUTABLE',
            label: 'MAKE_EXECUTABLE',
            hint: 'Command to add execute permission',
            correctValue: 'chmod +x',
            validationPattern: '^chmod\\s+\\+x$'
          }
        ],
        solution: 'for script in *.sh; do\n  chmod +x "$script"\ndone',
        explanation: 'Loop iterates over all .sh files. chmod +x adds execute permission. Quotes around "$script" handle filenames with spaces.'
      },
      {
        exerciseNumber: 5,
        scenario: 'Check if a file exists before processing it',
        template: 'if [ ___FILE_EXISTS_TEST___ "config.yml" ]; then\n  echo "Config found, processing..."\n  cat config.yml\nelse\n  echo "Error: config.yml not found"\n  ___EXIT_WITH_ERROR___\nfi',
        blanks: [
          {
            id: 'FILE_EXISTS_TEST',
            label: 'FILE_EXISTS_TEST',
            hint: 'Test operator to check if file exists (-f, -e, -d)',
            correctValue: '-f',
            validationPattern: '^-[fe]$'
          },
          {
            id: 'EXIT_WITH_ERROR',
            label: 'EXIT_WITH_ERROR',
            hint: 'Exit script with non-zero status (exit 1)',
            correctValue: 'exit 1',
            validationPattern: '^exit\\s+[1-9]$'
          }
        ],
        solution: 'if [ -f "config.yml" ]; then\n  echo "Config found, processing..."\n  cat config.yml\nelse\n  echo "Error: config.yml not found"\n  exit 1\nfi',
        explanation: '-f tests if file exists and is regular file. exit 1 terminates script with error status. Essential for robust scripts.'
      }
    ],
    hints: [
      'Always quote variables: "$VAR" not $VAR (handles spaces)',
      'Use $(...) for command substitution (clearer than backticks)',
      'Test operators: -f (file exists), -d (directory exists), -z (string empty)',
      'Exit codes: 0 = success, non-zero = failure'
    ]
  },

  runGuided: {
    objective: 'Create a backup script that archives directories, adds timestamps, and handles errors',
    conceptualGuidance: [
      'Accept a directory path as command-line argument ($1)',
      'Validate that directory exists before proceeding',
      'Create timestamped backup filename (YYYYMMDD_HHMMSS format)',
      'Use tar command to create compressed archive',
      'Verify tar succeeded by checking exit code',
      'Output success/failure message with backup location',
      'Make script executable and test with real directory'
    ],
    keyConceptsToApply: [
      'Command-line arguments ($1, $2, etc.)',
      'Conditional logic (if/else)',
      'Command substitution $(date)',
      'Exit codes and error handling',
      'Variables and string interpolation',
      'File/directory test operators'
    ],
    checkpoints: [
      {
        checkpoint: 'Script accepts and validates input',
        description: 'Script takes directory path as argument and validates it exists',
        validationCriteria: [
          'Uses $1 to access first argument',
          'Tests if directory exists with [ -d "$1" ]',
          'Prints error and exits if directory not found',
          'Shows usage message if no argument provided'
        ],
        hintIfStuck: 'if [ $# -eq 0 ]; then echo "Usage: $0 <directory>"; exit 1; fi. Then test [ -d "$1" ] to validate directory.'
      },
      {
        checkpoint: 'Creates timestamped backup',
        description: 'Generates backup archive with timestamp in filename',
        validationCriteria: [
          'Uses $(date +%Y%m%d_%H%M%S) for timestamp',
          'Tar command creates .tar.gz archive',
          'Filename includes directory name and timestamp',
          'Backup created in current directory or specified backup location'
        ],
        hintIfStuck: 'TIMESTAMP=$(date +%Y%m%d_%H%M%S); tar -czf "backup_$TIMESTAMP.tar.gz" "$1"'
      },
      {
        checkpoint: 'Handles errors properly',
        description: 'Checks tar exit code and reports success or failure',
        validationCriteria: [
          'Captures tar exit code with $?',
          'if [ $? -eq 0 ] checks for success',
          'Prints success message with backup filename',
          'Prints error message and exits if tar failed'
        ],
        hintIfStuck: 'After tar command: if [ $? -eq 0 ]; then echo "Backup successful: $FILENAME"; else echo "Backup failed!"; exit 1; fi'
      }
    ],
    resourcesAllowed: [
      'man tar (tar command manual)',
      'man date (date formatting)',
      'Bash conditionals cheat sheet'
    ]
  },

  runIndependent: {
    objective: 'Create a comprehensive automation script that organizes downloaded files by type, logs actions, and sends notifications',
    successCriteria: [
      'Script monitors a "downloads" directory for files',
      'Categorizes files by extension: .jpg/.png → images/, .pdf/.doc → documents/, .zip/.tar.gz → archives/',
      'Creates destination directories if they don\'t exist',
      'Moves files to appropriate subdirectories',
      'Logs all actions with timestamps to organized_files.log',
      'Counts files processed per category',
      'Handles errors gracefully (permissions, disk space)',
      'Accepts command-line argument for source directory (default: ~/Downloads)',
      'Displays summary report: "Organized X files: Y images, Z documents, etc."',
      'Optional: Email notification or desktop notification when complete'
    ],
    timeTarget: 30,
    minimumRequirements: [
      'Script processes at least 3 file types',
      'Creates destination directories automatically',
      'Logs actions to file with timestamps'
    ],
    evaluationRubric: [
      {
        criterion: 'Functionality',
        weight: 35,
        passingThreshold: 'Script correctly categorizes and moves files. All file types handled. No files lost or corrupted.'
      },
      {
        criterion: 'Error Handling',
        weight: 25,
        passingThreshold: 'Validates input directory exists. Checks move operations succeeded. Handles edge cases (spaces in names, special characters). Exits gracefully on errors.'
      },
      {
        criterion: 'Logging & Reporting',
        weight: 20,
        passingThreshold: 'All actions logged with timestamps. Summary report shows counts per category. Log format is clear and parseable.'
      },
      {
        criterion: 'Code Quality',
        weight: 20,
        passingThreshold: 'Uses functions for organization. Variables properly quoted. Comments explain logic. Follows Bash best practices (set -e, meaningful exit codes).'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=oxuRxtrO2Ag',
  documentation: [
    'https://www.gnu.org/software/bash/manual/',
    'https://devhints.io/bash',
    'https://www.shellcheck.net/ (script validator)',
    'Advanced Bash-Scripting Guide: https://tldp.org/LDP/abs/html/'
  ],
  relatedConcepts: [
    'Shell scripting best practices',
    'Command-line argument parsing',
    'Exit codes and error handling',
    'Cron jobs for scheduled execution',
    'Log rotation and management',
    'Defensive programming (set -e, set -u, set -o pipefail)'
  ]
};
