import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Redirect, withRouter } from 'react-router-dom';
import { Dispatch, Action, bindActionCreators } from 'redux';
import { ReduxState } from '../redux/reducers';
import { replayAll } from '../redux/actions';

interface Props extends StateProps, DispatchProps, RouterProps {}
type State = { overridePath?: string; readStateFromUrl: boolean };

export class RouteTracker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { readStateFromUrl: false };
  }
  private static parseState(serializedState: string): number[] {
    return serializedState
      .substring(1)
      .split('')
      .map(k => +k)
      .reverse();
  }
  private static serializeState(props: Props): string {
    return '/' + props.connectFour.history.past.join('');
  }
  componentDidMount() {
    if (this.props.location.pathname) {
      this.props.replayAll(RouteTracker.parseState(this.props.location.pathname));
      this.setState({ readStateFromUrl: true });
    } else {
      this.setState({ overridePath: RouteTracker.serializeState(this.props), readStateFromUrl: false });
    }
  }
  componentDidUpdate(prevProps: Props) {
    const prevSerializedState = RouteTracker.serializeState(prevProps);
    const serializedState = RouteTracker.serializeState(this.props);

    // State updated
    if (prevSerializedState !== serializedState) {
      if (this.state.readStateFromUrl) {
        // do not force url override if the change was request through an url change
        this.setState({ readStateFromUrl: false });
      } else {
        this.setState({ overridePath: serializedState, readStateFromUrl: false });
      }
    }
    // Url updated
    else if (
      prevProps.location.pathname !== this.props.location.pathname &&
      this.props.location.pathname !== serializedState
    ) {
      this.props.replayAll(RouteTracker.parseState(this.props.location.pathname));
      this.setState({ readStateFromUrl: true });
    }
  }
  render() {
    if (this.state.overridePath == null || this.state.overridePath === this.props.location.pathname) {
      return <Fragment />;
    }
    return <Redirect to={this.state.overridePath} />;
  }
}

const mapStateToProps = (state: ReduxState) => state;
type StateProps = ReturnType<typeof mapStateToProps>;

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return { ...bindActionCreators({ replayAll }, dispatch) };
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

type RouterProps = {
  history: {
    push: (location: string) => void;
  };
  location: { pathname: string };
  match: { params: { state?: string } };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteTracker) as any) as any;
