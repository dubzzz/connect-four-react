import React from 'react';
import { connect } from 'react-redux';

import './Instructions.css';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { ReduxState } from '../redux/reducers';
import { Player } from '../models/player';

interface Props extends StateProps, DispatchProps {}
type State = {};

class Instructions extends React.Component<Props, State> {
  render() {
    const { winner, currentPlayer } = this.props;
    if (winner !== Player.None) {
      return <div className={`instructions victory player-${winner}`}>Player #{winner} won</div>;
    } else {
      return <div className={`instructions player-${currentPlayer}`}>Player #{currentPlayer} turn</div>;
    }
  }
}

function mapStateToProps(state: ReduxState) {
  return { currentPlayer: state.connectFour.currentPlayer, winner: state.connectFour.winner };
}
type StateProps = ReturnType<typeof mapStateToProps>;

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return { ...bindActionCreators({}, dispatch) };
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Instructions);
