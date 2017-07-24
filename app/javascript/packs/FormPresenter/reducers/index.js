import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import formReducer from './formReducer';
import formUrlReducer from './formUrlReducer';
import sectionTraversalReducer from './sectionTraversalReducer';

export default reduceReducers(
  combineReducers({
    form: formReducer,
    formUrl: formUrlReducer,
  }),

  sectionTraversalReducer,
);
