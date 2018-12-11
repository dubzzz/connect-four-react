import { NEW_GAME, PLAY_AT, CANCEL_MOVE, REDO_MOVE, REPLAY_ALL } from './actionTypes';

export const newGame = () => ({
  type: NEW_GAME,
  payload: null
});
export const playAt = (columnIdx: number) => ({
  type: PLAY_AT,
  payload: { columnIdx }
});
export const replayAll = (columns: number[]) => ({
  type: REPLAY_ALL,
  payload: { columns }
});
export const cancelMove = () => ({
  type: CANCEL_MOVE,
  payload: null
});
export const redoMove = () => ({
  type: REDO_MOVE,
  payload: null
});

export type Actions =
  | ReturnType<typeof newGame>
  | ReturnType<typeof playAt>
  | ReturnType<typeof replayAll>
  | ReturnType<typeof cancelMove>
  | ReturnType<typeof redoMove>;
