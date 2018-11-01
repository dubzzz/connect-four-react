import React from 'react';
import { shallow } from 'enzyme';

import { Board } from './Board';
import fc from 'fast-check';
import { playerOrNoneArb, playerArb } from '../test-arbitraries/player';
import BoardColumn from './BoardColumn';
import { gridArb } from '../test-arbitraries/grid';
import { Player } from '../models/player';

describe('<Board />', () => {
  it('Should render the right number of <BoardColumn />', () =>
    fc.assert(
      fc.property(
        fc.tuple(fc.integer(1, 50), fc.integer(1, 50)).chain(([width, height]) =>
          fc.array(playerOrNoneArb, width * height, width * height).map(line => {
            let grid = [];
            for (let j = 0; j !== height; ++j) grid.push(line.slice(j * width, (j + 1) * width));
            return grid;
          })
        ),
        playerArb,
        fc.boolean(),
        (grid, currentPlayer, done) => {
          const mockPlayAtFn = jest.fn();
          const wrapper = shallow(
            <Board grid={grid} currentPlayer={currentPlayer} done={done} playAt={mockPlayAtFn} />
          );
          expect(wrapper.find(BoardColumn)).toHaveLength(grid[0].length);
        }
      )
    ));
  it('Should build playable <BoardColumn /> if and only if neither done nor full', () =>
    fc.assert(
      fc.property(gridArb, playerArb, fc.boolean(), (grid, currentPlayer, done) => {
        const mockPlayAtFn = jest.fn();
        const wrapper = shallow(<Board grid={grid} currentPlayer={currentPlayer} done={done} playAt={mockPlayAtFn} />);
        const allColumns = wrapper.find(BoardColumn).getElements();
        for (let idx = 0; idx !== allColumns.length; ++idx) {
          const col = allColumns[idx];
          const isFullColumn = grid[0][idx] !== Player.None;
          expect((col.props as any).playable).toBe(!done && !isFullColumn);
        }
      })
    ));
});
