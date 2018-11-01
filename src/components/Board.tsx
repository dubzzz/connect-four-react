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
            let className = 'board-cell';
            switch (cell) {
              case Player.PlayerA:
                className += ' player-1';
                break;
              case Player.PlayerB:
                className += ' player-2';
                break;
            }
            className += playableColumn ? ' playable' : ' not-playable';
            return <div className={className} onClick={playableColumn ? () => this.handlePlayAt(col) : undefined} />;
          })}
        </div>
      );
    }
    /*const gridContent = this.props.grid.map(boardRow => (
      <div className="board-row">
        {boardRow.map((v, idx) => {
          let className = 'board-cell';
          switch (v) {
            case Player.PlayerA:
              className += ' player-1';
              break;
            case Player.PlayerB:
              className += ' player-2';
              break;
          }
          const playable = this.props.grid[0][idx] === Player.None && !this.props.done;
          className += playable ? ' playable' : ' not-playable';
          return <div className={className} onClick={playable ? () => this.handlePlayAt(idx) : undefined} />;
        })}
      </div>
    ));*/
    return <div className="board">{gridContent}</div>;
  }
}

function mapStateToProps(state: ReduxState) {
  return { grid: state.connectFour.grid, done: state.connectFour.winner !== Player.None };
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
