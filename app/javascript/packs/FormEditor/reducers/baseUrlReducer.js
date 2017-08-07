import { handleAction } from 'redux-actions';
import actions from '../actions';

export default handleAction(
  actions.setBaseUrl,
  (state, action) => action.payload.baseUrl,
  null,
);
