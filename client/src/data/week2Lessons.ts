/**
 * Week 2 Lesson Content - 4-Level Mastery Progression
 * Version Control with Git & GitHub
 */

import type { LeveledLessonContent } from '../types/lessonContent';
import { week2Lesson2WhyVersionControl } from './week2Lesson2VersionControl';
import { week2Lesson3GitHubWorkflow } from './week2Lesson3GitHub';

// ============================================
// WEEK 2, LESSON 1: Git Version Control Basics
// ============================================

export const week2Lesson1GitBasics: LeveledLessonContent = {
  lessonId: 'week2-lesson1-git-basics',
  
  baseLesson: {
    title: 'Git Version Control Fundamentals',
    description: 'Learn essential Git commands for tracking changes, collaborating, and managing code versions.',
    learningObjectives: [
      'Initialize repositories and track changes with Git',
      'Commit code with meaningful messages',
      'Work with branches for parallel development',
      'Push and pull changes to/from remote repositories'
    ],
    prerequisites: [
      'Linux command line basics',
      'Understanding of files and directories'
    ],
    estimatedTimePerLevel: {
      crawl: 50,
      walk: 40,
      runGuided: 30,
      runIndependent: 20
    }
  },

  crawl: {
    introduction: 'Learn Git by executing each command step-by-step. You will create a repository, make commits, and work with branches.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Configure your Git identity (required before first commit)',
        command: 'git config --global user.name "Your Name" && git config --global user.email "you@example.com"',
        explanation: 'Git needs to know who you are for commit attribution. Use --global to set this once for all repositories.',
        expectedOutput: 'No output (silent success)',
        validationCriteria: [
          'Command executes without error',
          'Run git config --list to verify settings'
        ],
        commonMistakes: [
          'Forgetting quotes around name with spaces',
          'Using incorrect email format'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Create a new directory and navigate into it',
        command: 'mkdir myproject && cd myproject',
        explanation: 'Create a workspace for your Git repository. The && operator runs the second command only if the first succeeds.',
        expectedOutput: 'Directory created, prompt changes to show new location',
        validationCriteria: [
          'pwd shows you are in myproject directory',
          'ls -la shows empty directory (only . and ..)'
        ],
        commonMistakes: [
          'Forgetting cd command (staying in parent directory)',
          'Using spaces in directory name without quotes'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Initialize a new Git repository',
        command: 'git init',
        explanation: 'This creates a .git directory that stores all version history. Your directory is now a Git repository.',
        expectedOutput: 'Initialized empty Git repository in /path/to/myproject/.git/',
        validationCriteria: [
          'Message confirms initialization',
          'ls -la shows hidden .git directory',
          'git status works without error'
        ],
        commonMistakes: [
          'Running git init in wrong directory',
          'Accidentally creating nested repositories'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'Create your first file',
        command: 'echo "# My Project" > README.md',
        explanation: 'Create a README file with a markdown heading. The > operator redirects output to a new file.',
        expectedOutput: 'File created (no terminal output)',
        validationCriteria: [
          'ls shows README.md file',
          'cat README.md displays "# My Project"',
          'git status shows untracked file'
        ],
        commonMistakes: [
          'Using >> which appends instead of creating new',
          'Forgetting quotes around content with special characters'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'Stage the file for commit',
        command: 'git add README.md',
        explanation: 'Staging (adding) tells Git which changes you want to include in the next commit. Think of it as preparing items for a snapshot.',
        expectedOutput: 'No output (silent success)',
        validationCriteria: [
          'git status shows README.md under "Changes to be committed"',
          'File appears in green in status output'
        ],
        commonMistakes: [
          'Forgetting to add before commit',
          'Adding files you did not mean to track (.env, logs, etc.)'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'Commit your changes with a message',
        command: 'git commit -m "Initial commit: Add README"',
        explanation: 'A commit is a snapshot of your project at this moment. The -m flag lets you include a message describing the changes.',
        expectedOutput: '[main (root-commit) abc1234] Initial commit: Add README\n 1 file changed, 1 insertion(+)',
        validationCriteria: [
          'Commit message appears in output',
          'Shows file count and line changes',
          'git status says "nothing to commit, working tree clean"',
          'git log shows your commit'
        ],
        commonMistakes: [
          'Forgetting -m flag (opens text editor unexpectedly)',
          'Writing vague messages like "update" or "fix"',
          'Not committing staged changes'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'Create a new branch for development',
        command: 'git branch feature-login',
        explanation: 'Branches let you work on new features without affecting the main codebase. This creates a new branch but does not switch to it.',
        expectedOutput: 'No output (silent success)',
        validationCriteria: [
          'git branch shows both main and feature-login',
          'Asterisk (*) shows you are still on main',
          'Branch created successfully'
        ],
        commonMistakes: [
          'Using spaces in branch names (use hyphens or underscores)',
          'Thinking branch is created AND checked out (it is not)'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'Switch to the new branch',
        command: 'git checkout feature-login',
        explanation: 'Checkout switches your working directory to a different branch. Changes you make now will be on feature-login, not main.',
        expectedOutput: 'Switched to branch "feature-login"',
        validationCriteria: [
          'git branch shows asterisk (*) next to feature-login',
          'Prompt may change to show current branch',
          'git status shows "On branch feature-login"'
        ],
        commonMistakes: [
          'Having uncommitted changes when switching (causes errors)',
          'Forgetting which branch you are on before committing'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'Make changes on the feature branch',
        command: 'echo "Login functionality" >> README.md',
        explanation: 'Add content to README. The >> operator appends to existing file instead of overwriting.',
        expectedOutput: 'Content appended (no terminal output)',
        validationCriteria: [
          'cat README.md shows both lines',
          'git status shows README.md as modified',
          'git diff shows the added line'
        ],
        commonMistakes: [
          'Using single > which overwrites entire file',
          'Making changes on wrong branch'
        ]
      },
      {
        stepNumber: 10,
        instruction: 'Stage and commit the feature changes',
        command: 'git add README.md && git commit -m "Add login feature description"',
        explanation: 'Stage and commit in one line using &&. This records your feature work on the feature-login branch.',
        expectedOutput: '[feature-login abc5678] Add login feature description\n 1 file changed, 1 insertion(+)',
        validationCriteria: [
          'Commit appears in git log',
          'git status shows clean working tree',
          'git log shows this commit only exists on feature-login'
        ],
        commonMistakes: [
          'Forgetting to add before committing',
          'Committing to wrong branch'
        ]
      },
      {
        stepNumber: 11,
        instruction: 'Switch back to main branch',
        command: 'git checkout main',
        explanation: 'Return to the main branch. Notice that your feature changes disappear from README (they exist only on feature-login).',
        expectedOutput: 'Switched to branch "main"',
        validationCriteria: [
          'cat README.md shows only original content',
          'git log does not show feature commit',
          'Feature work is safe on feature-login branch'
        ],
        commonMistakes: [
          'Panicking when feature changes disappear (they are safe on other branch)',
          'Trying to merge before understanding branches'
        ]
      },
      {
        stepNumber: 12,
        instruction: 'Merge the feature branch into main',
        command: 'git merge feature-login',
        explanation: 'Merge brings changes from feature-login into main. This is how completed features get integrated.',
        expectedOutput: 'Updating abc1234..abc5678\nFast-forward\n README.md | 1 +',
        validationCriteria: [
          'cat README.md now shows both lines',
          'git log shows both commits on main',
          'Message says "Fast-forward" (clean merge)'
        ],
        commonMistakes: [
          'Merging in wrong direction (feature into main, not main into feature)',
          'Not being on target branch before merging'
        ]
      }
    ],
    expectedOutcome: 'You have learned Git fundamentals: repository initialization, staging, committing, branching, merging. You can now track code changes and work on features independently.'
  },

  walk: {
    introduction: 'Practice Git workflows with fill-in-the-blank exercises. Each scenario requires you to recall and apply the correct commands.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'You need to start tracking a new project with Git. Create the repository and make your first commit.',
        template: 'mkdir webapp && cd webapp\n_____ _____\necho "# WebApp Project" > README.md\ngit _____ README.md\ngit commit _____ "Initial commit"',
        blanks: [
          {
            id: 'init',
            label: 'Initialize repository',
            hint: 'Command to create a new Git repository',
            correctValue: 'git init',
            validationPattern: '^git\\s+init$'
          },
          {
            id: 'stage',
            label: 'Stage the file',
            hint: 'Command to add file to staging area',
            correctValue: 'add',
            validationPattern: '^add$'
          },
          {
            id: 'message',
            label: 'Commit message flag',
            hint: 'Flag to include commit message inline',
            correctValue: '-m',
            validationPattern: '^-m$'
          }
        ],
        solution: 'mkdir webapp && cd webapp\ngit init\necho "# WebApp Project" > README.md\ngit add README.md\ngit commit -m "Initial commit"',
        explanation: 'git init creates repository, git add stages changes, git commit -m records snapshot with message.'
      },
      {
        exerciseNumber: 2,
        scenario: 'You have uncommitted changes and want to see what has been modified before staging.',
        template: 'git _____ \ngit _____ app.js\ngit commit -m "Update app logic"',
        blanks: [
          {
            id: 'check',
            label: 'Check status/changes',
            hint: 'Command to see working tree status',
            correctValue: 'status',
            validationPattern: '^(status|diff)$'
          },
          {
            id: 'stage',
            label: 'Stage the file',
            hint: 'Add file to staging area',
            correctValue: 'add',
            validationPattern: '^add$'
          }
        ],
        solution: 'git status\ngit add app.js\ngit commit -m "Update app logic"',
        explanation: 'git status shows modified files, git diff shows actual changes. Always review before committing.'
      },
      {
        exerciseNumber: 3,
        scenario: 'Create a new branch for a feature, switch to it, and make a commit.',
        template: 'git _____ feature-auth\ngit _____ feature-auth\necho "Auth module" > auth.js\ngit add auth.js\ngit commit -m "Add authentication"',
        blanks: [
          {
            id: 'create',
            label: 'Create branch',
            hint: 'Command to create new branch',
            correctValue: 'branch',
            validationPattern: '^branch$'
          },
          {
            id: 'switch',
            label: 'Switch to branch',
            hint: 'Command to switch branches',
            correctValue: 'checkout',
            validationPattern: '^checkout$'
          }
        ],
        solution: 'git branch feature-auth\ngit checkout feature-auth\necho "Auth module" > auth.js\ngit add auth.js\ngit commit -m "Add authentication"',
        explanation: 'git branch creates new branch, git checkout switches to it. Alternative: git checkout -b combines both.'
      },
      {
        exerciseNumber: 4,
        scenario: 'You finished a feature branch and need to merge it into main.',
        template: 'git _____ main\ngit _____ feature-payment\ngit branch -d feature-payment',
        blanks: [
          {
            id: 'switch',
            label: 'Switch to target branch',
            hint: 'Move to the branch you want to merge INTO',
            correctValue: 'checkout',
            validationPattern: '^checkout$'
          },
          {
            id: 'merge',
            label: 'Merge the feature',
            hint: 'Command to integrate changes from another branch',
            correctValue: 'merge',
            validationPattern: '^merge$'
          }
        ],
        solution: 'git checkout main\ngit merge feature-payment\ngit branch -d feature-payment',
        explanation: 'Switch to target branch (main) first, then merge source branch (feature). -d deletes merged branch.'
      },
      {
        exerciseNumber: 5,
        scenario: 'View your commit history and check which branch you are currently on.',
        template: 'git _____\ngit _____ --oneline\ngit branch',
        blanks: [
          {
            id: 'status',
            label: 'Check current status',
            hint: 'See current branch and uncommitted changes',
            correctValue: 'status',
            validationPattern: '^status$'
          },
          {
            id: 'history',
            label: 'View commit history',
            hint: 'Command to see past commits',
            correctValue: 'log',
            validationPattern: '^log$'
          }
        ],
        solution: 'git status\ngit log --oneline\ngit branch',
        explanation: 'git status shows current state, git log shows history, git branch lists all branches.'
      }
    ],
    hints: [
      'git status is your best friend - use it constantly',
      'Always commit on the correct branch (check with git branch)',
      'Write clear commit messages explaining WHY, not just WHAT',
      'Use git log to understand project history before making changes'
    ]
  },

  runGuided: {
    objective: 'Set up a Git workflow for a web development project with proper branching strategy',
    conceptualGuidance: [
      'Create main repository with initial README and .gitignore',
      'Create separate branches for frontend and backend development',
      'Make commits on each branch simulating feature work',
      'Merge branches into main when features are complete',
      'Handle a merge conflict when both branches modify same file',
      'Clean up merged branches and verify final state'
    ],
    keyConceptsToApply: [
      'Branching strategy (main + feature branches)',
      'Merge conflicts (when same lines change on different branches)',
      'Clean history with meaningful commits',
      'Using .gitignore to exclude build artifacts'
    ],
    checkpoints: [
      {
        checkpoint: 'Repository initialized',
        description: 'Repository initialized with main branch containing README, .gitignore, and initial commit',
        validationCriteria: [
          'git status shows clean working tree on main branch',
          '.gitignore contains node_modules and .env entries',
          'git log shows at least one commit',
          'README.md describes project purpose'
        ],
        hintIfStuck: 'Use git init, create files with echo or text editor, git add ., then git commit -m "message"'
      },
      {
        checkpoint: 'Feature branches created',
        description: 'Two feature branches created (feature-frontend and feature-backend) with at least one commit each',
        validationCriteria: [
          'git branch shows three branches: main, feature-frontend, feature-backend',
          'Each feature branch has unique commits not on main',
          'git log on each branch shows different commit history',
          'No uncommitted changes on any branch'
        ],
        hintIfStuck: 'Use git checkout -b <branch> to create and switch, make file changes, then commit. Repeat for second branch.'
      },
      {
        checkpoint: 'Branches merged successfully',
        description: 'Successfully merged both feature branches into main and resolved any conflicts',
        validationCriteria: [
          'git log on main shows commits from both branches',
          'All feature code exists in main branch files',
          'No merge conflict markers (<<<<<<, ======, >>>>>>) in files',
          'git status on main shows clean working tree'
        ],
        hintIfStuck: 'git checkout main, then git merge <branch> for each. If conflict occurs, edit files manually, remove markers, git add conflicted-file, then git commit.'
      }
    ],
    resourcesAllowed: [
      'git --help <command>',
      'https://git-scm.com/docs',
      'Google for "git merge conflict resolution"'
    ]
  },

  runIndependent: {
    objective: 'Establish a complete Git workflow for a microservices project with branching, tagging, and collaboration practices',
    successCriteria: [
      'Repository with main and develop branches following Git Flow pattern',
      'At least 3 feature branches merged into develop',
      'One release branch created from develop and merged to main',
      'Semantic version tag (e.g., v1.0.0) on main after release',
      'All branches properly merged with no orphaned commits',
      '.gitignore properly configured for Node.js/Python project',
      'Commit history is clean with descriptive messages',
      'README documents the branching strategy used'
    ],
    timeTarget: 20,
    minimumRequirements: [
      'Working Git repository with at least 2 branches',
      'At least 5 meaningful commits across branches',
      'Successful merge of feature into main branch'
    ],
    evaluationRubric: [
      {
        criterion: 'Branching Strategy',
        weight: 30,
        passingThreshold: 'Uses main + develop + at least 2 feature branches. Follows consistent naming convention.'
      },
      {
        criterion: 'Commit Quality',
        weight: 25,
        passingThreshold: 'All commits have clear, descriptive messages. No "WIP" or "fix" messages. Atomic commits (one logical change per commit).'
      },
      {
        criterion: 'Merge Management',
        weight: 25,
        passingThreshold: 'All merges complete successfully. No merge conflict markers left in code. Proper merge direction (feature → develop → main).'
      },
      {
        criterion: 'Repository Hygiene',
        weight: 20,
        passingThreshold: '.gitignore excludes build artifacts and secrets. No unnecessary files tracked. README documents workflow.'
      }
    ]
  },

  videoUrl: 'https://placeholder.com/git-basics',
  documentation: [
    'https://git-scm.com/book/en/v2',
    'https://www.atlassian.com/git/tutorials',
    'https://git-scm.com/docs/gitignore'
  ],
  relatedConcepts: [
    'Version control systems',
    'Branching strategies (Git Flow, GitHub Flow)',
    'Merge vs Rebase',
    'Remote repositories (GitHub, GitLab)'
  ]
};

export const WEEK_2_LESSONS = [
  week2Lesson1GitBasics,
  week2Lesson2WhyVersionControl,
  week2Lesson3GitHubWorkflow
];

