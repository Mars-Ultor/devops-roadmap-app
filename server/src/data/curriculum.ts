// Sample curriculum data (Week 1)
export const curriculum = [
  {
    id: 1,
    title: 'DevOps Foundations & Mindset',
    description: 'Understand what DevOps is and set up your learning environment',
    duration: '1 week',
    xp: 500,
    lessons: [
      {
        id: 'week1-lesson1',
        title: 'What is DevOps?',
        type: 'video',
        duration: '10 min',
        content: {
          videoUrl: 'https://www.youtube.com/watch?v=example',
          description: 'DevOps explained using the assembly line analogy',
          keyPoints: [
            'DevOps breaks down silos between development and operations',
            'Focus on automation, collaboration, and continuous improvement',
            'Core practices: CI/CD, IaC, monitoring',
          ],
        },
      },
      {
        id: 'week1-lesson2',
        title: 'Linux Fundamentals Part 1',
        type: 'lab',
        duration: '30 min',
        content: {
          description: 'Learn essential Linux commands for navigating the file system',
          labId: 'lab-1',
          objectives: [
            'Navigate directories with cd, ls, pwd',
            'Create files and folders',
            'View file contents with cat, less',
          ],
        },
      },
    ],
    labs: [
      {
        id: 'lab-1',
        title: 'Linux Navigation Basics',
        difficulty: 'Beginner',
        estimatedTime: '30 min',
        instructions: `
# Lab 1: Linux File System Navigation

## Objectives
- Use basic Linux commands
- Navigate the file system
- Create and view files

## Tasks
1. Print your current directory: \`pwd\`
2. List all files: \`ls -la\`
3. Create a new directory: \`mkdir devops-practice\`
4. Navigate into it: \`cd devops-practice\`
5. Create a file: \`touch hello.txt\`
6. Add content: \`echo "Hello DevOps!" > hello.txt\`
7. View the content: \`cat hello.txt\`

## Validation
Your output should show the file content "Hello DevOps!"
        `,
        starterCode: '# Start here\npwd\n',
        validation: {
          expectedOutput: 'Hello DevOps!',
          hints: [
            'Use pwd to check where you are',
            'Remember to use cat to view file contents',
          ],
        },
      },
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What does CI/CD stand for?',
          options: [
            'Continuous Integration / Continuous Delivery',
            'Code Integration / Code Deployment',
            'Container Integration / Container Delivery',
          ],
          correctAnswer: 0,
          explanation: 'CI/CD stands for Continuous Integration and Continuous Delivery, which automate testing and deployment.',
        },
      ],
    },
  },
  // Add more weeks...
];
