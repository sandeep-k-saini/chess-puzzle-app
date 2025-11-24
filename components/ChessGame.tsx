'use client';

import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { IPuzzle } from '@/models/Puzzle';
import Sidebar from '@/components/SideBar';
import Header from '@/components/Header';

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [puzzle, setPuzzle] = useState<IPuzzle | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [status, setStatus] = useState('Loading puzzle...');
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNewPuzzle();
  }, []);

  async function loadNewPuzzle() {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/puzzles');
      
      if (!res.ok) {
        throw new Error('Failed to fetch puzzle');
      }
      
      const data = await res.json();
      
      if (!data || !data.fen) {
        setError('No puzzles found! Please create puzzles in the admin panel at /admin');
        setLoading(false);
        return;
      }
      
      setPuzzle(data);
      
      const newGame = new Chess(data.fen);
      setGame(newGame);
      setPlayerColor(data.playerColor);
      setHintIndex(0);
      setStatus(`${data.playerColor === 'white' ? 'White' : 'Black'} to move - ${data.goalText}`);
      setLoading(false);
      
    } catch (err) {
      console.error('Error loading puzzle:', err);
      setError('Failed to load puzzle. Please try again.');
      setLoading(false);
    }
  }

  async function makeAIMove(currentFen: string) {
    try {
      const res = await fetch('/api/ai-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: currentFen })
      });
      
      if (!res.ok) throw new Error('AI move failed');
      
      const { fen } = await res.json();
      const newGame = new Chess(fen);
      setGame(newGame);
      updateStatus(newGame);
    } catch (err) {
      console.error('AI move error:', err);
      setStatus('❌ AI move failed');
    }
  }

  function onPieceDrop(sourceSquare: string, targetSquare: string) {
    try {
      const gameCopy = new Chess(game.fen());
      
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });
      
      if (move === null) return false;
      
      setGame(gameCopy);
      updateStatus(gameCopy);
      
      if (!gameCopy.isGameOver() && gameCopy.turn() !== playerColor[0]) {
        setTimeout(() => makeAIMove(gameCopy.fen()), 500);
      }
      
      return true;
    } catch (error) {
      console.error('Move error:', error);
      return false;
    }
  }

  function updateStatus(currentGame: Chess) {
    if (currentGame.isCheckmate()) {
      setStatus('🏆 Checkmate! Puzzle solved!');
    } else if (currentGame.isDraw()) {
      setStatus('Game drawn');
    } else if (currentGame.isCheck()) {
      setStatus(`${currentGame.turn() === 'w' ? 'White' : 'Black'} is in check!`);
    } else {
      setStatus(`${currentGame.turn() === 'w' ? 'White' : 'Black'} to move`);
    }
  }

  function showHint() {
    if (!puzzle || hintIndex >= puzzle.hints.length) {
      setStatus('No more hints available!');
      return;
    }
    setStatus(`💡 Hint: ${puzzle.hints[hintIndex]}`);
    setHintIndex(hintIndex + 1);
  }

  function resetPuzzle() {
    if (!puzzle) return;
    const newGame = new Chess(puzzle.fen);
    setGame(newGame);
    setHintIndex(0);
    updateStatus(newGame);
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-custom text-white p-8 ">
        <div className="bg-custom-white p-8 rounded-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">❌ {error}</h2>
          <p className="mb-6 text-gray-400">
            Create your first puzzle in the admin panel to get started.
          </p>
          <div className="flex flex-col gap-3">
            <a href="/admin" className="bg-orange-600 hover:bg-orange-700 p-3 rounded font-semibold">
              🛠️ Go to Admin Panel
            </a>
            <button onClick={loadNewPuzzle} className="bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold">
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-custom text-white">
        <div className="text-2xl">⏳ Loading puzzle...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-custom">
     
      <Sidebar />
      <div className="w-full">
         <Header />
        <div className="flex gap-6 p-4">
         
          <div className="bg-custom-white p-6 rounded-lg h-fit">
        <style jsx>{`
          .custom-board :global([data-piece*="w"]) {
            filter: brightness(0.95) sepia(1) saturate(1.5) hue-rotate(25deg) !important;
          }
          .custom-board :global([data-piece*="b"]) {
            filter: brightness(0.3) !important;
          }
        `}</style>
        <div className="custom-board">
          <Chessboard 
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardWidth={500}
            boardOrientation={playerColor}
            arePiecesDraggable={true}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
            customLightSquareStyle={{ backgroundColor: '#CADBE1' }}
            customDarkSquareStyle={{ backgroundColor: '#6796AD' }}
          />
        </div>
      </div>
      
      <div className="w-96 bg-custom-white p-6 rounded-lg h-fit">
        <h2 className="text-2xl font-bold mb-4">🧩 Chess Puzzle</h2>
        
        <div className="bg-custom-grayy p-4 rounded mb-4">
          <p>{status}</p>
        </div>
        
        <div className="bg-custom-grayy p-4 rounded mb-4 min-h-[100px]">
          <p className="text-sm text-gray-400 mb-2">💡 Hint</p>
          <p>{puzzle?.hints[Math.max(0, hintIndex - 1)] || 'Click "Show Hint" for help'}</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button onClick={showHint} className="bg-green-600 hover:bg-green-700 p-3 rounded font-semibold">
            💡 Show Hint
          </button>
          <button onClick={loadNewPuzzle} className="bg-orange-600 hover:bg-orange-700 p-3 rounded font-semibold">
            🧩 New Puzzle
          </button>
          <button onClick={resetPuzzle} className="bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold">
            🔄 Reset
          </button>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
