export type Player = 0 | 1;
export type PlayerOrEmpty = Player | null;
export type Grid = PlayerOrEmpty[][];

export type Model = {
  playableColumn: boolean[];
  currentPlayer: Player;
  history: { cursor: number; grids: Grid[] };
};
