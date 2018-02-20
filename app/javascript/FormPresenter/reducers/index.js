import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import interactedItemsReducer from './interactedItemsReducer';
import sectionTraversalReducer from './sectionTraversalReducer';

export default reduceReducers(
  combineReducers({
    currentSectionId: currentSectionId => (currentSectionId || null),
    interactedItems: interactedItemsReducer,
  }),

  sectionTraversalReducer,
);
