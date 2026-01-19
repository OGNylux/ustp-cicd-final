import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { GameBoard } from '../GameBoard';
import { createEmptyBoard, TETROMINOES, type Tetromino } from '@/lib/tetris';

// Mock canvas context
const mockContext = {
  clearRect: vi.fn(),
  strokeRect: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 0,
  font: '',
  textAlign: '',
  textBaseline: '',
};

HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext as any);

describe('GameBoard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render canvas element', () => {
    const board = createEmptyBoard();
    const { container } = render(
      <GameBoard board={board} currentPiece={null} gameOver={false} />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should render board with correct dimensions', () => {
    const board = createEmptyBoard();
    const { container } = render(
      <GameBoard board={board} currentPiece={null} gameOver={false} />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('width', '300'); // 10 * 30
    expect(canvas).toHaveAttribute('height', '600'); // 20 * 30
  });

  it('should clear canvas on render', () => {
    const board = createEmptyBoard();
    render(<GameBoard board={board} currentPiece={null} gameOver={false} />);
    
    expect(mockContext.clearRect).toHaveBeenCalled();
  });

  it('should render empty board cells', () => {
    const board = createEmptyBoard();
    render(<GameBoard board={board} currentPiece={null} gameOver={false} />);
    
    // Should draw grid lines for all cells (10 * 20 = 200 cells)
    expect(mockContext.strokeRect).toHaveBeenCalled();
  });

  it('should render filled cells with color', () => {
    const board = createEmptyBoard();
    board[19][5] = { filled: true, color: 'red' };
    
    render(<GameBoard board={board} currentPiece={null} gameOver={false} />);
    
    expect(mockContext.fillRect).toHaveBeenCalled();
  });

  it('should render current piece when provided', () => {
    const board = createEmptyBoard();
    const currentPiece: Tetromino = {
      type: 'T',
      shape: TETROMINOES['T'].shape.map(row => [...row]),
      color: 'purple',
      position: { x: 4, y: 5 },
    };
    
    render(<GameBoard board={board} currentPiece={currentPiece} gameOver={false} />);
    
    expect(mockContext.fillRect).toHaveBeenCalled();
  });

  it('should display game over message when game is over', () => {
    const board = createEmptyBoard();
    render(<GameBoard board={board} currentPiece={null} gameOver={true} />);
    
    expect(mockContext.fillText).toHaveBeenCalledWith(
      'GAME OVER',
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should not display game over message when game is active', () => {
    const board = createEmptyBoard();
    render(<GameBoard board={board} currentPiece={null} gameOver={false} />);
    
    expect(mockContext.fillText).not.toHaveBeenCalled();
  });

  it('should update when board changes', () => {
    const board = createEmptyBoard();
    const { rerender } = render(
      <GameBoard board={board} currentPiece={null} gameOver={false} />
    );
    
    const callCountBefore = mockContext.clearRect.mock.calls.length;
    
    const newBoard = createEmptyBoard();
    newBoard[0][0] = { filled: true, color: 'blue' };
    
    rerender(<GameBoard board={newBoard} currentPiece={null} gameOver={false} />);
    
    expect(mockContext.clearRect.mock.calls.length).toBeGreaterThan(callCountBefore);
  });

  it('should handle piece position at top of board', () => {
    const board = createEmptyBoard();
    const currentPiece: Tetromino = {
      type: 'I',
      shape: TETROMINOES['I'].shape.map(row => [...row]),
      color: 'cyan',
      position: { x: 3, y: -1 }, // Partially above board
    };
    
    // Should not throw error
    expect(() => {
      render(<GameBoard board={board} currentPiece={currentPiece} gameOver={false} />);
    }).not.toThrow();
  });

  it('should apply correct CSS classes', () => {
    const board = createEmptyBoard();
    const { container } = render(
      <GameBoard board={board} currentPiece={null} gameOver={false} />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('border-2', 'border-primary', 'rounded-lg');
  });
});
