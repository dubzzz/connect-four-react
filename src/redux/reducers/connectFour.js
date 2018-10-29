import { PLAY_AT } from '../actionTypes';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case PLAY_AT: {
      return state;
    }
    default:
      return state;
  }
}
