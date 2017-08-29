import { handleActions } from 'redux-actions';
import actions from '../actions';

export default handleActions(
  {
    [actions.submitForm.START]: () => true,
    [actions.submitForm.ENDED]: () => false,
    [actions.updateResponse.START]: () => true,
    [actions.updateResponse.ENDED]: () => false,
  },
  false,
);
