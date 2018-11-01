import React from 'react';

import './BoardColumn.css';
import { Player } from '../models/player';
import BoardCell from './BoardCell';

interface Props {
  onClick?: () => void;
  playable: boolean;
  tokens: Player[];
}
type State = {};

class BoardColumn extends React.Component<Props, State> {
  render() {
    return (
      <div className={`board-column ${this.props.playable ? 'playable' : 'not-playable'}`} onClick={this.props.onClick}>
        {this.props.tokens.map((cell, idx) => (
          <BoardCell key={idx} player={cell} />
        ))}
      </div>
    );
  }
}

export default BoardColumn;
