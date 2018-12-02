import { NEW_GAME, PLAY_AT, CANCEL_MOVE, REDO_MOVE } from './actionTypes';

export const newGame = () => ({
  type: NEW_GAME,
  payload: null
});
export const playAt = (columnIdx: number) => ({
  type: PLAY_AT,
  payload: { columnIdx }
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
  | ReturnType<typeof cancelMove>
  | ReturnType<typeof redoMove>;
