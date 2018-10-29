import { PLAY_AT, NEW_GAME } from '../actionTypes';
import { emptyGrid, updateGrid } from './grid';
import { Player } from '../models/player';

const DefaultDimensions = {
  height: 6,
  width: 7
};

const initialState = {
  grid: emptyGrid(DefaultDimensions.width, DefaultDimensions.height),
  currentPlayer: Player.PlayerA
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NEW_GAME: {
      return {
        ...state,
        grid: emptyGrid(DefaultDimensions.width, DefaultDimensions.height)
      };
    }
    case PLAY_AT: {
      const { columnIdx } = action.payload;
      return {
        ...state,
        grid: updateGrid(state.grid, columnIdx, state.currentPlayer),
        currentPlayer: state.currentPlayer === Player.PlayerA ? Player.PlayerB : Player.PlayerA
      };
    }
    default:
      return state;
  }
}
