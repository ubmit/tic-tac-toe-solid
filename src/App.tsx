import { createSignal, type Component } from "solid-js";
import styles from "./App.module.css";

type Square = "X" | "O" | null;

const INITIAL_STATE: Square[] = new Array(9).fill(null);

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

function calculateWinner(squares: Square[]) {
  for (let combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function calculateStatus(
  squares: Square[],
  winner: Square,
  currentPlayer: "X" | "O",
) {
  return Boolean(winner)
    ? `Winner is Player ${winner}`
    : squares.every(Boolean)
      ? "The game was a draw"
      : `Player ${currentPlayer}'s turn`;
}

const App: Component = () => {
  let [squares, setSquares] = createSignal<Square[]>(INITIAL_STATE);

  let winner = () => calculateWinner(squares());
  let currentPlayer = () =>
    squares().filter(Boolean).length % 2 === 0 ? "X" : "O";
  let gameStatus = () => calculateStatus(squares(), winner(), currentPlayer());

  function handleClick(id: number) {
    if (winner() || squares()[id]) return;

    let newSquares = squares().map((square, index) => {
      return id === index ? currentPlayer() : square;
    });

    setSquares(newSquares);
  }

  function restart() {
    setSquares(INITIAL_STATE);
  }

  return (
    <main class={styles.container}>
      <span>{gameStatus()}</span>
      <Board squares={squares()} handleClick={handleClick} />
      <button onClick={restart}>restart</button>
    </main>
  );
};

type BoardProps = {
  squares: Square[];
  handleClick: (index: number) => void;
};

function Board({ squares, handleClick }: BoardProps) {
  function renderSquare(index: number) {
    return (
      <div class={styles.square} onClick={() => handleClick(index)}>
        {squares[index]}
      </div>
    );
  }

  return (
    <div>
      <div class={styles.boardRow}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div class={styles.boardRow}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div class={styles.boardRow}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

export default App;
