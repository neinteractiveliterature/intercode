import { combineReducers } from 'redux';
import editingRunReducer from './editingRunReducer';

function buildReducer(client) {
  return combineReducers({
    editingRun: editingRunReducer,
    apollo: client.reducer(),
  });
}

export default buildReducer;
