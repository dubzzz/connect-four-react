import './RouteTracker.css';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Redirect, withRouter } from 'react-router-dom';
import { Dispatch, Action, bindActionCreators } from 'redux';
import { ReduxState } from '../redux/reducers';
import { replayAll } from '../redux/actions';
import { Player } from '../models/player';

enum OnGoingWorkType {
  None = 'None',
  Game = 'Game',
  Manual = 'Manual'
}

interface Props extends StateProps, DispatchProps, RouterProps {}
type State =
  | { onGoingWork: OnGoingWorkType.None }
  | { onGoingWork: OnGoingWorkType.Game; redirectUrl: string }
  | { onGoingWork: OnGoingWorkType.Manual; redirectUrl: string };

export class RouteTracker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { onGoingWork: OnGoingWorkType.None };
  }
  private static parseState(serializedState: string): { columns: number[] } {
    const b64ToInt = (b64Char: string): number => {
      if ('A' <= b64Char && b64Char <= 'Z') return b64Char.charCodeAt(0) - 'A'.charCodeAt(0);
      if ('a' <= b64Char && b64Char <= 'z') return b64Char.charCodeAt(0) - 'a'.charCodeAt(0) + 26;
      if ('0' <= b64Char && b64Char <= '9') return b64Char.charCodeAt(0) - '0'.charCodeAt(0) + 52;
      return b64Char === '+' ? 62 : 63;
    };
    const columns = serializedState
      .substring(1)
      .split('')
      .reduce((prev: number[], cur) => {
        const v = b64ToInt(cur);
        if (v < 8) {
          prev.push(v - 1);
          console.log(JSON.stringify(prev));
        } else {
          prev.push(Math.floor(v / 8) - 1);
          prev.push((v % 8) - 1);
          console.log(JSON.stringify(prev));
        }
        return prev;
      }, [])
      .reverse();
    return { columns };
  }
  private static serializeState(past: number[]): string {
    const b64 = past
      .reduce((prev: number[], pos) => {
        if (prev[prev.length - 1] < 8) {
          prev[prev.length - 1] *= 8;
          prev[prev.length - 1] += pos + 1;
        } else {
          prev.push(pos + 1);
        }
        return prev;
      }, [])
      .map(v => {
        if (v < 26) return String.fromCodePoint(v + 65); // A-Z
        if (v < 52) return String.fromCodePoint(v + 97 - 26); // a-z
        if (v < 62) return String.fromCodePoint(v + 48 - 52); // 0-9
        return v === 62 ? '+' : '/';
      });
    return '/' + b64.join('');
  }
  private static serializeStateFromParsed(parsedOutput: { columns: number[] }): string {
    return this.serializeState(parsedOutput.columns.reverse());
  }
  private static serializeStateFromProps(props: Props): string {
    return this.serializeState(props.connectFour.history.past);
  }
  componentDidMount() {
    // Custom location
    const serializedState = RouteTracker.serializeStateFromProps(this.props);
    if (this.props.location.pathname !== serializedState) {
      const userState = RouteTracker.parseState(this.props.location.pathname);
      this.props.replayAll(userState.columns);
      this.setState({
        onGoingWork: OnGoingWorkType.Manual,
        redirectUrl: RouteTracker.serializeStateFromParsed(userState)
      });
      return;
    }
  }
  componentDidUpdate(prevProps: Props) {
    // Case #1: Ending a game update
    if (this.state.onGoingWork === OnGoingWorkType.Game) {
      if (this.props.location.pathname === this.state.redirectUrl) {
        this.setState({ onGoingWork: OnGoingWorkType.None });
      }
      return;
    }
    // Case #2: Ending a manual update
    if (this.state.onGoingWork === OnGoingWorkType.Manual) {
      const serializedState = RouteTracker.serializeStateFromProps(this.props);
      if (this.props.location.pathname === this.state.redirectUrl && this.state.redirectUrl === serializedState) {
        this.setState({ onGoingWork: OnGoingWorkType.None });
      }
      return;
    }
    // Case #3: Game update
    // ________ Grid as been updated: location has to be updated
    const prevSerializedState = RouteTracker.serializeStateFromProps(prevProps);
    const serializedState = RouteTracker.serializeStateFromProps(this.props);
    if (serializedState !== prevSerializedState) {
      this.setState({ onGoingWork: OnGoingWorkType.Game, redirectUrl: serializedState });
      return;
    }
    // Case #4: Manual location update
    // ________ User manually changed the location: grid has to be updated
    if (this.props.location.pathname !== prevProps.location.pathname) {
      const userState = RouteTracker.parseState(this.props.location.pathname);
      this.props.replayAll(userState.columns);
      this.setState({
        onGoingWork: OnGoingWorkType.Manual,
        redirectUrl: RouteTracker.serializeStateFromParsed(userState)
      });
      return;
    }
  }
  render() {
    if (this.state.onGoingWork === OnGoingWorkType.None || this.state.redirectUrl === this.props.location.pathname) {
      return (
        <div className="url">
          <b>URL:</b> {this.props.location.pathname}
        </div>
      );
    }
    return <Redirect to={this.state.redirectUrl} />;
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
