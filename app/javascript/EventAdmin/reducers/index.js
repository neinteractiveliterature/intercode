import { combineReducers } from 'redux';
import editingRunReducer from './editingRunReducer';

export default combineReducers({
  editingRun: editingRunReducer,
});
