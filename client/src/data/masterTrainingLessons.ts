/**
 * Master Training - AI-Powered Adaptive Learning Paths
 * Personalized learning paths with adaptive difficulty
 */

import type { LeveledLessonContent } from "../types/lessonContent";

// ============================================
// LESSON 1: Adaptive Learning Path - Generalist
// ============================================

export const masterLesson1GeneralistPath: LeveledLessonContent = {
  lessonId: "master-lesson1-generalist",

  baseLesson: {
    title: "DevOps Generalist Mastery Path",
    description:
      "AI-powered comprehensive training across all DevOps domains with balanced skill development.",
    learningObjectives: [
      "Achieve mastery across all core DevOps competencies",
      "Develop breadth of knowledge in multiple domains",
      "Learn to adapt between different technical contexts",
      "Build T-shaped skill profile (broad + deep)",
      "Demonstrate leadership across technical areas",
    ],
    prerequisites: [
      "Completed all 12 weeks of core curriculum",
      "Completed at least 2 advanced training modules",
      "Demonstrated proficiency in incident response",
      "Strong foundation in cloud, containers, and CI/CD",
    ],
    estimatedTimePerLevel: {
      crawl: 60,
      walk: 50,
      runGuided: 45,
      runIndependent: 40,
    },
  },

  crawl: {
    introduction:
      "Begin your generalist mastery journey with AI-guided skill assessment and personalized path.",
    steps: [
      {
        stepNumber: 1,
        instruction: "Complete comprehensive skill assessment",
        command:
          "Take adaptive assessment covering all DevOps domains: Infrastructure, CI/CD, Observability, Security, Performance",
        explanation:
          "AI analyzes your strengths and weaknesses across all domains to create personalized learning path.",
        expectedOutput:
          "Skill profile showing competency levels across all domains",
        validationCriteria: [
          "Assessment completed for all domains",
          "Strengths identified",
          "Areas for improvement documented",
          "Personalized path generated",
        ],
        commonMistakes: [
          "Rushing through assessment",
          "Not being honest about skill gaps",
          "Skipping domains you think you know",
        ],
      },
      {
        stepNumber: 2,
        instruction: "Complete first adaptive scenario",
        command:
          "Tackle AI-selected scenario matching your current skill level",
        explanation:
          "AI selects scenario targeting your learning edge - challenging but achievable. Difficulty adapts based on performance.",
        validationCriteria: [
          "Scenario completed successfully",
          "Key learnings documented",
          "Performance data captured",
          "Next difficulty level determined",
        ],
        commonMistakes: [
          "Giving up when scenario is difficult",
          "Not documenting learnings",
          "Skipping reflection on performance",
        ],
      },
    ],
    exercises: [
      {
        id: "master-generalist-crawl-ex1",
        title: "Initial Skill Assessment",
        description:
          "Complete comprehensive assessment across Infrastructure, CI/CD, Observability, Security, and Performance domains",
        difficulty: "adaptive",
        estimatedTime: 30,
        objectives: [
          "Demonstrate current competency levels",
          "Identify strongest domains",
          "Highlight areas needing development",
          "Establish baseline for progress tracking",
        ],
        startingCondition: "Fresh start on generalist mastery path",
        successCriteria: [
          "All domains assessed",
          "Honest self-evaluation completed",
          "Personalized path generated",
          "Ready for first adaptive scenario",
        ],
      },
    ],
  },

  walk: {
    introduction:
      "Progress through personalized learning scenarios with adaptive difficulty.",
    exercises: [
      {
        id: "master-generalist-walk-ex1",
        title: "Adaptive Scenario Series",
        description:
          "Complete series of 5 scenarios across different domains, difficulty adapts based on performance",
        difficulty: "adaptive",
        estimatedTime: 40,
        objectives: [
          "Improve competency in identified weak areas",
          "Maintain proficiency in strong areas",
          "Develop cross-domain thinking",
          "Build confidence handling diverse challenges",
        ],
        startingCondition:
          "Initial assessment complete, personalized path defined",
        successCriteria: [
          "All 5 scenarios completed",
          "Measurable improvement in weak areas",
          "Cross-domain connections made",
          "Consistent performance across domains",
        ],
      },
    ],
  },

  runGuided: {
    introduction:
      "Tackle complex scenarios requiring integration of multiple domains.",
    exercises: [
      {
        id: "master-generalist-run-guided-ex1",
        title: "Multi-Domain Integration Challenge",
        description:
          "Solve complex problems requiring expertise across infrastructure, security, performance, and observability simultaneously",
        difficulty: "adaptive",
        estimatedTime: 50,
        objectives: [
          "Apply knowledge from multiple domains",
          "Make trade-offs between competing concerns",
          "Design holistic solutions",
          "Demonstrate T-shaped expertise",
        ],
        startingCondition:
          "Complex production issue requiring broad DevOps knowledge to resolve",
        successCriteria: [
          "Problem solved holistically",
          "Trade-offs made consciously",
          "Multiple domains integrated effectively",
          "Solution demonstrates mastery",
        ],
        hints: [
          "Consider security implications of performance optimizations",
          "Balance infrastructure costs with reliability needs",
          "Use observability to validate all changes",
        ],
      },
    ],
  },

  runIndependent: {
    introduction:
      "Demonstrate generalist mastery through comprehensive capstone challenge.",
    exercises: [
      {
        id: "master-generalist-run-independent-ex1",
        title: "Generalist Mastery Capstone",
        description:
          "Complete comprehensive challenge demonstrating mastery across all DevOps domains",
        difficulty: "expert",
        estimatedTime: 90,
        objectives: [
          "Design complete DevOps platform from scratch",
          "Address infrastructure, CI/CD, security, observability, and performance",
          "Make architecture decisions with full justification",
          "Demonstrate leadership and technical excellence",
        ],
        startingCondition:
          "Startup needs complete DevOps platform built by single expert",
        successCriteria: [
          "Platform covers all domains comprehensively",
          "Decisions well-justified",
          "Best practices applied throughout",
          "Demonstrated ability to lead DevOps initiatives",
        ],
      },
    ],
  },
};

// ============================================
// LESSON 2: Adaptive Learning Path - Specialist
// ============================================

export const masterLesson2SpecialistPath: LeveledLessonContent = {
  lessonId: "master-lesson2-specialist",

  baseLesson: {
    title: "DevOps Specialist Mastery Path",
    description:
      "Deep expertise in chosen specialization: Security, Performance, Platform Engineering, or SRE.",
    learningObjectives: [
      "Achieve deep expertise in chosen specialization",
      "Master advanced techniques in specialized domain",
      "Become go-to expert for specialized challenges",
      "Contribute to industry knowledge in specialization",
      "Mentor others in specialized area",
    ],
    prerequisites: [
      "Completed core curriculum",
      "Completed relevant advanced training module",
      "Demonstrated aptitude in chosen specialization",
      "Strong foundation in supporting domains",
    ],
    estimatedTimePerLevel: {
      crawl: 70,
      walk: 60,
      runGuided: 50,
      runIndependent: 45,
    },
  },

  crawl: {
    introduction:
      "Deep dive into your chosen specialization with expert-level scenarios.",
    steps: [
      {
        stepNumber: 1,
        instruction: "Select specialization track",
        command:
          "Choose focus area: DevSecOps, Performance Engineering, Platform Engineering, or Site Reliability Engineering",
        explanation:
          "Specialist path focuses deeply on one area. Choose based on interest, aptitude, and career goals.",
        validationCriteria: [
          "Specialization selected",
          "Prerequisites verified",
          "Learning path customized for specialization",
          "Mentorship connection established",
        ],
        commonMistakes: [
          "Choosing based on trends rather than interest",
          "Not verifying sufficient foundation knowledge",
          "Skipping mentorship connection",
        ],
      },
    ],
    exercises: [
      {
        id: "master-specialist-crawl-ex1",
        title: "Specialization Foundation",
        description:
          "Complete advanced scenarios in chosen specialization to establish expert-level foundation",
        difficulty: "advanced",
        estimatedTime: 35,
        objectives: [
          "Demonstrate advanced knowledge in specialization",
          "Master specialized tools and techniques",
          "Apply industry best practices",
          "Identify areas for further study",
        ],
        startingCondition:
          "Chosen specialization, ready for deep expertise development",
        successCriteria: [
          "Advanced scenarios completed successfully",
          "Specialized tools mastered",
          "Best practices internalized",
          "Expert-level performance demonstrated",
        ],
      },
    ],
  },

  walk: {
    introduction: "Build expert-level capabilities in specialization.",
    exercises: [
      {
        id: "master-specialist-walk-ex1",
        title: "Expert Scenario Series",
        description:
          "Complete series of expert-level scenarios in specialization, progressively more complex",
        difficulty: "expert",
        estimatedTime: 50,
        objectives: [
          "Handle edge cases in specialization",
          "Design solutions for novel problems",
          "Apply research and innovation",
          "Push boundaries of expertise",
        ],
        startingCondition:
          "Strong foundation in specialization, ready for expert challenges",
        successCriteria: [
          "All expert scenarios completed",
          "Novel solutions designed",
          "Research skills demonstrated",
          "Expertise validated",
        ],
      },
    ],
  },

  runGuided: {
    introduction: "Contribute to specialized knowledge and mentor others.",
    exercises: [
      {
        id: "master-specialist-run-guided-ex1",
        title: "Specialized Knowledge Contribution",
        description:
          "Create comprehensive guide, tool, or framework in specialization that advances field",
        difficulty: "expert",
        estimatedTime: 60,
        objectives: [
          "Identify gap in current practices",
          "Design innovative solution or framework",
          "Document for community benefit",
          "Validate through real-world application",
        ],
        startingCondition:
          "Expert-level knowledge, ready to contribute to field",
        successCriteria: [
          "Original contribution created",
          "Thoroughly documented",
          "Validated in practice",
          "Shared with community",
        ],
        hints: [
          "Look for pain points in current practices",
          "Build on existing work rather than reinventing",
          "Get feedback from other experts",
          "Consider open-sourcing if appropriate",
        ],
      },
    ],
  },

  runIndependent: {
    introduction: "Demonstrate recognized expertise in specialization.",
    exercises: [
      {
        id: "master-specialist-run-independent-ex1",
        title: "Specialist Mastery Capstone",
        description:
          "Complete comprehensive project demonstrating recognized expertise in chosen specialization",
        difficulty: "expert",
        estimatedTime: 120,
        objectives: [
          "Solve complex real-world problem in specialization",
          "Apply cutting-edge techniques",
          "Create reusable assets for organization",
          "Mentor others in specialized area",
          "Establish yourself as go-to expert",
        ],
        startingCondition:
          "Expert-level knowledge, ready to demonstrate mastery",
        successCriteria: [
          "Complex problem solved innovatively",
          "Solution demonstrates deep expertise",
          "Reusable assets created",
          "Successfully mentored others",
          "Recognized as expert in field",
        ],
      },
    ],
  },
};

// Export all master training lessons
export const MASTER_TRAINING_LESSONS = [
  masterLesson1GeneralistPath,
  masterLesson2SpecialistPath,
];
