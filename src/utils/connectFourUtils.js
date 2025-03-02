// This file implements the utility functions for the Connect Four game

// Check for a winner in the Connect Four board
export const checkForWinner = (board) => {
    // Check for horizontal wins
    for (let col = 0; col < board.length - 3; col++) {
      for (let row = 0; row < board[0].length; row++) {
        if (board[col][row] !== null &&
            board[col][row] === board[col+1][row] &&
            board[col][row] === board[col+2][row] &&
            board[col][row] === board[col+3][row]) {
          return board[col][row];
        }
      }
    }
  
    // Check for vertical wins
    for (let col = 0; col < board.length; col++) {
      for (let row = 0; row < board[0].length - 3; row++) {
        if (board[col][row] !== null &&
            board[col][row] === board[col][row+1] &&
            board[col][row] === board[col][row+2] &&
            board[col][row] === board[col][row+3]) {
          return board[col][row];
        }
      }
    }
  
    // Check for diagonal wins (down-right)
    for (let col = 0; col < board.length - 3; col++) {
      for (let row = 0; row < board[0].length - 3; row++) {
        if (board[col][row] !== null &&
            board[col][row] === board[col+1][row+1] &&
            board[col][row] === board[col+2][row+2] &&
            board[col][row] === board[col+3][row+3]) {
          return board[col][row];
        }
      }
    }
  
    // Check for diagonal wins (up-right)
    for (let col = 0; col < board.length - 3; col++) {
      for (let row = 3; row < board[0].length; row++) {
        if (board[col][row] !== null &&
            board[col][row] === board[col+1][row-1] &&
            board[col][row] === board[col+2][row-2] &&
            board[col][row] === board[col+3][row-3]) {
          return board[col][row];
        }
      }
    }
  
    // Check for a draw (board is full)
    let isFull = true;
    for (let col = 0; col < board.length; col++) {
      for (let row = 0; row < board[0].length; row++) {
        if (board[col][row] === null) {
          isFull = false;
          break;
        }
      }
      if (!isFull) break;
    }
    if (isFull) return 'draw';
  
    // No winner yet
    return null;
  };
  
  // Deep clone an array or object
  export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  // Add these utilities to the window object to match the requirements
  window.connectFour = {
    checkForWinner,
    deepClone
  };
  
  export default window.connectFour;