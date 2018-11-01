import React from 'react';
import { shallow } from 'enzyme';

import fc from 'fast-check';
import { playerOrNoneArb } from '../test-arbitraries/player';
import BoardColumn from './BoardColumn';
import BoardCell from './BoardCell';

describe('<BoardColumn />', () => {
  it('Should render the right number of <BoardCell />', () =>
    fc.assert(
      fc.property(fc.array(playerOrNoneArb, 50), fc.boolean(), (tokens, playable) => {
        const wrapper = shallow(<BoardColumn tokens={tokens} playable={playable} />);
        expect(wrapper.find(BoardCell)).toHaveLength(tokens.length);
      })
    ));
  it('Should call onClick if and only if playable', () =>
    fc.assert(
      fc.property(fc.array(playerOrNoneArb, 50), fc.boolean(), (tokens, playable) => {
        const mockOnClickFn = jest.fn();
        const wrapper = shallow(<BoardColumn tokens={tokens} playable={playable} onClick={mockOnClickFn} />);
        wrapper.simulate('click');
        expect(mockOnClickFn.mock.calls.length).toBe(playable ? 1 : 0);
      })
    ));
});
