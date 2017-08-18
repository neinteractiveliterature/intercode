import { handleAction } from 'redux-actions';
import actions from '../actions';

export default handleAction(
  actions.setAuthenticityToken,
  (state, action) => action.payload.authenticityToken,
  null,
);
