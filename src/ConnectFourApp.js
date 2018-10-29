import React, { Component } from 'react';
import './ConnectFourApp.css';

import Board from './components/Board';
import Controls from './components/Controls';

const ConnectFourHeight = 6;
const ConnectFourWidth = 7;

class ConnectFourApp extends Component {
  render() {
    return (
      <div className="connect-four-app">
        <Board height={ConnectFourHeight} width={ConnectFourWidth} />
        <Controls />
      </div>
    );
  }
}

export default ConnectFourApp;
