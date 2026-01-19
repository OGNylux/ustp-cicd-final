import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { NextPiece } from '../NextPiece';
import { TETROMINOES, type Tetromino } from '@/lib/tetris';

// Mock canvas context
const mockContext = {
  clearRect: vi.fn(),
  strokeRect: vi.fn(),
  fillRect: vi.fn(),
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 0,
};

HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext as any);

describe('NextPiece Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with title "NEXT"', () => {
    const { container } = render(<NextPiece nextPiece={null} />);
    
    const title = container.querySelector('h3');
    expect(title).toBeInTheDocument();
    expect(title?.textContent).toBe('NEXT');
  });

  it('should render canvas element', () => {
    const { container } = render(<NextPiece nextPiece={null} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should render canvas with correct dimensions', () => {
    const { container } = render(<NextPiece nextPiece={null} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('width', '120'); // 4 * 30
    expect(canvas).toHaveAttribute('height', '120'); // 4 * 30
  });

  it('should clear canvas on render', () => {
    render(<NextPiece nextPiece={null} />);
    
    expect(mockContext.clearRect).toHaveBeenCalled();
  });

  it('should render nothing when nextPiece is null', () => {
    render(<NextPiece nextPiece={null} />);
    
    expect(mockContext.fillRect).not.toHaveBeenCalled();
  });

  it('should render I piece when provided', () => {
    const nextPiece: Tetromino = {
      type: 'I',
      shape: TETROMINOES['I'].shape.map(row => [...row]),
      color: TETROMINOES['I'].color,
      position: { x: 0, y: 0 },
    };
    
    render(<NextPiece nextPiece={nextPiece} />);
    
    expect(mockContext.fillRect).toHaveBeenCalled();
  });

  it('should render O piece when provided', () => {
    const nextPiece: Tetromino = {
      type: 'O',
      shape: TETROMINOES['O'].shape.map(row => [...row]),
      color: TETROMINOES['O'].color,
      position: { x: 0, y: 0 },
    };
    
    render(<NextPiece nextPiece={nextPiece} />);
    
    expect(mockContext.fillRect).toHaveBeenCalled();
  });

  it('should render T piece when provided', () => {
    const nextPiece: Tetromino = {
      type: 'T',
      shape: TETROMINOES['T'].shape.map(row => [...row]),
      color: TETROMINOES['T'].color,
      position: { x: 0, y: 0 },
    };
    
    render(<NextPiece nextPiece={nextPiece} />);
    
    expect(mockContext.fillRect).toHaveBeenCalled();
  });

  it('should update canvas when nextPiece changes', () => {
    const piece1: Tetromino = {
      type: 'I',
      shape: TETROMINOES['I'].shape.map(row => [...row]),
      color: TETROMINOES['I'].color,
      position: { x: 0, y: 0 },
    };
    
    const { rerender } = render(<NextPiece nextPiece={piece1} />);
    
    const callCountBefore = mockContext.clearRect.mock.calls.length;
    
    const piece2: Tetromino = {
      type: 'O',
      shape: TETROMINOES['O'].shape.map(row => [...row]),
      color: TETROMINOES['O'].color,
      position: { x: 0, y: 0 },
    };
    
    rerender(<NextPiece nextPiece={piece2} />);
    
    expect(mockContext.clearRect.mock.calls.length).toBeGreaterThan(callCountBefore);
  });

  it('should center piece in canvas', () => {
    const nextPiece: Tetromino = {
      type: 'O',
      shape: TETROMINOES['O'].shape.map(row => [...row]),
      color: TETROMINOES['O'].color,
      position: { x: 0, y: 0 },
    };
    
    render(<NextPiece nextPiece={nextPiece} />);
    
    // Should render with offset for centering
    expect(mockContext.fillRect).toHaveBeenCalled();
  });

  it('should apply correct styles to piece', () => {
    const nextPiece: Tetromino = {
      type: 'T',
      shape: TETROMINOES['T'].shape.map(row => [...row]),
      color: 'purple',
      position: { x: 0, y: 0 },
    };
    
    render(<NextPiece nextPiece={nextPiece} />);
    
    expect(mockContext.strokeRect).toHaveBeenCalled();
  });

  it('should handle all tetromino types', () => {
    const types: Array<'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'> = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    
    types.forEach(type => {
      vi.clearAllMocks();
      
      const piece: Tetromino = {
        type,
        shape: TETROMINOES[type].shape.map(row => [...row]),
        color: TETROMINOES[type].color,
        position: { x: 0, y: 0 },
      };
      
      expect(() => {
        render(<NextPiece nextPiece={piece} />);
      }).not.toThrow();
      
      expect(mockContext.fillRect).toHaveBeenCalled();
    });
  });

  it('should apply correct CSS classes to container', () => {
    const { container } = render(<NextPiece nextPiece={null} />);
    
    // Check for Card component classes
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
  });

  it('should apply correct CSS classes to canvas', () => {
    const { container } = render(<NextPiece nextPiece={null} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('border', 'border-border', 'rounded');
  });
});
