import React from 'react';
import { connect } from 'react-redux';

import './Instructions.css';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { ReduxState } from '../redux/reducers';
import { Player } from '../models/player';

interface Props extends StateProps, DispatchProps {}
type State = {};

class Instructions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    switch (this.props.winner) {
      case Player.PlayerA:
        return <div className="instructions victory player-1">Player #1 won</div>;
      case Player.PlayerB:
        return <div className="instructions victory player-2">Player #2 won</div>;
      case Player.None: {
        switch (this.props.currentPlayer) {
          case Player.PlayerA:
            return <div className="instructions player-1">Player #1 turn</div>;
          case Player.PlayerB:
            return <div className="instructions player-2">Player #2 turn</div>;
        }
      }
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
