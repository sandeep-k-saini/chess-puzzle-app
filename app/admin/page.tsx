'use client';

import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square } from 'chess.js';
import SideBar from '../../components/SideBar';
import Header from '../../components/Header';

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

  // Allow pieces to be placed ANYWHERE (bypass chess rules)
  function onPieceDrop(sourceSquare: string, targetSquare: string) {
    try {
      const board = game.board();
      const sourceFile = sourceSquare.charCodeAt(0) - 97;
      const sourceRank = 8 - parseInt(sourceSquare[1]);
      const targetFile = targetSquare.charCodeAt(0) - 97;
      const targetRank = 8 - parseInt(targetSquare[1]);
      
      const piece = board[sourceRank][sourceFile];
      
      if (!piece) return false;
      
      const newBoard = board.map(row => [...row]);
      newBoard[targetRank][targetFile] = piece;
      newBoard[sourceRank][sourceFile] = null;
      
      const newFen = boardToFen(newBoard);
      const newGame = new Chess(newFen);
      setGame(newGame);
      
      return true;
    } catch (error) {
      console.error('Move error:', error);
      return false;
    }
  }

  // Right-click to delete piece
  function onSquareRightClick(square: Square) {
    const piece = game.get(square);
    if (piece) {
      removePiece(square);
    }
  }

  function removePiece(square: Square) {
    try {
      const board = game.board();
      const file = square.charCodeAt(0) - 97;
      const rank = 8 - parseInt(square[1]);
      
      const newBoard = board.map(row => [...row]);
      newBoard[rank][file] = null;
      
      const newFen = boardToFen(newBoard);
      const newGame = new Chess(newFen);
      setGame(newGame);
    } catch (error) {
      console.error('Failed to remove piece:', error);
    }
  }

  function boardToFen(board: any[]): string {
    let fen = '';
    for (let i = 0; i < 8; i++) {
      let empty = 0;
      for (let j = 0; j < 8; j++) {
        const square = board[i][j];
        if (square) {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          const pieceChar = square.type;
          fen += square.color === 'w' ? pieceChar.toUpperCase() : pieceChar;
        } else {
          empty++;
        }
      }
      if (empty > 0) fen += empty;
      if (i < 7) fen += '/';
    }
    fen += ' w KQkq - 0 1';
    return fen;
  }

  return (
   <div className="flex min-h-screen bg-custom">
     
<SideBar />
      <div className="w-full">
         <Header />
        <div className=" gap-6 p-4">
      <div className="flex items-center justify-between mb-8">

       
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
        
          <div className="bg-custom-white p-4 rounded-lg inline-block w-[100%]">
         <center>
             <Chessboard 
              position={game.fen()}
              onPieceDrop={onPieceDrop}
              onSquareRightClick={onSquareRightClick}
              // boardWidth={400}
              arePiecesDraggable={true}
              customBoardStyle={{
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              }}
              customLightSquareStyle={{ backgroundColor: '#CADBE1' }}
              customDarkSquareStyle={{ backgroundColor: '#6796AD' }}
            />
         </center>
          </div>
          <div className="mt-4 bg-custom-white p-4 rounded">
            <p className="text-sm text-gray-400 mb-2 font-semibold">Current FEN:</p>
            <p className="text-xs font-mono break-all text-green-400">{game.fen()}</p>
          </div>
          
          {/* Instructions */}
          <div className="mt-4 text-white border  p-4 rounded"  style={{ background: 'linear-gradient(131.65deg, #6340FF 9.43%, #FF40C6 70.51%, #FF8040 131.59%)' }}>
            <p className="text-sm font-semibold mb-2">💡 Controls:</p>
            <ul className="text-sm space-y-1">
              <li>• <strong>Move pieces ANYWHERE:</strong> Drag and drop (no restrictions!)</li>
              <li>• <strong>Delete piece:</strong> Right-click on any piece</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-custom-white p-6 rounded-lg h-fit">
          <h2 className="text-xl mb-4 font-semibold">Puzzle Details</h2>
          
          <label className="block mb-4">
            <span className="block mb-2 font-medium">Goal Text: *</span>
            <input 
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g., Checkmate in 2 moves"
              className="w-full p-3 bg-custom-grayy rounded  border border-gray-600 focus:border-blue-500 focus:outline-none"
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
              className="w-full p-3 bg-custom-grayy rounded  border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </label>
          
          <label className="block mb-4">
            <span className="block mb-2 font-medium">Solution (comma-separated moves):</span>
            <input 
              type="text"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Qxf7+, Kh8, Qf8#"
              className="w-full p-3 bg-custom-grayy rounded  border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </label>
          
          <label className="block mb-4">
            <span className="block mb-2 font-medium">Player Color:</span>
            <select 
              value={playerColor} 
              onChange={(e) => setPlayerColor(e.target.value as 'white' | 'black')}
              className="w-full p-3 bg-custom-grayy rounded  border border-gray-600 focus:border-blue-500 focus:outline-none"
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
              className="w-full p-3 bg-custom-grayy rounded  border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </label>
          
          <div className="flex gap-4">
            <button 
              onClick={savePuzzle} 
              className="flex-1 bg-green-600 text-white hover:bg-green-700 p-3 rounded font-semibold transition-colors"
              style={{fontSize:"15px"}}
            >
              Save Puzzle
            </button>
            <button 
              onClick={resetForm} 
              className="flex-1 bg-red-600 text-white hover:bg-red-600 p-3 rounded font-semibold transition-colors"
              style={{fontSize:"15px"}}
            >
               Reset
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
