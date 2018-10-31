import { combineReducers, Reducer } from 'redux';
import connectFour from './connectFour';

const combined = combineReducers({ connectFour });
export default combined;
export type ReduxState = (typeof combined) extends Reducer<(infer U)> ? U : never;
