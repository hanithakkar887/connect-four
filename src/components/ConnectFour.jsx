
import React, { useState, useEffect } from 'react';
import '../utils/connectFourUtils';
import { Music, Volume2, RefreshCw, Award, Sun, Moon, Trophy, HelpCircle, X } from 'lucide-react';

// Move game logic to this file instead of importing from connectFourUtils
const connectFourUtils = {
  deepClone: (board) => {
    return JSON.parse(JSON.stringify(board));
  },
  
  checkForWinner: (board) => {
    // Check horizontal wins
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 6; row++) {
        if (board[col][row] && 
            board[col][row] === board[col + 1][row] && 
            board[col][row] === board[col + 2][row] && 
            board[col][row] === board[col + 3][row]) {
          return board[col][row];
        }
      }
    }
    
    // Check vertical wins
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 3; row++) {
        if (board[col][row] && 
            board[col][row] === board[col][row + 1] && 
            board[col][row] === board[col][row + 2] && 
            board[col][row] === board[col][row + 3]) {
          return board[col][row];
        }
      }
    }
    
    // Check diagonal wins (top-left to bottom-right)
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (board[col][row] && 
            board[col][row] === board[col + 1][row + 1] && 
            board[col][row] === board[col + 2][row + 2] && 
            board[col][row] === board[col + 3][row + 3]) {
          return board[col][row];
        }
      }
    }
    
    // Check diagonal wins (bottom-left to top-right)
    for (let col = 0; col < 4; col++) {
      for (let row = 3; row < 6; row++) {
        if (board[col][row] && 
            board[col][row] === board[col + 1][row - 1] && 
            board[col][row] === board[col + 2][row - 2] && 
            board[col][row] === board[col + 3][row - 3]) {
          return board[col][row];
        }
      }
    }
    
    // Check for draw
    const isBoardFull = board.every(column => column.every(cell => cell !== null));
    if (isBoardFull) {
      return 'draw';
    }
    
    // No winner yet
    return null;
  }
};

const ConnectFour = () => {
  // Create a 7x6 empty game board (7 columns, 6 rows)
  const createEmptyBoard = () => Array(7).fill().map(() => Array(6).fill(null));
  
  // Game state variables
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [winningCells, setWinningCells] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [dropColumnHighlight, setDropColumnHighlight] = useState(null);
  const [lastDropped, setLastDropped] = useState(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  
  // Sound effect resources
  const [dropSound] = useState(new Audio('/sounds/drop.mp3'));
  const [winSound] = useState(new Audio('/sounds/win.mp3'));
  const [drawSound] = useState(new Audio('/sounds/draw.mp3'));
  const [bgMusic] = useState(new Audio('/sounds/background-music.mp3'));
  
  // Set up background music to loop and clean up when component unmounts
  useEffect(() => {
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, [bgMusic]);
  
  // Handle celebration effect when there's a winner
  useEffect(() => {
    if (winner && winner !== 'draw') {
      findWinningCells();
      setShowCelebration(true);
      
      // Hide celebration after 5 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [winner]);
  
  // Add keyboard listener for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showRulesModal) {
        setShowRulesModal(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showRulesModal]);
  
  // Find winning cells to highlight them
  const findWinningCells = () => {
    const winningPositions = [];
    
    // Check horizontal wins
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 6; row++) {
        if (board[col][row] && 
            board[col][row] === board[col + 1][row] && 
            board[col][row] === board[col + 2][row] && 
            board[col][row] === board[col + 3][row]) {
          winningPositions.push([col, row], [col + 1, row], [col + 2, row], [col + 3, row]);
        }
      }
    }
    
    // Check vertical wins
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 3; row++) {
        if (board[col][row] && 
            board[col][row] === board[col][row + 1] && 
            board[col][row] === board[col][row + 2] && 
            board[col][row] === board[col][row + 3]) {
          winningPositions.push([col, row], [col, row + 1], [col, row + 2], [col, row + 3]);
        }
      }
    }
    
    // Check diagonal wins (top-left to bottom-right)
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (board[col][row] && 
            board[col][row] === board[col + 1][row + 1] && 
            board[col][row] === board[col + 2][row + 2] && 
            board[col][row] === board[col + 3][row + 3]) {
          winningPositions.push([col, row], [col + 1, row + 1], [col + 2, row + 2], [col + 3, row + 3]);
        }
      }
    }
    
    // Check diagonal wins (bottom-left to top-right)
    for (let col = 0; col < 4; col++) {
      for (let row = 3; row < 6; row++) {
        if (board[col][row] && 
            board[col][row] === board[col + 1][row - 1] && 
            board[col][row] === board[col + 2][row - 2] && 
            board[col][row] === board[col + 3][row - 3]) {
          winningPositions.push([col, row], [col + 1, row - 1], [col + 2, row - 2], [col + 3, row - 3]);
        }
      }
    }
    
    setWinningCells(winningPositions);
  };
  
  // Toggle background music play/pause
  const toggleBackgroundMusic = () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(e => console.log("Audio play failed:", e));
      setMusicPlaying(true);
    } else {
      bgMusic.pause();
      setMusicPlaying(false);
    }
  };
  
  // Toggle sound effects on/off
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Toggle between dark and light theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  // Toggle rules modal
  const toggleRulesModal = () => {
    setShowRulesModal(!showRulesModal);
  };
  
  // Play a sound effect if sound is enabled
  const playSound = (sound) => {
    if (!soundEnabled) return;
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play failed:", e));
  };
  
  // Handle hover over a column
  const handleColumnHover = (columnIndex) => {
    if (!gameOver && board[columnIndex][0] === null) {
      setDropColumnHighlight(columnIndex);
    }
  };
  
  // Handle leaving a column
  const handleColumnLeave = () => {
    setDropColumnHighlight(null);
  };
  
  // Handle token drop in a column
  const handleDrop = (columnIndex) => {
    // Don't allow drops if game is over
    if (gameOver) return;
    
    // Create a deep copy of the board to maintain immutability
    const newBoard = connectFourUtils.deepClone(board);
    const column = newBoard[columnIndex];
    
    // Find the lowest empty cell in the column
    let rowIndex = -1;
    for (let i = 5; i >= 0; i--) {
      if (column[i] === null) {
        rowIndex = i;
        break;
      }
    }
    
    // If column is full, do nothing
    if (rowIndex === -1) return;
    
    // Place the current player's token in the column
    newBoard[columnIndex][rowIndex] = currentPlayer;
    setBoard(newBoard);
    setLastDropped({ column: columnIndex, row: rowIndex });
    playSound(dropSound);
    
    // Check if this move resulted in a win or draw
    const result = connectFourUtils.checkForWinner(newBoard);
    
    if (result) {
      setGameOver(true);
      setWinner(result);
      
      // Play appropriate sound for the game outcome
      if (result === 'draw') {
        playSound(drawSound);
      } else {
        playSound(winSound);
      }
    } else {
      // Switch to the other player
      setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
    }
  };
  
  // Reset game to initial state
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('red');
    setGameOver(false);
    setWinner(null);
    setWinningCells([]);
    setShowCelebration(false);
    setLastDropped(null);
  };
  
  // Render the game status panel based on current state
  const renderStatus = () => {
    if (winner === 'draw') {
      return (
        <div className="flex items-center justify-center space-x-2 text-gray-200">
          <Award size={24} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">It's a Draw!</h2>
        </div>
      );
    } else if (winner) {
      return (
        <div className="flex items-center justify-center space-x-2 text-green-400">
          <Trophy size={24} className="sm:w-6 sm:h-6 md:w-7 md:h-7 animate-bounce" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{winner.toUpperCase()} WINS!</h2>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center space-x-3">
          <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full ${currentPlayer === 'red' ? 'bg-red-500 animate-pulse' : 'bg-yellow-400 animate-pulse'} shadow-lg`}></div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{currentPlayer.toUpperCase()}'s Turn</h2>
        </div>
      );
    }
  };
  
  // Theme-based CSS classes for dark/light mode
  const containerClass = darkMode 
    ? "bg-gradient-to-b from-gray-800 to-gray-900 text-white" 
    : "bg-gradient-to-b from-blue-50 to-white text-gray-800";
  
  const headerClass = darkMode
    ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500"
    : "text-blue-600";
  
  const buttonClass = darkMode
    ? "bg-purple-600 hover:bg-purple-700 text-white"
    : "bg-blue-500 hover:bg-blue-600 text-white";
  
  const statusPanelClass = darkMode
    ? "bg-gradient-to-r from-blue-900 to-blue-800"
    : "bg-gradient-to-r from-blue-100 to-blue-200 text-gray-800";
    
  const boardClass = darkMode
    ? "bg-blue-800 border-4 border-blue-700"
    : "bg-blue-300 border-4 border-blue-400";
    
  const cellClass = darkMode
    ? "bg-blue-900 border-2 border-blue-700"
    : "bg-blue-200 border-2 border-blue-400";
    
  const emptyCellClass = darkMode
    ? "bg-gray-700 border-2 border-gray-600 opacity-30"
    : "bg-gray-200 border-2 border-gray-300 opacity-40";
    
  const dropButtonClass = darkMode
    ? "bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white"
    : "bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-300 hover:to-blue-400 text-white";
    
  const modalClass = darkMode
    ? "bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 text-white"
    : "bg-gradient-to-r from-gray-100 to-white border border-gray-300 text-gray-800";
    
  const modalHeaderClass = darkMode
    ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500"
    : "text-blue-600";
    
  const modalTextClass = darkMode
    ? "text-gray-300"
    : "text-gray-600";
  
  // Check if a cell is in the winning combination
  const isWinningCell = (colIndex, rowIndex) => {
    return winningCells.some(cell => cell[0] === colIndex && cell[1] === rowIndex);
  };
  
  // Check if a cell was the last one dropped
  const isLastDroppedCell = (colIndex, rowIndex) => {
    return lastDropped && lastDropped.column === colIndex && lastDropped.row === rowIndex;
  };
  
  return (
    // Main container with full-screen layout and theme-based styling
    <div className={`min-h-screen w-full ${containerClass} transition-colors duration-500`}>
      {/* Win celebration confetti effect */}
      {showCelebration && winner !== 'draw' && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 ${winner === 'red' ? 'bg-red-500' : 'bg-yellow-400'} rounded-full animate-confetti`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `confetti ${Math.random() * 2 + 1}s linear infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={toggleRulesModal}></div>
          <div className={`${modalClass} p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-md relative z-10 animate-modalFadeIn`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl sm:text-2xl font-bold ${modalHeaderClass}`}>
                Game Rules
              </h2>
              <button 
                onClick={toggleRulesModal}
                className="p-1 rounded-full hover:bg-gray-700 hover:bg-opacity-30 transition-colors"
              >
                <X size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>
            
            <div className={`${modalTextClass} space-y-3`}>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <p><strong>Goal:</strong> Connect four of your tokens in a row - horizontally, vertically, or diagonally - before your opponent.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <p><strong>Board:</strong> The game board is 7 columns wide and 6 rows high. Each column can hold up to 6 tokens.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <p><strong>Turns:</strong> Players take turns dropping one token at a time into any non-full column. Red always goes first.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                <p><strong>Gravity:</strong> Tokens fall to the lowest available position in the chosen column.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
                <p><strong>Winning:</strong> The first player to connect four tokens wins! If the board fills completely with no winner, the game ends in a draw.</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button 
                onClick={toggleRulesModal}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Game container */}
      <div className="p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
        {/* Header section with game title and control buttons */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${headerClass} transition-all duration-300 hover:scale-105`}>Connect Four</h1>
          <div className="flex space-x-2 sm:space-x-4">
            {/* Rules button */}
            <button 
              onClick={toggleRulesModal}
              className={`${buttonClass} p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110`}
              title="Game Rules"
            >
              <HelpCircle size={16} className="sm:w-5 sm:h-5" />
            </button>
            {/* Theme toggle button */}
            <button 
              onClick={toggleTheme}
              className={`${buttonClass} p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={16} className="sm:w-5 sm:h-5" /> : <Moon size={16} className="sm:w-5 sm:h-5" />}
            </button>
            {/* Background music toggle button */}
            <button 
              onClick={toggleBackgroundMusic}
              className={`${buttonClass} p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110`}
              title={musicPlaying ? "Pause Music" : "Play Music"}
            >
              <Music size={16} className={`sm:w-5 sm:h-5 ${musicPlaying ? "opacity-100" : "opacity-50"}`} />
            </button>
            {/* Sound effects toggle button */}
            <button 
              onClick={toggleSound}
              className={`${buttonClass} p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110`}
              title={soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
            >
              <Volume2 size={16} className={`sm:w-5 sm:h-5 ${soundEnabled ? "opacity-100" : "opacity-50"}`} />
            </button>
          </div>
        </div>
        
        {/* Game status panel showing current player or winner */}
        <div className={`${statusPanelClass} p-2 sm:p-3 md:p-4 rounded-lg shadow-2xl mb-4 sm:mb-6 w-full transition-all duration-300`}>
          {renderStatus()}
        </div>
        
        {/* Game board container */}
        <div className={`${boardClass} p-2 sm:p-4 md:p-6 rounded-xl shadow-2xl transition-all duration-300`}>
          {/* Grid of 7 columns */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {board.map((column, colIndex) => (
              <div 
                key={colIndex} 
                className={`flex flex-col items-center relative ${
                  dropColumnHighlight === colIndex && !gameOver ? 'bg-opacity-20 bg-white rounded-t-lg' : ''
                }`}
                onMouseEnter={() => handleColumnHover(colIndex)}
                onMouseLeave={handleColumnLeave}
              >
                {/* Drop button for each column (only shown when game is active) */}
                {!gameOver && (
                  <button 
                    onClick={() => handleDrop(colIndex)}
                    className={`${dropButtonClass} font-bold text-xs sm:text-sm py-0.5 sm:py-1 px-1 sm:px-2 md:px-3 rounded-md mb-1 sm:mb-2 shadow-md transition-all duration-300 transform ${
                      dropColumnHighlight === colIndex ? 'scale-110 shadow-lg' : 'hover:scale-105'
                    } ${column[0] !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={column[0] !== null}
                  >
                    Drop
                  </button>
                )}
                
                {/* Drop indicator arrow (only shown when hovering and game is active) */}
                {dropColumnHighlight === colIndex && !gameOver && column[0] === null && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xl animate-bounce">
                    ⬇️
                  </div>
                )}
                
                {/* Column cells stacked from bottom to top (using flex-col-reverse) */}
                <div className="flex flex-col-reverse">
                  {column.map((cell, rowIndex) => (
                    <div 
                      key={`${colIndex}-${rowIndex}`} 
                      className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${cellClass} rounded-full p-0.5 sm:p-1 m-0.5 sm:m-1 shadow-inner flex items-center justify-center transition-all duration-300`}
                    >
                      {/* Token inside the cell - colored based on player or empty */}
                      <div 
                        className={`w-full h-full rounded-full transition-all duration-300 shadow-lg transform ${
                          isWinningCell(colIndex, rowIndex) ? 'animate-pulse scale-110' :
                          isLastDroppedCell(colIndex, rowIndex) ? 'animate-dropIn' :
                          'hover:scale-105'
                        } ${
                          cell === 'red' ? 'bg-gradient-to-br from-red-400 to-red-600 border-2 border-red-300' : 
                          cell === 'yellow' ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-200' : 
                          emptyCellClass
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Play Again button (only shown when game is over) */}
          {gameOver && (
            <div className="mt-4 sm:mt-6 flex justify-center">
              <button 
                onClick={resetGame}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold text-xs sm:text-sm py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2"
              >
                <RefreshCw size={16} className="sm:w-5 sm:h-5 animate-spin-slow" />
                <span>Play Again</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Rules button at the bottom */}
        <div className="mt-4 sm:mt-6 flex justify-center">
          <button 
            onClick={toggleRulesModal}
            className={`${buttonClass} font-bold text-xs sm:text-sm py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2`}
          >
            <HelpCircle size={16} className="sm:w-5 sm:h-5" />
            <span>Game Rules</span>
          </button>
        </div>
      </div>
      
      {/* Add custom CSS for animations */}
      <style jsx global>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes dropIn {
          0% { transform: translateY(-200px); }
          60% { transform: translateY(15px); }
          80% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes modalFadeIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-confetti {
          animation: confetti 3s ease-in-out infinite;
        }
        
        .animate-dropIn {
          animation: dropIn 0.6s ease-in-out forwards;
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        .animate-modalFadeIn {
          animation: modalFadeIn 0.3s ease-out forwards;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ConnectFour;