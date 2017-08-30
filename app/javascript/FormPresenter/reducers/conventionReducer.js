import { handleAction } from 'redux-actions';
import actions from '../actions';

export default handleAction(
  actions.fetchConvention.SUCCEEDED,
  (state, action) => action.payload.body,
  null,
);
