import { createStore } from 'redux';
import rootReducer from './reducers';
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';

export default createStore(rootReducer, devToolsEnhancer({}));
