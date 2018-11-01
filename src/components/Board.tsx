import React from 'react';
import { connect } from 'react-redux';
import { playAt } from '../redux/actions';

import './Board.css';
import { ReduxState } from '../redux/reducers';
import { Dispatch, bindActionCreators, Action } from 'redux';
import { Player } from '../models/player';
import BoardColumn from './BoardColumn';

interface Props extends StateProps, DispatchProps {}
type State = {};

export class Board extends React.Component<Props, State> {
  render() {
    const gridContent = [];
    for (let col = 0; col !== this.props.grid[0].length; ++col) {
      const playableColumn = this.props.grid[0][col] === Player.None && !this.props.done;
      const tokens = this.props.grid.map(boardRow => boardRow[col]);
      gridContent.push(
        <BoardColumn
          key={col}
          playable={playableColumn}
          tokens={tokens}
          onClick={playableColumn ? () => this.props.playAt(col) : undefined}
        />
      );
    }
    return <div className={'board player-' + this.props.currentPlayer}>{gridContent}</div>;
  }
}

function mapStateToProps(state: ReduxState) {
  return {
    grid: state.connectFour.grid,
    currentPlayer: state.connectFour.currentPlayer,
    done: state.connectFour.winner !== Player.None
  };
}
type StateProps = ReturnType<typeof mapStateToProps>;

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return { ...bindActionCreators({ playAt }, dispatch) };
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
