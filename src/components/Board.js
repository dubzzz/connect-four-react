import React from 'react';
import { connect } from 'react-redux';
import { playAt } from '../redux/actions';

import './Board.css';

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  handlePlayAt(columnIdx) {
    this.props.playAt(columnIdx);
  }

  render() {
    const gridContent = this.props.grid.map(boardRow => (
      <div className="board-row">
        {boardRow.map((v, idx) => (
          <div className="board-cell" onClick={() => this.handlePlayAt(idx)}>
            {v}
          </div>
        ))}
      </div>
    ));
    return <div className="grid">{gridContent}</div>;
  }
}

function mapStateToProps(state) {
  return { grid: state.connectFour.grid };
}

export default connect(
  mapStateToProps,
  { playAt }
)(Board);
