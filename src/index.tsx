import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './redux/store';

import './index.css';
import ConnectFourApp from './ConnectFourApp';

import { HashRouter as Router, Route } from 'react-router-dom';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path="/:state?" component={ConnectFourApp} />
    </Router>
  </Provider>,
  rootElement
);
