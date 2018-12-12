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
  private static parseState(serializedState: string): { columns: number[]; initialPlayer: Player } {
    const initialPlayer = serializedState[1] === '2' ? Player.PlayerB : Player.PlayerA;
    const columns = serializedState
      .substring(2)
      .split('')
      .map(k => +k)
      .reverse();
    return { initialPlayer, columns };
  }
  private static serializeState(initialPlayer: Player, past: number[]): string {
    return '/' + initialPlayer + past.join('');
  }
  private static serializeStateFromParsed(parsedOutput: { columns: number[]; initialPlayer: Player }): string {
    return this.serializeState(parsedOutput.initialPlayer, parsedOutput.columns.reverse());
  }
  private static serializeStateFromProps(props: Props): string {
    const currentPlayer = props.connectFour.currentPlayer;
    const nextPlayer = currentPlayer === Player.PlayerA ? Player.PlayerB : Player.PlayerA;
    const initialPlayer = props.connectFour.history.past.length % 2 === 0 ? currentPlayer : nextPlayer;
    return this.serializeState(initialPlayer, props.connectFour.history.past);
  }
  componentDidMount() {
    // Custom location
    const serializedState = RouteTracker.serializeStateFromProps(this.props);
    if (this.props.location.pathname !== serializedState) {
      const userState = RouteTracker.parseState(this.props.location.pathname);
      this.props.replayAll(userState.columns, userState.initialPlayer);
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
      this.props.replayAll(userState.columns, userState.initialPlayer);
      this.setState({
        onGoingWork: OnGoingWorkType.Manual,
        redirectUrl: RouteTracker.serializeStateFromParsed(userState)
      });
      return;
    }
  }
  render() {
    if (this.state.onGoingWork === OnGoingWorkType.None || this.state.redirectUrl === this.props.location.pathname) {
      return <Fragment />;
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
