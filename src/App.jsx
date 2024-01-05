import { useState } from "react";
import "./App.css";
import confetti from "canvas-confetti";

const TURNS = {
  X: "×",
  O: "o",
};

const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Square = ({ children, updateBoard, index }) => {
  const handleClick = () => {
    updateBoard(index);
  };

  return (
    <div onClick={handleClick} className="square" key={index}>
      {children}
    </div>
  );
};

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X);
  const [winner, setWinner] = useState(null);
  const [xPoints, setXPoints] = useState(0);
  const [oPoints, setOPoints] = useState(0);

  const checkWinner = (boardToCheck) => {
    for (const combo of WIN_COMBINATIONS) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a];
      }
    }
    return null;
  };

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null);
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      if (newWinner === TURNS.O) {
        setOPoints((prev) => prev + 1);
      }
      if (newWinner === TURNS.X) {
        setXPoints((prev) => prev + 1);
      }
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  const resetGame = () => {
    setWinner(null);
    setBoard(Array(9).fill(null));
  };

  const restartGame = () => {
    setWinner(null);
    setXPoints(0);
    setOPoints(0);
    setTurn(TURNS.X);
    setBoard(Array(9).fill(null));
  };

  return (
    <>
      <main className="board">
        <h1 className="text__green">Tic Tac Toe</h1>
        <section className="turn">
          <div className={turn === TURNS.X ? "text__green" : ""}>
            <Square>{TURNS.X}</Square>
          </div>
          <div className={turn === TURNS.O ? "text__green" : ""}>
            <Square>{TURNS.O}</Square>
          </div>
        </section>
        <section className="game">
          {board.map((_, index) => {
            return (
              <Square key={index} updateBoard={updateBoard} index={index}>
                {board[index]}
              </Square>
            );
          })}
        </section>
        <div className="point__counter">
          <div className="player__score">
            <p>X: {xPoints}</p>
          </div>
          <div className="player__score">
            <p>O: {oPoints}</p>
          </div>
        </div>
        <div className="btn__container">
          <button className="btn" onClick={restartGame}>
            Restart
          </button>
          <button className="reset__button" onClick={resetGame}>
            Reset
          </button>
        </div>
        {winner !== null && (
          <section className="winner">
            <div className="text">
              <h2>{winner === false ? "Empate" : "Ganó:"}</h2>
              <header className="win">
                {winner && <Square>{winner}</Square>}
              </header>

              <footer>
                <button className="btn" onClick={resetGame}>
                  Jugar de nuevo
                </button>
              </footer>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default App;
