import React from 'react';
import { connect } from 'react-redux';
import { newGame } from '../redux/actions';

import './Controls.css';
import { bindActionCreators, Dispatch, Action } from 'redux';

interface Props extends StateProps, DispatchProps {}
type State = {};

class Controls extends React.Component<Props, State> {
  constructor(props: Props) {
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

type StateProps = {};

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {...bindActionCreators({newGame}, dispatch)};
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(
  null,
  mapDispatchToProps
)(Controls);
