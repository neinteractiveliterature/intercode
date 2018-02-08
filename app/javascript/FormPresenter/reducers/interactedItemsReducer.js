import { handleAction } from 'redux-actions';
import actions from '../actions';

export default handleAction(
  actions.interactedWithItem,
  (state, action) => ({ ...state, [action.payload.itemIdentifier]: true }),
  {},
);
