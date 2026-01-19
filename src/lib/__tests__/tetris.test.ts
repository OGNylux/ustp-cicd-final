import { describe, it, expect, vi } from 'vitest';
import {
  createEmptyBoard,
  getRandomTetromino,
  rotateTetromino,
  checkCollision,
  mergeTetromino,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINOES,
  type Cell,
  type Tetromino,
} from '../tetris';

describe('Tetris Game Logic', () => {
  describe('createEmptyBoard', () => {
    it('should create a board with correct dimensions', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(BOARD_HEIGHT);
      expect(board[0]).toHaveLength(BOARD_WIDTH);
    });

    it('should create a board with all cells empty', () => {
      const board = createEmptyBoard();
      board.forEach(row => {
        row.forEach(cell => {
          expect(cell.filled).toBe(false);
          expect(cell.color).toBe('');
        });
      });
    });
  });

  describe('getRandomTetromino', () => {
    it('should return a valid tetromino', () => {
      const tetromino = getRandomTetromino();
      expect(tetromino).toBeDefined();
      expect(tetromino.type).toMatch(/^[IOTSZJL]$/);
      expect(tetromino.shape).toBeDefined();
      expect(tetromino.color).toBeDefined();
      expect(tetromino.position).toBeDefined();
    });

    it('should position tetromino at top center of board', () => {
      const tetromino = getRandomTetromino();
      expect(tetromino.position.y).toBe(0);
      expect(tetromino.position.x).toBeGreaterThanOrEqual(0);
      expect(tetromino.position.x).toBeLessThan(BOARD_WIDTH);
    });

    it('should return different tetrominoes (randomness check)', () => {
      const tetrominoes = new Set();
      for (let i = 0; i < 50; i++) {
        tetrominoes.add(getRandomTetromino().type);
      }
      // With 50 iterations, we should get at least 3 different types
      expect(tetrominoes.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe('rotateTetromino', () => {
    it('should rotate I piece correctly', () => {
      const iPiece: Tetromino = {
        type: 'I',
        shape: TETROMINOES['I'].shape.map(row => [...row]),
        color: TETROMINOES['I'].color,
        position: { x: 3, y: 0 },
      };

      const rotated = rotateTetromino(iPiece);
      
      // After rotation, the horizontal I should become vertical
      expect(rotated[0][2]).toBe(1);
      expect(rotated[1][2]).toBe(1);
      expect(rotated[2][2]).toBe(1);
      expect(rotated[3][2]).toBe(1);
    });

    it('should rotate T piece correctly', () => {
      const tPiece: Tetromino = {
        type: 'T',
        shape: TETROMINOES['T'].shape.map(row => [...row]),
        color: TETROMINOES['T'].color,
        position: { x: 3, y: 0 },
      };

      const rotated = rotateTetromino(tPiece);
      
      // Verify the shape has changed
      expect(rotated).not.toEqual(tPiece.shape);
      expect(rotated.length).toBe(tPiece.shape.length);
    });

    it('should maintain square O piece after rotation', () => {
      const oPiece: Tetromino = {
        type: 'O',
        shape: TETROMINOES['O'].shape.map(row => [...row]),
        color: TETROMINOES['O'].color,
        position: { x: 4, y: 0 },
      };

      const rotated = rotateTetromino(oPiece);
      
      // O piece should look the same after rotation
      expect(rotated).toEqual(oPiece.shape);
    });
  });

  describe('checkCollision', () => {
    it('should detect left wall collision', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'I',
        shape: TETROMINOES['I'].shape.map(row => [...row]),
        color: TETROMINOES['I'].color,
        position: { x: 0, y: 5 },
      };

      const collision = checkCollision(board, tetromino, -1, 0);
      expect(collision).toBe(true);
    });

    it('should detect right wall collision', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'I',
        shape: TETROMINOES['I'].shape.map(row => [...row]),
        color: TETROMINOES['I'].color,
        position: { x: BOARD_WIDTH - 4, y: 5 },
      };

      const collision = checkCollision(board, tetromino, 1, 0);
      expect(collision).toBe(true);
    });

    it('should detect bottom collision', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'O',
        shape: TETROMINOES['O'].shape.map(row => [...row]),
        color: TETROMINOES['O'].color,
        position: { x: 4, y: BOARD_HEIGHT - 2 },
      };

      const collision = checkCollision(board, tetromino, 0, 1);
      expect(collision).toBe(true);
    });

    it('should detect collision with filled cells', () => {
      const board = createEmptyBoard();
      board[10][5] = { filled: true, color: 'red' };
      
      const tetromino: Tetromino = {
        type: 'O',
        shape: TETROMINOES['O'].shape.map(row => [...row]),
        color: TETROMINOES['O'].color,
        position: { x: 4, y: 9 },
      };

      const collision = checkCollision(board, tetromino, 0, 1);
      expect(collision).toBe(true);
    });

    it('should not detect collision in empty space', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'T',
        shape: TETROMINOES['T'].shape.map(row => [...row]),
        color: TETROMINOES['T'].color,
        position: { x: 4, y: 5 },
      };

      const collision = checkCollision(board, tetromino, 0, 1);
      expect(collision).toBe(false);
    });
  });

  describe('mergeTetromino', () => {
    it('should merge tetromino into board', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'O',
        shape: TETROMINOES['O'].shape.map(row => [...row]),
        color: 'yellow',
        position: { x: 4, y: 18 },
      };

      const newBoard = mergeTetromino(board, tetromino);
      
      expect(newBoard[18][4].filled).toBe(true);
      expect(newBoard[18][5].filled).toBe(true);
      expect(newBoard[19][4].filled).toBe(true);
      expect(newBoard[19][5].filled).toBe(true);
      expect(newBoard[18][4].color).toBe('yellow');
    });

    it('should not modify original board', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'O',
        shape: TETROMINOES['O'].shape.map(row => [...row]),
        color: 'yellow',
        position: { x: 4, y: 18 },
      };

      mergeTetromino(board, tetromino);
      
      // Original board should remain unchanged
      expect(board[18][4].filled).toBe(false);
    });

    it('should handle pieces with non-filled cells in shape', () => {
      const board = createEmptyBoard();
      const tetromino: Tetromino = {
        type: 'T',
        shape: TETROMINOES['T'].shape.map(row => [...row]),
        color: 'purple',
        position: { x: 4, y: 17 },
      };

      const newBoard = mergeTetromino(board, tetromino);
      
      // Check T shape: top middle cell
      expect(newBoard[17][5].filled).toBe(true);
      // Check T shape: bottom row
      expect(newBoard[18][4].filled).toBe(true);
      expect(newBoard[18][5].filled).toBe(true);
      expect(newBoard[18][6].filled).toBe(true);
      // Check empty cell (top left of shape)
      expect(newBoard[17][4].filled).toBe(false);
    });
  });

  describe('clearLines', () => {
    it('should clear a full line', () => {
      const board = createEmptyBoard();
      // Fill bottom line
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = { filled: true, color: 'red' };
      }

      const { newBoard, linesCleared } = clearLines(board);
      
      expect(linesCleared).toBe(1);
      expect(newBoard[BOARD_HEIGHT - 1].every(cell => !cell.filled)).toBe(true);
    });

    it('should clear multiple full lines', () => {
      const board = createEmptyBoard();
      // Fill bottom 3 lines
      for (let y = BOARD_HEIGHT - 3; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[y][x] = { filled: true, color: 'blue' };
        }
      }

      const { newBoard, linesCleared } = clearLines(board);
      
      expect(linesCleared).toBe(3);
      // All lines should now be empty
      newBoard.forEach(row => {
        expect(row.every(cell => !cell.filled)).toBe(true);
      });
    });

    it('should not clear incomplete lines', () => {
      const board = createEmptyBoard();
      // Fill bottom line except one cell
      for (let x = 0; x < BOARD_WIDTH - 1; x++) {
        board[BOARD_HEIGHT - 1][x] = { filled: true, color: 'green' };
      }

      const { newBoard, linesCleared } = clearLines(board);
      
      expect(linesCleared).toBe(0);
      expect(newBoard[BOARD_HEIGHT - 1][0].filled).toBe(true);
    });

    it('should maintain board height after clearing', () => {
      const board = createEmptyBoard();
      // Fill bottom line
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = { filled: true, color: 'red' };
      }

      const { newBoard } = clearLines(board);
      
      expect(newBoard).toHaveLength(BOARD_HEIGHT);
      expect(newBoard[0]).toHaveLength(BOARD_WIDTH);
    });

    it('should drop lines above cleared lines', () => {
      const board = createEmptyBoard();
      // Add a block at row 10
      board[10][5] = { filled: true, color: 'cyan' };
      // Fill bottom line
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = { filled: true, color: 'red' };
      }

      const { newBoard, linesCleared } = clearLines(board);
      
      expect(linesCleared).toBe(1);
      // The cyan block should have dropped one line
      expect(newBoard[11][5].filled).toBe(true);
      expect(newBoard[11][5].color).toBe('cyan');
      expect(newBoard[10][5].filled).toBe(false);
    });
  });

  describe('calculateScore', () => {
    it('should return 0 for no lines cleared', () => {
      expect(calculateScore(0, 1)).toBe(0);
      expect(calculateScore(0, 5)).toBe(0);
    });

    it('should calculate score for single line', () => {
      expect(calculateScore(1, 1)).toBe(100);
      expect(calculateScore(1, 2)).toBe(200);
      expect(calculateScore(1, 5)).toBe(500);
    });

    it('should calculate score for double lines', () => {
      expect(calculateScore(2, 1)).toBe(300);
      expect(calculateScore(2, 3)).toBe(900);
    });

    it('should calculate score for triple lines', () => {
      expect(calculateScore(3, 1)).toBe(500);
      expect(calculateScore(3, 2)).toBe(1000);
    });

    it('should calculate score for tetris (4 lines)', () => {
      expect(calculateScore(4, 1)).toBe(800);
      expect(calculateScore(4, 5)).toBe(4000);
    });

    it('should increase score with level', () => {
      const lines = 2;
      const level1Score = calculateScore(lines, 1);
      const level2Score = calculateScore(lines, 2);
      const level3Score = calculateScore(lines, 3);
      
      expect(level2Score).toBe(level1Score * 2);
      expect(level3Score).toBe(level1Score * 3);
    });
  });

  describe('calculateLevel', () => {
    it('should start at level 1', () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(5)).toBe(1);
      expect(calculateLevel(9)).toBe(1);
    });

    it('should increase level every 10 lines', () => {
      expect(calculateLevel(10)).toBe(2);
      expect(calculateLevel(15)).toBe(2);
      expect(calculateLevel(19)).toBe(2);
      expect(calculateLevel(20)).toBe(3);
      expect(calculateLevel(30)).toBe(4);
      expect(calculateLevel(100)).toBe(11);
    });
  });

  describe('getDropSpeed', () => {
    it('should decrease speed as level increases', () => {
      const speed1 = getDropSpeed(1);
      const speed2 = getDropSpeed(2);
      const speed5 = getDropSpeed(5);
      
      expect(speed1).toBeGreaterThan(speed2);
      expect(speed2).toBeGreaterThan(speed5);
    });

    it('should have maximum speed at level 1', () => {
      expect(getDropSpeed(1)).toBe(1000);
    });

    it('should not go below minimum speed', () => {
      expect(getDropSpeed(10)).toBeGreaterThanOrEqual(100);
      expect(getDropSpeed(20)).toBeGreaterThanOrEqual(100);
      expect(getDropSpeed(100)).toBeGreaterThanOrEqual(100);
    });

    it('should return 100 when calculated speed would be negative', () => {
      expect(getDropSpeed(50)).toBe(100);
    });
  });

  describe('TETROMINOES constants', () => {
    it('should have all 7 tetromino types', () => {
      const types = Object.keys(TETROMINOES);
      expect(types).toHaveLength(7);
      expect(types).toContain('I');
      expect(types).toContain('O');
      expect(types).toContain('T');
      expect(types).toContain('S');
      expect(types).toContain('Z');
      expect(types).toContain('J');
      expect(types).toContain('L');
    });

    it('should have valid shape and color for each tetromino', () => {
      Object.entries(TETROMINOES).forEach(([type, tetromino]) => {
        expect(tetromino.shape).toBeDefined();
        expect(tetromino.shape.length).toBeGreaterThan(0);
        expect(tetromino.color).toBeDefined();
        expect(typeof tetromino.color).toBe('string');
      });
    });
  });

  describe('Board constants', () => {
    it('should have standard Tetris board dimensions', () => {
      expect(BOARD_WIDTH).toBe(10);
      expect(BOARD_HEIGHT).toBe(20);
    });
  });
});
