/**
 * Week 2 Lesson 3 - GitHub Workflow
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week2Lesson3GitHubWorkflow: LeveledLessonContent = {
  lessonId: 'week2-lesson3-github-workflow',
  
  baseLesson: {
    title: 'GitHub Workflow: Pull Requests, Issues & Collaboration',
    description: 'Master GitHub collaboration features for professional team development.',
    learningObjectives: [
      'Create and manage Pull Requests effectively',
      'Use GitHub Issues for project management',
      'Conduct code reviews that improve quality',
      'Collaborate with teams using GitHub features'
    ],
    prerequisites: [
      'Git basics (commit, branch, merge)',
      'Understanding of version control concepts'
    ],
    estimatedTimePerLevel: {
      crawl: 45,
      walk: 35,
      runGuided: 30,
      runIndependent: 25
    }
  },

  crawl: {
    introduction: 'Learn GitHub collaboration step-by-step: creating Pull Requests, reviewing code, managing issues, and team workflows.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Fork a repository (create your own copy)',
        command: 'Navigate to repository on GitHub → Click "Fork" button → Fork created in your account',
        explanation: 'Forking creates a complete copy under your account. You can modify freely without affecting original. Essential for contributing to projects you don\'t own.',
        expectedOutput: 'Repository copy appears in your GitHub account at github.com/YOUR_USERNAME/repo-name',
        validationCriteria: [
          'Fork created successfully',
          'Fork shows "forked from original/repo"',
          'You can clone your fork locally'
        ],
        commonMistakes: [
          'Confusing fork with clone (fork is on GitHub, clone is local)',
          'Making changes to main branch of fork (use feature branches)'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'Clone your fork to local machine',
        command: 'git clone https://github.com/YOUR_USERNAME/repo-name.git && cd repo-name',
        explanation: 'Clone downloads repository to your computer. You now have: original repo (upstream), your fork (origin), and local copy.',
        expectedOutput: 'Repository cloned, working directory created, remote "origin" points to your fork',
        validationCriteria: [
          'git remote -v shows origin pointing to your fork',
          'Can make commits locally',
          'Repository structure intact'
        ],
        commonMistakes: [
          'Cloning original instead of your fork (can\'t push changes)',
          'Not setting up upstream remote (can\'t sync with original)'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Add upstream remote to track original repository',
        command: 'git remote add upstream https://github.com/ORIGINAL_OWNER/repo-name.git && git remote -v',
        explanation: 'Upstream = original repo you forked from. Lets you pull latest changes from original to keep your fork updated.',
        expectedOutput: 'git remote -v shows both origin (your fork) and upstream (original repo)',
        validationCriteria: [
          'Upstream remote configured',
          'Can fetch from upstream',
          'Origin and upstream are different URLs'
        ],
        commonMistakes: [
          'Forgetting to add upstream (fork becomes outdated)',
          'Confusing upstream with origin (push to wrong remote)'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'Create a feature branch for your changes',
        command: 'git checkout -b feature/add-documentation',
        explanation: 'Never work directly on main branch. Feature branches isolate your work. Easy to throw away if needed. Keeps main clean.',
        expectedOutput: 'Switched to new branch "feature/add-documentation"',
        validationCriteria: [
          'New branch created',
          'Currently on feature branch (not main)',
          'Branch name is descriptive'
        ],
        commonMistakes: [
          'Using main branch for changes (creates merge conflicts)',
          'Vague branch names like "fix" or "update" (not helpful)'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'Make changes, commit, and push to your fork',
        command: 'echo "## Documentation" > README.md && git add README.md && git commit -m "Add documentation section" && git push origin feature/add-documentation',
        explanation: 'Make changes locally, commit with clear message, push to your fork (origin). Branch now exists on GitHub, ready for Pull Request.',
        expectedOutput: 'Changes pushed to GitHub, branch visible in your fork',
        validationCriteria: [
          'Commit created with meaningful message',
          'Branch pushed to origin',
          'GitHub shows your feature branch'
        ],
        commonMistakes: [
          'Pushing to upstream instead of origin (permission denied)',
          'Forgetting to push (PR can\'t be created without remote branch)'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'Create a Pull Request (PR)',
        command: 'On GitHub: Navigate to original repo → Click "Pull Requests" → "New Pull Request" → Select your fork and branch → Create PR',
        explanation: 'Pull Request = proposal to merge your changes into original repo. Includes description, discussion thread, and code review tools.',
        expectedOutput: 'PR created with title, description, and file changes visible',
        validationCriteria: [
          'PR targets correct branch (usually main)',
          'Title is descriptive ("Add documentation section" not "Update")',
          'Description explains what and why',
          'All commits included in PR'
        ],
        commonMistakes: [
          'Empty or vague PR description (reviewers don\'t understand changes)',
          'Targeting wrong branch (PR merges into unexpected location)',
          'Including unrelated commits (messy PR history)'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'Respond to code review feedback',
        command: 'Reviewer comments on PR → Make requested changes locally → Commit and push → PR automatically updates',
        explanation: 'Code review is conversation. Reviewers suggest improvements. You make changes in same branch, push, PR updates automatically. Iterate until approved.',
        expectedOutput: 'PR updated with new commits addressing feedback, discussion thread shows collaboration',
        validationCriteria: [
          'New commits appear in PR automatically',
          'Responded to review comments',
          'Changes address feedback',
          'Discussion is professional and constructive'
        ],
        commonMistakes: [
          'Getting defensive about feedback (code review improves quality)',
          'Ignoring review comments (PR won\'t be merged)',
          'Creating new PR instead of updating existing one (loses context)'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'Merge Pull Request after approval',
        command: 'Reviewer approves → Click "Merge Pull Request" → Confirm merge → Delete branch (optional)',
        explanation: 'After approval, maintainer or contributor merges PR. Changes now in main branch. Delete feature branch to keep repository clean.',
        expectedOutput: 'PR merged, changes in main branch, PR marked as "Merged", optional branch deletion',
        validationCriteria: [
          'PR status shows merged (purple badge)',
          'Changes appear in main branch',
          'Feature branch can be safely deleted',
          'Merge commit shows in history'
        ],
        commonMistakes: [
          'Merging without approval (bypass review process)',
          'Not deleting old branches (branch clutter)',
          'Reusing feature branches for new PRs (confusing history)'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'Create GitHub Issue to track work',
        command: 'On GitHub: "Issues" tab → "New Issue" → Title + description → Labels, assignee, milestone → Create',
        explanation: 'Issues track bugs, features, questions. Structured with title, description, labels, assignees. Can link to PRs. Searchable history.',
        expectedOutput: 'Issue created with number (#123), title, description, metadata',
        validationCriteria: [
          'Title is clear and specific',
          'Description provides context and steps to reproduce (if bug)',
          'Appropriate labels applied (bug, enhancement, etc.)',
          'Assignee set if known who will work on it'
        ],
        commonMistakes: [
          'Vague issue titles ("It doesn\'t work" instead of "Login fails with 500 error on Safari")',
          'Missing reproduction steps for bugs',
          'Creating duplicate issues (search first)'
        ]
      },
      {
        stepNumber: 10,
        instruction: 'Link Pull Request to Issue',
        command: 'In PR description: "Closes #123" or "Fixes #456" → GitHub auto-links and auto-closes issue when PR merges',
        explanation: 'Linking PR to issue provides traceability. When PR merges, issue automatically closes. Clear connection between problem and solution.',
        expectedOutput: 'PR description shows clickable issue link, issue shows linked PR, issue closes on merge',
        validationCriteria: [
          'Issue number referenced in PR (Closes #X, Fixes #Y)',
          'GitHub detects link (shows in sidebar)',
          'Issue closes automatically when PR merges',
          'Clear connection between issue and fix'
        ],
        commonMistakes: [
          'Forgetting to link PR to issue (lose traceability)',
          'Wrong keyword (Says #123 instead of Closes #123)',
          'Closing issue manually before PR merges (premature)'
        ]
      },
      {
        stepNumber: 11,
        instruction: 'Conduct code review on teammate\'s PR',
        command: 'Open PR → "Files changed" tab → Click line to comment → Suggest improvements → "Review changes" → Approve/Request changes',
        explanation: 'Code review improves quality and shares knowledge. Comment on specific lines. Ask questions. Suggest improvements. Approve when ready.',
        expectedOutput: 'Review submitted with comments, suggestions, and approval status',
        validationCriteria: [
          'Reviewed code changes carefully',
          'Comments are constructive and specific',
          'Suggestions improve code quality',
          'Review includes praise for good work'
        ],
        commonMistakes: [
          'Nitpicking style instead of focusing on logic (use linters for style)',
          'Approving without actually reading (rubber stamping)',
          'Being rude or condescending (destroys team morale)'
        ]
      },
      {
        stepNumber: 12,
        instruction: 'Keep your fork in sync with upstream',
        command: 'git fetch upstream && git checkout main && git merge upstream/main && git push origin main',
        explanation: 'Original repo gets updated by others. Sync your fork to stay current. Fetch updates, merge into your main, push to your fork.',
        expectedOutput: 'Your fork\'s main branch matches upstream, ready to create new feature branches',
        validationCriteria: [
          'Fork main branch updated with latest from upstream',
          'No merge conflicts',
          'Your fork stays current',
          'Ready to branch for new features'
        ],
        commonMistakes: [
          'Never syncing fork (becomes outdated, merge conflicts increase)',
          'Merging into feature branch instead of main (complex conflicts)',
          'Having local changes on main when syncing (conflicts)'
        ]
      }
    ],
    expectedOutcome: 'You can fork repositories, create PRs, conduct code reviews, manage issues, link PRs to issues, and keep forks synchronized. You understand complete GitHub collaboration workflow.'
  },

  walk: {
    introduction: 'Practice GitHub workflow through scenario-based exercises.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'You want to contribute a bug fix to an open-source project. What\'s the workflow?',
        template: '1. __FORK__ the repository to your account\n2. __CLONE__ your fork locally\n3. Create __FEATURE_BRANCH__ for your fix\n4. Make changes, __COMMIT__ with clear message\n5. __PUSH__ to your fork\n6. Create __PULL_REQUEST__ to original repo\n7. Respond to __CODE_REVIEW__ feedback\n8. Maintainer __MERGES__ your PR',
        blanks: [
          {
            id: 'FORK',
            label: 'FORK',
            hint: 'Create copy in your account',
            correctValue: 'Fork',
            validationPattern: '^[Ff]ork$'
          },
          {
            id: 'CLONE',
            label: 'CLONE',
            hint: 'Download to local machine',
            correctValue: 'Clone',
            validationPattern: '^[Cc]lone$'
          },
          {
            id: 'FEATURE_BRANCH',
            label: 'FEATURE_BRANCH',
            hint: 'Isolated branch for your work',
            correctValue: 'feature branch',
            validationPattern: '.*(feature.*branch|branch).*'
          },
          {
            id: 'COMMIT',
            label: 'COMMIT',
            hint: 'Save changes with message',
            correctValue: 'commit',
            validationPattern: '.*(commit|save).*'
          },
          {
            id: 'PUSH',
            label: 'PUSH',
            hint: 'Upload to GitHub',
            correctValue: 'push',
            validationPattern: '^[Pp]ush$'
          },
          {
            id: 'PULL_REQUEST',
            label: 'PULL_REQUEST',
            hint: 'Propose changes to original',
            correctValue: 'Pull Request',
            validationPattern: '.*(pull.*request|PR).*'
          },
          {
            id: 'CODE_REVIEW',
            label: 'CODE_REVIEW',
            hint: 'Maintainers review your code',
            correctValue: 'code review',
            validationPattern: '.*(review|feedback).*'
          },
          {
            id: 'MERGES',
            label: 'MERGES',
            hint: 'Integrates your changes',
            correctValue: 'merges',
            validationPattern: '.*(merge|accept|integrate).*'
          }
        ],
        solution: '1. Fork the repository to your account\n2. Clone your fork locally\n3. Create feature branch for your fix\n4. Make changes, commit with clear message\n5. Push to your fork\n6. Create Pull Request to original repo\n7. Respond to code review feedback\n8. Maintainer merges your PR',
        explanation: 'Standard open-source contribution workflow: Fork → Clone → Branch → Commit → Push → PR → Review → Merge.'
      },
      {
        exerciseNumber: 2,
        scenario: 'A team member submitted a PR. How do you conduct a thorough code review?',
        template: 'Review Process:\n1. Read __PR_DESCRIPTION__ to understand intent\n2. Check __FILES_CHANGED__ tab for all modifications\n3. Look for __LOGIC_ERRORS__ and __SECURITY_ISSUES__\n4. Comment on specific __LINES__ with suggestions\n5. Run __TESTS__ locally if complex\n6. Check __CI_STATUS__ (tests passing?)\n7. __APPROVE__ or __REQUEST_CHANGES__',
        blanks: [
          {
            id: 'PR_DESCRIPTION',
            label: 'PR_DESCRIPTION',
            hint: 'Explains what and why',
            correctValue: 'PR description',
            validationPattern: '.*(description|summary|overview).*'
          },
          {
            id: 'FILES_CHANGED',
            label: 'FILES_CHANGED',
            hint: 'Tab showing code differences',
            correctValue: 'Files changed',
            validationPattern: '.*(files.*changed|diff|changes).*'
          },
          {
            id: 'LOGIC_ERRORS',
            label: 'LOGIC_ERRORS',
            hint: 'Bugs in code logic',
            correctValue: 'logic errors',
            validationPattern: '.*(logic|bug|error).*'
          },
          {
            id: 'SECURITY_ISSUES',
            label: 'SECURITY_ISSUES',
            hint: 'Vulnerabilities or exploits',
            correctValue: 'security issues',
            validationPattern: '.*(security|vulnerability|exploit).*'
          },
          {
            id: 'LINES',
            label: 'LINES',
            hint: 'Specific code lines to comment on',
            correctValue: 'lines',
            validationPattern: '.*(line|code).*'
          },
          {
            id: 'TESTS',
            label: 'TESTS',
            hint: 'Run automated tests',
            correctValue: 'tests',
            validationPattern: '.*(test|check).*'
          },
          {
            id: 'CI_STATUS',
            label: 'CI_STATUS',
            hint: 'Continuous Integration results',
            correctValue: 'CI status',
            validationPattern: '.*(CI|continuous.*integration|build).*'
          },
          {
            id: 'APPROVE',
            label: 'APPROVE',
            hint: 'Accept the changes',
            correctValue: 'Approve',
            validationPattern: '.*(approve|accept).*'
          },
          {
            id: 'REQUEST_CHANGES',
            label: 'REQUEST_CHANGES',
            hint: 'Ask for modifications',
            correctValue: 'Request changes',
            validationPattern: '.*(request.*change|reject|modify).*'
          }
        ],
        solution: 'Review Process:\n1. Read PR description to understand intent\n2. Check Files changed tab for all modifications\n3. Look for logic errors and security issues\n4. Comment on specific lines with suggestions\n5. Run tests locally if complex\n6. Check CI status (tests passing?)\n7. Approve or Request changes',
        explanation: 'Thorough code review catches bugs, improves quality, shares knowledge, and maintains standards.'
      },
      {
        exerciseNumber: 3,
        scenario: 'You discovered a bug. Create an issue with all necessary information.',
        template: 'Issue Template:\n__TITLE__: Clear, specific description\n__ENVIRONMENT__: OS, browser, version\n__STEPS_TO_REPRODUCE__: Numbered list\n__EXPECTED__: What should happen\n__ACTUAL__: What actually happens\n__SCREENSHOTS__: If relevant\n__LABELS__: bug, priority:high, etc.',
        blanks: [
          {
            id: 'TITLE',
            label: 'TITLE',
            hint: 'Concise summary of bug',
            correctValue: 'Title',
            validationPattern: '.*(title|summary).*'
          },
          {
            id: 'ENVIRONMENT',
            label: 'ENVIRONMENT',
            hint: 'Where bug occurs',
            correctValue: 'Environment',
            validationPattern: '.*(environment|system|platform).*'
          },
          {
            id: 'STEPS_TO_REPRODUCE',
            label: 'STEPS_TO_REPRODUCE',
            hint: 'How to trigger the bug',
            correctValue: 'Steps to reproduce',
            validationPattern: '.*(steps|reproduce|trigger).*'
          },
          {
            id: 'EXPECTED',
            label: 'EXPECTED',
            hint: 'Correct behavior',
            correctValue: 'Expected behavior',
            validationPattern: '.*(expected|should).*'
          },
          {
            id: 'ACTUAL',
            label: 'ACTUAL',
            hint: 'What actually happened',
            correctValue: 'Actual behavior',
            validationPattern: '.*(actual|happen).*'
          },
          {
            id: 'SCREENSHOTS',
            label: 'SCREENSHOTS',
            hint: 'Visual evidence',
            correctValue: 'Screenshots',
            validationPattern: '.*(screenshot|image|visual).*'
          },
          {
            id: 'LABELS',
            label: 'LABELS',
            hint: 'Categorization tags',
            correctValue: 'Labels',
            validationPattern: '.*(label|tag|category).*'
          }
        ],
        solution: 'Issue Template:\nTitle: Clear, specific description\nEnvironment: OS, browser, version\nSteps to reproduce: Numbered list\nExpected: What should happen\nActual: What actually happens\nScreenshots: If relevant\nLabels: bug, priority:high, etc.',
        explanation: 'Well-written issues help developers understand and fix bugs faster. Complete information is crucial.'
      },
      {
        exerciseNumber: 4,
        scenario: 'Link your PR to issue #456 that it fixes.',
        template: 'In PR description:\n"__KEYWORD__ #456"\n\nKeywords that auto-close issues:\n- __CLOSES__\n- __FIXES__\n- __RESOLVES__',
        blanks: [
          {
            id: 'KEYWORD',
            label: 'KEYWORD',
            hint: 'Word that triggers auto-close',
            correctValue: 'Fixes',
            validationPattern: '.*(fixes|closes|resolves).*'
          },
          {
            id: 'CLOSES',
            label: 'CLOSES',
            hint: 'Closes keyword',
            correctValue: 'Closes',
            validationPattern: '^[Cc]loses$'
          },
          {
            id: 'FIXES',
            label: 'FIXES',
            hint: 'Fixes keyword',
            correctValue: 'Fixes',
            validationPattern: '^[Ff]ixes$'
          },
          {
            id: 'RESOLVES',
            label: 'RESOLVES',
            hint: 'Resolves keyword',
            correctValue: 'Resolves',
            validationPattern: '^[Rr]esolves$'
          }
        ],
        solution: 'In PR description:\n"Fixes #456"\n\nKeywords that auto-close issues:\n- Closes\n- Fixes\n- Resolves',
        explanation: 'Linking PRs to issues provides traceability and auto-closes issues when PR merges.'
      },
      {
        exerciseNumber: 5,
        scenario: 'Your fork is 50 commits behind upstream. Sync it.',
        template: 'git __FETCH__ upstream\ngit checkout __MAIN_BRANCH__\ngit __MERGE__ upstream/main\ngit __PUSH__ origin main',
        blanks: [
          {
            id: 'FETCH',
            label: 'FETCH',
            hint: 'Download updates without merging',
            correctValue: 'fetch',
            validationPattern: '^fetch$'
          },
          {
            id: 'MAIN_BRANCH',
            label: 'MAIN_BRANCH',
            hint: 'Default branch name',
            correctValue: 'main',
            validationPattern: '^(main|master)$'
          },
          {
            id: 'MERGE',
            label: 'MERGE',
            hint: 'Integrate upstream changes',
            correctValue: 'merge',
            validationPattern: '^merge$'
          },
          {
            id: 'PUSH',
            label: 'PUSH',
            hint: 'Upload to your fork',
            correctValue: 'push',
            validationPattern: '^push$'
          }
        ],
        solution: 'git fetch upstream\ngit checkout main\ngit merge upstream/main\ngit push origin main',
        explanation: 'Keep fork synchronized with upstream to avoid massive merge conflicts later.'
      }
    ],
    hints: [
      'PR descriptions should explain both WHAT and WHY',
      'Review code as you\'d want your code reviewed: constructive and kind',
      'Link PRs to issues for traceability',
      'Sync fork regularly to avoid conflicts'
    ]
  },

  runGuided: {
    objective: 'Contribute to an open-source project following complete GitHub workflow',
    conceptualGuidance: [
      'Find open-source project accepting contributions (look for "good first issue" label)',
      'Read CONTRIBUTING.md to understand project guidelines',
      'Fork repository and clone locally',
      'Set up development environment per project README',
      'Find issue to work on or create new one',
      'Create feature branch with descriptive name',
      'Implement fix or feature with tests',
      'Submit PR with thorough description and issue link',
      'Respond to code review feedback professionally',
      'Iterate until merged or gracefully accept rejection'
    ],
    keyConceptsToApply: [
      'Fork/PR workflow',
      'Branch naming conventions',
      'Commit message quality',
      'Code review etiquette',
      'Issue/PR linking',
      'Upstream synchronization'
    ],
    checkpoints: [
      {
        checkpoint: 'Open-source contribution submitted',
        description: 'Pull Request created on real open-source project',
        validationCriteria: [
          'PR submitted to actual open-source repository',
          'PR description clearly explains changes',
          'Linked to issue (existing or created by you)',
          'Code follows project style guide',
          'Tests added for new functionality'
        ],
        hintIfStuck: 'Start with beginner-friendly projects: first-contributions, good-first-issues.com, or your favorite tool\'s "help wanted" label'
      },
      {
        checkpoint: 'Code review addressed',
        description: 'Responded to maintainer feedback professionally',
        validationCriteria: [
          'All reviewer comments addressed',
          'Questions answered clearly',
          'Requested changes implemented',
          'Additional commits pushed to update PR',
          'Professional and respectful tone maintained'
        ],
        hintIfStuck: 'Don\'t take feedback personally. Reviewers help improve code quality. Thank them for their time.'
      },
      {
        checkpoint: 'Documentation of learning',
        description: 'Reflection on contribution experience',
        validationCriteria: [
          'Documented what you learned',
          'Identified challenges faced',
          'Noted project conventions discovered',
          'Reflection on code review process',
          'Plan for future contributions'
        ],
        hintIfStuck: 'Write blog post or README documenting: project chosen, changes made, review process, lessons learned, what you\'d do differently'
      }
    ],
    resourcesAllowed: [
      'first-contributions.github.io (beginner tutorial)',
      'up-for-grabs.net (beginner-friendly issues)',
      'Project CONTRIBUTING.md and CODE_OF_CONDUCT.md'
    ]
  },

  runIndependent: {
    objective: 'Create comprehensive GitHub collaboration guidelines for a development team, including PR templates, code review checklist, and workflow documentation',
    successCriteria: [
      'Pull Request template with required sections (description, testing, linked issues)',
      'Code review checklist covering functionality, security, performance, style',
      'Branching strategy documented (naming conventions, when to branch)',
      'Issue templates for bugs, features, questions',
      'Contributing guide for new team members',
      'Workflow diagram showing full cycle (issue → branch → PR → review → merge)',
      'Metrics to track (PR review time, merge frequency, comment engagement)',
      'Escalation process for disagreements during review',
      'GitHub Actions workflow for automated checks (linting, tests, security scans)',
      'Onboarding checklist for setting up development environment'
    ],
    timeTarget: 25,
    minimumRequirements: [
      'PR template with at least 5 required sections',
      'Code review checklist with at least 10 items',
      'Documented branching strategy with naming conventions'
    ],
    evaluationRubric: [
      {
        criterion: 'Completeness',
        weight: 30,
        passingThreshold: 'Templates, checklists, guidelines cover all aspects of collaboration. Nothing major missing. Ready for team to use immediately.'
      },
      {
        criterion: 'Practicality',
        weight: 25,
        passingThreshold: 'Guidelines are realistic and actionable. Not bureaucratic overhead. Templates actually help developers. Checklists catch real issues.'
      },
      {
        criterion: 'Quality Standards',
        weight: 25,
        passingThreshold: 'Code review checklist ensures quality. PR template requires necessary information. Standards are clear and enforceable.'
      },
      {
        criterion: 'Documentation Quality',
        weight: 20,
        passingThreshold: 'Guidelines are clear, well-organized, with examples. New team members can follow easily. Diagrams clarify complex workflows.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=8lGpZkjnkt4',
  documentation: [
    'https://docs.github.com/en/pull-requests',
    'https://docs.github.com/en/issues',
    'https://docs.github.com/en/get-started/quickstart/github-flow',
    'https://github.com/firstcontributions/first-contributions'
  ],
  relatedConcepts: [
    'Pull Request etiquette',
    'Code review best practices',
    'GitHub Actions (CI/CD)',
    'Issue triage and management',
    'Open-source contribution guidelines',
    'Branch protection rules'
  ]
};
