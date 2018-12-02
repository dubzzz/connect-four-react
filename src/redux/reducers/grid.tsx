import { Player } from '../../models/player';

/**
 * Create an empty grid with the given dimensions
 *
 * @param width Width of the grid
 * @param height Height of the grid
 */
export const emptyGrid = (width: number, height: number) => {
  return [...Array(height)].map(_ => [...Array(width)].map(_ => Player.None));
};

/**
 * Create a new grid corresponding to the current grid
 * with the addition of the new token
 *
 * WARNING: throws in case of full column
 *
 * @param grid Current grid
 * @param playedColumn Location for the new token
 * @param player Owner of the token
 */
export const playToken = (grid: Player[][], playedColumn: number, player: Player) => {
  for (let rowIdx = grid.length - 1; rowIdx >= 0; --rowIdx) {
    if (grid[rowIdx][playedColumn] === Player.None) {
      const next = [...grid].map(row => [...row]);
      next[rowIdx][playedColumn] = player;
      return next;
    }
  }
  throw new Error(`Unable to play: invalid position`);
};

/**
 * Create a new grid corresponding to the current grid
 * with the removal of the top token of the column
 *
 * WARNING: throws in case of empty column
 *
 * @param grid Current grid
 * @param playedColumn Location for the new token
 */
export const unplayToken = (grid: Player[][], playedColumn: number) => {
  for (let rowIdx = 0; rowIdx !== grid.length; ++rowIdx) {
    if (grid[rowIdx][playedColumn] !== Player.None) {
      const next = [...grid].map(row => [...row]);
      next[rowIdx][playedColumn] = Player.None;
      return next;
    }
  }
  throw new Error(`Unable to unplay: invalid position`);
};

/**
 * Check if the latest token on {@link playedColumn} makes its owner win the game
 *
 * @param grid Current grid
 * @param playedColumn Column to assess, corresponding to the latest token played
 * @param winningCondition Winning condition, minimal length for a victory
 */
export const checkLastMoveOn = (grid: Player[][], playedColumn: number, winningCondition: number) => {
  // find the index of the last token in the column
  let playedRow = 0;
  for (; grid[playedRow][playedColumn] === Player.None; ++playedRow) {}
  const player = grid[playedRow][playedColumn];

  type It = IterableIterator<{ x: number; y: number }>;
  const computeLength = (it: It) => {
    let length = 0;
    for (const pos of it) {
      if (pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 || pos.y >= grid.length || grid[pos.y][pos.x] !== player)
        break;
      ++length;
    }
    return length;
  };
  const movePositionIt = function*(x: number, y: number, dx: number, dy: number) {
    while (true) yield { x: (x += dx), y: (y += dy) };
  };
  const lengthForDirection = (dx: number, dy: number) => {
    return (
      computeLength(movePositionIt(playedColumn, playedRow, -dx, -dy)) +
      computeLength(movePositionIt(playedColumn, playedRow, dx, dy)) +
      1
    );
  };

  return (
    lengthForDirection(0, 1) >= winningCondition || // column
    lengthForDirection(1, 0) >= winningCondition || // line
    lengthForDirection(1, 1) >= winningCondition || // diagonal top-left
    lengthForDirection(1, -1) >= winningCondition // diagonal top-right
  );
};
