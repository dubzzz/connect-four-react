import { NEW_GAME, PLAY_AT } from './actionTypes';

export const newGame = () => ({
  type: NEW_GAME,
  payload: null
});
export const playAt = (columnIdx: number) => ({
  type: PLAY_AT,
  payload: { columnIdx }
});

export type Actions = ReturnType<typeof newGame> | ReturnType<typeof playAt>;
