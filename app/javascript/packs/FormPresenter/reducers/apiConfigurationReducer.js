import { handleAction } from 'redux-actions';
import actions from '../actions';

export default handleAction(
  actions.setApiConfiguration,
  (state, action) => action.payload.apiConfiguration,
  {},
);
