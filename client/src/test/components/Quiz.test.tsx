import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Quiz from '../Quiz';
import { useAuthStore } from '../../store/authStore';

// Mock the auth store
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
  arrayUnion: vi.fn(),
  increment: vi.fn(),
}));

const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
};

const mockQuestions = [
  {
    question: 'What is DevOps?',
    options: ['A tool', 'A culture', 'A job title', 'A programming language'],
    correctAnswer: 1,
    explanation: 'DevOps is a culture that promotes collaboration between development and operations teams.',
  },
  {
    question: 'What does CI/CD stand for?',
    options: ['Continuous Integration/Continuous Deployment', 'Code Integration/Code Deployment', 'Continuous Improvement/Continuous Development', 'Cloud Infrastructure/Cloud Deployment'],
    correctAnswer: 0,
    explanation: 'CI/CD stands for Continuous Integration/Continuous Deployment.',
  },
];

describe('Quiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
    });
  });

  const defaultProps = {
    quizId: 'test-quiz-1',
    title: 'DevOps Fundamentals Quiz',
    questions: mockQuestions,
    passingScore: 70,
    xpReward: 100,
  };

  test('renders quiz title and first question', () => {
    render(<Quiz {...defaultProps} />);

    expect(screen.getByText('DevOps Fundamentals Quiz')).toBeInTheDocument();
    expect(screen.getByText('What is DevOps?')).toBeInTheDocument();
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
  });

  test('displays all answer options for current question', () => {
    render(<Quiz {...defaultProps} />);

    expect(screen.getByText('A tool')).toBeInTheDocument();
    expect(screen.getByText('A culture')).toBeInTheDocument();
    expect(screen.getByText('A job title')).toBeInTheDocument();
    expect(screen.getByText('A programming language')).toBeInTheDocument();
  });

  test('navigation buttons work correctly', () => {
    render(<Quiz {...defaultProps} />);

    // Initially, only Next button should be enabled (after selecting answer)
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();

    // Select an answer
    fireEvent.click(screen.getByText('A culture'));

    // Next button should now be enabled
    expect(nextButton).toBeEnabled();

    // Previous button should not exist for first question
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();

    // Click Next to go to second question
    fireEvent.click(nextButton);

    // Should show second question
    expect(screen.getByText('What does CI/CD stand for?')).toBeInTheDocument();
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();

    // Now Previous button should exist and Next should be disabled
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeDisabled();
  });

  test('can navigate back to previous question', () => {
    render(<Quiz {...defaultProps} />);

    // Go to second question
    fireEvent.click(screen.getByText('A culture'));
    fireEvent.click(screen.getByText('Next'));

    // Click Previous
    fireEvent.click(screen.getByText('Previous'));

    // Should be back to first question
    expect(screen.getByText('What is DevOps?')).toBeInTheDocument();
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
  });

  test('shows results when quiz is completed', async () => {
    render(<Quiz {...defaultProps} />);

    // Answer first question correctly
    fireEvent.click(screen.getByText('A culture'));
    fireEvent.click(screen.getByText('Next'));

    // Answer second question correctly
    fireEvent.click(screen.getByText('Continuous Integration/Continuous Deployment'));
    fireEvent.click(screen.getByText('Submit Quiz'));

    // Should show results
    await waitFor(() => {
      expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
    });

    expect(screen.getByText('100%')).toBeInTheDocument(); // Score
    expect(screen.getByText('Passed')).toBeInTheDocument();
    expect(screen.getByText('+100 XP')).toBeInTheDocument();
  });

  test('shows failure when score is below passing threshold', async () => {
    const hardQuestions = [
      {
        question: 'What is DevOps?',
        options: ['A tool', 'A culture', 'A job title', 'A programming language'],
        correctAnswer: 1,
      },
    ];

    render(
      <Quiz
        {...defaultProps}
        questions={hardQuestions}
        passingScore: 80
      />
    );

    // Answer incorrectly
    fireEvent.click(screen.getByText('A tool'));
    fireEvent.click(screen.getByText('Submit Quiz'));

    await waitFor(() => {
      expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
    });

    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  test('shows question explanations in results', async () => {
    render(<Quiz {...defaultProps} />);

    // Complete the quiz
    fireEvent.click(screen.getByText('A culture'));
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Continuous Integration/Continuous Deployment'));
    fireEvent.click(screen.getByText('Submit Quiz'));

    await waitFor(() => {
      expect(screen.getByText('DevOps is a culture that promotes collaboration between development and operations teams.')).toBeInTheDocument();
    });
  });

  test('try again button resets the quiz', async () => {
    const easyQuestions = [
      {
        question: 'What is DevOps?',
        options: ['A tool', 'A culture'],
        correctAnswer: 1,
      },
    ];

    render(
      <Quiz
        {...defaultProps}
        questions={easyQuestions}
        passingScore: 80
      />
    );

    // Fail the quiz
    fireEvent.click(screen.getByText('A tool'));
    fireEvent.click(screen.getByText('Submit Quiz'));

    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    // Click try again
    fireEvent.click(screen.getByText('Try Again'));

    // Should be back to first question
    expect(screen.getByText('What is DevOps?')).toBeInTheDocument();
    expect(screen.queryByText('Quiz Complete!')).not.toBeInTheDocument();
  });

  test('handles quiz with no user logged in', () => {
    (useAuthStore as any).mockReturnValue({
      user: null,
    });

    render(<Quiz {...defaultProps} />);

    // Should still render but XP reward won't be awarded
    expect(screen.getByText('DevOps Fundamentals Quiz')).toBeInTheDocument();
  });

  test('displays progress indicator', () => {
    render(<Quiz {...defaultProps} />);

    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();

    // Answer and go to next
    fireEvent.click(screen.getByText('A culture'));
    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();
  });
});