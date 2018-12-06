export type Player = 0 | 1;
export type PlayerOrEmpty = Player | null;
export type Grid = PlayerOrEmpty[][];
export type PlayableColumns = boolean[];

export type Model = {
  currentPlayer: Player;
  history: { cursor: number; state: { grid: Grid; playable: PlayableColumns }[] };
};
