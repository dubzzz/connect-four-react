import React from 'react';

import './BoardColumn.css';
import { Player } from '../redux/models/player';
import BoardCell from './BoardCell';

interface Props {
  onClick?: () => void;
  playable: boolean;
  tokens: Player[];
}
type State = {};

class BoardColumn extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className={`board-column ${this.props.playable ? 'playable' : 'not-playable'}`} onClick={this.props.onClick}>
        {this.props.tokens.map(cell => (
          <BoardCell player={cell} />
        ))}
      </div>
    );
  }
}

export default BoardColumn;
