import { handleActions } from 'redux-actions';
import actions from '../actions';

export default handleActions(
  {
    [actions.updateResponse.START]: () => true,
    [actions.updateResponse.ENDED]: () => false,
  },
  false,
);
