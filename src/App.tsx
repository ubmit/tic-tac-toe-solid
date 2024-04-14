import { createSignal, type Component, Show, createEffect } from "solid-js";
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
  [2, 4, 2],
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
    if (winner() || squares().every(Boolean) || squares()[id] !== null) return;

    let newSquares = squares().map((square, index) => {
      return id === index ? currentPlayer() : square;
    });

    setSquares(newSquares);
  }

  return (
    <main class={styles.container}>
      <span>{gameStatus()}</span>
      <div class={styles.board}>
        {squares().map((square, index) => (
          <div onClick={() => handleClick(index)} class={styles.square}>
            {square !== null ? square : ""}
          </div>
        ))}
      </div>
      <button onClick={() => setSquares(INITIAL_STATE)}>reset</button>
    </main>
  );
};

export default App;
