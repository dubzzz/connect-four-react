import React from 'react';
import { connect, MapDispatchToPropsFactory } from 'react-redux';
import { playAt } from '../redux/actions';

import './Board.css';
import { ReduxState } from '../redux/reducers';
import { Dispatch, bindActionCreators, Action } from 'redux';

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

function mapStateToProps(state: ReduxState) {
  return { grid: state.connectFour.grid };
}
type StateProps = ReturnType<typeof mapStateToProps>;

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {...bindActionCreators({playAt}, dispatch)};
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
