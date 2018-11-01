import React from 'react';

import './BoardCell.css';
import { Player } from '../models/player';

interface Props {
  player: Player;
}
type State = {};

class BoardCell extends React.Component<Props, State> {
  render() {
    return <div className={`board-cell player-${this.props.player}`} />;
  }
}

export default BoardCell;
