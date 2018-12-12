import { PLAY_AT, NEW_GAME, CANCEL_MOVE, REDO_MOVE, REPLAY_ALL } from '../actionTypes';
import { emptyGrid, playToken, checkLastMoveOn, unplayToken } from './grid';
import { Player } from '../../models/player';
import { Actions, playAt, replayAll } from '../actions';

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

const deriveStateForPlay = function(state: State, columnIdx: number) {
  if (state.winner !== Player.None) {
    throw new Error(`Game is over, a player already won`);
  }
  const updatedGrid = playToken(state.grid, columnIdx, state.currentPlayer);
  const done = checkLastMoveOn(updatedGrid, columnIdx, DefaultDimensions.victory);
  return {
    ...state,
    grid: updatedGrid,
    currentPlayer: state.currentPlayer === Player.PlayerA ? Player.PlayerB : Player.PlayerA,
    winner: done ? state.currentPlayer : Player.None,
    history: { past: [columnIdx, ...state.history.past], future: [] }
  };
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
      const { columnIdx } = (action as ReturnType<typeof playAt>).payload;
      return deriveStateForPlay(state, columnIdx);
    }
    case REPLAY_ALL: {
      const { columns, initialPlayer } = (action as ReturnType<typeof replayAll>).payload;
      const initialState = {
        ...state,
        currentPlayer: initialPlayer,
        grid: emptyGrid(DefaultDimensions.width, DefaultDimensions.height),
        winner: Player.None,
        history: { past: [], future: [] }
      };
      return columns.reduce(
        (prevState: State, columnIdx: number) => deriveStateForPlay(prevState, columnIdx),
        initialState
      );
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
