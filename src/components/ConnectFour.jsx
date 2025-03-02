import React, { useState, useEffect } from 'react';
import '../utils/connectFourUtils';
import { Music, Volume2, RefreshCw, Award, Sun, Moon } from 'lucide-react';

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
  
  // Play a sound effect if sound is enabled
  const playSound = (sound) => {
    if (!soundEnabled) return;
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play failed:", e));
  };
  
  // Handle token drop in a column
  const handleDrop = (columnIndex) => {
    // Don't allow drops if game is over
    if (gameOver) return;
    
    // Create a deep copy of the board to maintain immutability
    const newBoard = window.connectFour.deepClone(board);
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
    playSound(dropSound);
    
    // Check if this move resulted in a win or draw
    const result = window.connectFour.checkForWinner(newBoard);
    
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
          <Award size={24} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{winner.toUpperCase()} WINS!</h2>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center space-x-3">
          <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full ${currentPlayer === 'red' ? 'bg-red-500' : 'bg-yellow-400'} shadow-lg`}></div>
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
    
  const rulesClass = darkMode
    ? "bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600"
    : "bg-gradient-to-r from-gray-100 to-white border border-gray-300 text-gray-700";
    
  const rulesHeaderClass = darkMode
    ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500"
    : "text-blue-600";
    
  const rulesTextClass = darkMode
    ? "text-gray-300"
    : "text-gray-600";
  
  return (
    // Main container with responsive sizing and theme-based styling
    <div className={`flex flex-col items-center p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto rounded-xl shadow-2xl ${containerClass}`}>
      {/* Header section with game title and control buttons */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${headerClass}`}>Connect Four</h1>
        <div className="flex space-x-2 sm:space-x-4">
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
      <div className={`${statusPanelClass} p-2 sm:p-3 md:p-4 rounded-lg shadow-2xl mb-4 sm:mb-6 w-full`}>
        {renderStatus()}
      </div>
      
      {/* Game board container */}
      <div className={`${boardClass} p-2 sm:p-4 md:p-6 rounded-xl shadow-2xl`}>
        {/* Grid of 7 columns */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {board.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col items-center">
              {/* Drop button for each column (only shown when game is active) */}
              {!gameOver && (
                <button 
                  onClick={() => handleDrop(colIndex)}
                  className={`${dropButtonClass} font-bold text-xs sm:text-sm py-0.5 sm:py-1 px-1 sm:px-2 md:px-3 rounded-md mb-1 sm:mb-2 shadow-md transition-all duration-300 transform hover:scale-105 ${
                    column[0] !== null ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={column[0] !== null}
                >
                  Drop
                </button>
              )}
              
              {/* Column cells stacked from bottom to top (using flex-col-reverse) */}
              <div className="flex flex-col-reverse">
                {column.map((cell, rowIndex) => (
                  <div 
                    key={`${colIndex}-${rowIndex}`} 
                    className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${cellClass} rounded-full p-0.5 sm:p-1 m-0.5 sm:m-1 shadow-inner flex items-center justify-center`}
                  >
                    {/* Token inside the cell - colored based on player or empty */}
                    <div 
                      className={`w-full h-full rounded-full transition-all duration-300 shadow-lg transform hover:scale-105 ${
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
              <RefreshCw size={16} className="sm:w-5 sm:h-5" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Game rules section */}
      <div className={`mt-4 sm:mt-6 p-2 sm:p-3 md:p-4 ${rulesClass} rounded-lg w-full shadow-lg`}>
        <h3 className={`font-bold mb-1 sm:mb-2 ${rulesHeaderClass} text-base sm:text-lg`}>Game Rules:</h3>
        <ul className={`list-disc pl-4 sm:pl-5 ${rulesTextClass} space-y-0.5 sm:space-y-1 text-sm sm:text-base`}>
          <li>Board is 7 columns wide by 6 rows high</li>
          <li>Players alternate turns (red and yellow)</li>
          <li>Tokens fall to the lowest available position in the column</li>
          <li>First player to connect 4 tokens in a row (horizontally, vertically, or diagonally) wins</li>
          <li>If the board fills up with no winner, the game ends in a draw</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectFour;