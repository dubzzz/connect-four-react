import React, { Component } from 'react';
import './ConnectFourApp.css';

import Board from './components/Board';
import Controls from './components/Controls';

class ConnectFourApp extends Component {
  render() {
    return (
      <div className="connect-four-app">
        <Board />
        <Controls />
      </div>
    );
  }
}

export default ConnectFourApp;
