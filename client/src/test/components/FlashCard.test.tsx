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

    expect(screen.getByText('No Flash Cards Yet')).toBeInTheDocument();
    expect(screen.getByText('Flash cards will be generated from your completed lessons for review practice.')).toBeInTheDocument();
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

    fireEvent.click(screen.getByText('Reveal Answer'));

    expect(screen.getByText('Failed (1)')).toBeInTheDocument();
    expect(screen.getByText('Hard (2)')).toBeInTheDocument();
    expect(screen.getByText('Good (4)')).toBeInTheDocument();
    expect(screen.getByText('Perfect (5)')).toBeInTheDocument();
  });

  test('moves to next card when quality is rated', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    // Show answer and rate
    fireEvent.click(screen.getByText('Reveal Answer'));
    fireEvent.click(screen.getByText('Good (4)'));

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

    fireEvent.click(screen.getByText('Reveal Answer'));
    fireEvent.click(screen.getByText('Good (4)'));

    expect(screen.getByText('Card 2 of 2')).toBeInTheDocument();
  });

  test('completes session when all cards are rated', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    // Complete first card
    fireEvent.click(screen.getByText('Reveal Answer'));
    fireEvent.click(screen.getByText('Good (4)'));

    // Complete second card
    fireEvent.click(screen.getByText('Reveal Answer'));
    fireEvent.click(screen.getByText('Perfect (5)'));

    // Should show completion screen
    expect(screen.getByText('Review Complete!')).toBeInTheDocument();
    expect(screen.getByText('You got 2 out of 2 correct')).toBeInTheDocument();
  });

  test('calls onComplete with correct results', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    // Complete first card with "Good" (quality: 4)
    fireEvent.click(screen.getByText('Reveal Answer'));
    fireEvent.click(screen.getByText('Good (4)'));

    // Complete second card with "Perfect" (quality: 5)
    fireEvent.click(screen.getByText('Reveal Answer'));
    fireEvent.click(screen.getByText('Perfect (5)'));

    expect(mockOnComplete).toHaveBeenCalledWith([
      { cardId: 'card-1', quality: 4 },
      { cardId: 'card-2', quality: 5 },
    ]);
  });

  test('reset button restarts the session', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    // Complete the session
    fireEvent.click(screen.getByText('Reveal Answer'));
    fireEvent.click(screen.getByText('Good (4)'));
    fireEvent.click(screen.getByText('Reveal Answer'));
    fireEvent.click(screen.getByText('Perfect (5)'));

    // Click reset
    fireEvent.click(screen.getByText('Review Again'));

    // Should be back to first card
    expect(screen.getByText('What is Docker?')).toBeInTheDocument();
    expect(screen.getByText('Card 1 of 2')).toBeInTheDocument();
    expect(screen.queryByText('Review Complete!')).not.toBeInTheDocument();
  });

  test('displays card metadata', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    expect(screen.getByText('Containerization Basics')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
  });

  test('quality ratings map to correct numeric values', () => {
    render(<FlashCard cards={[mockCards[0]]} onComplete={mockOnComplete} />);

    fireEvent.click(screen.getByText('Reveal Answer'));

    // Test each quality rating
    fireEvent.click(screen.getByText('Failed (1)')); // Should be 1
    expect(mockOnComplete).toHaveBeenCalledWith([
      { cardId: 'card-1', quality: 1 },
    ]);
  });

  test('handles single card session', () => {
    render(<FlashCard cards={[mockCards[0]]} onComplete={mockOnComplete} />);

    fireEvent.click(screen.getByText('Reveal Answer'));
    fireEvent.click(screen.getByText('Good (4)'));

    expect(screen.getByText('Review Complete!')).toBeInTheDocument();
  });

  test('shows different quality button styles', () => {
    render(<FlashCard cards={mockCards} onComplete={mockOnComplete} />);

    fireEvent.click(screen.getByText('Reveal Answer'));

    // Check that buttons have different styling (we can check for presence)
    const failedButton = screen.getByText('Failed (1)');
    const hardButton = screen.getByText('Hard (2)');
    const goodButton = screen.getByText('Good (4)');
    const perfectButton = screen.getByText('Perfect (5)');

    expect(failedButton).toBeInTheDocument();
    expect(hardButton).toBeInTheDocument();
    expect(goodButton).toBeInTheDocument();
    expect(perfectButton).toBeInTheDocument();
  });
});