import React from 'react';
import { connect } from 'react-redux';

import './Board.css';

const Player = {
  None: null,
  PlayerA: 'O',
  PlayerB: 'X'
};

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { grid: this.emptyGrid() };
  }

  emptyGrid = () => {
    return [...Array(this.props.height)].map(_ => [...Array(this.props.width).map(_ => Player.None)]);
  };

  render() {
    return <div />;
  }
}

export default connect(
  null,
  {}
)(Board);
