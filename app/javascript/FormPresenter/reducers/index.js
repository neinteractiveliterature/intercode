import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import apiConfigurationReducer from './apiConfigurationReducer';
import conventionReducer from './conventionReducer';
import errorsReducer from './errorsReducer';
import formReducer from './formReducer';
import interactedItemsReducer from './interactedItemsReducer';
import isSubmittingResponseReducer from './isSubmittingResponseReducer';
import isUpdatingResponseReducer from './isUpdatingResponseReducer';
import responseReducer from './responseReducer';
import sectionTraversalReducer from './sectionTraversalReducer';
import updatePromiseReducer from './updatePromiseReducer';

export default reduceReducers(
  combineReducers({
    apiConfiguration: apiConfigurationReducer,
    currentSectionId: currentSectionId => (currentSectionId || null),
    convention: conventionReducer,
    errors: errorsReducer,
    form: formReducer,
    interactedItems: interactedItemsReducer,
    isSubmittingResponse: isSubmittingResponseReducer,
    isUpdatingResponse: isUpdatingResponseReducer,
    response: responseReducer,
    updatePromise: updatePromiseReducer,
  }),

  sectionTraversalReducer,
);
