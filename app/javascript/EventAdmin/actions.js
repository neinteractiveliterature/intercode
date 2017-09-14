import { createAction, createActions } from 'redux-actions';

const actions = {
  ...createActions({
    NEW_RUN: event => ({ event }),
    EDIT_RUN: (event, run) => ({ event, run }),
    CANCEL_EDITING_RUN: () => ({}),
    DELETE_EDITING_RUN: () => ({}),
    EDITING_RUN_FIELD_CHANGED: (field, value) => ({ field, value }),
  }),

  saveEditingRun: {
    START: createAction('SAVE_EDITING_RUN/START'),
    SUCCEEDED: createAction('SAVE_EDITING_RUN/SUCCEEDED', run => run),
    FAILED: createAction('SAVE_EDITING_RUN/FAILED', error => error),
  },
};

export default actions;
