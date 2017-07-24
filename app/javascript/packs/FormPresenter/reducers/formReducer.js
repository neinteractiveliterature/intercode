import { handleAction } from 'redux-actions';
import actions from '../actions';
import Form from '../../Models/Form';

export default handleAction(
  actions.fetchFormContent.SUCCEEDED,
  (state, action) => {
    return Form.fromApiResponse(action.payload.body);
  },
  null,
);