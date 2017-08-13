import { handleAction } from 'redux-actions';
import actions from '../actions';

export default handleAction(
  actions.setResponseUrl,
  (state, action) => action.payload.responseUrl,
  null,
);
