import React from 'react';
import { connect, MapDispatchToPropsFactory } from 'react-redux';
import { playAt } from '../redux/actions';

import './Board.css';
import { ReduxState } from '../redux/reducers';
import { Dispatch, bindActionCreators, Action } from 'redux';
import { Player } from '../redux/models/player';

interface Props extends StateProps, DispatchProps {}
type State = {};

class Board extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  handlePlayAt(columnIdx: number) {
    this.props.playAt(columnIdx);
  }

  render() {
    const gridContent = [];
    for (let col = 0; col !== this.props.grid[0].length; ++col) {
      const playableColumn = this.props.grid[0][col] === Player.None && !this.props.done;
      gridContent.push(
        <div className="board-column">
          {this.props.grid.map(boardRow => {
            const cell = boardRow[col];
            const className = `board-cell player-${cell} ${playableColumn ? 'playable' : 'not-playable'}`;
            return <div className={className} onClick={playableColumn ? () => this.handlePlayAt(col) : undefined} />;
          })}
        </div>
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
