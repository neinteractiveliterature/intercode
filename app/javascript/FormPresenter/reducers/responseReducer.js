import { handleActions } from 'redux-actions';
import actions from '../actions';

export default handleActions(
  {
    [actions.fetchResponse.SUCCEEDED]: (state, action) => action.payload.body,
    [actions.responseValueChanged]: (state, action) => ({
      ...state,
      [action.payload.field]: action.payload.value,
    }),
  },
  null,
);
