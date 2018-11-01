import * as fc from 'fast-check';
import reducer, { DefaultDimensions } from './connectFour';
import {
  anyStateArb,
  playableStateArb,
  playableNoVictoryStateArb,
  playableVictoryStateArb,
  gameOverStateArb,
  notPlayableStateArb
} from '../../test-arbitraries/reduxState';
import { Player } from '../../models/player';
import { playToken } from './grid';

describe('NEW_GAME', () => {
  it('Should create a new grid', () =>
    fc.assert(
      fc.property(anyStateArb, state => {
        const nextSubState = reducer(state.connectFour, { type: 'NEW_GAME', payload: null });
        expect(nextSubState.grid.length).toBe(DefaultDimensions.height);
        expect(nextSubState.grid[0].length).toBe(DefaultDimensions.width);
        for (let j = 0; j !== DefaultDimensions.height; ++j)
          for (let i = 0; i !== DefaultDimensions.width; ++i) if (nextSubState.grid[j][i] !== Player.None) return false;
        return true;
      })
    ));
  it('Should reset the winner to None', () =>
    fc.assert(
      fc.property(anyStateArb, state => {
        const nextSubState = reducer(state.connectFour, { type: 'NEW_GAME', payload: null });
        return nextSubState.winner === Player.None;
      })
    ));
  it('Should keep the same current player', () =>
    fc.assert(
      fc.property(anyStateArb, state => {
        const nextSubState = reducer(state.connectFour, { type: 'NEW_GAME', payload: null });
        return nextSubState.currentPlayer === state.connectFour.currentPlayer;
      })
    ));
});

describe('PLAY_AT', () => {
  it('Should always switch to another valid player', () =>
    fc.assert(
      fc.property(playableStateArb, ({ state, selectedColumn }) => {
        const nextSubState = reducer(state.connectFour, { type: 'PLAY_AT', payload: { columnIdx: selectedColumn } });
        return (
          nextSubState.currentPlayer !== state.connectFour.currentPlayer && nextSubState.currentPlayer !== Player.None
        );
      })
    ));
  it('Should not impact winner if no victory', () =>
    fc.assert(
      fc.property(playableNoVictoryStateArb, ({ state, selectedColumn }) => {
        const nextSubState = reducer(state.connectFour, { type: 'PLAY_AT', payload: { columnIdx: selectedColumn } });
        return nextSubState.winner === Player.None;
      })
    ));
  it('Should set winner on victory', () =>
    fc.assert(
      fc.property(playableVictoryStateArb, ({ state, selectedColumn }) => {
        const nextSubState = reducer(state.connectFour, { type: 'PLAY_AT', payload: { columnIdx: selectedColumn } });
        return nextSubState.winner === state.connectFour.currentPlayer;
      })
    ));
  it('Should add the token into the grid', () =>
    fc.assert(
      fc.property(playableStateArb, ({ state, selectedColumn }) => {
        const nextSubState = reducer(state.connectFour, { type: 'PLAY_AT', payload: { columnIdx: selectedColumn } });
        const expectedGrid = playToken(state.connectFour.grid, selectedColumn, state.connectFour.currentPlayer);
        expect(nextSubState.grid).toEqual(expectedGrid);
      })
    ));
  it('Should throw if the column is full', () =>
    fc.assert(
      fc.property(notPlayableStateArb, ({ state, selectedColumn }) => {
        expect(() => reducer(state.connectFour, { type: 'PLAY_AT', payload: { columnIdx: selectedColumn } })).toThrow();
      })
    ));
  it('Should throw if the game is over', () =>
    fc.assert(
      fc.property(gameOverStateArb, fc.nat(DefaultDimensions.width - 1), (state, selectedColumn) => {
        expect(() => reducer(state.connectFour, { type: 'PLAY_AT', payload: { columnIdx: selectedColumn } })).toThrow();
      })
    ));
});
