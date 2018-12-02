import { PLAY_AT, NEW_GAME, CANCEL_MOVE, REDO_MOVE } from '../actionTypes';
import { emptyGrid, playToken, checkLastMoveOn, unplayToken } from './grid';
import { Player } from '../../models/player';
import { Actions, playAt } from '../actions';

export const DefaultDimensions = {
  height: 6,
  width: 7,
  victory: 4
};

type State = {
  grid: Player[][];
  currentPlayer: Player;
  winner: Player;
  history: { past: number[]; future: number[] };
};

const initialState: State = {
  grid: emptyGrid(DefaultDimensions.width, DefaultDimensions.height),
  currentPlayer: Player.PlayerA,
  winner: Player.None,
  history: { past: [], future: [] }
};

export default function(state = initialState, action: Actions) {
  switch (action.type) {
    case NEW_GAME: {
      return {
        ...state,
        grid: emptyGrid(DefaultDimensions.width, DefaultDimensions.height),
        winner: Player.None,
        history: { past: [], future: [] }
      };
    }
    case PLAY_AT: {
      if (state.winner !== Player.None) {
        throw new Error(`Game is over, a player already won`);
      }
      const { columnIdx } = (action as ReturnType<typeof playAt>).payload;
      const updatedGrid = playToken(state.grid, columnIdx, state.currentPlayer);
      const done = checkLastMoveOn(updatedGrid, columnIdx, DefaultDimensions.victory);
      return {
        ...state,
        grid: updatedGrid,
        currentPlayer: state.currentPlayer === Player.PlayerA ? Player.PlayerB : Player.PlayerA,
        winner: done ? state.currentPlayer : Player.None,
        history: { past: [columnIdx, ...state.history.past], future: [] }
      };
    }
    case CANCEL_MOVE: {
      if (state.history.past.length === 0) {
        throw new Error('Unable to undo operation, no more history available');
      }
      const [columnIdx, ...nextPast] = state.history.past;
      const updatedGrid = unplayToken(state.grid, columnIdx);
      return {
        ...state,
        grid: updatedGrid,
        currentPlayer: state.currentPlayer === Player.PlayerA ? Player.PlayerB : Player.PlayerA,
        winner: Player.None,
        history: { past: nextPast, future: [columnIdx, ...state.history.future] }
      };
    }
    case REDO_MOVE: {
      if (state.history.future.length === 0) {
        throw new Error('Unable to redo operation, no more history available');
      }
      const [columnIdx, ...nextFuture] = state.history.future;
      const updatedGrid = playToken(state.grid, columnIdx, state.currentPlayer);
      const done = checkLastMoveOn(updatedGrid, columnIdx, DefaultDimensions.victory);
      return {
        ...state,
        grid: updatedGrid,
        currentPlayer: state.currentPlayer === Player.PlayerA ? Player.PlayerB : Player.PlayerA,
        winner: done ? state.currentPlayer : Player.None,
        history: { past: [columnIdx, ...state.history.past], future: nextFuture }
      };
    }
    default:
      return state;
  }
}
