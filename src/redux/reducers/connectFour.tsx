import { PLAY_AT, NEW_GAME } from '../actionTypes';
import { emptyGrid, updateGrid, isSuccessfulMove } from './grid';
import { Player } from '../models/player';
import { Actions, playAt } from '../actions';

const DefaultDimensions = {
  height: 6,
  width: 7,
  victory: 4
};

const initialState = {
  grid: emptyGrid(DefaultDimensions.width, DefaultDimensions.height),
  currentPlayer: Player.PlayerA,
  winner: Player.None
};

export default function(state = initialState, action: Actions) {
  switch (action.type) {
    case NEW_GAME: {
      return {
        ...state,
        grid: emptyGrid(DefaultDimensions.width, DefaultDimensions.height),
        winner: Player.None
      };
    }
    case PLAY_AT: {
      if (state.winner !== Player.None) {
        throw new Error(`Game is over, a player already won`);
      }
      const { columnIdx } = (action as ReturnType<typeof playAt>).payload;
      const updatedGrid = updateGrid(state.grid, columnIdx, state.currentPlayer);
      const done = isSuccessfulMove(updatedGrid, columnIdx, DefaultDimensions.victory);
      return {
        ...state,
        grid: updatedGrid,
        currentPlayer: state.currentPlayer === Player.PlayerA ? Player.PlayerB : Player.PlayerA,
        winner: done ? state.currentPlayer : Player.None
      };
    }
    default:
      return state;
  }
}
