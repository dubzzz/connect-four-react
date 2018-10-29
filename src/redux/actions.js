import { PLAY_AT } from './actionTypes';

export const playAt = columnIdx => ({
  type: PLAY_AT,
  payload: { columnIdx }
});
