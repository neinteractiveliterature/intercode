import { handleActions } from 'redux-actions';
import actions from '../actions';

export default handleActions(
  {
    [actions.updateResponse.FAILED]: (state, action) => action.payload.response.body.errors,
    [actions.updateResponse.SUCCEEDED]: () => ({}),
  },
  false,
);
