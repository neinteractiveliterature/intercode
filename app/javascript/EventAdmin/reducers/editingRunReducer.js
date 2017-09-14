import { handleActions } from 'redux-actions';
import actions from '../actions';

export default handleActions(
  {
    [actions.newRun]: (state, action) => (
      {
        event: action.payload.event,
        run: {
          starts_at: null,
          title_suffix: null,
          schedule_note: null,
          rooms: [],
        },
      }
    ),
    [actions.editRun]: (state, action) => (
      { run: action.payload.run, event: action.payload.event }
    ),
    [actions.deleteEditingRun]: () => null,
    [actions.cancelEditingRun]: () => null,
    [actions.saveEditingRun.SUCCEEDED]: () => null,
    [actions.editingRunFieldChanged]: (state, action) => (
      { ...state, run: { ...state.run, [action.payload.field]: action.payload.value } }
    ),
  },
  null,
);
