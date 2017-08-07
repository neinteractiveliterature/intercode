import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import conventionReducer from './conventionReducer';
import conventionUrlReducer from './conventionUrlReducer';
import formReducer from './formReducer';
import formUrlReducer from './formUrlReducer';
import sectionTraversalReducer from './sectionTraversalReducer';

export default reduceReducers(
  combineReducers({
    currentSectionId: currentSectionId => (currentSectionId || null),
    convention: conventionReducer,
    conventionUrl: conventionUrlReducer,
    form: formReducer,
    formUrl: formUrlReducer,
  }),

  sectionTraversalReducer,
);
