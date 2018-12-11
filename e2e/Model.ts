export type Player = 0 | 1;
export type PlayerOrEmpty = Player | null;
export type Grid = PlayerOrEmpty[][];
export type PlayableColumns = boolean[];
export type HistoryState = { grid: Grid; playable: PlayableColumns; currentPlayer: Player }[];

export type Model = {
  currentPlayer: Player;
  history: { cursor: number; state: HistoryState };
  previouslySeenPaths: { [url: string]: HistoryState };
};
