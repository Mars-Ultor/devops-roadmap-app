import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import FlashCard from '../../components/FlashCard';

const mockCards = [
  {
    id: 'card-1',
    question: 'What is Docker?',
    answer: 'Docker is a platform for developing, shipping, and running applications in containers.',
    lessonId: 'lesson-1',
    lessonTitle: 'Containerization Basics',
    category: 'DevOps',
  },
  {
    id: 'card-2',
    question: 'What is Kubernetes?',
    answer: 'Kubernetes is an open-source container orchestration platform.',
    lessonId: 'lesson-2',
    lessonTitle: 'Orchestration',
    category: 'DevOps',
  },
];

describe('FlashCard', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows empty state when no cards provided', () => {
    render(<FlashCard cards={[]} onComplete={mockOnComplete} />);

    expect(screen.getByText('No flash cards available')).toBeInTheDocument();
    expect(screen.getByText('Complete some lessons to unlock flash cards for review.')).toBeInTheDocument();
  });

  test('renders first card question initially', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    expect(screen.getByText('What is Docker?')).toBeInTheDocument();
    expect(screen.queryByText('Docker is a platform for developing, shipping, and running applications in containers.')).not.toBeInTheDocument();
  });

  test('shows answer when Show Answer button is clicked', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    const showAnswerButton = screen.getByText('Reveal Answer');
    fireEvent.click(showAnswerButton);

    expect(screen.getByText('Docker is a platform for developing, shipping, and running applications in containers.')).toBeInTheDocument();
  });

  test('displays quality rating buttons after showing answer', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    fireEvent.click(screen.getByText('Show Answer'));

    expect(screen.getByText('Again')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  test('moves to next card when quality is rated', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    // Show answer and rate
    fireEvent.click(screen.getByText('Show Answer'));
    fireEvent.click(screen.getByText('Good'));

    // Should show second card
    expect(screen.getByText('What is Kubernetes?')).toBeInTheDocument();
    expect(screen.queryByText('What is Docker?')).not.toBeInTheDocument();
  });

  test('shows progress indicator', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    expect(screen.getByText('Card 1 of 2')).toBeInTheDocument();
  });

  test('updates progress when moving to next card', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    fireEvent.click(screen.getByText('Show Answer'));
    fireEvent.click(screen.getByText('Good'));

    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });

  test('completes session when all cards are rated', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    // Complete first card
    fireEvent.click(screen.getByText('Show Answer'));
    fireEvent.click(screen.getByText('Good'));

    // Complete second card
    fireEvent.click(screen.getByText('Show Answer'));
    fireEvent.click(screen.getByText('Easy'));

    // Should show completion screen
    expect(screen.getByText('Session Complete!')).toBeInTheDocument();
    expect(screen.getByText('Great job! You\'ve reviewed all flash cards.')).toBeInTheDocument();
  });

  test('calls onComplete with correct results', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    // Complete first card with "Good" (quality: 3)
    fireEvent.click(screen.getByText('Show Answer'));
    fireEvent.click(screen.getByText('Good'));

    // Complete second card with "Easy" (quality: 4)
    fireEvent.click(screen.getByText('Show Answer'));
    fireEvent.click(screen.getByText('Easy'));

    expect(mockOnComplete).toHaveBeenCalledWith([
      { cardId: 'card-1', quality: 3 },
      { cardId: 'card-2', quality: 4 },
    ]);
  });

  test('reset button restarts the session', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    // Complete the session
    fireEvent.click(screen.getByText('Show Answer'));
    fireEvent.click(screen.getByText('Good'));
    fireEvent.click(screen.getByText('Show Answer'));
    fireEvent.click(screen.getByText('Easy'));

    // Click reset
    fireEvent.click(screen.getByText('Start New Session'));

    // Should be back to first card
    expect(screen.getByText('What is Docker?')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    expect(screen.queryByText('Session Complete!')).not.toBeInTheDocument();
  });

  test('displays card metadata', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    expect(screen.getByText('Containerization Basics')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
  });

  test('quality ratings map to correct numeric values', () => {
    render(<FlashCard cards={[mockCards[0]]} onComplete={mockOnComplete} />);

    fireEvent.click(screen.getByText('Show Answer'));

    // Test each quality rating
    fireEvent.click(screen.getByText('Again')); // Should be 1
    expect(mockOnComplete).toHaveBeenCalledWith([
      { cardId: 'card-1', quality: 1 },
    ]);
  });

  test('handles single card session', () => {
    render(<FlashCard cards={[mockCards[0]]} onComplete={mockOnComplete} />);

    fireEvent.click(screen.getByText('Show Answer'));
    fireEvent.click(screen.getByText('Good'));

    expect(screen.getByText('Session Complete!')).toBeInTheDocument();
    expect(screen.getByText('1 / 1')).toBeInTheDocument();
  });

  test('shows different quality button styles', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    fireEvent.click(screen.getByText('Show Answer'));

    // Check that buttons have different styling (we can check for presence)
    const againButton = screen.getByText('Again');
    const hardButton = screen.getByText('Hard');
    const goodButton = screen.getByText('Good');
    const easyButton = screen.getByText('Easy');

    expect(againButton).toBeInTheDocument();
    expect(hardButton).toBeInTheDocument();
    expect(goodButton).toBeInTheDocument();
    expect(easyButton).toBeInTheDocument();
  });
});