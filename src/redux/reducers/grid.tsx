import { Player } from '../../models/player';

export const emptyGrid = (width: number, height: number) => {
  return [...Array(height)].map(_ => [...Array(width)].map(_ => Player.None));
};

export const updateGrid = (grid: Player[][], playedColumn: number, player: Player) => {
  for (let rowIdx = grid.length - 1; rowIdx >= 0; --rowIdx) {
    if (grid[rowIdx][playedColumn] === Player.None) {
      const next = [...grid].map(row => [...row]);
      next[rowIdx][playedColumn] = player;
      return next;
    }
  }
  throw new Error(`Unable to play: invalid position`);
};

function* movePositionIt(x: number, y: number, dx: number, dy: number) {
  while (true) {
    x += dx;
    y += dy;
    yield { x, y };
  }
}

export const isSuccessfulMove = (grid: Player[][], playedColumn: number, lineLengthSpec: number) => {
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
  const lengthForDirection = (dx: number, dy: number) => {
    return (
      computeLength(movePositionIt(playedColumn, playedRow, -dx, -dy)) +
      computeLength(movePositionIt(playedColumn, playedRow, dx, dy)) +
      1
    );
  };

  return (
    lengthForDirection(0, 1) >= lineLengthSpec || // column
    lengthForDirection(1, 0) >= lineLengthSpec || // line
    lengthForDirection(1, 1) >= lineLengthSpec || // diagonal top-left
    lengthForDirection(1, -1) >= lineLengthSpec // diagonal top-right
  );
};
