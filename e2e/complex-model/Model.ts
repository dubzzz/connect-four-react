import { Player, GridType } from '../types';

export type PlayableColumns = boolean[];
export type HistoryState = { grid: GridType; playable: PlayableColumns; currentPlayer: Player }[];

export type Model = {
  currentPlayer: Player;
  history: { cursor: number; state: HistoryState };
  previouslySeenPaths: { [url: string]: HistoryState };
};
