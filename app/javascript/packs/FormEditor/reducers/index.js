import { combineReducers } from 'redux';
import baseUrlReducer from './baseUrlReducer';
import formReducer from './formReducer';

export default combineReducers({
  baseUrlReducer,
  formReducer,
});
