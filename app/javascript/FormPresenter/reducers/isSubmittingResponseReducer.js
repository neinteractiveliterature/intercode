import { handleActions } from 'redux-actions';
import actions from '../actions';

export default handleActions(
  {
    [actions.submitForm.START]: () => true,
    [actions.submitForm.FAILED]: () => false,
  },
  false,
);
