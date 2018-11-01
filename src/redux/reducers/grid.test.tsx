import * as fc from 'fast-check';
import { emptyGrid, playToken, checkLastMoveOn } from './grid';
import { Player } from '../../models/player';
import { playerArb } from '../../test-arbitraries/player';
import {
  playOnGridArb,
  playOnFullColumnGridArb,
  lineVictoryPlayOnGridArb,
  columnVictoryPlayOnGridArb,
  topLeftDiagonalVictoryPlayOnGridArb,
  topRightDiagonalVictoryPlayOnGridArb,
  noVictoryPlayOnGridArb,
  TestGridVictory
} from '../../test-arbitraries/grid';

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

describe('playToken', () => {
  it('Should put the token on top of the column', () =>
    fc.assert(
      fc.property(playOnGridArb, playerArb, ({ grid, selectedColumn }, player) => {
        const nextGrid = playToken(grid, selectedColumn, player);
        return nextGrid.map(row => row[selectedColumn]).find(c => c !== Player.None) === player;
      })
    ));
  it('Should add a single token in the grid', () =>
    fc.assert(
      fc.property(playOnGridArb, playerArb, ({ grid, selectedColumn }, player) => {
        const nextGrid = playToken(grid, selectedColumn, player);
        let numDiffs = 0;
        for (let j = 0; j !== grid.length; ++j)
          for (let i = 0; i !== grid[j].length; ++i) if (grid[j][i] !== nextGrid[j][i]) ++numDiffs;
        return numDiffs === 1;
      })
    ));
  it('Should throw on non playable column', () =>
    fc.assert(
      fc.property(playOnFullColumnGridArb, playerArb, ({ grid, selectedColumn }, player) => {
        expect(() => playToken(grid, selectedColumn, player)).toThrow();
      })
    ));
  it('Should not alter existing grid', () =>
    fc.assert(
      fc.property(playOnGridArb, playerArb, ({ grid, selectedColumn }, player) => {
        const clonedGrid = grid.map(row => row.slice());
        playToken(grid, selectedColumn, player);
        expect(grid).toEqual(clonedGrid);
      })
    ));
});

describe('checkLastMoveOn', () => {
  it('Should detect victory when ending line', () =>
    fc.assert(
      fc.property(lineVictoryPlayOnGridArb, ({ grid, selectedColumn, player }) => {
        const nextGrid = playToken(grid, selectedColumn, player);
        return checkLastMoveOn(nextGrid, selectedColumn, TestGridVictory);
      })
    ));
  it('Should detect victory when ending column', () =>
    fc.assert(
      fc.property(columnVictoryPlayOnGridArb, ({ grid, selectedColumn, player }) => {
        const nextGrid = playToken(grid, selectedColumn, player);
        return checkLastMoveOn(nextGrid, selectedColumn, TestGridVictory);
      })
    ));
  it('Should detect victory when ending top-left diagonal', () =>
    fc.assert(
      fc.property(topLeftDiagonalVictoryPlayOnGridArb, ({ grid, selectedColumn, player }) => {
        const nextGrid = playToken(grid, selectedColumn, player);
        return checkLastMoveOn(nextGrid, selectedColumn, TestGridVictory);
      })
    ));
  it('Should detect victory when ending top-right diagonal', () =>
    fc.assert(
      fc.property(topRightDiagonalVictoryPlayOnGridArb, ({ grid, selectedColumn, player }) => {
        const nextGrid = playToken(grid, selectedColumn, player);
        return checkLastMoveOn(nextGrid, selectedColumn, TestGridVictory);
      })
    ));
  it('Should not detect victory when no victory', () =>
    fc.assert(
      fc.property(noVictoryPlayOnGridArb, ({ grid, selectedColumn, player }) => {
        const nextGrid = playToken(grid, selectedColumn, player);
        return !checkLastMoveOn(nextGrid, selectedColumn, TestGridVictory);
      })
    ));
});
