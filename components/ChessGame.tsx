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
        <div className="flex flex-col md:flex-row gap-6 p-4">
         
          <div className="bg-custom-white p-6 w-[100%] md:w-[60%] rounded-3xl h-fit">
        <style jsx>{`
          .custom-board :global([data-piece*="w"]) {
            filter: brightness(0.95) sepia(1) saturate(1.5) hue-rotate(25deg) !important;
          }
          .custom-board :global([data-piece*="b"]) {
            filter: brightness(0.3) !important;
          }
        `}</style>
        <div className="custom-board">
          <center>
            <Chessboard 
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            // boardWidth={500}
            boardOrientation={playerColor}
            arePiecesDraggable={true}
            customBoardStyle={{
              borderRadius: '4px',
              // boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
            customLightSquareStyle={{ backgroundColor: '#CADBE1' }}
            customDarkSquareStyle={{ backgroundColor: '#6796AD' }}
          />  
          </center>
        </div>
<div className="bg-white rounded-3xl  p-6 w-[100%] mx-auto">
  <div className="flex items-center mb-3">
    {/* Chess icon box */}
    <span className="flex items-center justify-center bg-blue-100 rounded-3xl w-7 h-7 mr-2">
     <img src="../Images/Frame 144.svg" alt="" />
    </span>
    {/* Label */}
    <span className="font-semibold text-[#1A1D1F] text-base">White to Move</span>
    {/* Spacer */}
    <div className="flex-1" />
    {/* Controls group */}
    <div className="flex items-center  space-x-2">
      <button className="bg-white border border-gray-200 rounded-md p-2 flex items-center justify-center">
        <img src="../Images/light.svg" alt="" />
      </button>
      <div className="bg-white rounded-md px-4 py-1 text-[#6F767E] flex border border-gray-200 items-center font-medium">
      <img src="../Images/clock-three 1.svg" alt="" style={{marginRight:"10px"}} />
        00:59
      </div>
      <button className="bg-white border border-gray-200 rounded-md p-2 flex items-center justify-center">
        <svg className="w-4 h-4 text-[#6F767E]" fill="none" stroke="currentColor" viewBox="0 0 20 20">
          <path d="M12 15l-5-5 5-5" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <button className="bg-white border border-gray-200 rounded-md p-2 flex items-center justify-center">
        <svg className="w-4 h-4 text-[#6F767E]" fill="none" stroke="currentColor" viewBox="0 0 20 20">
          <path d="M8 5l5 5-5 5" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  </div>
  {/* Three wide rounded buttons */}
  <div className="flex gap-4 flex-col md:flex-row ">
    <button className="flex-1 bg-gray-100 rounded-full py-3 flex items-center justify-center font-semibold text-[#6F767E] text-base" style={{fontSize:"15px"}}>
      <img src="../Images/Vector (4).svg" style={{marginRight:"10px"}} alt="" />
      Get a Hint
    </button>
    
    <button className="flex-1 bg-gray-100 rounded-full py-3 flex items-center justify-center font-semibold text-[#6F767E] text-base" style={{fontSize:"15px"}}>
          <img src="../Images/eye 1.svg" alt="" style={{marginRight:"10px"}} />
      Solution
    </button>
    <button className="flex-1 bg-gray-100 rounded-full py-3 flex items-center justify-center font-semibold text-[#6F767E] text-base" style={{fontSize:"15px"}}>
      <img src="../Images/book 1.svg" alt="" style={{marginRight:"10px"}} />
      Analysis
    </button>
  </div>
</div>

        
      </div>
 <div className="w-[100%] md:w-[40%] flex flex-col space-y-4">
  {/* Current Session */}
  <div className="bg-white rounded-3xl p-5">
    <div className="font-semibold text-[15px] mb-4">Current Session</div>
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <div className="flex items-center">
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-green-500/10 mr-3">
          <img src="../Images/check-icon.svg" alt="" />
        </div>
        <span className="text-gray-900 font-medium">Solved</span>
      </div>
      <span className="text-[16px] font-bold text-gray-800">12</span>
    </div>
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <div className="flex items-center">
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-500/10 mr-3">
          <img src="../Images/bost.svg" alt="" />
        </div>
        <span className="text-gray-900 font-medium">Streak</span>
      </div>
      <span className="text-[16px] font-bold text-gray-800">8</span>
    </div>
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#F2705B]/10 mr-3">
          <img src="../Images/winner.svg" alt="" />
        </div>
        <span className="text-gray-900 font-medium">Rating</span>
      </div>
      <span className="text-[16px] font-bold text-gray-800">1,240</span>
    </div>
    {/* Progress info */}
    <div className="mt-4">
      <div className="rounded-full bg-gray-200 h-[6px] w-full">
        <div className="rounded-full h-[6px]" style={{width: '92%', backgroundColor: "#6366F1"}} />
      </div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm" style={{color: "#6366F1", fontWeight: 500}}>Accuracy: 92%</span>
        <span className="text-xs text-gray-400">Avg. Time: 1:23</span>
      </div>
      
    </div>
  </div>

  {/* Move History */}
  <div className="bg-white rounded-3xl  p-5">
    <div className="font-semibold text-[15px] mb-4">Move History</div>
    <div className="flex flex-col gap-2">
      <div className="rounded-xl border border-gray-200 px-4 py-2">
        <div className="font-medium text-gray-900" style={{fontSize:"14px"}}>1. e4</div>
        <div className="text-xs text-gray-500" style={{fontSize:"12px"}}>White</div>
      </div>
      <div className="rounded-xl border border-gray-200 px-4 py-2">
        <div className="font-medium text-gray-900" style={{fontSize:"14px"}}>1... e5</div>
        <div className="text-xs text-gray-500" style={{fontSize:"12px"}}>Black</div>
      </div>
      <div className="rounded-xl border border-gray-200 px-4 py-2">
        <div className="font-medium text-gray-900" style={{fontSize:"14px"}}>2. Ba4</div>
        <div className="text-xs text-gray-500" style={{fontSize:"12px"}}>White</div>
      </div>
      <div className="rounded-xl border border-gray-200 px-4 py-2">
        <div className="font-medium text-gray-900" style={{fontSize:"14px"}}>2... Nf6</div>
        <div className="text-xs text-gray-500" style={{fontSize:"12px"}}>Black</div>
      </div>
      <div className="rounded-xl border-2" style={{borderColor: "#6366F1", background: "#EEF2FF"}}>
        <div className="px-4 py-2">
          <div className="font-medium text-gray-900">3. O-O</div>
          <div className="text-xs font-semibold" style={{color: "#6366F1"}}>Current</div>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 px-4 py-2">
        <div className="font-medium text-gray-900">3... </div>
        <div className="text-xs text-gray-500">Your turn</div>
      </div>
    </div>
  </div>
</div>


      {/* <div className="w-96 bg-custom-white p-6 rounded-lg h-fit">
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
      </div> */}
        </div>
      </div>
    </div>
  );
}
