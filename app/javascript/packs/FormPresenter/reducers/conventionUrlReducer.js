import { handleAction } from 'redux-actions';
import actions from '../actions';

export default handleAction(
  actions.setConventionUrl,
  (state, action) => action.payload.conventionUrl,
  null,
);
