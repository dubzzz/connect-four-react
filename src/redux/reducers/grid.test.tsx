import * as fc from 'fast-check';
import { emptyGrid, playToken } from './grid';
import { Player } from '../../models/player';

describe('emptyGrid', () => {
  it('Should generate grids with the right dimensions', () =>
    fc.assert(
      fc.property(fc.nat(50), fc.nat(50), (width, height) => {
        const grid = emptyGrid(width, height);
        return grid.length === height && grid.every(row => row.length === width);
      })
    ));
  it('Should generate empty grids', () =>
    fc.assert(
      fc.property(fc.nat(50), fc.nat(50), (width, height) => {
        const grid = emptyGrid(width, height);
        return grid.every(row => row.every(cell => cell === Player.None));
      })
    ));
});

const GridWidth = 7;
const GridHeight = 6;
const playerArb = fc.constantFrom(Player.PlayerA, Player.PlayerB);
const gridArb = fc.genericTuple([...Array(GridWidth)].map(_ => fc.array(playerArb, 0, GridHeight))).map(gridSchema => {
  const grid = emptyGrid(GridWidth, GridHeight);
  for (let i = 0; i !== gridSchema.length; ++i)
    for (let j = 0; j !== gridSchema[i].length; ++j) grid[j][i] = gridSchema[i][j];
  return grid;
});
describe('playToken', () => {
  it('Should add a single token in the grid', () =>
    fc.assert(
      fc.property(gridArb, fc.nat(GridWidth - 1), playerArb, (grid, column, player) => {
        fc.pre(grid[0][column] === Player.None); // column can accept at least one more token
        const nextGrid = playToken(grid, column, player);
        let numDiffs = 0;
        for (let j = 0; j !== grid.length; ++j)
          for (let i = 0; i !== grid[j].length; ++i) if (grid[j][i] !== nextGrid[j][i]) ++numDiffs;
        return numDiffs === 1;
      })
    ));
});
