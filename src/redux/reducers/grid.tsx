import { Player } from '../models/player';

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
