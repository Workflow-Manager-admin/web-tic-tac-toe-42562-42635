import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main App component for Tic Tac Toe game.
 * Renders a header, centered 3x3 board, current player, status message, and reset button.
 */
function App() {
  // 3x3 board state: null means empty, 'X' or 'O' for moves
  const [board, setBoard] = useState(Array(9).fill(null));
  // Current player: true = X, false = O
  const [xIsNext, setXIsNext] = useState(true);
  // Game status (null: running, string: X/O won, 'draw')
  const [status, setStatus] = useState(null);

  // Reset the board and all states
  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setStatus(null);
  }

  // Handle a click on a cell
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || status) return; // Ignore if filled or game over

    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  // Effect: Check for a winner or draw whenever the board changes
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setStatus(winner);
    } else if (board.every((cell) => cell)) {
      setStatus("draw");
    } else {
      setStatus(null);
    }
  }, [board]);

  // Calculate display message
  let message = "";
  if (status === "draw") {
    message = "It's a draw! 😐";
  } else if (status === "X" || status === "O") {
    message = `Player ${status} wins! 🎉`;
  } else {
    message = `Player ${xIsNext ? "X" : "O"}'s turn`;
  }

  return (
    <div className="ttt-app-bg">
      <div className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
      </div>
      <div className="ttt-main-content">
        <div className="ttt-status" data-testid="status">{message}</div>
        <Board
          board={board}
          onCellClick={handleClick}
          isGameOver={!!status}
        />
        <button className="ttt-reset-btn" onClick={handleReset}>
          Reset Game
        </button>
      </div>
      <footer className="ttt-footer" />
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board component rendering a 3x3 grid of Square components.
 */
function Board({ board, onCellClick, isGameOver }) {
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {board.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onCellClick(idx)}
          disabled={!!value || isGameOver}
          ariaPos={{
            row: Math.floor(idx / 3) + 1,
            col: (idx % 3) + 1,
          }}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Square component representing a cell in the board.
 */
function Square({ value, onClick, disabled, ariaPos }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      disabled={disabled}
      role="gridcell"
      aria-rowindex={ariaPos.row}
      aria-colindex={ariaPos.col}
      aria-label={`Cell (${ariaPos.row}, ${ariaPos.col})${value ? ', ' + value : ''}`}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Calculates the winner of the game.
 * @param {Array<string|null>} squares
 * @returns {"X"|"O"|null}
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

export default App;
