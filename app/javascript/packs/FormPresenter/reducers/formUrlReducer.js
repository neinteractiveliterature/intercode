import { handleAction } from 'redux-actions';
import actions from '../actions';

export default handleAction(
  actions.setFormUrl,
  (state, action) => {
    return action.payload.formUrl;
  },
  null,
);