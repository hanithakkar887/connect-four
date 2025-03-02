
const connectFourUtils = {
  // Deep clone a 2D array (game board)
  deepClone: (board) => {
    return board.map(column => [...column]);
  },
  
  // Check if the board has a winner or is a draw
  checkForWinner: (board) => {
    // Check for horizontal wins
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = board[col][row];
        if (cell !== null &&
            cell === board[col+1][row] &&
            cell === board[col+2][row] &&
            cell === board[col+3][row]) {
          return cell; // Return the winning color
        }
      }
    }
    
    // Check for vertical wins
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 3; row++) {
        const cell = board[col][row];
        if (cell !== null &&
            cell === board[col][row+1] &&
            cell === board[col][row+2] &&
            cell === board[col][row+3]) {
          return cell; // Return the winning color
        }
      }
    }
    
    // Check for diagonal wins (bottom-left to top-right)
    for (let col = 0; col < 4; col++) {
      for (let row = 3; row < 6; row++) {
        const cell = board[col][row];
        if (cell !== null &&
            cell === board[col+1][row-1] &&
            cell === board[col+2][row-2] &&
            cell === board[col+3][row-3]) {
          return cell; // Return the winning color
        }
      }
    }
    
    // Check for diagonal wins (top-left to bottom-right)
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        const cell = board[col][row];
        if (cell !== null &&
            cell === board[col+1][row+1] &&
            cell === board[col+2][row+2] &&
            cell === board[col+3][row+3]) {
          return cell; // Return the winning color
        }
      }
    }
    
    // Check if the board is full (draw)
    const isFull = board.every(column => column.every(cell => cell !== null));
    if (isFull) {
      return 'draw';
    }
    
    // No winner yet
    return null;
  }
};

export default connectFourUtils;