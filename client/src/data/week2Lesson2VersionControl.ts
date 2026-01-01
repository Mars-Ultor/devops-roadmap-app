/**
 * Week 2 Lesson 2 - Why Version Control?
 * 4-Level Mastery Progression
 */

import type { LeveledLessonContent } from '../types/lessonContent';

export const week2Lesson2WhyVersionControl: LeveledLessonContent = {
  lessonId: 'week2-lesson2-why-version-control',
  
  baseLesson: {
    title: 'Why Version Control? Understanding the Problem It Solves',
    description: 'Understand the critical problems version control solves and why every developer needs it.',
    learningObjectives: [
      'Explain the chaos of development without version control',
      'Understand how version control enables collaboration',
      'Recognize version control as time travel for code',
      'Identify when and why to commit changes'
    ],
    prerequisites: [
      'Basic understanding of files and folders',
      'Awareness that multiple people work on same codebase'
    ],
    estimatedTimePerLevel: {
      crawl: 35,
      walk: 30,
      runGuided: 25,
      runIndependent: 20
    }
  },

  crawl: {
    introduction: 'Understand version control by experiencing the problems it solves. Learn through scenarios and mental models.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'The problem: Final.docx, Final_v2.docx, Final_ACTUALLY_FINAL.docx',
        command: 'Imagine managing code like this: app.js, app_backup.js, app_working.js, app_before_refactor.js, app_oct15.js',
        explanation: 'Without version control, developers create file copies for every change. Quickly becomes unmaintainable. Which is the real version? Which has the bug fix?',
        expectedOutput: 'Mental model: Folder chaos with dozens of similar files, confusion about which is current.',
        validationCriteria: [
          'You understand manual versioning is error-prone',
          'You see file naming conventions break down quickly',
          'You recognize this is unsustainable for teams'
        ],
        commonMistakes: [
          'Thinking "I\'ll remember which file is which" (you won\'t)',
          'Believing manual backups are sufficient (they\'re not)'
        ]
      },
      {
        stepNumber: 2,
        instruction: 'The collaboration nightmare: Multiple developers, one codebase',
        command: 'Developer A: Edits app.js → emails to team. Developer B: Meanwhile edits app.js → emails to team. Now what?',
        explanation: 'Without version control, team members\' changes conflict. Who has the "real" version? How to merge? Manual merge = hours of tedious work + high error risk.',
        expectedOutput: 'Mental model: Two developers making simultaneous changes, no way to automatically merge, lost work.',
        validationCriteria: [
          'You understand concurrent editing causes conflicts',
          'You see manual merging doesn\'t scale',
          'You recognize need for automatic conflict resolution'
        ],
        commonMistakes: [
          'Thinking "we\'ll just communicate better" (doesn\'t scale)',
          'Using shared network drive (doesn\'t solve conflicts)'
        ]
      },
      {
        stepNumber: 3,
        instruction: 'Version control solution: One source of truth',
        command: 'All code in central repository (Git repo). Everyone clones repo, makes changes, pushes back. System tracks everything.',
        explanation: 'Version control = single source of truth. Repository contains entire history. Every change tracked: who, what, when, why. No more "which file is current?"',
        expectedOutput: 'Mental model: Central repository with complete history, developers pulling/pushing changes.',
        validationCriteria: [
          'You understand repository is single source of truth',
          'You see version control tracks all changes',
          'You recognize history is preserved automatically'
        ],
        commonMistakes: [
          'Confusing version control with backup (it\'s more than backup)',
          'Thinking only final versions matter (history is crucial)'
        ]
      },
      {
        stepNumber: 4,
        instruction: 'Time travel: Rewind to any previous version',
        command: 'Made a mistake? Broke the build? Just revert to last working version from 1 hour ago.',
        explanation: 'Every commit = snapshot in time. Can compare any two versions. Can roll back to any point. Like undo for your entire project, forever.',
        expectedOutput: 'Mental model: Timeline of commits, ability to jump to any point in history.',
        validationCriteria: [
          'You understand commits are snapshots',
          'You see version control enables rollback',
          'You recognize value of complete history'
        ],
        commonMistakes: [
          'Committing too infrequently (lose granular history)',
          'Not writing commit messages (can\'t find right version later)'
        ]
      },
      {
        stepNumber: 5,
        instruction: 'Collaboration: Branching enables parallel work',
        command: 'Main branch = production code. Feature branches = isolated work. Merge when ready.',
        explanation: 'Branches let multiple developers work simultaneously without interfering. Each feature gets its own branch. Merge to main when complete and tested.',
        expectedOutput: 'Mental model: Main branch with multiple feature branches, merging back when ready.',
        validationCriteria: [
          'You understand branches enable parallel development',
          'You see branches isolate incomplete features',
          'You recognize merging integrates completed work'
        ],
        commonMistakes: [
          'Everyone working on main branch (conflicts everywhere)',
          'Never merging branches (work never integrates)'
        ]
      },
      {
        stepNumber: 6,
        instruction: 'Accountability: Who changed what and why',
        command: 'git blame shows who wrote each line. git log shows all changes. Every commit has author and message.',
        explanation: 'Version control provides accountability. Not for blame, but for understanding: why was this changed? Who can explain this code? Critical for team context.',
        expectedOutput: 'Mental model: Every line of code annotated with author, date, reason.',
        validationCriteria: [
          'You understand version control tracks authorship',
          'You see commit messages provide context',
          'You recognize value for team knowledge'
        ],
        commonMistakes: [
          'Writing vague commit messages ("fixed bug" instead of "Fixed login timeout by increasing session TTL to 30min")',
          'Using git blame for actual blame (toxic culture)'
        ]
      },
      {
        stepNumber: 7,
        instruction: 'Code review: Pull Requests enable quality gates',
        command: 'Developer creates Pull Request → team reviews code → approves or requests changes → merge.',
        explanation: 'Version control enables structured code review. Pull Requests = formal review process. Catch bugs, share knowledge, maintain quality. Can\'t merge without approval.',
        expectedOutput: 'Mental model: Pull Request workflow with review, discussion, approval before merge.',
        validationCriteria: [
          'You understand Pull Requests formalize review',
          'You see review catches bugs before production',
          'You recognize knowledge sharing benefit'
        ],
        commonMistakes: [
          'Skipping reviews to "move faster" (causes more bugs)',
          'Rubber-stamp approvals without actually reviewing'
        ]
      },
      {
        stepNumber: 8,
        instruction: 'Continuous Integration: Automated testing on every change',
        command: 'Commit pushed → CI server runs all tests → notifies if tests fail → prevents merge if broken.',
        explanation: 'Version control integrates with CI/CD. Every commit triggers automated tests. Broken code can\'t be merged. Fast feedback = catch bugs early.',
        expectedOutput: 'Mental model: Commit → automatic test → green (merge) or red (fix).',
        validationCriteria: [
          'You understand version control enables CI',
          'You see automated tests prevent broken code',
          'You recognize fast feedback loop value'
        ],
        commonMistakes: [
          'Committing without running tests locally (wastes CI time)',
          'Ignoring CI failures ("works on my machine")'
        ]
      },
      {
        stepNumber: 9,
        instruction: 'Disaster recovery: Repository is complete backup',
        command: 'Laptop dies? Clone repo on new machine. Server crashes? Restore from any clone. Complete history preserved.',
        explanation: 'Every clone is full backup with complete history. Distributed = no single point of failure. Disaster recovery is built-in, not extra effort.',
        expectedOutput: 'Mental model: Distributed repository, multiple complete copies, inherent backup.',
        validationCriteria: [
          'You understand every clone is full backup',
          'You see distributed nature provides resilience',
          'You recognize disaster recovery is automatic'
        ],
        commonMistakes: [
          'Not pushing commits (work only on local machine)',
          'Having only one remote (should have multiple for true resilience)'
        ]
      },
      {
        stepNumber: 10,
        instruction: 'Open source: Version control enables global collaboration',
        command: 'Fork repo → make changes → submit Pull Request → maintainers review → merged into official project.',
        explanation: 'Version control powers open source. Anyone can contribute without direct access. Fork = your copy. Pull Request = proposed change. Maintainers control what\'s accepted.',
        expectedOutput: 'Mental model: Fork/PR workflow enabling global contribution.',
        validationCriteria: [
          'You understand forking enables contribution',
          'You see Pull Requests propose changes',
          'You recognize maintainer control'
        ],
        commonMistakes: [
          'Modifying main branch of fork (should use feature branch)',
          'Not syncing fork with upstream (work becomes outdated)'
        ]
      }
    ],
    expectedOutcome: 'You understand why version control is essential: prevents file chaos, enables collaboration, provides time travel, ensures accountability, enables code review, integrates with CI/CD, provides disaster recovery, and powers open source.'
  },

  walk: {
    introduction: 'Apply version control understanding through scenario analysis.',
    exercises: [
      {
        exerciseNumber: 1,
        scenario: 'A developer accidentally deletes important code. How does version control help?',
        template: 'Problem: Code deleted\nSolution: Use __GIT_COMMAND__ to __RESTORE_ACTION__\nWhy it works: Version control __KEEPS_HISTORY__',
        blanks: [
          {
            id: 'GIT_COMMAND',
            label: 'GIT_COMMAND',
            hint: 'Command to view history and restore',
            correctValue: 'git log / git checkout',
            validationPattern: '.*(log|checkout|revert|reset).*'
          },
          {
            id: 'RESTORE_ACTION',
            label: 'RESTORE_ACTION',
            hint: 'What action restores the code?',
            correctValue: 'revert to previous commit',
            validationPattern: '.*(revert|restore|checkout|previous).*'
          },
          {
            id: 'KEEPS_HISTORY',
            label: 'KEEPS_HISTORY',
            hint: 'Version control preserves all...',
            correctValue: 'preserves complete history',
            validationPattern: '.*(history|snapshot|commit|preserve).*'
          }
        ],
        solution: 'Problem: Code deleted\nSolution: Use git log to find previous commit, git checkout to restore\nWhy it works: Version control preserves complete history',
        explanation: 'Version control = time machine. Every commit is preserved. Deleted code can be restored from history.'
      },
      {
        exerciseNumber: 2,
        scenario: 'Two developers edit the same file simultaneously. How does version control handle this?',
        template: 'Scenario: __CONCURRENT_EDITS__\nVersion control detects __CONFLICT__\nDevelopers must __MANUAL_RESOLUTION__\nResult: __MERGED_CODE__ with both changes',
        blanks: [
          {
            id: 'CONCURRENT_EDITS',
            label: 'CONCURRENT_EDITS',
            hint: 'Multiple people editing same file at same time',
            correctValue: 'simultaneous edits',
            validationPattern: '.*(concurrent|simultaneous|parallel).*'
          },
          {
            id: 'CONFLICT',
            label: 'CONFLICT',
            hint: 'When same lines changed, Git creates a...',
            correctValue: 'merge conflict',
            validationPattern: '.*(conflict|collision).*'
          },
          {
            id: 'MANUAL_RESOLUTION',
            label: 'MANUAL_RESOLUTION',
            hint: 'Developers must manually...',
            correctValue: 'resolve conflicts',
            validationPattern: '.*(resolve|merge|fix|combine).*'
          },
          {
            id: 'MERGED_CODE',
            label: 'MERGED_CODE',
            hint: 'Final result contains...',
            correctValue: 'integrated code',
            validationPattern: '.*(integrated|merged|combined|unified).*'
          }
        ],
        solution: 'Scenario: simultaneous edits\nVersion control detects merge conflict\nDevelopers must manually resolve conflicts\nResult: integrated code with both changes',
        explanation: 'Version control detects conflicts automatically. Developers resolve manually. Much better than emailing files back and forth.'
      },
      {
        exerciseNumber: 3,
        scenario: 'A bug is discovered in production. How to find when it was introduced?',
        template: 'Use __BISECT_TOOL__ to __BINARY_SEARCH__ through commits\nTest each commit: __WORKS_OR_BROKEN__\nIdentify __EXACT_COMMIT__ that introduced bug\nReview __COMMIT_MESSAGE__ and __DIFF__ to understand why',
        blanks: [
          {
            id: 'BISECT_TOOL',
            label: 'BISECT_TOOL',
            hint: 'Git tool for binary search through history',
            correctValue: 'git bisect',
            validationPattern: '.*(bisect|log|blame).*'
          },
          {
            id: 'BINARY_SEARCH',
            label: 'BINARY_SEARCH',
            hint: 'Bisect performs what type of search?',
            correctValue: 'binary search',
            validationPattern: '.*(binary|search|find).*'
          },
          {
            id: 'WORKS_OR_BROKEN',
            label: 'WORKS_OR_BROKEN',
            hint: 'Mark each commit as good or...',
            correctValue: 'good or bad',
            validationPattern: '.*(good.*bad|works.*broken|pass.*fail).*'
          },
          {
            id: 'EXACT_COMMIT',
            label: 'EXACT_COMMIT',
            hint: 'Bisect identifies the specific...',
            correctValue: 'problematic commit',
            validationPattern: '.*(commit|change|culprit).*'
          },
          {
            id: 'COMMIT_MESSAGE',
            label: 'COMMIT_MESSAGE',
            hint: 'Message explaining why change was made',
            correctValue: 'commit message',
            validationPattern: '.*(message|description|comment).*'
          },
          {
            id: 'DIFF',
            label: 'DIFF',
            hint: 'What shows the actual code changes?',
            correctValue: 'diff',
            validationPattern: '.*(diff|change|modification).*'
          }
        ],
        solution: 'Use git bisect to binary search through commits\nTest each commit: good or bad\nIdentify problematic commit that introduced bug\nReview commit message and diff to understand why',
        explanation: 'Git bisect automates finding bug introduction. Binary search is efficient. Commit history makes debugging faster.'
      },
      {
        exerciseNumber: 4,
        scenario: 'New developer joins team. How does version control help onboarding?',
        template: 'New developer __CLONES__ repository to get all code\n__COMMIT_HISTORY__ shows how project evolved\n__README__ and __DOCS__ versioned alongside code\nCan __CHECKOUT_TAGS__ to see specific releases\nPull Requests show __CODE_REVIEW__ discussions',
        blanks: [
          {
            id: 'CLONES',
            label: 'CLONES',
            hint: 'Command to get copy of repository',
            correctValue: 'clones',
            validationPattern: '.*(clone|pull|fetch).*'
          },
          {
            id: 'COMMIT_HISTORY',
            label: 'COMMIT_HISTORY',
            hint: 'Complete record of all changes',
            correctValue: 'commit history',
            validationPattern: '.*(history|log|commit).*'
          },
          {
            id: 'README',
            label: 'README',
            hint: 'Main documentation file in repo root',
            correctValue: 'README',
            validationPattern: '.*(readme|documentation|docs).*'
          },
          {
            id: 'DOCS',
            label: 'DOCS',
            hint: 'Additional documentation files',
            correctValue: 'documentation',
            validationPattern: '.*(doc|guide|wiki).*'
          },
          {
            id: 'CHECKOUT_TAGS',
            label: 'CHECKOUT_TAGS',
            hint: 'Named markers for specific versions',
            correctValue: 'checkout tags',
            validationPattern: '.*(tag|release|version).*'
          },
          {
            id: 'CODE_REVIEW',
            label: 'CODE_REVIEW',
            hint: 'Discussions about code quality and design',
            correctValue: 'code review',
            validationPattern: '.*(review|discussion|comment).*'
          }
        ],
        solution: 'New developer clones repository to get all code\nCommit history shows how project evolved\nREADME and documentation versioned alongside code\nCan checkout tags to see specific releases\nPull Requests show code review discussions',
        explanation: 'Version control is living documentation. New developers learn from history, discussions, and evolution of codebase.'
      },
      {
        exerciseNumber: 5,
        scenario: 'Team wants to ensure code quality before merging. How does version control enable this?',
        template: '__PULL_REQUEST__ workflow: developer proposes changes\n__CODE_REVIEW__ by team members\n__AUTOMATED_TESTS__ run via CI/CD\n__APPROVAL_REQUIRED__ before merge\nResult: __HIGHER_QUALITY__ code in main branch',
        blanks: [
          {
            id: 'PULL_REQUEST',
            label: 'PULL_REQUEST',
            hint: 'Formal proposal to merge changes',
            correctValue: 'Pull Request',
            validationPattern: '.*(pull.*request|PR|merge.*request).*'
          },
          {
            id: 'CODE_REVIEW',
            label: 'CODE_REVIEW',
            hint: 'Team members examine code for issues',
            correctValue: 'Code review',
            validationPattern: '.*(review|inspection|examination).*'
          },
          {
            id: 'AUTOMATED_TESTS',
            label: 'AUTOMATED_TESTS',
            hint: 'Tests that run automatically',
            correctValue: 'Automated tests',
            validationPattern: '.*(test|ci|automation).*'
          },
          {
            id: 'APPROVAL_REQUIRED',
            label: 'APPROVAL_REQUIRED',
            hint: 'Team approval needed before...',
            correctValue: 'Approval required',
            validationPattern: '.*(approval|accept|sign.*off).*'
          },
          {
            id: 'HIGHER_QUALITY',
            label: 'HIGHER_QUALITY',
            hint: 'Review + tests lead to better...',
            correctValue: 'higher quality',
            validationPattern: '.*(quality|better|improved).*'
          }
        ],
        solution: 'Pull Request workflow: developer proposes changes\nCode review by team members\nAutomated tests run via CI/CD\nApproval required before merge\nResult: higher quality code in main branch',
        explanation: 'Version control enables quality gates. Pull Requests + reviews + CI = prevent bad code from reaching production.'
      }
    ],
    hints: [
      'Version control is insurance and time machine combined',
      'Commit early, commit often (granular history is valuable)',
      'Write meaningful commit messages (future you will thank you)',
      'Pull Requests are for communication, not just code merging'
    ]
  },

  runGuided: {
    objective: 'Document a real-world scenario where version control would have prevented a disaster',
    conceptualGuidance: [
      'Think of a software project failure you\'ve heard about or experienced',
      'Identify what went wrong (lost code, conflicting changes, no backups, etc.)',
      'Explain how version control would have prevented or mitigated the problem',
      'Describe the version control workflow that should have been in place',
      'Calculate the cost: time lost, money wasted, opportunity cost',
      'Propose specific Git practices that would prevent recurrence'
    ],
    keyConceptsToApply: [
      'Branching strategy (main + feature branches)',
      'Commit frequency and message quality',
      'Pull Request workflow',
      'CI/CD integration',
      'Disaster recovery via distributed repository'
    ],
    checkpoints: [
      {
        checkpoint: 'Failure scenario documented',
        description: 'Clear description of what went wrong and impact',
        validationCriteria: [
          'Specific incident described (not vague)',
          'Impact quantified (time, money, reputation)',
          'Root cause identified',
          'Multiple people affected (team/organization level)'
        ],
        hintIfStuck: 'Examples: lost code due to crashed laptop, conflicting changes from 2 devs, accidental deletion of production database config, unable to roll back bad deploy'
      },
      {
        checkpoint: 'Version control solution proposed',
        description: 'How version control would have prevented or minimized damage',
        validationCriteria: [
          'Specific Git features identified (commits, branches, history)',
          'Workflow described (how team would have used Git)',
          'Prevention mechanism clear (automatic backups, conflict detection, rollback)',
          'Realistic and practical (not theoretical perfection)'
        ],
        hintIfStuck: 'Think through: What would have been in Git? How would commits help? Could have rolled back? Would branches have isolated risk?'
      },
      {
        checkpoint: 'Best practices documented',
        description: 'Concrete Git practices to prevent similar failures',
        validationCriteria: [
          'At least 5 specific practices listed',
          'Each practice has clear rationale',
          'Practices are actionable (team can implement tomorrow)',
          'Covers commit hygiene, branching, review, CI/CD'
        ],
        hintIfStuck: 'Examples: Commit every hour, require 2 approvals for main branch, run tests on every PR, never force-push to main, tag all releases'
      }
    ],
    resourcesAllowed: [
      'Google for "software project failures"',
      'Read post-mortems from companies (GitHub, GitLab blogs)',
      'Interview developers about version control pain points'
    ]
  },

  runIndependent: {
    objective: 'Create a comprehensive "Version Control Best Practices Guide" for a development team, demonstrating deep understanding',
    successCriteria: [
      'Guide covers at least 8 categories: commit hygiene, branching strategy, Pull Requests, code review, CI/CD integration, security, disaster recovery, onboarding',
      'Each category has 3-5 specific, actionable best practices',
      'Rationale provided for each practice (why it matters)',
      'Common anti-patterns identified and explained',
      'Real-world examples demonstrating each practice',
      'Workflow diagrams for key processes (PR workflow, branching model)',
      'Metrics to measure version control effectiveness',
      'Onboarding checklist for new developers',
      'Incident response plan (what to do when Git goes wrong)'
    ],
    timeTarget: 20,
    minimumRequirements: [
      'At least 15 best practices across multiple categories',
      'Clear rationale for each practice',
      'Practical examples that team can follow'
    ],
    evaluationRubric: [
      {
        criterion: 'Comprehensiveness',
        weight: 30,
        passingThreshold: 'Covers commit hygiene, branching, PR workflow, review, CI/CD, security. Not just Git commands, but team processes.'
      },
      {
        criterion: 'Practicality',
        weight: 25,
        passingThreshold: 'Practices are actionable and realistic. Team can implement immediately. Not theoretical perfection but pragmatic improvement.'
      },
      {
        criterion: 'Understanding',
        weight: 25,
        passingThreshold: 'Demonstrates why version control matters. Rationale shows deep understanding of problems being solved. Anticipates team objections.'
      },
      {
        criterion: 'Communication',
        weight: 20,
        passingThreshold: 'Guide is clear, well-organized, scannable. Examples are helpful. Diagrams clarify complex workflows. New developers can understand.'
      }
    ]
  },

  videoUrl: 'https://www.youtube.com/watch?v=8JJ101D3knE',
  documentation: [
    'https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control',
    'https://www.atlassian.com/git/tutorials/what-is-version-control',
    'https://about.gitlab.com/topics/version-control/'
  ],
  relatedConcepts: [
    'Distributed vs centralized version control',
    'Branching strategies (Git Flow, GitHub Flow, Trunk-Based Development)',
    'Code review culture',
    'Continuous Integration',
    'Semantic versioning',
    'Change management'
  ]
};
