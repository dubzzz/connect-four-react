import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './redux/store';

import './index.css';
import ConnectFourApp from './ConnectFourApp';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <ConnectFourApp />
  </Provider>,
  rootElement
);
