import { handleActions } from 'redux-actions';
import actions from '../actions';

export default handleActions(
  {
    [actions.updateRequestStarted]: (state, action) => action.payload.promise,
    [actions.updateResponse.ENDED]: () => null,
  },
  null,
);
