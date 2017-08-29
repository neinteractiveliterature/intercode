import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import apiConfigurationReducer from './apiConfigurationReducer';
import conventionReducer from './conventionReducer';
import formReducer from './formReducer';
import isUpdatingResponseReducer from './isUpdatingResponseReducer';
import responseReducer from './responseReducer';
import sectionTraversalReducer from './sectionTraversalReducer';

export default reduceReducers(
  combineReducers({
    apiConfiguration: apiConfigurationReducer,
    currentSectionId: currentSectionId => (currentSectionId || null),
    convention: conventionReducer,
    form: formReducer,
    isUpdatingResponse: isUpdatingResponseReducer,
    response: responseReducer,
  }),

  sectionTraversalReducer,
);
