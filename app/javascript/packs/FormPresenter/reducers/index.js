import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import authenticityTokenReducer from './authenticityTokenReducer';
import conventionReducer from './conventionReducer';
import conventionUrlReducer from './conventionUrlReducer';
import formReducer from './formReducer';
import formUrlReducer from './formUrlReducer';
import isUpdatingResponseReducer from './isUpdatingResponseReducer';
import responseReducer from './responseReducer';
import responseUrlReducer from './responseUrlReducer';
import sectionTraversalReducer from './sectionTraversalReducer';

export default reduceReducers(
  combineReducers({
    authenticityToken: authenticityTokenReducer,
    currentSectionId: currentSectionId => (currentSectionId || null),
    convention: conventionReducer,
    conventionUrl: conventionUrlReducer,
    form: formReducer,
    formUrl: formUrlReducer,
    isUpdatingResponse: isUpdatingResponseReducer,
    response: responseReducer,
    responseUrl: responseUrlReducer,
  }),

  sectionTraversalReducer,
);
