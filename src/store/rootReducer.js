import { combineReducers } from 'redux';

import terminalReducer from '../reducers/terminalReducer';

export default combineReducers({
  terminal: terminalReducer,  
});