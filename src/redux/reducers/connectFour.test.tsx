import * as fc from 'fast-check';
import reducer, { DefaultDimensions } from './connectFour';
import { anyStateArb } from '../../test-arbitraries/reduxState';
import { Player } from '../../models/player';

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
