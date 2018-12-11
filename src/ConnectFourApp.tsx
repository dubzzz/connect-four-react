import React, { Component } from 'react';
import './ConnectFourApp.css';

import Board from './components/Board';
import Controls from './components/Controls';
import Instructions from './components/Instructions';
import RouteTracker from './components/RouteTracker';

class ConnectFourApp extends Component {
  render() {
    return (
      <div className="connect-four-app">
        <RouteTracker />
        <Instructions />
        <Board />
        <Controls />
      </div>
    );
  }
}

export default ConnectFourApp;
