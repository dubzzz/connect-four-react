import React from 'react';
import { connect } from 'react-redux';
import { newGame, cancelMove, redoMove } from '../redux/actions';

import './Controls.css';
import { bindActionCreators, Dispatch, Action } from 'redux';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Button from '@material-ui/core/Button';
import { ReduxState } from '../redux/reducers';

interface Props extends StateProps, DispatchProps {}
type State = {};

class Controls extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <Button
          id="back-button"
          variant="contained"
          onClick={() => this.props.cancelMove()}
          disabled={!this.props.canUndo}
        >
          <ArrowBackIcon />
        </Button>
        <Button id="new-game-button" variant="contained" onClick={() => this.props.newGame()}>
          New Game <NoteAddIcon />
        </Button>
        <Button
          id="forward-button"
          variant="contained"
          onClick={() => this.props.redoMove()}
          disabled={!this.props.canRedo}
        >
          <ArrowForwardIcon />
        </Button>
      </div>
    );
  }
}

function mapStateToProps(state: ReduxState) {
  return {
    canUndo: state.connectFour.history.past.length > 0,
    canRedo: state.connectFour.history.future.length > 0
  };
}
type StateProps = ReturnType<typeof mapStateToProps>;

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return { ...bindActionCreators({ newGame, cancelMove, redoMove }, dispatch) };
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls);
