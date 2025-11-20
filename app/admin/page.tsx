'use client';

import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';

export default function AdminPage() {
  const [game, setGame] = useState(new Chess());
  const [goalText, setGoalText] = useState('');
  const [hints, setHints] = useState('');
  const [solution, setSolution] = useState('');
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [difficulty, setDifficulty] = useState(3);

  async function savePuzzle() {
    if (!goalText.trim()) {
      alert('❌ Please enter a goal text');
      return;
    }

    const puzzle = {
      fen: game.fen(),
      goalText,
      hints: hints.split('\n').filter(h => h.trim()),
      solution: solution.split(',').map(s => s.trim()),
      playerColor,
      difficulty: Number(difficulty)
    };

    try {
      const res = await fetch('/api/puzzles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(puzzle)
      });

      if (res.ok) {
        alert('✅ Puzzle saved successfully!');
        resetForm();
      } else {
        const error = await res.json();
        alert(`❌ Failed to save puzzle: ${error.error}`);
      }
    } catch (err) {
      alert('❌ Network error. Please try again.');
    }
  }

  function resetForm() {
    setGame(new Chess());
    setGoalText('');
    setHints('');
    setSolution('');
    setPlayerColor('white');
    setDifficulty(3);
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
      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">🛠️ Admin - Create Puzzle</h1>
        <a href="/" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded font-semibold">
          ← Back to Game
        </a>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl mb-4 font-semibold">Setup Board Position</h2>
          <div className="bg-gray-800 p-4 rounded-lg inline-block">
            <Chessboard 
              position={game.fen()}
              onPieceDrop={onPieceDrop}
              boardWidth={500}
              arePiecesDraggable={true}
              customBoardStyle={{
                borderRadius: '4px',
              }}
            />
          </div>
          <div className="mt-4 bg-gray-800 p-4 rounded">
            <p className="text-sm text-gray-400 mb-2 font-semibold">Current FEN:</p>
            <p className="text-xs font-mono break-all text-green-400">{game.fen()}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg h-fit">
          <h2 className="text-xl mb-4 font-semibold">Puzzle Details</h2>
          
          <label className="block mb-4">
            <span className="block mb-2 font-medium">Goal Text: *</span>
            <input 
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g., Checkmate in 2 moves"
              className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </label>
          
          <label className="block mb-4">
            <span className="block mb-2 font-medium">Hints (one per line):</span>
            <textarea 
              value={hints}
              onChange={(e) => setHints(e.target.value)}
              placeholder="Look for queen sacrifice&#10;King is trapped on back rank"
              rows={4}
              className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </label>
          
          <label className="block mb-4">
            <span className="block mb-2 font-medium">Solution (comma-separated moves):</span>
            <input 
              type="text"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Qxf7+, Kh8, Qf8#"
              className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </label>
          
          <label className="block mb-4">
            <span className="block mb-2 font-medium">Player Color:</span>
            <select 
              value={playerColor} 
              onChange={(e) => setPlayerColor(e.target.value as 'white' | 'black')}
              className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="white">White</option>
              <option value="black">Black</option>
            </select>
          </label>
          
          <label className="block mb-6">
            <span className="block mb-2 font-medium">Difficulty (1-5):</span>
            <input 
              type="number"
              min="1"
              max="5"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </label>
          
          <div className="flex gap-4">
            <button 
              onClick={savePuzzle} 
              className="flex-1 bg-green-600 hover:bg-green-700 p-3 rounded font-semibold transition-colors"
            >
              💾 Save Puzzle
            </button>
            <button 
              onClick={resetForm} 
              className="flex-1 bg-red-600 hover:bg-red-700 p-3 rounded font-semibold transition-colors"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
