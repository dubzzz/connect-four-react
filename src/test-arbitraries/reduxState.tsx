import * as fc from 'fast-check';
import { ReduxState } from '../redux/reducers';
import {
  gridArb,
  topRightDiagonalVictoryPlayOnGridArb,
  lineVictoryPlayOnGridArb,
  columnVictoryPlayOnGridArb,
  topLeftDiagonalVictoryPlayOnGridArb,
  noVictoryPlayOnGridArb,
  playOnFullColumnGridArb
} from './grid';
import { playerOrNoneArb, playerArb } from './player';
import { Player } from '../models/player';
import { playToken } from '../redux/reducers/grid';

export const anyStateArb: fc.Arbitrary<ReduxState> = fc.record({
  connectFour: fc.record({
    grid: gridArb,
    winner: playerOrNoneArb,
    currentPlayer: playerOrNoneArb,
    history: fc.record({ past: fc.constant([]), future: fc.constant([]) })
  })
});

export const notPlayableStateArb = fc
  .tuple(playOnFullColumnGridArb, playerArb)
  .map(([{ grid, selectedColumn }, player]) => {
    const state: ReduxState = {
      connectFour: {
        grid,
        currentPlayer: player,
        winner: Player.None,
        history: { past: [], future: [] }
      }
    };
    return { state, selectedColumn };
  });
export const playableVictoryStateArb = fc
  .oneof(
    lineVictoryPlayOnGridArb,
    columnVictoryPlayOnGridArb,
    topLeftDiagonalVictoryPlayOnGridArb,
    topRightDiagonalVictoryPlayOnGridArb
  )
  .map(({ grid, selectedColumn, player }) => {
    const state: ReduxState = {
      connectFour: {
        grid,
        currentPlayer: player,
        winner: Player.None,
        history: { past: [], future: [] }
      }
    };
    return { state, selectedColumn };
  });
export const playableNoVictoryStateArb = noVictoryPlayOnGridArb.map(({ grid, selectedColumn, player }) => {
  const state: ReduxState = {
    connectFour: {
      grid,
      currentPlayer: player,
      winner: Player.None,
      history: { past: [], future: [] }
    }
  };
  return { state, selectedColumn };
});

export const playableStateArb = fc.oneof(playableVictoryStateArb, playableNoVictoryStateArb);

export const gameOverStateArb = fc
  .tuple(playableVictoryStateArb, playerArb)
  .map(([{ state, selectedColumn }, randomPlayer]) => {
    return {
      connectFour: {
        grid: playToken(state.connectFour.grid, selectedColumn, state.connectFour.currentPlayer),
        winner: state.connectFour.currentPlayer,
        currentPlayer: randomPlayer, // we could have just changed the player to move the the next one but setting a purely random one might cover additional cases (maybe useful if we add some king of penalty forbidding the player to play if she/he did something wrong..)
        history: { past: [], future: [] }
      }
    };
  });
