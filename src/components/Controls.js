import React from 'react';
import { connect } from 'react-redux';
import { newGame } from '../redux/actions';

import './Controls.css';

class Controls extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <button onClick={() => this.props.newGame()}>New Game</button>
      </div>
    );
  }
}

export default connect(
  null,
  { newGame }
)(Controls);
