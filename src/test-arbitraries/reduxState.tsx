import * as fc from 'fast-check';
import { ReduxState } from '../redux/reducers';
import { gridArb } from './grid';
import { playerOrNoneArb } from './player';

export const anyStateArb: fc.Arbitrary<ReduxState> = fc.record({
  connectFour: fc.record({
    grid: gridArb,
    winner: playerOrNoneArb,
    currentPlayer: playerOrNoneArb
  })
});
