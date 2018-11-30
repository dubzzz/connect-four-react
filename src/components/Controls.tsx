import React from 'react';
import { connect } from 'react-redux';
import { newGame } from '../redux/actions';

import './Controls.css';
import { bindActionCreators, Dispatch, Action } from 'redux';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Button from '@material-ui/core/Button';

interface Props extends StateProps, DispatchProps {}
type State = {};

class Controls extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <Button id="new-game-button" variant="contained" onClick={() => this.props.newGame()}>
          New Game <NoteAddIcon />
        </Button>
      </div>
    );
  }
}

type StateProps = {};

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return { ...bindActionCreators({ newGame }, dispatch) };
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(
  null,
  mapDispatchToProps
)(Controls);
