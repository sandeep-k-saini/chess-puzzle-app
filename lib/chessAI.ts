import { Chess } from 'chess.js';

// Simple AI: Makes random legal moves
export function makeRandomMove(fen: string): string | null {
  const game = new Chess(fen);
  const moves = game.moves();
  
  if (moves.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * moves.length);
  const move = moves[randomIndex];
  
  game.move(move);
  return game.fen();
}

// Better AI: Minimax with basic evaluation
export function makeSmartMove(fen: string, depth: number = 2): string | null {
  const game = new Chess(fen);
  const bestMove = minimax(game, depth, -Infinity, Infinity, true);
  
  if (!bestMove.move) return null;
  
  game.move(bestMove.move);
  return game.fen();
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizing: boolean): { move: string | null; score: number } {
  if (depth === 0 || game.isGameOver()) {
    return { move: null, score: evaluateBoard(game) };
  }
  
  const moves = game.moves();
  let bestMove: string | null = null;
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of moves) {
      game.move(move);
      const result = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      
      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break;
    }
    return { move: bestMove, score: maxScore };
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      game.move(move);
      const result = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      
      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break;
    }
    return { move: bestMove, score: minScore };
  }
}

// Basic piece value evaluation
function evaluateBoard(game: Chess): number {
  const pieceValues: Record<string, number> = {
    p: 1, n: 3, b: 3, r: 5, q: 9, k: 0
  };
  
  let score = 0;
  const board = game.board();
  
  for (const row of board) {
    for (const square of row) {
      if (square) {
        const value = pieceValues[square.type];
        score += square.color === 'w' ? value : -value;
      }
    }
  }
  
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -10000 : 10000;
  }
  
  return score;
}
