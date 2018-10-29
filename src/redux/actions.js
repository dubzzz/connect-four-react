import { NEW_GAME, PLAY_AT } from './actionTypes';

export const newGame = () => ({
  type: NEW_GAME,
  payload: null
});
export const playAt = columnIdx => ({
  type: PLAY_AT,
  payload: { columnIdx }
});
